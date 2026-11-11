// ================= EP14 HOOK v2: "What if Trump pressed the button and dropped a nuclear bomb on Iran? What happens to your wallet?" =================
// User 2026-11-05 (v2, with 3 TikTok map references): ONLY Trump on the map; the REAL US + Iran flags fill the country shapes (white outline);
// bright blue sea + beige land (reference "Ducklings"); Trump's face close-up as he presses the button; a better missile (smoke puffs) and a
// stylized mushroom cloud. Mike is NOT in the hook: he enters at the start of the story ("What happens to your wallet?").
// Steady camera, no DoF / motion blur / grain (EP13 rules). Map = Natural Earth 110m GeoJSON (assets/world-110m.json). Facing EAST = -z, north = -x.
const W14=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tTrump=W14('trump'),tPress=W14('pressed'),tButton=W14('button'),tDrop=W14('dropped'),tNuc=W14('nuclear'),tBomb=W14('bomb'),tIran=W14('iran'),
 tWhat2=W14('what',1),tHap=W14('happens'),tYour=W14('your'),tWallet=W14('wallet'),tMeet14=W14('meet');
const tLaunch=tButton+.15,tHit=Math.max(tIran+.05,tLaunch+1.0),HOOK_END=tMeet14+1.2;
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;
const SEA=0x2a7be4;scene.background=new THREE.Color(SEA);scene.fog=new THREE.Fog(SEA,40,120);
// ---------------- flags (canvas, real proportions) ----------------
function usFlag(){return tex(1140,600,x=>{const W=1140,H=600,h=H/13;for(let i=0;i<13;i++){x.fillStyle=i%2?'#ffffff':'#b22234';x.fillRect(0,i*h,W,h+1);}
 const cw=W*.4,ch=h*7;x.fillStyle='#3c3b6e';x.fillRect(0,0,cw,ch);x.fillStyle='#fff';
 const star=(cx,cy,r)=>{x.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.382:r;x.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}x.fill();};
 for(let r=0;r<9;r++){const n=r%2?5:6;for(let c=0;c<n;c++)star(cw/12*(2*c+1+(r%2)),ch/10*(r+1),ch*.035);}});}
function irFlag(){return tex(1050,600,x=>{const W=1050,H=600,b=H/3;x.fillStyle='#239f40';x.fillRect(0,0,W,b);x.fillStyle='#fff';x.fillRect(0,b,W,b);x.fillStyle='#da0000';x.fillRect(0,2*b,W,b+1);
 // takbir bands (stylized Kufic glyphs, 11 on each edge of the white band)
 const glyph=(gx,gy,c)=>{x.fillStyle=c;const u=7;[[0,0,6,1],[0,0,1,3],[2,1,1,2],[4,0,1,3],[2,2,3,1],[5,1,1,2]].forEach(([a,bb,w,h])=>x.fillRect(gx+a*u,gy+bb*u,w*u,h*u));};
 for(let i=0;i<22;i++){const gx=12+i*(W-24)/22;glyph(gx,b-26,'#ffffff');glyph(gx,2*b+4,'#ffffff');}
 // red emblem: four crescents + central sword
 const cx=W/2,cy=H/2;x.strokeStyle='#da0000';x.fillStyle='#da0000';x.lineCap='round';
 x.lineWidth=13;x.beginPath();x.arc(cx,cy-4,74,Math.PI*.62,Math.PI*1.32);x.stroke();x.beginPath();x.arc(cx,cy-4,74,-Math.PI*.32,Math.PI*.38);x.stroke();
 x.lineWidth=10;x.beginPath();x.arc(cx,cy-4,46,Math.PI*.6,Math.PI*1.36);x.stroke();x.beginPath();x.arc(cx,cy-4,46,-Math.PI*.36,Math.PI*.4);x.stroke();
 x.beginPath();x.moveTo(cx-7,cy-58);x.lineTo(cx+7,cy-58);x.lineTo(cx+5,cy+70);x.lineTo(cx,cy+84);x.lineTo(cx-5,cy+70);x.fill();x.beginPath();x.arc(cx,cy-72,9,0,7);x.fill();});}
// ---------------- the map (beige land, blue sea, thin borders; US + Iran filled with their flags + white outline) ----------------
const MO=V3(400,0,400),S14=.1,LONC=-20,LATC=35,US_Y=.185;
const mxz=(lon,lat,y=US_Y)=>V3(MO.x-(lat-LATC)*S14,y,MO.z-(lon-LONC)*S14);
const MAPG=new THREE.Group();MAPG.position.copy(MO);scene.add(MAPG);
{const o=add(new THREE.PlaneGeometry(90,90),new THREE.MeshBasicMaterial({color:SEA,toneMapped:false}),0,.012,0,MAPG,false);o.rotation.x=-Math.PI/2;}
const GEO=await (await fetch('assets/world-110m.json')).json();
const LANDM=new THREE.MeshBasicMaterial({color:0xf0d29c,toneMapped:false}),SIDEM=new THREE.MeshBasicMaterial({color:0xb08a58,toneMapped:false}),HIS=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),
 EDGEW=new THREE.LineBasicMaterial({color:0xffffff}),EDGED=new THREE.LineBasicMaterial({color:0x9a7a4e});
const flagMat=t=>{t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;return new THREE.MeshBasicMaterial({map:t,toneMapped:false});};
const USFM=flagMat(usFlag()),IRFM=flagMat(irFlag());
const toV=([lo,la])=>new THREE.Vector2(-(la-LATC)*S14,(lo-LONC)*S14);
const C14={};
for(const f of GEO.features){const nm=f.properties.name;if(nm==='Antarctica')continue;
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 const shapes=polys.map(p=>{const s=new THREE.Shape(p[0].map(toV));for(const h of p.slice(1))s.holes.push(new THREE.Path(h.map(toV)));return s;});
 const hi=nm==='United States of America'?'us':nm==='Iran'?'ir':null;
 const g=new THREE.ExtrudeGeometry(shapes,{depth:hi?.17:.05,bevelEnabled:false});
 if(hi){// flag UVs from the main polygon's box, NORTH-UP (camera sits south of the map): u = west->east, v = south->north
  const main=polys.reduce((a,p)=>p[0].length>a[0].length?p:a),pv=main[0].map(toV),sx0=Math.min(...pv.map(v=>v.x)),sx1=Math.max(...pv.map(v=>v.x)),sy0=Math.min(...pv.map(v=>v.y)),sy1=Math.max(...pv.map(v=>v.y));
  const pa=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pa.count;i++)uv.setXY(i,(pa.getY(i)-sy0)/(sy1-sy0),(sx1-pa.getX(i))/(sx1-sx0));uv.needsUpdate=true;}
 const m=new THREE.Mesh(g,hi==='us'?[USFM,HIS]:hi==='ir'?[IRFM,HIS]:[LANDM,SIDEM]);m.rotation.x=-Math.PI/2;m.position.y=.015;m.receiveShadow=true;m.castShadow=false;MAPG.add(m);
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,40),hi?EDGEW:EDGED);e.rotation.x=-Math.PI/2;e.position.y=hi?.017:.016;MAPG.add(e);if(hi)C14[hi]=m;}
const IRAN=mxz(53.5,32.5,.185);
// white bold country names lying on the map (like the references), dark side for contrast
const flatTxt=(s,size,p,col=WHT)=>{const g=new THREE.Group();scene.add(g);g.position.copy(p);g.rotation.y=Math.PI/2;const m=txt3(s,size,col,g);m.rotation.x=-Math.PI/2;return g;};
const LBL_USA=flatTxt('USA',.55,mxz(-100,31,US_Y+.01)),LBL_IR=flatTxt('IRAN',.42,mxz(51,23.5,.07),0x0b1a3d);
// ---------------- Trump + the button pedestal ----------------
const TRP=mxz(-79,38.5),PED=TRP.clone().add(V3(.4,0,.13));
const STRIPE=tex(256,512,x=>{x.fillStyle='#ffc61a';x.fillRect(0,0,256,512);x.fillStyle='#111';for(let i=-4;i<12;i++){x.beginPath();x.moveTo(0,i*64);x.lineTo(256,i*64+128);x.lineTo(256,i*64+160);x.lineTo(0,i*64+32);x.fill();}
 x.fillStyle='#111';x.fillRect(28,150,200,200);x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,86,0,7);x.fill();x.fillStyle='#111';
 for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,250);x.arc(128,250,78,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,17,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,250,11,0,7);x.fill();});
const PEDG=new THREE.Group();PEDG.position.copy(PED);scene.add(PEDG);add(B(.36,.92,.3),new THREE.MeshStandardMaterial({map:STRIPE,roughness:.55}),0,.46,0,PEDG);add(B(.44,.05,.38),M(0x1a1a1a,.4,.3),0,.945,0,PEDG);
const BTN=add(new THREE.SphereGeometry(.075,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe01010,roughness:.25,emissive:0xff0000,emissiveIntensity:.2}),PED.x,PED.y+.97,PED.z);
const BTN_TOP=V3(PED.x,PED.y+1.03,PED.z);
const BTNR=add(new THREE.RingGeometry(.8,1,48),new THREE.MeshBasicMaterial({color:new THREE.Color(3,.4,.3),toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:false}),PED.x,PED.y+1.0,PED.z,scene,false);BTNR.rotation.x=-Math.PI/2;BTNR.visible=false;
// ---------------- missile (white body, red nose, black bands, fins, glowing flame) + smoke puffs ----------------
function missile2(){const g=new THREE.Group(),wh=M(0xf4f4f4,.35,.2),rd=M(0xd21e2a,.35,.2),bk=M(0x1c1c1c,.4,.3);
 add(CY(.075,.075,.95,24),wh,0,0,0,g);add(new THREE.ConeGeometry(.075,.3,24),rd,0,.625,0,g);
 for(const y of [.28,-.2])add(CY(.077,.077,.06,24),bk,0,y,0,g);
 add(CY(.06,.075,.08,20),bk,0,-.515,0,g);
 for(let i=0;i<4;i++){const f=new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(.14,-.05),new THREE.Vector2(.14,-.2),new THREE.Vector2(0,-.16)]),{depth:.012,bevelEnabled:false}),rd);
  f.geometry.translate(.07,-.27,-.006);f.rotation.y=i*Math.PI/2;g.add(f);}
 const fl=add(new THREE.ConeGeometry(.07,.42,16),new THREE.MeshBasicMaterial({color:new THREE.Color(3,1.6,.35),toneMapped:false}),0,-.77,0,g,false);fl.rotation.x=Math.PI;g.userData.flame=fl;
 const core=add(new THREE.ConeGeometry(.04,.22,12),new THREE.MeshBasicMaterial({color:new THREE.Color(3,3,2.4),toneMapped:false}),0,-.65,0,g,false);core.rotation.x=Math.PI;return g;}
const LP=mxz(-81,36.4,US_Y),AP1=LP.clone().lerp(IRAN,.5).add(V3(0,4.2,0));
const ARC=new THREE.QuadraticBezierCurve3(LP,AP1,IRAN.clone().add(V3(0,.15,0)));
const MSL=missile2();MSL.scale.setScalar(1.25);scene.add(MSL);MSL.visible=false;
const NP=140,PUFF=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,2),new THREE.MeshStandardMaterial({color:0xf1f1f1,roughness:.95}),NP);PUFF.castShadow=false;scene.add(PUFF);
const SILO=add(CY(.16,.18,.06,24),M(0x2a2a2a,.5,.4),LP.x,US_Y+.03,LP.z);
const uM=t=>{const k=Math.min(1,Math.max(0,(t-tLaunch)/(tHit-tLaunch)));return Math.pow(k,1.35);};
const _pm=new THREE.Object3D();
function missile14(t){const u=uM(t),on=t>=tLaunch&&t<tHit;MSL.visible=on;
 if(on){ARC.getPoint(u,MSL.position);MSL.quaternion.setFromUnitVectors(V3(0,1,0),ARC.getTangent(Math.min(u,.999)));MSL.userData.flame.scale.y=1+.18*Math.sin(t*40);}
 const fade=1-sm(tHit+.3,tHit+1.4,t);let n=0;
 for(let i=0;i<NP;i++){const ui=i/NP*.97;if(t<tLaunch||ui>u-.012||fade<=0)continue;const age=(u-ui)*(tHit-tLaunch);
  ARC.getPoint(ui,_pm.position);_pm.position.x+=Math.sin(i*7.3)*.03;_pm.position.y+=Math.sin(i*3.1)*.02;_pm.scale.setScalar((.05+Math.min(.11,age*.09))*fade*(1+.25*Math.sin(i*5.7)));_pm.updateMatrix();PUFF.setMatrixAt(n++,_pm.matrix);}
 PUFF.count=n;PUFF.instanceMatrix.needsUpdate=true;}
// ---------------- nuclear blast: flash -> fireball -> stem + cap (stylized mushroom cloud) + dust ring ----------------
const BLAST=new THREE.Group();BLAST.position.copy(IRAN);scene.add(BLAST);
const BM=(c,o={})=>new THREE.MeshBasicMaterial(Object.assign({color:c,toneMapped:false},o));
const SMOKEM=new THREE.MeshStandardMaterial({color:0x3f3b3a,roughness:1,envMapIntensity:.08,emissive:0xff3c00,emissiveIntensity:0}),
 HOTM=BM(new THREE.Color(2.4,1.25,.25)),COREM=BM(new THREE.Color(3,2.6,1.4)),ORM=BM(0xff5a12);
const FLASH=add(new THREE.SphereGeometry(1,32,16),BM(new THREE.Color(3,3,2.6),{transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),0,.2,0,BLAST,false);
const SHOCK14=add(new THREE.RingGeometry(.9,1,96),BM(new THREE.Color(2.2,1.6,1),{transparent:true,side:THREE.DoubleSide,depthWrite:false}),0,.05,0,BLAST,false);SHOCK14.rotation.x=-Math.PI/2;
const BASEF=add(new THREE.SphereGeometry(.5,32,16),HOTM,0,0,0,BLAST,false);BASEF.scale.set(1,.45,1);
const STEM=add(CY(.17,.3,1,28),SMOKEM,0,.5,0,BLAST,false);const STEMH=add(CY(.12,.2,1,24),ORM,0,.5,0,BLAST,false);
const CAP=new THREE.Group();BLAST.add(CAP);
const CAPS=[];const capS=(r,x,y,z,m=SMOKEM)=>{const o=add(new THREE.IcosahedronGeometry(r,3),m,x,y,z,CAP,false);CAPS.push(o);return o;};
capS(.5,0,.05,0).scale.set(1.15,.7,1.15);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;capS(.2+.04*Math.sin(i*3.3),Math.cos(a)*.55,-.05+.05*Math.sin(i*2.1),Math.sin(a)*.55);}
for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.4;capS(.2,Math.cos(a)*.25,.3,Math.sin(a)*.25);}
const RIM14=add(new THREE.TorusGeometry(.48,.16,16,48),HOTM,0,-.2,0,CAP,false);RIM14.rotation.x=Math.PI/2;   // glowing underside of the cap
const CORE=add(new THREE.SphereGeometry(.3,24,16),COREM,0,0,0,CAP,false);
const DUST14=add(new THREE.TorusGeometry(1,.12,12,64),new THREE.MeshStandardMaterial({color:0x8f7a68,roughness:1}),0,.08,0,BLAST,false);DUST14.rotation.x=Math.PI/2;
function impact14(t){const d=t-tHit;BLAST.visible=d>0;if(d<=0)return;
 FLASH.visible=d<.45;FLASH.scale.setScalar(.15+.5*sm(0,.15,d));FLASH.material.opacity=1-sm(.1,.45,d);
 SHOCK14.visible=d<1.2;SHOCK14.scale.setScalar(.3+3.2*sm(0,.6,d));SHOCK14.material.opacity=1-sm(.25,.7,d);
 const grow=sm(.02,.55,d),hgt=.3+2.3*grow,hot=1-sm(.3,1.6,d);
 const hb=1-sm(.15,.6,d);BASEF.scale.set(.5+.5*grow,.3+.2*grow,.5+.5*grow).multiplyScalar(Math.max(.01,hb));BASEF.visible=hb>.03;
 STEM.scale.set(.7+.6*grow,hgt,.7+.6*grow);STEM.position.y=hgt/2;STEMH.scale.set(.7+.5*grow,hgt*.85,.7+.5*grow);STEMH.position.y=hgt*.42;STEMH.visible=hot>.15;
 CAP.position.y=hgt+.1;CAP.scale.setScalar(.4+1.25*grow+.03*Math.sin(d*2));CAP.rotation.y=d*.3;
 CORE.scale.setScalar(.4+.9*hot);CORE.visible=hot>.05;RIM14.scale.setScalar(.8+.3*grow);
 SMOKEM.emissiveIntensity=.3*hot*hot;
 DUST14.visible=false;}
// ---------------- Trump presses the button ----------------
let TRA14=null;
function trump14(t){const P=TR;const tv=t<HOOK_END-.6;P.g.visible=tv;PEDG.visible=BTN.visible=SILO.visible=tv;relax(P);idle(P,t,.6);P.g.position.copy(TRP);P.g.rotation.y=Math.PI/2;
 if(!TRA14){P.g.updateMatrixWorld(true);TRA14={hov:solveReach(P,'R',BTN_TOP.clone().add(V3(-.05,.5,0)))};relax(P);pose(P,'spine03',.28,0,0);pose(P,'spine02',.12,0,0);P.g.updateMatrixWorld(true);TRA14.prs=solveReach(P,'R',BTN_TOP.clone().add(V3(-.01,.05,0)));relax(P);}
 const up=sm(tPress-.2,tPress+.2,t),dn=sm(tButton-.12,tButton,t),rel=sm(tLaunch+.35,tLaunch+.7,t);const lean=dn*(1-rel);pose(P,'spine03',.28*lean,0,0);pose(P,'spine02',.12*lean,0,0);
 setA(P,'R',rel>0?lerpA(TRA14.prs,TRA14.hov,rel):lerpA(lerpA(REST,TRA14.hov,up),TRA14.prs,dn));curl(P,'R',.7,.4);
 if(rel>0){pose(P,'head',-.35*rel,0,0);arm(P,'L',AD[0]+.3*rel,AD[2]-.9*rel,.6*rel);}   // he looks up and points at the missile
 BTN.position.y=PED.y+.97-.03*dn*(1-rel);BTN.material.emissiveIntensity=.2+4*dn*(1-sm(tButton+.3,tButton+.8,t))+.6*dn;BTNR.visible=t>tButton&&t<tButton+.5;if(BTNR.visible){const k=sm(tButton,tButton+.5,t);BTNR.scale.setScalar(.1+.35*k);BTNR.material.opacity=1-k;}
 face(P,{jaw:t<tLaunch?.03+.035*Math.abs(Math.sin(t*9)):.02,smile:.25+.35*rel});
 FK.update(P,t,{expr:[['doubt',.5*(1-dn)],['joy',.45*dn]],look:t<tPress?cam.position:rel>.3?MSL.position:BTN.position});}
const MKP14=mxz(-109,40.5),MKR=Math.PI/2;   // faces SOUTH (+x) = the camera
const SAFE14=new THREE.Group();scene.add(SAFE14);SAFE14.position.copy(MKP14).add(V3(-.05,0,.6));SAFE14.rotation.y=-1.3;SAFE14.scale.setScalar(.85);
{const gm=M(0x3c4046,.4,.7),gi=M(0x23262b,.8,.3);add(B(.7,.8,.05),gm,0,.4,.275,SAFE14);add(B(.05,.8,.6),gm,-.325,.4,0,SAFE14);add(B(.05,.8,.6),gm,.325,.4,0,SAFE14);add(B(.7,.05,.6),gm,0,.775,0,SAFE14);add(B(.7,.05,.6),gm,0,.025,0,SAFE14);add(B(.6,.02,.55),gi,0,.27,0,SAFE14);add(B(.6,.02,.55),gi,0,.5,0,SAFE14);   // hollow: open front (-z), two shelves

 const dr=new THREE.Group();dr.position.set(.35,.4,-.3);SAFE14.add(dr);add(B(.62,.72,.06),gm,-.31,0,-.03,dr);add(CY(.07,.07,.04,20),M(0xc9a640,.3,1),-.31,0,-.07,dr).rotation.x=Math.PI/2;dr.rotation.y=1.9;
 for(let k=0;k<3;k++){const br=MNY.brick(100,{nx:2,ny:5,nz:2,glow:.25});const bb=new THREE.Box3().setFromObject(br),sz=bb.getSize(V3());br.scale.setScalar(Math.min(.54/sz.x,.2/sz.y,.48/sz.z));br.position.set(0,.13+k*.235,0);SAFE14.add(br);}}
const FAN14=MNY.fan(100,7,{spread:.85,glow:.09});FAN14.scale.setScalar(1.15);scene.add(FAN14);{const f2=MNY.fan(100,7,{spread:.85,glow:.09});f2.rotation.y=Math.PI;f2.position.z=-.003;FAN14.add(f2);}
const DOWN14=CK.icon('down',{color:'#ff2a2a',size:.22});scene.add(DOWN14);
let MKA14=null;
function mike14(t){const P=MIKE,on=t>=tWhat2-.1;P.g.visible=on;SAFE14.visible=FAN14.visible=on;LBL_USA.visible=!on;if(!on){DOWN14.visible=false;return;}
 relax(P);P.g.position.copy(MKP14);P.g.rotation.y=MKR;
 if(t>=tMeet14-.15){FAN14.visible=false;DOWN14.visible=false;return;}
 if(!MKA14){P.g.updateMatrixWorld(true);MKA14={hug:solveReach(P,'R',MKP14.clone().add(V3(.3,1.2,.1)))};relax(P);MKA14.face=solveReach(P,'L',MKP14.clone().add(V3(.16,1.58,-.08)));relax(P);}
 const k=sm(tWhat2-.1,tWhat2+.25,t),sh=Math.sin(t*38)*.02*k;   // trembling
 pose(P,'spine03',-.06*k,0,sh);pose(P,'head',.05*k,.18*Math.sin(t*4.5)*k,sh*1.5);
 setA(P,'R',lerpA(REST,MKA14.hug,k));curl(P,'R',.75,.55);setA(P,'L',lerpA(REST,MKA14.face,sm(tHap,tHap+.25,t)));curl(P,'L',.3,.2);
 pose(P,'upperleg01L',.04*k,0,0);pose(P,'upperleg01R',-.04*k,0,0);
 P.g.updateMatrixWorld(true);const fb=P.BN['finger3-1R']||P.BN.wristR;fb.getWorldPosition(FAN14.position);fb.getWorldQuaternion(FAN14.quaternion);FAN14.rotateY(Math.PI);FAN14.rotateZ(Math.PI/2);
 face(P,{jaw:.06+.04*Math.abs(Math.sin(t*9)),smile:0});
 FK.update(P,t,{expr:[['shock',.95*k]],look:t<tYour?IRAN:cam.position});
 CK.iconAnim(DOWN14,t,tWallet-.05,1e9,{pos:FAN14.position.clone().add(V3(.12,.12,-.3)),cam,spin:.3});}
const WF14=document.createElement('div');WF14.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF14);
let story14=()=>{};
function animate(t){sun.intensity=2.2;WF14.style.opacity=String(Math.max(0,1-Math.abs(t-tWhat2)/.14)*.95);updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;trump14(t);mike14(t);missile14(t);impact14(t);story14(t);}
// ---------------- camera (steady, NORTH-UP like a real map): USA + flag + Trump -> his face -> hand on the button -> chase the missile east -> the blast ----------------
const LF=(A,B,k)=>({pos:A.pos.map((v,i)=>v+(B.pos[i]-v)*k),look:A.look.map((v,i)=>v+(B.look[i]-v)*k),fov:A.fov+(B.fov-A.fov)*k});
trump14(0);
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const USB=gbox(-124,26,-68,48.5,0,.2),TRB=CK.box([TRP.x-.3,US_Y,TRP.z-.35],[TRP.x+.7,US_Y+2.05,TRP.z+.35]);
const WIDE=CK.fit([gbox(-108,27,-68,47,0,.2),TRB],{dir:[1,1.4,0],fov:40,top:.05}),WIDE2=CK.fit([TRB],{dir:[1,.75,.05],fov:36,top:.06});
trump14(tPress);const FACE=CK.closeUp(TR,{dist:1.35,fov:30,dy:-.1});
trump14(tButton);const HAND=CK.fit([CK.box([PED.x-.2,PED.y+.85,PED.z-.22],[PED.x+.2,PED.y+1.2,PED.z+.22]),CK.box([TRP.x-.2,US_Y+.9,TRP.z-.3],[TRP.x+.35,US_Y+2.25,TRP.z+.35])],{dir:[1,.4,.35],fov:36,top:.05});
mike14(tWallet);const MKB14=CK.box([MKP14.x-.25,US_Y,MKP14.z-.35],[MKP14.x+.4,US_Y+1.95,MKP14.z+.95]);
const MF1=CK.fit([MKB14],{dir:[1,.3,-.12],fov:36,top:.05}),MF2=CK.fit([MKB14],{dir:[1,.28,-.1],fov:36,top:.05,slack:.88});mike14(0);
trump14(0);
const IRB=gbox(44,25,63.5,40,0,4.1);
const IRF=CK.fit([IRB],{dir:[1,.85,.04],fov:40,top:.04}),IRF2=CK.fit([IRB],{dir:[1,.8,.03],fov:40,top:.04,slack:.96});
function chase(t){const u=uM(t),p=ARC.getPoint(u);return {pos:p.clone().add(V3(3.4,2.6,1.3)).toArray(),look:p.clone().add(V3(0,-.05,-.15)).toArray(),fov:42};}
window.CAM14=t=>{
 if(t<tTrump)return LF(WIDE,WIDE2,sm(0,tTrump,t)*.35);
 if(t<tPress)return LF(LF(WIDE,WIDE2,.35),FACE,sm(tTrump,tPress,t));
 if(t<tPress+.12)return FACE;
 if(t<tLaunch+.1)return LF(FACE,HAND,sm(tPress+.12,tPress+.4,t));
 if(t<tHit){const c=chase(t),k=sm(tLaunch+.1,tLaunch+.45,t),e=sm(tLaunch+(tHit-tLaunch)*.8,tHit+.15,t);return LF(LF(HAND,c,k),IRF,e);}
 if(t<tWhat2-.08)return LF(IRF,IRF2,sm(tHit,tWhat2,t));
 if(t<tWhat2)return IRF2;   // white flash covers the change of scene (no empty frames)
 return LF(MF1,MF2,sm(tWhat2,HOOK_END,t));};
window.CAM14_END=HOOK_END;
window.HOOK14={tLaunch,tHit,tWhat2,HOOK_END};
