from .scoring_debug import score_line_debug
from .config import WEIGHTS


def find_best_segment_debug(lines):
    debug = [score_line_debug(line) for line in lines]
    scores = [d["score"] for d in debug]

    best_sum = float("-inf")
    current = 0.0
    start = 0
    best_span = (0, 0)

    for i, s in enumerate(scores):
        current += s - WEIGHTS["length_penalty"]

        if current > best_sum:
            best_sum = current
            best_span = (start, i)

        if current < 0:
            current = 0
            start = i + 1

    return best_span, debug
