import dataclasses

from tools.clients.base import BaseClient


@dataclasses.dataclass
class NewImageData:
    size: int
    height: int
    width: int
    hash: str


class SuperResolutionClient(BaseClient):

    def proceed(self, source_img_url: str, target_img_url_data: dict) -> NewImageData:
        json = {
            'source_img_url': source_img_url,
            'target_json': target_img_url_data,
        }
        r = self.make_request('POST', self.get_url('superres'), json=json)
        resp = r.json()
        return NewImageData(size=resp['size'], height=resp['h'], width=resp['w'], hash=resp['hash'])
