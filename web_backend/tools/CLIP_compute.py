import clip
import torch
from PIL import Image
import pandas as pd 
# from constant import *
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def compute_clip_feature(img_path):
    
    image = preprocess(Image.open(img_path)).unsqueeze(0).to(device)

    with torch.no_grad():
        img_feature = model.encode_image(image)
        img_feature /= img_feature.norm(dim=-1, keepdim=True)
    return img_feature.cpu().numpy()

def compute_image_clip_feature(img):
    image = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        img_feature = model.encode_image(image)
        # img_feature /= img_feature.norm(dim=-1, keepdim=True)
    return img_feature.cpu().numpy()
if __name__ == '__main__':
    # test 
    path = 'F:\\AIC2023\\keyframes\\L01\\L01_V001\\40.jpg'
    image = Image.open(path)
#     im = image.copy()
#     im.thumbnail((640, 360))
#     print(image)
#     print(im)
    fe1 = compute_image_clip_feature(image)
    clipa = np.load("F:\AIC2023\Cvecs\L01_V001.npy")
    print("dis: ", np.linalg.norm(fe1 - clipa[1]))
#     fe2 = compute_image_clip_feature(im)
#     print(np.linalg.norm(fe1 - fe2))
#     print(np.dot(fe1.reshape(-1), fe2.reshape(-1))/(np.linalg.norm(fe1)*np.linalg.norm(fe2)))
#     print(fe1)
#     print("--------------------------")
#     print(fe1 - fe2)

