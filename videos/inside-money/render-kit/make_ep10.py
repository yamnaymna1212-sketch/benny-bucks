"""Build ep10.html from ep9.html (same Maple St world + rally stage). Re-run after editing ep10_*.js blocks below.
EP10 hook: crate with the Israel flag + $10,000 straps flying in ($3.8 BILLION A YEAR) -> whip-pan -> U.S. NATIONAL DEBT clock ($40 TRILLION) -> Mike reaction close-up.
Zack-style upgrades (user 2026-11-03): depth of field, camera motion blur on whips, handheld micro-shake, split-tone grade + grain,
wet eyes (clearcoat), skin sheen, soft hair (alpha-to-coverage), camera eye-light."""
import re
src = open('ep9.html').read()

def sub(old, new, count=1):
    global src
    assert src.count(old) >= 1, old[:80]
    src = src.replace(old, new, count)

sub("// EP9 \"Trump promised one cent gas.\"", "// EP10 \"Why does America send Israel $3.8 billion a year, with $40 trillion in debt?\" (Mike). Built by make_ep10.py from ep9.html.\n// EP9 \"Trump promised one cent gas.\"")
sub("import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';",
    "import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';\nimport {BokehPass} from 'three/addons/postprocessing/BokehPass.js';\nimport {faceKit} from './face-kit.js';")
sub("timeline_ep9.json", "timeline_ep10.json")
sub("const tProm=Wd('promised'),tCent=Wd('cent'),tPrice=Wd('$423');",
    "const tProm=99,tCent=99,tPrice=99;   // EP9 Trump beats unused\nconst tSend=Wd('send'),tIsr=Wd('israel'),tBil=Wd('billion'),tYear=Wd('year'),tWith=Wd('with'),tTril=Wd('trillion'),tDebt=Wd('debt'),tMeet=Wd('meet');")

# ---- camera keys: hook + story (ep10_keys.js) ----
i = src.index("const KEYS=[")
j = src.index("\n];\n", i) + 4
src = src[:i] + open('ep10_keys.js').read() + src[j:]

# ---- materials: wet eyes, skin sheen, soft hair ----
sub("mt.color.set(c);}});SRC[key]=g;}", "mt.color.set(c);o.material=zmat(o,o.material);}});SRC[key]=g;}")
sub("// ================= CAST =================", open('ep10_props.js').read() + "\n// ================= CAST =================")

# ---- post: DoF + bloom + grade with motion blur, split tone, grain ----
sub("comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4));comp.addPass(new OutputPass());",
    "const BOKEH=new BokehPass(scene,cam,{focus:3,aperture:.0018,maxblur:.005});comp.addPass(BOKEH);\ncomp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4));comp.addPass(new OutputPass());")
a = src.index("comp.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null},con:")
b = src.index("c.a);}'}));", a) + len("c.a);}'}));")
src = src[:a] + open('ep10_grade.js').read() + src[b:]

# ---- animate: EP10 hook replaces the EP9 one ----
sub("function animate(t){updPops(t);updC(t);", "function animate9(t){updPops(t);updC(t);")
sub("await loaded;\n", open('ep10_story.js').read() + "\n" + open('ep10_anim.js').read() + "\n" + open('ep10_face.js').read() + "\nawait loaded;\n")
sub("const renderAt0=t=>{setCam(t);", "const renderAt0=t=>{zfxPrev(t);setCam(t);zfxNow(t);")
sub("const PUX=GX-1.2,PUZ=19.5;", "const PUX=GX-1.2+500,PUZ=19.5;   // EP9 gas pump moved off the stage")
# debug: window.FB = [[who,bone,x,y,z],...] applied after animate (facelab.mjs bone exploration)
sub("animate(t);\n let c=CH[0];", "animate(t);if(window.FB)for(const [w,n,x,y,z] of window.FB)pose(w==='T'?TR:MIKE,n,x,y,z);if(window.FX)for(const f of window.FX)FK.update(f.who==='T'?TR:MIKE,t,f);\n let c=CH[0];")
sub("window.renderAt(Number(Q.get('t')||0));document.title='ready';", "Object.assign(window,{Q,MIKE,TR,THREE,cam,FK});window.renderAt(Number(Q.get('t')||0));document.title='ready';")
open('ep10.html', 'w').write(src)
print('ep10.html', len(src))
