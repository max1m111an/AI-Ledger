from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from shared.models.paycheck import PaycheckCreate, PaycheckModel
from shared.database import get_session
from shared.models.request.paycheck import EditPaycheckRequest
from shared.models.request.user import IDRequest

router = APIRouter(prefix="/paychecks", tags=["paychecks"])


@router.post("/add")
async def create_paycheck(paycheck_data: PaycheckCreate, session: AsyncSession = Depends(get_session)):
    new_db_paycheck = PaycheckModel(**paycheck_data.model_dump())
    session.add(new_db_paycheck)
    await session.commit()

    await session.refresh(new_db_paycheck)
    return {
        "status": 200,
        "paycheck": new_db_paycheck,
    }


@router.delete("/remove")
async def delete_paycheck(del_check_id: IDRequest, session: AsyncSession = Depends(get_session)):
    del_paycheck = await session.get(PaycheckModel, del_check_id.id)
    if del_paycheck:
        await session.delete(del_paycheck)
        await session.commit()
        return {
            "status": 200,
        }
    raise HTTPException(
        status_code=404,
        detail=f"No paycheck found by id={del_check_id.id}"
    )


@router.post("/")
async def get_paycheck(check_id: IDRequest, session: AsyncSession = Depends(get_session)):
    result = await session.get(PaycheckModel, check_id.id)
    if result:
        return {
            "status": 200,
            "paycheck": result,
        }
    raise HTTPException(
        status_code=404,
        detail=f"No paycheck found by id={check_id.id}"
    )


@router.patch("/edit")
async def update_paycheck(edit_check_data: EditPaycheckRequest, session: AsyncSession = Depends(get_session)):
    check_this_id = await session.get(PaycheckModel, edit_check_data.id)
    if not check_this_id:
        raise HTTPException(
            status_code=404,
            detail=f"No paycheck found by id={edit_check_data.id}"
        )

    fields_to_check = ["price", "pay_date", "store_name", "category", "payment_form"]

    for field in fields_to_check:
        value = getattr(edit_check_data, field, None)
        if value:
            setattr(check_this_id, field, value)
    session.add(check_this_id)
    await session.commit()
    await session.refresh(check_this_id)

    return {
        "status": 200,
        "paycheck": check_this_id,
    }
