import numpy as np
import clip
from PIL import Image
import pandas as pd
import torch
import faiss

from constant import *

#Setup device and model embedding
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def getTextFeature(text_query):
    #Comput CLIP feature of text query
    text = clip.tokenize([text_query]).to(device)  
    textFeatures = model.encode_text(text).cpu().detach().numpy().astype(np.float64)
    
    #Normalize
    textFeatures /= np.linalg.norm(textFeatures, axis=1).reshape((-1, 1))
    
    return textFeatures

def searchTextQuery(query, topK, mapping, faissIndex):
    #Search
    textFeature = getTextFeature(query)
    resDist, resIds = faissIndex.search(textFeature, topK)
    
    #Mapping results
    results = [mapping['videoId'][id] + "/" + str(mapping['keyframeId'][id]) for id in resIds[0]]
    similarity = resDist[0]
    
    return results, similarity

def getSimilarFrames(videoId, keyframeId, topk, allFeatures, faissIndex, mapping, imgIds):
    #Get feature of frame id
    idx = imgIds.index((videoId, keyframeId))
    frame_feature = np.expand_dims(allFeatures[idx].astype(np.float64), axis= 0)
    
    #Search frame similar
    resDist, resIds = faissIndex.search(frame_feature, topk + 1)
    
    #Mapping results
    results = [mapping['videoId'][id] + "/" + str(mapping['keyframeId'][id]) for id in resIds[0]]
    results.remove(videoId + '/' + keyframeId)

    return results

def getImageFeature(image):    
    #Compute CLIP feature
    image = preprocess(image).unsqueeze(0).to(device)
    
    #Normalize
    with torch.no_grad():
        imgFeature = model.encode_image(image)
        imgFeature /= imgFeature.norm(dim=-1, keepdim=True)
    
    return imgFeature.cpu().numpy()


def searchImageQuery(image, topK, faissIndex, mapping):
    #Get feature
    imgFeature = getImageFeature(image)
    
    #Search
    resDist, resIds = faissIndex.search(imgFeature, topK)
    
    #Mapping results
    results = [mapping['videoId'][id] + "/" + str(mapping['keyframeId'][id]) for id in resIds[0]]
    similarity = resDist[0]
    
    return results, similarity

if __name__ == '__main__':
    faissIndex = faiss.read_index(f"{source}/faissIndex.bin")
    mapping = pd.read_csv(f"{source}/mapping.csv", dtype={"videoId": "string", "keyframeId": "string", "url": "string"})
    imgIds = list(zip(mapping["videoId"], mapping["keyframeId"]))
    allClipFeatures = np.load(f"{source}/allClipFeatures.npy")
    topK = 5

    # ***Search text query***
    query = "There is a dog, frame after there is a woman near the tree"
    results, similarity = searchTextQuery(query, topK, mapping, faissIndex)
    print(results, similarity)

    # ***Get frame similarity*** 
    results = getSimilarFrames("L01_V001", "2400", topK, allClipFeatures, faissIndex, mapping, imgIds)
    print(results)
    
    # ***Test Search Image ***
    image_path = f"{source}\\keyframes\\L01\\L01_V001\\2400.jpg"
    image = Image.open(image_path)
    results, similarity = searchImageQuery(image, topK, faissIndex, mapping)
    print(results, similarity)