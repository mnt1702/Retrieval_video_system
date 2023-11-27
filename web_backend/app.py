import io
import os
from deep_translator import GoogleTranslator

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
import base64
import uvicorn

from search import *
from constant import *
from eslasticSearch import *
from getSessionId import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#CLIP features
allClipFeatures = np.load(f"{source}\\allClipFeatures.npy")

#Faiss index
faissIndex = faiss.read_index(f"{source}\\faissIndex.bin")

#Mapping
mapping = pd.read_csv(f"{source}\\mapping.csv", dtype={"videoId": "string", "keyframeId": "string", "url": "string"})
imgIds = list(zip(mapping["videoId"], mapping["keyframeId"]))

#Define struct of file upload
class fileUploadConfig(BaseModel):
    topk: int
    file: str
    

@app.get('/')
async def introduce():
    return {"AI CHALLENGE HCM 2023": "HAIDIKICHI"}

@app.get('/search')
async def searchEngine(query: Optional[str] = None, 
                        ocrQuery: Optional[str] = None, 
                        asrQuery: Optional[str] = None,
                        topK: Optional[int] = 100):
    
    ocrnasr = True
    if ocrQuery == None and asrQuery == None:
        ocrnasr = False

    results = []

    #Search without query
    if query == None and ocrnasr == True:
        results = searchOcrAsr([], ocrQuery, asrQuery, topK, indexName=elasticIndexName)
    
    #Search with query
    if query != None and ocrnasr == False:
        results, _ = searchTextQuery(query, topK, mapping, faissIndex)

    #Search with query and OCR&ASR query
    if query != None and ocrnasr == True:
        candidates, _ = searchTextQuery(query, topK, mapping, faissIndex)
        results = searchOcrAsr(candidates, ocrQuery, asrQuery, topK, indexName= elasticIndexName)
    
    return JSONResponse({"results": results})

@app.get('/metadata/{videoId}/{keyframeId}')
async def metadata(videoId: str, keyframeId: str):
    #Check the existence of keyframe
    if (videoId, keyframeId) not in imgIds:
        raise HTTPException(status_code=404, detail=f"Keyframe {videoId}/{keyframeId} not found")
    
    # Get youtube link of keyframe
    url = mapping['url'][imgIds.index((videoId, keyframeId))]

    return JSONResponse({"url": url})

@app.get("/nearbyFrames/{videoId}/{keyframeId}")
async def nearbyFrames(videoId: str, keyframeId: str, num: Optional[int] = 11):
    #Check the existence of keyframe
    if (videoId, keyframeId) not in imgIds:
        raise HTTPException(status_code=404, detail=f"Keyframe {videoId}/{keyframeId} not found")
    
    idx = imgIds.index((videoId, keyframeId))
    frameNear = [videoId + '/' + mapping['keyframeId'][idx]]

    #Get num nearby frames the root
    for i in range(1, num):
        if mapping['videoId'][idx + i] == videoId:
            frameNear.append(videoId + '/' + mapping['keyframeId'][idx + i])
        if idx >= i and mapping['videoId'][idx - i] == videoId:
            frameNear.append(videoId + '/' + mapping['keyframeId'][idx - i])
        if(len(frameNear) >= num): break
    
    frameNear.sort(key = lambda x: int(x[9:]))
    
    return JSONResponse({'results': frameNear})

@app.get("/similarFrames/{videoId}/{keyframeId}")
async def similarFrames(videoId: str, keyframeId: str, topk: Optional[int] = 100):
    #Check the existence of keyframe
    if (videoId, keyframeId) not in imgIds:
        raise HTTPException(status_code=404, detail= f"Keyframe {videoId}/{keyframeId} not found")
    
    #Get topk frames are similar to the root
    results = getSimilarFrames(videoId, keyframeId, topk, allClipFeatures, faissIndex, mapping, imgIds)
    
    return JSONResponse({"results": results})

@app.get("/translations")
async def translations(vi_query: Optional[str] = None):
    #Translate Vietnamese query to English query
    en_query = GoogleTranslator(source='auto', target='en').translate(vi_query)

    return JSONResponse({"trans_en": en_query})   

@app.get("/image/{videoId}/{keyframeId}")
async def image(videoId: str, keyframeId: str, 
                    width: Optional[int] = 144, height: Optional[int] = 81, 
                    mode= "origin"):
    #Check the existence of keyframe
    if (videoId, keyframeId) not in imgIds:
        raise HTTPException(status_code=404, detail= f"Keyframe {videoId}/{keyframeId} not found")
    
    file_path = os.path.join(f"{source}/keyframes", videoId[:3], videoId, keyframeId + ".jpg")

    #Return keyframe
    image = Image.open(file_path)
    
    if mode == "thumbnail":
        image.thumbnail((width, height))
    
    imgio = io.BytesIO()
    image.save(imgio, 'JPEG')
    imgio.seek(0)

    return StreamingResponse(content = imgio, media_type="image/jpeg")
    

@app.get("/sessionId")
async def sessionId():
    # ***     If have api to get session id and submit the result, you can run this hidden code     ***
    # # Get session id
    # sessionId = get_session("haidikichi", "Cheecea0")
    
    sessionId = "haidikichi"

    return JSONResponse({"sessionId": sessionId})

@app.get("/submitFrame/{videoId}/{keyframeId}")
async def submitFrame(videoId: str, keyframeId: str, sessionId: str):
    # ***     If have api to get session id and submit the result, you can run this hidden code     ***
    # # Submit result
    # URL = f"https://eventretrieval.one/api/v1/submit?item={videoId}&frame={keyframeId}&session={sessionId}"
    # r = requests.get(url=URL)
    # results = r.text
    
    results = f"videoId: {videoId}\nkeyframeId: {keyframeId}\nstatus: Completed\ncorrect: True"
    
    return results

@app.post("/searchImage")
async def searchImage(config: fileUploadConfig):
    #Read file upload and resize image
    file = config.file.split(',')[1]
    topk = config.topk
    imgdata = base64.b64decode(file)
    image = Image.open(io.BytesIO(imgdata))
    image.thumbnail((640, 360))
    
    #Search image
    results, _ = searchImageQuery(image, topk, faissIndex, mapping)
    
    return JSONResponse({"results": results})


if __name__ == '__main__':
    uvicorn.run("app:app", host= hostIp, port= port, reload=True)