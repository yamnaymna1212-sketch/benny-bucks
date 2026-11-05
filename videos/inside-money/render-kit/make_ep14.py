"""EP14 'What if Trump pressed the button and dropped a nuclear bomb on Iran? What happens to your wallet?' (FICTIONAL WHAT-IF).
Built from ep10.html (cast, money-kit, camera-kit, face-kit) like make_ep13.py; hook = ep14_hook.js (3D world map in a dark-navy Zack world).
EP13 user rules baked in: no handheld shake/drift, no DoF blur, no motion blur, no film grain, lighter bloom.
Re-run after editing: python3 make_ep14.py"""
src = open('ep10.html').read()
def sub(old, new):
    global src
    assert old in src, old[:80]
    src = src.replace(old, new, 1)
sub("timeline_ep10.json", "timeline_ep14.json")
sub("function animate(t){updPops(t);", "function animate10(t){updPops(t);")
sub("if(t<CAM_END){CAMF=CAMH(t);", "if(window.CAM14&&t<window.CAM14_END){CAMF=CAM14(t);CAMF.drift=0;P=CAMF.pos;L=CAMF.look;F=[CAMF.fov];}else if(t<CAM_END){CAMF=CAMH(t);")
sub("CK.boom(tBil,.5);CK.boom(tTril,1);", "")
# ---- EP13 rules: steady + crisp ----
sub("function shake(t){", "function shake(t){return;")
sub("comp.addPass(BOKEH);", "comp.addPass(BOKEH);BOKEH.enabled=false;")
sub("ZG.uniforms.blur.value.set(bx,by);", "ZG.uniforms.blur.value.set(0,0);")
sub("grain:{value:.03}", "grain:{value:0}")
sub("new UnrealBloomPass(new THREE.Vector2(W,H),.5,.25,2.4)", "new UnrealBloomPass(new THREE.Vector2(W,H),.35,.18,2.4)")
sub("\nawait loaded;\n", "\n" + open('ep14_hook.js').read() + "\nawait loaded;\n")
open('ep14.html', 'w').write(src)
print('ep14.html', len(src))
