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


@dataclasses.dataclass
class QueryResponse:
    ids: list[int]
    img_urls: list[str]
    names: list[str]


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

    def query(self,
              img_url: str | None = None,
              text: str | None = None,
              tags: list[str] | None = None,
              filters: dict[str, str] | None = None,
              k: int = 5,
              ) -> QueryResponse:
        json = {
            'img_url': img_url,
            'text': text,
            'tags': tags,
            'filters': filters,
            'k': k,
        }
        r = self.make_request('POST', self.get_url('query'), json=json)
        resp = r.json()
        return QueryResponse(ids=resp['id'], img_urls=resp['img_url'], names=resp['name'])

    def hide(self, img_id: int) -> None:
        json = {'id': img_id}
        self.make_request('POST', self.get_url('hide'), json=json)
