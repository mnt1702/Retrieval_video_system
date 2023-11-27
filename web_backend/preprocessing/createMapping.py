import os
from glob import glob
from tqdm import tqdm
import json
import pandas as pd
import sys
sys.path.append("web_backend")

from constant import *

def create_map(save_name= "mapping.csv"):
    mapping = []

    for video_path in tqdm(glob(f"{source}\\keyframes\\*\\*")):
        keyframes_path = glob(video_path + "\\*.jpg")
        keyframes_path.sort(key = lambda x: int(x.split('\\')[-1].split('.')[0]))
        
        for kf in keyframes_path:
            videoId = kf.split("\\")[-2]
            keyframeId = kf.split("\\")[-1].split('.')[0]
            
            #Create youtube url of each keyframe
            metadata_path = f"{source}/metadata/{videoId}.json"
            with open(metadata_path, "r", encoding='utf-8') as jsonfile:
                metadata = json.load(jsonfile)
            yt_url = f"""{metadata["watch_url"].replace('watch?v=', 'embed/')}?start={round(int(keyframeId)/25)}&autoplay=1"""

            mapping.append([videoId, keyframeId, yt_url])

    imageids = pd.DataFrame(mapping, columns = ["videoId", "keyframeId", "url"])

    #Create file mapping
    save_path = f"{source}/{save_name}"
    imageids.to_csv(save_path, index= False)
    
    #Check file save
    if os.path.exists(save_path): print("Completed")
    else: print("Failed")

if __name__ == "__main__":
    create_map()