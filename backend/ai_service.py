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


import re

PYTHON_TOPIC_TERMS = {
    "variable", "variables", "assignment", "dynamic typing",
    "data type", "datatype", "type casting", "type conversion",
    "int", "integer", "float", "str", "string", "bool", "boolean", "complex",
    "list", "lists", "append", "pop", "extend", "slice", "slicing", "index", "indexing",
    "tuple", "tuples", "unpacking",
    "dict", "dictionary", "dictionaries", "key-value",
    "set", "sets", "union", "intersection",
    "comprehension", "list comprehension", "dict comprehension",
    "loop", "loops", "for loop", "while loop", "iteration", "iterable", "iterator", "range",
    "condition", "conditionals", "branching", "if statement", "elif", "else",
    "function", "functions", "parameter", "parameters", "argument", "arguments", "return value", "scope", "legb",
    "oop", "object-oriented", "class", "classes", "object", "objects",
    "inheritance", "polymorphism", "encapsulation", "dunder", "magic method", "__init__", "self",
    "decorator", "decorators", "generator", "generators", "yield",
    "context manager", "with statement",
    "async", "await", "asyncio", "concurrency", "coroutine", "threading",
    "memory management", "metaclass", "metaclasses",
    "exception", "exceptions", "try except", "traceback",
    "syntax error", "type error", "value error", "index error", "key error",
    "file i/o", "read file", "write file",
    "module", "modules", "package", "packages", "standard library", "pip", "venv",
    "lambda", "closure", "closures", "recursion",
    "regex", "regular expression",
    "print", "len", "input", "isinstance", "enumerate", "zip", "sorted",
    "python", "pythonic", "pep8", "code", "syntax", "indentation", "algorithm", "debugging"
}

CODE_PATTERNS = [
    r"\bdef\s+\w+\s*\(",
    r"\bclass\s+\w+",
    r"\bimport\s+\w+",
    r"\bfrom\s+\w+\s+import",
    r"\bprint\s*\(",
    r"\binput\s*\(",
    r"\blen\s*\(",
    r"\brange\s*\(",
    r"\bfor\s+\w+\s+in\b",
    r"\bwhile\s+.+:",
    r"\bif\s+.+:",
    r"\belif\s+.+:",
    r"\btry\s*:",
    r"\bexcept\b",
    r"\bwith\s+open\b",
    r"\breturn\b",
    r"\byield\b",
    r"=\s*\[.*\]",
    r"=\s*\{.*\}",
    r"=\s*\(.*\)",
    r"\.append\(",
    r"\.pop\(",
    r"f[\"'].*\{.*\}[\"']"
]

def is_python_related(question: str, topic: str = "") -> bool:
    q = (question or "").strip().lower()
    if not q:
        return False
    
    # Check for direct Python code patterns
    for pattern in CODE_PATTERNS:
        if re.search(pattern, question):
            return True
            
    # Check for explicit python mention
    if "python" in q or "py " in q or q.endswith(".py") or ".py " in q:
        return True
        
    # Check terms
    words = set(re.findall(r"\b[a-z_][a-z0-9_-]*\b", q))
    for term in PYTHON_TOPIC_TERMS:
        if " " in term:
            if term in q:
                return True
        else:
            if term in words:
                return True
                
    return False

def get_non_python_rejection(question: str) -> str:
    clean_q = question.strip() if question else "your question"
    return (
        "🧙‍♂️ **Python AI Tutor Notice**\n\n"
        "I am Python Buddy, your specialized Python programming tutor at Hogwarts School of Pythoncraft! 🐍\n\n"
        f"Your question (*\"{clean_q}\"*) is outside the scope of Python programming.\n\n"
        "I can only answer questions related to **Python programming** and our Python curriculum topics.\n\n"
        "Please ask a Python-related question, for example:\n"
        "- *\"What is a variable and how does assignment work in Python?\"*\n"
        "- *\"How do for and while loops iterate in Python?\"*\n"
        "- *\"What is the difference between a list and a tuple?\"*\n"
        "- *\"How do functions and return values work in Python?\"*\n"
        "- *\"How do I handle errors using try and except?\"*\n\n"
        "You can also pick any topic from the curriculum menu above to begin learning! 🪄✨"
    )

def ask_gemini(
    student_name,
    level,
    difficulty,
    mode,
    topic,
    question
):
    # Strictly reject non-Python questions
    if not is_python_related(question, topic):
        return get_non_python_rejection(question)

    prompt = f"""
You are Python Buddy, a friendly AI tutor who teaches Python programming.

CRITICAL SCOPE RULE:
- You are strictly and exclusively an educational Python Programming Tutor.
- You must ONLY answer questions directly about Python programming, Python syntax, and Python curriculum concepts.
- If the question is outside Python programming (e.g. general technology without Python code, other programming languages, general trivia, history, non-coding questions):
  You must politely refuse and tell the student you only answer Python programming questions.

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

Always focus exclusively on Python programming.
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