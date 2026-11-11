// ================= FACE KIT (Inside Money, NEXT_LEVEL_PLAN stage 1) =================
// Shared by every episode: import {faceKit} from './face-kit.js'; const FK=faceKit(THREE);
// Works on the MakeHuman cast rig (person(): {g,BN,rest}). Bone names lose their dot in three.js (eye.L -> eyeL).
// Calibrated with facelab.mjs (2026-11-04):
//   upper lid orbicularis03 rot x (- closes, + opens), lower lid orbicularis04 rot x (+ rises), eyes eyeL/R (look-at solved in world space),
//   jaw rot x (+ opens), levator05 rot x (- shows upper teeth), oris01 rot x (+ lower lip down), levator06 rot x (+ sneer),
//   mouth corners risorius03 = TRANSLATION (rotation does nothing: the pivot sits on the corner). Brows have NO bones -> procedural morphs
//   on the eyebrow mesh + the forehead skin of the body mesh.
// Input = ARKit / MediaPipe blendshape names (0..1), so MediaPipe Face Landmarker clips (face_capture.py) map straight in.
//   FK.rig(P,{iris:'#5b3a22',brow:'#3a2618'})   once per character, before the first render
//   FK.update(P,t,{expr:'shock',k:1, look:Vector3|null, clip:{data,t0,gain}, w:{extra weights}})   every frame, AFTER the body pose
//   FK.PRESETS  shock / joy / sad / angry / doubt / smirk / neutral
//   FK.closeUp(P,dist,fov,side,dy) -> [camPos[], lookAt[], fov] for a KEYS row (Zack close-up on key beats)
export function faceKit(THREE){
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),Q=()=>new THREE.Quaternion(),E=new THREE.Euler(),q1=Q(),q2=Q(),v1=V(),v2=V(),v3=V();
const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
const PRESETS={
 neutral:{},
 shock:{browInnerUp:.95,browOuterUpLeft:.85,browOuterUpRight:.85,eyeWideLeft:.9,eyeWideRight:.9,jawOpen:.55,mouthLowerDownLeft:.35,mouthLowerDownRight:.35,mouthStretchLeft:.25,mouthStretchRight:.25},
 joy:{mouthSmileLeft:1,mouthSmileRight:1,cheekSquintLeft:.8,cheekSquintRight:.8,eyeSquintLeft:.4,eyeSquintRight:.4,browOuterUpLeft:.25,browOuterUpRight:.25,jawOpen:.06,mouthUpperUpLeft:.12,mouthUpperUpRight:.12},
 sad:{browInnerUp:.9,browDownLeft:.15,browDownRight:.15,mouthFrownLeft:.85,mouthFrownRight:.85,eyeBlinkLeft:.28,eyeBlinkRight:.28,eyeLookDownLeft:.25,eyeLookDownRight:.25,mouthLowerDownLeft:.1,mouthLowerDownRight:.1},
 angry:{browDownLeft:.95,browDownRight:.95,eyeSquintLeft:.55,eyeSquintRight:.55,noseSneerLeft:.6,noseSneerRight:.6,mouthFrownLeft:.45,mouthFrownRight:.45,mouthUpperUpLeft:.25,mouthUpperUpRight:.25,jawOpen:.06},
 doubt:{browDownLeft:.7,browOuterUpRight:.85,eyeSquintLeft:.45,mouthSmileRight:.35,mouthFrownLeft:.3,mouthPressLeft:.3},
 smirk:{mouthSmileLeft:.95,cheekSquintLeft:.4,eyeSquintLeft:.25,browOuterUpLeft:.3},
};
// ---------- rig ----------
function rig(P,o={}){
 const F=P.FK={look:null,ry:o.seed??(P.g.id*7.31%10),bones:{},m3:{},rp:{}};
 const keep=new Map();for(const b of Object.values(P.BN)){keep.set(b,[b.quaternion.clone(),b.position.clone()]);b.quaternion.copy(P.rest.get(b));}
 P.g.updateMatrixWorld(true);
 const gq=P.g.getWorldQuaternion(Q()),gInv=P.g.matrixWorld.clone().invert();
 for(const n of['jaw','eyeL','eyeR','orbicularis03L','orbicularis03R','orbicularis04L','orbicularis04R','risorius03L','risorius03R','levator05L','levator05R','levator06L','levator06R','oris01','oris04L','oris04R','oris06L','oris06R','oris03L','oris03R','oris05','oris07L','oris07R']){
  const b=P.BN[n];if(!b)continue;F.bones[n]=b;F.rp[n]=b.position.clone();
  const m=new THREE.Matrix4().copy(b.parent.matrixWorld).invert().multiply(P.g.matrixWorld);F.m3[n]=new THREE.Matrix3().setFromMatrix4(m);}   // group-space delta -> parent-local delta
 F.eye={};for(const sd of['L','R']){const b=P.BN['eye'+sd];if(!b)continue;const wq=b.getWorldQuaternion(Q());F.eye[sd]={fl:V(0,0,1).applyQuaternion(gq).applyQuaternion(wq.clone().invert())};}   // eye-local forward = character forward at rest
 // meshes
 let body,brow,eyes;P.g.traverse(m=>{if(!m.isSkinnedMesh)return;const n=m.name+m.material.name;if(/eyebrow/i.test(n))brow=m;else if(/high-poly/i.test(n))eyes=m;else if(/body/i.test(n)&&!body)body=m;});
 F.meshes=[];const head=V();P.BN.head.getWorldPosition(head);P.g.worldToLocal(head);
 if(brow&&body)buildBrowMorphs(P,F,brow,body,head,eyes);
 if(eyes&&o.iris)paintIris(eyes,o.iris);
 if(eyes){const mt=eyes.material;mt.roughness=.08;if('clearcoat' in mt){mt.clearcoat=1;mt.clearcoatRoughness=.02;}mt.envMapIntensity=1.4;mt.needsUpdate=true;}   // glossy cornea
 if(brow){const mt=brow.material;if(o.brow)paintBrow(mt,o.brow);mt.roughness=.9;mt.metalness=0;mt.envMapIntensity=.15;if(mt.sheen!==undefined)mt.sheen=0;mt.needsUpdate=true;}   // matte brows (no blue sky reflection)
 if(body){const mt=body.material;if(mt.sheen!==undefined){mt.sheen=.45;mt.sheenRoughness=.45;}mt.roughness=Math.min(mt.roughness??.6,.5);if(mt.normalScale)mt.normalScale.set(.6,.6);mt.needsUpdate=true;}   // soft skin sheen
 for(const [b,[q,p]] of keep){b.quaternion.copy(q);b.position.copy(p);}
 return F;}
function buildBrowMorphs(P,F,brow,body,head,eyes){
 const gm=P.g.matrixWorld,toGeo=m=>new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().copy(m.matrixWorld).invert().multiply(gm));
 const loc=(m,i)=>{m.getVertexPosition(i,v1);m.localToWorld(v1);return P.g.worldToLocal(v1).clone();};
 // brow vertices in group space
 const bp=brow.geometry.attributes.position,BV=[];let ymin=1e9,ymax=-1e9,xin=1e9,xout=-1e9,zf=-1e9;
 for(let i=0;i<bp.count;i++){const p=loc(brow,i);BV.push(p);const ax=Math.abs(p.x-head.x);xin=Math.min(xin,ax);xout=Math.max(xout,ax);ymin=Math.min(ymin,p.y);ymax=Math.max(ymax,p.y);zf=Math.max(zf,p.z);}
 const by=(ymin+ymax)/2;
 const SH={browInnerUp:(p,u,s)=>V(0,.010*Math.pow(1-u,1.2)+.002,-.002*(1-u)),
  browOuterUpLeft:(p,u,s)=>s>0?V(0,.009*u+.002,-.002*u):V(),browOuterUpRight:(p,u,s)=>s<0?V(0,.009*u+.002,-.002*u):V(),
  browDownLeft:(p,u,s)=>s>0?V(-s*.0025*(1-u),-.0075*(1-.55*u),.0015*(1-u)):V(),browDownRight:(p,u,s)=>s<0?V(-s*.0025*(1-u),-.0075*(1-.55*u),.0015*(1-u)):V()};
 const MN=['mouthSmileLeft','mouthSmileRight','mouthFrownLeft','mouthFrownRight','cheekSquintLeft','cheekSquintRight'];
 const names=[...Object.keys(SH),...MN];for(const n of MN)SH[n]=()=>V();
 // lip corners = outermost body vertices skinned to the lip bones; eye centres from the eyeball mesh
 const sk=body.skeleton,bi=body.geometry.attributes.skinIndex,bw=body.geometry.attributes.skinWeight,LIP=/^(oris03|oris07)(L|R)$/,C={L:null,R:null};
 for(let i=0;i<bi.count;i++)for(let k=0;k<4;k++){const w=bw.getComponent(i,k);if(w<.3)continue;const m=sk.bones[bi.getComponent(i,k)].name.match(LIP);if(!m)continue;const p=loc(body,i),sd=m[2];if(!C[sd]||(sd==='L'?p.x>C[sd].x:p.x<C[sd].x))C[sd]=p;}
 const EC={L:V(),R:V()},en={L:0,R:0};if(eyes){const ep=eyes.geometry.attributes.position;for(let i=0;i<ep.count;i+=3){const p=loc(eyes,i),sd=p.x>head.x?'L':'R';EC[sd].add(p);en[sd]++;}for(const sd of['L','R'])if(en[sd])EC[sd].divideScalar(en[sd]);}
 F.corner=C;F.eyeC=EC;
 const uOf=p=>{const ax=Math.abs(p.x-head.x);return Math.min(1,Math.max(0,(ax-xin)/(xout-xin)));};
 const morph=(mesh,deltaFor)=>{const g=mesh.geometry;const done=()=>{mesh.updateMorphTargets();mesh.morphTargetDictionary=Object.fromEntries(names.map((n,k)=>[n,k]));mesh.morphTargetInfluences=names.map(()=>0);mesh.material.needsUpdate=true;};if(g.userData.fk)return done();g.userData.fk=1;   // clones share the geometry: build once, hook up every mesh
 const M3=toGeo(mesh),n=g.attributes.position.count;
  g.morphAttributes.position=names.map(()=>new THREE.Float32BufferAttribute(new Float32Array(n*3),3));g.morphTargetsRelative=true;
  for(let i=0;i<n;i++){const ds=deltaFor(i);if(!ds)continue;ds.forEach((d,k)=>{if(!d)return;v2.copy(d).applyMatrix3(M3);g.morphAttributes.position[k].setXYZ(i,v2.x,v2.y,v2.z);});}
  done();};
 morph(brow,i=>{const p=BV[i],u=uOf(p),s=Math.sign(p.x-head.x);return names.map(nm=>SH[nm](p,u,s));});
 // forehead skin follows the brows with a soft falloff (only above the upper-lid crease, only the front of the face)
 const eyeY=by-.006,bpp=body.geometry.attributes.position;
 const g2=(p,c,r,ay=1)=>Math.exp(-((p.x-c.x)**2+((p.y-c.y)**2)*ay+(p.z-c.z)**2*.5)/(r*r));
 morph(body,i=>{const p=loc(body,i),out=names.map(()=>null);let any=false;
  if(!(p.y<eyeY||p.y>ymax+.05||p.z<zf-.035||Math.abs(p.x-head.x)>xout+.015)){
   let best=1e9,bk=0;for(let k=0;k<BV.length;k+=2){const d=(BV[k].x-p.x)**2+(BV[k].y-p.y)**2*.6;if(d<best){best=d;bk=k;}}
   const f=Math.exp(-best/(.014*.014))*sm(eyeY,eyeY+.008,p.y),q=BV[bk],u=uOf(q),s=Math.sign(q.x-head.x);
   if(f>=.02){Object.keys(SH).forEach((nm,k)=>{if(k<5)out[k]=SH[nm](q,u,s).multiplyScalar(f*(p.y>ymax?.6:1));});any=true;}}
  for(const sd of['L','R']){const s=sd==='L'?1:-1,c=C[sd];if(c&&p.z>c.z-.025){const f=g2(p,c,.021,.8);if(f>.02){any=true;
    out[names.indexOf('mouthSmile'+(s>0?'Left':'Right'))]=V(s*.0042,.0088,-.0035).multiplyScalar(f);
    out[names.indexOf('mouthFrown'+(s>0?'Left':'Right'))]=V(s*.0008,-.0058,.0004).multiplyScalar(f);}}
   const e=EC[sd];if(en[sd]&&p.y<e.y-.012&&p.z>e.z-.02){const ch=V(e.x+s*.004,e.y-.03,e.z+.01),f=g2(p,ch,.02,1.4);if(f>.02){any=true;out[names.indexOf('cheekSquint'+(s>0?'Left':'Right'))]=V(0,.0038,.0014).multiplyScalar(f);}}}
  return any?out:null;});
 F.meshes=[brow,body];}
function paintIris(eyes,col){const mt=eyes.material;if(!mt.map||mt.map.userData.fk)return;const im=mt.map.image,S=2048,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');x.drawImage(im,0,0,S,S);
 const d=x.getImageData(0,0,S,S).data,cl=[[0,0,0],[0,0,0]];for(let yy=0;yy<S;yy+=4)for(let xx=0;xx<S;xx+=4){const i=(yy*S+xx)*4,r=d[i],g=d[i+1],b=d[i+2];if(r>g+22&&r>b+22&&(r+g+b)<520){const k=xx>S/2?0:1;cl[k][0]+=xx;cl[k][1]+=yy;cl[k][2]++;}}
 const base=new THREE.Color(col),rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(12345);
 for(const [sx,sy,n] of cl){if(n<50)continue;const cx=sx/n,cy=sy/n,R=Math.sqrt(n*16/Math.PI)*1.03;
  const gr=x.createRadialGradient(cx,cy,R*.3,cx,cy,R);gr.addColorStop(0,'#'+base.clone().multiplyScalar(1.25).getHexString());gr.addColorStop(.55,'#'+base.getHexString());gr.addColorStop(.9,'#'+base.clone().multiplyScalar(.55).getHexString());gr.addColorStop(1,'#1a120c');
  x.fillStyle=gr;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
  for(let k=0;k<900;k++){const a=rnd()*6.283,r0=R*(.36+rnd()*.1),r1=R*(.6+rnd()*.38),l=.6+rnd()*.9;x.strokeStyle=`rgba(${Math.min(255,base.r*255*l*1.3)|0},${Math.min(255,base.g*255*l*1.3)|0},${Math.min(255,base.b*255*l*1.2)|0},${.25+rnd()*.35})`;x.lineWidth=1+rnd()*2.2;x.beginPath();x.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);x.lineTo(cx+Math.cos(a+.05*(rnd()-.5))*r1,cy+Math.sin(a+.05*(rnd()-.5))*r1);x.stroke();}   // radial fibres
  x.strokeStyle='rgba(255,236,200,.22)';x.lineWidth=R*.05;x.beginPath();x.arc(cx,cy,R*.5,0,7);x.stroke();   // collarette
  const lg=x.createRadialGradient(cx,cy,R*.82,cx,cy,R*1.06);lg.addColorStop(0,'rgba(10,6,4,0)');lg.addColorStop(.55,'rgba(10,6,4,.75)');lg.addColorStop(1,'rgba(10,6,4,0)');x.fillStyle=lg;x.beginPath();x.arc(cx,cy,R*1.06,0,7);x.fill();   // dark limbal ring
  x.fillStyle='#050403';x.beginPath();x.arc(cx,cy,R*.33,0,7);x.fill();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.flipY=mt.map.flipY;t.anisotropy=8;t.userData.fk=1;mt.map=t;mt.needsUpdate=true;}
function paintBrow(mt,col){if(!mt.map||mt.map.userData.fk)return;const im=mt.map.image,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
 const d=x.getImageData(0,0,c.width,c.height),p=d.data,k=new THREE.Color(col);for(let i=0;i<p.length;i+=4){const n=.75+.5*Math.random();p[i]=Math.min(255,k.r*255*n);p[i+1]=Math.min(255,k.g*255*n);p[i+2]=Math.min(255,k.b*255*n);}x.putImageData(d,0,0);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.flipY=mt.map.flipY;t.userData.fk=1;mt.map=t;mt.color.set(0xffffff);mt.needsUpdate=true;}
// ---------- apply ARKit weights ----------
function rot(P,n,x,y=0,z=0){const F=P.FK,b=F.bones[n];if(!b)return;b.quaternion.copy(P.rest.get(b));q1.setFromEuler(E.set(x,y,z));b.quaternion.multiply(q1);}
function mov(P,n,dx,dy,dz){const F=P.FK,b=F.bones[n];if(!b)return;b.position.copy(F.rp[n]).add(v3.set(dx,dy,dz).applyMatrix3(F.m3[n]));}
function apply(P,w){const g=k=>w[k]||0,F=P.FK;for(const n in F.bones)if(!/^eye/.test(n))F.bones[n].position.copy(F.rp[n]);
 for(const sd of['L','R']){const S=sd==='L'?'Left':'Right',s=sd==='L'?1:-1;
  const blink=Math.min(1,g('eyeBlink'+S)),wide=g('eyeWide'+S),sq=g('eyeSquint'+S),up=g('eyeLookUp'+S),dn=g('eyeLookDown'+S);
  rot(P,'orbicularis03'+sd,(-.40*blink+.07*wide*(1-blink)-.07*sq+.08*up-.1*dn)*1);
  rot(P,'orbicularis04'+sd,.13*blink+.17*sq+.09*g('cheekSquint'+S)-.05*wide);
  const sm=g('mouthSmile'+S),fr=g('mouthFrown'+S),st=g('mouthStretch'+S),pu=Math.max(g('mouthPucker'),g('mouthFunnel')),dp=g('mouthDimple'+S),pr=g('mouthPress'+S);
    rot(P,'oris04'+sd,.35*pu,0,s*(.22*sm+.15*st-.1*fr));rot(P,'oris06'+sd,.25*pu,0,s*(.12*sm+.12*st));
  rot(P,'levator05'+sd,-.55*g('mouthUpperUp'+S)-.1*sm);
  rot(P,'levator06'+sd,.4*g('noseSneer'+S));
  rot(P,'oris03'+sd,.25*g('mouthUpperUp'+S)-.25*pr);
  rot(P,'oris07'+sd,.35*g('mouthLowerDown'+S)-.2*pr);}
 rot(P,'jaw',.26*g('jawOpen')-.03*g('mouthClose'));
 rot(P,'oris01',.32*(g('mouthLowerDownLeft')+g('mouthLowerDownRight'))/2);
 rot(P,'oris05',-.35*g('mouthFunnel')+.2*g('mouthRollUpper'));
 if(w._mov)for(const [n,x,y,z] of w._mov)mov(P,n,x,y,z);
 for(const m of P.FK.meshes){const D=m.morphTargetDictionary;if(!D)continue;for(const k in D)m.morphTargetInfluences[D[k]]=Math.min(1.2,g(k));}}
// ---------- eyes: look-at + saccades ----------
function lookAt(P,tgt,t){const F=P.FK;P.g.updateMatrixWorld(true);
 for(const sd of['L','R']){const b=F.bones['eye'+sd];if(!b||!F.eye[sd])continue;b.quaternion.copy(P.rest.get(b));b.updateMatrixWorld(true);
  const wq=b.getWorldQuaternion(q2),fw=F.eye[sd].fl.clone().applyQuaternion(wq),pe=b.getWorldPosition(v1),d=v2.copy(tgt).sub(pe).normalize();
  let a=fw.angleTo(d);const lim=.45;if(a>lim)d.copy(fw).lerp(d,lim/a).normalize();
  const qd=q1.setFromUnitVectors(fw,d),nw=qd.multiply(wq),pq=b.parent.getWorldQuaternion(Q()).invert();b.quaternion.copy(pq.multiply(nw));}}
const hash=x=>{const s=Math.sin(x*127.1+311.7)*43758.5453;return s-Math.floor(s);};
function blinkAt(seed,t){let tb=hash(seed)*2;for(let i=0;tb<t+1;i++){const d=t-tb;if(d>=-0.01&&d<.16)return d<.055?sm(0,.055,d):1-sm(.055,.16,d);tb+=2+3*hash(seed+i*1.37);}return 0;}   // 2-5 s apart, 0.16 s long (closes fast, opens slower)
function saccade(seed,t){const i=Math.floor(t*1.4+hash(seed)*3),f=t*1.4+hash(seed)*3-i,k=sm(0,.06,f);const a=V((hash(seed+i)-.5)*.024,(hash(seed+i+.5)-.5)*.014,0),b=V((hash(seed+i+1)-.5)*.024,(hash(seed+i+1.5)-.5)*.014,0);return b.lerp(a,1-k);}
// ---------- clips (face_capture.py JSON) ----------
const CL=new Map();
async function loadClip(url){const d=await (await fetch(url)).json();const A=d.frames,nm=d.names,base=nm.map((_,k)=>{const v=A.map(f=>f[k]).sort((a,b)=>a-b);return v[Math.floor(v.length*.1)];});d.base=base;CL.set(url,d);return d;}
function clipW(c,tl,gain=1){const f=tl*c.fps,i=Math.max(0,Math.min(c.frames.length-1,Math.floor(f))),w={};
 for(let k=0;k<c.names.length;k++){let v=0,n=0;for(let j=-2;j<=2;j++){const r=c.frames[Math.max(0,Math.min(c.frames.length-1,i+j))];v+=r[k];n++;}v/=n;const b=c.base[k];w[c.names[k]]=Math.max(0,(v-b)/(1-b))*gain;}
 for(const k of['eyeBlinkLeft','eyeBlinkRight'])w[k]=0;   // own blink schedule, no stock-clip blinks
 for(const k of Object.keys(w))if(/eyeLook/.test(k))w[k]=0;   // our own look-at
 return w;}
// ---------- per-frame ----------
function update(P,t,o={}){const F=P.FK;if(!F)return;const w={};const add=(src,k=1)=>{for(const n in src)w[n]=n[0]==='_'?src[n]:Math.max(w[n]||0,src[n]*k);};
 if(o.expr){const ex=Array.isArray(o.expr)?o.expr:[[o.expr,o.k??1]];for(const [n,k] of ex)add(PRESETS[n]||{},k);}
 if(o.clip&&o.clip.data){const tl=t-o.clip.t0;if(tl>=0&&tl<(o.clip.len??99))add(clipW(o.clip.data,(o.clip.from||0)+tl*(o.clip.speed||1),o.clip.gain??1),o.clip.k??1);}
 if(o.w)add(o.w);
 if(o.talk){const a=o.talk*(.5+.5*Math.sin(t*23))*(.6+.4*Math.sin(t*7.3));w.jawOpen=Math.max(w.jawOpen||0,a*.5);}
 if(o.blink!==false){const b=blinkAt(F.ry,t);w.eyeBlinkLeft=Math.max(w.eyeBlinkLeft||0,b);w.eyeBlinkRight=Math.max(w.eyeBlinkRight||0,b);}
 apply(P,w);
 if(o.look){P.g.updateMatrixWorld(true);const s=saccade(F.ry,t),hp=P.BN.head.getWorldPosition(V()),dist=hp.distanceTo(o.look);
  const r=V(1,0,0).applyQuaternion(P.BN.head.getWorldQuaternion(Q()));lookAt(P,o.look.clone().addScaledVector(r,s.x*dist).add(V(0,s.y*dist,0)),t);}
 return w;}
function closeUp(P,dist=.75,fov=26,side=0,dy=-.03){P.g.updateMatrixWorld(true);const h=P.BN.head.getWorldPosition(V()).add(V(0,.07+dy,0));const f=V(Math.sin(side),0,Math.cos(side)).applyQuaternion(P.g.getWorldQuaternion(Q()));
 const c=h.clone().addScaledVector(f,dist);return [c.toArray(),h.toArray(),fov];}
function eyeLight(scene,i=.7){const L=new THREE.PointLight(0xfff4e6,i,4,1.5);scene.add(L);return cam=>L.position.copy(cam.position).add(V(0,.12,0));}   // catchlight that follows the camera
return {rig,update,apply,lookAt,loadClip,clipW,closeUp,eyeLight,PRESETS,blinkAt};}
