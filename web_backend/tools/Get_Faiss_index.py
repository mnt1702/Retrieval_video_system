import faiss
import clip
import torch
import numpy as np
from constant import *

def create_index_vector(clip_features):
    index = faiss.IndexFlatL2(512)
    fe = clip_features.reshape(clip_features.shape[0], -1).astype('float64')
    index.add(fe)
    faiss.write_index(index, 'faiss_index.bin')

def create_faiss_index_gpu(clip_features):
    res = faiss.StandardGpuResources() 
    index = faiss.IndexFlatL2(512)
    fe = clip_features.reshape(clip_features.shape[0], -1).astype('float64')

    gpu_index = faiss.index_cpu_to_gpu(res, 0, index)

    gpu_index.add(fe)
    faiss.write_index(gpu_index, 'faiss_index_gpu.bin')

if __name__ == '__main__':
    clip_features = np.load(f"{source}/clip_embeddings.npy")
    create_faiss_index_gpu(clip_features)
    create_index_vector(clip_features)