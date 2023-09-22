import os
import pandas as pd
import shutil

path = './dataset/map-keyframes'

files = os.listdir(path)

if os.path.exists('submission'):
  shutil.rmtree('submission')
os.mkdir('submission')

def map_submission(query_name):
  df = pd.read_csv(f'submission_raw/{query_name}/submission_raw.csv', header=None)
  for i in range(len(df)):
    r = df.loc[i]
    name = r[0]
    frame = r[1]
    df.loc[i, 1] = int(keyframes[name].loc[frame-1]['frame_idx'])


  _, t = query_name.split('-')
  df.to_csv(f'submission/query-p1-{t}.csv', index=False, header=None)


keyframes = dict()
for file in files:
  keyframes[file[:-4]] = pd.read_csv(path + '/' + file)


queries = os.listdir('submission_raw')
for query in queries:
  map_submission(query)
