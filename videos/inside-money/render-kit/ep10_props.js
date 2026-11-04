// ================= EP10 HOOK PROPS: Israel-flag crate + $10,000 straps on a pallet + U.S. NATIONAL DEBT clock =================
const CRX=GX+2.0,CRZ=18.7;
const ILT=tex(880,640,x=>{x.fillStyle='#ffffff';x.fillRect(0,0,880,640);x.fillStyle='#0038b8';x.fillRect(0,60,880,100);x.fillRect(0,480,880,100);   // Israel flag 11:8, stripes + Star of David
 x.strokeStyle='#0038b8';x.lineWidth=22;x.lineJoin='miter';const r=128,cx=440,cy=320;for(const a0 of[-Math.PI/2,Math.PI/2]){x.beginPath();for(let k=0;k<3;k++){const a=a0+k*2*Math.PI/3;x.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}x.closePath();x.stroke();}});
const EMB=tex(800,560,x=>{x.clearRect(0,0,800,560);x.fillStyle='rgba(20,40,90,.0)';   // Israel emblem stamp: blue shield, white menorah, olive branches, ISRAEL
 x.fillStyle='#0038b8';x.beginPath();x.moveTo(220,40);x.lineTo(580,40);x.lineTo(580,300);x.quadraticCurveTo(580,430,400,470);x.quadraticCurveTo(220,430,220,300);x.closePath();x.fill();
 x.strokeStyle='#fff';x.lineCap='round';x.lineWidth=14;const cx=400,by=330;x.beginPath();x.moveTo(cx,by);x.lineTo(cx,110);x.stroke();
 for(const r of[50,90,130]){x.beginPath();x.arc(cx,by-200+0,r,Math.PI*0,Math.PI,false);x.stroke();}
 x.fillStyle='#fff';x.fillRect(cx-70,by,140,18);x.fillRect(cx-40,by+18,80,30);for(const dx of[-130,-90,-50,0,50,90,130]){x.beginPath();x.arc(cx+dx,108,9,0,7);x.fill();}
 x.strokeStyle='#fff';x.lineWidth=7;for(const sd of[-1,1]){x.beginPath();x.moveTo(cx+sd*165,400);x.quadraticCurveTo(cx+sd*175,230,cx+sd*150,90);x.stroke();for(let i=0;i<7;i++){const yy=380-i*42,xx=cx+sd*(166+Math.sin(i)*4);x.beginPath();x.ellipse(xx+sd*16,yy,16,7,sd*.6,0,7);x.fill();}}
 x.fillStyle='#0038b8';x.font='800 78px Mont';x.textAlign='center';x.fillText('ISRAEL',400,548);});
const ZBT=tex(512,538,x=>{x.fillStyle='#b7c9a4';x.fillRect(0,0,512,538);for(let r=0;r<5;r++)for(let c=0;c<2;c++){const X=c*256,Y=r*107.6;x.drawImage(NOTE.image,X+2,Y+2,252,103);x.fillStyle='#c9952f';x.fillRect(X+114,Y+2,26,103);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(X+2,Y+103,252,3);}});
const ZBS=tex(256,256,x=>{x.fillStyle='#c3d3b0';x.fillRect(0,0,256,256);for(let i=0;i<256;i++){x.fillStyle=`rgba(60,95,60,${.08+Math.random()*.16})`;x.fillRect(0,i,256,1);}for(let k=0;k<2;k++){x.fillStyle='#c9952f';x.fillRect(52+k*128,0,22,256);}});
const ZBF=tex(512,206,x=>{x.drawImage(NOTE.image,0,0,512,206);x.fillStyle='#c9952f';x.fillRect(236,0,40,206);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,200,512,6);});
const ZBM=[new THREE.MeshStandardMaterial({map:ZBS,roughness:.85}),new THREE.MeshStandardMaterial({map:ZBT,roughness:.8}),new THREE.MeshStandardMaterial({map:ZBF,roughness:.8,emissive:0x1a5c2a,emissiveIntensity:.25})];
const ZBG=new THREE.BoxGeometry(.28,.11,.29),zbrick=(x,y,z)=>{const m=new THREE.Mesh(ZBG,[ZBM[0],ZBM[0],ZBM[1],ZBM[0],ZBM[2],ZBM[2]]);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;};
const PLX=CRX+1.05;   // pallet: screen left of the crate
{const wd=pbr('oak_wood_planks',1,1,0xb08a60);for(let i=0;i<3;i++)add(B(.95,.06,.09),wd,PLX,SY+.03,CRZ-.38+i*.38);for(let i=0;i<5;i++)add(B(.17,.03,.95),wd,PLX-.38+i*.19,SY+.075,CRZ);}
for(let y=0;y<4;y++)for(let ix=0;ix<3;ix++)for(let iz=0;iz<3;iz++)zbrick(PLX+(ix-1)*.29,SY+.09+.055+y*.112,CRZ+(iz-1)*.3);
const FLY=[];for(let i=0;i<8;i++){const m=zbrick(0,0,0);m.userData.a=V3(PLX+((i%3)-1)*.29,SY+.09+.055+4*.112+Math.floor(i/3)*.112,CRZ+(((i>>1)%3)-1)*.3);m.userData.b=V3(CRX+((i%2)-.5)*.3,SY+.2+Math.floor(i/2)*.1,CRZ+(((i>>1)%2)-.5)*.3);FLY.push(m);}
{const wd=pbr('oak_wood_planks',1,1,0x9a7650);const w=.9,h=.62,d=.78;   // open wooden crate
 add(B(w,.04,d),wd,CRX,SY+.02,CRZ);add(B(w,h,.04),wd,CRX,SY+h/2,CRZ-d/2);add(B(w,h,.04),wd,CRX,SY+h/2,CRZ+d/2);add(B(.04,h,d),wd,CRX-w/2,SY+h/2,CRZ);add(B(.04,h,d),wd,CRX+w/2,SY+h/2,CRZ);
 const f=add(new THREE.PlaneGeometry(.8,.56),new THREE.MeshStandardMaterial({map:EMB,roughness:.75,transparent:true}),CRX,SY+h/2,CRZ-d/2-.022,scene,false);f.rotation.y=Math.PI;}
// Israel flag on a pole next to the crate (screen right), waving
const FG3=new THREE.PlaneGeometry(.88,.64,24,8),ILM=new THREE.MeshStandardMaterial({map:ILT,roughness:.8,side:THREE.DoubleSide});
add(CY(.02,.025,2.4,12),M(0xd6d9de,.3,.9),CRX-.75,SY+1.2,CRZ+.2);add(new THREE.SphereGeometry(.04,12,8),M(0xd4af37,.3,1),CRX-.75,SY+2.42,CRZ+.2);
{const f=add(FG3,ILM,CRX-.75+.44,SY+2.05,CRZ+.2,scene,true);f.rotation.y=Math.PI;}
// the debt clock on the stage backdrop
const DCC=document.createElement('canvas');DCC.width=1536;DCC.height=640;const DCT=new THREE.CanvasTexture(DCC);DCT.colorSpace=THREE.SRGBColorSpace;DCT.anisotropy=8;
function drawDebt(v){const x=DCC.getContext('2d');x.fillStyle='#0b1530';x.fillRect(0,0,1536,640);x.fillStyle='#b22234';x.fillRect(0,0,1536,150);x.fillStyle='#fff';x.textAlign='center';x.font='800 100px Mont';x.fillText('U.S. NATIONAL DEBT',768,112);
 x.fillStyle='#ff2a2a';x.font='800 138px Mont';x.fillText('$'+Math.floor(v).toLocaleString('en-US'),768,380);x.fillStyle='#c9d4e8';x.font='800 64px Mont';x.fillText('AND COUNTING',768,520);x.strokeStyle='#fff';x.lineWidth=14;x.strokeRect(7,7,1522,626);DCT.needsUpdate=true;}
drawDebt(40502080966097);
const DFR=add(B(3.6,1.6,.1),M(0x16224a,.6),GX,SY+3.0,20.4);
const DEBT=add(new THREE.PlaneGeometry(3.4,1.42),new THREE.MeshBasicMaterial({map:DCT,toneMapped:false}),GX,SY+3.0,20.34,scene,false);DEBT.rotation.y=Math.PI;
// ---- zack-style materials: wet eyes (clearcoat), skin sheen, soft hair edges ----
function phys(mt){const p=new THREE.MeshPhysicalMaterial();THREE.MeshStandardMaterial.prototype.copy.call(p,mt);p.defines={STANDARD:'',PHYSICAL:''};return p;}
function zmat(o,mt){const n=o.name+mt.name;
 if(/hair|brow|lash|ponytail|bob|short|bun|messy|braid/i.test(n)){mt.alphaToCoverage=true;mt.alphaTest=.35;mt.roughness=Math.min(mt.roughness,.5);return mt;}
 if(/high-poly|eye/i.test(n)){const p=phys(mt);p.clearcoat=1;p.clearcoatRoughness=.03;p.roughness=.2;return p;}
 if(/body/i.test(n)){const p=phys(mt);p.sheen=.35;p.sheenRoughness=.5;p.sheenColor=new THREE.Color(1,.78,.68);p.roughness=.52;p.specularIntensity=.5;return p;}
 return mt;}
