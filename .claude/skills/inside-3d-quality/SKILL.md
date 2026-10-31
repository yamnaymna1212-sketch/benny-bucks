---
name: inside-3d-quality
description: Quality rules and checklist for Inside Money 3D scenes (Three.js render-kit): character animation, camera, realism, particles, captions, audio. Use when building or improving any Inside Money scene.
---
# Inside Money 3D quality bar (target: "You Built It" pool video + Zack-style 3D)
- **Camera**: ONE continuous move, no cuts; critically-damped follow (see ep1.html track); slow open, a dive/pull-out about every 6-9 s, never static.
- **Character**: real skeleton (guy.glb, MakeHuman CC0). Animate with keyframed bone curves, not static poses: swing cycle for pickaxe/shovel (spine bend, both arms on tool, weight shift, head follows tool), idle breathing, look-at. Something moves every 2-3 s. Tool props parented to hand bones; headlamp spotlight.
- **Realism**: PBR textures only (Poly Haven CC0 in render-kit/dl/tex: rock_face_03, rocky_terrain_02, gravel_floor, excavated_soil_wall...), distinct strata colours per depth, soft shadows, bloom on gold/water, vignette + film grain, warm light on the character against cool rock.
- **Particles**: dust puffs + falling rock chips on every swing, drifting dust motes; water spray at the reveal.
- **Depth counter** on screen (small, top-left, safe zone) ticking with the camera.
- **Captions**: 1 word, Montserrat ExtraBold ~64 px, one colour (RED for prices/danger), kept left of TikTok right buttons (centre x~310 of 720).
- **Audio**: voice + air bed + whoosh per camera move + riser before the reveal + boom/sub on the reveal + ting on the key number; user SFX from studio/public/sfx (rebuild with tools/import_user_sfx.py). Never silent.
- **GPU**: render.mjs uses --use-angle=metal --enable-gpu; the log's `GPU:` line must say Apple M3, never SwiftShader.
- **Before sending**: check one still of frame 1 (contrast readable without words), then the 5-s preview. Record what improved in this file.
- **Learned on EP3 (2026-10-31)**: user rejected a first half that stayed in one place. Every script line needs its own on-screen event AND a camera move matched to the word (one continuous camera, no cuts): close for objects/numbers (drawer, screen, form), far/high for "building"/"government", low angle for emotion. Plan a beat table (line -> event -> camera) BEFORE coding.
- 9:16 with fov 32 is very narrow (horizontal ~18 deg): a 1.5 m subject needs ~4.5 m distance. Animate fov per shot (FOVK) — wide (46-56) for outdoor/overview shots.
- Flat planes (forms, signs) go invisible edge-on in chase shots: rotate them to face the camera. Check every planned shot with `node stills.mjs` contact sheets before any render.

