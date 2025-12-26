from .text.ocr import perform_ocr
from .extract.extractor import extract_products
from .extract.paycheck_metadata_extractor import extract_paycheck_metadata
from .llm.classify import classify_paycheck_category


async def process_paycheck_photo(file_bytes: bytes) -> dict:
    text = perform_ocr(file_bytes)

    products = extract_products(text)
    metadata = extract_paycheck_metadata(text)
    category = classify_paycheck_category(
        paycheck=text
    )

    return {
        "products": products,
        "metadata": metadata,
        "category": category,
    }
