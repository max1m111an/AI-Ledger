import io
import numpy as np
from PIL import Image
from paddleocr import PaddleOCR

from ..image.custom_docscan import docscan

ocr = PaddleOCR(use_textline_orientation=True, lang='ru')


def preprocess_image_for_ocr(image):
    max_size = (2000, 2000)
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    return docscan(image)


def ocr_pdf_paddle(image):
    preprocessed = preprocess_image_for_ocr(image)
    return ocr.predict(preprocessed)


def bounding_box_height(points):
    return max(points[1][1], points[2][1]) - min(points[0][1], points[3][1])


def group_lines_from_rec(rec_texts, rec_polys, scale=0.2):
    if not rec_texts or not rec_polys:
        return []

    heights = [bounding_box_height(poly) for poly in rec_polys]
    median_height = np.median(heights)
    y_threshold = median_height * scale

    items = list(zip(rec_texts, rec_polys))

    items.sort(key=lambda x: x[1][0][1])

    lines = []
    current_line = []
    last_y = None

    for text, poly in items:
        y = poly[0][1]
        if last_y is None or abs(y - last_y) <= y_threshold:
            current_line.append((poly, text))
        else:
            current_line = sorted(current_line, key=lambda x: x[0][0][0])
            lines.append(" ".join(t for _, t in current_line))
            current_line = [(poly, text)]
        last_y = y

    if current_line:
        current_line = sorted(current_line, key=lambda x: x[0][0][0])
        lines.append(" ".join(t for _, t in current_line))

    return lines


def perform_ocr(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    result = ocr_pdf_paddle(image)

    if isinstance(result, list) and len(result) > 0:
        page_res = result[0]
        rec_texts = page_res.get("rec_texts", [])
        rec_polys = page_res.get("rec_polys", [])
        lines = group_lines_from_rec(rec_texts, rec_polys)
        return '\n'.join(lines)
    return ''
