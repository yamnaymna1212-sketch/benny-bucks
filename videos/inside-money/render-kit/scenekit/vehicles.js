// scenekit/vehicles.js - clean, toy-real vehicles from rounded boxes (clear-coat paint, glass, wheels, lights). Facing +x.
//   vehicle(K,'suv'|'police'|'pickup',{color})  -> {root, update(t,on)}   update flashes the police light bar (red/blue) and spins the wheels by distance
export function vehicle(K,type='suv',{color,p=K.scene,x=0,z=0,ry=0}={}){
 const {THREE,add,B,RB,CY,M}=K;const G=K.group(x,0,z,p);G.rotation.y=ry;
 const col=color??(type==='suv'?0x111316:type==='police'?0x15181d:0xc8202a);
 const paint=new THREE.MeshPhysicalMaterial({color:col,roughness:.28,metalness:.4,clearcoat:1,clearcoatRoughness:.08});
 const glass=new THREE.MeshPhysicalMaterial({color:0x101820,roughness:.05,metalness:.3,clearcoat:1,envMapIntensity:1.5});
 const rub=M(0x151515,.85),rim=M(0xb9bec4,.25,.9),chrome=M(0xdfe3e8,.15,1);
 const L=type==='pickup'?5.2:4.9,Wd=1.95,H=type==='suv'?.95:.8,bodyY=.42+H/2;
 add(RB(L,H,Wd,.16),paint,0,bodyY,0,G);
 if(type==='police'){const white=new THREE.MeshPhysicalMaterial({color:0xf3f4f6,roughness:.3,clearcoat:1});for(const s of[-1,1])add(B(2.2,H*.62,.02),white,.1,bodyY-.02,s*(Wd/2+.005),G,false);
  const T=K.tex(512,128,x=>{x.fillStyle='rgba(0,0,0,0)';x.clearRect(0,0,512,128);x.fillStyle='#10233f';x.font='800 92px Mont';x.textAlign='center';x.fillText('POLICE',256,98);});
  for(const s of[-1,1]){const m=add(new THREE.PlaneGeometry(1.7,.42),new THREE.MeshStandardMaterial({map:T,transparent:true,roughness:.4}),.1,bodyY,s*(Wd/2+.02),G,false);if(s<0)m.rotation.y=Math.PI;}}
 // cabin
 const cabL=type==='pickup'?2.0:type==='suv'?3.1:2.5,cabX=type==='pickup'?.55:-.15,cabH=type==='suv'?.85:.7;
 add(RB(cabL,cabH,Wd-.12,.14),paint,cabX,bodyY+H/2+cabH/2-.04,0,G);
 add(B(cabL-.25,cabH-.2,Wd-.1),glass,cabX,bodyY+H/2+cabH/2-.02,0,G,false);
 if(type==='pickup'){add(B(2.0,.08,Wd-.15),M(0x2a2a2a,.8),-1.4,bodyY+H/2-.02,0,G,false);for(const s of[-1,1])add(B(2.1,.32,.08),paint,-1.4,bodyY+H/2+.14,s*(Wd/2-.04),G);add(B(.08,.32,Wd),paint,-2.55,bodyY+H/2+.14,0,G);}
 // lights + grille
 for(const s of[-1,1]){add(B(.04,.14,.32),M(0xffffff,.1,0,{emissive:0xfff6e0,emissiveIntensity:1.6}),L/2+.005,bodyY+.12,s*.68,G,false);add(B(.04,.12,.3),M(0x9a0000,.2,0,{emissive:0xff1010,emissiveIntensity:.9}),-L/2-.005,bodyY+.12,s*.7,G,false);}
 add(B(.04,.26,1.0),chrome,L/2+.006,bodyY-.05,0,G,false);
 // wheels
 const WH=[];for(const [wx,s] of[[L*.32,1],[L*.32,-1],[-L*.32,1],[-L*.32,-1]]){const w=K.group(wx,.4,s*(Wd/2-.05),G);add(CY(.4,.4,.3,28),rub,0,0,0,w).rotation.x=Math.PI/2;add(CY(.25,.25,.32,20),rim,0,0,0,w).rotation.x=Math.PI/2;WH.push(w);}
 // police light bar
 const BAR=[];if(type==='police'){const y=bodyY+H/2+cabH-.02;add(RB(.35,.1,1.3,.03),M(0x222222,.4,.5),cabX,y+.05,0,G);
  for(const [s,c] of[[-1,0xff1a1a],[1,0x1a4dff]]){const m=add(RB(.3,.12,.55,.04),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.3,transparent:true,opacity:.95}),cabX,y+.14,s*.33,G,false);const Lt=new THREE.PointLight(c,0,9,1.4);Lt.position.set(cabX,y+.5,s*.4);G.add(Lt);BAR.push({m,Lt,s});}}
 let lastX=null;
 return {root:G,update(t,on=true){const ph=Math.sin(t*Math.PI*2*3.0)>0;for(const b of BAR){const lit=on&&(b.s<0?ph:!ph);b.m.material.emissiveIntensity=lit?4.5:.3;b.Lt.intensity=lit?16:0;}
  const px=G.position.x+G.position.z;if(lastX!==null){const d=px-lastX;for(const w of WH)w.children.forEach(c=>c.rotation.y+=d/.4);}lastX=px;}};}
