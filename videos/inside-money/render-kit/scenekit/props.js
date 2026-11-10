// scenekit/props.js - small real props used to explain things (no emoji icons: solid 3D objects with meaning colours).
//   form1040(K)        a big Form 1040 sheet (Group); .circle(k) draws a red ring around "Total income"; .cover(k) a black bar hides the income line
//   redFlag(K)         pole + waving red cloth; .wave(t)
//   check3D(K) / x3D(K) green check / red X (solid glow)
//   evidenceBag(K)     clear plastic bag with a red EVIDENCE strip; .fill(k)
//   homeSafe(K,MK)     an open home safe with $1 straps inside
export function form1040(K){const {THREE,add,B}=K;const g=K.group();
 const T=K.tex(850,1100,(x,w,h)=>{x.fillStyle='#fbfbf7';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font='800 64px Mont';x.fillText('Form 1040',40,90);x.font='700 26px Arial';x.fillText('U.S. Individual Income Tax Return',40,135);
  x.fillRect(40,155,w-80,4);x.font='600 24px Arial';const L=[['Wages, salaries, tips','1a'],['Tax-exempt interest','2a'],['Ordinary dividends','3b'],['IRA distributions','4b'],['Pensions and annuities','5b'],['Social security benefits','6b'],['Capital gain or (loss)','7'],['Other income','8']];
  L.forEach(([s,n],i)=>{const y=210+i*62;x.fillStyle='#111';x.fillText(n,40,y);x.fillText(s,100,y);x.strokeStyle='#999';x.lineWidth=2;x.beginPath();x.moveTo(560,y+8);x.lineTo(w-40,y+8);x.stroke();});
  const y=210+8*62+20;x.fillStyle='#111';x.font='800 34px Arial';x.fillText('9',40,y);x.fillText('Total income',100,y);x.strokeStyle='#111';x.lineWidth=4;x.strokeRect(540,y-42,w-580,58);
  x.font='800 40px Arial';x.textAlign='right';x.fillText('$',w-60,y);x.textAlign='left';x.font='600 22px Arial';x.fillStyle='#666';for(let i=0;i<5;i++){x.fillRect(40,y+70+i*50,w-80,2);}});
 const sheet=add(new THREE.PlaneGeometry(.85,1.1),new THREE.MeshStandardMaterial({map:T,roughness:.9,color:0xd8d8d8}),0,0,0,g,false);sheet.receiveShadow=true;
 const ring=add(new THREE.TorusGeometry(.5,.012,8,64),new THREE.MeshStandardMaterial({color:0xff1e1e,emissive:0xff1e1e,emissiveIntensity:1.2}),.2,-.03,.004,g,false);ring.scale.set(.42,.1,1);
 const bar=add(B(.82,.07,.004),new THREE.MeshStandardMaterial({color:0x050505,roughness:.6}),0,-.03,.004,g,false);
 const yi=.55-(210+8*62+20-12)/1100*1.1;ring.position.y=bar.position.y=yi;
 g.userData.circle=k=>{ring.visible=k>.01;ring.scale.set(.42*Math.max(.01,k),.1*Math.max(.01,k),1);};g.userData.cover=k=>{bar.visible=k>.01;bar.scale.x=Math.max(.01,k);bar.position.x=-.41*(1-k);};
 g.userData.circle(0);g.userData.cover(0);g.circle=g.userData.circle;g.cover=g.userData.cover;return g;}
export function redFlag(K){const {THREE,add,CY,M}=K;const g=K.group();add(CY(.018,.018,1.2,10),M(0xd9dbde,.25,.9),0,.6,0,g);add(new THREE.SphereGeometry(.03,10,8),M(0xd9dbde,.25,.9),0,1.21,0,g,false);
 const geo=new THREE.PlaneGeometry(.62,.4,20,6);const base=geo.attributes.position.array.slice();const cl=add(geo,new THREE.MeshStandardMaterial({color:0xe01414,emissive:0xb00000,emissiveIntensity:.35,roughness:.6,side:THREE.DoubleSide}),.32,1.0,0,g);
 g.wave=t=>{const p=geo.attributes.position;for(let i=0;i<p.count;i++){const u=(base[i*3]+.31)/.62;p.setZ(i,Math.sin(u*6-t*7)*.05*u);}p.needsUpdate=true;geo.computeVertexNormals();};return g;}
export function check3D(K,col=0x2fe06a){const {THREE,add,RB}=K;const g=K.group();const m=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.0,roughness:.35});
 const a=add(RB(.12,.38,.12,.04),m,-.13,-.05,0,g,false);a.rotation.z=.75;const b=add(RB(.12,.72,.12,.04),m,.12,.1,0,g,false);b.rotation.z=-.62;return g;}
export function x3D(K,col=0xff2020){const {THREE,add,RB}=K;const g=K.group();const m=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.0,roughness:.35});
 for(const s of[-1,1]){const a=add(RB(.13,.75,.13,.04),m,0,0,0,g,false);a.rotation.z=s*.78;}return g;}
export function evidenceBag(K){const {THREE,add,B}=K;const g=K.group();
 const bag=add(B(.5,.62,.3),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.12,transmission:.6,transparent:true,opacity:.35,thickness:.02}),0,.31,0,g,false);
 const T=K.tex(256,64,x=>{x.fillStyle='#d61f1f';x.fillRect(0,0,256,64);x.fillStyle='#fff';x.font='800 40px Mont';x.textAlign='center';x.fillText('EVIDENCE',128,47);});
 add(new THREE.PlaneGeometry(.48,.12),new THREE.MeshStandardMaterial({map:T,roughness:.5}),0,.52,.152,g,false);
 const IN=add(B(.42,.5,.22),new THREE.MeshStandardMaterial({color:0xa9bd96,roughness:.85}),0,.0,0,g,false);
 g.fill=k=>{IN.visible=k>.02;IN.scale.y=Math.max(.02,k);IN.position.y=.25*k+.01;};g.fill(0);return g;}
export function homeSafe(K,MK){const {THREE,add,B,RB,M}=K;const g=K.group();const dk=M(0x2a2d31,.35,.85);
 add(RB(.7,.8,.6,.04),dk,0,.4,0,g);add(B(.6,.68,.02),M(0x0e0f11,.8),0,.42,.3,g,false);
 const door=K.group(-.35,.4,.31,g);add(RB(.7,.78,.07,.03),dk,.35,0,0,door);add(new THREE.TorusGeometry(.1,.02,10,24),M(0xd5dade,.2,1),.35,0,.05,door,false);door.rotation.y=-1.9;
 for(let i=0;i<2;i++)for(let j=0;j<5;j++){const s=MK.strap(1);s.position.set(-.13+i*.26*0+(i?.0:0),.1+j*MK.NT,.0);s.rotation.y=Math.PI/2;s.position.x=i?.12:-.12;g.add(s);}   // never scale money below 1 (18 USC 504)
 return g;}
