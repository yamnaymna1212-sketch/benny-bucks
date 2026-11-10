// scenekit/core.js - shared helpers for every Inside Money scene (EP18+). One import gives geometry/material/texture helpers,
// the MakeHuman cast loader + pose helpers, 3D text, easing and the shot camera. Every scenekit module takes this K object.
//   const K=await core(THREE,scene,{TL});   (TL = TextureLoader on the page's LoadingManager)
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {clone as skClone} from 'three/addons/utils/SkeletonUtils.js';
export async function core(THREE,scene,{TL}){
 const K={THREE,scene};
 const PC={};
 K.pbr=(name,rx,ry,color)=>{const key=[name,rx,ry,color].join();if(PC[key])return PC[key];
  const ld=s=>{const t=TL.load(`dl/tex/${name}_${s}.jpg`);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=8;return t};
  const d=ld('diff');d.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshStandardMaterial({map:d,normalMap:ld('nor'),roughnessMap:ld('rough'),roughness:1});if(color!==undefined)m.color.set(color);return PC[key]=m;};
 const MC={};K.M=(c,r=.6,m=0,o={})=>{const k=[c,r,m,JSON.stringify(o)].join();return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:m},o)));};
 K.add=(geo,mat,x,y,z,p=scene,cast=true)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;p.add(m);return m};
 K.B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);K.RB=(w,h,d,r=.05)=>new RoundedBoxGeometry(w,h,d,4,Math.min(r,w/2-.001,h/2-.001,d/2-.001));
 K.CY=(a,b,h,s=32)=>new THREE.CylinderGeometry(a,b,h,s);K.V3=(x,y,z)=>new THREE.Vector3(x,y,z);
 K.tex=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;t.userData.canvas=c;return t;};
 K.redraw=(t,f)=>{const c=t.userData.canvas;f(c.getContext('2d'),c.width,c.height);t.needsUpdate=true;};
 K.group=(x=0,y=0,z=0,p=scene)=>{const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;};
 // easing
 K.sm=(a,b,t)=>{const k=Math.min(1,Math.max(0,(t-a)/(b-a)));return k*k*(3-2*k);};
 K.pop=(t,t0,d=.28)=>{const k=Math.min(Math.max((t-t0)/d,0),1);return k<=0?0:(1+Math.sin(k*Math.PI)*.22)*(1-Math.pow(1-k,3));};
 K.win=(t,a,b,f=.15)=>K.sm(a-f,a,t)*(1-K.sm(b,b+f,t));   // 0 -> 1 on [a,b] with soft edges
 // 3D text (solid, high contrast: GREEN money, RED problem, YELLOW key fact, WHITE neutral); centred on its origin
 const font=await new FontLoader().loadAsync('node_modules/three/examples/fonts/helvetiker_bold.typeface.json');
 K.txt3=(str,size,col,{ei=1.0,p=scene}={})=>{const g=new TextGeometry(str,{font,size,depth:size*.22,curveSegments:10,bevelEnabled:true,bevelThickness:size*.035,bevelSize:size*.025,bevelSegments:4});
  g.computeBoundingBox();g.translate(-(g.boundingBox.max.x+g.boundingBox.min.x)/2,-(g.boundingBox.max.y+g.boundingBox.min.y)/2,0);
  const sc=new THREE.Color(col).multiplyScalar(.28);
  return K.add(g,[new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:ei,roughness:.35}),new THREE.MeshStandardMaterial({color:sc,roughness:.5})],0,0,0,p,false);};
 // ---------------- cast (MakeHuman GLBs in dl/models/cast; guy.glb stand-in when missing) ----------------
 const GLBC={};const glb=async f=>{if(GLBC[f])return GLBC[f];try{GLBC[f]=await new GLTFLoader().loadAsync(`dl/models/cast/${f}.glb`);}catch(e){window.castFallback=true;GLBC[f]=await new GLTFLoader().loadAsync('dl/models/guy/guy.glb');GLBC[f].fallback=true;}return GLBC[f];};
 const qx=new THREE.Quaternion(),E=new THREE.Euler();
 K.AD=[0.12,0,0.72];
 // rec = {regex: colour} recolours matching meshes (dark colours drop the texture so a suit reads solid)
 K.person=async(file,rec,x,y,z,ry,fbCol,p=scene)=>{const G=await glb(file),g=skClone(G.scene);g.position.set(x,y,z);g.rotation.y=ry;p.add(g);
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const mt=o.material=o.material.clone();
   if(mt.normalMap&&/bump/i.test(mt.normalMap.name)){mt.normalMap=null;mt.needsUpdate=true;}
   if(mt.transparent||/hair|brow|lash|ponytail|bob|short|bun|messy|braid/i.test(o.name+mt.name)){mt.transparent=false;mt.alphaTest=.45;mt.depthWrite=true;mt.side=THREE.DoubleSide;}
   if(rec)for(const [k,c] of Object.entries(rec))if(new RegExp(k,'i').test(o.name+mt.name)){mt.color.set(c);mt.needsUpdate=true;}
   if(G.fallback&&fbCol&&/suit/i.test(o.name+mt.name)){mt.map=null;mt.color.set(fbCol);mt.needsUpdate=true;}}});
  const BN={};g.traverse(o=>{if(o.isBone)BN[o.name]=o;});const rest=new Map();for(const b of Object.values(BN))rest.set(b,b.quaternion.clone());return {g,BN,rest};};
 K.pose=(P,n,x,y,z)=>{const b=P.BN[n];if(!b)return;b.quaternion.copy(P.rest.get(b));qx.setFromEuler(E.set(x,y,z));b.quaternion.multiply(qx);};
 K.relax=P=>{for(const b of Object.values(P.BN))b.quaternion.copy(P.rest.get(b));K.pose(P,'upperarm01L',K.AD[0],0,-K.AD[2]);K.pose(P,'upperarm01R',K.AD[0],0,K.AD[2]);};
 K.face=(P,{jaw=0,smile=0}={})=>{K.pose(P,'jaw',jaw,0,0);for(const sd of['L','R']){K.pose(P,'risorius03'+sd,0,0,(sd==='L'?1:-1)*smile*.35);K.pose(P,'risorius02'+sd,0,0,(sd==='L'?1:-1)*smile*.35);}};
 K.arm=(P,sd,ux,uz,lx)=>{K.pose(P,'upperarm01'+sd,ux,0,(sd==='L'?-1:1)*uz);K.pose(P,'lowerarm01'+sd,lx,0,0);};
 const A=K.AD;
 K.armsUp=(P,k)=>{K.arm(P,'L',A[0]+.25*k,A[2]-2.05*k,.35*k);K.arm(P,'R',A[0]+.25*k,A[2]-2.05*k,.35*k);};
 K.idle=(P,t,o=0)=>{K.pose(P,'spine03',.03*Math.sin(t*1.7+o),0,.025*Math.sin(t*.9+o));K.pose(P,'head',.04*Math.sin(t*1.3+o),.12*Math.sin(t*.7+o),0);};
 K.walk=(P,t,amp=.4)=>{const ph=t*7;K.pose(P,'upperleg01L',-amp*Math.sin(ph),0,0);K.pose(P,'upperleg01R',amp*Math.sin(ph),0,0);K.pose(P,'lowerleg01L',amp*1.3*Math.max(0,Math.cos(ph)),0,0);K.pose(P,'lowerleg01R',amp*1.3*Math.max(0,-Math.cos(ph)),0,0);
  K.pose(P,'upperarm01L',A[0]+.3*Math.sin(ph),0,-A[2]);K.pose(P,'upperarm01R',A[0]-.3*Math.sin(ph),0,A[2]);};
 K.sit=(P,k=1)=>{for(const sd of['L','R']){K.pose(P,'upperleg01'+sd,-1.5*k,0,0);K.pose(P,'lowerleg01'+sd,1.5*k,0,0);}};   // seated: lower the group so the hips sit on the chair
 K.lieArms=(P,k=1)=>{K.arm(P,'L',A[0]+.3*k,A[2]-2.4*k,2.1*k);K.arm(P,'R',A[0]+.3*k,A[2]-2.4*k,2.1*k);};   // hands behind the head
 K.crossArms=(P,k=1)=>{K.arm(P,'L',A[0]+1.0*k,A[2]-.45*k,1.9*k);K.arm(P,'R',A[0]+1.0*k,A[2]-.45*k,1.9*k);};
 K.headHold=(P,k=1)=>{K.arm(P,'L',A[0]+.6*k,A[2]-1.95*k,2.3*k);K.arm(P,'R',A[0]+.6*k,A[2]-1.95*k,2.3*k);};
 K.shrug=(P,k=1)=>{K.arm(P,'L',A[0]+.25*k,A[2]-.55*k,1.5*k);K.arm(P,'R',A[0]+.25*k,A[2]-.55*k,1.5*k);K.pose(P,'head',0,0,.18*k);};
 K.point=(P,sd='R',k=1)=>{K.arm(P,sd,A[0]+1.35*k,A[2]-.35*k,.12*k);};
 K.phone=(P,k=1)=>{K.arm(P,'R',A[0]+.25*k,A[2]-1.55*k,2.45*k);K.pose(P,'head',0,0,-.12*k);};   // hand at the ear
 K.handsFront=(P,k=1)=>{K.arm(P,'L',A[0]+.75*k,A[2]-.2*k,.9*k);K.arm(P,'R',A[0]+.75*k,A[2]-.2*k,.9*k);};   // wrists together (cuffed)
 // ---------------- shot camera: shots [{t0,o:[x,y,z],keys:[[t,[pos],[look],fov],...]}]; monotone Hermite (no overshoot) ----------------
 const herm=(t,arr)=>{let i=0;while(i<arr.length-2&&t>=arr[i+1][0])i++;const a=arr[Math.max(0,i-1)],b=arr[i],c=arr[Math.min(arr.length-1,i+1)],d=arr[Math.min(arr.length-1,i+2)];
  const h=Math.max(1e-4,c[0]-b[0]),u=Math.min(1,Math.max(0,(t-b[0])/h)),u2=u*u,u3=u2*u;return {a,b,c,d,h,h00:2*u3-3*u2+1,h10:u3-2*u2+u,h01:-2*u3+3*u2,h11:u3-u2};};
 K.hv=(t,Kk,sel)=>{const {a,b,c,d,h,h00,h10,h01,h11}=herm(t,Kk),out=[];const Av=sel(a),Bv=sel(b),C=sel(c),D=sel(d);
  const tg=(dl,dr)=>dl*dr<=0?0:Math.sign(dr)*Math.min(Math.abs(dl+dr)/2,3*Math.abs(dl),3*Math.abs(dr));
  for(let j=0;j<Bv.length;j++){const d1=(C[j]-Bv[j])/h,d0=a===b?d1:(Bv[j]-Av[j])/(b[0]-a[0]),d2=c===d?d1:(D[j]-C[j])/(d[0]-c[0]);
   const m0=(a===b?0:tg(d0,d1))*h,m1=(c===d?0:tg(d1,d2))*h;out.push(h00*Bv[j]+h10*m0+h01*C[j]+h11*m1);}return out;};
 K.shotCam=(cam,t,SH)=>{let s=SH[0];for(const x of SH)if(t>=x.t0)s=x;const Kk=s.keys,o=s.o||[0,0,0],tt=Math.min(Math.max(t,Kk[0][0]),Kk[Kk.length-1][0]);
  const p=K.hv(tt,Kk,k=>k[1]),l=K.hv(tt,Kk,k=>k[2]),f=K.hv(tt,Kk,k=>[k[3]]);cam.position.set(p[0]+o[0],p[1]+o[1],p[2]+o[2]);cam.up.set(0,1,0);cam.fov=f[0];cam.updateProjectionMatrix();cam.lookAt(l[0]+o[0],l[1]+o[1],l[2]+o[2]);return s;};
 return K;}
