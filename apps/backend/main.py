from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import select, update
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.models import UserModel, UserCreate
from shared.database import get_session, init_db
from shared.models.request.user import EditUserRequest

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
async def addUser(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    try:
        new_db_user: UserModel = UserModel(**user_data.model_dump())
        session.add(new_db_user)
        await session.commit()

    except IntegrityError as e:  # check if duplicate data was input
        raise HTTPException(
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
    raise HTTPException(
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
    raise HTTPException(
        status_code=404,
        detail=f"No user found by id={user_id}"
    )


@app.patch("/edit")
async def editUser(edit_user_data: EditUserRequest, session: AsyncSession = Depends(get_session)):
    user_this_id = await session.get(UserModel, edit_user_data.edit_user_id)
    if not user_this_id:
        raise HTTPException(
            status_code=404,
            detail=f"No user found by id={edit_user_data.edit_user_id}"
        )

    update_values = {}
    fields_to_check = ['email', 'name', 'password']

    for field in fields_to_check:
        value = getattr(edit_user_data, field, None)
        if value:
            update_values[field] = value

    edit_user_stmt = update(
        UserModel,
    ).where(
        UserModel.id == edit_user_data.edit_user_id,
    ).values(**update_values)

    await session.execute(edit_user_stmt)
    await session.commit()
    result = await session.get(UserModel, edit_user_data.edit_user_id)

    return {
        "status": 200,
        "user": result,
    }

@app.get("/")
async def getUsers(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(UserModel))
    return result.scalars().all()
