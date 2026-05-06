import math

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from models.disease_predictor import DiseaseModel

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
disease_model = DiseaseModel()
disease_model.load_model("models/xgboost_model.json")


class PredictRequest(BaseModel):
    symptoms: list[str]


@app.get("/")
def home():
    return {"message": "Disease Prediction API Running"}


@app.get("/symptoms")
def get_symptoms():
    return {"symptoms": list(disease_model.all_symptoms)}


@app.post("/predict")
def predict(data: PredictRequest):

    X = disease_model.prepare_symptoms_array(data.symptoms)

    prediction, probability = disease_model.predict(X)

    # Debug logs
    print("Prediction:", prediction)
    print("Probability:", probability)

    if probability is None or math.isnan(float(probability)):

        probability = 0.0

    return {
        "disease": str(prediction),
        "probability": float(probability),
        "description": str(disease_model.get_predicted_description()),
        "precautions": [
            str(item) for item in disease_model.get_predicted_precautions()
        ],
    }
