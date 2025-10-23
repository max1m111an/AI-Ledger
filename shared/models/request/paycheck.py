from shared.models.paycheck import PaycheckCreate


class EditPaycheckRequest(PaycheckCreate):
    id: int