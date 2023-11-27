import faiss
import numpy as np
import os
import sys
sys.path.append("web_backend")

from constant import *

def indexConstruction(file_name = "allClipFeatures.npy", save_name= "faissIndex.bin"):
    #Get all features
    features = np.load(f"{source}/{file_name}")
    
    #Index construction with metric Inner Product
    index = faiss.IndexFlatIP(np.shape(features)[1])
    fe = features.reshape(features.shape[0], -1).astype('float64')
    index.add(fe)
    
    #Save file save index table
    save_path = f"{source}/{save_name}"
    faiss.write_index(index, save_path)
    
    #Check file save
    if os.path.exists(save_path): print("Completed")
    else: print("Failed")


def createFaissIndexGpu(file_name = "allCLIPfeatures.npy", save_name= "faissIndex.bin"):
    clipFeatures = np.load(f"{source}/{file_name}")
    res = faiss.StandardGpuResources() 
    index = faiss.IndexFlatIP(512)
    fe = clipFeatures.reshape(clipFeatures.shape[0], -1).astype('float64')

    gpu_index = faiss.index_cpu_to_gpu(res, 0, index)

    gpu_index.add(fe)
    
    #Save file save Faiss index
    savePath = f"{source}/{save_name}"
    faiss.write_index(index, savePath)
    
    #Check file save
    if os.path.exists(savePath): print("Completed")
    else: print("Failed")

if __name__ == '__main__':
    indexConstruction()