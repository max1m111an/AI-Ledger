import io

import numpy as np
from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from paddleocr import PaddleOCR
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

    fields_to_check = ["price", "pay_date", "category"]

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


ocr = PaddleOCR(
    use_angle_cls=True,
    lang='ru',
)


def ocr_pdf_paddle(image):
    print("START COMPRESSING...")  # noqa: T201
    COMPRESS_SCALE = 0.5
    width, height = image.size
    new_size = (int(width * COMPRESS_SCALE), int(height * COMPRESS_SCALE))
    img_resized = image.resize(new_size, Image.LANCZOS)
    image_array = np.array(img_resized)

    return ocr.predict(image_array)


async def perform_ocr(file: UploadFile):
    print("IMAGE READING...")  # noqa: T201

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")  # Ensure RGB

    # Perform OCR
    result = ocr_pdf_paddle(image)
    print("FILE PREDICTION ENDED")  # noqa: T201

    if isinstance(result, list) and len(result) > 0:
        rec_texts = result[0].get("rec_texts", [])
    elif isinstance(result, dict):
        rec_texts = result.get("rec_texts", [])
    else:
        rec_texts = []

    print("SENDING RESPONSE...")  # noqa: T201
    return rec_texts


valid_ext: list[str] = ['jpg', 'png']


@router.post("/photo")
async def add_paycheck_by_photo(paycheck_photo: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    name_: str = paycheck_photo.filename
    photo_ext: str = name_[name_.find('.') + 1:]
    if photo_ext not in valid_ext:
        raise HTTPException(
            status_code=400,
            detail=f'File has invalid extension {photo_ext}. Allowed only {valid_ext[:]}.'
        )

    photo_data = await perform_ocr(paycheck_photo)

    return {
        "status": 200,
        "data": photo_data
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
