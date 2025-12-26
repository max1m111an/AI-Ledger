from .product_patterns import has_price, has_qty, product_pattern_score
from .fuzzy import max_fuzzy
from .config import START_KEYWORDS, END_KEYWORDS, STOPWORDS, WEIGHTS
from .hard_stop import is_hard_stop


def score_line_debug(line: str) -> dict:
    start_fuzzy = max_fuzzy(START_KEYWORDS, line)
    end_fuzzy = max_fuzzy(END_KEYWORDS, line)
    stop_fuzzy = max_fuzzy(STOPWORDS, line)

    parts = {"price": WEIGHTS["price"] if has_price(line) else 0.0,
             "qty": WEIGHTS["qty"] if has_qty(line) else 0.0}

    pattern_hits = product_pattern_score(line)
    parts["product_pattern"] = 1.2 * pattern_hits

    parts["start_kw"] = WEIGHTS["start_kw"] * start_fuzzy
    parts["end_kw"] = WEIGHTS["end_kw"] * end_fuzzy
    parts["stopword"] = WEIGHTS["stopword"] * stop_fuzzy

    parts["hard_stop"] = WEIGHTS["hard_stop"] if is_hard_stop(line) else 0.0

    score = sum(parts.values())

    return {
        "score": score,
        "fuzzy": {
            "start": start_fuzzy,
            "end": end_fuzzy,
            "stop": stop_fuzzy,
        },
        "patterns": {
            "product_hits": pattern_hits,
            "has_price": has_price(line),
            "has_qty": has_qty(line),
        },
        "parts": parts,
    }
