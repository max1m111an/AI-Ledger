from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.user import UserCreate


class UserLoginRequest(BaseModel):
    enter_data: str  # login or email
    password: str


class EditUserRequest(UserCreate):
    id: int  # noqa: A003


class IDRequest(BaseModel):
    id: list[int]  # noqa: A003


async def parse_user(user, session: AsyncSession) -> dict:
    await session.refresh(user, ["user_subs", "user_paychecks"])
    return {
        "name": user.name,
        "email": user.email,
        "subs": user.user_subs,
        "paychecks": user.user_paychecks,
    }
