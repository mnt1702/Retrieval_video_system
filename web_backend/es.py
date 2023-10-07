from elasticsearch import Elasticsearch, helpers
from utils import *
from constant import *
import pandas as pd
# from search import *
from constant import *

client = Elasticsearch(
    "http://127.0.0.1:9200/",
    basic_auth=('hoho303', 'hoho303'),
)

def create_index(index_name="aic"):
    client.indices.create(index=index_name)

def index_ocr(infos, index_name="aic"):
    for info in infos:
        kv_id = info["keyframe_id"] + "-" + info["video_id"]
        client.index(index=index_name, id=kv_id,body=info)

def index_ocr_bulk(infos, index_name="ocr", bulk_size=1000):
    for info in infos:
        kv_id = info["keyframe_id"] + "-" + info["video_id"]
        info['_id'] = kv_id

    for i in range(0, len(infos), bulk_size):
        helpers.bulk(client, infos[i:i+bulk_size], index=index_name)

# candidates = [{"video_id": "L10_V0001", "keyframe_id": "0001"},{"video_id": "L10_V0001", "keyframe_id": "0002"}]
def search_ocr_asr(candidates, 
           ocr_query=None, 
           asr_query=None, 
           crt_threshold=0.8, 
           top_k=100, 
           index_name="aic",
           mode = "all"):
    
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
            "must": [
                {"match": {"ocr": ocr_query}} if ocr_query else {"match_all": {}},
                {"match": {"asr": asr_query}} if asr_query else {"match_all": {}}
            ],
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
        results.append(re["_source"]['video_id'] + '_' + re["_source"]['keyframe_id'])

    return results

if __name__ == '__main__':
    # Lần đầu chạy thì tạo index
    # create_index(index_name="aic")
    # infos = get_all_ocr_infos(f"{source}/new_OCR_ASR.csv")
    # index_ocr_bulk(infos, index_name="aic", bulk_size=10000)
    
    # Tìm kiếm
    image_ids = pd.read_csv(f"{source}/image_ids.csv", dtype={"video": "string", "frameid": "string", "url": "string"})
    # faiss_index = faiss.read_index(f"{source}/faiss_index.bin")
    # query = "The coffee house"
    # ocr_q = "COFFEE"
    # topk = 5
    # results = search_vector(image_ids, faiss_index= faiss_index, topk= topk, query= query)
    
    re = search_ocr_asr(image_ids, ocr_query= "coffee", asr_query=None, index_name="aic", mode="all")
    print(re)

    # Xóa index khi cần
    # client.indices.delete(index="aic")