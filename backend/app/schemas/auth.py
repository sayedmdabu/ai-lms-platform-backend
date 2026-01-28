from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.user import UserCreate

# Token response schema
class Token(BaseModel):
    access_token: str
    token_type: str

# Token data decode schema
class TokenData(BaseModel):
    email: Optional[str] = None

# Login request schema
class Login(BaseModel):
    username: str  # In OAuth2 standard, email is often used as username
    password: str

# Registration schema (Inherits from UserCreate)
class UserRegister(UserCreate):
    pass

# 👇 NEW SCHEMAS FOR PASSWORD RESET & VERIFICATION

# 1. Password reset request (User sends email)
class PasswordResetRequest(BaseModel):
    email: EmailStr

# 2. Confirm password reset (User sends token + new password)
class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# 3. Email verification request
class EmailVerificationRequest(BaseModel):
    token: str