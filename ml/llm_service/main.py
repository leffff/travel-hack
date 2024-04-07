import sys

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

from llm_browser import LLMBrowser

sys.path.append("../")
from translation_service.translation import Translator
from retriever_service.retriever_api import RetrieverAPI


class LLMBrowserRequestParams(BaseModel):
    request: str
    max_new_tokens: int


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

link = "https://b047-109-252-103-15.ngrok-free.app/"
translator = Translator(link)

retriever = RetrieverAPI()

llmbrowser = LLMBrowser(model, tokenizer, retriever, translator)


@app.post("/llm_browser/")
def llm_browser(params: LLMBrowserRequestParams):
    text_result, img_ids, img_urls = llmbrowser(params.request, params.max_new_tokens)
    return {"text_result": text_result, "img_ids": img_ids, "img_urls": img_urls}
