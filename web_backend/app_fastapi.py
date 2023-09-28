import numpy as np
import pandas as pd
from PIL import Image
import os
import faiss
import io
import uvicorn
from fastapi import FastAPI
import json
import sys
import math
sys.path.append("web_backend")
from search import *
from object_detection import *
from utils import *
from ocr import *
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

#OCR
infos = get_all_ocr_infos(f"{source}/OCR.csv")
#Caption
f = open(f'{source}/captions.json', encoding="utf8")
caption = json.load(f)
f.close()
#Faiss index
faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
#Image index
image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "mapping": "int", "pts_time": "float"})
info_ids = list(zip(image_ids["video"], image_ids["frameid"]))
#Remapping
reinfo_ids = list(zip(image_ids["video"], image_ids["mapping"]))
frame_idx = list(image_ids["frameid"])
#Mapping
map_idx = list(image_ids["mapping"])
#Pts time
pts_time = list(image_ids["pts_time"])

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
        results = search_ocr_all(ocrquery, infos, ocrthresh, topk_o)        
    if query and not ocrquery:
        results = []
        results = search_vector(image_ids, faiss_index= faiss_index, topk= topk, query= query)
    if query and ocrquery:
        if not ocrthresh: 
            ocrthresh = 0.8
        candiates = []
        candiates = search_vector(image_ids, faiss_index= faiss_index, topk= max(topk, topk_o), query= query)
        results = search_ocr(ocrquery, candiates, infos, ocrthresh, max(topk, topk_o))
    flag = False
    if query or ocrquery:
        flag = True

    if flag  == False and speakquery:
        candiates = get_vid_frameids(image_ids, list(range(max_size)))
        results = find_text(speakquery, candiates, topk_s, "all")
    elif flag and speakquery:
        results = find_text(speakquery, results, topk_s, "res")
    return JSONResponse({"data": results})

@app.get('/get_metadata')
async def get_metadata(video: str, frameid: str):
    path = f"{source}/metadata/{video}.json"
    with open(path, "r", encoding='utf-8', errors='ignore') as jsonfile:
        metadata = json.load(jsonfile)
    if metadata:
        pts_t = pts_time[info_ids.index((video, frameid))]
        return JSONResponse({"url": f"""{metadata["watch_url"].replace('watch?v=', 'embed/')}?start={round(pts_t)}&autoplay=0""" })
    return JSONResponse({"error": "No youtube link"})


@app.get('/get_image')
async def get_image(video: str, frameid: str):
    file_path = os.path.join(f"{source}/keyframes", video, frameid + ".jpg")
    image = Image.open(file_path)
    imgio = io.BytesIO()
    image.save(imgio, 'JPEG')
    imgio.seek(0)
    if os.path.exists(file_path):
        return StreamingResponse(content = imgio, media_type="image/jpeg")
    
    return {"error": "File does not exist"}

@app.get("/get_video/{video}")
async def get_frame_video(video: str):
    image_ids_l = list(zip(image_ids['video'], image_ids['frameid']))

    results = []
    for vid, fr in image_ids_l:
        if vid == video:
            results.append(vid + '_' + fr)

    return JSONResponse({'data': results})

@app.get("/get_near")
async def get_frame_near(video: str, frameid: str):
    idx = info_ids.index((video, frameid))
    frameNear = [idx]
    for i in range(1, 21):
        if image_ids['video'][idx + i] == video:
            frameNear.append(idx + i)
        if idx > i and image_ids['video'][idx - i] == video:
            frameNear.append(idx - i)
        if(len(frameNear) >= 11): break
    frameNear = sorted(frameNear)
    results = get_vid_frameids(image_ids, frameNear)
    return JSONResponse({'data': results})

@app.get("/check_obj_det")
async def check_object_detection(video: str, frameid: str, cls: str, score: float):
    return {"check": check_object(video, frameid, cls, score)}

@app.get("/get_similarity")
async def get_similarity(video: str, frameid: str, topk: Optional[int] = 100):
    results = get_frame_similarity(image_ids, video, frameid, topk)
    return {"data": results}   

class resultsConfig(BaseModel):
    data: List[str]

@app.post("/mapping")
async def get_mapping(results: resultsConfig):
    map_results = []
    for res_id in results.data:
        video = res_id[:8]
        frameid = res_id[9:]
        id = map_idx[info_ids.index((video, frameid))]
        map_results.append(video + '_'+ str(id))
    return JSONResponse({"data": map_results})

@app.post("/remapping")
async def get_remapping(results: resultsConfig):
    remap_results = []
    for res_id in results.data:
        video = res_id[:8]
        id = res_id[9:]
        frameid = frame_idx[reinfo_ids.index((video, id))]
        remap_results.append(video + '_'+ str(frameid))
    return JSONResponse({"data": remap_results})

@app.post("/submissions")
async def get_submission(results: resultsConfig):
    topk = round(100 / (2 * len(list(results.data)))) - 1
    map_results = []
    for res_id in results.data:
        video = res_id[:8]
        frameid = res_id[9:]
        id = map_idx[info_ids.index((video, frameid))]
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

@app.get("/get_thumbnail")
async def get_thumbnail(video: str, frameid: str, width: Optional[int] = 170, height: Optional[int] = 96):
    file_path = os.path.join(f"{source}/keyframes", video, frameid + ".jpg")
    if os.path.exists(file_path):
        image = Image.open(file_path)
        image.thumbnail((width, height))
        imgio = io.BytesIO()
        image.save(imgio, 'JPEG')
        imgio.seek(0)
        return StreamingResponse(content = imgio, media_type="image/jpeg")
    return {"error": "File does not exist"}

if __name__ == '__main__':
    uvicorn.run("app_fastapi:app", host="0.0.0.0", port=3000, reload=True)