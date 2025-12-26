import re
from datetime import datetime
from contextlib import suppress


PAYMENT_PROVIDERS = [
    "сбербанк",
    "тинькофф",
    "альфабанк",
    "втб",
    "газпромбанк",
    "райффайзен",
    "mir",
    "visa",
    "mastercard",
    "оплата",
    "терминал"
]

FORBIDDEN_STORE_WORDS = [
    "кассир", "операция", "прервана", "оплата", "терминал",
    "полный расчет", "добро пожаловать",
    "play google", "google", "app", "счет",
    "гостей", "стол", "открыт",
    "итог", "безналичными", "чек", "#",
    "kkt", "ккт", "фн", "fn", "фд", "fd",
    "фп", "fp", "inn", "инн", "rn", "rrn"
]

STORE_NAME_KEYWORDS = [
    "магазин",
    "ооо",
    "пао",
    "ао",
    "ип",
]

SERVICE_WORDS = [
    "кассовый",
    "чек",
    "приход",
    "итог",
    "сумма",
    "дата",
    "время",
    "инн",
    "ккт",
    "терминал",
    "оплата"
]

KNOWN_STORES = {
    "Магнит": ["магнит", "magnit", "ммагнит"],
    "Пятерочка": ["пятерочка", "5ка"],
    "Дикси": ["дикси"],
    "О'кей": ["окей"],
    "Перекресток": ["перекресток"],
    "Ашан": ["ашан"],
    "Лента": ["лента"],
    "ДНС": ["днс"],
    "МВидео": ["мвидео"],
    "Ситилинк": ["ситилинк"],
    "Эльдорадо": ["эльдорадо"],
    "Петрович": ["петрович"],
    "Максидом": ["максидом"],
    "Золотое Яблоко": ["золотое яблоко", "золотоеяблоко"],
    "Детский мир": ["детский мир", "детский мир"],
    "Буквоед": ["буквоед"],
    "Читай-город": ["читай-город", "читай город", "читайгород"],
    "Лабиринт": ["лабиринт"],
    "ВкусВилл": ["вкусвилл"],
    "Бургер Кинг": ["бургер кинг", "бургеркинг"],
    "Вкусно и точка": ["vkusnoitochka.ru", "вкусно - и точка", "вкусноиточка"],
    "Хлебник": ["хлебник"],
    "Люди Любят": ["люди любят", "людилюбят"],
    "Теремок": ["теремок", "теремок-кондитерская"],
    "Токио Сити": ["мурасаки"],
    "Мама Рада": ["мама рада", "mama rada", "mamarada", "прохинкали"],
    "Брынза": ["экс", "3кс"],
    "Коно": ["Копо-", "коно"]
}

TOTAL_KEYWORDS = [
    "итог",
    "итого",
    "к оплате",
    "безналичными",
    "оплата"
]


def normalize_datetime_string(s: str) -> str:
    s = s.replace("_", " ")
    s = s.replace(":", ".", 2) if s.count(":") >= 2 else s

    return re.sub(r"(\d{2})/(\d)(\d{2})(\d{4})", r"\1/\2\3/\4", s)


DATE_TIME_PATTERNS = [
    r"(?P<dt>\d{2}[./:/]\d{2}[./:/]\d{4}\s+\d{1,2}:\d{2}(:\d{2})?)",
    r"(?P<dt>\d{2}[./:/]\d{2}[./:/]\d{2}\s+\d{1,2}:\d{2})",
    r"(?P<dt>\d{2}[./:/]\d{2}[./:/]\d{4})",
]


def extract_datetime(text: str):
    for pattern in DATE_TIME_PATTERNS:
        match = re.search(pattern, text)
        if match:
            raw = normalize_datetime_string(match.group("dt"))
            for fmt in (
                "%d.%m.%Y %H:%M:%S",
                "%d.%m.%Y %H:%M",
                "%d.%m.%Y",
                "%d.%m.%y %H:%M",
            ):
                with suppress(ValueError):
                    datetime.strptime(raw, fmt)
    return None


def extract_total(text: str) -> float | None:
    candidates = []

    for line in text.splitlines():
        lower = line.lower()
        if any(k in lower for k in TOTAL_KEYWORDS):
            nums = re.findall(r"\d+[.,]\d{2}", line)
            candidates.extend(nums)

    if not candidates:
        candidates = re.findall(r"\d+[.,]\d{2}", text)

    try:
        return float(max(candidates, key=lambda x: float(x.replace(",", "."))).replace(",", "."))
    except Exception:
        return None


def clean_brand_name(text: str) -> str:
    text = text.strip()
    text = re.sub(r'(магазин|место расчетов|ооо|ип)', '', text, flags=re.I)
    text = re.sub(r'[\"«»“”_]', '', text)
    text = re.sub(r'\s{2,}', ' ', text).strip()
    return text.title()


def extract_brand_like_store(lines: list[str]) -> str | None:
    for line in lines[:7]:
        raw = line.strip()
        lower = raw.lower()

        if len(raw) < 4 or len(raw) > 40:
            continue

        if any(word in lower for word in SERVICE_WORDS):
            continue

        if re.fullmatch(r"[\d\s]+", raw):
            continue

        if not re.search(r"[а-яА-Яa-zA-Z]", raw):
            continue

        cleaned = clean_brand_name(raw)
        if looks_like_store_name(cleaned):
            return cleaned

    return None


def contains_known_brand(text: str) -> str | None:
    lower = text.lower()
    for brand, keys in KNOWN_STORES.items():
        if any(k in lower for k in keys):
            return brand
    return None


def extract_explicit_shop_name(lines: list[str]) -> str | None:
    shop_types = r"\b(магазин|кафе|пекарня|ресторан)\b"

    pattern = re.compile(
        rf'{shop_types}\s*[\"«“]?([^\"»”]{{3,50}})[\"»”]?',
        re.IGNORECASE
    )

    for line in lines:
        match = pattern.search(line)
        if not match:
            continue

        raw_name = match.group(2).strip()

        known = contains_known_brand(raw_name)
        if known:
            return known

        if looks_like_store_name(raw_name):
            return clean_brand_name(raw_name)

        continue

    return None


VOWELS = set("аеёиоуыэюя")


def looks_like_store_name(s: str) -> bool:
    s = s.lower().strip()

    if len(s) < 4:
        return False

    if re.search(r"(kkt|ккт|фн|фд|фп|rrn|инн)", s):
        return False

    if re.search(r"\d{6,}", s):
        return False

    if re.match(r"^\d\s+[а-яё]", s):
        return False

    if sum(1 for c in s if c in VOWELS) == 0:
        return False

    if re.fullmatch(r"[а-яё]{4,}", s):
        return False

    return not any(word in s for word in FORBIDDEN_STORE_WORDS)


def extract_quoted_store(lines: list[str]) -> str | None:
    pattern = re.compile(r'000\s*[\"«“]?([А-Яа-яA-Za-z0-9\s]{3,40})[\"»”]?', re.I)

    for line in lines[:10]:
        match = pattern.search(line)
        if match:
            name = clean_brand_name(match.group(1))
            if looks_like_store_name(name):
                return name

    return None


def extract_place_of_payment(lines: list[str]) -> str | None:
    for idx, line in enumerate(lines):
        if "место расчетов" in line.lower():

            candidates = []

            if ":" in line:
                candidates.append(line.split(":", 1)[1].strip())
            else:
                candidates.append(line)

            if idx + 1 < len(lines):
                candidates.append(lines[idx + 1].strip())

            cleaned = []
            for c in candidates:
                c = re.sub(r'(место расчетов|магазин|ресторан|кафе|пекарня|000)', '', c, flags=re.I)
                c = re.sub(r'[\"«»“”_]', '', c)
                c = re.sub(r'\s{2,}', ' ', c).strip()

                if c and looks_like_store_name(c):
                    cleaned.append(c)

            for c in cleaned:
                for brand in KNOWN_STORES:
                    if brand.lower() in c.lower():
                        return brand

            if cleaned:
                return clean_brand_name(cleaned[0])

    return None


def extract_store(text: str) -> str | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    lower_text = text.lower()

    quoted = extract_quoted_store(lines)
    if quoted:
        return quoted

    explicit = extract_explicit_shop_name(lines)
    if explicit:
        return explicit

    for store, keys in KNOWN_STORES.items():
        if any(k in lower_text for k in keys):
            return store

    place = extract_place_of_payment(lines)
    if place:
        return place

    for line in lines[:10]:
        lower = line.lower()
        if any(bad in lower for bad in FORBIDDEN_STORE_WORDS):
            continue
        if any(p in lower for p in PAYMENT_PROVIDERS):
            continue
        if any(k in lower for k in STORE_NAME_KEYWORDS):
            return clean_brand_name(line)

    brand = extract_brand_like_store(lines)
    if brand:
        return brand

    return None


def extract_paycheck_metadata(text: str) -> dict[str, object | None]:
    dt = extract_datetime(text)
    timestamp = dt.timestamp() if dt else None

    return {
        "pay_date": timestamp,
        "name": extract_store(text),
        "price": extract_total(text)
    }
