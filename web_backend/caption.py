import json
import os
from constant import *

f = open(f'{source}/captions.json', encoding="utf8")
 
# returns JSON object as
# a dictionary
data = json.load(f)
f.close()

def find_text(text, candidates, topk, mode):
    print(mode)
    text = text.lower()
    results = []
    vid_can = list(v[:8] for v in candidates)
    for key in data.keys():
        if text in data[key] and key in vid_can:
            for x in candidates:
                if len(results) >= topk: 
                    return results
                if x[:8] == key:
                    results.append(x)
                    if mode == "all": break
                    
    return results

# if __name__ == '__main__':
#     print(find_text('hóc môn', ["L02_V003_0", "L02_V003_10", "L02_V003_1", "L02_V003_2"]))
