import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from fastapi import FastAPI
from pydantic import BaseModel

from llm_browser import LLMBrowser
import sys
sys.path.append("../")
from translation_service.translation import Translator
from retriever_service.retriever_api import RetrieverAPI

class LLMBrowserRequestParams(BaseModel):
    request: str


app = FastAPI()

device = "cuda"
model_name = "mistralai/Mistral-7B-Instruct-v0.2"

bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,  # Mistral, same as before
    quantization_config=bnb_config,  # Same quantization config as before
    device_map="auto",
    trust_remote_code=True,
)

tokenizer = AutoTokenizer.from_pretrained(model_name, add_bos_token=True, trust_remote_code=True)

link = "https://01b3-109-252-98-213.ngrok-free.app"
translator = Translator(link)

llmbrowser = LLMBrowser(model, tokenizer, translator, max_new_tokens=200)


@app.post("/llm_browser/")
def llm_browser(params: LLMBrowserRequestParams):
    result = llmbrowser(params.request)
    return {"result": result}
