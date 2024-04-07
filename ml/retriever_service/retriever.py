import sys
from io import BytesIO
from urllib.parse import urlparse

import pandas as pd
import requests
import torch
from PIL import Image
from clickhouse_driver import Client
from torch import nn
from tqdm.auto import tqdm

sys.path.append("../")

tqdm.pandas()


class ClickHouse:
    def __init__(self, client: Client):
        self.client = client
        self.json = {}
        self.image_weigth = 0.6
        self.name_weight = 0.2
        self.tags_weight = 0.2

    def _post_process_images(self, samples):
        samples = list(map(list, samples))
        return samples

    # def build_json(self, )
    def add(self, json):
        # print(df)
        # insert_info = self.preprocess_images_df(json)
        # print(insert_info)
        """
        json = {
            "id": id,
            "img_url": img_url,
            "image_embedding": image_embedding,
            "name_embedding": name_embedding,
            "tags_embedding": tags_embedding,
            "embedding": embedding,
            "tags": tags,
            "orientation_filter": orientation_filter,
            "extention_filter": extention_filter,
            "daytime_filter": daytime_filter,
            "season_filter": season_filter,
            "hidden": False
        }
        """

        # print(json)

        self.client.execute(
            "INSERT INTO images_embeddings_db (id, img_url, name, image_embedding, name_embedding, tags_embedding, embedding, tags, orientation_filter, extension_filter, daytime_filter, season_filter, hidden) VALUES",
            [json],
        )

    def _click_to_pd_images(self, click_out):
        # print(click_out)
        df = pd.DataFrame(columns=["id", "img_url", "name", "cos"], data=click_out)
        return df

    def retrieve(self, embedding, filters, query_by: str = "embedding", table: str = 'misis.images_embeddings_db',
                 order_by="score", k: int = 1):

        """
            SELECT
            id,
            img_url,
            cosineDistance({query_by}, {str(embedding[0].tolist())}) AS score
            FROM {table}

            SELECT *
            WHERE
        (orientation_filter IS vertical) AND (extension_filter IS jpg) AND (daytime_filter IS вечер) AND (season_filter IS лето)
            ORDER BY score ASC
            LIMIT 100
            FORMAT Vertical

        """
        if filters:
            request = f"""SELECT
                subquery.id,
                subquery.img_url,
                subquery.name,
                cosineDistance(subquery.{query_by}, {str(embedding[0].tolist())}) AS score
            FROM (
                SELECT *
                FROM {table}
                WHERE {" AND ".join([f"{key} = '{filters[key]}'" for key in filters])} AND hidden = false
            ) AS subquery
            ORDER BY {order_by} ASC
            LIMIT {k}
            FORMAT Vertical
            """

        else:
            request = f"""SELECT
                id,
                img_url,
                name,
                cosineDistance({query_by}, {str(embedding[0].tolist())}) AS score
                FROM {table}
                WHERE hidden = false
                ORDER BY {order_by} ASC
                LIMIT {k}
                FORMAT Vertical
            """

        # request = filt + sort_and_limit
        # print(request)

        result = self.client.execute(request)
        df = self._click_to_pd_images(result)

        return df

    def check_duplicates(self, embedding):
        request = f"""SELECT
            id,
            img_url,
            name,
            cosineDistance(image_embedding, {str(embedding[0].tolist())}) AS score
            FROM misis.images_embeddings_db
            WHERE hidden = False
            ORDER BY score ASC
            LIMIT 1
            FORMAT Vertical
        """

        result = self.client.execute(request)
        df = self._click_to_pd_images(result)

        return df

    def edit(self, json):
        data = json
        update_base = "ALTER TABLE misis.images_embeddings_db UPDATE "
        updates = []

        if data["name_embedding"] is not None:
            data["name_embedding"] = data["name_embedding"][0].tolist()

        if data["tags_embedding"] is not None:
            data["tags_embedding"] = data["tags_embedding"][0].tolist()

        # print(json, "OUTPUT")

        for key, value in data.items():
            if key != 'id' and value is not None:
                updates.append(f"{key} = '{value}'")

        if not updates:
            # print("Нет данных для обновления.")
            pass
        else:
            update_query = update_base + ", ".join(updates) + f" WHERE id = {data['id']}"
            # print("Сформированный SQL запрос:", update_query)

            self.client.execute(update_query)

        self.recalculate_embedding(data['id'])

    def recalculate_embedding(self, id):
        request = f"""SELECT
            image_embedding,
            name_embedding,
            tags_embedding,
            FROM misis.images_embeddings_db
            WHERE id = {id}
        """

        image_embedding, name_embedding, tags_embedding = [torch.tensor(embedding) for embedding in
                                                           self.client.execute(request)[0]]

        embedding = self.image_weigth * image_embedding + self.name_weight * name_embedding + self.tags_weight * tags_embedding

        update = f"""
            ALTER TABLE misis.images_embeddings_db UPDATE 
            embedding = {embedding.tolist()}
            WHERE id = {id}
        """

        self.client.execute(update)

    def hide_sample(self, id):
        update = f"""
            ALTER TABLE misis.images_embeddings_db UPDATE 
            hidden = True
            WHERE id = {id}
        """

        self.client.execute(update)

    def recover_sample(self, id):
        update = f"""
            ALTER TABLE misis.images_embeddings_db UPDATE 
            hidden = False
            WHERE id = {id}
        """

        self.client.execute(update)

    def get_num_samples(self, table: str = "misis.images_embeddings_db"):
        request = f"""
        SELECT COUNT() FROM {table};
        """

        return self.client.execute(request)[0][0]


class Retriever:
    def __init__(
            self,
            model,
            processor,
            tagger,
            translator,
            ood_model,
            clickhouse: ClickHouse,
            image_weigth: float = 0.6,
            name_weight: float = 0.2,
            tags_weight: float = 0.2,
            device: str = "cuda",
    ):
        super().__init__()
        self.device = device

        self.model = model
        self.model.eval()
        self.model.to(self.device)
        self.processor = processor
        self.tagger = tagger
        self.translator = translator
        self.ood_model = ood_model

        self.image_weigth = image_weigth
        self.name_weight = name_weight
        self.tags_weight = tags_weight

        self.clickhouse = clickhouse

        self.cos = nn.CosineSimilarity()

        self.seasons = ["зима", "весна", "лето", "осень"]
        self.daytimes = ["утро", "день", "вечер", "ночь"]
        self.season_embeddings = self.normalize_embedding(self.get_text_latents(self.seasons))
        self.daytime_embeddings = self.normalize_embedding(self.get_text_latents(self.daytimes))

    @torch.inference_mode()
    def get_text_latents(self, texts):
        text_latents = []

        inputs = self.processor(text=texts, return_tensors='pt', padding=True)
        text_latents.append(self.model.encode_text(inputs['input_ids'].to(self.device)))

        text_latents.append(torch.cat(text_latents, dim=0))
        text_latents = torch.stack(text_latents).mean(0)

        return text_latents

    @torch.inference_mode()
    def get_image_latents(self, images):
        image_latents = []

        inputs = self.processor(text='', images=images, return_tensors='pt', padding=True)
        image_latents.append(self.model.encode_image(inputs['pixel_values'].to(self.device)))

        image_latents = torch.cat(image_latents)

        return image_latents

    @staticmethod
    def normalize_embedding(embedding):
        return embedding / embedding.norm(dim=-1, keepdim=True)

    @staticmethod
    def _path_to_images(path):
        image = Image.open(path)
        return image

    @staticmethod
    def _url_to_images(url):
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        return image

    def add(self, id, img_url, name, return_json: bool = True):
        image = self._url_to_images(img_url)

        image_embedding = self.normalize_embedding(self.get_image_latents([image]))
        name_embedding = self.normalize_embedding(self.get_text_latents([name]).cpu())
        filters = self.get_filters(img_url, image, image_embedding)
        orientation_filter, extension_filter, daytime_filter, season_filter = filters

        image_embedding = image_embedding.cpu()

        tags = self.get_tags(image)
        ru_tags = list(map(self.translate, tags))
        tags_text = self.join_tags(ru_tags)

        tags_embedding = self.normalize_embedding(self.get_text_latents([tags_text]).cpu())

        embedding = self.image_weigth * image_embedding + self.name_weight * name_embedding + self.tags_weight * tags_embedding

        dupl_df = self.find_duplicates(image_embedding)
        dupl_df = dupl_df[dupl_df["cos"] < 0.15]
        dupl_ids = dupl_df["id"].tolist()

        torch.cuda.empty_cache()

        json = {
            "id": id,
            "img_url": img_url,
            "name": name,
            "image_embedding": image_embedding[0].tolist(),
            "name_embedding": name_embedding[0].tolist(),
            "tags_embedding": tags_embedding[0].tolist(),
            "embedding": embedding[0].tolist(),
            "tags": ru_tags,
            "orientation_filter": orientation_filter,
            "extension_filter": extension_filter,
            "daytime_filter": daytime_filter,
            "season_filter": season_filter,
            "hidden": False
        }

        self.clickhouse.add(json)

        return {
            "dupl_ids": dupl_ids,
            "tags": ru_tags,
            "filters": {
                "orientation_filter": orientation_filter,
                "extension_filter": extension_filter,
                "daytime_filter": daytime_filter,
                "season_filter": season_filter
            }
        }

    def edit(self, id, name=None, tags: list = None, filters: dict = None):
        json = {
            "id": id,
            "img_url": None,
            "name": None,
            "image_embedding": None,
            "name_embedding": None,
            "tags_embedding": None,
            "embedding": None,
            "tags": None,
            "orientation_filter": None,
            "extension_filter": None,
            "daytime_filter": None,
            "season_filter": None,
            "hidden": False
        }
        if name:
            json['name_embedding'] = self.normalize_embedding(self.get_text_latents([name]).cpu())
            json['name'] = name

        if tags:
            # json['tags'] = tags
            json['tags_embedding'] = self.normalize_embedding(self.get_text_latents([" ".join(tags)]).cpu())
        # orientation, extension, daytime, season

        if filters:
            if filters.get('orientation_filter'):
                json['orientation_filter'] = filters['orientation_filter']
            if filters.get('extension_filter'):
                json['extension_filter'] = filters['extension_filter']
            if filters.get('daytime_filter'):
                json['daytime_filter'] = filters['daytime_filter']
            if filters.get('season_filter'):
                json['season_filter'] = filters['season_filter']

        # filters = self.get_filters(img_url, image, image_embedding)
        # orientation_filter, extension_filter, daytime_filter, season_filter = filters

        # tags = self.get_tags(image)
        # tags_embedding = get_text_latens([tags])
        # print(filters)

        torch.cuda.empty_cache()

        self.clickhouse.edit(json)

    @staticmethod
    def get_orientation_filter(image):
        H, W = image.height, image.width

        if H > W:
            return "vertical"
        elif H < W:
            return "horizontal"
        else:
            return "square"

    def get_extension_filter(self, img_url):
        extension = urlparse(img_url).path.strip("/").rsplit(".", 1)[-1]
        return extension.lower()

    def get_daytime_filter(self, img_latent):
        scores = self.cos(img_latent.cpu(), self.daytime_embeddings.cpu()).softmax(dim=0)
        ind = scores.argmax(dim=0).item()
        return self.daytimes[ind]

    def get_season_filter(self, img_latent):
        scores = self.cos(img_latent.cpu(), self.season_embeddings.cpu()).softmax(dim=0)
        ind = scores.argmax(dim=0).item()
        return self.seasons[ind]

    def get_filters(self, img_url, image, img_latents):
        orientation_filter = self.get_orientation_filter(image)
        extension_filter = self.get_extension_filter(img_url)
        daytime_filter = self.get_daytime_filter(img_latents)
        season_filter = self.get_season_filter(img_latents)

        return orientation_filter, extension_filter, daytime_filter, season_filter

    def get_tags(self, image):
        tags = self.tagger(image)
        return tags

    @staticmethod
    def join_tags(tags):
        return " ".join(tags)

    def translate(self, text):
        return self.translator(text, "en", "ru")

    def detect_and_translate(self, text):
        source_lang = self.translator.detect_lang(text)
        return self.translator.translate(text, source_lang, "ru")

    def find_duplicates(self, image_embedding):
        return self.clickhouse.check_duplicates(image_embedding)

    def check_ood(self, text, tags):
        text = self.detect_and_translate(text)
        tags = self.detect_and_translate(self.join_tags(tags))

        text_embedding = self.get_text_latents([text]).cpu().numpy()
        tags_embedding = self.get_text_latents([tags]).cpu().numpy()

        text_ood_score = self.ood_model.predict(text_embedding).item()
        tags_ood_score = self.ood_model.predict(tags_embedding).item()

        return text_ood_score or tags_ood_score

    def hide_sample(self, id):
        self.clickhouse.hide_sample(id)

    def recover_sample(self, id):
        self.clickhouse.recover_sample(id)

    def query(self, img_url: str = None, text: str = None, tags: list = None, filters: dict = None, k: int = 5):
        """
        filters = {
            "orientation_filter": orientation_filter,
            "extension_filter": extention_filter,
            "daytime_filter": daytime_filter,
            "season_filter": season_filter,
        }
        """

        if img_url is not None:
            image = self._url_to_images(img_url)
            image_embedding = self.normalize_embedding(self.get_image_latents([image]))
            retrieved = self.clickhouse.retrieve(image_embedding, filters, query_by="image_embedding", k=k)

        else:
            if text is not None and tags is None:
                text = self.detect_and_translate(text)

                text_embedding = self.normalize_embedding(self.get_text_latents([text]))
                retrieved = self.clickhouse.retrieve(text_embedding, filters, query_by="embedding", k=k)

            elif tags is not None and text is None:
                tags = self.join_tags(tags)
                tags = self.detect_and_translate(tags)
                tags_embedding = self.normalize_embedding(self.get_text_latents([tags]))
                retrieved = self.clickhouse.retrieve(tags_embedding, filters, query_by="embedding", k=k)

            elif tags is not None and text is not None:
                text = self.detect_and_translate(text)
                tags = self.join_tags(tags)
                tags = self.detect_and_translate(tags)

                tags_embedding = self.normalize_embedding(self.get_text_latents([tags]))
                text_embedding = self.normalize_embedding(self.get_text_latents([text]))

                embedding = (text_embedding + tags_embedding) / 2
                retrieved = self.clickhouse.retrieve(embedding, filters, query_by="embedding", k=k)

            else:
                raise ValueError("Either img_url of text or tags or filters should not be equal to None")

        torch.cuda.empty_cache()
        # print(retrieved.columns, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        return {"id": retrieved["id"].tolist(), "img_url": retrieved["img_url"].tolist(),
                "name": retrieved["name"].tolist()}

    def __len__(self):
        return self.clickhouse.get_num_samples()
