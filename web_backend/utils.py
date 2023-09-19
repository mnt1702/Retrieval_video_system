import os
import Levenshtein
import csv
import ast

def get_info_by_id(video, frameid, infos):
    for info in infos:
        if info["video"] == video and info["frameid"] == frameid:
            return info
    return None
    

def get_all_files(root):
    list = [os.path.join(path, name) for path, subdirs, files in os.walk(root) for name in files]
    return list

def isEqual(str1, str2, threshold=0.8):
    str1 = str1.lower()
    str2 = str2.lower()

    if str1 == str2:
        return True
    elif Levenshtein.ratio(str1, str2) >= threshold:
        return True
    else:
        return False

def get_all_ocr_infos(root_file = None, root_dir = None):

    
    infos = []
    
    if root_file is not None:
        with open(root_file, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                info = {}
                info["frameid"] = row["keyframe_id"]
                info["video"] = row["video_id"]

                info["texts"] = row["texts"]
                info["texts"] = info["texts"].split(' ')

                # info["polygons"] = row["polygons"]
                # info["polygons"] = ast.literal_eval(info["polygons"])

                # info["scores"] = row["scores"]
                # info["scores"] = ast.literal_eval(info["scores"])

                infos.append(info)
    
        return infos

    elif root_dir is not None:
        # get all keyframe ocr files
        ocr_files = get_all_files(root_dir)

        for ocr_file in ocr_files:
            with open(ocr_file, "r", encoding='utf-8') as f:
                lines = f.readlines()

                info = {}
                info["frameid"] = ocr_file.split("\\")[-1].split(".")[0]
                info["video"] = ocr_file.split("\\")[-2]
                info["texts"] = []
                info["polygons"] = []
                info["scores"] = []

                for line in lines:
                    line = line.strip()
                    polygon, text, score = line.split("\t")

                    # convert polygon to list
                    polygon = polygon.replace("[", "").replace("]", "").split(",")
                    polygon = [float(p) for p in polygon]
                    
                    # convert score to float
                    score = float(score)

                    info["texts"].append(text)
                    info["polygons"].append(polygon)
                    info["scores"].append(score)

                infos.append(info)

        return infos