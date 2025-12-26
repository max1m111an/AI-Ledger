import datetime
from enum import Enum

from pydantic import field_validator
from sqlmodel import SQLModel, Field, Relationship

from shared.models.user import UserModel


class PaycheckCategory(Enum):
    CAFE = "Cafe"
    SHOP = "Shop"
    OTHER = "Other"
    TRANSFER = "Transfer"
    TRANSPORT = "Transport"
    UTILITIES = "Utilities"
    HEALTHCARE = "Healthcare"
    MARKETPLACE = "Marketplace"
    ENTERTAINMENT = "Entertainment"


class PaycheckCreate(SQLModel):
    name: str | None = None
    price: int | None = None
    pay_date: float | None = datetime.datetime.now(datetime.UTC).timestamp()
    category: PaycheckCategory | None = None

    @field_validator('price')
    @classmethod
    def validate_price(cls, v: int) -> int:
        if v < 0:
            raise ValueError('Invalid price value')
        return v


class PaycheckProduct(SQLModel, table=True):  # type: ignore
    __tablename__ = "paycheck_products"

    id: int = Field(default=None, primary_key=True)  # noqa: A003
    paycheck_id: int = Field(foreign_key="paychecks.id", nullable=False)
    product_id: int = Field(foreign_key="products.id", nullable=False)
    quantity: int = Field(default=1)


class Product(SQLModel, table=True):  # type: ignore
    __tablename__ = "products"
    id: int | None = Field(default=None, primary_key=True)  # noqa: A003
    name: str = Field(index=True, nullable=False)
    price: float | None = Field(default=None)
    category: str | None = Field(default=None)

    paychecks: list["PaycheckModel"] = Relationship(  # type: ignore
        back_populates="products",
        link_model=PaycheckProduct,
    )


class PaycheckModel(PaycheckCreate, table=True):  # type: ignore
    __tablename__ = "paychecks"

    id: int = Field(default=None, primary_key=True)  # noqa: A003
    user_id: int = Field(foreign_key="users.id", nullable=False)

    paycheck_user: UserModel | None = Relationship(
        back_populates="user_paychecks",
    )
    products: list[Product] = Relationship(  # type: ignore
        back_populates="paychecks",
        link_model=PaycheckProduct,
    )
