import dataclasses

from tools.clients.base import BaseClient


@dataclasses.dataclass
class AddResponse:
    duplicates: list[int]
    tags: list[str]
    orientation: str
    extension: str
    daytime: str
    season: str


class RetrieverClient(BaseClient):

    def get_url(self, *args) -> str:
        return super().get_url('retriever', *args)

    def add(self, img_id: int, img_url: str, img_title: str) -> AddResponse:
        json = {
            'id': img_id,
            'img_url': img_url,
            'img_name': img_title,
        }
        r = self.make_request('POST', self.get_url('add'), json=json)
        resp = r.json()
        return AddResponse(duplicates=resp['dupl_ids'],
                           tags=resp['tags'],
                           orientation=resp['filters']['orientation_filter'],
                           extension=resp['filters']['extension_filter'],
                           daytime=resp['filters']['daytime_filter'],
                           season=resp['filters']['season_filter'],
                           )
