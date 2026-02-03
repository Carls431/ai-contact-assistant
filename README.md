# AI Contact Assistant

A lightweight contact form that uses AI to summarize messages and suggest a reply.

## Features
- Simple, user-friendly contact form
- AI-generated summary (2-3 bullets)
- AI reply suggestion (friendly tone)
- Clean UI, fast loading, easy on the eyes

## Setup
1. Create a virtual environment (optional but recommended).
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy the env template and add your API key:
   ```bash
   copy .env.example .env
   ```
4. Edit `.env` and set either `GROQ_API_KEY` or `OPENAI_API_KEY`.

## Run
```bash
python app.py
```
Then open `http://127.0.0.1:5000` in your browser.

## Notes
- If both keys are set, Groq is used by default.
- Update `AI_MODEL` if you want a different model.
