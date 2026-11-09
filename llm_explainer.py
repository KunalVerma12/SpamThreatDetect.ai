
import os
import traceback

from dotenv import load_dotenv
from groq import Groq


# ==================================================
# 1. LOAD GROQ API KEY
# ==================================================

load_dotenv("gemini.env")

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in gemini.env")


# ==================================================
# 2. GROQ CLIENT
# ==================================================

client = Groq(
    api_key=api_key,
    timeout=30.0,
    max_retries=1
)


# ==================================================
# 3. EXPLANATION FUNCTION
# ==================================================

def explain_prediction(
    text,
    subject,
    prediction,
    confidence,
    url_reports,
    personal_safety_threats
):

    # ----------------------------------------------
    # Spam / phishing prediction
    # ----------------------------------------------

    category = (
        "Spam/Phishing"
        if prediction == 1
        else "Legitimate (Ham)"
    )

    # ----------------------------------------------
    # Personal safety predictions
    # ----------------------------------------------

    threat_names = {
        "physical_violence": "Physical Violence",
        "death_threat": "Death Threat",
        "blackmail_extortion": "Blackmail/Extortion",
        "stalking": "Stalking"
    }

    detected_threats = [
        threat_names.get(label, label)
        for label, value in personal_safety_threats.items()
        if value == 1
    ]

    if detected_threats:
        safety_result = ", ".join(detected_threats)
    else:
        safety_result = "No personal safety threats detected"


    # ==================================================
    # 4. PROMPT
    # ==================================================

    prompt = f"""
You are an email security explanation assistant.

Two machine learning models have analyzed an email.

Your task is ONLY to explain their predictions.
Do not make new predictions or change their results.

SPAM / PHISHING MODEL

Prediction: {category}
Confidence: {confidence}%

PERSONAL SAFETY MODEL

Predictions:
{personal_safety_threats}

Detected categories:
{safety_result}


EMAIL SUBJECT:

{subject}


EMAIL BODY:

{text}


URL REPUTATION REPORTS:

{url_reports}


INSTRUCTIONS:

1. Explain the spam/phishing prediction using evidence
   from the email.

2. Explain the personal safety model's detected categories.

3. Identify the exact words or statements that support
   each detected category, when available.

4. If both models detect threats, explain both separately.

5. If neither model detects threats, say that no threats
   were detected by these models. Do not claim the email
   is guaranteed safe.

6. Mention suspicious URLs only when supported by the
   supplied URL reputation reports.

7. If no URLs are present, mention that no URLs were found.

8. Never invent sender details, URLs, or security findings.

9. Do not treat model predictions as confirmed facts.

10. Confidence applies only to the spam/phishing model.
    Do not invent confidence scores for the safety model.

11. Do not change or override either model's predictions.

12. Keep the explanation concise, approximately 4-6 sentences.

Return only the explanation in plain text.
"""


    # ==================================================
    # 5. GROQ API REQUEST
    # ==================================================

    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You explain email security predictions "
                        "using evidence from supplied information. "
                        "Never invent evidence or change "
                        "machine learning predictions."
                    )
                },

                {
                    "role": "user",
                    "content": prompt
                }
            ],

            max_completion_tokens=450
        )


        # Extract response

        explanation = response.choices[0].message.content

        if not explanation or not explanation.strip():

            print("Groq returned an empty explanation.")

            return "The AI explanation was empty. Please try again."


        return explanation.strip().replace("**", "").replace("*", "")


    # ==================================================
    # 6. ERROR HANDLING
    # ==================================================

    except Exception as e:

        print("\n========== GROQ ERROR ==========")

        print("Error:", repr(e))

        traceback.print_exc()

        print("================================\n")

        return (
            f"The email was classified as {category} "
            f"with {confidence}% confidence. "
            f"Personal safety detections: {safety_result}. "
            "The Groq explanation service is temporarily unavailable."
        )
