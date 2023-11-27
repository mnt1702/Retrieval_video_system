from elasticsearch import Elasticsearch, helpers
import faiss
import pandas as pd
import csv

from search import *
from constant import *


client = Elasticsearch(
    f"{hostIpES}:{portES}",
    basic_auth=(username , password),
)

def createIndex(indexName= "demo"):
    client.indices.create(index= indexName)

def getData(filePath):
    infos = []
    with open(filePath, newline= '', encoding= 'utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            info = {}
            info["keyframeId"] = row["keyframeId"]
            info["videoId"] = row["videoId"]

            info["ocr"] = row["ocr"]
            info["asr"] = row["asr"]

            infos.append(info)
    
    return infos

def indexBulk(infos, indexName= "demo", bulk_size= 1000):
    for info in infos:
        kvId = info["keyframeId"] + "/" + info["videoId"]
        info['_id'] = kvId

    for i in range(0, len(infos), bulk_size):
        helpers.bulk(client, infos[i:i+bulk_size], index=indexName)

def searchOcrAsr(candidates, ocrQuery= None, asrQuery= None, topK= 100, indexName= "demo"):
    ids = []

    for candidate in candidates:
        videoId = candidate.split('/')[0]
        keyframeId = candidate.split('/')[1]
        kvId = keyframeId + "/" + videoId
        ids.append(kvId)

    Query = {
        "bool": {
            "must": [
                {"match": {"ocr": ocrQuery}} if ocrQuery else {"match_all": {}},
                {"match": {"asr": asrQuery}} if asrQuery else {"match_all": {}}
            ],
            "filter": {
                "ids": {
                    "values": ids
                }
            } if ids else []
        }
    }

    res = client.search(index=indexName, query=Query, size=topK)
    res = res["hits"]["hits"]

    results = []

    for re in res:
        results.append(re["_source"]['videoId'] + '/' + re["_source"]['keyframeId'])

    return results

if __name__ == '__main__':    
    # # Index Contruction
    # createIndex(indexName= elasticIndexName)
    # infos = getData(f"{source}/OCR_ASR.csv")
    # indexBulk(infos, indexName= elasticIndexName, bulk_size=10000)
    
    # Search
    mapping = pd.read_csv(f"{source}/mapping.csv", dtype={"videoId": "string", "keyframe_id": "string", "url": "string"})
    faissIndex = faiss.read_index(f"{source}/faissIndex.bin")
    query = "The coffee house"
    ocrQuery = "COFFEE"
    topK = 5
    candidates, _ = searchTextQuery(query, topK, mapping, faissIndex)
    
    results = searchOcrAsr(candidates=candidates, ocrQuery= ocrQuery, asrQuery=None, indexName=elasticIndexName)
    print(results)

    # # Delete elastic index
    # client.indices.delete(index= elasticIndexName)