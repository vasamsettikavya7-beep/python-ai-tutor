import os

from dotenv import load_dotenv
from google import genai

from prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


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

    response = client.models.generate_content(
        model="gemini-3.7-flash",
        contents=full_prompt
    )

    return response.text