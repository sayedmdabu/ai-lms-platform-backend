# File: backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.user import UserCreate

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Login(BaseModel):
    username: str  # OAuth2 standard এ ইমেইলকেও username বলা হয়
    password: str
    
# রেজিস্ট্রেশন স্কিমা UserCreate কেই ব্যবহার করবে, তবে আলাদা নাম দেওয়া হলো স্বচ্ছতার জন্য
class UserRegister(UserCreate):
    pass