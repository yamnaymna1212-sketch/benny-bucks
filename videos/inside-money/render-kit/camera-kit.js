// camera-kit.js - Inside Money shared camera + montage kit (NEXT_LEVEL_PLAN stage 3, 2026-11-04).
// A "framing" is {pos:[x,y,z], look:[x,y,z], fov, ap?} (ap = BokehPass aperture for that shot, optional).
//   const CK=cameraKit(THREE,{FK});          FK = faceKit instance (for closeUp), optional
//   CK.fit(targets,{dir,fov})               auto-fit 9:16: every target point inside the frame AND above the 74 % caption line
//   CK.closeUp(P,{dist,fov,side,dy,ry})     face close-up (FK.closeUp), ry = temporary body yaw (pose at the shot time)
//   CK.overShoulder(P,target,{side,back,up,out,fov,fit})   camera behind P's shoulder looking at target (P in the foreground); fit = targets kept whole
//   CK.macro(obj|points,{dir,fov,margin,ap})           extreme close-up on an object (real money straps), shallow DoF
//   CK.orbit(center,{r0,r1,a0,a1,h0,h1,fov0,fov1}) -> [from,to]   a = yaw angle atan2(dx,dz) around the centre
//   CK.track(shots) -> t=>framing           shots [{t0,t1,a,b,ease,in:'cut'|'whip'}]; a/b = framing or ()=>framing (lazy)
//   CK.boom(t0,amp)  CK.fx(cam,t)           decaying impact shake + fov punch (call after cam.lookAt)
//   CK.ramp(t,t0,t1,slow,rec)               speed ramp for scene time: slow-mo inside [t0,t1], catches up over rec s, = t outside
//   CK.icon(kind,{color,size}) + CK.iconAnim(ic,t,t0,t1,{cam})   3D glowing icons: dollar warn up down check x
//   CK.popBox(mesh,k)                       world box of a floating text/icon mesh incl. its pop overshoot (use as a fit target)
//   CK.check(framing,targets) -> {inside, below}   how many points are in the safe area / under the caption line
//   CK.audit(times,max=2) -> gaps longer than max s without a new framing (rule: new framing every 1.5-2 s)
// Ease names: smooth, linear, ramp (fast start, long glide = speed ramp), rampIn (slow then whoosh), expo (in-out), settle (overshoot 2 %).
export function cameraKit(THREE,{FK=null,aspect=9/16,capLine=.74}={}){
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),VA=a=>a.isVector3?a.clone():V(...a);
const tmp=new THREE.PerspectiveCamera(40,aspect,.01,1000);
const D2R=Math.PI/180,hfov=v=>2*Math.atan(Math.tan(v*D2R/2)*aspect)/D2R;
const EASE={linear:u=>u,smooth:u=>u*u*(3-2*u),ramp:u=>1-Math.pow(1-u,3.2),rampIn:u=>Math.pow(u,3.2),
 expo:u=>u<=0?0:u>=1?1:u<.5?Math.pow(2,20*u-10)/2:(2-Math.pow(2,-20*u+10))/2,
 settle:u=>{const k=1-Math.pow(1-u,3);return k+Math.sin(u*Math.PI)*.02*(1-u);}};
// ---- target points: Vector3, [x,y,z], Box3, Object3D (its world box corners), or a list of those ----
function pts(x,out=[]){if(!x)return out;if(Array.isArray(x)&&typeof x[0]==='number'){out.push(V(...x));return out;}
 if(Array.isArray(x)){x.forEach(y=>pts(y,out));return out;}if(x.isVector3){out.push(x.clone());return out;}
 let b=x.isBox3?x:(x.updateMatrixWorld(true),new THREE.Box3().setFromObject(x));
 for(let i=0;i<8;i++)out.push(V(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z));return out;}
const box=(min,max)=>new THREE.Box3(VA(min),VA(max));
// safe area in NDC: side margin m, top margin tp, bottom = caption line (74 % from the top -> ndc y = 1-2*.74 = -.48)
function safe(o={}){const m=o.margin??.06,tp=o.top??.05;return {x0:-1+2*m,x1:1-2*m,y0:1-2*(o.cap??capLine)+2*(o.gap??.02),y1:1-2*tp};}
function bounds(P,pos,look,fov){tmp.fov=fov;tmp.position.copy(pos);tmp.lookAt(look);tmp.updateMatrixWorld(true);tmp.updateProjectionMatrix();
 let b={x0:9,x1:-9,y0:9,y1:-9,behind:false};for(const p of P){const q=p.clone().project(tmp);if(q.z>1||q.z<-1)b.behind=true;b.x0=Math.min(b.x0,q.x);b.x1=Math.max(b.x1,q.x);b.y0=Math.min(b.y0,q.y);b.y1=Math.max(b.y1,q.y);}return b;}
// aim at the centre, then shift the look point so the content's box sits in the middle of the safe area
function aim(P,c,pos,fov,S){const look=c.clone(),f=V(),r=V(),u=V();
 for(let k=0;k<4;k++){const b=bounds(P,pos,look,fov);f.subVectors(look,pos).normalize();r.crossVectors(f,V(0,1,0)).normalize();u.crossVectors(r,f);
  const d=pos.distanceTo(look),ty=Math.tan(fov*D2R/2)*d,tx=ty*aspect;
  look.addScaledVector(u,((b.y0+b.y1)/2-(S.y0+S.y1)/2)*ty).addScaledVector(r,((b.x0+b.x1)/2-(S.x0+S.x1)/2)*tx);}
 return look;}
function fit(targets,o={}){const P=pts(targets),S=safe(o),fov=o.fov??40,d=VA(o.dir??[0,.1,-1]).normalize();
 const c=o.center?VA(o.center):new THREE.Box3().setFromPoints(P).getCenter(V());
 const ok=D=>{const pos=c.clone().addScaledVector(d,D),look=aim(P,c,pos,fov,S),b=bounds(P,pos,look,fov);
  return {ok:!b.behind&&b.x1-b.x0<=S.x1-S.x0&&b.y1-b.y0<=S.y1-S.y0,pos,look};};
 let lo=o.min??.15,hi=o.max??300;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(ok(m).ok)hi=m;else lo=m;}
 const r=ok(hi*(o.slack??1));return {pos:r.pos.toArray(),look:r.look.toArray(),fov,ap:o.ap};}
function popBox(m,k=1.3){if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();const g=m.geometry.boundingBox,p=m.userData.pos||m.position;
 const hw=(g.max.x-g.min.x)/2*k,hy=(g.max.y-g.min.y)*k;return box([p.x-hw,p.y-.03,p.z-hw*.3],[p.x+hw,p.y+hy+.04,p.z+hw*.3]);}
function check(F,targets,o={}){const P=pts(targets),S=safe({...o,gap:0}),pos=VA(F.pos),look=VA(F.look);let inside=0,below=0;
 tmp.fov=F.fov;tmp.position.copy(pos);tmp.lookAt(look);tmp.updateMatrixWorld(true);tmp.updateProjectionMatrix();
 for(const p of P){const q=p.clone().project(tmp);if(q.x>=-1&&q.x<=1&&q.y>=S.y0&&q.y<=1&&q.z<1)inside++;else if(q.y<S.y0)below++;}return {inside,below,n:P.length};}
// ---- shot helpers ----
function withPose(P,o,fn){if(!P||o.ry===undefined&&!o.at)return fn();const ry=P.g.rotation.y,ps=P.g.position.clone();
 if(o.ry!==undefined)P.g.rotation.y=o.ry;if(o.at)P.g.position.copy(VA(o.at));P.g.updateMatrixWorld(true);const r=fn();P.g.rotation.y=ry;P.g.position.copy(ps);P.g.updateMatrixWorld(true);return r;}
function closeUp(P,o={}){return withPose(P,o,()=>{
 if(FK){const [pos,look,fov]=FK.closeUp(P,o.dist??.75,o.fov??27,o.side??0,o.dy??-.03);return {pos,look,fov,ap:o.ap??.0026};}
 const h=P.BN.head.getWorldPosition(V()).add(V(0,.04,0)),f=V(Math.sin(o.side??0),0,Math.cos(o.side??0)).applyQuaternion(P.g.getWorldQuaternion(new THREE.Quaternion()));
 return {pos:h.clone().addScaledVector(f,o.dist??.75).toArray(),look:h.toArray(),fov:o.fov??27,ap:o.ap??.0026};});}
// o.fit = targets that must be whole above the caption line: the camera steps back along the shoulder line until they fit
function overShoulder(P,target,o={}){return withPose(P,o,()=>{P.g.updateMatrixWorld(true);
 const h=P.BN.head.getWorldPosition(V()),T=VA(target),f=T.clone().sub(h).setY(0).normalize(),r=V().crossVectors(f,V(0,1,0)).normalize(),fov=o.fov??40;
 const at=back=>h.clone().addScaledVector(f,-back).addScaledVector(r,(o.side??1)*(o.out??.35)).add(V(0,o.up??.08,0));
 if(!o.fit){const look=T.clone().lerp(h,o.mix??0);return {pos:at(o.back??.9).toArray(),look:look.toArray(),fov,ap:o.ap};}
 const Pt=pts(o.fit),S=safe(o),c=new THREE.Box3().setFromPoints(Pt).getCenter(V());
 const ok=back=>{const pos=at(back),look=aim(Pt,c,pos,fov,S),b=bounds(Pt,pos,look,fov);return {ok:!b.behind&&b.x1-b.x0<=S.x1-S.x0&&b.y1-b.y0<=S.y1-S.y0,pos,look};};
 let lo=o.back??.6,hi=12;if(ok(lo).ok)hi=lo;else for(let i=0;i<30;i++){const m=(lo+hi)/2;if(ok(m).ok)hi=m;else lo=m;}
 const R=ok(hi*(o.slack??1));return {pos:R.pos.toArray(),look:R.look.toArray(),fov,ap:o.ap};});}
function macro(obj,o={}){return fit(obj,{dir:o.dir??[0,.7,-1],fov:o.fov??24,margin:o.margin??.01,top:o.top??.02,gap:-.1,slack:o.slack??.92,ap:o.ap??.006,min:.05,center:o.center});}
function orbit(c,o={}){const C=VA(c),f=(a,r,h,fov)=>({pos:[C.x+Math.sin(a)*r,C.y+h,C.z+Math.cos(a)*r],look:C.toArray(),fov,ap:o.ap});
 return [f(o.a0??0,o.r0??1.2,o.h0??.1,o.fov0??34),f(o.a1??Math.PI/2,o.r1??o.r0??1.2,o.h1??o.h0??.1,o.fov1??o.fov0??34)];}
// ---- interpolation + timeline ----
const lerpF=(A,B,k)=>({pos:A.pos.map((v,i)=>v+(B.pos[i]-v)*k),look:A.look.map((v,i)=>v+(B.look[i]-v)*k),fov:A.fov+(B.fov-A.fov)*k,ap:A.ap===undefined?B.ap:B.ap===undefined?A.ap:A.ap+(B.ap-A.ap)*k});
function whipF(A,B,k){   // pan-style whip: the view direction swings (slerp), position slides - reads as a whip-pan, not a fly-through
 const pa=VA(A.pos),pb=VA(B.pos),da=VA(A.look).sub(pa),db=VA(B.look).sub(pb),la=da.length(),lb=db.length();da.normalize();db.normalize();
 const q=new THREE.Quaternion().setFromUnitVectors(da,db),qi=new THREE.Quaternion().slerp(q,k),dir=da.clone().applyQuaternion(qi);
 const pos=pa.lerp(pb,k);return {pos:pos.toArray(),look:pos.clone().addScaledVector(dir,la+(lb-la)*k).toArray(),fov:A.fov+(B.fov-A.fov)*k,ap:B.ap};}
function track(shots,{whip=.24}={}){const get=(s,k)=>{if(typeof s[k]==='function')s[k]=s[k]();return s[k];};
 const at=(s,t)=>{const A=get(s,'a'),B=s.b?get(s,'b'):A,u=Math.min(1,Math.max(0,(t-s.t0)/(s.t1-s.t0)));return lerpF(A,B,(EASE[s.ease||'smooth'])(u));};
 const fn=t=>{let i=0;while(i<shots.length-1&&t>=shots[i+1].t0)i++;const s=shots[i],F=at(s,t),w=s.whip??whip;
  if(s.in==='whip'&&i>0&&t<s.t0+w){const k=EASE.expo((t-s.t0)/w);return whipF(at(shots[i-1],shots[i-1].t1),at(s,s.t0+w),k);}return F;};
 fn.shots=shots;fn.cuts=shots.slice(1).map(s=>[s.t0,s.in||'cut']);fn.end=t=>at(shots[shots.length-1],t);return fn;}
// ---- impact shake ----
const BOOMS=[];const boom=(t0,amp=1)=>BOOMS.push([t0,amp]);
function fx(cam,t){let rx=0,ry=0,rz=0,punch=0;for(const [t0,a] of BOOMS){const d=t-t0;if(d<0||d>.7)continue;const k=a*Math.exp(-d*8);
  rx+=k*.014*Math.sin(d*61);ry+=k*.011*Math.sin(d*47+1.3);rz+=k*.008*Math.sin(d*39+.7);punch+=a*.05*Math.sin(Math.min(1,d/.07)*Math.PI/2)*Math.exp(-d*5);}
 if(rx||ry||rz){cam.rotateX(rx);cam.rotateY(ry);cam.rotateZ(rz);}if(punch){cam.fov*=1-punch;cam.updateProjectionMatrix();}cam.updateMatrixWorld();}
// ---- speed ramp (scene time): inside [t0,t1] time runs at `slow`, then catches up over `rec` s so word-synced events land on time ----
function ramp(t,t0,t1,slow=.45,rec=.45){if(t<=t0)return t;if(t<=t1)return t0+(t-t0)*slow;const lag=(t1-t0)*(1-slow);if(t>=t1+rec)return t;
 const s=(t-t1)/rec;return t1-lag+(t-t1)+lag*s*s*(3-2*s);}
// ---- 3D glowing icons (glow front, dark extruded side, soft additive halo) ----
const HALO=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.35,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);return t;})();
function shape(kind){const S=new THREE.Shape(),H=(pts)=>{const p=new THREE.Path();pts.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));return p;};
 if(kind==='warn'){S.moveTo(0,.5);S.lineTo(.5,-.38);S.lineTo(-.5,-.38);S.closePath();S.holes.push(H([[-.06,.24],[.06,.24],[.04,-.08],[-.04,-.08]]),H([[-.055,-.15],[.055,-.15],[.055,-.26],[-.055,-.26]]));}
 else if(kind==='up'||kind==='down'){const s=kind==='up'?1:-1;[[0,.5],[.42,.05],[.16,.05],[.16,-.5],[-.16,-.5],[-.16,.05],[-.42,.05]].forEach(([x,y],i)=>i?S.lineTo(x,y*s):S.moveTo(x,y*s));S.closePath();}
 else if(kind==='check'){[[-.48,.02],[-.3,.2],[-.12,.02],[.32,.46],[.5,.28],[-.12,-.34]].forEach(([x,y],i)=>i?S.lineTo(x,y):S.moveTo(x,y));S.closePath();}
 else if(kind==='x'){[[-.36,.48],[0,.13],[.36,.48],[.48,.36],[.13,0],[.48,-.36],[.36,-.48],[0,-.13],[-.36,-.48],[-.48,-.36],[-.13,0],[-.48,.36]].forEach(([x,y],i)=>i?S.lineTo(x,y):S.moveTo(x,y));S.closePath();}
 return S;}
function glowFace(color,txt){if(!txt)return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(1.1),toneMapped:false});
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),col=new THREE.Color(color);x.fillStyle='#'+col.getHexString();x.beginPath();x.arc(128,128,124,0,7);x.fill();
 x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=10;x.beginPath();x.arc(128,128,104,0,7);x.stroke();x.fillStyle='#fff';x.font='900 170px Mont,Arial Black,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,128,138);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t,color:new THREE.Color(1.1,1.1,1.1),toneMapped:false});}
function icon(kind,o={}){const color=o.color??'#22d36b',size=o.size??.3,g=new THREE.Group(),side=new THREE.MeshStandardMaterial({color:new THREE.Color(color).multiplyScalar(.35),roughness:.35,metalness:.4});
 let m;if(kind==='dollar'){const f=glowFace(color,'$');m=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.1,48),[side,f,f]);m.rotation.x=Math.PI/2;}
 else{const geo=new THREE.ExtrudeGeometry(shape(kind),{depth:.1,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2});geo.translate(0,0,-.05);m=new THREE.Mesh(geo,[glowFace(color),side]);}
 m.castShadow=false;const inner=new THREE.Group();inner.add(m);g.add(inner);
 const h=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO,color,transparent:true,opacity:o.halo??.55,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));h.scale.setScalar(2.3);h.position.z=-.08;inner.add(h);
 g.scale.setScalar(size);g.userData.size=size;g.userData.inner=inner;g.visible=false;return g;}
function iconAnim(ic,t,t0,t1=1e9,o={}){const s=ic.userData.size,on=t>=t0&&t<t1+.2;ic.visible=on;if(!on)return;const d=t-t0,k=Math.min(1,d/.3);
 const p=(1+Math.sin(k*Math.PI)*.25)*(1-Math.pow(1-k,3))*(t>t1?1-(t-t1)/.2:1);ic.scale.setScalar(Math.max(.001,s*p));
 if(o.pos)ic.position.copy(VA(o.pos)).add(V(0,Math.sin(d*3.1)*(o.bob??.012),0));if(o.cam)ic.lookAt(o.cam.position);
 const sp=o.spin??1;ic.userData.inner.rotation.y=(1-k)*Math.PI*2*sp+Math.sin(d*2.2)*.3*sp;}
function audit(times,max=2){const T=[...times].sort((a,b)=>a-b),gaps=[];for(let i=1;i<T.length;i++)if(T[i]-T[i-1]>max)gaps.push([+T[i-1].toFixed(2),+T[i].toFixed(2)]);return gaps;}
return {fit,check,popBox,pts,box,safe,closeUp,overShoulder,macro,orbit,track,lerpF,whipF,boom,fx,ramp,icon,iconAnim,audit,EASE,hfov};}
