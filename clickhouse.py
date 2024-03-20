import pandas as pd
from clickhouse_driver import Client



class ClickHouse:
    def __init__(self, client: Client):
        self.client = client
        
    def preprocess_documents_df(self, documents_df, embeddings):
        documents_df["date"] = pd.to_datetime(documents_df["date"], format="%d.%m.%Y")
        documents_df["id"] = [k for k in range(0, documents_df.shape[0])]
        documents_df["embedding"] = embeddings.tolist()

        documents_df.to_json("documents+embeddings.json")

        file_path = "documents+embeddings.json"

        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        ids = data["id"]
        texts = data["text"]
        titles = data["title"]
        topics = data["topic"]
        urls = data["url"]
        dates = list(documents_df["date"])
        embeddings = data["embedding"]

        rows_to_insert = []
        for i in range(len(ids)):
            i_str = str(i)

            row = {
                "id": ids[i_str],
                "text": texts[i_str],
                "topic": topics[i_str],
                "title": titles[i_str],
                "url": urls[i_str],
                "date": dates[i],
                "embedding": embeddings[i_str],
            }
            rows_to_insert.append(row)

        return rows_to_insert

    def add(self, df, embeddings, table: str):
        insert_info = self.preprocess_faq_df(df, embeddings)
        self.client.execute(
            "INSERT INTO faq (id, topic, question, answer, embedding) VALUES",
            insert_info,
        )

    def _post_process_texts(self, samples):
        samples = list(map(list, samples))

        for i in range(len(samples)):
            samples[i][0] = samples[i][0].replace("\xa0", " ").strip()

        return samples

    def _click_to_pd_faq(self, click_out):
        df = pd.DataFrame(columns=["text", "cos"], data=click_out)
        return df

    def _click_to_pd_documents(self, click_out):
        df = pd.DataFrame(columns=["text", "date", "url", "cos"], data=click_out)
        return df

    def retrieve(self, embedding, table: str, order_by="score", k: int = 1):
        request = f"""
            SELECT
            answer,
            cosineDistance(embedding, {str(embedding[0].tolist())}) AS score
            FROM {table}
            ORDER BY {order_by} ASC
            LIMIT {k}
            FORMAT Vertical
            """


        click_out = self._post_process_texts(self.client.execute(request))

        df = self._click_to_pd_faq(click_out)

        return df

    def get_num_samples(self, table: str):
        request = f"""
        SELECT COUNT() FROM {table};
        """

        return self.client.execute(request)[0][0]