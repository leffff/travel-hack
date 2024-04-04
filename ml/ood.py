from catboost import CatBoostClassifier

class OOD_classfier:
    def __init__(self, model_path):
        self.model = CatBoostClassifier()  # parameters not required.
        self.model.load_model(model_path)

    def predict(self, sample: np.array) -> int:
        return self.model.predict(sample)