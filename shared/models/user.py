from pydantic import BaseModel
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


class UserRequestData(BaseModel):
    login: str
    password: str


class UserLoginRequest(BaseModel):
    data: UserRequestData

class UserRegisterRequest(BaseModel):
    data: UserRequestData
    email: str
    phone: int



class UserModel(SQLModel, table=True):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", "name", "phone"),)

    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    password: str = Field(nullable=False)
    email: str = Field(nullable=False)
    phone: str = Field(nullable=False)
