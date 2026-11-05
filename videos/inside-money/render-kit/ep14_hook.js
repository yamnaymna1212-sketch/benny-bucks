// ================= EP14 HOOK: "What if Trump pressed the button and dropped a nuclear bomb on Iran? What happens to your wallet?" =================
// User design 2026-11-05: an easy-to-read MAP -> Trump presses a button -> a missile flies to Iran -> Mike, scared for his bank account and money.
// Zack look (EP13 rules): plain dark-navy world, crisp flat colours (USA blue, Iran red, white labels), steady camera (no shake, no DoF, no motion blur).
// Map = a giant 3D world map on the floor (Natural Earth 110m GeoJSON, assets/world-110m.json). Facing EAST = -z, so north is on the left (-x).
// No casualties / no mushroom cloud on screen: a flash, a shock ring and a yellow radiation sign only. FICTIONAL WHAT-IF.
const W14=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tTrump=W14('trump'),tPress=W14('pressed'),tButton=W14('button'),tDrop=W14('dropped'),tNuc=W14('nuclear'),tBomb=W14('bomb'),tIran=W14('iran'),
 tWhat2=W14('what',1),tHap=W14('happens'),tYour=W14('your'),tWallet=W14('wallet');
const tLaunch=tButton+.15,tHit=Math.max(tIran+.05,tLaunch+1.0),HOOK_END=tWallet+.6;
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;
scene.background=new THREE.Color(0x07112a);scene.fog=new THREE.Fog(0x07112a,40,120);
// ---------------- the map ----------------
const MO=V3(400,0,400),S14=.1,LONC=-20,LATC=35,US_Y=.105;
const mxz=(lon,lat,y=US_Y)=>V3(MO.x-(lat-LATC)*S14,y,MO.z-(lon-LONC)*S14);
const MAPG=new THREE.Group();MAPG.position.copy(MO);scene.add(MAPG);
{const o=add(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x081430,roughness:.95,envMapIntensity:.3}),0,.012,0,MAPG,false);o.rotation.x=-Math.PI/2;}
const GEO=await (await fetch('assets/world-110m.json')).json();
const LANDM=new THREE.MeshStandardMaterial({color:0x5a6478,roughness:.85,envMapIntensity:.5}),
 USM=new THREE.MeshStandardMaterial({color:0x2a6cf0,roughness:.5,emissive:0x0b2a7a,emissiveIntensity:.6}),
 IRM=new THREE.MeshStandardMaterial({color:0xe0242c,roughness:.5,emissive:0x5a0000,emissiveIntensity:.6}),
 EDGEW=new THREE.LineBasicMaterial({color:0xffffff}),EDGED=new THREE.LineBasicMaterial({color:0x2b3448});
for(const f of GEO.features){const nm=f.properties.name;if(nm==='Antarctica')continue;
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates,toV=([lo,la])=>new THREE.Vector2(-(la-LATC)*S14,(lo-LONC)*S14);
 const shapes=polys.map(p=>{const s=new THREE.Shape(p[0].map(toV));for(const h of p.slice(1))s.holes.push(new THREE.Path(h.map(toV)));return s;});
 const hi=nm==='United States of America'?'us':nm==='Iran'?'ir':null;
 const g=new THREE.ExtrudeGeometry(shapes,{depth:hi?.09:.05,bevelEnabled:false});
 const m=new THREE.Mesh(g,hi==='us'?USM:hi==='ir'?IRM:LANDM);m.rotation.x=-Math.PI/2;m.position.y=.015;m.receiveShadow=true;m.castShadow=false;MAPG.add(m);
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,40),hi?EDGEW:EDGED);e.rotation.x=-Math.PI/2;e.position.y=.016;MAPG.add(e);}
const IRAN=mxz(53.5,32.5,.105),DC=mxz(-77,38.9);
const LBL_USA=txt3('USA',.36,WHT,scene);LBL_USA.rotation.x=-Math.PI/2;LBL_USA.position.copy(mxz(-96,33.2,US_Y+.01));LBL_USA.userData.pos=LBL_USA.position;const _x=0,LBL_IR=popT('IRAN',.42,WHT,mxz(53.5,33,.75),-1,1e9);
// ---------------- the button pedestal (yellow/black, radiation sign, big red button) ----------------
const TRP=mxz(-77.5,39.2),PED=TRP.clone().add(V3(-.14,0,.46));
const STRIPE=tex(256,512,x=>{x.fillStyle='#ffc61a';x.fillRect(0,0,256,512);x.fillStyle='#111';for(let i=-4;i<12;i++){x.beginPath();x.moveTo(0,i*64);x.lineTo(256,i*64+128);x.lineTo(256,i*64+160);x.lineTo(0,i*64+32);x.fill();}
 x.fillStyle='#111';x.fillRect(28,150,200,200);x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,86,0,7);x.fill();x.fillStyle='#111';
 for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,250);x.arc(128,250,78,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,17,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,250,11,0,7);x.fill();});
const PEDG=new THREE.Group();{const g=PEDG;g.position.copy(PED);scene.add(g);add(B(.36,.92,.3),new THREE.MeshStandardMaterial({map:STRIPE,roughness:.55}),0,.46,0,g);add(B(.44,.05,.38),M(0x1a1a1a,.4,.3),0,.945,0,g);}
const BTN=add(new THREE.SphereGeometry(.075,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe01010,roughness:.25,emissive:0xff0000,emissiveIntensity:.2}),PED.x,PED.y+.97,PED.z);
const BTN_TOP=V3(PED.x,PED.y+1.03,PED.z);
// ---------------- missile + white trail ----------------
const LP=mxz(-75.5,38.3,US_Y),AP1=LP.clone().lerp(IRAN,.5).add(V3(0,4.2,0));
const ARC=new THREE.QuadraticBezierCurve3(LP,AP1,IRAN.clone().add(V3(0,.15,0)));
const MSL=missileModel(0xf4f4f4);MSL.scale.setScalar(1.7);scene.add(MSL);MSL.visible=false;
const TRSEG=160,TRAIL=new THREE.Mesh(new THREE.TubeGeometry(ARC,TRSEG,.03,8,false),new THREE.MeshBasicMaterial({color:0xf2f4f8}));scene.add(TRAIL);
const uM=t=>{const k=Math.min(1,Math.max(0,(t-tLaunch)/(tHit-tLaunch)));return Math.pow(k,1.35);};
function missile14(t){const u=uM(t),on=t>=tLaunch&&t<tHit;MSL.visible=on;TRAIL.visible=t>=tLaunch;TRAIL.geometry.setDrawRange(0,Math.floor(u*TRSEG)*8*6);
 if(!on)return;ARC.getPoint(u,MSL.position);const tg=ARC.getTangent(Math.min(u,.999));MSL.quaternion.setFromUnitVectors(V3(0,1,0),tg);}
// ---------------- impact: flash + shock ring + Iran glows + radiation sign ----------------
const FLASH=add(new THREE.SphereGeometry(1,32,16),new THREE.MeshBasicMaterial({color:new THREE.Color(1.6,1.0,.35),toneMapped:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),IRAN.x,IRAN.y,IRAN.z,scene,false);
const RING=add(new THREE.RingGeometry(.92,1,96),new THREE.MeshBasicMaterial({color:0xff8a1f,toneMapped:false,transparent:true,side:THREE.DoubleSide}),IRAN.x,IRAN.y+.04,IRAN.z,scene,false);RING.rotation.x=-Math.PI/2;
const RADT=tex(256,256,x=>{x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.strokeStyle='#111';x.lineWidth=10;x.beginPath();x.arc(128,128,116,0,7);x.stroke();x.fillStyle='#111';
 for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,128);x.arc(128,128,96,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,24,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,128,15,0,7);x.fill();});
const RAD=new THREE.Mesh(new THREE.CircleGeometry(.42,64),new THREE.MeshBasicMaterial({map:RADT,toneMapped:false,side:THREE.DoubleSide}));scene.add(RAD);
function impact14(t){const d=t-tHit;FLASH.visible=d>0&&d<.7;if(FLASH.visible){FLASH.scale.set(1,1.4,1).multiplyScalar(.1+.45*sm(0,.2,d));FLASH.material.opacity=1-sm(.1,.6,d);}
 RING.visible=d>0&&d<1.6;if(RING.visible){RING.scale.setScalar(.2+2.6*sm(0,1.4,d));RING.material.opacity=1-sm(.6,1.6,d);}
 IRM.emissiveIntensity=d>0?.6+2.2*(1-sm(0,1.2,d))+.4*Math.max(0,Math.sin(d*8)):.6;
 const s=pop(t,tHit+.15,.3);RAD.visible=s>.01;RAD.scale.setScalar(s);RAD.position.copy(IRAN).add(V3(0,1.75,0));RAD.lookAt(cam.position);
 LBL_IR.userData.pos.copy(IRAN).add(V3(0,t>tHit?.95:.75,0));}
// ---------------- Trump presses the button ----------------
let TRA14=null;
function trump14(t){const P=TR;P.g.visible=t<tHit;PEDG.visible=BTN.visible=t<tHit;relax(P);idle(P,t,.6);P.g.position.copy(TRP);P.g.rotation.y=0;
 if(!TRA14){P.g.updateMatrixWorld(true);TRA14={hov:solveReach(P,'R',BTN_TOP.clone().add(V3(0,.16,-.02)))};relax(P);TRA14.prs=solveReach(P,'R',BTN_TOP.clone().add(V3(0,.03,-.01)));relax(P);}
 const up=sm(tTrump-.2,tTrump+.25,t),dn=sm(tButton-.18,tButton,t),rel=sm(tLaunch+.35,tLaunch+.7,t);
 const a=lerpA(lerpA(REST,TRA14.hov,up),TRA14.prs,dn*(1-rel));setA(P,'R',rel>0?lerpA(TRA14.prs,TRA14.hov,rel):a);curl(P,'R',.7,.4);
 if(rel>0)pose(P,'head',-.25*rel,0,0);   // he looks up at the missile
 BTN.position.y=PED.y+.97-.025*dn*(1-rel);BTN.material.emissiveIntensity=.2+2.8*dn;
 face(P,{jaw:t<tLaunch?.03+.03*Math.abs(Math.sin(t*9)):0,smile:.25});
 FK.update(P,t,{expr:[['doubt',.5*(1-dn)],['joy',.4*dn]],look:t<tButton-.25?cam.position:rel>.3?MSL.position:BTN.position});}
// ---------------- Mike: watches from the middle of the US, then turns to us with his bank app + money flying away ----------------
const MKP14=mxz(-110,36.5);let MKA=null;
const PHC=document.createElement('canvas');PHC.width=256;PHC.height=512;const PHT=new THREE.CanvasTexture(PHC);PHT.colorSpace=THREE.SRGBColorSpace;
const PHONE=new THREE.Group();scene.add(PHONE);add(RB(.08,.16,.01,.012),M(0x111111,.3,.4),0,0,0,PHONE);
{const s=new THREE.Mesh(new THREE.PlaneGeometry(.072,.148),new THREE.MeshBasicMaterial({map:PHT,toneMapped:false}));s.position.z=.0055;PHONE.add(s);}
let PHV=-1;
function phoneDraw(v,drop){const key=Math.round(v)+'|'+drop;if(key===PHV)return;PHV=key;const x=PHC.getContext('2d');x.fillStyle='#0d1424';x.fillRect(0,0,256,512);
 x.fillStyle='#1b5cff';x.fillRect(0,0,256,80);x.fillStyle='#fff';x.font='800 34px Mont';x.textAlign='center';x.fillText('MY BANK',128,54);
 x.fillStyle='#9aa7c4';x.font='700 24px Mont';x.fillText('Checking',128,140);
 const col=drop>0?'#ff2a2a':'#ffffff';x.fillStyle=col;x.font='800 50px Mont';x.fillText('$'+Math.round(v).toLocaleString('en-US'),128,205);
 if(drop>0){x.font='800 30px Mont';x.fillText('▼ -$'+Math.round(drop).toLocaleString('en-US'),128,252);}
 x.strokeStyle=drop>0?'#ff2a2a':'#22e06a';x.lineWidth=7;x.beginPath();const n=12;for(let i=0;i<=n;i++){const u=i/n,y=330+(drop>0?Math.pow(u,1.5)*120:-Math.sin(u*3)*10)+Math.sin(i*2.3)*8;i?x.lineTo(20+u*216,y):x.moveTo(20+u*216,y);}x.stroke();
 PHT.needsUpdate=true;}
const BILLS14=[];for(let i=0;i<9;i++){const b=MNY.note(100,{curve:.01});b.scale.setScalar(.9);scene.add(b);b.visible=false;BILLS14.push(b);}
const DOWN14=CK.icon('down',{color:'#ff2a2a',size:.17});scene.add(DOWN14);
function mike14(t){const P=MIKE;P.g.visible=true;relax(P);idle(P,t,1.3);
 const turn=sm(tWhat2-.15,tWhat2+.3,t);P.g.position.copy(MKP14);P.g.rotation.y=Math.PI*(1-turn)+(turn<1?0:0);
 if(!MKA){const r=P.g.rotation.y;P.g.rotation.y=0;P.g.updateMatrixWorld(true);MKA={ph:solveReach(P,'L',MKP14.clone().add(V3(.1,1.12,.3)))};relax(P);P.g.rotation.y=r;}
 // flinch on the button, hands up on the hit, then the phone comes up in front of his chest
 const fl=sm(tButton-.05,tButton+.2,t)*(1-sm(tButton+.5,tButton+.9,t)),hit=sm(tHit,tHit+.2,t)*(1-turn);
 pose(P,'spine03',-.12*fl,0,0);pose(P,'head',-.15*fl+.1*hit,0,0);
 if(hit>0){arm(P,'R',AD[0]+.4*hit,AD[2]-1.1*hit,1.5*hit);arm(P,'L',AD[0]+.4*hit,AD[2]-1.1*hit,1.5*hit);}
 const ph=sm(tWhat2,tWhat2+.35,t);if(ph>0){setA(P,'L',lerpA(REST,MKA.ph,ph));curl(P,'L',.6,.5);}
 const fear=sm(tHap,tHap+.3,t);if(fear>0){arm(P,'R',AD[0]+.5*fear,AD[2]-.6*fear,1.9*fear);pose(P,'head',.18*fear,.12*Math.sin(t*5)*fear,0);}   // right hand to his head, head shakes slowly
 P.g.updateMatrixWorld(true);
 PHONE.visible=ph>.05;if(PHONE.visible){const w=P.BN.wristL.getWorldPosition(V3()),q=P.g.getWorldQuaternion(new THREE.Quaternion());
  PHONE.position.copy(w).add(V3(-.03,.12,.06).applyQuaternion(q));PHONE.quaternion.copy(q);PHONE.rotateX(-.2);PHONE.scale.setScalar(1.7);
  const loss=12480*.42*sm(tYour-.1,tWallet+.45,t);phoneDraw(12480-loss,loss);}
 // $100 bills fly out of the phone and away (= his money leaving), crisp, real notes
 BILLS14.forEach((b,i)=>{const d=t-(tHap+.1+i*.09);b.visible=d>0&&PHONE.visible;if(!b.visible)return;const a=i*2.4;
  b.position.copy(PHONE.position).add(V3(Math.sin(a)*d*.55,.15+d*.75-d*d*.25,.15+d*.5));b.rotation.set(d*3+i,d*2+a,d*1.5);MNY.flutter&&MNY.flutter(b,t,i);});
 const da=pop(t,tYour,.3);DOWN14.visible=da>.01&&PHONE.visible;if(DOWN14.visible){CK.iconAnim(DOWN14,t,tYour,1e9,{pos:PHONE.position.clone().add(V3(.15,.1,.06).applyQuaternion(P.g.quaternion)),cam,spin:.3});}
 FK.update(P,t,{expr:[['doubt',.5*sm(tTrump,tTrump+.3,t)*(1-fl)],['shock',Math.max(.85*fl,.9*hit,.95*sm(tWhat2,tWhat2+.3,t))]],look:turn>.6?(t<tYour?cam.position:PHONE.position):t<tLaunch?BTN.position:MSL.visible?MSL.position:IRAN});}
let story14=()=>{};
function animate(t){updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;trump14(t);mike14(t);missile14(t);impact14(t);story14(t);}
// ---------------- camera (steady, no shake): over Mike's shoulder on the map -> chase the missile -> Iran -> whip to Mike + phone ----------------
const LF=(A,B,k)=>({pos:A.pos.map((v,i)=>v+(B.pos[i]-v)*k),look:A.look.map((v,i)=>v+(B.look[i]-v)*k),fov:A.fov+(B.fov-A.fov)*k});
mike14(0);trump14(0);
const TRB=CK.box([TRP.x-.35,US_Y,TRP.z-.25],[TRP.x+.35,US_Y+1.95,TRP.z+.6]);
const S1A=CK.overShoulder(MIKE,[TRP.x,US_Y+1.2,TRP.z],{side:1,back:1.25,out:.55,up:.3,fov:40,top:.1,fit:[TRB,CK.box([LBL_USA.position.x-.2,US_Y,LBL_USA.position.z-.6],[LBL_USA.position.x+.2,US_Y+.1,LBL_USA.position.z+.6])]});
const S1B=CK.fit([TRB,CK.box([PED.x-.25,US_Y,PED.z-.2],[PED.x+.25,US_Y+1.05,PED.z+.2])],{dir:[.35,.35,1],fov:36,top:.1});
const IRF={pos:IRAN.clone().add(V3(1.2,2.8,3.8)).toArray(),look:IRAN.clone().add(V3(0,.35,0)).toArray(),fov:40},IRF2={pos:IRAN.clone().add(V3(1.0,2.2,3.6)).toArray(),look:IRAN.clone().add(V3(0,.85,0)).toArray(),fov:40};
function chase(t){const u=uM(t),p=ARC.getPoint(u),tg=ARC.getTangent(Math.min(u,.98));const fl=tg.clone().setY(0).normalize();
 const pos=p.clone().addScaledVector(fl,-2.8).add(V3(1.4,1.6,0)),look=p.clone().addScaledVector(fl,.35).add(V3(0,-.15,0));return {pos:pos.toArray(),look:look.toArray(),fov:42};}
mike14(tYour+.2);const MKB=CK.box([MKP14.x-.3,US_Y+.9,MKP14.z-.1],[MKP14.x+.3,US_Y+1.85,MKP14.z+.45]);
const MF1=CK.fit([MKB,CK.box([MKP14.x-.1,US_Y+1.0,MKP14.z+.3],[MKP14.x+.45,US_Y+2.15,MKP14.z+.6])],{dir:[.4,.1,1],fov:36,top:.06}),MF2=CK.fit([CK.box([MKP14.x-.3,US_Y+.95,MKP14.z],[MKP14.x+.42,US_Y+1.95,MKP14.z+.5])],{dir:[.35,.08,1],fov:34,top:.06});
mike14(0);
window.CAM14=t=>{
 if(t<tLaunch)return LF(S1A,S1B,sm(0,tLaunch,t));
 if(t<tHit){const c=chase(t),k=sm(tLaunch,tLaunch+.35,t),e=sm(tLaunch+(tHit-tLaunch)*.6,tHit,t);return LF(LF(S1B,c,k),IRF,e);}
 if(t<tWhat2-.05)return LF(IRF,IRF2,sm(tHit,tWhat2,t));
 const w=sm(tWhat2-.05,tWhat2+.22,t);if(w<1)return LF(IRF2,MF1,w*w*(3-2*w));   // fast whip back to the US
 return LF(MF1,MF2,sm(tWhat2+.22,HOOK_END,t));};
window.CAM14_END=HOOK_END;
window.HOOK14={tLaunch,tHit,tWhat2,HOOK_END};
