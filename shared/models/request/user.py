from pydantic import BaseModel


class UserRequestData(BaseModel):
    login: str
    password: str


class UserLoginRequest(BaseModel):
    data: UserRequestData

class UserRegisterRequest(BaseModel):
    data: UserRequestData
    email: str
    phone: int