import regex as re

PRICE_RE = re.compile(r"\b\d+[.,]\d{2}\b")

QTY_RE = re.compile(r"\b\d+(?:[.,]\d+)?\s*(шт|kg|кг|г|гр|л|мл|x)\b", re.IGNORECASE)

PRODUCT_REGEXES = [
    PRICE_RE,
    re.compile(r"\b[xх]{2,3}[.,][xх]{2}\b", re.IGNORECASE),
    re.compile(r"\bшт\.?\b"),
    re.compile(r"\bкг\b"),
    re.compile(r"\bл\b"),
    re.compile(r"\bмл\b"),
    re.compile(r"\bгр\b"),
    re.compile(r"\bг\b"),
    re.compile(r"\b\d+\s*[xх\*]\b", re.IGNORECASE),
    re.compile(r"\*"),
    re.compile(r"%"),
]


def has_price(text: str) -> bool:
    return bool(PRICE_RE.search(text))


def has_qty(text: str) -> bool:
    return bool(QTY_RE.search(text))


def product_pattern_score(text: str) -> int:
    return sum(1 for r in PRODUCT_REGEXES if r.search(text))
