
import os
import re
import base64
import requests

from dotenv import load_dotenv


# Load the VirusTotal API key
load_dotenv("virustotal.env")

API_KEY = os.getenv("VT_API_KEY")


# Extract URLs from email text and subject
import re

def extract_urls(text, subject):

    combined_text = text + " " + subject

    # Extract Markdown link destinations
    markdown_urls = re.findall(
        r'\]\((https?://[^)\s]+|www\.[^)\s]+)\)',
        combined_text,
        flags=re.IGNORECASE
    )

    # Extract ordinary URLs
    ordinary_urls = re.findall(
        r'https?://[^\s<>"\']+|www\.[^\s<>"\']+',
        combined_text,
        flags=re.IGNORECASE
    )

    # Combine both lists
    urls = markdown_urls + ordinary_urls

    # Remove common trailing punctuation
    urls = [
        url.rstrip(".,;:!?)]}")
        for url in urls
    ]

    # Add a scheme only when it is missing
    urls = [
        "https://" + url
        if url.lower().startswith("www.")
        else url
        for url in urls
    ]

    # Remove duplicates while preserving order
    urls = list(dict.fromkeys(urls))

    return urls


# Check a URL using VirusTotal
def check_url_reputation(url):

    if not API_KEY:
        return {
            "url": url,
            "status": "api_key_missing"
        }

    # Convert URL into VirusTotal's URL identifier
    url_id = base64.urlsafe_b64encode(
        url.encode("utf-8")
    ).decode("utf-8").strip("=")

    headers = {
        "x-apikey": API_KEY
    }

    try:
        response = requests.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers=headers,
            timeout=15
        )

        # VirusTotal has no existing report for this URL
        if response.status_code == 404:
            return {
                "url": url,
                "status": "no_report"
            }

        response.raise_for_status()

        result = response.json()

        # Safely retrieve the report information
        attributes = result.get(
            "data", {}
        ).get("attributes", {})

        stats = attributes.get("last_analysis_stats")

        if not isinstance(stats, dict):
            return {
                "url": url,
                "status": "no_report"
            }

        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)

        # Classify the URL using VirusTotal's results
        if malicious > 0:
            status = "malicious"

        elif suspicious > 0:
            status = "suspicious"

        else:
            status = "no_malicious_detections"

        return {
            "url": url,
            "status": status,
            "malicious": malicious,
            "suspicious": suspicious,
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0)
        }

    except requests.RequestException:
        return {
            "url": url,
            "status": "lookup_error"
        }

    except (ValueError, TypeError, KeyError):
        return {
            "url": url,
            "status": "lookup_error"
        }
