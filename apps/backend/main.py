from fastapi import FastAPI, Depends
from sqlalchemy import delete
from sqlmodel import select, and_
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.models import UserModel
from shared.models.request.user import UserRegisterRequest, UserLoginRequest
from shared.database import get_session, init_db, exe_q

app = FastAPI()


@app.post("/hello")
def getUser(name: str):
    return {
        "status": "200",
        "name": name,
    }


@app.on_event("startup")
async def initDb():
    await init_db()


@app.post("/register")
async def addUser(new_user: UserRegisterRequest, session: AsyncSession = Depends(get_session)):
    new_db_user: UserModel = UserModel(
        name=new_user.data.login,
        password=new_user.data.password,
        email=new_user.email,
        phone=new_user.phone,
    )
    session.add(new_db_user)
    await session.commit()
    await session.refresh(new_db_user)
    return new_db_user


@app.delete("/remove")
async def deleteUser(user_to_delete: UserLoginRequest, session: AsyncSession = Depends(get_session)):
    del_user_stmt = delete(
        UserModel,
    ).where(
        and_(UserModel.name == user_to_delete.data.login,
        UserModel.password == user_to_delete.data.password),
    )

    await session.execute(del_user_stmt)
    await session.commit()
    return {
        "status": "200"
    }


@app.post("/id")
async def getUserByID(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(UserModel).where(UserModel.id == user_id), session, True)
    return result


@app.post("/")
async def getUsers(session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(UserModel), session)
    return result
