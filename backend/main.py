import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.base import BaseEstimator, TransformerMixin

# ── Custom transformer (must be defined before loading the pipeline) ──
class ZeroToNaNTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns=None):
        self.columns = columns

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        for col in self.columns:
            X[col] = X[col].replace(0, np.nan)
        return X


# ── Load model ──
import __main__
__main__.ZeroToNaNTransformer = ZeroToNaNTransformer

MODEL_PATH = "best_diabetes_model.joblib"
model = joblib.load(MODEL_PATH)

# ── App ──
app = FastAPI(title="Diabetes Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

FEATURE_ORDER = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]

GS_PATH = "best_gridsearch_object.joblib"
gs = joblib.load(GS_PATH)


@app.get("/model-info")
def model_info():
    clf = model.named_steps["classifier"]
    model_type = type(clf).__name__

    # Feature importances from the classifier
    importances = clf.feature_importances_
    feature_importance = sorted(
        [
            {"name": name, "importance": round(float(imp) * 100, 1)}
            for name, imp in zip(FEATURE_ORDER, importances)
        ],
        key=lambda x: x["importance"],
        reverse=True,
    )

    # CV scores from the saved GridSearchCV object
    best_idx = gs.best_index_
    cv_results = gs.cv_results_
    train_accuracy = round(float(cv_results["mean_train_accuracy"][best_idx]) * 100)
    test_accuracy = round(float(cv_results["mean_test_accuracy"][best_idx]) * 100)
    roc_auc = round(float(gs.best_score_), 4)

    return {
        "model_type": model_type,
        "train_accuracy": train_accuracy,
        "test_accuracy": test_accuracy,
        "roc_auc": roc_auc,
        "best_params": {k.replace("classifier__", ""): v for k, v in gs.best_params_.items()},
        "features": FEATURE_ORDER,
        "feature_importance": feature_importance,
        "dataset_size": 768,
    }


class PredictionInput(BaseModel):
    pregnancies: float = Field(ge=0, le=20)
    glucose: float = Field(ge=0, le=300)
    bloodPressure: float = Field(ge=0, le=200)
    skinThickness: float = Field(ge=0, le=100)
    insulin: float = Field(ge=0, le=900)
    bmi: float = Field(ge=0, le=80)
    diabetesPedigree: float = Field(ge=0, le=2.5)
    age: float = Field(ge=1, le=120)


@app.post("/predict")
def predict(data: PredictionInput):
    row = pd.DataFrame([{
        "Pregnancies": data.pregnancies,
        "Glucose": data.glucose,
        "BloodPressure": data.bloodPressure,
        "SkinThickness": data.skinThickness,
        "Insulin": data.insulin,
        "BMI": data.bmi,
        "DiabetesPedigreeFunction": data.diabetesPedigree,
        "Age": data.age,
    }], columns=FEATURE_ORDER)

    proba = model.predict_proba(row)[0]  # [prob_class_0, prob_class_1]
    diabetes_probability = float(proba[1])
    prediction = int(model.predict(row)[0])

    return {
        "probability": round(diabetes_probability * 100, 1),
        "prediction": prediction,
    }
