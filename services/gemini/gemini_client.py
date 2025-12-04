import os
from google import genai
from ai_chat.core import settings as cfg


client = genai.Client(api_key=cfg.GEMINI_API_KEY)


def get_answer(prompt: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )
    return response.text


if __name__ == "__main__":
    get_answer("Привет")
