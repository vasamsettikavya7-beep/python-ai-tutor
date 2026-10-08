import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is missing from the .env file."
    )


client = genai.Client(
    api_key=API_KEY
)


def ask_gemini(
    student_name,
    level,
    difficulty,
    mode,
    topic,
    question
):

    prompt = f"""
You are Python Buddy, a friendly AI tutor who teaches Python programming.

Student:
Name: {student_name}
Level: {level}
Difficulty: {difficulty}

Learning Mode:
{mode}

Topic:
{topic}

Student Request:
{question}

Teaching instructions:

1. Explain Python clearly and accurately.
2. Adapt the explanation to the student's level.
3. Use simple examples for beginners.
4. Encourage the student.
5. Keep the answer focused and educational.

If the mode is Learn:
- Explain the concept.
- Give a simple Python example.
- Mention one common mistake.
- Give one short practice question.

If the mode is Practice:
- Give one Python practice problem.
- Do not immediately reveal the answer.

If the mode is Quiz:
- Give one Python quiz question.
- Wait for the student's answer.

If the student asks a Python doubt:
- Explain the answer clearly.
- Give a Python example where useful.

Only answer questions related to Python learning.
"""

    # Retry temporary Gemini server errors
    for attempt in range(3):

        try:

            model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    automatic_function_calling=(
                        types.AutomaticFunctionCallingConfig(
                            disable=True
                        )
                    )
                )
            )

            return response.text

        except Exception as error:

            error_text = str(error)

            if (
                "503" not in error_text
                and "UNAVAILABLE" not in error_text
            ):
                raise

            wait_time = 2 ** attempt

            print(
                f"Gemini temporarily unavailable. "
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

    raise RuntimeError(
        "Gemini is temporarily unavailable. "
        "Please try again later."
    )