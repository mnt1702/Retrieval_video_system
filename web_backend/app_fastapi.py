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
image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "mapping": "int", "pts_time": "float"})
info = list(zip(image_ids["video"], image_ids["frameid"]))
map_idx = list(image_ids["mapping"])
pts_time = list(image_ids["pts_time"])

@app.get('/')
async def introduce():
    return {"AI CHALLENGE HCM 2023": "HAIDIKICHI"}

@app.get('/search')
async def get_frame_from_query(query: Optional[str] = None, topk: Optional[int] = 100, 
                               ocrquery: Optional[str] = None, ocrthresh: Optional[float] = 0.8):
    if not query: query = None
    if not ocrquery: ocrquery = None

    if not query and ocrquery:
        results = search_ocr_all(ocrquery, infos, ocrthresh, topk)        
    elif query and not ocrquery:
        ids = []
        ids = search_vector(faiss_index= faiss_index, topk= topk, query= query)
        results = get_vid_frameids(ids)
    else:
        if not ocrthresh: 
            ocrthresh = 0.8
        ids = []
        ids = search_vector(faiss_index= faiss_index, topk= topk, query= query)
        candiates = get_vid_frameids(ids)
        # print(candiates)
        results = search_ocr(ocrquery, candiates, infos, ocrthresh, topk)
    
    return JSONResponse({"data": results})

@app.get('/get_metadata')
async def get_metadata(video: str, frameid: str):
    path = f"{source}/metadata/{video}.json"
    # print(path)
    with open(path, "r", encoding='utf-8', errors='ignore') as jsonfile:
        metadata = json.load(jsonfile)
    if metadata:
        pts_time = pts_time[info.index((video, frameid))]
        return JSONResponse({"url": f"""{metadata["watch_url"]}&t={pts_time}s&autoplay=0""" })
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

class resultsConfig(BaseModel):
    data: List[str]

@app.post("/mapping")
async def get_mapping(results: resultsConfig):
    map_results = []
    for res_id in results.data:
        video = res_id[:8]
        frameid = res_id[9:]
        id = map_idx[info.index((video, frameid))]
        map_results.append(id)
    return JSONResponse({"data": map_results})

@app.post("/submissions")
async def get_submission(results: resultsConfig):
    final_res = results.data
    for res_id in results.data:
        temp = get_frame_near(res_id[:8], res_id[9:])
        if len(final_res) + len(temp) > 100: break
        final_res.extend(temp)
    return JSONResponse({"data": final_res})

if __name__ == '__main__':
    uvicorn.run("app_fastapi:app", host="0.0.0.0", port=3000, reload=True)