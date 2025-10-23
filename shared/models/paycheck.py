from datetime import date
from enum import Enum

from pydantic import field_validator
from sqlmodel import SQLModel, Field


class PaymentForm(Enum):
    CASH = "Cash"
    NON_CASH = "Non_cash"


class PaycheckCategory(Enum):
    CAFE = "Cafe"
    OTHER = "Other"
    TRANSFER = "Transfer"
    TRANSPORT = "Transport"
    UTILITIES = "Utilities"
    HEALTHCARE = "Healthcare"
    MARKETPLACE = "Marketplace"
    ENTERTAINMENT = "Entertainment"


class PaycheckCreate(SQLModel):
    price: int | None = None
    pay_date: date | None = None
    store_name: str | None = None
    category: PaycheckCategory | None = None
    payment_form: PaymentForm | None = None

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: int) -> int:
        if v < 1:
            raise ValueError('Invalid price value')
        return v


class PaycheckModel(PaycheckCreate, table=True):  # type: ignore
    __tablename__ = "paychecks"

    id: int = Field(default=None, primary_key=True)  # noqa: A003
    user_id: int = Field(nullable=False, foreign_key="users.id")
