// ================= EP15 STORY (after the hook) - runs inside the hook block (shares mxz, PP, MKP, pill, face2cam, herm15, FT15, BXc, gbox, WF15) =================
// A  map: Mike at the pump - LAST YEAR $3.08 vs NOW $4.10, RECORD, +$15 per 15-gal tank
// B  blue room 1: a glass 1-GALLON jug fills in layers: CRUDE OIL 50% (WORLD MARKET, not the White House) / 42 GAL barrel / REFINING 24% / PIPES + TRUCKS 13% / TAXES 13% -> 18.4c FEDERAL, STATE TAX
// C  map: '?' top view -> Gulf coast: 4 real SPR sites (Bryan Mound, Big Hill TX; West Hackberry, Bayou Choctaw LA), SALT CAVES, barrels flood out = 172 MILLION BARRELS, WEEKS not YEARS
// D  blue room 2: 18.4c + padlock, CONGRESS building
// E  blue room 3: OPEC / WARS / HORMUZ cards, red X on 'no president'
// F  map: El-Sayed head badge on Michigan (SENATE), Trump head badge on DC (PRESIDENT); 'picture' -> El-Sayed's badge flies to DC; Mike back at the pump; SAME OIL / SAME WORLD / SAME CONGRESS
// G  CTA: UP / DOWN signs beside the pump, Mike faces the viewer
// White flash on every change of place (same as the hook). Few SFX (user rule). No bodies on the map except Mike (heads in badges only).
const WS=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const sThats=WS('thats'),sHighest=WS('highest'),sFor=WS('for'),s15=WS('15'),sMore=WS('more',1),sSo=WS('so'),sOpen=WS('open'),sHalf=WS('half'),sWorld=WS('world'),sWhite=WS('white'),
 sOne=WS('one',1),sBarrel=WS('barrel'),s42=WS('42'),sJump=WS('jump'),sQuarter=WS('quarter'),sPipes=WS('pipes'),sTrucks=WS('trucks'),sStation=WS('station'),sTaxes=WS('taxes'),s184=WS('184'),
 sRest=WS('rest'),sState=WS('state'),sNow=WS('now'),sTouch=WS('touch'),sEmerg=WS('emergency'),sSalt=WS('salt'),sTexas=WS('texas'),sLouis=WS('louisiana'),sThis=WS('this',1),sOrdered=WS('ordered'),s172=WS('172'),
 sBut=WS('but'),sWeeks=WS('weeks'),sYears=WS('years'),sAnd=WS('and',5),sFederal=WS('federal',1),sCongress=WS('congress'),sOpec=WS('opec'),sWars=WS('wars'),sHormuz=WS('hormuz'),sNo=WS('no'),
 sEls2=WS('elsayed',1),sSenate=WS('senate'),sTrump=WS('trump'),sPicture=WS('picture'),sEls3=WS('elsayed',2),sMike2=WS('mike',1),sSame=WS('same'),sSame2=WS('same',1),sSame3=WS('same',2),
 sUp=WS('up'),sComment=WS('comment'),SEND=TLN.dur;
const FLASHES=[sSo,sNow,sAnd,sOpec-.02,sEls2];
const place=t=>t<sSo?'map':t<sNow?'room1':t<sAnd?'map':t<sOpec-.02?'room2':t<sEls2?'room3':'map';
const PS15=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const win=(t,a,b)=>pop(t,a,.3)*(1-sm(b,b+.25,t));
// ================= A: map, Mike at the pump =================
POPS.forEach(m=>{if(m.userData.t1>=1e8)m.userData.t1=sThats-.15;});   // the hook's $4.10 above the pump makes room
popT('LAST YEAR',.2,WHT,PP.clone().add(V3(.1,3.0,1.6)),sThats-.05,sFor-.1);popT('$3.08',.4,GRN,PP.clone().add(V3(.1,2.5,1.6)),sThats-.05,sFor-.1);
popT('NOW',.2,WHT,PP.clone().add(V3(.1,3.0,-1.6)),sThats+.15,sFor-.1);popT('$4.10',.4,RED,PP.clone().add(V3(.1,2.5,-1.6)),sThats+.15,sFor-.1);
popT('+$1',.42,RED,PP.clone().add(V3(.1,3.6,0)),WS('dollar')-.05,sHighest-.1);
popT('RECORD',.36,YEL,PP.clone().add(V3(.1,3.75,0)),sHighest-.05,sFor-.1);popT('NOVEMBER',.17,WHT,PP.clone().add(V3(.1,3.32,0)),WS('november')-.05,sFor-.1);
popT('15 GAL',.24,WHT,MKP.clone().add(V3(.2,3.25,0)),s15-.05,sSo-.1);popT('+$15',.42,RED,MKP.clone().add(V3(.2,2.75,0)),WS('15',1)-.05,sSo-.1);
const UPA=CK.icon('up',{color:'#ff2a2a',size:.4});scene.add(UPA);
// ================= room builder (dark blue Zack wall + floor, camera looks +z, SCREEN RIGHT = -x) =================
const RX=-300,RZ=0;
{const wall=new THREE.MeshStandardMaterial({color:0x1b2f72,roughness:.95,envMapIntensity:.2}),flo=new THREE.MeshStandardMaterial({color:0x13235a,roughness:.9,envMapIntensity:.2});
 const w=add(new THREE.PlaneGeometry(80,20),wall,RX-10,10,RZ+5,scene,false);w.rotation.y=Math.PI;w.receiveShadow=true;
 const f=add(new THREE.PlaneGeometry(90,60),flo,RX-10,.035,RZ-20,scene,false);f.rotation.x=-Math.PI/2;f.receiveShadow=true;
 add(B(80,.1,.08),M(0x2e4aa0,.6),RX-10,.08,RZ+4.96,scene,false);
 for(const zx of [RX,RX-10,RX-20]){const L=new THREE.SpotLight(0xfff3e2,14,14,.6,.7,1.2);L.position.set(zx+.5,6,RZ-4);L.target.position.set(zx,1.3,RZ+2);scene.add(L);scene.add(L.target);}}
const basic=(w,h,map,x,y,z)=>{const m=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false,transparent:true,side:THREE.DoubleSide}),x,y,z,scene,false);m.rotation.y=Math.PI;return m;};
// ================= B: the glass gallon =================
const JX=RX,JZ=RZ+2.2,JR=.62,JH=2.3;
const JUG=new THREE.Group();JUG.position.set(JX,0,JZ);scene.add(JUG);
{const glass=new THREE.MeshPhysicalMaterial({color:0xdfefff,roughness:.05,metalness:0,transparent:true,opacity:.12,clearcoat:1,envMapIntensity:1.4,depthWrite:false,side:THREE.DoubleSide});
 add(CY(JR,JR,JH,48,1,true),glass,0,JH/2+.05,0,JUG,false);
 const sh=add(new THREE.SphereGeometry(JR,48,16,0,Math.PI*2,0,Math.PI/2),glass,0,JH+.05,0,JUG,false);sh.scale.y=.45;
 add(CY(.24,.24,.22,32),glass,0,JH+.36,0,JUG,false);
 const hd=add(new THREE.TorusGeometry(.32,.06,12,32,Math.PI),glass,JR*.55,JH-.1,0,JUG,false);hd.rotation.y=Math.PI/2;hd.rotation.x=0;
 add(CY(JR*1.02,JR*1.02,.06,48),M(0xdfe6ee,.3,.2),0,.03,0,JUG);}
const JCAP=add(CY(.27,.27,.18,32),M(0xd21e2a,.35),JX,JH+.55,JZ);
const LBLT=tex(512,200,x=>{x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,500,188,26);x.fill();x.fillStyle='#0b1530';x.font='900 92px Mont';x.textAlign='center';x.fillText('1 GALLON',256,132);});
const JLBL=basic(.95,.37,LBLT,JX,JH+.05-.2,JZ-JR-.02);
const LAY=[['CRUDE OIL',.50,0x141414,'50%'],['REFINING',.24,0xf08a12,'24%'],['PIPES + TRUCKS',.13,0x2f7fe8,'13%'],['TAXES',.13,0x22b85a,'13%']];
const LT=[sHalf,sQuarter,sPipes,sTaxes];
let ly=.07;const LAYM=LAY.map(([nm,f,c,pc],i)=>{const h=f*(JH-.1),m=add(CY(JR*.95,JR*.95,1,48),new THREE.MeshStandardMaterial({color:c,roughness:.35,metalness:.05,emissive:c,emissiveIntensity:.12}),JX,0,JZ,scene,false);
 m.userData={y0:ly,h};const yc=ly+h/2;ly+=h;
 const lx=i%2?JX+1.05:JX-1.25;popT(pc,.26,[WHT,0xffa53a,0x5aa8ff,GRN][i],V3(lx,yc+.06,JZ-.2),LT[i]-.02,sNow-.1);popT(nm,.12,WHT,V3(lx,yc-.18,JZ-.2),LT[i]+.05,sNow-.1);return m;});
popT('WORLD MARKET',.15,YEL,V3(JX-.95,2.75,JZ-.2),sWorld-.05,sOne-.1);
const XWH=CK.icon('x',{color:'#ff2a2a',size:.32});scene.add(XWH);popT('WHITE HOUSE',.15,WHT,V3(JX+1.35,2.95,JZ-.2),sWhite-.05,sOne-.1);
// oil barrel (real look: blue steel drum, ribs, OIL stencil) - also used for the SPR flood
const OILT=tex(512,256,x=>{x.fillStyle='#1d4e9c';x.fillRect(0,0,512,256);x.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<512;i+=8)x.fillRect(i,0,3,256);x.fillStyle='#fff';x.font='900 120px Mont';x.textAlign='center';x.fillText('OIL',256,170);});
OILT.wrapS=THREE.RepeatWrapping;
function barrel(){const g=new THREE.Group();const body=new THREE.MeshStandardMaterial({map:OILT,roughness:.4,metalness:.55}),rib=M(0x163d7a,.35,.7);
 add(CY(.3,.3,.9,32),[body,rib,rib],0,.45,0,g);for(const y of [.18,.45,.72])add(new THREE.TorusGeometry(.302,.018,8,40),rib,0,y,0,g).rotation.x=Math.PI/2;
 add(CY(.05,.05,.03,12),M(0xc9c9c9,.3,.8),.15,.915,0,g);return g;}
const BRL=barrel();BRL.position.set(JX+3.0,0,JZ-.2);BRL.scale.setScalar(1.25);scene.add(BRL);
popT('42 GAL',.26,WHT,V3(JX+3.0,1.6,JZ-.2),s42-.05,sQuarter-.1);
const UPB=CK.icon('up',{color:'#ff2a2a',size:.32});scene.add(UPB);
popT('18.4 CENTS',.22,YEL,V3(JX-1.05,3.3,JZ-.2),s184-.05,sNow-.1);popT('FEDERAL',.15,WHT,V3(JX-1.05,3.0,JZ-.2),WS('federal')-.05,sNow-.1);
popT('+ STATE TAX',.17,WHT,V3(JX+1.45,3.3,JZ-.2),sState-.05,sNow-.1);popT('50 STATES',.13,YEL,V3(JX+1.45,3.02,JZ-.2),WS('different')-.05,sNow-.1);
const MKR1=V3(JX+2.05,0,JZ-1.0);
// ================= C: map - the Strategic Petroleum Reserve on the Gulf coast =================
const SPR=[[-95.4,28.9],[-94.2,29.8],[-93.4,30.0],[-91.3,30.4]].map(([lo,la])=>mxz(lo,la));
const TANKS=SPR.map(p=>{const g=new THREE.Group();g.position.copy(p);scene.add(g);const wm=M(0xf2f2ee,.35,.2);
 add(CY(.17,.17,.2,32),wm,0,.1,0,g);const d=add(new THREE.SphereGeometry(.17,32,12,0,Math.PI*2,0,Math.PI/2),wm,0,.24,0,g);d.scale.y=.4;
 const r=add(new THREE.RingGeometry(.34,.4,48),new THREE.MeshBasicMaterial({color:new THREE.Color(.4,2.4,.8),toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:false}),0,.02,0,g,false);r.rotation.x=-Math.PI/2;g.userData.r=r;g.visible=false;return g;});
const PSPR=pill('OIL RESERVE',1.05),PSALT=pill('SALT CAVES',1.0),PTX=pill('TEXAS',.9),PLA=pill('LOUISIANA',1.2);
const TXP=mxz(-99,31.2),LAP=mxz(-92.2,31.2),GULF=mxz(-93.5,29.6);
const NB=180,BIM=(()=>{const g=new THREE.CylinderGeometry(.3,.3,.9,20);g.translate(0,.45,0);return new THREE.InstancedMesh(g,new THREE.MeshStandardMaterial({map:OILT,roughness:.4,metalness:.5}),NB);})();BIM.castShadow=false;BIM.frustumCulled=false;scene.add(BIM);BIM.count=0;
const BSEED=[...Array(NB)].map((_,i)=>{const s=SPR[i%4],a=i*2.399,r=.25+Math.sqrt(i/NB)*2.4;return {p:s.clone().add(V3(Math.cos(a)*r*.6,0,Math.sin(a)*r)),d:i/NB};});
popT('172 MILLION',.4,GRN,GULF.clone().add(V3(.3,2.4,0)),s172-.05,sBut-.05);popT('BARRELS',.22,WHT,GULF.clone().add(V3(.3,1.95,0)),WS('barrels')-.05,sBut-.05);
popT('WEEKS',.3,GRN,GULF.clone().add(V3(.3,2.3,1.3)),sWeeks-.05,sAnd-.1);popT('YEARS',.3,WHT,GULF.clone().add(V3(.3,2.3,-1.3)),sYears-.05,sAnd-.1);
const CKW=CK.icon('check',{color:'#22e06a',size:.3}),XYR=CK.icon('x',{color:'#ff2a2a',size:.3});scene.add(CKW);scene.add(XYR);
const QBIG=popT('?',.9,YEL,mxz(-96,39,2.2),sNow,sEmerg-.2);
// ================= D: room 2 - the federal gas tax is locked to Congress =================
const DX=RX-10,DZ=RZ+2.4;
const CAPG=new THREE.Group();CAPG.position.set(DX-.9,0,DZ+.6);scene.add(CAPG);
{const wm=M(0xf4f2ec,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,CAPG);add(B(2.8,.9,1.0),wm,0,.63,0,CAPG);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,-.55,CAPG);add(B(2.9,.12,1.1),gm,0,1.14,0,CAPG);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,CAPG);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,CAPG);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,CAPG);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,CAPG);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52-.0,CAPG);}
popT('CONGRESS',.28,WHT,V3(DX-.9,3.0,DZ),sCongress-.05,sOpec-.15);
const LOCK=new THREE.Group();LOCK.position.set(DX+1.25,1.25,DZ-.3);scene.add(LOCK);
{const gold=M(0xd4af37,.28,1);add(RB(.62,.5,.2,.06),gold,0,0,0,LOCK);const s=add(new THREE.TorusGeometry(.2,.055,12,32,Math.PI),M(0xc0c4ca,.25,1),0,.25,0,LOCK);add(CY(.05,.05,.21,12),M(0x2a2a2a,.4),0,-.02,-.0,LOCK).rotation.x=Math.PI/2;}
popT('18.4 CENTS',.3,YEL,V3(DX+1.25,2.25,DZ-.3),sFederal-.05,sOpec-.15);popT('FEDERAL GAS TAX',.13,WHT,V3(DX+1.25,1.88,DZ-.3),WS('gas',1)-.05,sOpec-.15);
const MKR2=V3(DX+.25,0,DZ-1.1);
// ================= E: room 3 - OPEC / WARS / HORMUZ =================
const EX=RX-20,EZ=RZ+2.6;
function card(title,draw){const P=canv15(512,640),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(6,6,500,628,36);x.fill();x.strokeStyle='#fff';x.lineWidth=10;x.stroke();
 x.fillStyle='#fff';x.font='900 96px Mont';x.textAlign='center';x.fillText(title,256,560);draw(x);P.t.needsUpdate=true;return P.t;}
const CARDS=[['OPEC',x=>{x.fillStyle='#1d4e9c';x.fillRect(176,120,160,240);x.fillStyle='#163d7a';[150,240,330].forEach(y=>x.fillRect(170,y,172,14));x.fillStyle='#fff';x.font='900 56px Mont';x.fillText('OIL',256,260);}],
 ['WARS',x=>{x.fillStyle='#ff6a12';x.beginPath();for(let k=0;k<16;k++){const a=k/16*Math.PI*2,r=k%2?70:150;x.lineTo(256+Math.cos(a)*r,250+Math.sin(a)*r);}x.fill();x.fillStyle='#ffd23a';x.beginPath();for(let k=0;k<16;k++){const a=k/16*Math.PI*2+.2,r=k%2?40:90;x.lineTo(256+Math.cos(a)*r,250+Math.sin(a)*r);}x.fill();}],
 ['HORMUZ',x=>{x.fillStyle='#2a6fd6';x.fillRect(60,300,392,90);x.fillStyle='#c33';x.beginPath();x.moveTo(110,300);x.lineTo(400,300);x.lineTo(370,350);x.lineTo(140,350);x.fill();x.fillStyle='#eee';x.fillRect(300,230,70,70);x.fillStyle='#222';x.fillRect(318,195,22,40);}]]
 .map(([t,d],i)=>{const m=basic(1.05,1.31,card(t,d),EX+1.4-i*1.4,1.75,EZ);m.userData.t0=[sOpec,sWars,sHormuz][i];return m;});
const XS=CARDS.map(()=>{const x=CK.icon('x',{color:'#ff2a2a',size:.36});scene.add(x);return x;});
popT('NO PRESIDENT',.2,WHT,V3(EX,3.05,EZ),sNo-.05,sEls2-.1);
const MKR3=V3(EX+.05,0,EZ-1.6);
// ================= F: map - head badges (El-Sayed on Michigan, Trump on DC) =================
function headBadge(P,bg,ring,label,lw){const rt=new THREE.WebGLRenderTarget(512,512,{samples:4,type:THREE.HalfFloatType}),hc=new THREE.PerspectiveCamera(20,1,.05,1.6),G=new THREE.Group();scene.add(G);
 add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:ring,toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,G,false);
 add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,G,false);add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:rt.texture}),0,0,0,G,false);
 const st=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),0,0,0,scene,false);st.rotation.x=Math.PI;const pl=pill(label,lw);pl.material.depthTest=false;pl.renderOrder=9;
 return {G,st,pl,set(lbl){},draw(t,base,k,home,expr){const on=k>.01;G.visible=st.visible=pl.visible=on;if(!on)return;
  relax(P);idle(P,t,.3);ELS.g.visible=TR.g.visible=false;P.g.visible=true;P.g.position.copy(home);P.g.rotation.y=Math.PI;face(P,{jaw:.03+.03*Math.abs(Math.sin(t*8)),smile:.35});P.g.updateMatrixWorld(true);
  const h=V3();(P.BN.head||P.BN.neck01).getWorldPosition(h);h.y+=.06;hc.position.copy(h).add(V3(0,.02,-.92));hc.lookAt(h.x,h.y-.02,h.z);FK.update(P,t,{expr,look:hc.position});
  const b0=scene.background;scene.background=bg;renderer.setRenderTarget(rt);renderer.clear();renderer.render(scene,hc);renderer.setRenderTarget(null);scene.background=b0;P.g.visible=false;
  const q=k*.75;G.position.copy(base).add(V3(0,BH*.8,0));G.quaternion.copy(cam.quaternion);G.scale.setScalar(q);st.position.copy(base).add(V3(0,US_Y+(BH*.8-BR*q)/2,0));st.scale.set(.75,q,.75);
  face2cam(pl,base.clone().add(V3(0,BH*.8-BR*q-.27,0)));pl.scale.setScalar(q);}};}
const MI=mxz(-84.7,43.0);
const BE=headBadge(ELS,new THREE.Color(0x2a66c9),new THREE.Color(.45,1.3,3),'SENATOR',1.25),BT=headBadge(TR,new THREE.Color(0x7d1d27),new THREE.Color(3,.5,.4),'PRESIDENT',1.35);
const BE2=headBadge(ELS,new THREE.Color(0x2a66c9),new THREE.Color(.45,1.3,3),'PRESIDENT?',1.45);
const TRHOME=V3(GX,SY,19.25),ELHOME=V3(GX,SY,19.25);
popT('SAME OIL',.26,WHT,PP.clone().add(V3(.1,3.95,0)),sSame-.05,sUp-.1);popT('SAME WORLD',.26,WHT,PP.clone().add(V3(.1,3.55,0)),sSame2-.05,sUp-.1);popT('SAME CONGRESS',.26,WHT,PP.clone().add(V3(.1,3.15,0)),sSame3-.05,sUp-.1);
// ================= G: CTA UP / DOWN =================
function sign(txt,col){const P=canv15(512,300),x=P.x;x.fillStyle=col;x.beginPath();x.roundRect(6,6,500,288,40);x.fill();x.strokeStyle='#fff';x.lineWidth=12;x.stroke();x.fillStyle='#fff';x.font='900 150px Mont';x.textAlign='center';x.fillText(txt,256,205);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(1.25,.73),new THREE.MeshBasicMaterial({map:P.t,toneMapped:false,transparent:true}),0,0,0,scene,false);m.renderOrder=6;return m;}
const SUP=sign('UP','#e0242c'),SDN=sign('DOWN','#1fa651');
const AUP=CK.icon('up',{color:'#ff2a2a',size:.42}),ADN=CK.icon('down',{color:'#22e06a',size:.42});scene.add(AUP);scene.add(ADN);
// ================= per-frame =================
function mikeAt(t,p,ry,o={}){const P=MIKE;P.g.visible=true;P.g.position.copy(p);P.g.rotation.y=ry;P.g.scale.setScalar(o.s||1);relax(P);idle(P,t,1.3);
 if(o.wave)wave(P,'R',t);if(o.arms)armsUp(P,o.arms);face(P,{jaw:.03+.04*Math.abs(Math.sin(t*7)),smile:o.smile??.25});FK.update(P,t,{expr:o.expr||[['doubt',.3]],look:o.look||cam.position});}
function story15(t){const pl=place(t);
 WF15.style.opacity=String(Math.max(Math.max(0,1-Math.abs(t-tMeet)/.14),...FLASHES.map(f=>Math.max(0,1-Math.abs(t-f)/.14)))*.95);
 // ---- A (map, before 'So'): hook's mike15 drives Mike; extra reactions
 CK.iconAnim(UPA,t,WS('dollar')-.05,sHighest-.1,{pos:PP.clone().add(V3(.1,3.65,.75)),cam,spin:.3});
 if(t>=sThats&&t<sSo){const P=MIKE;const k=sm(s15-.2,s15+.1,t);pose(P,'head',-.08,-.2*(1-k),0);}
 // ---- B room 1
 const r1=pl==='room1';JUG.visible=JCAP.visible=JLBL.visible=BRL.visible=r1;LAYM.forEach(m=>m.visible=false);
 if(r1){mikeAt(t,MKR1,-.35,{expr:[['doubt',.4],['shock',sm(sHalf,sHalf+.3,t)*.4]],look:t<sHalf?JLBL.position:V3(JX,1.2,JZ),arms:t>sWhite&&t<sOne?.18:0});
  const op=sm(sOpen-.05,sOpen+.35,t);JCAP.position.set(JX-.0+op*.15,JH+.55+op*1.6,JZ-op*.5);JCAP.rotation.z=op*2.4;JCAP.visible=op<.98;
  LAYM.forEach((m,i)=>{const k=sm(LT[i]-.05,LT[i]+.45,t);m.visible=k>.01;if(!m.visible)return;const h=m.userData.h*k;m.scale.set(1,Math.max(.001,h),1);m.position.y=m.userData.y0+h/2;});
  const bk=pop(t,sBarrel-.05,.3);BRL.visible=bk>.01;BRL.scale.setScalar(1.25*bk);BRL.rotation.y=t*.4;}
 CK.iconAnim(XWH,t,sWhite+.1,sOne-.1,{pos:V3(JX+1.35,2.55,JZ-.2),cam,spin:.3});
 CK.iconAnim(UPB,t,sJump-.05,sQuarter-.1,{pos:V3(JX+3.0,2.05,JZ-.2),cam,spin:.3});
 // ---- C map: SPR
 const cOn=t>=sNow&&t<sAnd;TANKS.forEach((g,i)=>{const k=cOn?pop(t,sEmerg-.1+i*.08,.3):0;PS15(g,k);if(g.visible){const ph=((t-sEmerg)*1.2+i*.3)%1;g.userData.r.scale.setScalar(.6+1.6*ph);g.userData.r.material.opacity=1-ph;}});
 [[PSPR,GULF.clone().add(V3(-.2,1.6,0)),sEmerg-.05],[PSALT,GULF.clone().add(V3(-.2,1.2,0)),sSalt-.05],[PTX,TXP.clone().add(V3(0,.45,0)),sTexas-.05],[PLA,LAP.clone().add(V3(0,.45,0)),sLouis-.05]].forEach(([m,p,t0])=>{const k=cOn&&t<sOrdered-.1?pop(t,t0,.3):0;PS15(m,k);if(m.visible){m.position.copy(p);m.quaternion.copy(cam.quaternion);}});
 if(cOn&&t>=sOrdered){const u=sm(sOrdered,s172+.9,t);const n=Math.floor(NB*u);const o=new THREE.Object3D();let c=0;
  for(let i=0;i<n;i++){const b=BSEED[i],age=Math.min(1,(u-b.d)*8);o.position.copy(b.p);o.position.y=US_Y+(1-age)*-.4+Math.sin(age*Math.PI)*.35;o.scale.setScalar(.38*Math.min(1,age*1.4));o.rotation.set(0,i,0);o.updateMatrix();BIM.setMatrixAt(c++,o.matrix);}
  BIM.count=c;BIM.instanceMatrix.needsUpdate=true;}else BIM.count=0;
 CK.iconAnim(CKW,t,sWeeks+.05,sAnd-.1,{pos:GULF.clone().add(V3(.3,1.8,1.3)),cam,spin:.3});CK.iconAnim(XYR,t,sYears+.05,sAnd-.1,{pos:GULF.clone().add(V3(.3,1.8,-1.3)),cam,spin:.3});
 // ---- D room 2
 const r2=pl==='room2';CAPG.visible=LOCK.visible=r2;if(r2){mikeAt(t,MKR2,-.2,{expr:[['doubt',.5]],look:t<sCongress?LOCK.position:CAPG.position.clone().add(V3(0,1.5,0)),arms:t>sCongress+.2?.15:0});
  const k=pop(t,sFederal-.05,.3);LOCK.scale.setScalar(Math.max(.001,k));LOCK.rotation.y=.3*Math.sin(t*1.5);const ck=pop(t,sCongress-.08,.35);CAPG.scale.setScalar(Math.max(.001,ck));}
 // ---- E room 3
 const r3=pl==='room3';CARDS.forEach((m,i)=>{const k=r3?pop(t,m.userData.t0-.05,.3):0;PS15(m,k);});
 XS.forEach((x,i)=>{if(!r3){x.visible=false;return;}CK.iconAnim(x,t,sNo+i*.1,sEls2-.1,{pos:V3(EX+1.4-i*1.4,1.85,EZ-.12),cam,spin:.3});});
 if(r3)mikeAt(t,MKR3,Math.PI*.88,{expr:[['doubt',.6]],arms:t>sNo?.3:0,smile:.05});
 // ---- F/G map: badges, Mike back, CTA
 const fOn=t>=sEls2;
 const ke=fOn&&t<sPicture?pop(t,sEls2-.02,.35):0;BE.draw(t,MI,ke,ELHOME,[['joy',.4]]);
 const kt=fOn&&t<sMike2-.1?pop(t,sTrump-.02,.35)*(1-sm(sPicture,sPicture+.3,t)):0;BT.draw(t,mxz(-77.3,38.9),kt,TRHOME,[['smirk',.6]]);
 if(fOn&&t>=sPicture&&t<sMike2-.1){const u=sm(sPicture,sEls3+.3,t);BE2.draw(t,MI.clone().lerp(mxz(-77.3,38.9),u),1,ELHOME,[['joy',.6]]);}else BE2.draw(t,MI,0,ELHOME,[]);
 if(t>=sPicture-.05&&t<sPicture+.8){WIPE.constant=-1e4;WIPEI.constant=1e4;}   // the map turns back to blue? keep blue after the hook
 if(fOn&&t>=sMike2-.1){const cta=t>=sUp-.05;mikeAt(t,MKP,Math.PI/2-.05,{s:1.4,wave:cta&&t<sComment+.4,smile:cta?.5:.2,expr:cta?[['joy',.5]]:[['doubt',.5]],look:cta?cam.position:PRICE_P});
  [[SUP,PP.clone().add(V3(.3,3.3,1.05)),sUp-.02,AUP,1],[SDN,PP.clone().add(V3(.3,3.3,-1.05)),WS('down')-.02,ADN,-1]].forEach(([m,p,t0,ic,sg])=>{const k=pop(t,t0,.3);PS15(m,k);if(m.visible){m.position.copy(p);m.position.y+=.04*Math.sin(t*3+sg);m.quaternion.copy(cam.quaternion);}
   CK.iconAnim(ic,t,t0+.1,1e9,{pos:p.clone().add(V3(0,.6,0)),cam,spin:.3});});}
 else{SUP.visible=SDN.visible=AUP.visible=ADN.visible=false;}
 if(!fOn&&pl==='map'&&t>=sNow){MIKE.g.visible=false;}   // the SPR shots: map only
 if(pl==='map'&&t>=sEls2&&t<sMike2-.1)MIKE.g.visible=false;
 if(!(r1||r2||r3)&&!(pl==='map'&&(t<sSo||t>=sMike2-.1)))MIKE.g.visible=false;
 ELS.g.visible=false;TR.g.visible=false;
 PUMP.visible=!(t>=sEmerg-.15&&t<sAnd)&&!(t>=sEls2&&t<sMike2-.1);}
// keep the map blue after the hook wipe (the hook's wipe15 already leaves it fully blue)
// ================= story camera =================
const BXr=(x0,y0,z0,x1,y1,z1)=>CK.box([x0,y0,z0],[x1,y1,z1]);
const MBr=p=>BXr(p.x-.35,0,p.z-.3,p.x+.35,1.9,p.z+.3);
const PRB2=CK.box([PP.x-.2,PP.y,PP.z-3.1],[PP.x+.2,PP.y+4.5,PP.z+3.1]),MKB3=BXc(MKP,.45,3.05);
const JB=BXr(JX-2.0,0,JZ-.3,JX+3.35,3.6,JZ+.3);
const SEC=[];const sec=(t0,keys)=>SEC.push({t0,keys});
sec(HOOK_END,[[HOOK_END,FT15([MKB3,PUB,PRB],[1,.38,0],38,{slack:.94})],[sThats+.3,FT15([PRB2,MKB3],[1,.42,.05],40)],[sHighest+.2,FT15([PRB2,MKB3],[1,.4,-.05],40)],[sFor+.2,FT15([MKB3,PUB,BXc(MKP,.5,3.5)],[1,.4,.1],38)],[sSo,FT15([MKB3,PUB,BXc(MKP,.5,3.5)],[1,.38,.05],38,{slack:.95})]]);
sec(sSo,[[sSo,FT15([JB,MBr(MKR1)],[0,.12,-1],44)],[sOpen,FT15([BXr(JX-.7,1.5,JZ-.6,JX+.7,3.2,JZ+.6),MBr(MKR1)],[.03,.12,-1],40)],[sHalf+.2,FT15([JB],[0,.1,-1],42)],
 [sOne+.1,FT15([BXr(JX-.7,0,JZ-.6,JX+3.4,2.3,JZ+.3)],[-.05,.12,-1],40)],[sQuarter+.1,FT15([JB],[.02,.1,-1],42)],[sTaxes+.1,FT15([JB,BXr(JX-1.9,2.7,JZ-.2,JX-.7,3.5,JZ-.2)],[-.02,.1,-1],42)],
 [sState,FT15([JB,BXr(JX+.8,2.6,JZ-.2,JX+2.2,3.4,JZ-.2)],[.02,.1,-1],42)],[sNow,FT15([JB],[0,.1,-1],42,{slack:.96})]]);
sec(sNow,[[sNow,FT15([gbox(-124,25,-68,49,0,.1)],[.35,1.0,0],40)],[sEmerg+.1,FT15([gbox(-100,27.5,-89.5,32.5,0,.6),CK.box([GULF.x-.3,0,GULF.z-1.1],[GULF.x+.3,1.9,GULF.z+1.1])],[1,1.05,0],40)],[sTexas,FT15([gbox(-104,27.5,-89,33.5,0,.6),CK.box([GULF.x-.3,0,GULF.z-1.1],[GULF.x+.3,1.9,GULF.z+1.1])],[1,.95,.05],40)],
 [sOrdered,FT15([gbox(-100,27,-89,32,0,.6),CK.box([GULF.x-.3,0,GULF.z-2.3],[GULF.x+.3,2.7,GULF.z+2.3])],[1,.8,0],40)],[sBut,FT15([gbox(-101,27,-88,33,0,.6),CK.box([GULF.x-.3,0,GULF.z-2.3],[GULF.x+.3,2.7,GULF.z+2.3])],[1,.75,-.03],40)],[sAnd,FT15([gbox(-101,27,-88,33,0,.6),CK.box([GULF.x-.3,0,GULF.z-2.3],[GULF.x+.3,2.7,GULF.z+2.3])],[1,.75,.03],40,{slack:.96})]]);
sec(sAnd,[[sAnd,FT15([BXr(DX+.8,.9,DZ-.4,DX+1.7,2.55,DZ-.2),MBr(MKR2)],[0,.12,-1],40)],[sCongress,FT15([BXr(DX-2.4,0,DZ,DX+2.25,3.2,DZ+1.2),MBr(MKR2)],[.03,.14,-1],44)],[sOpec-.02,FT15([BXr(DX-2.4,0,DZ,DX+2.25,3.2,DZ+1.2),MBr(MKR2)],[-.02,.14,-1],44,{slack:.96})]]);
sec(sOpec-.02,[[sOpec-.02,FT15([BXr(EX+.8,1,EZ,EX+2,2.45,EZ),MBr(MKR3)],[0,.12,-1],40)],[sWars,FT15([BXr(EX-.6,1,EZ,EX+2,2.45,EZ),MBr(MKR3)],[0,.12,-1],42)],[sHormuz,FT15([BXr(EX-2,1,EZ,EX+2,3.3,EZ),MBr(MKR3)],[0,.12,-1],44)],[sEls2,FT15([BXr(EX-2,1,EZ,EX+2,3.3,EZ),MBr(MKR3)],[0,.12,-1],44,{slack:.96})]]);
const MIB=CK.box([MI.x-.3,US_Y,MI.z-.75],[MI.x+.3,US_Y+BH+BR+.05,MI.z+.75]);
sec(sEls2,[[sEls2,FT15([MIB,BXc(MI,1.2,.1)],[1,.55,.1],38)],[sTrump,FT15([MIB,DCB,gbox(-90,35,-73,45,0,.1)],[.55,1,0],40)],[sPicture+.1,FT15([MIB,DCB,gbox(-91,34,-73,45,0,.1)],[.6,1,0],40)],[sMike2-.1,FT15([MIB,DCB,gbox(-91,34,-73,45,0,.1)],[.62,1,0],40,{slack:.96})]]);
sec(sMike2-.1,[[sMike2-.1,FT15([MKB3,PUB],[1,.42,.1],38)],[sSame,FT15([MKB3,PRB2],[1,.4,0],40)],[sUp,FT15([MKB3,PUB,CK.box([PP.x,PP.y+2.8,PP.z-1.8],[PP.x+.4,PP.y+4.4,PP.z+1.8])],[1,.38,.03],42)],[SEND,FT15([MKB3,PUB,CK.box([PP.x,PP.y+2.8,PP.z-1.8],[PP.x+.4,PP.y+4.4,PP.z+1.8])],[1,.36,-.03],42,{slack:.94})]]);
const CAMH15=window.CAM14;
window.CAM14=t=>{if(t<HOOK_END)return CAMH15(t);let s=SEC[0];for(const x of SEC)if(t>=x.t0)s=x;return unch15(herm15(s.keys,t));};
window.CAM14_END=SEND+1;
function animateAll(t){animate(t);story15(t);}
