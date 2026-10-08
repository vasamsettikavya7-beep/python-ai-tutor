# 🐍 Python Buddy – Personalized AI Python Tutor

An intelligent, adaptive Python learning companion built with **FastAPI**, **React (Vite)**, **Tailwind CSS**, and **Google Gemini AI**. Python Buddy customizes learning materials, practice challenges, and quizzes dynamically based on each student's current proficiency.

---

## ✨ Features

- **🧠 Multi-Tier Adaptive Quizzes**:
  - 60 curated questions across **Beginner**, **Intermediate**, and **Advanced** tiers.
  - Randomized correct answer distribution across all 4 options (`A`, `B`, `C`, `D`).
  - Instant scoring, XP rewards (+25 XP for correct, +5 XP for attempts), and detailed explanations.
- **💬 Python Buddy AI Tutor**:
  - 32 structured curriculum topics across 5 distinct categories:
    - 🌱 *Core Fundamentals* (Variables, Loops, Conditions, Functions, Scope...)
    - 📦 *Data Structures* (Lists, Tuples, Dictionaries, Sets, Comprehensions...)
    - ⚙️ *Intermediate Python* (Lambdas, Exceptions, File I/O, Modules, Closures...)
    - 🏛️ *Object-Oriented Programming* (Classes, Objects, Inheritance, Dunder Methods...)
    - 🚀 *Advanced Python* (Decorators, Generators, Context Managers, Async/Await...)
  - Three distinct learning modes: **AI Tutor** (Q&A), **Learn** (Concepts & Mistakes), and **Practice** (Interactive coding challenges).
- **📊 Real-Time Analytics & Recommendations**:
  - Automatically identifies student strengths (≥ 70% accuracy) and topics needing review.
  - Personalized curriculum milestones and next-lesson suggestions.
- **🎨 Visual Themes**:
  - Includes **Clean Slate**, **Eye Comfort Mint**, and **Deep Dark** modes.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Python 3, [FastAPI](https://fastapi.tiangolo.com/), Uvicorn, SQLite database.
- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), Lucide Icons, Canvas-Confetti.
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`) via `google-genai`.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/python-ai-tutor.git
cd python-ai-tutor
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get an API key for free at [Google AI Studio](https://aistudio.google.com/))*

### 3. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI backend
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 📁 Project Structure

```
python-ai-tutor/
├── backend/
│   ├── ai_service.py       # Google Gemini integration & fallback logic
│   ├── database.py         # SQLite schema, student profiles & session logs
│   ├── main.py             # FastAPI REST endpoints (/register, /tutor, /evaluate, etc.)
│   └── schemas.py          # Pydantic request & response models
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Quiz, Tutor, Cards, Modals
│   │   ├── data/           # 60-question comprehensive Python quiz bank
│   │   ├── pages/          # Dashboard, TutorPage, QuizPage, ProgressPage
│   │   ├── services/       # Frontend API client
│   │   └── App.jsx         # App router & global state
│   ├── index.html
│   └── vite.config.js
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

---

## 📄 License
MIT License. Open source and free for educational use.
