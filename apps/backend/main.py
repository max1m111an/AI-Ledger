from fastapi import FastAPI, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.user import UserRegisterRequest, UserModel
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


@app.post("/add")
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

@app.post("/id")
async def getUserByID(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(UserModel).where(UserModel.id == user_id), session, True)
    return result


@app.post("/")
async def getUsers(session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(UserModel), session)
    return result
