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
from app.services.email_service import EmailService
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
    Register a new user.
    """
    auth_service = AuthService(db)
    user = await auth_service.register_user(user_data)
    
    # Create verification token (valid for 24 hours)
    verify_token = create_access_token(
        data={"sub": user.email, "type": "verification"},
        expires_delta=timedelta(hours=24)
    )
    
    # Send verification email in background (uncomment to enable)
    await email_service.send_verification_email([user.email], verify_token)
    
    return user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Login user and return JWT token.
    """
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# 👇 NEW ENDPOINTS

@router.post("/forgot-password", status_code=200)
async def forgot_password(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Request password reset link.
    """
    result = await db.execute(select(User).filter(User.email == data.email))
    user = result.scalars().first()
    
    # We return success even if user doesn't exist to prevent email enumeration
    if not user:
        return {"message": "If the email exists, a reset link has been sent."}

    # Generate reset token (valid for 15 mins)
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset"},
        expires_delta=timedelta(minutes=15)
    )
    
    # Send email in background
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
    Set new password using the token received in email.
    """
    try:
        payload = jwt.decode(
            data.token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update password
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
    Verify email address using token.
    """
    try:
        payload = jwt.decode(
            data.token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email = payload.get("sub")
        # You can add token_type check here if you want stricter validation
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