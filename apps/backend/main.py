from fastapi import FastAPI, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.user import User, DBUser
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
async def addUser(new_user: User, session: AsyncSession = Depends(get_session)):
    dbuser: DBUser = DBUser(name=new_user.login, password=new_user.password)
    session.add(dbuser)
    await session.commit()
    await session.refresh(dbuser)
    return dbuser

@app.post("/id")
async def getUserByID(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(DBUser).where(DBUser.id == user_id), session, True)
    return result


@app.post("/")
async def getUsers(session: AsyncSession = Depends(get_session)):
    result = await exe_q(select(DBUser), session)
    return result
