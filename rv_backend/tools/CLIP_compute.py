import clip
import torch
from PIL import Image
import pandas as pd 

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def compute_clip_feature(img_path):
    
    image = preprocess(Image.open(img_path)).unsqueeze(0).to(device)

    with torch.no_grad():
        img_feature = model.encode_image(image)
        img_feature /= img_feature.norm(dim=-1, keepdim=True)
    return img_feature.cpu().numpy()

if __name__ == '__main__':
    # test 
    path = r'D:\WorkSpace\Contest\HCM_AIC2023\F:\AIC2023\dataset\keyframes\L01_V001\0001.jpg'

    fe = compute_clip_feature(path)
    print(fe)

