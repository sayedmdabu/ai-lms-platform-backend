from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core.database import get_db
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse

router = APIRouter()

@router.get("/", response_model=List[CourseResponse])
async def read_courses(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
) -> Any:
    """
    Retrieve all published courses (Public).
    """
    query = select(Course).filter(Course.is_published == True)
    
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=CourseResponse)
async def create_course(
    *,
    db: AsyncSession = Depends(get_db),
    course_in: CourseCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new course (Instructor/Admin only).
    """
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create a course"
        )
        
    # Check if slug exists
    result = await db.execute(select(Course).filter(Course.slug == course_in.slug))
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="Course slug already exists"
        )

    course = Course(
        **course_in.model_dump(),
        instructor_id=current_user.id
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

@router.get("/{slug}", response_model=CourseResponse)
async def read_course(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get course by slug (Public).
    """
    result = await db.execute(select(Course).filter(Course.slug == slug))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course