import pandas as pd
import requests
import torch
from bs4 import BeautifulSoup


def del_script_and_style(soup):
    for script in soup(["script", "style"]):
        script.extract()  # rip it out

    return soup


class LLMBrowser:
    def __init__(self, model, tokenizer, retriever, translator, device: str = "cuda"):
        self.device = device
        self.model = model
        self.tokenizer = tokenizer
        self.retriever = retriever
        self.translator = translator

    def __call__(self, request: str, max_new_tokens: int):
        en_request = self.in_translate(request)
        q = "+".join(en_request.split())
        r = requests.get(f"https://www.google.com/search?q={q}")
        soup = BeautifulSoup(r.text, features="html.parser")

        soup = del_script_and_style(soup)
        doc = self.extract_text(soup)

        retriever_df = self.retriever_query(request)

        en_answer = self.generate(request, retriever_df["name"].tolist(), doc, max_new_tokens)
        ru_answer = self.out_translate(en_answer) + "\n".join(retriever_df["img_url"].tolist())
        return ru_answer

    def in_translate(self, text):
        source_lang = self.translator.detect_lang(text)
        return self.translator.translate(text, source_lang, "en")

    def out_translate(self, text):
        return self.translator.translate(text, "en", "ru")

    @staticmethod
    def extract_text(soup):
        text = soup.get_text()

        # break into lines and remove leading and trailing space on each
        lines = (line.strip() for line in text.splitlines())

        # break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

        # drop blank lines
        text = '\n'.join(chunk for chunk in chunks if chunk)

        return text

    def retriever_query(self, text: str):
        retrieved = self.retriever.query(text=text)
        # print(retrieved, "INSIDE LLM")
        return pd.DataFrame(retrieved)[["name", "img_url"]]

    @torch.inference_mode()
    def generate(self, request, retrieved, doc, max_new_tokens):
        content = f"""
        Hey, Mistral! You now live in Russia, therefore answer all questions in context of Russia, Moscow only. 
        Please answer the following question: {request}\n
        using this document: {doc}. \n
        Also you can use the places in Moscow retrieved from our DataBase (this may help you):""" + \
        '\n'.join([f"{i}. " + retrieved[i] for i in retrieved]) + "\n" \
        "Do not mention the source" + "\n"\
        "Generate the answer in MarkDown format"

        messages = [
            {"role": "user", "content": content, }
        ]

        encodeds = self.tokenizer.apply_chat_template(messages, return_tensors="pt")
        model_inputs = encodeds.to(self.device)

        generated_ids = self.model.generate(model_inputs, max_new_tokens=max_new_tokens, do_sample=True)
        decoded = self.tokenizer.batch_decode(generated_ids)

        torch.cuda.empty_cache()

        return decoded[0][decoded[0].find("[/INST]") + len("[/INST]"):]
