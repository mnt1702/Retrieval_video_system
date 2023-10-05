from elasticsearch import Elasticsearch
from utils import *
from constant import *
import pandas as pd
from search import *
from constant import *

client = Elasticsearch(
    "http://127.0.0.1:9200/",
    basic_auth=('hoho303', 'hoho303'),
)

def create_index(index_name="ocr"):
    client.indices.create(index=index_name)

def index_ocr(infos, index_name="ocr"):
    for info in infos:
        kv_id = info["frameid"] + "-" + info["video"]
        client.index(index=index_name, id=kv_id,body=info)

# candiates = [{"video_id": "L10_V0001", "keyframe_id": "0001"},{"video_id": "L10_V0001", "keyframe_id": "0002"}]
def search_ocr(query, candidates, crt_threshold=0.8, top_k=100, index_name="ocr", mode="all"):
    ids = []
    if mode == "all":
        for video_id, keyframe_id in list(zip(candidates['video'], candidates['frameid'])):
            kv_id = keyframe_id + "-" + video_id
            ids.append(kv_id)
    elif mode == "combine":
        for candidate in candidates:
            video_id = candidate[:8]
            keyframe_id = candidate[9:]
            kv_id = keyframe_id + "-" + video_id
            ids.append(kv_id)

    ocr_query = {
        "bool": {
            "must": {
            "match": {
                "texts": query
            }
            },
            "filter": {
                "ids": {
                    "values": ids
                }
            }
        }
    }

    res = client.search(index=index_name, query=ocr_query, size=top_k)
    res = res["hits"]["hits"]

    results = []

    for re in res:
        info = re["_source"]["video"] + '_' + re["_source"]["frameid"]
        results.append(info)

    return results

# def main():
#     # # Lần đầu chạy thì tạo index
#     # create_index(index_name="ocr")
#     # infos = get_all_ocr_infos(f"{source}/OCR.csv")
#     # index_ocr(infos, index_name="ocr")
#     image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "mapping": "int", "pts_time": "float"})
#     faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
#     query = "The coffee house"
#     ocr_q = "Coffee"
#     topk = 100
#     results = search_vector(image_ids, faiss_index= faiss_index, topk= topk, query= query)
#     # print(results)
#     # Tìm kiếm
#     re = search_ocr(ocr_q, results, index_name="ocr", mode= "combine")
#     print(re)

#     # Xóa index khi cần
#     # client.indices.delete(index="ocr")

# if __name__ == "__main__":
#     main()    