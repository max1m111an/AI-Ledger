from typing import Optional

from pydantic import field_validator
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


ALLOWED_DOMAINS: list[str] = ["inbox.ru", "gmail.com", "mail.ru", "mail.com", "list.ru"]


class UserCreate(SQLModel):
    name: str
    password: str
    email: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email format')

        domain = v.split('@')[-1]
        if domain not in ALLOWED_DOMAINS:
            raise ValueError(f'Only emails from {ALLOWED_DOMAINS} are allowed')

        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?`~' for c in v):
            raise ValueError('Password must contain at least one special character')

        return v


class UserModel(UserCreate, table=True):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", "name"),)

    id: Optional[int] = Field(default=None, primary_key=True)
