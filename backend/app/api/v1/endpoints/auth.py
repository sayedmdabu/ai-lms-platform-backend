# File: backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
from jose import jwt, JWTError

from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import Token, UserRegister, PasswordResetRequest, PasswordResetConfirm, EmailVerificationRequest
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.email_service import EmailService  # নতুন ইমপোর্ট
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash

router = APIRouter()
email_service = EmailService()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    নতুন ইউজার রেজিস্ট্রেশন API
    """
    auth_service = AuthService(db)
    return await auth_service.register_user(user_data)

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    লগইন API (এটি অ্যাক্সেস টোকেন রিটার্ন করে)
    """
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # টোকেন তৈরি
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", status_code=200)
async def forgot_password(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks, # ইমেইল ব্যাকগ্রাউন্ডে পাঠানোর জন্য
    db: AsyncSession = Depends(get_db)
):
    """
    ১. পাসওয়ার্ড ভুলে গেলে এই API কল হবে।
    ২. এটি একটি রিসেট টোকেন জেনারেট করে ইমেইলে পাঠিয়ে দেবে।
    """
    # ইউজার চেক করা
    result = await db.execute(select(User).filter(User.email == data.email))
    user = result.scalars().first()
    
    if not user:
        # সিকিউরিটির জন্য আমরা বলব না যে ইউজার নেই, যাতে হ্যাকাররা ইমেইল চেক করতে না পারে
        return {"message": "If the email exists, a reset link has been sent."}

    # পাসওয়ার্ড রিসেট টোকেন তৈরি (শর্ট লাইফটাইম, যেমন ১৫ মিনিট)
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset"},
        expires_delta=timedelta(minutes=15)
    )
    
    # ব্যাকগ্রাউন্ডে ইমেইল পাঠানো
    background_tasks.add_task(
        email_service.send_password_reset_email, 
        [data.email], 
        reset_token
    )
    
    return {"message": "If the email exists, a reset link has been sent."}

@router.post("/reset-password", status_code=200)
async def reset_password(
    data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """
    ১. ইমেইলে পাওয়া টোকেন এবং নতুন পাসওয়ার্ড দিয়ে এই API কল হবে।
    ২. এটি পাসওয়ার্ড ভেরিফাই এবং আপডেট করবে।
    """
    try:
        # টোকেন ডিকোড করা
        payload = jwt.decode(
            data.token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    # ইউজার খুঁজে বের করা
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # নতুন পাসওয়ার্ড সেট করা
    user.hashed_password = get_password_hash(data.new_password)
    db.add(user)
    await db.commit()
    
    return {"message": "Password has been reset successfully."}

@router.post("/verify-email", status_code=200)
async def verify_email(
    data: EmailVerificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    ইমেইল ভেরিফিকেশন API
    """
    try:
        payload = jwt.decode(
            data.token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email = payload.get("sub")
        # এখানে চাইলে টোকেন টাইপ চেক করতে পারেন যদি আলাদা টোকেন জেনারেট করেন
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.is_verified:
        return {"message": "Email already verified."}
        
    user.is_verified = True
    db.add(user)
    await db.commit()
    
    return {"message": "Email verified successfully."}