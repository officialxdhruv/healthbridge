from fastapi import FastAPI
from pydantic import BaseModel

from models.disease_predictor import DiseaseModel

app = FastAPI()

# Load model once
disease_model = DiseaseModel()
disease_model.load_model("models/xgboost_model.json")


class PredictRequest(BaseModel):
    symptoms: list[str]


@app.get("/")
def home():
    return {
        "message": "Disease Prediction API Running"
    }


@app.post("/predict")
def predict(data: PredictRequest):

    # Convert symptoms into ML input array
    X = disease_model.prepare_symptoms_array(data.symptoms)

    prediction, probability = disease_model.predict(X)

    return {
        "disease": prediction,
        "probability": float(probability),
        "description": disease_model.get_predicted_description(),
        "precautions": disease_model.get_predicted_precautions()
    }