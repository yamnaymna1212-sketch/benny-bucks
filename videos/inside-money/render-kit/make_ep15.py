"""EP15 'What happens to gas prices if El-Sayed is president today?' (HYPOTHETICAL, open ending).
Built from ep10.html (cast, money-kit, camera-kit, face-kit) like make_ep13/14.py; hook = ep15_hook.js (CageNova-style flat election map).
EP13 user rules baked in: no handheld shake/drift, no DoF blur, no motion blur, no film grain, lighter bloom.
Re-run after editing: python3 make_ep15.py"""
src = open('ep10.html').read()
def sub(old, new):
    global src
    assert old in src, old[:80]
    src = src.replace(old, new, 1)
sub("timeline_ep10.json", "timeline_ep15.json")
sub("manager:['manager']};", "manager:['manager'],elsayed:['elsayed']};")
sub("const GLB={};for(const [key,[file,rec]]", open('ep13_style.js').read() + "\nconst GLB={};for(const [key,[file,rec]]")
sub("styleTrump(o,mt);}", "styleTrump(o,mt);}if(key==='elsayed')styleEls(o,mt);")
sub("function animate(t){updPops(t);", "function animate10(t){updPops(t);")
sub("if(t<CAM_END){CAMF=CAMH(t);", "if(window.CAM14&&t<window.CAM14_END){CAMF=CAM14(t);CAMF.drift=0;P=CAMF.pos;L=CAMF.look;F=[CAMF.fov];}else if(t<CAM_END){CAMF=CAMH(t);")
sub("CK.boom(tBil,.5);CK.boom(tTril,1);", "")
sub("function shake(t){", "function shake(t){return;")
sub("comp.addPass(BOKEH);", "comp.addPass(BOKEH);BOKEH.enabled=false;")
sub("ZG.uniforms.blur.value.set(bx,by);", "ZG.uniforms.blur.value.set(0,0);")
sub("grain:{value:.03}", "grain:{value:0}")
sub("new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4)", "new UnrealBloomPass(new THREE.Vector2(W,H),.35,.18,2.4)")
sub("// ================= EP10 STORY (after the hook)", "const PRE15=new Set(scene.children);\n// ================= EP10 STORY (after the hook)")
sub("// ================= EP10 HOOK ANIMATION", "const STORY10_OBJS=scene.children.filter(o=>!PRE15.has(o));\n// ================= EP10 HOOK ANIMATION")
sub("\nawait loaded;\n", "\n{\n" + open('ep15_hook.js').read() + "\nwindow.ANIM15=animate;}\nfunction animate(t){window.ANIM15(t);}\nawait loaded;\n")
open('ep15.html', 'w').write(src)
print('ep15.html', len(src))
