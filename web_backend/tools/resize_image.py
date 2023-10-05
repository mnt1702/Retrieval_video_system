from PIL import Image
import os
from tqdm import tqdm
import glob

if __name__ == "__main__":
    for file_dir in tqdm(glob.glob("F:\\Frame\\*\\*\\*.jpg")):
        file_name = file_dir.split("\\")[-1]
        if len(file_name) == 10:
            image = Image.open(file_dir)
            image.thumbnail((640, 360))
            save_path = file_dir.replace("Frame", "Reframe") 
            if not os.path.exists(save_path[:-11]):
                os.makedirs(save_path[:-11])
            tokens = save_path.split('\\')
            tokens[-1] = str(int(tokens[-1][:-4])) + '.jpg'
            new_path = '/'.join(tokens)
            image.save(new_path)