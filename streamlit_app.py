
import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000/predict"


# ---------------- PAGE CONFIG ----------------

st.set_page_config(
    page_title="Sentinel AI | Email Security",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ---------------- CUSTOM CSS ----------------

st.markdown("""
<style>
.stApp {
    background-color: #0b1120;
    color: #e5e7eb;
}

[data-testid="stSidebar"] {
    background-color: #111827;
    border-right: 1px solid #273449;
}

.block-container {
    padding-top: 2rem;
    padding-bottom: 3rem;
    max-width: 1250px;
}

.hero {
    background: linear-gradient(120deg, #172554, #111827);
    border: 1px solid #263b63;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 25px;
}

.hero h1 {
    color: #f8fafc;
    font-size: 32px;
    margin-bottom: 8px;
}

.hero p {
    color: #a5b4fc;
    margin-bottom: 0;
}

.section-title {
    color: #f1f5f9;
    font-size: 21px;
    font-weight: 650;
    margin: 18px 0 12px 0;
}

.panel {
    background-color: #111827;
    border: 1px solid #273449;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 14px;
}

.metric-label {
    color: #94a3b8;
    font-size: 13px;
    margin-bottom: 8px;
}

.metric-value {
    color: #f8fafc;
    font-size: 23px;
    font-weight: 700;
    overflow-wrap: anywhere;
}

.small-text {
    color: #94a3b8;
    font-size: 13px;
}

div.stButton > button[kind="primary"] {
    background: #2563eb;
    border: none;
    border-radius: 9px;
    color: white;
    font-weight: 600;
    min-height: 45px;
}

div.stButton > button[kind="primary"]:hover {
    background: #1d4ed8;
}

div[data-testid="stTextInput"] input,
div[data-testid="stTextArea"] textarea {
    background-color: #111827;
    color: #f8fafc;
    border-color: #374151;
}

hr {
    border-color: #273449;
}
</style>
""", unsafe_allow_html=True)


# ---------------- SESSION STATE ----------------

if "history" not in st.session_state:
    st.session_state.history = []

if "result" not in st.session_state:
    st.session_state.result = None


# ---------------- SIDEBAR ----------------

with st.sidebar:

    st.markdown("## 🛡️ SENTINEL AI")
    st.caption("EMAIL THREAT INTELLIGENCE")
    st.divider()

    page = st.radio(
        "NAVIGATION",
        ["Email Analyzer", "Analysis History", "About Project"],
        label_visibility="visible"
    )

    st.divider()

    st.markdown("### Detection Engine")
    st.markdown("Spam / Phishing Classifier")
    st.markdown("Personal Safety Threat Classifier")
    st.markdown("URL Reputation · VirusTotal")
    st.markdown("AI Explanation · Groq")

    st.divider()

    st.caption("Automated analysis can make mistakes.")


# ---------------- HEADER ----------------

st.markdown("""
<div class="hero">
    <h1>Email Threat Analyzer</h1>
    <p>
        Analyze suspicious emails using machine learning,
        personal safety threat detection, URL reputation
        intelligence, and AI-generated explanations.
    </p>
</div>
""", unsafe_allow_html=True)


# ---------------- HELPER FUNCTIONS ----------------

def metric_card(label, value):

    st.markdown(
        f"""
        <div class="panel">
            <div class="metric-label">{label}</div>
            <div class="metric-value">{value}</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def analyze_email(payload):

    response = requests.post(
        API_URL,
        json=payload,
        timeout=520
    )

    response.raise_for_status()

    return response.json()


# ---------------- EMAIL ANALYZER ----------------

if page == "Email Analyzer":

    left, right = st.columns([1.35, 1], gap="large")


    # ---------------- EMAIL INPUT ----------------

    with left:

        st.markdown(
            '<div class="section-title">Email Input</div>',
            unsafe_allow_html=True
        )

        with st.container(border=True):

            subject = st.text_input(
                "Subject",
                placeholder="Enter the email subject"
            )

            sender = st.text_input(
                "Sender",
                placeholder="sender@example.com"
            )

            receiver = st.text_input(
                "Receiver",
                placeholder="receiver@example.com"
            )

            email_text = st.text_area(
                "Email Body",
                height=260,
                placeholder="Paste the complete email body here..."
            )

            st.caption(
                f"Email body length: {len(email_text)} characters"
            )

            analyze_clicked = st.button(
                "Analyze Email",
                type="primary",
                use_container_width=True
            )


    # ---------------- ANALYSIS OVERVIEW ----------------

    with right:

        st.markdown(
            '<div class="section-title">Analysis Overview</div>',
            unsafe_allow_html=True
        )

        st.markdown("""
        <div class="panel">
            <div class="metric-label">MACHINE LEARNING</div>
            <div class="metric-value">Spam / Phishing Detection</div>
            <p class="small-text">
                Predicts whether the email resembles spam or phishing.
            </p>
        </div>

        <div class="panel">
            <div class="metric-label">PERSONAL SAFETY</div>
            <div class="metric-value">Threat Detection</div>
            <p class="small-text">
                Detects physical violence, death threats,
                blackmail/extortion, and stalking.
            </p>
        </div>

        <div class="panel">
            <div class="metric-label">URL INTELLIGENCE</div>
            <div class="metric-value">VirusTotal</div>
            <p class="small-text">
                Checks available reputation reports for extracted URLs.
            </p>
        </div>

        <div class="panel">
            <div class="metric-label">EXPLAINABILITY</div>
            <div class="metric-value">Groq AI</div>
            <p class="small-text">
                Generates natural-language explanations of the available evidence.
            </p>
        </div>
        """, unsafe_allow_html=True)


    # ---------------- ANALYZE EMAIL ----------------

    if analyze_clicked:

        if not email_text.strip():

            st.warning("Please enter an email body.")

        elif len(email_text) > 50000:

            st.error(
                "The email body exceeds the 50,000-character limit."
            )

        elif len(subject) > 500:

            st.error(
                "The subject exceeds the 500-character limit."
            )

        else:

            payload = {
                "text": email_text,
                "subject": subject,
                "sender": sender.strip() or "unknown",
                "receiver": receiver.strip() or "unknown"
            }

            try:

                with st.spinner(
                    "Analyzing email, checking URLs, and generating explanation..."
                ):

                    result = analyze_email(payload)

                st.session_state.result = result

                st.session_state.history.insert(
                    0,
                    {
                        "subject": subject or "(No subject)",

                        "category": result.get(
                            "spam_category", "Unknown"
                        ),

                        "threats": result.get(
                            "detected_personal_safety_threats", []
                        ),

                        "assessment": result.get(
                            "final_assessment", "Unknown"
                        )
                    }
                )

                st.success("Analysis completed.")

            except requests.exceptions.HTTPError as error:

                st.error(f"The API returned an error: {error}")

                if error.response is not None:
                    st.code(error.response.text)

            except requests.exceptions.ConnectionError:

                st.error(
                    "Cannot connect to FastAPI. Start it with "
                    "`uvicorn app:app --reload`."
                )

            except requests.exceptions.Timeout:

                st.error(
                    "Analysis timed out. Try again or check the backend."
                )

            except requests.exceptions.RequestException as error:

                st.error(f"Request failed: {error}")

            except ValueError:

                st.error("The API returned an invalid response.")


    # ---------------- DISPLAY MOST RECENT RESULT ----------------

    result = st.session_state.result

    if result is not None:

        st.divider()

        st.markdown(
            '<div class="section-title">Threat Assessment</div>',
            unsafe_allow_html=True
        )


        # Extract API results

        category = result.get(
            "spam_category", "Unknown"
        )

        assessment = result.get(
            "final_assessment", "Unknown"
        )

        confidence = result.get(
            "spam_confidence"
        )

        threat_results = result.get(
            "personal_safety_threats", {}
        )

        detected_threats = result.get(
            "detected_personal_safety_threats", []
        )


        # Determine overall threat status

        is_threat = (
            category == "Spam/Phishing"
            or bool(detected_threats)
            or assessment in (
                "Potential malicious URL threat",
                "Potential spam/phishing threat",
                "Potential personal safety threat"
            )
        )

        if is_threat:

            st.error(f"⚠️ {assessment}")

        elif assessment == "No threat detected by model; URL unverified":

            st.warning(f"⚠️ {assessment}")

        else:

            st.success(f"✓ {assessment}")


        # ---------------- METRIC CARDS ----------------

        c1, c2, c3 = st.columns(3)

        with c1:

            metric_card(
                "SPAM / PHISHING CLASSIFICATION",
                category
            )

        with c2:

            confidence_text = (
                f"{confidence:.2f}%"
                if isinstance(confidence, (int, float))
                else "Unavailable"
            )

            metric_card(
                "SPAM MODEL CONFIDENCE",
                confidence_text
            )

        with c3:

            metric_card(
                "URLS FOUND",
                str(len(result.get("urls_found", [])))
            )

        st.caption(
            "Model confidence is not a guarantee of correctness. "
            "A clean URL report does not prove an email is safe."
        )


        # ---------------- PERSONAL SAFETY RESULTS ----------------

        st.markdown(
            '<div class="section-title">Personal Safety Threat Detection</div>',
            unsafe_allow_html=True
        )

        if threat_results:

            threat_names = {
                "physical_violence": "Physical Violence",
                "death_threat": "Death Threat",
                "blackmail_extortion": "Blackmail / Extortion",
                "stalking": "Stalking"
            }

            for label, prediction in threat_results.items():

                display_name = threat_names.get(label, label)

                with st.container(border=True):

                    if prediction == 1:

                        st.error(
                            f"⚠️ {display_name} Detected"
                        )

                    else:

                        st.success(
                            f"✓ {display_name} Not Detected"
                        )

        else:

            st.info(
                "Personal safety prediction results are unavailable."
            )


        # ---------------- URL REPUTATION RESULTS ----------------

        st.markdown(
            '<div class="section-title">URL Reputation Results</div>',
            unsafe_allow_html=True
        )

        reports = result.get("url_reports", [])

        if not reports:

            st.info("No URLs were found in the email.")

        else:

            for report in reports:

                status = report.get("status", "unknown")

                url = report.get(
                    "url", "URL unavailable"
                )

                with st.container(border=True):

                    st.write(f"**URL:** `{url}`")

                    if status == "malicious":

                        st.error(
                            "Malicious detections reported"
                        )

                    elif status == "suspicious":

                        st.warning(
                            "Suspicious detections reported"
                        )

                    elif status == "no_malicious_detections":

                        st.success(
                            "No malicious detections in the available report"
                        )

                    elif status == "no_report":

                        st.info(
                            "No existing reputation report found"
                        )

                    elif status == "api_key_missing":

                        st.warning(
                            "VirusTotal API key is not configured"
                        )

                    else:

                        st.warning(
                            "Could not verify this URL's reputation"
                        )

                    if "malicious" in report:

                        st.caption(
                            f"Malicious: {report.get('malicious', 0)} · "
                            f"Suspicious: {report.get('suspicious', 0)} · "
                            f"Harmless: {report.get('harmless', 0)}"
                        )


        # ---------------- GROQ AI EXPLANATION ----------------

        st.markdown(
            '<div class="section-title">AI Explanation</div>',
            unsafe_allow_html=True
        )

        with st.container(border=True):

            st.markdown("**Groq Analysis**")

            st.write(
                result.get(
                    "explanation",
                    "Explanation unavailable."
                )
            )


# ---------------- ANALYSIS HISTORY ----------------

elif page == "Analysis History":

    st.markdown("### Previous Analyses")

    if not st.session_state.history:

        st.info(
            "No analyses have been performed in this session."
        )

    else:

        if st.button("Clear History"):

            st.session_state.history = []

            st.rerun()

        for item in st.session_state.history:

            with st.container(border=True):

                st.write(
                    f"**Subject:** {item['subject']}"
                )

                st.write(
                    f"**Spam / Phishing Classification:** "
                    f"{item['category']}"
                )

                st.write(
                    f"**Personal Safety Threats:** "
                    f"{', '.join(item.get('threats', [])) or 'None detected'}"
                )

                st.write(
                    f"**Assessment:** {item['assessment']}"
                )


# ---------------- ABOUT PROJECT ----------------

elif page == "About Project":

    st.markdown("### About Sentinel AI")

    st.write(
        "An AI-based email threat analysis project combining "
        "machine-learning classification, personal safety threat "
        "detection, URL reputation checks, and AI-generated explanations."
    )

    st.markdown("#### Components")

    st.write(
        "**Spam / Phishing Classifier:** Classifies emails as "
        "spam/phishing or legitimate."
    )

    st.write(
        "**Personal Safety Classifier:** Detects physical violence, "
        "death threats, blackmail/extortion, and stalking."
    )

    st.write(
        "**VirusTotal:** Checks existing URL reputation reports."
    )

    st.write(
        "**Groq:** Explains the available evidence in readable language."
    )

    st.write(
        "**FastAPI:** Provides the backend prediction endpoint."
    )

    st.write(
        "**Streamlit:** Provides the interactive user interface."
    )

    st.info(
        "This project is a decision-support tool, not a guarantee "
        "that an email is safe or malicious."
    )
