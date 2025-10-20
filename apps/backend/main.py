from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import update
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.models import UserModel, UserCreate
from shared.database import get_session, init_db
from shared.models.request.user import EditUserRequest, parse_user, UserIDRequest

app = FastAPI()


@app.on_event("startup")
async def initDb():
    await init_db()


@app.post("/hello")
def getName(name: str):
    return {
        "status": 200,
        "name": name,
    }


@app.post("/register")
async def createUser(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    try:
        user_dict = user_data.model_dump()
        password = user_dict.pop("hash_password")
        new_db_user = UserModel(**user_dict)
        new_db_user.set_password(password)

        session.add(new_db_user)
        await session.commit()

    except IntegrityError as e:  # check if duplicate data was input
        raise HTTPException(
            status_code=400,
            detail=e.args,
        )
    await session.refresh(new_db_user)
    return {
        "status": 200,
        "user": parse_user(new_db_user),
    }


@app.delete("/remove")
async def deleteUser(del_user_id: UserIDRequest, session: AsyncSession = Depends(get_session)):
    del_user = await session.get(UserModel, del_user_id.id)
    if del_user:
        await session.delete(del_user)
        await session.commit()
        return {
            "status": 200,
        }
    raise HTTPException(
        status_code=404,
        detail=f"No user found by id={del_user_id.id}"
    )


@app.post("/")
async def getUser(user_id: UserIDRequest, session: AsyncSession = Depends(get_session)):
    result = await session.get(UserModel, user_id.id)
    if result:
        return {
            "status": 200,
            "user": parse_user(result),
        }
    raise HTTPException(
        status_code=404,
        detail=f"No user found by id={user_id.id}"
    )


@app.patch("/edit")
async def updateUser(edit_user_data: EditUserRequest, session: AsyncSession = Depends(get_session)):
    user_this_id = await session.get(UserModel, edit_user_data.id)
    if not user_this_id:
        raise HTTPException(
            status_code=404,
            detail=f"No user found by id={edit_user_data.id}"
        )

    if edit_user_data.password:
        user_this_id.set_password(edit_user_data.password)

    if edit_user_data.email or edit_user_data.name:
        update_values = {}
        fields_to_check = ['email', 'name']

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
    await session.refresh(user_this_id)

    return {
        "status": 200,
        "user": parse_user(user_this_id),
    }
