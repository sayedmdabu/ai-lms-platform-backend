from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from app.core.config import settings
from typing import List

# ইমেইল কনফিগারেশন সেটআপ
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

class EmailService:
    async def send_verification_email(self, email: List[EmailStr], token: str):
        """ভেরিফিকেশন ইমেইল পাঠানো"""
        # প্রোডাকশনে ফ্রন্টএন্ড URL ব্যবহার করবেন
        verify_url = f"http://localhost:3000/auth/verify-email?token={token}"
        
        html = f"""
        <h3>Welcome to AI LMS!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verify_url}">Verify Email</a>
        <br>
        <p>Or copy this token: {token}</p>
        """

        message = MessageSchema(
            subject="Verify your Account - AI LMS",
            recipients=email,
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    async def send_password_reset_email(self, email: List[EmailStr], token: str):
        """পাসওয়ার্ড রিসেট ইমেইল পাঠানো"""
        reset_url = f"http://localhost:3000/auth/reset-password?token={token}"
        
        html = f"""
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_url}">Reset Password</a>
        <br>
        <p>If you didn't request this, please ignore this email.</p>
        """

        message = MessageSchema(
            subject="Reset Your Password - AI LMS",
            recipients=email,
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)