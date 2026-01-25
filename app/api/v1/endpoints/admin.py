from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from uuid import UUID

from app.api import deps
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdateAdmin
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve all users (Admin only).
    Optional: Search by email or username.
    """
    query = select(User)
    
    if search:
        query = query.filter(
            or_(
                User.email.ilike(f"%{search}%"),
                User.username.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
        )
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    return users

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user_by_admin(
    user_id: str,
    user_in: UserUpdateAdmin,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user by Admin (Change role, Block user, etc).
    """
    # 1. ইউজার খোঁজা
    try:
        uuid_obj = UUID(user_id)
        result = await db.execute(select(User).filter(User.id == uuid_obj))
        user = result.scalars().first()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # 2. ডাটা আপডেট করা
    user_data = jsonable_encoder(user)
    update_data = user_in.model_dump(exclude_unset=True)
    
    # যদি পাসওয়ার্ড আপডেট করতে চায়, তাহলে হ্যাশ করতে হবে
    if update_data.get("password"):
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        user.hashed_password = hashed_password

    for field in user_data:
        if field in update_data:
            setattr(user, field, update_data[field])

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user