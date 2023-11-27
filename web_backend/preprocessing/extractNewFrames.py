import cv2
import os
from natsort import natsorted
from scenedetect import VideoManager
from scenedetect import SceneManager
from scenedetect.detectors import ContentDetector
import sys
sys.path.append("web_backend")

from constant import *

video_dir = f'{source}/video'
output_dir = f'{source}/newFrames'

video_start = 21
video_end = 30

# Function to find scene cuts.
def find_scenes(video_path):
    video_manager = VideoManager([video_path])
    scene_manager = SceneManager()
    scene_manager.add_detector(ContentDetector())
    video_manager.start()
    scene_manager.detect_scenes(frame_source=video_manager)
    scene_list = scene_manager.get_scene_list()
    video_manager.release()
    return scene_list

for root, _, files in os.walk(video_dir):
    sorted_files = natsorted(files)
    for file in sorted_files:
        if file.endswith('.mp4'):
            video_path = os.path.join(root, file)
            video_name = os.path.splitext(file)[0]
            video_number = int(video_name.split('_')[0][1:])
            if video_start <= video_number <= video_end:
                # Find the scene cuts for the video.
                scene_list = find_scenes(video_path)
                scene_frames = [scene[0].frame_num for scene in scene_list]

                cap = cv2.VideoCapture(video_path)
                if not cap.isOpened():
                    print(f"Cannot open video {video_path}")
                    continue
                
                video_output_dir = os.path.join(output_dir, video_name)
                os.makedirs(video_output_dir, exist_ok=True)
                
                frame_index = 0
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    if frame_index in scene_frames:
                        # Save the frame if it's a scene cut.
                        frame_name = f'{frame_index:06d}.jpg'
                        frame_path = os.path.join(video_output_dir, frame_name)
                        cv2.imwrite(frame_path, frame)
                    frame_index += 1
                cap.release()
                print(f'Scene frames saved in {video_output_dir}')
