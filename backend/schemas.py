from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str
    level: str = "Beginner"
    difficulty: str = "Easy"


class TutorRequest(BaseModel):
    student_id: int
    mode: str
    topic: str
    question: str


class EvaluationRequest(BaseModel):
    student_id: int
    topic: str
    question: str
    student_answer: str