from pydantic import BaseModel

from shared.models.models import UserCreate


class UserLoginRequest(BaseModel):
    enter_data: str  # login or email
    password: str


class EditUserRequest(UserCreate):
    edit_user_id: int