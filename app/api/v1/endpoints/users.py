from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class User(BaseModel):
    id: str
    email: EmailStr
    username: str
    full_name: str | None = None
    role: str = "student"

@router.get("/me", response_model=User)
async def get_current_user():
    # TODO: Implement actual user fetching
    return {
        "id": "1",
        "email": "user@example.com",
        "username": "user",
        "full_name": "Test User",
        "role": "student"
    }
