import sqlite3
from pathlib import Path


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

DATABASE_PATH = Path(__file__).resolve().parent / "tutor.db"


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():

    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    return connection


# ============================================================
# INITIALIZE DATABASE
# ============================================================

def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()

    # --------------------------------------------------------
    # Students table
    # --------------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level TEXT DEFAULT 'Beginner',
            difficulty TEXT DEFAULT 'Easy',
            xp INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # --------------------------------------------------------
    # Learning sessions table
    # --------------------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS learning_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            mode TEXT NOT NULL,
            topic TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT,
            is_correct INTEGER,
            xp_earned INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(student_id) REFERENCES students(id)
        )
    """)

    connection.commit()

    connection.close()


# ============================================================
# CREATE STUDENT
# ============================================================

def create_student(
    name,
    level="Beginner",
    difficulty="Easy"
):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO students
        (
            name,
            level,
            difficulty
        )
        VALUES (?, ?, ?)
        """,
        (
            name,
            level,
            difficulty
        )
    )

    student_id = cursor.lastrowid

    connection.commit()

    connection.close()

    return student_id


# ============================================================
# GET STUDENT
# ============================================================

def get_student(student_id):

    connection = get_connection()

    student = connection.execute(
        """
        SELECT *
        FROM students
        WHERE id = ?
        """,
        (student_id,)
    ).fetchone()

    connection.close()

    return student


# ============================================================
# UPDATE STUDENT XP
# ============================================================

def update_student_xp(
    student_id,
    xp
):

    connection = get_connection()

    connection.execute(
        """
        UPDATE students
        SET xp = xp + ?
        WHERE id = ?
        """,
        (
            xp,
            student_id
        )
    )

    connection.commit()

    connection.close()


# ============================================================
# SAVE LEARNING SESSION
# ============================================================

def save_learning_session(
    student_id,
    mode,
    topic,
    question,
    answer,
    is_correct=None,
    xp_earned=0
):

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO learning_sessions
        (
            student_id,
            mode,
            topic,
            question,
            answer,
            is_correct,
            xp_earned
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            student_id,
            mode,
            topic,
            question,
            answer,
            is_correct,
            xp_earned
        )
    )

    connection.commit()

    connection.close()


# ============================================================
# GET STUDENT LEARNING SESSIONS
# ============================================================

def get_student_sessions(student_id):

    connection = get_connection()

    sessions = connection.execute(
        """
        SELECT *
        FROM learning_sessions
        WHERE student_id = ?
        ORDER BY id DESC
        """,
        (student_id,)
    ).fetchall()

    connection.close()

    return sessions


# ============================================================
# GET STUDENT PERFORMANCE
# ============================================================

def get_student_performance(student_id):

    connection = get_connection()

    sessions = connection.execute(
        """
        SELECT
            topic,
            is_correct,
            xp_earned
        FROM learning_sessions
        WHERE student_id = ?
        ORDER BY id DESC
        """,
        (student_id,)
    ).fetchall()

    connection.close()

    # --------------------------------------------------------
    # No quiz activity
    # --------------------------------------------------------

    total = len(sessions)

    if total == 0:

        return {
            "total_questions": 0,
            "correct_answers": 0,
            "score_percentage": 0,
            "strengths": [],
            "weaknesses": [],
            "total_xp": 0
        }

    # --------------------------------------------------------
    # Calculate total correct answers
    # --------------------------------------------------------

    correct = sum(
        1
        for session in sessions
        if session["is_correct"] == 1
    )

    # --------------------------------------------------------
    # Calculate topic-wise performance
    # --------------------------------------------------------

    topic_stats = {}

    for session in sessions:

        topic = session["topic"]

        if topic not in topic_stats:

            topic_stats[topic] = {
                "correct": 0,
                "total": 0
            }

        topic_stats[topic]["total"] += 1

        if session["is_correct"] == 1:

            topic_stats[topic]["correct"] += 1

    # --------------------------------------------------------
    # Identify strengths and weaknesses
    # --------------------------------------------------------

    strengths = []
    weaknesses = []

    for topic, stats in topic_stats.items():

        percentage = (
            stats["correct"] /
            stats["total"]
        ) * 100

        if percentage >= 70:

            strengths.append(topic)

        else:

            weaknesses.append(topic)

    # --------------------------------------------------------
    # Calculate XP
    # --------------------------------------------------------

    total_xp = sum(
        session["xp_earned"] or 0
        for session in sessions
    )

    # --------------------------------------------------------
    # Return performance
    # --------------------------------------------------------

    return {

        "total_questions": total,

        "correct_answers": correct,

        "score_percentage": round(
            (correct / total) * 100,
            2
        ),

        "strengths": strengths,

        "weaknesses": weaknesses,

        "total_xp": total_xp
    }