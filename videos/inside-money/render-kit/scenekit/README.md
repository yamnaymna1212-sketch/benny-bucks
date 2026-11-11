# scenekit — reusable Inside Money scenes (started with EP18, 2026-11-10)
Every module takes `K` from `core.js` (one import = helpers + cast + 3D text + shot camera). Template page: `ep18full.html`.
```js
const {core}=await import('./scenekit/core.js');const K=await core(THREE,scene,{TL});
```
| module | what | key API |
|---|---|---|
| core.js | pbr/M/add/B/RB/CY/tex, `txt3` (GREEN money, RED problem, YELLOW fact), cast loader `person(name,recolour,x,y,z,ry)`, poses (walk, point, phone, shrug, headHold, crossArms, sit, lieArms, handsFront, armsUp), `shotCam(cam,t,SHOTS)` | shots = `[{t0,set,o:[x,y,z],keys:[[t,[pos],[look],fov]]}]` |
| excavator.js | tracked excavator, any colour/scale | `pose(boom,arm,bucket,swing)`, `dig(t)` |
| money-pit.js | pit filling with REAL $1 straps (instanced top layer + loose straps + bills, never one flat slab) | `update(t,{t0,t1})`, `glow(k,t)`, `take(n)` |
| vault-lid.js | bolted steel lid, vault wheel, keypad with live screen | `screen('WRONG','#ff3030')`, `wheel`, `keypadPos` |
| irs-room.js | SIMPLE IRS room: one big screen (live feed), seal + IRS letters, 2 beacons, one desk | `mode('feed'/'off'/'split')`, `reticle(k)`, `beacons(t,on)` |
| interrogation.js | closed gray room, metal table, chairs, hanging lamp, one-way mirror, prison bars | `bars(k)`, `lampSwing(t)` |
| vehicles.js | `vehicle(K,'suv'|'police'|'pickup')` | `update(t,on)` flashes police bar, spins wheels |
| props.js | Form 1040 (circle/cover income line), red flag, green check, red X, evidence bag, home safe | |
Sets live far apart in one scene (yard at 0, IRS room x 300, interrogation x -300); the camera changes set only during a whip (tilt up to sky/ceiling and back down), never a hard cut.
Rules: money meshes never scaled below 1 (money-kit 151 %, one-sided); cast GLBs in dl/models/cast (copy from another worktree if missing: the guy.glb fallback looks bad).
