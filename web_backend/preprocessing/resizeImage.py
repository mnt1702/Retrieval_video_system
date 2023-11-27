from PIL import Image
import os
from tqdm import tqdm
import glob
import sys
sys.path.append("web_backend")

from constant import *

if __name__ == "__main__":
    for file_dir in tqdm(glob.glob(f"{source}\\newFrames\\*\\*\\*.jpg")):
        
        #Resize image
        file_name = file_dir.split("\\")[-1]
        image = Image.open(file_dir)
        image.thumbnail((640, 360))
        
        #Save image
        save_path = file_dir.replace("newFrames", "keyframes")
        if not os.path.exists(save_path.replace(file_name, "")):
            os.makedirs(save_path.replace(file_name, ""))
        
        new_filename = str(int(file_name.split(".")[0])) + ".jpg"
        save_path = save_path.replace(file_name, new_filename)
    
        image.save(save_path)