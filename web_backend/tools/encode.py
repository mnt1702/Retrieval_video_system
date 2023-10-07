import pandas as pd
import clip
import torch
from PIL import Image
import numpy as np
from scipy.spatial.distance import cosine

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# image_clipfeatures = np.load("F:/AIC2023/clip_embeddings.npy")
# image_ids = pd.read_csv("F:/AIC2023/image_ids.csv", dtype={"video": "string", "frameid": "string", "url": "string"})
# info_ids = list(zip(image_ids["video"], image_ids["frameid"]))


def get_feature_vector(text_query):
    text = clip.tokenize([text_query]).to(device)  
    text_features = model.encode_text(text).cpu().detach().numpy().astype(np.float64)
    return text_features



# def get_frame_vector(video, frameid):
#     img_idx = info_ids.index((video, frameid))

#     frame_feature_vector = image_clipfeatures[img_idx].astype(np.float64)
#     frame_feature_vector = np.expand_dims(frame_feature_vector, axis=0)
#     return frame_feature_vector

# def compute_clip_feature(img_path):
#     image = preprocess(Image.open(img_path)).unsqueeze(0).to(device)

#     with torch.no_grad():
#         img_feature = model.encode_image(image)
#         img_feature /= img_feature.norm(dim=-1, keepdim=True)
#     return img_feature.cpu().numpy()



query = "The coffee house"
text = get_feature_vector(query)
text /= np.linalg.norm(text, axis=1).reshape((-1, 1))
print(np.linalg.norm(text))
# fe = get_frame_vector("L11_V022", "17000")
# sim = cosine(qe.flatten(), fe.flatten())
# print("q vs f: ", sim)
# clipe = compute_clip_feature("F:/AIC2023/keyframes/L11/L11_V022/17000.jpg")
# sim1 = cosine(qe.flatten(), clipe.flatten())
# sim2 = cosine(fe.flatten(), clipe.flatten())
# print("qe vs clipe: ", sim1)
# print("fe vs clipe: ", sim2)
