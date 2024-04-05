from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import shutil
from pydantic import BaseModel
from PIL import Image

from superres import SuperResolutionModel


class SuperResRequestParams(BaseModel):
    image_path: str


app = FastAPI()

model_id: str = "CompVis/ldm-super-resolution-4x-openimages"
num_steps: int = 50
device: str = "cuda"

superres_model = SuperResolutionModel(model_id, num_steps, device)


@app.post("/superres_run")
def superres_run(params: SuperResRequestParams):
    result = superres_model(Image.open(params.image_path))
    result.save("upscaled_image.jpg")
    return {"result": "upscaled_image.jpg"}