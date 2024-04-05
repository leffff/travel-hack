import requests
import torch
from bs4 import BeautifulSoup


def del_script_and_style(soup):
    for script in soup(["script", "style"]):
        script.extract()  # rip it out

    return soup


class LLMBrowser:
    def __init__(self, model, tokenizer, translator, max_new_tokens: int = 100, device: str = "cuda"):
        self.device = device
        self.model = model
        self.tokenizer = tokenizer
        self.translator = translator
        self.max_new_tokens = max_new_tokens

    def __call__(self, request: str):
        en_request = self.in_translate(request)
        q = "+".join(en_request.split())
        r = requests.get(f"https://www.google.com/search?q={q}")
        soup = BeautifulSoup(r.text, features="html.parser")

        soup = del_script_and_style(soup)
        doc = self.extract_text(soup)

        en_answer = self.generate(request, doc)
        ru_answer = self.out_translate(en_answer)
        return ru_answer

    def in_translate(self, text):
        source_lang = self.translator.detect_lang(text)
        return self.translator.translate(text, source_lang, "en")

    def out_translate(self, text):
        source_lang = self.translator.detect_lang(text)
        return self.translator.translate(text, "en", "ru")

    def extract_text(self, soup):
        text = soup.get_text()

        # break into lines and remove leading and trailing space on each
        lines = (line.strip() for line in text.splitlines())

        # break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

        # drop blank lines
        text = '\n'.join(chunk for chunk in chunks if chunk)

        return text

    @torch.inference_mode()
    def generate(self, request, doc):
        content = f"Hey, Mistral! You now live in Russia, therefore answer all questions inconntext of Russia, Moscow only. Please answer the following question: {request}\n\n using this document: {doc}"

        messages = [
            {"role": "user", "content": content, }
        ]

        encodeds = self.tokenizer.apply_chat_template(messages, return_tensors="pt")
        model_inputs = encodeds.to(self.device)

        generated_ids = self.model.generate(model_inputs, max_new_tokens=self.max_new_tokens, do_sample=True)
        decoded = self.tokenizer.batch_decode(generated_ids)

        torch.cuda.empty_cache()

        return decoded[0][len(content) + len("[INST]"):]
