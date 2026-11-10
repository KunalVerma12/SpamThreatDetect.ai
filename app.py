
import pickle
import __main__
import transformers
import threat_preprocessing
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from url_reputation import extract_urls, check_url_reputation
from llm_explainer import explain_prediction


# ==================================================
# 1. LOAD SPAM MODEL
# ==================================================

__main__.CustomFeatureEngineer = transformers.CustomFeatureEngineer
__main__.NLPPreprocessor = transformers.NLPPreprocessor
__main__.Word2VecTransformer = transformers.Word2VecTransformer

with open("email_spam_detection_model.pkl", "rb") as file:
    model = pickle.load(file)


# ==================================================
# 2. LOAD PERSONAL SAFETY THREAT MODEL
# ==================================================

__main__.NLPPreprocessor = threat_preprocessing.NLPPreprocessor

with open("email_threat_detection_model.pkl", "rb") as file:
    threat_model = pickle.load(file)


# ==================================================
# 3. FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="Sentinel AI - Email Threat Analyzer",
    description="AI-based email spam, phishing and personal safety threat detection",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Sentinel AI - Email Threat Analyzer",
        "version": "1.0"
    }


# ==================================================
# 4. INPUT VALIDATION
# ==================================================

class Email(BaseModel):

    model_config = ConfigDict(extra="forbid")

    text: str = Field(min_length=1, max_length=50000)

    subject: str = Field(default="", max_length=500)

    sender: EmailStr | Literal["unknown"] = "unknown"

    receiver: EmailStr | Literal["unknown"] = "unknown"


# ==================================================
# 5. PREDICTION ENDPOINT
# ==================================================

@app.post("/predict")
def predict_email(email: Email):

    # ==============================================
    # A. SPAM / PHISHING DETECTION
    # ==============================================

    data = pd.DataFrame([email.model_dump()])

    # Check whether sender or receiver is unknown
    if (
        str(email.sender).lower() == "unknown"
        or str(email.receiver).lower() == "unknown"
    ):

        prediction = 1
        confidence = None

    else:

        # Use the original ML model
        prediction = int(model.predict(data)[0])

        confidence = None

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(data)[0]

            predicted_index = list(model.classes_).index(prediction)

            confidence = round(
                float(probabilities[predicted_index]) * 100,
                2
            )

    if prediction == 1:
        result = "Spam/Phishing"
    else:
        result = "Legitimate"


    # ==============================================
    # B. PERSONAL SAFETY THREAT DETECTION
    # ==============================================

    threat_data = pd.DataFrame({
        "text": [email.text]
    })

    threat_prediction = threat_model.predict(threat_data)[0]

    threat_labels = [
        "physical_violence",
        "death_threat",
        "blackmail_extortion",
        "stalking"
    ]

    threat_results = {
        label: int(value)
        for label, value in zip(threat_labels, threat_prediction)
    }

    detected_threats = [
        label
        for label, value in threat_results.items()
        if value == 1
    ]


    # ==============================================
    # C. URL EXTRACTION AND REPUTATION
    # ==============================================

    urls = extract_urls(email.text, email.subject)

    url_reports = [
        check_url_reputation(url)
        for url in urls
    ]


    # ==============================================
    # D. FINAL THREAT ASSESSMENT
    # ==============================================

    malicious_url = any(
        report.get("status") in ("malicious", "suspicious")
        for report in url_reports
    )

    if detected_threats:

        final_assessment = "Potential personal safety threat"

    elif prediction == 1:

        final_assessment = "Potential spam/phishing threat"

    elif malicious_url:

        final_assessment = "Potential malicious URL threat"

    elif not urls:

        final_assessment = "No threat detected"

    elif all(
        report.get("status") == "no_malicious_detections"
        for report in url_reports
    ):

        final_assessment = "No threat detected"

    else:

        final_assessment = "No threat detected by model; URL unverified"


    # ==============================================
    # E. GROQ AI EXPLANATION
    # ==============================================

    try:

        explanation = explain_prediction(
            text=email.text,
            subject=email.subject,
            prediction=prediction,
            confidence=confidence,
            url_reports=url_reports,
            personal_safety_threats=threat_results
        )

    except Exception as e:

        print("Groq explanation error:", e)

        explanation = "Explanation unavailable. Please try again."


    # ==============================================
    # F. API RESPONSE
    # ==============================================

    return {
        "spam_prediction": prediction,
        "spam_category": result,
        "spam_confidence": confidence,
        "personal_safety_threats": threat_results,
        "detected_personal_safety_threats": detected_threats,
        "urls_found": urls,
        "url_reports": url_reports,
        "final_assessment": final_assessment,
        "explanation": explanation
    }
