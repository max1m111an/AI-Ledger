from rapidfuzz import fuzz
from rapidfuzz.distance import Levenshtein
from functools import lru_cache, partial

INSERT_COST = 2
DELETE_COST = 2
SUBSTITUTE_COST = 1


@lru_cache(maxsize=50_000)
def fuzzy_score(a: str, b: str) -> float:
    if not a or not b:
        return 0.0

    dist = Levenshtein.distance(a, b, weights=(INSERT_COST, DELETE_COST, SUBSTITUTE_COST))

    la, lb = len(a), len(b)

    max_cost = min(la, lb) * SUBSTITUTE_COST + abs(la - lb) * min(INSERT_COST, DELETE_COST)

    if max_cost == 0:
        return 1.0

    return 1.0 - min(dist / max_cost, 1.0)


@lru_cache(maxsize=50_000)
def fuzzy_score_substring(pattern: str, text: str) -> float:
    if not pattern or not text:
        return 0.0

    return fuzz.partial_ratio(pattern.lower(), text.lower()) / 100.0


def max_fuzzy(keywords, text, threshold=0.6) -> float:
    best = 0.0
    words = text.split()
    for kw in keywords:
        if ' ' not in kw:
            score = max(map(partial(fuzzy_score, kw), words))
        else:
            score = fuzzy_score_substring(kw, text)
        if score > best:
            best = score
    return best if best >= threshold else 0.0
