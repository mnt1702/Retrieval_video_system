import os
from glob import glob
from tqdm import tqdm
import os
import numpy as np
import sys
sys.path.append("web_backend")

from constant import *

def concatFeatures(folder= "Cvecs", save_name = "allClipFeatures.npy"):
    allFeatures = []
    
    #Concat features
    for path in tqdm(glob(f"{source}\\{folder}\\*.npy")):
        features = np.load(path)
        allFeatures.extend(features)

    #Create file features concat
    print("All features: ", np.shape(allFeatures))
    savePath = f"{source}/{save_name}"
    np.save(savePath, allFeatures)

    #Check file save
    if os.path.exists(savePath): print("Completed")
    else: print("Failed")

if __name__ == "__main__":
    concatFeatures()