import pandas as pd
from clickhouse_driver import Client
import json


class ClickHouse:
    def __init__(self, client: Client):
        self.client = client
        
    def preprocess_images_df(self, images_df, embeddings):
        images_df["Image_id"] = [k for k in range(0, images_df.shape[0])]
        images_df["embedding"] = embeddings.tolist()
        images_df["path"] = images_df["path"]
        images_df.to_json("images+embeddings.json")

        file_path = "images+embeddings.json"

        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        ids = data["id"]
        embeddings = data["embedding"]
        paths = data["path"]

        rows_to_insert = []
        for i in range(len(ids)):
            i_str = str(i)

            row = {
                "Image_id": ids[i_str],
                "path": paths[i_str],
                "embedding": embeddings[i_str],
            }
            rows_to_insert.append(row)

        return rows_to_insert

    def _post_process_images(self, samples):
        samples = list(map(list, samples))
        return samples

    def add(self, df, embeddings):
        insert_info = self.preprocess_images_df(df, embeddings)
        self.client.execute(
            "INSERT INTO images_embeddings_db (Image_id, path, embedding) VALUES",
            insert_info,
        )

    def _click_to_pd_images(self, click_out):
        df = pd.DataFrame(columns=["path",  "cos"], data=click_out)
        return df

    def retrieve(self, embedding, table: str = 'images_embeddings_db', order_by="score", k: int = 1):
        request = f"""
            SELECT
            path,
            cosineDistance(embedding, {str(embedding[0].tolist())}) AS score
            FROM {table}
            ORDER BY {order_by} ASC
            LIMIT {k}
            FORMAT Vertical
            """


        #click_out = self._post_process_texts(self.client.execute(request))

        df = self._click_to_pd_images(request)

        return df

    def get_num_samples(self, table: str):
        request = f"""
        SELECT COUNT() FROM {table};
        """

        return self.client.execute(request)[0][0]