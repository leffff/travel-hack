from typing import List

import requests


class RetrieverAPI:
    def __init__(self, link: str = 'https://9771-217-151-229-24.ngrok-free.app/retriever/query'):
        self.link = link

    def query(self, img_url: str = None, text: str = None, tags: List[str] = None,  filters: dict = None, k: int = 5):
        json = {
            "img_url": img_url,
            "text": text,
            "tags": tags,
            "filters": filters,
            "k": k
        }
        r = requests.post(self.link, json=json)


        return r.json()
