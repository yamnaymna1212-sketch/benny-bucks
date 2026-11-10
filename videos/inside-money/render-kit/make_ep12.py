"""EP12 (dirty money, Part 1) scene builder. Stage 0: cast lab on top of ep10.html (python3 make_ep10.py first).
Test the masked criminal + Mike: node stills.mjs ep12.html 0 --q "lab=1&cam=x,y,z,lx,ly,lz,fov"."""
src = open('ep10.html').read()
def sub(old, new):
    global src
    assert old in src, old[:80]
    src = src.replace(old, new, 1)
sub("import {cameraKit} from './camera-kit.js';", "import {cameraKit} from './camera-kit.js';\nimport {shopKit} from './shop-kit.js';")
sub("manager:['manager']};", "manager:['manager'],masked:['masked']};")
sub("\nawait loaded;\n", "\n" + open('ep12_cast.js').read() + "\n" + open('ep12_hook.js').read() + "\n" + open('ep12_story.js').read() + "\n}\nawait loaded;\n")
sub("animate(t);if(window.FB)", "animate(t);if(window.labPose)labPose(t);else hook12(t);if(window.FB)")
sub("function setCam(t){", "function setCam(t){if(window.CAM12){const f=CAM12(t);CAMF=f;cam.position.set(...f.pos);cam.fov=f.fov;cam.updateProjectionMatrix();cam.lookAt(...f.look);CK12.fx(cam,t);const c=cam.position,fw=V3();cam.getWorldDirection(fw);fw.y=0;fw.normalize();sun.target.position.copy(c).addScaledVector(fw,10).setY(0);sun.position.copy(c).addScaledVector(fw,-22).add(V3(-8,40,0));return;}")
open('ep12.html', 'w').write(src)
print('ep12.html', len(src))
