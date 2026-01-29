from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from app.core.config import settings
from typing import List

# Email Configuration Setup
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
        """Send account verification email"""
        verify_url = f"http://localhost:3000/verify-email?token={token}"
        
        html = f"""
        <h3>Welcome to AI LMS!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verify_url}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <br><br>
        <p>Or copy this link:</p>
        <p>{verify_url}</p>
        """

        message = MessageSchema(
            subject="Verify your Account - AI LMS",
            recipients=email,
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        
        # 👇 PRINT LOGS ADDED HERE
        print(f"➡️ Attempting to send verification email to: {email}")
        try:
            await fm.send_message(message)
            print(f"✅ Verification email sent successfully to: {email}")
        except Exception as e:
            print(f"❌ Failed to send verification email. Error: {str(e)}")

    async def send_password_reset_email(self, email: List[EmailStr], token: str):
        """Send password reset email"""
        reset_url = f"http://localhost:3000/reset-password?token={token}"
        
        html = f"""
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_url}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <br><br>
        <p>If you didn't request this, please ignore this email.</p>
        """

        message = MessageSchema(
            subject="Reset Your Password - AI LMS",
            recipients=email,
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)

        # 👇 PRINT LOGS ADDED HERE
        print(f"➡️ Attempting to send password reset email to: {email}")
        try:
            await fm.send_message(message)
            print(f"✅ Password reset email sent successfully to: {email}")
        except Exception as e:
            print(f"❌ Failed to send password reset email. Error: {str(e)}")