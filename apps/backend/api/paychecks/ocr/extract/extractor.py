from ..text.ocr_correction_base import prepare
from .segment_debug import find_best_segment_debug
from .debug_view import render_debug


def extract_products(text: str, debug_mode: bool = False):
    raw_lines = text.splitlines()
    raw_lines = [line for line in raw_lines if line.strip()]
    text_prepared = prepare(text)
    norm_lines = text_prepared.splitlines()
    norm_lines = [line for line in norm_lines if line.strip()]

    span, debug = find_best_segment_debug(norm_lines)

    if debug_mode:
        render_debug(raw_lines, debug, span)

    return raw_lines[span[0]: span[1] + 1]
