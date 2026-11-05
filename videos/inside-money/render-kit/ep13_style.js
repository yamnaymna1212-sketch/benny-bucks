// ================= EP13 El-Sayed look (user's reference image 2026-11-05) =================
// navy suit, white shirt, BLUE tie, dark swept-back hair, short dark salt-and-pepper beard (painted in the jartur69 skin, deepened here), warm tan skin, brown eyes.
function styleEls(o,mt){const n=o.name+mt.name;
 if(/suit_?3/i.test(n)){remap(mt,(r,g,b,u,v)=>{const l=lum(r,g,b);if(u>.84&&v<.27&&r>90)return [30,72,178];if(l>150)return [246,246,250];return [16,24,58];});if(mt.normalScale)mt.normalScale.set(.25,.25);mt.roughness=.72;mt.metalness=0;mt.metalnessMap=null;mt.roughnessMap=null;mt.needsUpdate=true;}
 if(/eyebrow/i.test(n)){remap(mt,(r,g,b)=>{const l=lum(r,g,b)/255,k=.5+.4*l;return [42*k,32*k,26*k];});mt.color.set(0xffffff);}
 else if(/short04/i.test(n)){remap(mt,(r,g,b)=>{const l=lum(r,g,b)/255,k=.55+.6*l;return [Math.min(255,34*k),Math.min(255,27*k),Math.min(255,23*k)];});mt.color.set(0xffffff);mt.roughness=.85;mt.envMapIntensity=.25;mt.metalness=0;}
 if(/body/i.test(n)){mt.color.setRGB(.9,.64,.47);
  // head UV island: face is rotated (forehead at u~.75, chin at u~.97); beard + moustache zone = u > .86 -> dark salt-and-pepper stubble, lips kept
  remap(mt,(r,g,b,u,v)=>{if(u<.84||v<.17||v>.83)return [r,g,b];if(r>g+38&&r>140)return [r,g,b];const l=lum(r,g,b),w=Math.max(0,Math.min(1,(u-.85)/.045));if(!w)return [r,g,b];
   const hq=Math.sin(Math.round(u*2048)*12.9898+Math.round(v*2048)*78.233)*43758.5453,q=(hq-Math.floor(hq))*97,k=w*(.86+.06*Math.max(0,Math.min(1,(205-l)/55))),salt=q>91;const tr=salt?118:44,tg=salt?112:37,tb=salt?106:32;return [r+(tr-r)*k,g+(tg-g)*k,b+(tb-b)*k];});}}
