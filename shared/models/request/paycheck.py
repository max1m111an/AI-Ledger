from shared.models.paycheck import PaycheckCreate


class EditPaycheckRequest(PaycheckCreate):
    id: int  # noqa: A003
