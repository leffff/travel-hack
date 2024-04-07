import sys
from datetime import time, datetime

import nltk
import ruclip
from clickhouse_driver import Client
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from tqdm.auto import tqdm

sys.path.append("../")

from translation_service.translation import Translator
from blip_tagging import Tagger
from retriever import ClickHouse, Retriever
from ood import OOD

tqdm.pandas()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
device = 'cuda'

link = "https://b047-109-252-103-15.ngrok-free.app"
translator = Translator(link)

clickhouse = ClickHouse(
    client=Client(host='158.160.153.233', port=9000, password='JX2J59Y4g29A', user='misis_admin', database='misis')
)

nltk.download('stopwords')
tagger = Tagger("Salesforce/blip-image-captioning-large")

clip, processor = ruclip.load('ruclip-vit-base-patch32-384', cache_dir='/tmp/ruclip', device=device)

ood_model = OOD(
    "catboost_ood",
    threshold=0.675
)

retriever = Retriever(
    model=clip,
    processor=processor,
    clickhouse=clickhouse,
    tagger=tagger,
    translator=translator,
    ood_model=ood_model
)


class AddParams(BaseModel):
    id: int
    img_url: str
    img_name: str


@app.post("/retriever/add")
def retriever_add(params: AddParams):
    response = retriever.add(
        id=params.id,
        img_url=params.img_url,
        name=params.img_name
    )
    return response


class EditParams(BaseModel):
    id: int
    img_name: str | None
    tags: list | None
    filters: dict | None


@app.post("/retriever/edit")
def retriever_edit(params: EditParams):
    retriever.edit(
        id=params.id,
        name=params.img_name,
        tags=params.tags,
        filters=params.filters
    )
    return {"status": "ok"}


class QueryParams(BaseModel):
    img_url: str | None
    text: str | None
    tags: list | None
    filters: dict | None
    k: int | None


@app.post("/retriever/query")
def retriever_query(params: QueryParams):
    print(datetime.now(), params.img_url, params.text, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    response = retriever.query(
        img_url=params.img_url,
        text=params.text,
        tags=params.tags,
        filters=params.filters,
        k=params.k
    )
    return response


class OODParams(BaseModel):
    text: str | None
    tags: list | None


@app.post("/retriever/ood")
def retriever_ood(params: OODParams):
    is_ood = retriever.check_ood(params.text, params.tags)
    return {"result": is_ood}


class HideParams(BaseModel):
    id: int


@app.post("/retriever/hide")
def retriever_hide(params: HideParams):
    retriever.hide_sample(params.id)
    return {"status": "ok"}


class RecoverParams(BaseModel):
    id: int


@app.post("/retriever/recover")
def retriever_recover(params: RecoverParams):
    retriever.recover_sample(params.id)
    return {"status": "ok"}
