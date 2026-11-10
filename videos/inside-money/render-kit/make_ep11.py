"""Build ep11.html from ep9.html (Maple St world) + the zack kit of EP10 (DoF, motion blur, grade, wet eyes).
EP11 hook: backyard hole with $50,000 in real $20 straps (YOURS) -> whip to the BANK, the stack flies in, doors slam (THEIRS) -> Mike's shock.
Edit ep11_keys.js / ep11_hook.js / ep11_anim.js (+ ep10_grade.js, zmat block of ep10_props.js), then re-run from render-kit."""
src = open('ep9.html').read()
def sub(old, new, count=1):
    global src
    assert src.count(old) >= 1, old[:80]
    src = src.replace(old, new, count)
sub("// EP9 \"Trump promised one cent gas.\"", "// EP11 \"Bury $50,000 in your backyard, and it's yours. Put it in a bank, and legally, it's theirs.\" (Mike). Built by make_ep11.py from ep9.html.\n// EP9 \"Trump promised one cent gas.\"")
sub("import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';",
    "import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';\nimport {BokehPass} from 'three/addons/postprocessing/BokehPass.js';")
sub("timeline_ep9.json", "timeline_ep11.json")
sub("const tProm=Wd('promised'),tCent=Wd('cent'),tPrice=Wd('$423');", "const tProm=99,tCent=99,tPrice=99;   // EP9 Trump beats unused")
i = src.index("const KEYS=["); j = src.index("\n];\n", i) + 4
src = src[:i] + open('ep11_keys.js').read() + src[j:]
# hole in the lawn for the backyard pit (ground = 4 slabs around it)
sub("add(B(600,.2,600),pbr('leafy_grass',200,200,0x86b84f),0,-.1,-100,scene,false);",
    "ringBox(0,-.1,-100,600,.2,600,{x:-8.6,z:(-15.05-8.5+(-14.3))/2,w:5.2,d:8.5+.75},(w,d)=>pbr('leafy_grass',Math.max(.33,w/3),Math.max(.17,d/3),0x86b84f));   // EP11: the backyard hole")
sub("mt.color.set(c);}});SRC[key]=g;}", "mt.color.set(c);o.material=zmat(o,o.material);}});SRC[key]=g;}")
zp = open('ep10_props.js').read(); zp = zp[zp.index("// ---- zack-style materials"):]
sub("// ================= CAST =================", zp + "\n// ================= CAST =================")
sub("comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4));comp.addPass(new OutputPass());",
    "const BOKEH=new BokehPass(scene,cam,{focus:3,aperture:.0018,maxblur:.005});comp.addPass(BOKEH);\ncomp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4));comp.addPass(new OutputPass());")
a = src.index("comp.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null},con:")
b = src.index("c.a);}'}));", a) + len("c.a);}'}));")
src = src[:a] + open('ep10_grade.js').read() + src[b:]
sub("function animate(t){updPops(t);updC(t);", "function animate9(t){updPops(t);updC(t);")
sub("await loaded;\n", open('ep11_hook.js').read() + "\n" + open('ep11_story.js').read() + "\n" + open('ep11_anim.js').read() + "\nawait loaded;\n")
sub("const renderAt0=t=>{setCam(t);", "const renderAt0=t=>{zfxPrev(t);setCam(t);zfxNow(t);")
sub("const PUX=GX-1.2,PUZ=19.5;", "const PUX=GX-1.2+500,PUZ=19.5;   // EP9 gas pump off")
open('ep11.html', 'w').write(src)
print('ep11.html', len(src))
