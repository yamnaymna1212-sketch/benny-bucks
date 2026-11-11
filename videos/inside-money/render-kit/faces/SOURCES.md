# Face capture sources (face-kit.js / face_capture.py)
Free stock reaction clips (Pexels licence: free to use, no attribution required, https://www.pexels.com/license/). Videos stay in dl/faces/clips (git-ignored); only the extracted blendshape curves are in git.
| curves | clip | used for |
|---|---|---|
| faces/6980085.json | https://www.pexels.com/video/a-man-with-a-surprised-face-6980085/ (hd 1080x1920) | SHOCK: face found from 4.4 s; brows up 4.64 s, jaw drop 4.84 s, smile after 5.3 s (not used). EP10 Mike "debt" reaction: from 4.42 s, 0.85 s |
| faces/4587767.json | https://www.pexels.com/video/a-man-with-a-shocked-expression-4587767/ (hd 1280x720) | "ooh" pucker + jaw 0.7 s, squint/blink 7 s (spare) |
Model: MediaPipe Face Landmarker float16 v1 (Apache-2.0), dl/faces/model/face_landmarker.task from storage.googleapis.com/mediapipe-models.
Re-extract: `python3 face_capture.py dl/faces/clips/<clip>.mp4 faces/<id>.json` (needs `pip3 install --user mediapipe`). The script prints the strongest blendshapes + their times to pick a window.
