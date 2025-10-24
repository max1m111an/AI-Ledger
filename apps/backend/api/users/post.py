from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.user import UserModel, UserCreate
from shared.database import get_session
from shared.models.request.user import EditUserRequest, parse_user, IDRequest


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register")
async def create_user(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    try:
        user_dict = user_data.model_dump()
        password = user_dict.pop("password")
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


@router.delete("/remove")
async def delete_user(del_user_id: IDRequest, session: AsyncSession = Depends(get_session)):
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


@router.post("/")
async def get_users(user_id: IDRequest, session: AsyncSession = Depends(get_session)):
    users_arr = []
    for user in user_id.id:
        result = await session.get(UserModel, user)
        users_arr.append(parse_user(result))
    return {
        "status": 200,
        "users": users_arr,
    }


@router.patch("/edit")
async def update_user(edit_user_data: EditUserRequest, session: AsyncSession = Depends(get_session)):
    user_this_id = await session.get(UserModel, edit_user_data.id)
    if not user_this_id:
        raise HTTPException(
            status_code=404,
            detail=f"No user found by id={edit_user_data.id}"
        )

    if edit_user_data.password:
        user_this_id.set_password(edit_user_data.password)

    if edit_user_data.email or edit_user_data.name:
        fields_to_check = ["email", "name"]

        for field in fields_to_check:
            value = getattr(edit_user_data, field, None)
            if value:
                setattr(user_this_id, field, value)

        session.add(user_this_id)
    await session.commit()
    await session.refresh(user_this_id)

    return {
        "status": 200,
        "user": parse_user(user_this_id),
    }
