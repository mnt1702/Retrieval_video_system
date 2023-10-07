import json
import os
from constant import *
import pandas as pd

def find_text(caption, text, candidates, topk, mode):
    text = text.lower()
    results = []
    vid_can = list(v[:8] for v in candidates)
    for key in caption.keys():
        if text in caption[key] and key in vid_can:
            for x in candidates:
                if len(results) >= topk: 
                    return results
                if x[:8] == key:
                    if mode == "all":
                        results.append(x + "_0")
                    else: results.append(x)
    return results

if __name__ == '__main__':
    f = open(f'{source}/captions.json', encoding="utf8")
    caption = json.load(f)
    f.close()
    image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "url": "string"})
    video = list(image_ids['video'])
    print(find_text(caption, 'hóc môn',video,100, "all"))
