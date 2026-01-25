from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID  # 👈 এই লাইনটি যোগ করুন

# Shared properties
class CourseBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = 0.0
    is_published: Optional[bool] = False

# Properties to receive on item creation
class CourseCreate(CourseBase):
    title: str
    slug: str

# Properties to receive on item update
class CourseUpdate(CourseBase):
    pass

# Properties shared by models stored in DB
class CourseInDBBase(CourseBase):
    id: int
    slug: str
    instructor_id: UUID  # 👈 আগে এটি int ছিল, এখন UUID করে দিন
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Properties to return to client
class CourseResponse(CourseInDBBase):
    pass