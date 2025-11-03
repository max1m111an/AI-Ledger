from passlib.context import CryptContext
from pydantic import field_validator
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel, Relationship

ALLOWED_DOMAINS: list[str] = ["inbox.ru", "gmail.com", "mail.ru", "mail.com", "list.ru"]

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class UserCreate(SQLModel):
    name: str | None = None
    password: str | None = None
    email: str | None = None

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

        if not any(c in '!@#$%^&*()_+-=[]{}|;:\'",.<>?`~' for c in v):
            raise ValueError('Password must contain at least one special character')

        return v


class UserModel(UserCreate, table=True):  # type: ignore
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", "name"),)

    id: int | None = Field(default=None, primary_key=True)  # noqa: A003
    user_paychecks: list["PaycheckModel"] | None = Relationship(back_populates="paycheck_user", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete-orphan"})  # type: ignore
    user_subs: list["SubscriptionModel"] | None = Relationship(back_populates="sub_user", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete-orphan"})  # type: ignore

    def set_password(self, password: str) -> None:
        self.password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password)
