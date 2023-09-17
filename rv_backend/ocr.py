from utils import isEqual, get_all_ocr_infos, get_info_by_id
import pandas as pd
from search import full_search, get_vid_frameids
from constant import *

def search_ocr_all(query, infos, crt_threshold=0.8, top_k=100):
    # split query
    print(query)
    words = query.split(" ")

    # search
    results = []
    crt_scores = []

    for info in infos:
        if(not info): continue
        texts = info["texts"]
        polygons = info["polygons"]
        scores = info["scores"]

        correct_word = 0

        # search
        for word in words:
            for i, text in enumerate(texts):
                if isEqual(word, text):
                    correct_word += 1
                    break
        
        crt_score = correct_word / len(words)
        if crt_score >= crt_threshold:
            results.append(info)
            crt_scores.append(crt_score)        

    # sort
    sorted_results = sorted(results, key=lambda result: crt_scores[results.index(result)])
    sorted_results = sorted_results[:top_k]
    final_results = []
    for result in sorted_results:
        final_results.append(result['video'] + '_' + result['frameid'])
    return final_results

def search_ocr(query, candiates, infos, crt_threshold=0.8, top_k=100):
    # split query
    words = query.split(" ")

    candiate_infos = []
    for candiate in candiates:
        video = candiate[:8]
        frameid = candiate[9:]
        # print(video, frameid)
        info = get_info_by_id(video, frameid, infos)
        candiate_infos.append(info)
    # search
    results = []
    crt_scores = []

    for info in candiate_infos:
        if(not info): continue
        texts = info["texts"]
        polygons = info["polygons"]
        scores = info["scores"]

        correct_word = 0

        # search
        for word in words:
            for i, text in enumerate(texts):
                if isEqual(word, text):
                    correct_word += 1
                    break
        
        crt_score = correct_word / len(words)
        if crt_score >= crt_threshold:
            results.append(info)
            crt_scores.append(crt_score)        

    # sort
    sorted_results = sorted(results, key=lambda result: crt_scores[results.index(result)])
    sorted_results = sorted_results[:top_k]
    final_results = []
    for result in sorted_results:
        final_results.append(result['video'] + '_' + result['frameid'])
    return final_results

if __name__ == "__main__":
    # load trước ở global
    infos = get_all_ocr_infos(f"{source}/OCR.csv")

    query = "đội tuyển Việt Nam"
    results = search_ocr_all(query, infos)
    for result in results:
        print(result)
        print("=====================================")

    # candiates = pd.read_csv("F:/AIC2023/dataset/image_ids.csv", dtype={"filepath": "string", "video": "string", "frameid": "string"})
    # ids = []
    # ids = full_search("There is a coffee house", 100)
    # candiates = get_vid_frameids(ids)
    # res = search_ocr(query, candiates, infos, crt_threshold=0.8, top_k=100)
    # print(res)