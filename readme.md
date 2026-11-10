# 🛡️ Sentinel AI — Intelligent Email Threat Detection System

<p align="center">
  <strong>An AI-powered email security and threat intelligence platform</strong>
  <br>
  Detect spam, phishing, malicious URLs, and personal safety threats using Machine Learning, NLP, external threat intelligence, and LLM-powered explanations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?logo=python">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react">
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi">
  <img src="https://img.shields.io/badge/LLM-Groq-black">
  <img src="https://img.shields.io/badge/Threat_Intelligence-VirusTotal-blue">
</p>

---

## 📌 Overview

**Sentinel AI** is an intelligent email threat detection and analysis platform designed to identify potentially harmful email communications through multiple layers of security analysis.

Traditional spam filters primarily focus on determining whether an email is spam or legitimate. However, modern email-based threats extend beyond conventional spam, including phishing attempts, malicious URLs, intimidation, blackmail, stalking, and threats of physical violence.

Sentinel AI addresses this broader security problem by integrating multiple machine learning models, URL reputation intelligence, and large language model-based explanations into a unified analysis pipeline.

The application combines a modern React and TypeScript frontend with a Python FastAPI backend, allowing users to analyze email communications through an interactive security dashboard.

Rather than relying on a single classifier, Sentinel AI combines different detection mechanisms to provide a more comprehensive view of email security.

---

## ✨ Key Features

### 1. Spam and Phishing Detection

Uses a trained machine learning pipeline to classify incoming email content into:

- **Spam / Phishing:** Potentially unwanted, deceptive, or malicious email.
- **Legitimate:** Email classified as non-spam by the trained model.

The spam detection pipeline incorporates custom NLP and feature engineering components.

It also provides a model confidence score when probability estimates are available.

### 2. Personal Safety Threat Detection

One of the distinguishing components of Sentinel AI is its personal safety threat classification system.

It identifies four categories of potentially harmful communication:

| Threat Category | Description |
|---|---|
| Physical Violence | Detects language indicating possible physical harm or violence. |
| Death Threat | Identifies communication containing potential threats to someone's life. |
| Blackmail / Extortion | Detects attempts to intimidate or coerce individuals. |
| Stalking | Identifies potentially threatening or harassing communication. |

The system evaluates these categories independently, allowing multiple threat labels to be identified in a single email.

### 3. URL Extraction and Reputation Analysis

Emails frequently contain suspicious links designed to redirect users toward malicious websites, phishing pages, or other potentially harmful destinations.

Sentinel AI automatically extracts URLs from:

- Email body text.
- Email subject lines.
- Markdown-formatted links.
- Standard HTTP and HTTPS links.
- URLs beginning with `www`.

Extracted URLs are checked against the VirusTotal URL reputation API.

Possible reputation results include:

| Status | Meaning |
|---|---|
| Malicious | VirusTotal reports malicious detections. |
| Suspicious | Suspicious detections are reported. |
| No malicious detections | The available report contains no malicious or suspicious detections. |
| No report | No existing reputation report is available. |
| Lookup error | The reputation lookup could not be completed. |

The system also retrieves available malicious, suspicious, harmless, and undetected detection counts.

### 4. AI-Powered Threat Explanation

Sentinel AI integrates the Groq API to generate natural-language explanations of analysis results.

Instead of displaying only machine learning predictions, the system provides contextual explanations based on:

- Spam and phishing classification.
- Model confidence when available.
- Personal safety threat predictions.
- URL reputation results.

This makes the results easier to understand and interpret.

If the Groq explanation service is unavailable, the backend returns a fallback message instead of failing the entire analysis.

### 5. Unified Threat Assessment

The system combines its detection results into an overall assessment.

Possible assessments include:

- `Potential personal safety threat`
- `Potential spam/phishing threat`
- `Potential malicious URL threat`
- `No threat detected`
- `No threat detected by model; URL unverified`

Personal safety threats receive priority in the final assessment, followed by spam/phishing and malicious URL findings.

### 6. Modern React Security Dashboard

Sentinel AI features a modern React and TypeScript frontend that replaces the previous Streamlit interface.

The application includes five primary sections:

**Dashboard**
- Email analysis statistics.
- Spam and phishing detections.
- Personal safety threat statistics.
- URL threat statistics.
- Threat distribution visualizations.
- Recent analysis activity.

**Email Analyzer**
- Email subject input.
- Sender and receiver addresses.
- Email body input.
- Automated threat analysis.
- Loading and error states.
- Detailed prediction results.

**Analysis History**
- Previously analyzed emails within the current session.
- Classification results.
- Threat assessments.
- Analysis details.

**Threat Intelligence**
- Extracted URLs.
- VirusTotal reputation reports.
- Malicious and suspicious indicators.
- URL detection statistics.

**About**
- Project overview.
- Detection engine components.
- System architecture.
- Technology information.

The frontend communicates with the FastAPI backend through a centralized Axios API service.

Analysis history and dashboard statistics are currently session-based rather than permanently stored.

---

## 🏗️ System Architecture

Sentinel AI follows a decoupled frontend-backend architecture with a React frontend communicating with a FastAPI backend.

```mermaid
flowchart TD
    A["User"] --> B["React + TypeScript Frontend"]

    B --> C["Vite Application"]
    C --> D["Axios API Client"]

    D --> E["FastAPI Backend"]

    E --> F["Spam / Phishing ML Model"]
    E --> G["Personal Safety Threat Model"]
    E --> H["URL Extraction"]

    H --> I["VirusTotal API"]

    F --> J["Threat Assessment Engine"]
    G --> J
    I --> J

    J --> K["Groq AI Explanation"]

    K --> L["Unified JSON Response"]
    L --> M["React Results Dashboard"]
```

### Analysis Pipeline

1. The user submits email information through the React dashboard.
2. The frontend validates the input.
3. Axios sends the email data to the FastAPI `/predict` endpoint.
4. The backend validates the incoming request.
5. The spam detection model classifies the email.
6. The personal safety model evaluates four threat categories.
7. URLs are extracted from the email subject and body.
8. Extracted URLs are checked using VirusTotal.
9. The backend combines the available detection results.
10. Groq generates a natural-language explanation.
11. The final assessment is returned as a JSON response.
12. React displays the results through the security dashboard.

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| React 19 | Frontend application |
| TypeScript 5.7 | Static typing and application development |
| Vite 6 | Frontend development server and build tooling |
| Tailwind CSS 4 | Styling and responsive design |
| React Router 7 | Client-side navigation |
| Axios | HTTP communication with FastAPI |
| Recharts | Data visualization |
| Lucide React | Interface icons |
| FastAPI | Backend API development |
| Scikit-learn | Machine learning pipelines and transformations |
| NLP | Text preprocessing and feature extraction |
| Gensim | Word2Vec and NLP utilities |
| NLTK | Tokenization, stemming, and linguistic preprocessing |
| Pandas | Structured input processing |
| NumPy | Numerical operations |
| Pickle | Serialization and loading of trained models |
| Groq API | LLM-powered explanations |
| VirusTotal API | URL reputation intelligence |
| Pydantic | API input validation |

---

## 📂 Project Structure

```text
SpamThreatDetect.ai/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── analyzer/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── threats/
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analyzer.tsx
│   │   │   ├── History.tsx
│   │   │   ├── ThreatIntelligence.tsx
│   │   │   └── About.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── app.py
├── transformers.py
├── threat_preprocessing.py
├── url_reputation.py
├── llm_explainer.py
├── down.py
│
├── email_spam_detection_model.pkl
├── email_threat_detection_model.pkl
│
├── gemini.env
├── virustotal.env
│
├── .gitattributes
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Before running Sentinel AI, make sure you have:

- Python 3.10 or later.
- Node.js 18 or later.
- npm.
- Git.
- Git LFS.
- A Groq API key.
- A VirusTotal API key.

### 1. Clone the Repository

```bash
git clone https://github.com/KunalVerma12/SpamThreatDetect.ai.git

cd SpamThreatDetect.ai
```

### 2. Install Git LFS and Download Model Files

The trained machine learning models are essential for the application.

They are tracked using Git Large File Storage (Git LFS).

Install Git LFS if it is not already installed:

```bash
git lfs install
```

Download the actual model files:

```bash
git lfs pull
```

Verify that the required model files are present:

```bash
ls -lh *.pkl
```

Required files:

```text
email_spam_detection_model.pkl
email_threat_detection_model.pkl
```

**Important:** The application requires these trained model files to initialize its prediction pipeline.

### 3. Create a Python Virtual Environment

```bash
python3 -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

### 4. Install Backend Dependencies

```bash
pip install fastapi "uvicorn[standard]" requests pandas numpy scikit-learn gensim nltk groq python-dotenv pydantic email-validator
```

Install any additional dependencies required by your local backend modules.

### 5. Download NLTK Resources

Run:

```bash
python down.py
```

This downloads the WordNet and Open Multilingual WordNet resources used by the NLP preprocessing pipeline.

Ensure that any additional NLTK resources required by the preprocessing code are also available.

### 6. Configure API Keys

Create the required environment files in the project root.

**File: `gemini.env`**

```env
GROQ_API_KEY=your_groq_api_key
```

**File: `virustotal.env`**

```env
VT_API_KEY=your_virustotal_api_key
```

Obtain API keys from:

- Groq: https://console.groq.com/
- VirusTotal: https://www.virustotal.com/

Never commit actual API keys or secret credentials to GitHub.

### 7. Set Up the React Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

The frontend uses React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Recharts, and Lucide React.

### 8. Configure Frontend Environment

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This configures the frontend to communicate with the local FastAPI backend.

---

## 🚀 Running the Application

Sentinel AI uses two separate processes: a FastAPI backend and a React frontend.

### Step 1: Start the FastAPI Backend

Open a terminal in the project root and activate the virtual environment:

```bash
source venv/bin/activate
```

Start the backend:

```bash
uvicorn app:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

### Step 2: Start the React Frontend

Open another terminal:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will generally be available at:

```text
http://localhost:5173
```

Make sure the FastAPI backend is running before submitting an email for analysis.

### Step 3: Build for Production

Navigate to the frontend directory:

```bash
cd frontend
```

Generate an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the TypeScript check:

```bash
npm run typecheck
```

---

## 🔌 API Documentation

### Prediction Endpoint

**Endpoint**

```http
POST /predict
```

**Base URL**

```text
http://127.0.0.1:8000
```

### Request Body

The API accepts a JSON payload containing email information.

```json
{
  "text": "Your email body goes here.",
  "subject": "Important Account Notification",
  "sender": "sender@example.com",
  "receiver": "receiver@example.com"
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| text | String | Yes | Email body, maximum 50,000 characters |
| subject | String | No | Email subject, maximum 500 characters |
| sender | Email / unknown | No | Sender email address |
| receiver | Email / unknown | No | Receiver email address |

The sender and receiver default to `unknown` when omitted. In the current backend implementation, if either is unknown, the spam classifier returns a spam/phishing prediction rather than executing the normal model prediction.

### Example Response

```json
{
  "spam_prediction": 1,
  "spam_category": "Spam/Phishing",
  "spam_confidence": 96.45,
  "personal_safety_threats": {
    "physical_violence": 0,
    "death_threat": 1,
    "blackmail_extortion": 0,
    "stalking": 0
  },
  "detected_personal_safety_threats": [
    "death_threat"
  ],
  "urls_found": [],
  "url_reports": [],
  "final_assessment": "Potential personal safety threat",
  "explanation": "AI-generated explanation of the analysis."
}
```

*The above is an illustrative response demonstrating the API structure, not a measured result from an actual test.*

### Response Fields

| Field | Description |
|---|---|
| spam_prediction | Numerical spam classification |
| spam_category | Spam/Phishing or Legitimate |
| spam_confidence | Spam model confidence when available |
| personal_safety_threats | Individual threat category predictions |
| detected_personal_safety_threats | List of detected safety threats |
| urls_found | Extracted URLs |
| url_reports | VirusTotal reputation results |
| final_assessment | Combined threat assessment |
| explanation | Groq-generated explanation |

---

## 🧠 Machine Learning Components

### Spam Detection Model

The spam classification system uses a serialized machine learning pipeline.

The project includes custom transformers in `transformers.py`, including:

- `CustomFeatureEngineer`
- `NLPPreprocessor`
- `Word2VecTransformer`

These components support feature engineering and NLP-based text representation.

The trained pipeline is loaded from:

```text
email_spam_detection_model.pkl
```

### Personal Safety Threat Model

The second model focuses on identifying potentially harmful communication.

It uses a dedicated preprocessing module:

```text
threat_preprocessing.py
```

The model is loaded from:

```text
email_threat_detection_model.pkl
```

Its multi-label prediction output represents four independent personal safety threat categories.

---

## 🔐 Security and Configuration

Sentinel AI integrates external services and serialized machine learning models.

Important security considerations:

- Keep API keys inside local environment files.
- Never expose API credentials in frontend code.
- Do not commit `.env` or equivalent files containing real secrets.
- Only load trusted `.pkl` files. Pickle deserialization can execute arbitrary code.
- Use HTTPS and appropriate authentication when exposing the API publicly.
- Avoid submitting confidential or personally identifiable email content to external services without appropriate consent and safeguards.

---

## ⚠️ Limitations

Sentinel AI is a decision-support tool and should not be treated as an infallible security system.

Some important limitations include:

1. Machine learning predictions can produce false positives and false negatives.
2. Model confidence is not a guarantee of prediction correctness.
3. VirusTotal results depend on available reputation reports and external service availability.
4. An unavailable URL report does not mean that a URL is safe.
5. Groq-generated explanations depend on the information supplied to the language model and may contain inaccuracies.
6. Personal safety predictions should not independently determine the credibility of a threat.
7. Analysis history and dashboard statistics are currently session-based rather than permanently stored.
8. The application currently analyzes submitted email content rather than directly connecting to an email inbox.

---

## 🔮 Future Improvements

Potential areas for further development include:

- Real-time email monitoring and inbox integration.
- Attachment scanning and malware analysis.
- Domain spoofing and sender authentication checks.
- Detection of impersonation and business email compromise.
- Improved explainability for individual model predictions.
- Persistent analysis history and database integration.
- Model evaluation dashboards and performance monitoring.
- Role-based access control and authentication.
- Deployment using Docker and cloud infrastructure.
- Automated model retraining and evaluation pipelines.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Implement your changes.
4. Commit your changes with meaningful messages.
5. Submit a pull request.

```bash
git checkout -b feature/your-feature

git add .

git commit -m "Add: your feature description"

git push origin feature/your-feature
```

---

## 👨‍💻 Author

**Kunal Verma**

GitHub: https://github.com/KunalVerma12

Project Repository: https://github.com/KunalVerma12/SpamThreatDetect.ai

---

## 📄 License

No license is currently specified in this repository. Please check the repository for licensing information before redistributing or using the project commercially.

---

<p align="center">
  <strong>Sentinel AI — Beyond Spam Detection. Toward Intelligent Threat Awareness.</strong>
  <br>
  Built with React, TypeScript, Python, Machine Learning, NLP, and AI.
</p>