// scenekit/irs-room.js - IRS operations room, SIMPLE + CLEAR (user 2026-11-10): one big screen, the IRS seal + big white "IRS" above it,
// two police beacons, ONE desk in front. Nothing else on the walls. Lit enough to read faces.
//   const IRS=irsRoom(K,{x,z,feed});   feed = a texture (live yard camera render target) shown on the big screen
//   IRS.mode('feed'|'off'|'split')  IRS.reticle(k)  IRS.beacons(t,on)  IRS.right (plane on the right half of the screen for 'split')
//   room-local coords: screen centre (0,2.0,-3.0) facing +z, desk top at y .78 around z -.6
export function irsRoom(K,{x=300,z=0,feed=null}={}){
 const {THREE,add,B,RB,CY,M}=K;const R=K.group(x,0,z);
 const wall=new THREE.MeshStandardMaterial({color:0x1d2c4a,roughness:.75}),floor=K.pbr('laminate_floor_02',4,3,0x5b6170);
 add(B(10,.1,9),floor,0,-.035,.5,R,false);add(B(10,3.8,.1),wall,0,1.9,-3.15,R);for(const s of[-1,1])add(B(.1,3.8,9),wall,s*5,1.9,.5,R);add(B(10,.1,9),M(0x121a2a,.8),0,3.8,.5,R,false);
 for(const xx of[-2.5,0,2.5])add(B(1.8,.03,.4),M(0xffffff,.5,0,{emissive:0xe6eeff,emissiveIntensity:.8}),xx,3.74,0,R,false);
 // the big screen
 add(RB(4.7,2.75,.12,.04),M(0x0b0d10,.35,.5),0,2.0,-3.05,R);
 const SM=new THREE.MeshBasicMaterial({map:feed,toneMapped:false});const SCR=add(new THREE.PlaneGeometry(4.5,2.53),SM,0,2.0,-2.985,R,false);
 const OFF=K.tex(640,360,(x,w,h)=>{x.fillStyle='#05070a';x.fillRect(0,0,w,h);x.fillStyle='#5d6878';x.font='800 40px Mont';x.textAlign='center';x.fillText('NO SIGNAL',w/2,h/2+14);});
 const RIGHT=add(new THREE.PlaneGeometry(2.25,2.53),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,transparent:true,opacity:0}),1.125,2.0,-2.98,R,false);RIGHT.visible=false;
 const RET=K.tex(1280,720,x=>{x.strokeStyle='#ff2a2a';x.lineWidth=12;const c=[640,360],s=170;for(const [dx,dy] of[[-1,-1],[1,-1],[1,1],[-1,1]]){x.beginPath();x.moveTo(c[0]+dx*s,c[1]+dy*s*.62);x.lineTo(c[0]+dx*s,c[1]+dy*(s*.62-55));x.moveTo(c[0]+dx*s,c[1]+dy*s*.62);x.lineTo(c[0]+dx*(s-55),c[1]+dy*s*.62);x.stroke();}x.fillStyle='#ff2a2a';x.beginPath();x.arc(70,70,20,0,7);x.fill();});
 const RETM=new THREE.MeshBasicMaterial({map:RET,transparent:true,opacity:0,toneMapped:false,depthWrite:false});add(new THREE.PlaneGeometry(4.5,2.53),RETM,0,2.0,-2.975,R,false);
 // IRS seal + 3D letters
 const SEAL=K.tex(512,512,x=>{x.fillStyle='#0d2a55';x.beginPath();x.arc(256,256,250,0,7);x.fill();x.strokeStyle='#d4af37';x.lineWidth=18;x.beginPath();x.arc(256,256,230,0,7);x.stroke();x.lineWidth=6;x.beginPath();x.arc(256,256,196,0,7);x.stroke();});
 add(new THREE.CircleGeometry(.36,48),new THREE.MeshStandardMaterial({map:SEAL,roughness:.4,emissive:0xffffff,emissiveMap:SEAL,emissiveIntensity:.4}),-.95,3.42,-3.09,R,false);
 const L=K.txt3('IRS',.36,0xffffff,{ei:.55,p:R});L.position.set(.25,3.42,-3.02);
 // beacons on both top corners of the screen
 const BEAC=[[-2.15,0xff2020],[2.15,0x2050ff]].map(([bx,c])=>{const g=K.group(bx,3.48,-2.95,R);add(CY(.12,.14,.16,20),M(0x111111,.4,.6),0,-.1,0,g);
  const dome=add(new THREE.SphereGeometry(.14,20,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.4,roughness:.2,transparent:true,opacity:.92}),0,-.02,0,g,false);
  const Lt=new THREE.PointLight(c,0,11,1.2);Lt.position.set(0,-.4,1.2);g.add(Lt);return {g,dome,Lt};});
 // one desk in front with a monitor that shows the same feed + a keyboard
 const desk=new THREE.MeshStandardMaterial({color:0x3a4250,roughness:.45,metalness:.3}),top=K.pbr('oak_wood_planks',2,.7,0xc9a27a);
 add(B(3.2,.06,1.0),top,0,.78,-.6,R);add(B(3.2,.74,.06),desk,0,.39,-.12,R);
 add(B(.82,.5,.04),M(0x0b0d10,.4,.5),-.9,1.1,-.9,R);add(new THREE.PlaneGeometry(.76,.44),new THREE.MeshBasicMaterial({map:feed,toneMapped:false}),-.9,1.1,-.875,R,false);add(B(.05,.25,.05),desk,-.9,.9,-.92,R);
 add(B(.5,.02,.16),M(0x111111,.6),-.9,.81,-.45,R,false);
 const FILL=new THREE.PointLight(0xc8d6ff,14,14,1.2);FILL.position.set(0,3.0,2.5);R.add(FILL);
 const FACE=new THREE.SpotLight(0xffffff,30,12,.7,.6,1.2);FACE.position.set(0,3.4,3.5);FACE.target.position.set(0,1.4,-1.5);R.add(FACE);R.add(FACE.target);
 let md='';const api={root:R,screen:SCR,right:RIGHT,
  mode(m){if(m===md)return;md=m;SM.map=m==='off'?OFF:feed;SM.needsUpdate=true;RIGHT.visible=m==='split';},
  reticle(k){RETM.opacity=k;},
  beacons(t,on){const ph=Math.sin(t*Math.PI*2*3.2)>0;BEAC.forEach((b,i)=>{const lit=on&&(i===0?ph:!ph);b.Lt.intensity=lit?22:0;b.dome.material.emissiveIntensity=lit?4:.4;b.g.rotation.y=t*9;});}};
 return api;}
