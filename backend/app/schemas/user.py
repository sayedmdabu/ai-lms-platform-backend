# File: backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

# বেস স্কিমা (কমন ফিল্ড)
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

# রেজিস্ট্রেশনের সময় যা লাগবে
class UserCreate(UserBase):
    password: str

# আপডেটের সময় যা লাগতে পারে
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# রেসপন্স হিসেবে যা পাঠাব (পাসওয়ার্ড সরানো হয়েছে)
class UserResponse(UserBase):
    id: UUID
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
        
class UserUpdateAdmin(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None       # অ্যাডমিন রোল চেঞ্জ করতে পারবে
    is_active: Optional[bool] = None # অ্যাডমিন ব্লক/আনব্লক করতে পারবে
    is_verified: Optional[bool] = None