from PIL import Image
from diffusers import LDMSuperResolutionPipeline
import torch
import requests
from io import BytesIO
from urllib.parse import urlparse


class SuperResolutionModel:
    def __init__(self, model_id: str = "CompVis/ldm-super-resolution-4x-openimages", num_steps: int = 50, device: str = "cuda"):
        self.num_steps = num_steps
        self.pipeline = LDMSuperResolutionPipeline.from_pretrained(model_id)
        self.pipeline = self.pipeline.to(device)

    def get_extention_filter(self, img_url):
        extension = urlparse(img_url).path.strip("/").rsplit(".", 1)[-1]
        return extension

    @staticmethod
    def png_to_jpg(image):
        image = image.convert('RGB')
        return image

    def __call__(self, source_url: str):
        response = requests.get(source_url)
        image = Image.open(BytesIO(response.content))

        extention = self.get_extention_filter(source_url)
        if extention == "png":
            image = self.png_to_jpg(image)

        upscaled_image = self.pipeline(image, num_inference_steps=self.num_steps, eta=1).images[0]
        torch.cuda.empty_cache()

        return upscaled_image