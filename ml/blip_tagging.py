import torch
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import nltk
from nltk.corpus import stopwords
#nltk.download('stopwords')
#print(stops)
class Tagger:
    def __init__(self, tagger_id, torch_dtype=torch.float16):
        self.dtype = torch_dtype
        self.processor = BlipProcessor.from_pretrained(tagger_id)
        self.model = BlipForConditionalGeneration.from_pretrained(tagger_id, torch_dtype=self.dtype).to("cuda")
        self.stops = set(stopwords.words('english'))

    def __call__(self, image: Image):
        return Tagger.extract_tags(self, image)

    def generate_text(self, image: Image) -> str:
        text = ""
        inputs = self.processor(image, text, return_tensors="pt").to("cuda", torch.float16)

        out = self.model.generate(**inputs)
        output_text = self.processor.decode(out[0], skip_special_tokens=True)
        return output_text

    def extract_tags(self, image: Image):
        generated_text = Tagger.generate_text(self, image).split(' ')
        #print(generated_text)
        list_of_tags = []
        for i in range(len(generated_text)):
          if generated_text[i] not in self.stops:
              list_of_tags.append(generated_text[i])
        return list_of_tags