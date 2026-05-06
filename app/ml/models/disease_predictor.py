import xgboost as xgb
import pandas as pd
import numpy as np

"""
DiseaseModel

This class wraps an XGBoost model and provides a clean interface for
disease prediction and related information retrieval.

Features:
---------
1. Predict disease from symptoms
   - Takes symptom input (feature vector)
   - Uses trained model to predict a disease
   - Returns:
       * disease name
       * confidence (probability)

   Example:
       [fever=1, cough=1, headache=0, ...] → "Flu" (0.87 confidence)

2. Explain the disease
   - Reads from CSV file
   - Returns description of the predicted or given disease

3. Provide precautions
   - Returns a list of precautions such as:
       * "Drink water"
       * "Rest"
       * "Consult doctor"

4. Model management
   - Load trained XGBoost model from file
   - Save trained model to file

5. Dataset metadata handling
   - Extracts:
       * all symptom names (feature columns)
       * all disease labels (target categories)

Note:
-----
This class is intended for inference (prediction) and not for training.
"""


class DiseaseModel:
    def __init__(self):
        # Model and prediction state
        self.model = xgb.XGBClassifier()
        self.predicted_disease = None

        # Dataset-related attributes
        self.all_symptoms = None
        self.symptom_input = None

        # Load list of disease labels
        self.disease_labels = self._load_disease_labels()

    # ---------------------------
    # Model Persistence
    # ---------------------------
    def load_model(self, model_path: str):
        """Load trained XGBoost model from file"""
        self.model.load_model(model_path)

    def save_model(self, model_path: str):
        """Save trained XGBoost model to file"""
        self.model.save_model(model_path)

    # ---------------------------
    # Prediction
    # ---------------------------
    def predict(self, X):
        """
        Predict disease from input symptoms.
        Returns:
            (disease_name, probability)
        """
        self.symptom_input = X

        # Predict class index
        pred_index = self.model.predict(X)

        # Map index to disease name
        self.predicted_disease = self.disease_labels[pred_index].values[0]

        # Get prediction probability
        probabilities = self.model.predict_proba(X)
        confidence = probabilities[0, pred_index[0]]

        return self.predicted_disease, confidence

    # ---------------------------
    # Disease Description
    # ---------------------------
    def get_disease_description(self, disease_name: str):
        """Return textual description of a disease"""
        if disease_name not in self.disease_labels:
            return "Disease not found in model"

        desc_df = pd.read_csv("datasets/symptom_Description.csv")
        desc_df = desc_df.apply(lambda col: col.str.strip())

        return desc_df[desc_df["Disease"] == disease_name]["Description"].values[0]

    def get_predicted_description(self):
        """Description of last predicted disease"""
        if self.predicted_disease is None:
            return "No prediction made yet"

        return self.get_disease_description(self.predicted_disease)

    # ---------------------------
    # Precautions
    # ---------------------------
    def get_disease_precautions(self, disease_name: str):
        """Return list of precautions for a disease"""
        if disease_name not in self.disease_labels:
            return "Disease not found in model"

        prec_df = pd.read_csv("datasets/symptom_precaution.csv")
        prec_df = prec_df.apply(lambda col: col.str.strip())

        precautions = prec_df[prec_df["Disease"] == disease_name].filter(
            regex="Precaution"
        )

        return precautions.values.tolist()[0]

    def get_predicted_precautions(self):
        """Precautions for last predicted disease"""
        if self.predicted_disease is None:
            return "No prediction made yet"

        return self.get_disease_precautions(self.predicted_disease)

    # ---------------------------
    # Internal Helpers
    # ---------------------------
    def _load_disease_labels(self):
        """
        Load dataset and extract disease categories.
        Also stores all symptom column names.
        """
        df = pd.read_csv("datasets/clean_dataset.tsv", sep="\t")

        X = df.iloc[:, :-1]  # Features (symptoms)
        y = df.iloc[:, -1]  # Target (disease)

        self.all_symptoms = X.columns

        # Convert labels to categorical and return unique classes
        y = y.astype("category")
        return y.cat.categories

    def prepare_symptoms_array(self, selected_symptoms):
        symptom_vector = []

        for symptom in self.all_symptoms:
            symptom_vector.append(1 if symptom in selected_symptoms else 0)

        return np.array([symptom_vector])
