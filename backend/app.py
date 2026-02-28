import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://giftgenix.netlify.app"}})
# ---------------------------------
# Load All 5 API Keys
# ---------------------------------

API_KEYS = [
    os.getenv("GEMINI_KEY_1"),
    os.getenv("GEMINI_KEY_2"),
    os.getenv("GEMINI_KEY_3"),
    os.getenv("GEMINI_KEY_4"),
    os.getenv("GEMINI_KEY_5"),
]

# Remove None values
API_KEYS = [key for key in API_KEYS if key]

# ---------------------------------
# AI Prompt Route (User Prompt Only)
# ---------------------------------

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    user_prompt = data.get("prompt")

    if not user_prompt:
        return jsonify({"error": "Prompt is required."})

    if not API_KEYS:
        return jsonify({"error": "No API keys configured. Contact Admin."})

    # Try keys one by one
    for index, key in enumerate(API_KEYS):
        try:
            print(f"Trying API Key {index + 1}")

            client = genai.Client(api_key=key)

            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction="You are a helpful AI gift recommendation assistant.",
                    temperature=1.0
                )
            )

            print(f"Success with API Key {index + 1}")
            return jsonify({"result": response.text})

        except Exception as e:
            print(f"API Key {index + 1} failed:", str(e))
            continue  # try next key

    # If all 5 fail
    return jsonify({
        "error": "All API keys failed. Please contact admin to update keys."
    })

# ---------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)