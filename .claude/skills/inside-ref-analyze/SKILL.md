---
name: inside-ref-analyze
description: Analyse a reference video (Zack, "You Built It", others) once with ffmpeg and save the findings in git so later sessions never need the video. Use when the user adds a file to references/inside-money/.
---
# Reference analysis
Files live in references/inside-money/examples|zack (local; small ones may be committed with `git add -f`).
1. `ffprobe` duration/fps/res; scene-cut detection (`select='gt(scene,0.08)'`); one frame every 3 s -> contact sheet `references/inside-money/analysis/<name>-sheet.jpg` (ffmpeg tile).
2. Look at the sheet: camera move types, character poses, textures, lighting, caption style, props, pacing, hook frame 1.
3. Optical-flow speed per 3 s only if useful (opencv-python-headless).
4. Append to videos/inside-money/REFERENCE_ANALYSIS.md under the video's name: measured facts + "Copy for Inside Money" bullets. Commit sheet + notes (not the mp4).
