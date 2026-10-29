# Render on your own PC (uses your GPU)

1. Install Node.js 20 or newer (nodejs.org) once.
2. Get this folder: `git clone https://github.com/yamnaymna1212-sketch/benny-bucks -b claude/gracious-ptolemy-5pp2el` then open `videos/inside-money/render-kit`.
3. In a terminal in this folder, once: `npm install` then `npm run setup` (downloads Chromium + the free 3D assets, about 120 MB).
4. Episode 1 (1 minute): `npm run render -- ep1` -> ep1-where-money.mp4 (preview: `npm run render -- ep1 5`).
5. Old 16 s test: `npm run render` (full video -> bank-v2.mp4) or `npm run render -- 5` (5 s preview).
   If the "GPU:" line says SwiftShader/llvmpipe, run `npm run render -- --show` (opens a window, which forces the real GPU).

Credits for the TikTok description: car model "Car Concept" by Eric Chadwick / Darmstadt Graphics Group (CC BY 4.0); city HDRI and textures by Poly Haven (CC0).
