import numpy as np
from glob import glob
import fiftyone as fo
import pandas as pd


if __name__ == '__main__':
    F:\AIC2023\dataset = fo.Dataset.from_images_dir('D:\WorkSpace\Contest\HCM_AIC2023\F:\AIC2023\dataset\keyframes', name=None, tags=None, recursive=True)

    all_keyframe = glob(f"{source}\\keyframes\\*\\*.jpg")
    video_keyframe_dict = {}
    all_video = glob('F:\AIC2023\dataset\\keyframes\\*')
    all_video = [v.rsplit('\\',1)[-1] for v in all_video]

    for kf in all_keyframe:
        _, vid, kf = kf[:-4].rsplit('\\',2)
        if vid not in video_keyframe_dict.keys():
            video_keyframe_dict[vid] = [kf]
        else:
            video_keyframe_dict[vid].append(kf)
    
    for k,v in video_keyframe_dict.items():
        video_keyframe_dict[k] = sorted(v)
        
    embedding_dict = {}
    for v in all_video:
        clip_path = f'F:\AIC2023\dataset\\clip-features-vit-b32\\{v}.npy'
        a = np.load(clip_path)
        embedding_dict[v] = {}
        for i,k in enumerate(video_keyframe_dict[v]):
            embedding_dict[v][k] = a[i]
    clip_embeddings = []
    for sample in F:\AIC2023\dataset:
        clip_embedding = embedding_dict[sample['video']][sample['frameid']]
        clip_embeddings.append(clip_embedding)
    print(np.shape(clip_embeddings))
    np.save("clip_embeddings.npy", clip_embeddings)
    lst = []
    for sample in F:\AIC2023\dataset:
        lst.append([sample["filepath"], sample["video"], sample["frameid"]])

    df = pd.DataFrame(lst, columns = ["filepath", "video", "frameid"])
    df.to_csv("image_ids.csv")