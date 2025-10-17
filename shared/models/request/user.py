from pydantic import BaseModel


class UserLoginRequest(BaseModel):
    enter_data: str  # login or email
    password: str
