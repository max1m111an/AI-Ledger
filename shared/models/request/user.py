from pydantic import BaseModel

from shared.models.user import UserCreate, UserModel


class UserLoginRequest(BaseModel):
    enter_data: str  # login or email
    password: str


class EditUserRequest(UserCreate):
    id: int  # noqa: A003


class IDRequest(BaseModel):
    id: list[int]  # noqa: A003


def parse_user(user: UserModel | type[UserModel]) -> dict:
    return {
        "name": user.name,
        "email": user.email,
    }
