// ================= EP14 HOOK v2: "What if Trump pressed the button and dropped a nuclear bomb on Iran? What happens to your wallet?" =================
// User 2026-11-05 (v2, with 3 TikTok map references): ONLY Trump on the map; the REAL US + Iran flags fill the country shapes (white outline);
// bright blue sea + beige land (reference "Ducklings"); Trump's face close-up as he presses the button; a better missile (smoke puffs) and a
// stylized mushroom cloud. Mike is NOT in the hook: he enters at the start of the story ("What happens to your wallet?").
// Steady camera, no DoF / motion blur / grain (EP13 rules). Map = Natural Earth 110m GeoJSON (assets/world-110m.json). Facing EAST = -z, north = -x.
const W14=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tTrump=W14('trump'),tPress=W14('pressed'),tButton=W14('button'),tDrop=W14('dropped'),tNuc=W14('nuclear'),tBomb=W14('bomb'),tIran=W14('iran'),
 tWhat2=W14('what',1),tHap=W14('happens'),tYour=W14('your'),tWallet=W14('wallet');
const tLaunch=tButton+.15,tHit=Math.max(tIran+.05,tLaunch+1.0),HOOK_END=tWallet+.6;
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;MIKE.g.visible=false;
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
const MO=V3(400,0,400),S14=.1,LONC=-20,LATC=35,US_Y=.105;
const mxz=(lon,lat,y=US_Y)=>V3(MO.x-(lat-LATC)*S14,y,MO.z-(lon-LONC)*S14);
const MAPG=new THREE.Group();MAPG.position.copy(MO);scene.add(MAPG);
{const o=add(new THREE.PlaneGeometry(90,90),new THREE.MeshBasicMaterial({color:SEA,toneMapped:false}),0,.012,0,MAPG,false);o.rotation.x=-Math.PI/2;}
const GEO=await (await fetch('assets/world-110m.json')).json();
const LANDM=new THREE.MeshStandardMaterial({color:0xd6ad72,roughness:1,envMapIntensity:.15}),SIDEM=new THREE.MeshStandardMaterial({color:0xc9a676,roughness:.9}),
 EDGEW=new THREE.LineBasicMaterial({color:0xffffff}),EDGED=new THREE.LineBasicMaterial({color:0x8c7150});
const flagMat=t=>{t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;return new THREE.MeshBasicMaterial({map:t,toneMapped:false});};
const USFM=flagMat(usFlag()),IRFM=flagMat(irFlag());
const toV=([lo,la])=>new THREE.Vector2(-(la-LATC)*S14,(lo-LONC)*S14);
const C14={};
for(const f of GEO.features){const nm=f.properties.name;if(nm==='Antarctica')continue;
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 const shapes=polys.map(p=>{const s=new THREE.Shape(p[0].map(toV));for(const h of p.slice(1))s.holes.push(new THREE.Path(h.map(toV)));return s;});
 const hi=nm==='United States of America'?'us':nm==='Iran'?'ir':null;
 const g=new THREE.ExtrudeGeometry(shapes,{depth:hi?.09:.05,bevelEnabled:false});
 if(hi){// flag UVs from the main polygon's box, oriented for a camera looking EAST: u = north->south (screen left->right), v = west->east (screen up)
  const main=polys.reduce((a,p)=>p[0].length>a[0].length?p:a),pv=main[0].map(toV),sx0=Math.min(...pv.map(v=>v.x)),sx1=Math.max(...pv.map(v=>v.x)),sy0=Math.min(...pv.map(v=>v.y)),sy1=Math.max(...pv.map(v=>v.y));
  const pa=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pa.count;i++)uv.setXY(i,(pa.getX(i)-sx0)/(sx1-sx0),(pa.getY(i)-sy0)/(sy1-sy0));uv.needsUpdate=true;}
 const m=new THREE.Mesh(g,hi==='us'?[USFM,SIDEM]:hi==='ir'?[IRFM,SIDEM]:[LANDM,SIDEM]);m.rotation.x=-Math.PI/2;m.position.y=.015;m.receiveShadow=true;m.castShadow=false;MAPG.add(m);
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,40),hi?EDGEW:EDGED);e.rotation.x=-Math.PI/2;e.position.y=hi?.017:.016;MAPG.add(e);if(hi)C14[hi]=m;}
const IRAN=mxz(53.5,32.5,.105);
// white bold country names lying on the map (like the references), dark side for contrast
const flatTxt=(s,size,p)=>{const m=txt3(s,size,WHT,scene);m.rotation.x=-Math.PI/2;m.position.copy(p);return m;};
const LBL_USA=flatTxt('USA',.42,mxz(-99,30.2,US_Y+.012)),LBL_IR=flatTxt('IRAN',.36,mxz(45.5,30.5,.03));
// ---------------- Trump + the button pedestal ----------------
const TRP=mxz(-77.5,39.2),PED=TRP.clone().add(V3(-.14,0,.46));
const STRIPE=tex(256,512,x=>{x.fillStyle='#ffc61a';x.fillRect(0,0,256,512);x.fillStyle='#111';for(let i=-4;i<12;i++){x.beginPath();x.moveTo(0,i*64);x.lineTo(256,i*64+128);x.lineTo(256,i*64+160);x.lineTo(0,i*64+32);x.fill();}
 x.fillStyle='#111';x.fillRect(28,150,200,200);x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,86,0,7);x.fill();x.fillStyle='#111';
 for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,250);x.arc(128,250,78,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,250,17,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,250,11,0,7);x.fill();});
const PEDG=new THREE.Group();PEDG.position.copy(PED);scene.add(PEDG);add(B(.36,.92,.3),new THREE.MeshStandardMaterial({map:STRIPE,roughness:.55}),0,.46,0,PEDG);add(B(.44,.05,.38),M(0x1a1a1a,.4,.3),0,.945,0,PEDG);
const BTN=add(new THREE.SphereGeometry(.075,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe01010,roughness:.25,emissive:0xff0000,emissiveIntensity:.2}),PED.x,PED.y+.97,PED.z);
const BTN_TOP=V3(PED.x,PED.y+1.03,PED.z);
// ---------------- missile (white body, red nose, black bands, fins, glowing flame) + smoke puffs ----------------
function missile2(){const g=new THREE.Group(),wh=M(0xf4f4f4,.35,.2),rd=M(0xd21e2a,.35,.2),bk=M(0x1c1c1c,.4,.3);
 add(CY(.075,.075,.95,24),wh,0,0,0,g);add(new THREE.ConeGeometry(.075,.3,24),rd,0,.625,0,g);
 for(const y of [.28,-.2])add(CY(.077,.077,.06,24),bk,0,y,0,g);
 add(CY(.06,.075,.08,20),bk,0,-.515,0,g);
 for(let i=0;i<4;i++){const f=new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(.14,-.05),new THREE.Vector2(.14,-.2),new THREE.Vector2(0,-.16)]),{depth:.012,bevelEnabled:false}),rd);
  f.geometry.translate(.07,-.27,-.006);f.rotation.y=i*Math.PI/2;g.add(f);}
 const fl=add(new THREE.ConeGeometry(.07,.42,16),new THREE.MeshBasicMaterial({color:new THREE.Color(3,1.6,.35),toneMapped:false}),0,-.77,0,g,false);fl.rotation.x=Math.PI;g.userData.flame=fl;
 const core=add(new THREE.ConeGeometry(.04,.22,12),new THREE.MeshBasicMaterial({color:new THREE.Color(3,3,2.4),toneMapped:false}),0,-.65,0,g,false);core.rotation.x=Math.PI;return g;}
const LP=mxz(-76.2,37.6,US_Y),AP1=LP.clone().lerp(IRAN,.5).add(V3(0,4.2,0));
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
const FIREM=new THREE.MeshStandardMaterial({color:0xffb347,roughness:.9,emissive:0xff7a1a,emissiveIntensity:2.5}),
 CLOUDM=new THREE.MeshStandardMaterial({color:0x9c8670,roughness:1,envMapIntensity:.2,emissive:0xff5a0a,emissiveIntensity:1.2});
const FLASH=add(new THREE.SphereGeometry(1,32,16),new THREE.MeshBasicMaterial({color:new THREE.Color(2.6,2.4,1.8),toneMapped:false,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),0,.1,0,BLAST,false);
const STEM=add(CY(.13,.24,1,24,1,true),CLOUDM,0,.5,0,BLAST,false);
const CAP=new THREE.Group();BLAST.add(CAP);
add(new THREE.SphereGeometry(.5,32,16),CLOUDM,0,0,0,CAP,false).scale.set(1,.62,1);
add(new THREE.TorusGeometry(.42,.2,16,40),CLOUDM,0,-.12,0,CAP,false).rotation.x=Math.PI/2;
for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(new THREE.SphereGeometry(.17,16,12),CLOUDM,Math.cos(a)*.5,.02+.06*Math.sin(i*2.1),Math.sin(a)*.5,CAP,false);}
const FIRE=add(new THREE.SphereGeometry(.32,32,16),FIREM,0,0,0,CAP,false);
const DUST14=add(new THREE.TorusGeometry(1,.05,10,64),new THREE.MeshStandardMaterial({color:0xd9c2a0,roughness:.95,emissive:0x7a3a10,emissiveIntensity:.6}),0,.06,0,BLAST,false);DUST14.rotation.x=Math.PI/2;
function impact14(t){const d=t-tHit;BLAST.visible=d>0;if(d<=0)return;
 FLASH.visible=d<.55;FLASH.scale.setScalar(.12+.45*sm(0,.18,d));FLASH.material.opacity=1-sm(.12,.55,d);
 const grow=sm(.05,1.5,d),hgt=.25+1.75*grow;
 STEM.scale.set(.6+.5*grow,hgt,.6+.5*grow);STEM.position.y=hgt/2;
 CAP.position.y=hgt+.05;CAP.scale.setScalar(.35+.85*grow+.04*Math.sin(d*2));CAP.rotation.y=d*.25;
 FIRE.scale.setScalar(1-sm(.3,1.6,d)*.75);FIREM.emissiveIntensity=2.5*(1-sm(.6,2.2,d))+.3;
 CLOUDM.emissiveIntensity=1.6*(1-sm(.6,3,d))+.12;
 DUST14.scale.setScalar(.2+.9*sm(0,1.3,d));
 }
// ---------------- Trump presses the button ----------------
let TRA14=null;
function trump14(t){const P=TR;P.g.visible=true;relax(P);idle(P,t,.6);P.g.position.copy(TRP);P.g.rotation.y=0;
 if(!TRA14){P.g.updateMatrixWorld(true);TRA14={hov:solveReach(P,'R',BTN_TOP.clone().add(V3(0,.16,-.02)))};relax(P);TRA14.prs=solveReach(P,'R',BTN_TOP.clone().add(V3(0,.03,-.01)));relax(P);}
 const up=sm(tTrump-.2,tTrump+.25,t),dn=sm(tButton-.18,tButton,t),rel=sm(tLaunch+.35,tLaunch+.7,t);
 setA(P,'R',rel>0?lerpA(TRA14.prs,TRA14.hov,rel):lerpA(lerpA(REST,TRA14.hov,up),TRA14.prs,dn));curl(P,'R',.7,.4);
 if(rel>0){pose(P,'head',-.35*rel,0,0);arm(P,'L',AD[0]+.3*rel,AD[2]-.9*rel,.6*rel);}   // he looks up and points at the missile
 BTN.position.y=PED.y+.97-.025*dn*(1-rel);BTN.material.emissiveIntensity=.2+2.8*dn;
 face(P,{jaw:t<tLaunch?.03+.035*Math.abs(Math.sin(t*9)):.02,smile:.25+.35*rel});
 FK.update(P,t,{expr:[['doubt',.5*(1-dn)],['joy',.45*dn]],look:t<tPress?cam.position:rel>.3?MSL.position:BTN.position});}
let story14=()=>{};
function animate(t){sun.intensity=2.2;updPops(t);MK.g.visible=false;MIKE.g.visible=false;DEBT.visible=DFR.visible=false;trump14(t);missile14(t);impact14(t);story14(t);}
// ---------------- camera (steady): wide map with both flags -> Trump's face -> hand on the button -> chase the missile -> the blast ----------------
const LF=(A,B,k)=>({pos:A.pos.map((v,i)=>v+(B.pos[i]-v)*k),look:A.look.map((v,i)=>v+(B.look[i]-v)*k),fov:A.fov+(B.fov-A.fov)*k});
trump14(0);
const TRB=CK.box([TRP.x-.35,US_Y,TRP.z-.25],[TRP.x+.35,US_Y+1.95,TRP.z+.6]);
const WIDE={pos:mxz(-118,36,8.5).toArray(),look:mxz(-70,37,0).toArray(),fov:44};                       // both flags + Trump, high over the US
const WIDE2={pos:mxz(-100,38,4.2).toArray(),look:mxz(-74,38.5,.8).toArray(),fov:42};                    // push toward Trump
trump14(tPress);const FACE=CK.closeUp(TR,{dist:1.35,fov:30,dy:-.1});
trump14(tButton);const HAND=CK.fit([CK.box([PED.x-.22,PED.y+.85,PED.z-.2],[PED.x+.22,PED.y+1.2,PED.z+.2]),CK.box([TRP.x-.2,US_Y+1.35,TRP.z-.1],[TRP.x+.2,US_Y+2.1,TRP.z+.15])],{dir:[.25,.35,1],fov:34,top:.06});
trump14(0);
const IRF={pos:IRAN.clone().add(V3(1.0,2.0,6.4)).toArray(),look:IRAN.clone().add(V3(0,1.1,0)).toArray(),fov:42},IRF2={pos:IRAN.clone().add(V3(.9,2.1,5.9)).toArray(),look:IRAN.clone().add(V3(0,1.35,0)).toArray(),fov:42};
function chase(t){const u=uM(t),p=ARC.getPoint(u),tg=ARC.getTangent(Math.min(u,.98)),fl=tg.clone().setY(0).normalize();
 return {pos:p.clone().addScaledVector(fl,-2.8).add(V3(1.4,1.5,0)).toArray(),look:p.clone().addScaledVector(fl,.35).add(V3(0,-.15,0)).toArray(),fov:42};}
window.CAM14=t=>{
 if(t<tTrump)return LF(WIDE,WIDE2,sm(0,tTrump,t)*.6);
 if(t<tPress+.05)return LF(LF(WIDE,WIDE2,.6),FACE,sm(tTrump,tPress+.05,t));
 if(t<tButton-.25)return FACE;
 if(t<tLaunch+.1)return LF(FACE,HAND,sm(tButton-.25,tButton,t));
 if(t<tHit){const c=chase(t),k=sm(tLaunch+.1,tLaunch+.45,t),e=sm(tLaunch+(tHit-tLaunch)*.62,tHit,t);return LF(LF(HAND,c,k),IRF,e);}
 return LF(IRF,IRF2,sm(tHit,HOOK_END,t));};
window.CAM14_END=HOOK_END;
window.HOOK14={tLaunch,tHit,tWhat2,HOOK_END};
