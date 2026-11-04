# Inside Money "next level" in Three.js (user request 2026-11-04). One stage per session. Talk to the user in Arabic.
Honest limit: much better than now, still below MetaHuman/Zack faces. Build every upgrade as a SHARED module in render-kit/ (e.g. zack-kit.js) so every episode reuses it; test on EP10 (render-kit/make_ep10.py + ep10_*.js).
Token rules: memory token-saving-without-quality-loss (estimate words before voice, compute framing before stills, 3-4 stills per check, one fix batch per feedback).

## Stage 1 - faces, eyes, reactions -- DONE 2026-11-04 (render-kit/face-kit.js, test EP10: ep10_face.js, preview ep10-israel-aid-debt/hook-preview-5s-v3.mp4)
How to use in a new episode: `import {faceKit} from './face-kit.js'`; `const FK=faceKit(THREE); FK.rig(P,{iris:'#5c4330',brow:'#3a281a'})` once per character (before the first render);
every frame AFTER the body pose: `FK.update(P,t,{expr:[['shock',k]], clip:{data,t0,from,len}, look:V3|cam.position})` (blink 2-5 s + saccades are automatic). Presets: shock joy sad angry doubt smirk.
Stock reaction -> curves: `python3 face_capture.py clip.mp4 faces/<id>.json` (MediaPipe, ARKit names) then `await FK.loadClip('faces/<id>.json')`. Sources/licences: render-kit/faces/SOURCES.md.
Calibrate/inspect faces cheaply: `node facelab.mjs ep10.html <t> "M,eyes,.6,22,0,-.03" variants.json sheet.jpg` (one page load, many variants, contact sheet; variants use fb=[[who,bone,x,y,z]] or fx=[{who,expr,w}]).
Rig facts (MakeHuman default skeleton): three.js drops the dot in bone names (eye.L -> eyeL). Lids = orbicularis03 (upper, rot x - closes) / 04 (lower, rot x + rises). Eyes = eyeL/R, axes differ per eye -> world-space look-at.
Mouth bones have weak weights: risorius03 rotation/translation does nothing; jaw, oris01 (lower lip), oris03/oris07 (lip sides), oris04/06 rot z (widen) / rot x (pucker), levator05 (upper teeth), levator06 (sneer).
Brows have NO bones (head only) -> procedural morphs on the eyebrow mesh + forehead skin; mouth corners + cheeks are procedural morphs too (lip corners found from oris03/07 skin weights).
Brows looked blue = sky reflection on black brow texture: kit repaints them + matte. Brown iris repainted procedurally (fibres, limbal ring); eyes clearcoat.
Old intent:
- Eyes: high-res iris, glossy cornea (clearcoat), camera eye-light catchlights, auto BLINK (every 2-5 s, 0.12 s), eye look-at target + small saccades.
- Expression presets per cast member: shock, joy, sad, angry, doubt (brows, lids, mouth bones of the MakeHuman rig: orbicularis*, risorius*, jaw, oris*; check which bones move what with stills). Trigger them on script words.
- Reaction source (user has NO face video): take a FREE stock reaction clip (Pexels / Pixabay license, note the URL + licence in facts) and run MediaPipe Face Landmarker (52 blendshapes) on it; map blendshapes to the rig bones. If mapping fails, keep hand-made presets.
- Skin: softer wrap lighting / sheen, better normal maps. Close-up shot on every key beat (Zack style).
## Stage 2 - real money
- Official US note images ($100, $20, $1) from uscurrency.gov. Legal (18 USC 504, not legal advice): one-sided, size < 75% or > 150% of real -> use 150% scale. Use on straps, hands, pallets.
## Stage 3 - camera + montage kit
- Shot helpers: closeUp(face), overShoulder, macro(obj), whip(to), orbit(char); auto-fit framing (9:16: hfov = 2*atan(tan(vfov/2)*.5625); keep key text above the 74 % caption line).
- Boom shake, speed ramps, a new framing every 1.5-2 s, 3D glowing icons; DoF + whip motion blur + grade already exist in ep10_grade.js / ep10_anim.js.
## Stage 4 - fix old weak spots
- Shared face model across characters, toy-like props, grey boxes (see PROJECT_BRIEF sections 7-11).
