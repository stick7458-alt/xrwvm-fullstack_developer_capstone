import os
import requests
from django.conf import settings

backend_url = os.environ.get("BACKEND_URL", settings.BACKEND_URL)
sentiment_analyzer_url = os.environ.get(
    "SENTIMENT_ANALYZER_URL", settings.SENTIMENT_ANALYZER_URL
)


def get_request(endpoint, **kwargs):
    params = "&".join(f"{key}={value}" for key, value in kwargs.items())
    request_url = f"{backend_url}{endpoint}?{params}"
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Network error on get_request: {e}")
        return {"status": 500, "error": str(e)}


def analyze_review_sentiments(text):
    request_url = f"{sentiment_analyzer_url}{text}"
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Network error on analyze_review_sentiments: {e}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Network error on post_review: {e}")
        return {"status": 500, "error": str(e)}
