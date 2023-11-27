import clip
import torch
from PIL import Image
import pandas as pd 
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def computeImageFeature(img):
    image = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        img_feature = model.encode_image(image)
        img_feature /= img_feature.norm(dim=-1, keepdim=True)
    return img_feature.cpu().numpy()

if __name__ == '__main__':
    # test 
    path = 'F:\\AIC2023\\keyframes\\L01\\L01_V001\\40.jpg'
    image = Image.open(path)
    fe1 = computeImageFeature(image)
    clipa = np.load("F:\AIC2023\Cvecs\L01_V001.npy")
    print("dis: ", np.linalg.norm(fe1 - clipa[1]))

