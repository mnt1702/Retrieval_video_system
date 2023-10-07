import numpy as np
import faiss
import pandas as pd
import clip
import torch
from constant import *
from PIL import Image
import sys
from constant import *

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


def get_feature_vector(text_query):
    text = clip.tokenize([text_query]).to(device)  
    text_features = model.encode_text(text).cpu().detach().numpy().astype(np.float64)
    text_features /= np.linalg.norm(text_features, axis=1).reshape((-1, 1))
    return text_features

def get_frame_feature_vector(video, frameids):
    image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})
    image_ids = list(zip(image_ids['video'], image_ids["frameid"]))
    
    img_idx = image_ids.index((video, frameids))
    image_clipfeatures = np.load(f"{source}/clip_embeddings.npy")

    image_feature = image_clipfeatures[img_idx].astype(np.float64)

    image_feature = np.expand_dims(image_feature, axis=0)
    return image_feature

def create_index_vector(clip_features):
    index = faiss.IndexFlatL2(512)
    fe = clip_features.reshape(clip_features.shape[0], -1).astype('float64')
    index.add(fe)
    faiss.write_index(index, 'faiss_index.bin')

def search_vector(image_ids, query, faiss_index, topk):
    features_vector_search = get_feature_vector(query)
    f_dist, f_ids = faiss_index.search(features_vector_search, topk)
    f_ids = np.array(f_ids[0])
    results = []
    for id in f_ids:
        results.append(image_ids['video'][id] + "_" + image_ids['frameid'][id])
    return results

def get_vid_frameids(image_ids, ids):
    res = []
    for i in ids:
        res.append(image_ids['video'][i] + "_" + image_ids['frameid'][i])
    return res

def get_frame_similarity(image_ids, info_ids, video, frameid, faiss_index, image_clipfeatures, topk):
    img_idx = info_ids.index((video, frameid))

    frame_feature_vector = image_clipfeatures[img_idx].astype(np.float64)
    frame_feature_vector = np.expand_dims(frame_feature_vector, axis=0)
    
    f_dist, f_ids = faiss_index.search(frame_feature_vector, topk + 1)

    f_ids = np.array(f_ids[0])
    results = []
    for id in f_ids[1:]:
        results.append(image_ids['video'][id] + "_" + image_ids['frameid'][id])
    return results

def get_image_feature_vector(image):    
    image = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        img_feature = model.encode_image(image)
        img_feature /= img_feature.norm(dim=-1, keepdim=True)
    return img_feature.cpu().numpy()


def search_image_vector(image_ids, image, faiss_index, topk):
    features_vector_search = get_image_feature_vector(image)
    f_dist, f_ids = faiss_index.search(features_vector_search, topk)
    f_ids = np.array(f_ids[0])
    results = []
    for id in f_ids:
        results.append(image_ids['video'][id] + "_" + image_ids['frameid'][id])
    return results

# if __name__ == '__main__':
#     faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
#     topk = 5

    # ***Test Search query ***
    # query = "There is a dog, frame after there is a woman near the tree"
    # ids = search_vector(query, faiss_index, topk)
    # ids_2 = search_vector(query, topk)
    # res_2 = get_vid_frameids(ids_2)
    # print(res_2)
    # res = get_frame_similarity("L02_V018", "0023", 100)
    # print(res)
    
    # ***Test Search Image ***
    # image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "mapping": "int", "pts_time": "float"})
    # image_path = r"F:\AIC2023\dataset\keyframes\L01_V001\10.jpg"
    # image = Image.open(image_path)
    # res = search_image_vector(image_ids, image, faiss_index, topk)
    # print(res)