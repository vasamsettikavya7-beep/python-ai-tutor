from fastapi import FastAPI, HTTPException

from .database import (
    initialize_database,
    create_student,
    get_student,
    save_learning_session,
    update_student_xp,
    get_student_performance,
)

from .schemas import (
    StudentCreate,
    TutorRequest,
    EvaluationRequest,
)

from .ai_service import ask_gemini


app = FastAPI(
    title="Python Buddy AI Tutor API",
    description="AI-powered personalized Python learning assistant",
    version="1.0.0",
)


# ============================================================
# PERSONALIZED LEARNING CONFIGURATION
# ============================================================

TOPIC_RECOMMENDATIONS = {

    "Variables": (
        "Review variables and practice assigning "
        "different values for 10 minutes."
    ),

    "Loops": (
        "Practice Python for loops for 15 minutes "
        "using simple counting and iteration exercises."
    ),

    "Functions": (
        "Practice defining and calling Python functions "
        "for 15 minutes."
    ),

    "Lists": (
        "Practice creating, accessing, and modifying "
        "Python lists for 15 minutes."
    ),

    "Conditions": (
        "Practice if, elif, and else statements "
        "for 15 minutes."
    ),
}


NEXT_LESSONS = {

    "Variables": "Data Types and Operators",

    "Conditions": "Loops",

    "Loops": "Lists and Iteration",

    "Lists": "List Methods",

    "Functions": "Function Parameters and Return Values",
}


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
def startup():
    initialize_database()


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Python Buddy AI Tutor API"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# STUDENT ROUTES
# ============================================================

@app.post("/students")
def register_student(student: StudentCreate):

    student_id = create_student(
        name=student.name,
        level=student.level,
        difficulty=student.difficulty,
    )

    return {
        "student_id": student_id,
        "message": "Student registered successfully"
    }


@app.get("/students/{student_id}")
def get_student_profile(student_id: int):

    student = get_student(student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return dict(student)


# ============================================================
# AI TUTOR
# ============================================================

@app.post("/tutor")
def tutor(request: TutorRequest):

    student = get_student(request.student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    answer = ask_gemini(
        student_name=student["name"],
        level=student["level"],
        difficulty=student["difficulty"],
        mode=request.mode,
        topic=request.topic,
        question=request.question,
    )

    return {
        "student_id": request.student_id,
        "mode": request.mode,
        "topic": request.topic,
        "answer": answer,
    }


# ============================================================
# QUIZ / ANSWER EVALUATION
# ============================================================

@app.post("/evaluate")
def evaluate_answer(request: EvaluationRequest):

    student = get_student(request.student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    answer = request.student_answer.strip().upper()

    # Current quiz question:
    #
    # A = Apple
    # B = Banana
    # C = Apple Banana
    # D = Error

    correct_answer = "B"

    if answer == correct_answer:

        is_correct = True
        xp = 25
        result = "Correct"

        explanation = (
            "The variable fruit was first assigned Apple "
            "and then reassigned to Banana. Therefore, "
            "the final value is Banana."
        )

        encouragement = "Great job! 🎉"

    else:

        is_correct = False
        xp = 5
        result = "Incorrect"

        explanation = (
            "The variable fruit was reassigned from Apple "
            "to Banana. Therefore, the final value is Banana."
        )

        encouragement = "Good try! Keep practicing. 💪"

    # Save quiz performance
    save_learning_session(
        student_id=request.student_id,
        mode="Quiz",
        topic=request.topic,
        question=request.question,
        answer=request.student_answer,
        is_correct=is_correct,
        xp_earned=xp
    )

    # Update student XP
    update_student_xp(
        student_id=request.student_id,
        xp=xp
    )

    return {
        "student_id": request.student_id,
        "result": result,
        "student_answer": request.student_answer,
        "correct_answer": correct_answer,
        "explanation": explanation,
        "xp_earned": xp,
        "encouragement": encouragement
    }


# ============================================================
# PERSONALIZED LEARNING / RECOMMENDATION
# ============================================================

@app.get("/students/{student_id}/recommendation")
def get_recommendation(student_id: int):

    # --------------------------------------------------------
    # 1. Get student
    # --------------------------------------------------------

    student = get_student(student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # --------------------------------------------------------
    # 2. Analyze performance
    # --------------------------------------------------------

    performance = get_student_performance(student_id)

    # --------------------------------------------------------
    # 3. No learning activity yet
    # --------------------------------------------------------

    if performance["total_questions"] == 0:

        return {
            "student_id": student_id,
            "student_name": student["name"],
            "score_percentage": 0,
            "total_questions": 0,
            "correct_answers": 0,
            "strengths": [],
            "weaknesses": [],
            "total_xp": 0,
            "recommendation": (
                "Start with Python Variables and practice "
                "basic variable assignments."
            ),
            "next_lesson": "Variables"
        }

    # --------------------------------------------------------
    # 4. Get strengths and weaknesses
    # --------------------------------------------------------

    strengths = performance["strengths"]
    weaknesses = performance["weaknesses"]

    # --------------------------------------------------------
    # 5. Generate personalized recommendation
    # --------------------------------------------------------

    if weaknesses:

        # First/most important weakness
        weak_topic = weaknesses[0]

        recommendation = TOPIC_RECOMMENDATIONS.get(
            weak_topic,
            (
                f"Practice {weak_topic} for 15 minutes "
                "to improve your understanding."
            )
        )

        # ----------------------------------------------------
        # 6. Select next lesson
        # ----------------------------------------------------

        next_lesson = NEXT_LESSONS.get(
            weak_topic,
            "Continue to the next Python lesson."
        )

    else:

        # Student has no weak topics
        recommendation = (
            "Excellent performance! You have mastered "
            "the current topics. Continue with the next lesson."
        )

        next_lesson = "Lists and Iteration"

    # --------------------------------------------------------
    # 7. Return complete personalized learning result
    # --------------------------------------------------------

    return {
        "student_id": student_id,
        "student_name": student["name"],

        "score_percentage": performance["score_percentage"],

        "total_questions": performance["total_questions"],

        "correct_answers": performance["correct_answers"],

        "strengths": strengths,

        "weaknesses": weaknesses,

        "total_xp": performance["total_xp"],

        "recommendation": recommendation,

        "next_lesson": next_lesson
    }