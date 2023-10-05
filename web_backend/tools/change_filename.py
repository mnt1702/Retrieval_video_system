import shutil
import os
import glob
from tqdm import tqdm

os.chdir('F:/Reframe/')

for path in tqdm(glob.glob("L20/*/*.jpg")):
  tokens = path.split('\\')
  tokens[-1] = str(int(tokens[-1][:-4])) + '.jpg'
  new_path = '/'.join(tokens)
  shutil.move(path, new_path)