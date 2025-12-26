from .client import ask_llm
from .prompt import PAYCHECK_CATEGORY_PROMT


def classify_paycheck_category(paycheck: str) -> str:
    prompt = PAYCHECK_CATEGORY_PROMT.format(
        paycheck_text=paycheck
    )
    return ask_llm(prompt)
