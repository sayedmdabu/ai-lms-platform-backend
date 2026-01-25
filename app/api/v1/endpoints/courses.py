from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Course(BaseModel):
    id: str
    title: str
    description: str
    price: float
    instructor_id: str

@router.get("/", response_model=List[Course])
async def get_courses():
    # TODO: Implement actual course fetching
    return [
        {
            "id": "1",
            "title": "Introduction to Python",
            "description": "Learn Python from scratch",
            "price": 49.99,
            "instructor_id": "1"
        },
        {
            "id": "2",
            "title": "Web Development with React",
            "description": "Build modern web applications",
            "price": 79.99,
            "instructor_id": "1"
        }
    ]

@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str):
    # TODO: Implement actual course fetching
    return {
        "id": course_id,
        "title": "Introduction to Python",
        "description": "Learn Python from scratch",
        "price": 49.99,
        "instructor_id": "1"
    }
