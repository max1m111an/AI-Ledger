from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import IntegrityError

from auth.main import get_current_user
from shared.models.sub import SubCreate
from shared.models.sub import SubscriptionModel
from shared.database import get_session
from shared.models.request.sub import EditSubRequest
from shared.models.request.user import IDRequest

router = APIRouter(prefix="/subs", tags=["subs"])


@router.post("/add")
async def create_sub(sub_data: SubCreate,
                     session: AsyncSession = Depends(get_session),
                     current_user: dict = Depends(get_current_user)):
    try:
        new_db_sub = SubscriptionModel(**sub_data.model_dump())
        new_db_sub.user_id = current_user["id"]
        session.add(new_db_sub)
        await session.commit()
    except IntegrityError as e:
        raise HTTPException(
            status_code=400,
            detail=e.args,
        )

    await session.refresh(new_db_sub)
    return {
        "status": 200,
        "sub": new_db_sub,
    }


@router.delete("/remove")
async def delete_subs(del_sub_id: IDRequest, session: AsyncSession = Depends(get_session)):
    for del_sub in del_sub_id.id:
        del_sub = await session.get(SubscriptionModel, del_sub)
        await session.delete(del_sub)
    await session.commit()
    return {
        "status": 200,
    }


@router.get("/")
async def get_subs(current_user: dict = Depends(get_current_user)):
    return {
        "status": 200,
        "subs": current_user["subs"],
    }


@router.patch("/edit")
async def update_sub(edit_sub_data: EditSubRequest, session: AsyncSession = Depends(get_session)):
    sub_this_id = await session.get(SubscriptionModel, edit_sub_data.id)
    if not sub_this_id:
        raise HTTPException(
            status_code=404,
            detail=f"No sub found by id={edit_sub_data.id}"
        )

    fields_to_check = ["price", "payday", "period", "name"]

    for field in fields_to_check:
        value = getattr(edit_sub_data, field, None)
        if value:
            setattr(sub_this_id, field, value)
    session.add(sub_this_id)
    await session.commit()
    await session.refresh(sub_this_id)

    return {
        "status": 200,
        "sub": sub_this_id,
    }
