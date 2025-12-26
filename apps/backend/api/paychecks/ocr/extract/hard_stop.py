import regex as re

HARD_STOP_REGEXES = [
    re.compile(r"\b\d{8,}\b"),
    re.compile(r"\b[a-z0-9]{15,}\b", re.IGNORECASE),
    re.compile(r"\b[a-f0-9]{20,}\b", re.IGNORECASE),
    re.compile(r"\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b"),
    re.compile(r"\b\d{1,2}:\d{2}\b"),
    re.compile(r"qr[- ]?код"),
    re.compile(r"http[s]?://"),
]


def is_hard_stop(text: str) -> bool:
    return any(r.search(text) for r in HARD_STOP_REGEXES)
