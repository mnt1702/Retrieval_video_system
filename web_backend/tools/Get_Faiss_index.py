import faiss
import clip
import torch
import numpy as np

def create_index_vector(clip_features):
    index = faiss.IndexFlatL2(512)
    fe = clip_features.reshape(clip_features.shape[0], -1).astype('float64')
    index.add(fe)
    faiss.write_index(index, 'faiss_index.bin')

if __name__ == '__main__':
    image_features = np.load("dataset/clip_embeddings.npy")
    create_index_vector(image_features)