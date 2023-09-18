import numpy as np
import faiss
import pandas as pd
import clip
import torch
import glob
from constant import *

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


def get_feature_vector(text_query):
    text = clip.tokenize([text_query]).to(device)  
    text_features = model.encode_text(text).cpu().detach().numpy().astype(np.float64)
    return text_features

def get_frame_feature_vector(video, frameids):
    image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})
    image_ids = list(zip(image_ids['video'], image_ids["frameid"]))
    
    img_idx = image_ids.index((video, frameids))

    image_clipfeatures = np.load("F:/AIC2023/dataset/clip_embeddings.npy")

    image_feature = image_clipfeatures[img_idx].astype(np.float64)

    image_feature = np.expand_dims(image_feature, axis=0)
    return image_feature

def create_index_vector(clip_features):
    index = faiss.IndexFlatL2(512)
    fe = clip_features.reshape(clip_features.shape[0], -1).astype('float64')
    index.add(fe)
    faiss.write_index(index, 'faiss_index.bin')

def search_vector(query, faiss_index, topk):
    features_vector_search = get_feature_vector(query)
    f_dist, f_ids = faiss_index.search(features_vector_search, topk)
    f_ids = np.array(f_ids[0])
    return f_ids

def get_vid_frameids(ids):
    image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})
    image_ids = list(zip(image_ids['video'], image_ids["frameid"]))
    res = []
    for i in ids:
        res.append(image_ids[i][0] + "_" + image_ids[i][1])
    return res

def full_search(faiss_index, topk = 100, query = None, before = None, after = None):
    res_bef = []
    res_af = []
    if query == None and before == None and after == None:
        return []
    if query != None:
        res_q = search_vector(query, faiss_index, topk)
    else: res_q = list(range(max_size+1))
    if before != None: 
        before = search_vector(before, faiss_index, topk + 10)
        for i in before:
            if i == max_size: break
            res_bef.extend(list(range(i+1, i + 5 if i + 5 <= max_size else max_size)))
    else: res_bef = res_q
    if after != None:
        after = search_vector(after, faiss_index, topk + 10)
        for i in after:
            if i == 0: break
            temp = list(range(i - 5 if i - 5 >= 0 else 0, i))
            res_af.extend(temp)
    else: res_af = res_q

    if query == None and len(res_bef) < len(res_q): res_q = res_bef
    if query == None and len(res_af) < len(res_q): res_q = res_af
    

    final_res = [val for val in res_q if val in res_bef and val in res_af]
    return final_res

def get_frame_similarity(video, frameid, topk):
    frame_feature_vector = get_frame_feature_vector(video, frameid)
    
    faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
    
    f_dist, f_ids = faiss_index.search(frame_feature_vector, topk + 1)
    faiss_index.reset()
    
    f_ids = np.array(f_ids[0])
    results = get_vid_frameids(f_ids)   
    if f"{video}_{frameid}" in results:
        results.remove(f"{video}_{frameid}")

    return results
    
if __name__ == '__main__':
    faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
    query = "There is a dog, frame after there is a woman near the tree"
    topk = 5

    ids = full_search(faiss_index= faiss_index, topk= topk, after= query)
    # ids = search_vector(query, faiss_index, topk)
    # ids_2 = search_vector(query, topk)
    res = get_vid_frameids(ids)
    # res_2 = get_vid_frameids(ids_2)
    print(res)
    # print(res_2)
    # res = get_frame_similarity("L02_V018", "0023", 100)
    # print(res)