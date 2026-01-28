from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID  # এটি ইমপোর্ট করতে হবে
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, default=0.0)
    is_published = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign Keys (FIXED: Integer -> UUID)
    # যেহেতু users টেবিলের id UUID, তাই এখানেও UUID হতে হবে
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Relationships
    instructor = relationship("User", back_populates="courses")