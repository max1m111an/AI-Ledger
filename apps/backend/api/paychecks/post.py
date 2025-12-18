from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.main import get_current_user
from shared.models.paycheck import PaycheckCreate, PaycheckModel
from shared.database import get_session
from shared.models.request.paycheck import EditPaycheckRequest
from shared.models.request.user import IDRequest

router = APIRouter(prefix="/paychecks", tags=["paychecks"])


@router.post("/add")
async def create_paycheck(paycheck_data: PaycheckCreate,
                          session: AsyncSession = Depends(get_session),
                          current_user = Depends(get_current_user)):
    new_db_paycheck = PaycheckModel(**paycheck_data.model_dump())
    new_db_paycheck.user_id = current_user["id"]
    session.add(new_db_paycheck)
    await session.commit()

    await session.refresh(new_db_paycheck)
    return {
        "status": 200,
        "paycheck": new_db_paycheck,
    }


@router.delete("/remove")
async def delete_paychecks(del_check_id: IDRequest, session: AsyncSession = Depends(get_session)):
    for del_check in del_check_id.id:
        del_paycheck = await session.get(PaycheckModel, del_check)
        await session.delete(del_paycheck)
    await session.commit()
    return {
        "status": 200,
    }


@router.get("/")
async def get_paychecks(current_user: dict = Depends(get_current_user)):
    return {
        "status": 200,
        "paychecks": current_user["paychecks"],
    }


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
