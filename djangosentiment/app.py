"""
Lightweight sentiment analysis microservice.

Exposes GET /analyze/<text> and returns {"sentiment": "positive|negative|neutral"}.
Uses a simple lexicon-based scorer so it runs with no external API keys or
heavyweight ML dependencies -- swap in a hosted NLU service if you have one
available (e.g. IBM Watson NLU, HuggingFace inference API).
"""
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

POSITIVE_WORDS = {
    "great", "good", "excellent", "fantastic", "amazing", "awesome",
    "friendly", "helpful", "happy", "love", "loved", "recommend",
    "wonderful", "perfect", "smooth", "quick", "professional", "best",
}

NEGATIVE_WORDS = {
    "bad", "terrible", "poor", "awful", "horrible", "unhappy", "slow",
    "rude", "worst", "disappointed", "disappointing", "problem",
    "issue", "broken", "never", "avoid", "unsatisfied", "not satisfied",
}


def score_text(text: str) -> str:
    lowered = text.lower()
    pos = sum(1 for w in POSITIVE_WORDS if w in lowered)
    neg = sum(1 for w in NEGATIVE_WORDS if w in lowered)
    if pos > neg:
        return "positive"
    if neg > pos:
        return "negative"
    return "neutral"


@app.route("/analyze/<path:text>", methods=["GET"])
def analyze(text):
    sentiment = score_text(text)
    return jsonify({"sentiment": sentiment})


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Sentiment analyzer running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
