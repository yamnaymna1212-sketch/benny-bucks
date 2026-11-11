"""EP13 'If Abdul El-Sayed becomes President tomorrow' (HYPOTHETICAL) - built from ep10.html (Maple St + U.S. GOVERNMENT stage + zack kit).
New cast 'elsayed' (characters/cast.json, styled in ep13_style.js). Hook in ep13_hook.js. Re-run after editing: python3 make_ep13.py"""
src = open('ep10.html').read()
def sub(old, new):
    global src
    assert old in src, old[:80]
    src = src.replace(old, new, 1)
sub("timeline_ep10.json", "timeline_ep13.json")
sub("manager:['manager']};", "manager:['manager'],elsayed:['elsayed']};")
sub("const GLB={};for(const [key,[file,rec]]", open('ep13_style.js').read() + "\nconst GLB={};for(const [key,[file,rec]]")
sub("styleTrump(o,mt);}", "styleTrump(o,mt);}if(key==='elsayed')styleEls(o,mt);")
sub("function animate(t){updPops(t);", "function animate10(t){updPops(t);")
sub("if(t<CAM_END){CAMF=CAMH(t);", "if(window.CAM13&&t<window.CAM13_END){CAMF=CAM13(t);P=CAMF.pos;L=CAMF.look;F=[CAMF.fov];}else if(t<CAM_END){CAMF=CAMH(t);")
sub("CK.boom(tBil,.5);CK.boom(tTril,1);", "")
sub("// ================= EP10 STORY (after the hook)", "const PRE13=new Set(scene.children);\n// ================= EP10 STORY (after the hook)")
sub("// ================= EP10 HOOK ANIMATION", "const STORY10_OBJS=scene.children.filter(o=>!PRE13.has(o));\n// ================= EP10 HOOK ANIMATION")
sub("\nawait loaded;\n", "\n" + open('ep13_hook.js').read() + "\n" + open('ep13_story.js').read() + "\nawait loaded;\n")
open('ep13.html', 'w').write(src)
print('ep13.html', len(src))
