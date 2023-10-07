import numpy as np
import pandas as pd
from PIL import Image
import os
import faiss
import io
import uvicorn
from fastapi import FastAPI, File, UploadFile
import json
import sys
import math
sys.path.append("web_backend")
from search import *
from utils import *
# from ocr import *
from typing import Optional, List, Dict
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from constant import *
import math
from caption import *
from translation_vin import *
import cv2 as cv
from deep_translator import GoogleTranslator
from typing import Annotated
from get_sessionid import *
import requests
from es import *

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# translation vin
# tokenizer_vi2en = AutoTokenizer.from_pretrained("vinai/vinai-translate-vi2en", src_lang="vi_VN")
# model_vi2en = AutoModelForSeq2SeqLM.from_pretrained("vinai/vinai-translate-vi2en")


f = open(f'{source}/captions.json', encoding="utf8")
caption = json.load(f)
f.close()
#OCR
infos = get_all_ocr_infos(f"{source}/OCR.csv")
#Caption
f = open(f'{source}/captions.json', encoding="utf8")
caption = json.load(f)
f.close()

#CLIP feature
image_clipfeatures = np.load(f"{source}/clip_embeddings.npy")
#Faiss index
faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
#Image index
image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "url": "string"})
info_ids = list(zip(image_ids["video"], image_ids["frameid"]))

@app.get('/')
async def introduce():
    return {"AI CHALLENGE HCM 2023": "HAIDIKICHI"}

@app.get('/search')
async def get_frame_from_query(query: Optional[str] = None, topk: Optional[int] = 100, 
                               ocrquery: Optional[str] = None, ocrthresh: Optional[float] = 0.8, topk_o: Optional[int] = 100,
                               speakquery: Optional[str] = None, topk_s: Optional[int] = 100):
    if not query: query = None
    if not ocrquery: ocrquery = None
    if not speakquery: speakquery = None

    if not query and ocrquery:
        results = []
        results = search_ocr(ocrquery, image_ids, ocrthresh, topk_s, index_name="ocr", mode="all")
    if query and not ocrquery:
        results = []
        results = search_vector(image_ids, faiss_index= faiss_index, topk= topk, query= query)
    if query and ocrquery:
        if not ocrthresh: 
            ocrthresh = 0.8
        candidates = []
        candidates = search_vector(image_ids, faiss_index= faiss_index, topk= max(topk, topk_o), query= query)
        results = search_ocr(ocrquery, candidates , ocrthresh, topk_s, index_name="ocr", mode="combine")
    flag = False
    if query or ocrquery:
        flag = True

    if flag  == False and speakquery:
        candiates = list(image_ids['video'])
        results = find_text(caption, speakquery, candiates, topk_s, "all")
    elif flag and speakquery:
        results = find_text(caption, speakquery, results, topk_s, "res")
    return JSONResponse({"data": results})

@app.get('/get_metadata')
async def get_metadata(video: str, frameid: str):
    url = image_ids['url'][info_ids.index((video, frameid))]
    return JSONResponse({"url": url })

@app.get("/get_near")
async def get_frame_near(video: str, frameid: str):
    idx = info_ids.index((video, frameid))
    frameNear = [video + '_' + image_ids['frameid'][idx]]
    for i in range(1, 11):
        if image_ids['video'][idx + i] == video:
            frameNear.append(video + '_' + image_ids['frameid'][idx + i])
        if idx > i and image_ids['video'][idx - i] == video:
            frameNear.append(video + '_' + image_ids['frameid'][idx - i])
        if(len(frameNear) >= 11): break
    frameNear.sort(key = lambda x: int(x[9:]))
    return JSONResponse({'data': frameNear})

@app.get("/get_similarity")
async def get_similarity(video: str, frameid: str, topk: Optional[int] = 100):
    results = get_frame_similarity(image_ids, info_ids, video, frameid, faiss_index, image_clipfeatures, topk)
    return {"data": results}   

class resultsConfig(BaseModel):
    data: List[str]


@app.post("/submissions_b1")
async def get_submission(results: resultsConfig):
    if len(results.data) == 0:
        return JSONResponse({"data": []})
    topk = round(100 / (2 * len(list(results.data)))) - 1
    map_results = []
    for res_id in results.data:
        video = res_id[:8]
        frameid = res_id[9:]
        map_results.append(video + '_'+ str(id))
    
    for res_id in map_results:
        video = res_id[:8]
        id = res_id[9:]
        temp = []
        for i in range(1, topk):
            temp.append(video + '_' + str(int(id) + i*10))
            if int(id) > i*12:
                temp.append(video + '_' + str(int(id) - i*10))
        if temp:
            for i in temp: 
                if i not in map_results:
                    map_results.append(i)
                if len(map_results) >= 100:
                    return JSONResponse({"data": map_results[:101]})
    
    return JSONResponse({"data": map_results})

@app.get("/translations")
async def get_trans(vi_query: Optional[str] = None):
    en_query = GoogleTranslator(source='auto', target='en').translate(vi_query)

    return JSONResponse({"trans_en": en_query})   

@app.get("/get_image")
async def get_image(video: str, frameid: str, width: Optional[int] = 144, height: Optional[int] = 81, mode= "origin"):
    file_path = os.path.join(f"{source}/keyframes", video[:3], video, frameid + ".jpg")
    if os.path.exists(file_path):
        image = Image.open(file_path)
        if mode == "thumbnail":
            image.thumbnail((width, height))
        imgio = io.BytesIO()
        image.save(imgio, 'JPEG')
        imgio.seek(0)
        return StreamingResponse(content = imgio, media_type="image/jpeg")
    return {"error": "File does not exist"}

@app.get("/get_sessionId")
async def get_sessionId():
    sessionId = get_sessionId("haidikichi", "Cheecea0")
    return JSONResponse({"session_id": sessionId})

@app.get("/submission_final")
async def submission_final(video: str, frame_id: str, session_id: str):
    URL = f"https://eventretrieval.one/api/v1/submit?item={video}&frame={frame_id}&session={session_id}"
    r = requests.get(url=URL)
    data = r.text
    return JSONResponse(data)


@app.post("/search_image")
async def create_upload_file(file: UploadFile, topk: Optional[int] = 100):
    request_object_content = await file.read()
    image = Image.open(io.BytesIO(request_object_content))
    image.thumbnail((640, 360))
    results = search_image_vector(image_ids, image, faiss_index, topk)
    return JSONResponse({"results": results})


if __name__ == '__main__':
    uvicorn.run("app_fastapi:app", host="0.0.0.0", port=3000, reload=True)