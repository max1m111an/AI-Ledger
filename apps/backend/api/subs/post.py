from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.sub import SubCreate
from shared.models.sub import SubscriptionModel
from shared.database import get_session
from shared.models.request.sub import EditSubRequest
from shared.models.request.user import IDRequest


router = APIRouter(prefix="/subs", tags=["subs"])


@router.post("/add")
async def create_sub(sub_data: SubCreate, session: AsyncSession = Depends(get_session)):
    new_db_sub = SubscriptionModel(**sub_data.model_dump())
    session.add(new_db_sub)
    await session.commit()

    await session.refresh(new_db_sub)
    return {
        "status": 200,
        "sub": new_db_sub,
    }


@router.delete("/remove")
async def delete_sub(del_sub_id: IDRequest, session: AsyncSession = Depends(get_session)):
    del_sub = await session.get(SubscriptionModel, del_sub_id.id)
    if del_sub:
        await session.delete(del_sub)
        await session.commit()
        return {
            "status": 200,
        }
    raise HTTPException(
        status_code=404,
        detail=f"No sub found by id={del_sub_id.id}"
    )


@router.post("/")
async def get_sub(sub_id: IDRequest, session: AsyncSession = Depends(get_session)):
    result = await session.get(SubscriptionModel, sub_id.id)
    if result:
        return {
            "status": 200,
            "sub": result,
        }
    raise HTTPException(
        status_code=404,
        detail=f"No sub found by id={sub_id.id}"
    )


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
