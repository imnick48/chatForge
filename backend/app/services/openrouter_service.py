import os 
import requests
from flask import request

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def call_openrouter_api(messages, timeout=30):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": request.host_url,
        "X-Title": "Flask Chatbot"
    }

    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }

    r = requests.post(
        OPENROUTER_URL,
        headers=headers,
        json=payload,
        timeout=timeout
    )
    r.raise_for_status()
    data = r.json()

    assistant_message = data['choices'][0]['message']['content']
    return assistant_message
