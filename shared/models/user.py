from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class User(BaseModel):
    login: str
    password: str


class DBUser(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(primary_key=True)
    name: str = Field(nullable=False)
    password: str = Field(nullable=False)
