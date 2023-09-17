import numpy as np
import pandas as pd
import clip
import torch
from PIL import Image
import os
import faiss
import csv
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
from typing import Optional, List
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from constant import *

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load ocr_infos, faiss_index, frame_index
infos = get_all_ocr_infos(f"{source}/OCR.csv")
faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})


@app.get('/')
async def introduce():
    return {"AI CHALLENGE HCM 2023": "HAIDIKICHI"}

@app.get('/search')
async def get_frame_from_query(query: Optional[str] = None, topk: Optional[int] = 100, 
                               before: Optional[str] = None, after: Optional[str] = None,
                               ocrquery: Optional[str] = None, ocrthresh: Optional[float] = 0.8,
                               object: Optional[str] = None, objectthresh: Optional[float] = 0.5):
    if not before: before = None
    if not after: after = None
    if not ocrquery: ocrquery = None
    if not object: object = None

    search_q = True
    if query == None and before == None and after == None:
        search_q = False

    if search_q == False and ocrquery:
        if not ocrthresh: 
            ocrthresh = 0.8
        results = search_ocr_all(ocrquery, infos, ocrthresh, topk)        
    elif search_q and not ocrquery:
        ids = []
        ids = full_search(faiss_index= faiss_index, topk= topk, query= query, before= before, after= after)
        results = get_vid_frameids(ids)
    else:
        if not ocrthresh: 
            ocrthresh = 0.8
        ids = []
        ids = full_search(faiss_index= faiss_index, topk= topk, query= query, before= before, after= after)
        candiates = get_vid_frameids(ids)
        results = search_ocr(ocrquery, candiates, infos, ocrthresh, topk)
    if object:
        if not objectthresh: 
            objectthresh = 0.5
        temp = []
        for res in results:
            video = res[:8]
            frameid = res[9:]
            if check_object(video, frameid, object, objectthresh):
                temp.append(video + '_' + frameid)
        results = temp
    return JSONResponse({"data": results})

@app.get('/get_metadata')
async def get_metadata(video: str):
    path = f"{source}/metadata/{video}.json"
    with open(path, "r") as jsonfile:
        metadata = json.load(jsonfile)
    if metadata:
        return {"url": metadata["watch_url"]}
    return {"error": "No youtube link"}


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

@app.post("/get_near/{video}/{frameid}")
async def get_frame_near(video: str, frameid: str):
    image_ids_l = list(zip(image_ids['video'], image_ids["frameid"]))
    
    img_idx = image_ids_l.index((video, frameid))
    frame_near = [img_idx]
    for i in range(1, 21):
        if image_ids['video'][img_idx + i] == video: 
            frame_near.append(img_idx + i)
        if img_idx > i:
            if image_ids['video'][img_idx - i] == video: 
                frame_near.append(img_idx - i)
        if(len(frame_near) >= 11): break
        
    results = get_vid_frameids(frame_near) 
    return JSONResponse({"data": results})

@app.get("/check_obj_det")
async def check_object_detection(video: str, frameid: str, cls: str, score: float):
    return {"check": check_object(video, frameid, cls, score)}

@app.get("/get_similarity")
async def get_similarity(video: str, frameid: str, topk: Optional[int] = 100):
    results = get_frame_similarity(video, frameid, topk)
    return {"data": results}

@app.get("/mapping")
async def get_mapping(video: str, frameid: str):
    map_table = pd.read_csv(f"{source}/map-keyframes/{video}.csv", dtype={"n": "int", "pts_time": "float", "fps": "float", "frame_idx": "int"})
    for id, frame_idx in zip(map_table['n'], map_table['frame_idx']):
        if id == int(frameid): 
            return frame_idx
    return {"error": "not exist"}

@app.post("/submissions")
async def get_submission(res_ids: List[str]):
    topk = math.floor(100/len(res_ids)) - 1
    final_results = list(res_ids)
    for res_id in res_ids:
        final_results.extend(get_frame_similarity(res_id[:8], res_id[9:], topk))
    return JSONResponse({"data": final_results})


if __name__ == '__main__':
    uvicorn.run("app_fastapi:app", host="127.0.0.1", port=3000, reload=True)