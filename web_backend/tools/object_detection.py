import numpy as np
import torch
import pandas as pd
import json
import tqdm
# from constant import max_size

def obj_det_extract():
    image_ids = pd.read_csv("F:\\AIC2023\\dataset\\image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})
    image_ids = list(zip(image_ids['video'], image_ids['frameid']))
    detections = set()
    
    for video, frameid in tqdm.tqdm(image_ids):
        object_path = f"F:\\AIC2023\\dataset\\objects\\{video}\\{frameid}.json"
        
        with open(object_path) as jsonfile:
            det_data = json.load(jsonfile)
        
        for cls, score in zip(det_data['detection_class_entities'], det_data['detection_scores']):
            scoref = float(score)
            if scoref >= 0.5: detections.add((video, frameid, cls, scoref))
    
    df = pd.DataFrame(detections, columns = ['video', 'frameid', 'cls', 'score'])
    df.to_csv("objects_detections.csv", index = None)

def check_object(video, frameid, cls, threshold):
    image_ids = pd.read_csv("F:\\AIC2023\\dataset\\image_ids.csv\\objects_detections.csv", dtype={"video": "string", "frameid": "string", "cls": "string", "score": "float"})
    list_cls = list(zip(image_ids['video'], image_ids["frameid"], image_ids['cls']))
    if (video, frameid, cls) in list_cls and image_ids['score'][list_cls.index((video, frameid, cls))] >= threshold:
        return True
    return False

if __name__ == '__main__':
    obj_det_extract()
    # res = check_object('L10_V023', '0131', 'Human face', 0.8)
    # print(res)
    
