---
name: inside-3d-quality
description: Quality rules and checklist for Inside Money 3D scenes (Three.js render-kit): characters, camera, realism, glow prices, captions, audio. Use when building or improving any Inside Money scene.
---
# Inside Money 3D quality bar (updated 2026-10-31 after EP4 — user rules in videos/inside-money/PROJECT_BRIEF.md section 0 win)
Template: `videos/inside-money/render-kit/ep4.html` (+ `ep4-print-million/PLAN.md`). Copy it for every new episode; do not start from ep1/ep2.

## Building blocks already in ep4.html (reuse, don't rewrite)
- `person(name,x,z,ry,scale)` = SkeletonUtils clone of a MakeHuman cast GLB (`dl/models/cast/*.glb`, build with `characters/make_cast.py`). `pose(P,bone,x,y,z)`, `relaxArms`, `curl(P,'R',v)` (finger axis x), `walkLegs(P,phase,amp)`, presets `PS` (hold, shrug, shock, clip). Arm down from A-pose = upperarm `[0.12,0,±0.72]`; 1.15 goes behind the back.
- Money: `billT` (realistic, not a reproduction), `fan(n,glow)` held at bone `finger3-1R`, `brickM/brickG` bundles, `cashTower()` instanced pallets of bundles.
- Glow text: `big(str,size,colour)` / `glowMat` (MeshBasic toneMapped:false front + dark side), `pop(t,t0)` overshoot pop-in, `arrowUp(colour)`.
- Real props: `makeFlag(x,topY,z,width,dir)` + `waveFlags(t)`, US map from `dl/geo/us-states.json` (Census, public domain), government building, podium, money printer, bank lobby, street (burger kiosk, house FOR RENT, gas pump).
- Sets live at different x: lobby 0, plaza 20, stage (outdoor square) -30, street 50. `setCam` moves the sun to the active set.
- Camera = `SHOTS` table `[t0,t1, pos0,look0,fov0, pos1,look1,fov1, aperture]` (hard cut between rows, eased move inside). DoF focus = distance to look point.
- Timeline: `timeline_ep4.json` (words + 2-3 word chunks), `Wd(word)` / `Wn(word,n)` to sync events to spoken words.

## Checklist before any render
1. Hook first frame readable with no sound; main character visible; titles centred and uncropped.
2. Every line has a new shot/angle/action; nothing static for > 3 s.
3. No black background, no primitive stand-ins; real objects only.
4. Glow only on money/prices; image not hazy; red/yellow stay saturated (glow intensity ~1.1).
5. Characters move and react; each looks different; no clipping props (hold boards in front of the chest).
6. Captions 2-3 words, centred. SFX: ting at 0 s, whoosh on every cut, boom on the shock number, ting on key numbers, cash-register on prices (mix script = ep4-print-million/mix_ep4.py).
7. GPU line says Apple M3. Stills for each beat, then 5-s preview, then one full render.

## Known gotchas (fixed in ep4.html, keep the fixes)
- MakeHuman clothes with a grey BUMP map in the normal slot -> NaN black blocks: loader drops `*bump*` normal maps.
- Eyes must be built with MAKESKIN (procedural eyes export as glowing white).
- JSON query params must use `0.2`, not `.2`.
- The stage must not overlap the lobby walls (lobby spans x -5..5).
