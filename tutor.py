import os
import time

from dotenv import load_dotenv
from google import genai

from prompts import SYSTEM_PROMPT


load_dotenv()


def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception:
        return None


def ask_tutor(
    student_name,
    level,
    difficulty,
    mode,
    topic,
    question,
    history=None
):

    if history is None:
        history = []

    client = get_client()
    if not client:
        return (
            "⚠️ **Gemini API Key is missing!**\n\n"
            "Please add `GEMINI_API_KEY` to your Render Dashboard under the **Environment** tab."
        )

    user_prompt = f"""
Student Information

Name:
{student_name}

Current Level:
{level}

Preferred Difficulty:
{difficulty}

Learning Mode:
{mode}

Python Topic:
{topic}

Student Question:
{question}

Previous Conversation:
{history}

Act as a personalized Python tutor.

Adapt your response to:
- Student level
- Difficulty
- Learning mode
- Selected Python topic
"""

    full_prompt = f"""
SYSTEM INSTRUCTIONS:

{SYSTEM_PROMPT}

STUDENT REQUEST:

{user_prompt}
"""

    models_to_try = [
        os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-pro",
    ]

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=full_prompt
            )
            if response and response.text:
                return response.text
        except Exception as err:
            err_str = str(err)
            if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                time.sleep(1)
                continue
            elif "NOT_FOUND" in err_str or "404" in err_str:
                continue
            else:
                return f"Error communicating with AI: {err_str}"

    return "AI Tutor is currently busy. Please try asking again in a moment."