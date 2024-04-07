from abc import ABC

import requests


class BaseClient(ABC):

    def __init__(self, host: str):
        self.host = host.strip('/')

    def get_url(self, *args) -> str:
        path = '/'.join(args)
        return f'{self.host}/{path}/'

    def make_request(self, method: str, url: str, **params) -> requests.Response:
        params.setdefault('timeout', 30 * 60)
        r = requests.request(method, url, **params)
        r.raise_for_status()
        return r
