from PIL import Image
from diffusers import LDMSuperResolutionPipeline
import torch


class SuperResolutionModel:
    def __init__(self, model_id: str = "CompVis/ldm-super-resolution-4x-openimages", num_steps: int = 50, device: str = "cuda"):
        self.num_steps = num_steps
        self.pipeline = LDMSuperResolutionPipeline.from_pretrained(model_id)
        self.pipeline = self.pipeline.to(device)

    def __call__(self, image: Image):
        upscaled_image = self.pipeline(image, num_inference_steps=self.num_steps, eta=1).images[0]
        torch.cuda.empty_cache()
        return upscaled_image