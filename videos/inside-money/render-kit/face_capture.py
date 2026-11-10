"""Face capture: run MediaPipe Face Landmarker on a (free stock) reaction clip -> per-frame ARKit-style blendshapes JSON.
Usage: python3 face_capture.py <clip.mp4> <out.json> [fps=25]
The JSON {fps, names, frames:[[52 floats]...]} is read by face-kit.js (FK.clip) and drives the MakeHuman face bones + brow morphs.
Model: dl/faces/model/face_landmarker.task (Google MediaPipe, Apache-2.0)."""
import sys, json, cv2, mediapipe as mp, os
clip, out = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
BaseOptions = mp.tasks.BaseOptions; FL = mp.tasks.vision.FaceLandmarker; Opt = mp.tasks.vision.FaceLandmarkerOptions
opt = Opt(base_options=BaseOptions(model_asset_path=os.path.join(here, 'dl/faces/model/face_landmarker.task')),
          running_mode=mp.tasks.vision.RunningMode.VIDEO, output_face_blendshapes=True, num_faces=1)
cap = cv2.VideoCapture(clip); fps = cap.get(cv2.CAP_PROP_FPS) or 25
frames, names, i, miss = [], None, 0, 0
with FL.create_from_options(opt) as lm:
    while True:
        ok, im = cap.read()
        if not ok: break
        h, w = im.shape[:2]; s = 640 / max(h, w)
        im = cv2.resize(im, (int(w * s), int(h * s)))
        r = lm.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(im, cv2.COLOR_BGR2RGB)), int(i * 1000 / fps))
        if r.face_blendshapes:
            bs = r.face_blendshapes[0]; names = names or [b.category_name for b in bs]
            frames.append([round(b.score, 3) for b in bs])
        else:
            miss += 1; frames.append(frames[-1] if frames else None)
        i += 1
frames = [f if f is not None else [0] * 52 for f in frames]
json.dump({'src': os.path.basename(clip), 'fps': fps, 'names': names, 'frames': frames}, open(out, 'w'), separators=(',', ':'))
print(out, len(frames), 'frames', miss, 'missed')
# peaks per blendshape (to choose the reaction window)
import numpy as np
A = np.array(frames)
for k in np.argsort(-A.max(0))[:14]: print(f'  {names[k]:20s} max {A[:,k].max():.2f} at {A[:,k].argmax()/fps:.2f}s')
