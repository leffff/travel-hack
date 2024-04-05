import numpy as np
from catboost import CatBoostClassifier


class OOD:
    def __init__(self, model_path, threshold):
        self.model = CatBoostClassifier()  # parameters not required.
        self.model.load_model(model_path)
        self.threshold = threshold

    def predict(self, sample: np.array) -> int:
        return self.model.predict_proba(sample)[:, 1] > self.threshold