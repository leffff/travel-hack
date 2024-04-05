
class Retriever:
    def __init__(
        self,
        model,
        preprocessor,
        clickhouse: ClickHouse,
        image_weigth: float = 0.7,
        text_weight: float = 0.3,
        device: str = "cuda",
    ):
        super().__init__()
        self.device = device

        self.model = model
        self.model.eval()
        self.model.to(self.device)
        self.preprocessor = preprocessor

        self.image_weigth .


    @torch.no_grad()
    def get_text_latents(self, texts):
        text_latents = []
        
        inputs = self.processor(text=texts, return_tensors='pt', padding=True)
        text_latents.append(self.model.encode_text(inputs['input_ids'].to(device)))   
        
        text_latents.append(torch.cat(text_latents, dim=0))
        text_latents = torch.stack(text_latents).mean(0)
        text_latents = text_latents / text_latents.norm(dim=-1, keepdim=True)
        
        return text_latents
    
    @torch.no_grad()
    def get_image_latents(self, images):       
            image_latents = []
        
            inputs = self.processor(text='', images=list(images), return_tensors='pt', padding=True)
            image_latents.append(self.model.encode_image(inputs['pixel_values'].to(device)))
        
            image_latents = torch.cat(image_latents)
            image_latents = image_latents / image_latents.norm(dim=-1, keepdim=True)
        
            return image_latents

    @staticmethod()
    def _paths_to_images(paths):
        images = [Image.open(path) for path in paths]
        return images

    def add(self, df, return_embeddings: bool = False):
        paths = df["path"].tolist()
        images = self._paths_to_images(paths)
        embeddingsself.get_image_latents(images)

        torch.cuda.empty_cache()

        self.clickhouse.add(df, embeddings)

        if return_embeddings:
            return embeddings

    
    def query(self, paths=None, texts=None, k):
        if paths is not None and texts is None:
            images = self._paths_to_images(paths)
            embedding = self.get_image_latents(images)
            
        elif paths if None texts is not None:
            embedding = self.get_text_latents(texts)

        elif paths is not None and texts is not None:
            images = self._paths_to_images(paths)
            embedding = self.get_image_latents(images)
            text_embeddings = self.get_text_latents(texts)
            embedding = self.image_weight * image_embeddings + self.text_weight * text_embeddings

        else:
            raise ValueError("Either paths of texts should not be equal to None")
        
        torch.cuda.empty_cache()
        return self.clickhouse.retrieve(embedding, k=k)

    def __len__(self):
        return self.clickhouse.get_num_samples()