from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    # ইউজারের পাঠানো ডাটা দিয়ে ফিল্ডগুলো আপডেট করা
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.email is not None:
        # ইমেইল ইউনিক কিনা চেক করা উচিত (যদি ইমেইল চেঞ্জ এলাউ করেন)
        # সিম্পলিসিটির জন্য আপাতত সরাসরি বসাচ্ছি, তবে প্রোডাকশনে চেক করা ভালো
        current_user.email = user_in.email
    
    # পাসওয়ার্ড আপডেট লজিক এখানে আলাদাভাবে হ্যান্ডেল করা ভালো, তাই বাদ রাখা হলো
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user