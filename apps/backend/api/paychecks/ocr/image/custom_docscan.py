import cv2
import imutils
import numpy as np
from imutils import perspective
from PIL.Image import Image

APPROX_POLY_DP_ACCURACY_RATIO = 0.02
IMG_RESIZE_H = 500.0


def get_minimum_area_quadrilateral(contour):
    hull = cv2.convexHull(contour)
    hull_points = hull.reshape(-1, 2)

    if len(hull_points) <= 4:
        return hull_points

    n = len(hull_points)

    if n <= 8:
        min_area = float('inf')

        from itertools import combinations

        for quad_points in combinations(range(n), 4):
            points = [hull_points[i] for i in quad_points]

            quad = np.array(points, dtype=np.float32)
            area = cv2.contourArea(quad)

            if area < min_area:
                min_area = area

    rect = cv2.minAreaRect(hull)
    box = cv2.boxPoints(rect)
    return perspective.order_points(box)


def find_largest_polygon_and_bounding_quad(cnts):
    for c in cnts:
        perimeter = cv2.arcLength(c, True)
        scaled_perimeter = APPROX_POLY_DP_ACCURACY_RATIO * perimeter
        polygon = cv2.approxPolyDP(c, scaled_perimeter, True)

        if len(polygon) < 3:
            continue

        if len(polygon) == 4:
            return polygon.reshape(4, 2), True

        bounding_quad = get_minimum_area_quadrilateral(polygon)
        return bounding_quad, False

    return None, False


def docscan(input_image: str | np.ndarray | Image):
    if isinstance(input_image, str):
        img = cv2.imread(input_image, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise FileNotFoundError(f"Image not found: {input_image}")
    elif isinstance(input_image, Image):
        img = cv2.cvtColor(np.asarray(input_image), cv2.COLOR_RGB2BGR)
    elif isinstance(input_image, np.ndarray):
        img = input_image.copy()
    else:
        wrong_type = input_image.__class__.__name__
        error = f"Image must be str or numpy ndarray, not {wrong_type}"
        raise TypeError(error)

    orig = img.copy()
    ratio = img.shape[0] / IMG_RESIZE_H

    img = imutils.resize(img, height=int(IMG_RESIZE_H))

    if img.shape[2] == 4:
        mask = img[:, :, 3]
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        threshold = cv2.THRESH_BINARY + cv2.THRESH_OTSU
        _, mask = cv2.threshold(gray, 0, 255, threshold)

    mask = cv2.medianBlur(mask, 15)

    cnts = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

    outline = None

    if cnts:
        outline, is_quadrilateral = find_largest_polygon_and_bounding_quad(cnts)

    if outline is not None and len(outline) == 4:
        outline = outline * ratio
        outline = perspective.order_points(outline)
        result = perspective.four_point_transform(orig, outline)
    else:
        result = orig

    return result


def get_minimum_bounding_quadrilateral_advanced(contour, max_iterations=100):
    hull = cv2.convexHull(contour)

    if len(hull) <= 4:
        return hull.reshape(-1, 2)

    rect = cv2.minAreaRect(hull)
    box = cv2.boxPoints(rect)

    return perspective.order_points(box)
