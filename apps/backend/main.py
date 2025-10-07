from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.models import UserModel
from shared.models.request.user import UserRegisterRequest
from shared.database import get_session, init_db

app = FastAPI()


@app.on_event("startup")
async def initDb():
    await init_db()


@app.post("/hello")
def getUser(name: str):
    return {
        "status": 200,
        "name": name,
    }


@app.post("/register")
async def addUser(new_user: UserRegisterRequest, session: AsyncSession = Depends(get_session)):
    try:
        new_db_user: UserModel = UserModel(
            name=new_user.data.login,
            password=new_user.data.password,
            email=new_user.email,
            phone=new_user.phone,
        )
        session.add(new_db_user)
        await session.commit()

    except IntegrityError as e:
        return HTTPException(
            status_code=400,
            detail=e.args,
        )
    await session.refresh(new_db_user)
    return new_db_user


@app.delete("/remove")
async def deleteUser(del_user_id: int, session: AsyncSession = Depends(get_session)):
    del_user = await session.get(UserModel, del_user_id)
    if del_user:
        await session.delete(del_user)
        await session.commit()
        return {
            "status": 200
        }
    return HTTPException(
        status_code=404,
        detail=f"No user found by id={del_user_id}"
    )


@app.post("/id")
async def getUserByID(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.get(UserModel, user_id)
    if result:
        return {
            "status": 200,
            "user": result,
        }
    return HTTPException(
        status_code=404,
        detail=f"No user found by id={user_id}"
    )


@app.get("/")
async def getUsers(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(UserModel))
    return result.scalars().all()
