import io

from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import pyzbar.pyzbar as pyzbar
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
                          current_user: dict = Depends(get_current_user)):
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

    fields_to_check = ["price", "pay_date", "category", "payment_form"]

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


async def parse_paycheck_photo(photo: File[...]):
    try:
        contents = await photo.read()
        image = Image.open(io.BytesIO(contents))
        decoded_objects = pyzbar.decode(image)

        results = []
        for obj in decoded_objects:
            try:
                rect = obj.rect

                margin = 10
                left = max(0, rect.left - margin)
                top = max(0, rect.top - margin)
                right = min(image.width, rect.left + rect.width + margin)
                bottom = min(image.height, rect.top + rect.height + margin)

                qr_cropped = image.crop((left, top, right, bottom))
                cropped_decoded = pyzbar.decode(qr_cropped)

                if cropped_decoded:
                    qr_data = cropped_decoded[0].data.decode('utf-8')
                    results.append(qr_data)

            except Exception:
                continue

        return {
            "found_qr_codes": len(results),
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.post("/photo")
async def add_paycheck_by_photo(paycheck_photo: UploadFile = File(...),
                                session: AsyncSession = Depends(get_session),
                                ):
    data_list = await parse_paycheck_photo(paycheck_photo)
    """result_list = []
    for data in data_list["results"]:
        print(data)
        params = {
            "qrraw": data,
            "token": "",
        }
        url = "https://proverkacheka.com/api/v1/check/get/"
        response = requests.post(url, params=params)
        temp_data = response
        result_list.append(temp_data)"""
    return {
        "status": 200,
        "data": data_list
    }
    """new_db_paycheck = PaycheckModel(
        price=data["s"],
        pay_date=data["t"],
        category="",
        payment_form="",
    )
    new_db_paycheck.user_id = current_user["id"]
    session.add(new_db_paycheck)
    await session.commit()

    await session.refresh(new_db_paycheck)
    return {
        "status": 200,
        "paycheck": new_db_paycheck,
    }"""
