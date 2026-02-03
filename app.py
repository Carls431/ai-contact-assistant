import os
from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("AI_MODEL", "llama-3.1-70b-versatile")


def call_groq(prompt: str) -> str:
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are a helpful business assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.4,
        },
        timeout=25,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def call_openai(prompt: str) -> str:
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are a helpful business assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.4,
        },
        timeout=25,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def run_ai(prompt: str) -> str:
    if GROQ_API_KEY:
        return call_groq(prompt)
    if OPENAI_API_KEY:
        return call_openai(prompt)
    raise RuntimeError("Missing GROQ_API_KEY or OPENAI_API_KEY")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/analyze", methods=["POST"])
def analyze_message():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required."}), 400

    summary_prompt = (
        "Summarize the customer message in 2-3 bullet points. "
        "Use simple, business-friendly language.\n\n"
        f"Customer name: {name}\n"
        f"Customer email: {email}\n"
        f"Message: {message}"
    )

    reply_prompt = (
        "Write a short, professional reply in a friendly tone. "
        "Keep it under 6 sentences, and include a clear next step.\n\n"
        f"Customer name: {name}\n"
        f"Customer email: {email}\n"
        f"Message: {message}"
    )

    try:
        summary = run_ai(summary_prompt)
        reply = run_ai(reply_prompt)
    except Exception as exc:
        return jsonify({"error": f"AI error: {exc}"}), 500

    return jsonify({"summary": summary, "reply": reply})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
