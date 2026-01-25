# File: backend/scripts/create_superuser.py
import asyncio
import sys
import os

# পাইথন পাথ সেট করা হচ্ছে যাতে 'app' মডিউল খুঁজে পায়
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash

async def create_superuser():
    print("🚀 Creating Super User...")
    
    async with AsyncSessionLocal() as db:
        email = "admin@sayshan.com"
        username = "admin"
        password = "adminsayshan" # আপনি চাইলে পাসওয়ার্ড চেঞ্জ করতে পারেন

        # নতুন ইউজার অবজেক্ট তৈরি
        user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            full_name="Super Admin",
            role="admin",        # রোল অ্যাডমিন দেওয়া হলো
            is_active=True,
            is_verified=True
        )
        
        db.add(user)
        try:
            await db.commit()
            print("--------------------------------------------------")
            print("✅ Superuser created successfully!")
            print(f"📧 Email:    {email}")
            print(f"🔑 Password: {password}")
            print("--------------------------------------------------")
        except Exception as e:
            print(f"❌ Error: {e}")
            print("User might already exist using this email/username.")

if __name__ == "__main__":
    asyncio.run(create_superuser())