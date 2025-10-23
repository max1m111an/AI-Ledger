from pydantic import BaseModel

from shared.models.user import UserCreate, UserModel


class UserLoginRequest(BaseModel):
    enter_data: str  # login or email
    password: str


class EditUserRequest(UserCreate):
    id: int


class IDRequest(BaseModel):
    id: int


def parse_user(user: UserModel) -> dict:
    return {
        "name": user.name,
        "email": user.email,
    }