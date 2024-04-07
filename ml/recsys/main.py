from random import shuffle
from typing import List
import sys
sys.path.append("../")
from fastapi import FastAPI
from pydantic import BaseModel


#sys.path.append("../")
from retriever_service.retriever_api import RetrieverAPI
import requests

app = FastAPI()

class RecSys:
    def __init__(self):
        self.retriever = RetrieverAPI()

    def get_ids(self, input_texts: List[str], top_k=5) -> List[int]:
        all_ids = []
        
        for i in range(len(input_texts)):
            all_ids = all_ids + self.retriever.query(text=input_texts[i], k=top_k)['id'] # retrieve
        shuffle(all_ids)

        return list(set(all_ids))

class RecSysParams(BaseModel):
    user_texts: List[str]

rec_system = RecSys()


@app.post("/recsys/")
def recommend(params: RecSysParams):
    img_ids = rec_system.get_ids(params.user_texts)


    return {"status": "ok", "img_ids": img_ids}