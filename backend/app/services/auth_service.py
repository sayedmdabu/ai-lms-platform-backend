# File: backend/app/services/auth_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserRegister
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: UserRegister):
        # চেক করি ইমেইল বা ইউজারনেম অলরেডি আছে কিনা
        result = await self.db.execute(select(User).filter((User.email == user_data.email) | (User.username == user_data.username)))
        existing_user = result.scalars().first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or Username already registered"
            )

        # নতুন ইউজার তৈরি
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=get_password_hash(user_data.password),
            role="student",  # ডিফল্ট রোল স্টুডেন্ট
            is_active=True
        )
        
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def authenticate_user(self, email: str, password: str):
        # ইমেইল দিয়ে ইউজার খুঁজি
        result = await self.db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()

        if not user:
            return None
        
        # পাসওয়ার্ড চেক করি
        if not verify_password(password, user.hashed_password):
            return None
            
        return user