from PIL import Image
import os
from tqdm import tqdm
import glob

if __name__ == "__main__":
    for file_dir in tqdm(glob.glob("G:\\*\\*\\*.jpg")):
        image = Image.open(file_dir)
        image.thumbnail((640, 360))
        save_path = file_dir.replace("G:\\", "F:\\Reframe\\") 
        if not os.path.exists(save_path[:-11]):
            os.makedirs(save_path[:-11])
        image.save(save_path)