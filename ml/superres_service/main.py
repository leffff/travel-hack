import hashlib
from io import BytesIO

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import shutil
from pydantic import BaseModel
from PIL import Image
import requests
from urllib.parse import urlparse

from starlette.middleware.cors import CORSMiddleware

from superres import SuperResolutionModel


class SuperResRequestParams(BaseModel):
    source_img_url: str
    target_json: dict


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model_id: str = "CompVis/ldm-super-resolution-4x-openimages"
num_steps: int = 50
device: str = "cuda"

superres_model = SuperResolutionModel(model_id, num_steps, device)


def get_extention(img_url):
    extension = urlparse(img_url).path.strip("/").rsplit(".", 1)[-1]
    return extension


def get_image_hash(filelike):
    filelike.seek(0)

    hasher = hashlib.sha1()
    while True:
        data = filelike.read(2**18)
        if not data:
            break
        hasher.update(data)

    return hasher.hexdigest()


@app.post("/superres/")
def superres(params: SuperResRequestParams):
    result = superres_model(source_url=params.source_img_url)

    source_extention = get_extention(params.source_img_url)

    fd = BytesIO()
    result.save(fd, format=source_extention.upper())
    fd.seek(0)
    files = {'file': fd}
    r = requests.post(params.target_json.get("url"), data=params.target_json.get("fields"), files=files)
    print(r.content)
    r.raise_for_status()

    H, W = result.height, result.width
    size = fd.tell()

    return {"status": "ok", "h": H, "w": W, "size": size, "hash": get_image_hash(fd)}