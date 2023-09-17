import matplotlib.pyplot as plt
from PIL import Image

from paddleocr import PaddleOCR,draw_ocr
import cv2

Paddle = PaddleOCR(use_angle_cls=True, lang= "vi", use_gpu= False)
image_path = r"D:\WorkSpace\Contest\HCM_AIC2023\F:\AIC2023\dataset\keyframes\L10_V028\0009.jpg"
res = Paddle.ocr(image_path, det = False, cls = True, rec = True)
print(res)