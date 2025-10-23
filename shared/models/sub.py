from datetime import date

from pydantic import field_validator
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


class SubCreate(SQLModel):
    name: str | None = None
    price: int | None = None
    period: int | None = None
    payday: date | None = None

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: int) -> int:
        if v < 1:
            raise ValueError('Invalid price value')
        return v

    @field_validator('period')
    @classmethod
    def validate_period(cls, v: int) -> int:
        if v < 1:
            raise ValueError('Invalid period value')
        return v


class SubscriptionModel(SubCreate, table=True):
    __tablename__ = "subs"
    __table_args__ = (UniqueConstraint("name", "period"),)

    id: int = Field(default=None, primary_key=True)  # noqa: A003
    user_id: int = Field(nullable=False, foreign_key="users.id")