// ================= EP16 STORY (after the hook) - runs inside the hook block (shares mxz, PP, PUMP, screen15, pill, face2cam, herm15, FT15, BXc, gbox, BADGE, CAPG, card16) =================
// A  map: white flash on 'Meet' -> Mike at the pump: $4.04 / LAST YEAR $3.08 vs NOW $4.04 / +$14 EVERY TANK
// B  blue room 2 (THING 1 = TAX): card 1 TAX, padlock + 18.4 CENTS FEDERAL GAS TAX, SINCE 1993, Capitol = CONGRESS (padlock opens on 'pause'), NEW CONGRESS,
//    the math: 15 GAL x 18.4c = $2.76, < 5%
// C  blue room 1 (THING 2 = OIL): card 2 OIL, the glass gallon: CRUDE OIL 50% (WORLD MARKET, WASHINGTON X), REFINING 24%, TAXES + DELIVERY 26%
// C2 blue room 3: HORMUZ card, 1/5 OF WORLD OIL, 20 MILLION BARRELS / DAY, DISRUPTED, NO VOTE (X)
// D  map (THING 3 = PRESIDENT): card 3, Trump photo badge + Capitol: LAW, MAY 2026 / GAS TAX PAUSE?, PASSES (check), SIGNS (check) or VETO (X), 2/3 TO OVERRIDE
// E  room 4: pie of the gallon - CONGRESS slice ~5 % pops out, WORLD slice 50 % pops out, the PEN card
// F  map CTA: Mike at the pump, NEXT YEAR?, UP / DOWN signs, Mike waves
// White flash on every change of place. Few SFX (user rule).
const WS=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const sMeet=WS('meet'),sMike=WS('mike'),sFour=WS('four'),sYear=WS('year'),sFourteen=WS('fourteen'),sTank=WS('tank'),
 sThing1=WS('thing'),sTax=WS('tax'),s18=WS('eighteen'),sFederal=WS('federal'),s1993=WS('1993'),sOnly=WS('only'),sPause=WS('pause'),sNew=WS('new'),sMath=WS('math'),
 s15=WS('fifteen'),s276=WS('two'),sFive=WS('five'),
 sThing2=WS('thing',1),sHalf=WS('half'),sWorld=WS('world'),sWash=WS('washington'),sRefining=WS('refining'),sTaxes=WS('taxes'),sDelivery=WS('delivery'),
 sHz=WS('about',6),sFifth=WS('fifth'),sHormuz=WS('hormuz'),sTwenty=WS('twenty'),sDisrupted=WS('disrupted'),sNo=WS('no'),
 sThing3=WS('thing',2),sLaw=WS('law'),sMay=WS('may'),sFloated=WS('floated'),sPasses=WS('passes'),sSigns=WS('signs'),sVetoes=WS('vetoes'),sOverride=WS('override'),sThirds=WS('thirds'),
 sSo2=WS('so',1),sSmall=WS('small'),sBiggest=WS('biggest'),sPen=WS('pen'),sWill=WS('will',1),sNobody=WS('nobody'),sUp=WS('up'),sDown=WS('down'),sComment=WS('comment'),SEND=TLN.dur;
const FLASHES=[sMeet,sThing1,sThing2,sHz,sThing3,sSo2,sWill];
const place=t=>t<sThing1?'map':t<sThing2?'room2':t<sHz?'room1':t<sThing3?'room3':t<sSo2?'map3':t<sWill?'room4':'map';
const PS15=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const WF16=document.createElement('div');WF16.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF16);
const BLU=0x4d9bff;
// ================= A: map, Mike at the pump =================
const MKP=mxz(-98.9,38.2),CSC=1.4;
popT('$4.04',.46,RED,PP.clone().add(V3(.1,2.65,0)),sFour-.05,sYear-.1);
popT('LAST YEAR',.2,WHT,PP.clone().add(V3(.1,3.05,1.1)),sYear-.05,sFourteen-.1);popT('$3.08',.4,GRN,PP.clone().add(V3(.1,2.55,1.1)),sYear-.05,sFourteen-.1);
popT('NOW',.2,WHT,PP.clone().add(V3(.1,3.05,-1.1)),sYear+.2,sFourteen-.1);popT('$4.04',.4,RED,PP.clone().add(V3(.1,2.55,-1.1)),sYear+.2,sFourteen-.1);
popT('+$14',.5,RED,PP.clone().add(V3(.1,2.75,0)),sFourteen-.05,sThing1-.1);popT('EVERY TANK',.2,WHT,PP.clone().add(V3(.1,2.22,0)),sTank-.05,sThing1-.1);
const UPA=CK.icon('up',{color:'#ff2a2a',size:.4});scene.add(UPA);
// ================= rooms (dark blue Zack wall + floor; camera looks +z, SCREEN RIGHT = -x) =================
const RX=-300,RZ=0;
{const wall=new THREE.MeshStandardMaterial({color:0x2a2c31,roughness:.95,envMapIntensity:.2}),flo=new THREE.MeshStandardMaterial({color:0x34363c,roughness:.9,envMapIntensity:.2});   // user 2026-11-07: charcoal, not blue (Mike's tee is blue)
 const w=add(new THREE.PlaneGeometry(90,20),wall,RX-15,10,RZ+5,scene,false);w.rotation.y=Math.PI;w.receiveShadow=true;
 const f=add(new THREE.PlaneGeometry(100,60),flo,RX-15,.035,RZ-20,scene,false);f.rotation.x=-Math.PI/2;f.receiveShadow=true;
 add(B(90,.1,.08),M(0x55585f,.6),RX-15,.08,RZ+4.96,scene,false);
 for(const zx of [RX,RX-10,RX-20,RX-30]){const L=new THREE.SpotLight(0xfff3e2,14,14,.6,.7,1.2);L.position.set(zx+.5,6,RZ-4);L.target.position.set(zx,1.3,RZ+2);scene.add(L);scene.add(L.target);}}
const basic=(w,h,map,x,y,z)=>{const m=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false,transparent:true,side:THREE.DoubleSide}),x,y,z,scene,false);m.rotation.y=Math.PI;return m;};
// section title cards (number + icon + word), placed on the wall above each scene
const DRAW={tax:x=>{x.fillStyle='#f4f4f0';x.beginPath();x.moveTo(166,110);x.lineTo(346,110);x.lineTo(346,430);for(let i=0;i<6;i++){x.lineTo(346-i*30-15,410);x.lineTo(346-(i+1)*30,430);}x.closePath();x.fill();
  x.fillStyle='#d21e2a';x.font='900 150px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('%',256,265);},
 oil:x=>{x.fillStyle='#1b1b1f';x.beginPath();x.roundRect(176,110,160,300,22);x.fill();x.fillStyle='#3a3a42';[170,260,350].forEach(y=>x.fillRect(170,y,172,16));
  x.fillStyle='#ffc61a';x.beginPath();x.moveTo(256,190);x.bezierCurveTo(300,250,300,300,256,310);x.bezierCurveTo(212,300,212,250,256,190);x.fill();},
 pen:x=>{x.fillStyle='#f4f4f0';x.fillRect(150,130,212,270);x.fillStyle='#9aa3b5';[180,215,250,285].forEach(y=>x.fillRect(178,y,156,12));
  x.strokeStyle='#0b1530';x.lineWidth=7;x.beginPath();x.moveTo(180,360);x.bezierCurveTo(215,320,240,390,275,345);x.stroke();
  x.save();x.translate(320,330);x.rotate(-.75);x.fillStyle='#d4af37';x.fillRect(-14,-120,28,150);x.fillStyle='#222';x.beginPath();x.moveTo(-14,30);x.lineTo(14,30);x.lineTo(0,62);x.fill();x.restore();}};
const T1=basic(2.4,.9,card16(1,'TAX',150,DRAW.tax),RX-10,3.95,RZ+2.6),T2=basic(2.4,.9,card16(2,'OIL',150,DRAW.oil),RX-.4,4.0,RZ+2.6);
const T3=add(new THREE.PlaneGeometry(2.4,.9),new THREE.MeshBasicMaterial({map:card16(3,'PRESIDENT',84,DRAW.pen),transparent:true,toneMapped:false}),0,0,0,scene,false);T3.renderOrder=7;
const PENC=add(new THREE.PlaneGeometry(2.4,.9),new THREE.MeshBasicMaterial({map:card16(3,'PRESIDENT',84,DRAW.pen),transparent:true,toneMapped:false}),0,0,0,scene,false);PENC.renderOrder=7;
// ================= B: room 2 - THING 1, the federal gas tax =================
const DX=RX-10,DZ=RZ+2.4;
const LOCK=new THREE.Group();LOCK.position.set(DX+1.1,1.35,DZ-.3);scene.add(LOCK);let SHK;
{const gold=M(0xd4af37,.28,1);add(RB(.62,.5,.2,.06),gold,0,0,0,LOCK);SHK=add(new THREE.TorusGeometry(.2,.055,12,32,Math.PI),M(0xc0c4ca,.25,1),0,.25,0,LOCK);add(CY(.05,.05,.21,12),M(0x2a2a2a,.4),0,-.02,0,LOCK).rotation.x=Math.PI/2;}
popT('18.4 CENTS',.3,YEL,V3(DX+1.1,2.45,DZ-.3),s18-.05,sMath-.15);popT('FEDERAL GAS TAX',.13,WHT,V3(DX+1.1,2.08,DZ-.3),sFederal-.05,sMath-.15);
popT('SINCE 1993',.2,WHT,V3(DX+1.1,.62,DZ-.3),s1993-.05,sOnly-.1);
const CAPR=new THREE.Group();CAPR.position.set(DX-1.1,0,DZ+.6);scene.add(CAPR);
{const wm=M(0xf4f2ec,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,CAPR);add(B(2.8,.9,1.0),wm,0,.63,0,CAPR);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,-.55,CAPR);add(B(2.9,.12,1.1),gm,0,1.14,0,CAPR);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,CAPR);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,CAPR);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,CAPR);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,CAPR);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52,CAPR);}
popT('CONGRESS',.24,WHT,V3(DX-1.1,2.95,DZ),sOnly-.05,sMath-.15);popT('NEW CONGRESS',.2,BLU,V3(DX-1.1,2.62,DZ),sNew-.05,sMath-.15);
popT('PAUSE?',.2,GRN,V3(DX+1.1,.62,DZ-.3),sPause-.05,sMath-.15);
// the math (centred on the wall)
popT('15 GAL',.3,WHT,V3(DX,2.75,DZ),s15-.05,sThing2-.1);popT('x $0.184',.3,YEL,V3(DX,2.27,DZ),s15+.3,sThing2-.1);
popT('= $2.76',.46,GRN,V3(DX,1.65,DZ),s276-.05,sThing2-.1);popT('< 5%',.4,YEL,V3(DX,1.0,DZ),sFive-.05,sThing2-.1);
const MKR2=V3(DX+2.35,0,DZ-1.15);
// ================= C: room 1 - THING 2, the glass gallon =================
const JX=RX,JZ=RZ+2.2,JR=.62,JH=2.3;
const JUG=new THREE.Group();JUG.position.set(JX,0,JZ);scene.add(JUG);
{const glass=new THREE.MeshPhysicalMaterial({color:0xdfefff,roughness:.05,metalness:0,transparent:true,opacity:.12,clearcoat:1,envMapIntensity:1.4,depthWrite:false,side:THREE.DoubleSide});
 add(CY(JR,JR,JH,48,1,true),glass,0,JH/2+.05,0,JUG,false);
 const sh=add(new THREE.SphereGeometry(JR,48,16,0,Math.PI*2,0,Math.PI/2),glass,0,JH+.05,0,JUG,false);sh.scale.y=.45;
 add(CY(.24,.24,.22,32),glass,0,JH+.36,0,JUG,false);
 add(CY(JR*1.02,JR*1.02,.06,48),M(0xdfe6ee,.3,.2),0,.03,0,JUG);}
const JCAP=add(CY(.27,.27,.18,32),M(0xd21e2a,.35),JX,JH+.55,JZ);
const LBLT=tex(512,200,x=>{x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,500,188,26);x.fill();x.fillStyle='#0b1530';x.font='900 92px Mont';x.textAlign='center';x.fillText('1 GALLON',256,132);});
const JLBL=basic(.95,.37,LBLT,JX,JH+.05-.2,JZ-JR-.02);
const LAY=[['CRUDE OIL',.50,0x141414,'50%'],['REFINING',.24,0xf08a12,'24%'],['DELIVERY',.13,0x2f7fe8,'13%'],['TAXES',.13,0x22b85a,'13%']];
const LT=[sHalf,sRefining,sDelivery,sTaxes];
let ly=.07;const LAYM=LAY.map(([nm,f,c,pc],i)=>{const h=f*(JH-.1),m=add(CY(JR*.95,JR*.95,1,48),new THREE.MeshStandardMaterial({color:c,roughness:.35,metalness:.05,emissive:c,emissiveIntensity:.12}),JX,0,JZ,scene,false);
 m.userData={y0:ly,h};const yc=ly+h/2;ly+=h;
 const lx=i%2?JX+1.05:JX-1.25;popT(pc,.26,[WHT,0xffa53a,0x5aa8ff,GRN][i],V3(lx,yc+.06,JZ-.2),LT[i]-.02,sHz-.1);popT(nm,.12,WHT,V3(lx,yc-.18,JZ-.2),LT[i]+.05,sHz-.1);return m;});
popT('WORLD MARKET',.17,YEL,V3(JX-1.25,2.9,JZ-.2),sWorld-.05,sRefining-.1);
const XWA=CK.icon('x',{color:'#ff2a2a',size:.32});scene.add(XWA);popT('WASHINGTON',.15,WHT,V3(JX+1.3,2.95,JZ-.2),sWash-.05,sRefining-.1);
const MKR1=V3(JX+2.05,0,JZ-1.0);
// ================= C2: room 3 - Hormuz =================
const EX=RX-20,EZ=RZ+2.6;
const HZT=(()=>{const P=canv15(512,640),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(6,6,500,628,36);x.fill();x.strokeStyle='#fff';x.lineWidth=10;x.stroke();
 x.fillStyle='#e9c58a';x.beginPath();x.moveTo(30,90);x.lineTo(300,90);x.lineTo(250,230);x.lineTo(30,250);x.fill();x.beginPath();x.moveTo(482,330);x.lineTo(240,300);x.lineTo(300,420);x.lineTo(482,440);x.fill();
 x.fillStyle='#c33';x.beginPath();x.moveTo(150,265);x.lineTo(330,265);x.lineTo(310,300);x.lineTo(170,300);x.fill();x.fillStyle='#eee';x.fillRect(260,228,44,37);
 x.fillStyle='#fff';x.font='900 92px Mont';x.textAlign='center';x.fillText('HORMUZ',256,560);P.t.needsUpdate=true;return P.t;})();
const HZC=basic(2.0,2.5,HZT,EX,1.75,EZ);
popT('1/5',.5,YEL,V3(EX+1.85,2.4,EZ-.1),sFifth-.05,sThing3-.1);popT('OF WORLD OIL',.16,WHT,V3(EX+1.85,1.95,EZ-.1),sFifth+.15,sThing3-.1);
popT('20 MILLION',.3,GRN,V3(EX-2.1,2.4,EZ-.1),sTwenty-.05,sThing3-.1);popT('BARRELS / DAY',.16,WHT,V3(EX-2.1,2.0,EZ-.1),sTwenty+.2,sThing3-.1);
popT('DISRUPTED',.3,RED,V3(EX,.18,EZ-.4),sDisrupted-.05,sNo-.08);
const XHZ=CK.icon('x',{color:'#ff2a2a',size:.5});scene.add(XHZ);popT('NO VOTE',.24,WHT,V3(EX,.42,EZ-.4),sNo-.05,sThing3-.1);
const MKR3=V3(EX-1.75,0,EZ-1.55);
// ================= D: map - THING 3, the president =================
popT('LAW',.36,YEL,CP.clone().add(V3(.4,2.05,1.0)),sLaw-.05,sPasses-.1);
popT('MAY 2026',.2,WHT,DC.clone().add(V3(.3,BH+1.0,0)),sMay-.05,sPasses-.1);popT('GAS TAX PAUSE?',.17,GRN,DC.clone().add(V3(.3,BH+.8-.05,0)),sFloated-.05,sPasses-.1);
const CKP=CK.icon('check',{color:'#22e06a',size:.42}),CKS=CK.icon('check',{color:'#22e06a',size:.42}),XVE=CK.icon('x',{color:'#ff2a2a',size:.42});[CKP,CKS,XVE].forEach(o=>scene.add(o));
popT('PASSES',.2,GRN,CP.clone().add(V3(.4,2.1,0)),sPasses-.05,sThirds+.6);
popT('SIGNS',.2,GRN,DC.clone().add(V3(.4,BH+.95,.55)),sSigns-.05,sOverride-.1);popT('VETO',.24,RED,DC.clone().add(V3(.4,BH+.95,-.6)),sVetoes-.05,sSo2-.1);
popT('2/3',.5,YEL,CP.clone().add(V3(.4,2.75,0)),sThirds-.1,sSo2-.1);popT('TO OVERRIDE',.15,WHT,CP.clone().add(V3(.4,2.35,0)),sOverride-.05,sSo2-.1);
// ================= E: room 4 - the gallon as a pie: who controls which slice =================
const FX=RX-30,FZ=RZ+1.4;
const PIE=new THREE.Group();PIE.position.set(FX,1.25,FZ);PIE.rotation.x=.25;scene.add(PIE);
const SL=[['CONGRESS',.046,0x2f7fe8],['WORLD',.50,0xd21e2a],['REST',.454,0x7a8394]];let a0=Math.PI/2;
const SLM=SL.map(([nm,f,c])=>{const g=new THREE.Group();PIE.add(g);const th=f*Math.PI*2;
 const m=add(new THREE.CylinderGeometry(1.35,1.35,.3,64,1,false,a0,th),new THREE.MeshStandardMaterial({color:c,roughness:.4,metalness:.05,emissive:c,emissiveIntensity:.15}),0,0,0,g);m.rotation.x=Math.PI/2;
 g.userData.mid=a0+th/2;a0+=th;return g;});
popT('CONGRESS',.2,BLU,V3(FX+1.7,2.0,FZ-.3),sSmall-.3,sWill-.1);popT('~5%',.32,BLU,V3(FX+1.7,1.55,FZ-.3),sSmall-.15,sWill-.1);
popT('WORLD',.22,RED,V3(FX-1.6,2.85,FZ-.3),WS('world',1)-.05,sWill-.1);popT('50%',.32,RED,V3(FX-1.6,2.4,FZ-.3),sBiggest-.1,sWill-.1);
const MKR4=V3(FX+2.3,0,FZ-1.6);
// ================= F: CTA =================
function sign(txt,col){const P=canv15(512,300),x=P.x;x.fillStyle=col;x.beginPath();x.roundRect(6,6,500,288,40);x.fill();x.strokeStyle='#fff';x.lineWidth=12;x.stroke();x.fillStyle='#fff';x.font='900 150px Mont';x.textAlign='center';x.fillText(txt,256,205);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(1.25,.73),new THREE.MeshBasicMaterial({map:P.t,toneMapped:false,transparent:true}),0,0,0,scene,false);m.renderOrder=6;return m;}
const SUP=sign('UP','#e0242c'),SDN=sign('DOWN','#1fa651');
const AUP=CK.icon('up',{color:'#ff2a2a',size:.42}),ADN=CK.icon('down',{color:'#22e06a',size:.42});scene.add(AUP);scene.add(ADN);
popT('NEXT YEAR?',.3,YEL,PP.clone().add(V3(.1,3.0,0)),sWill-.05,sUp-.15);
// ================= per-frame =================
function mikeAt(t,p,ry,o={}){const P=MIKE;P.g.visible=true;P.g.position.copy(p);P.g.rotation.y=ry;P.g.scale.setScalar(o.s||1);relax(P);idle(P,t,1.3);
 if(o.wave)wave(P,'R',t);if(o.arms)armsUp(P,o.arms);if(o.head)pose(P,'head',...o.head);face(P,{jaw:.03+.04*Math.abs(Math.sin(t*7)),smile:o.smile??.25});FK.update(P,t,{expr:o.expr||[['doubt',.3]],look:o.look||cam.position});}
function badge16(t,k){const on=k>.01;BADGE.visible=STEM.visible=PTR.visible=on;if(!on)return;const z=.9;PHOTO.repeat.set(z,z);PHOTO.offset.set(.05,.05);
 const wig=t>sVetoes?Math.exp(-(t-sVetoes)*5)*Math.sin((t-sVetoes)*30)*.07:0;BADGEI.rotation.z=wig;FLASH.material.opacity=t>sVetoes-.02&&t<sOverride?.4*Math.exp(-(t-sVetoes)*4.5):0;
 BADGE.position.copy(DC).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(k*(1+.05*Math.sin(t*2.2)));STEM.scale.set(1,k,1);face2cam(PTR,DC.clone().add(V3(0,BH-BR*k-.32,0)));PTR.scale.setScalar(k);}
function story16(t){if(t<sMeet-.05)return;const pl=place(t);
 WF16.style.opacity=String(Math.max(...FLASHES.map(f=>Math.max(0,1-Math.abs(t-f)/.14)))*.95);
 CARDS16.forEach(m=>m.visible=false);ARUP.visible=ARDN.visible=false;
 const onMap=pl==='map';PUMP.visible=onMap;if(onMap){PUMP.scale.setScalar(1);screen15('$4.04','#ff3b3b');}
 MIKE.g.visible=false;
 // ---- A / F: map with Mike at the pump
 if(onMap){const cta=t>=sUp-.05;
  mikeAt(t,MKP,Math.PI/2-.12,{s:CSC,wave:cta&&t<sComment+.5,smile:cta?.5:.2,expr:cta?[['joy',.5]]:t>=sFourteen&&t<sThing1?[['shock',.7]]:[['doubt',.35]],look:cta?cam.position:t<sMike+.4?cam.position:PRICE_P,arms:t>=sFourteen&&t<sThing1?.18:0});
  [[SUP,PP.clone().add(V3(.3,3.3,1.05)),sUp-.02,AUP,1],[SDN,PP.clone().add(V3(.3,3.3,-1.05)),sDown-.02,ADN,-1]].forEach(([m,p,t0,ic,sg])=>{const k=t>=sWill?pop(t,t0,.3):0;PS15(m,k);if(m.visible){m.position.copy(p);m.position.y+=.04*Math.sin(t*3+sg);m.quaternion.copy(cam.quaternion);}
   if(t>=sWill)CK.iconAnim(ic,t,t0+.1,1e9,{pos:p.clone().add(V3(0,.6,0)),cam,spin:.3});else ic.visible=false;});}
 else{SUP.visible=SDN.visible=AUP.visible=ADN.visible=false;}
 CK.iconAnim(UPA,t,sFourteen-.05,sThing1-.1,{pos:PP.clone().add(V3(.1,3.45,.85)),cam,spin:.3});
 // ---- B: room 2 (tax)
 const r2=pl==='room2';T1.visible=r2;LOCK.visible=CAPR.visible=r2&&t<sMath-.1;
 if(r2){const tk=pop(t,sThing1-.02,.35);T1.scale.setScalar(Math.max(.001,tk));
  const lk=pop(t,s18-.08,.3);LOCK.scale.setScalar(Math.max(.001,lk));LOCK.rotation.y=.3*Math.sin(t*1.5);SHK.position.y=.25+.14*sm(sPause,sPause+.25,t);
  const ck=pop(t,sOnly-.08,.35);CAPR.scale.setScalar(Math.max(.001,ck));CAPR.visible=CAPR.visible&&ck>.01;
  const math=t>=sMath;mikeAt(t,MKR2,-.15,{expr:math?[['doubt',.5],['shock',sm(s276,s276+.2,t)*.4]]:[['doubt',.4]],look:math?V3(DX,2,DZ):t<sOnly?LOCK.position:CAPR.position.clone().add(V3(0,1.5,0)),arms:t>sFive?.2:0});}
 // ---- C: room 1 (oil jug)
 const r1=pl==='room1';JUG.visible=JCAP.visible=JLBL.visible=T2.visible=r1;LAYM.forEach(m=>m.visible=false);
 if(r1){T2.scale.setScalar(Math.max(.001,pop(t,sThing2-.02,.35)));
  mikeAt(t,MKR1,-.35,{expr:[['doubt',.4],['shock',sm(sHalf,sHalf+.3,t)*.4]],look:t<sHalf?JLBL.position:V3(JX,1.2,JZ),arms:t>sWash&&t<sRefining?.18:0});
  const op=sm(sHalf-.4,sHalf-.05,t);JCAP.position.set(JX+op*.15,JH+.55+op*1.6,JZ-op*.5);JCAP.rotation.z=op*2.4;JCAP.visible=op<.98;
  LAYM.forEach((m,i)=>{const k=sm(LT[i]-.05,LT[i]+.45,t);m.visible=k>.01;if(!m.visible)return;const h=m.userData.h*k;m.scale.set(1,Math.max(.001,h),1);m.position.y=m.userData.y0+h/2;});}
 if(r1)CK.iconAnim(XWA,t,sWash+.1,sRefining-.1,{pos:V3(JX+1.3,2.55,JZ-.2),cam,spin:.3});else XWA.visible=false;
 // ---- C2: room 3 (Hormuz)
 const r3=pl==='room3';HZC.visible=r3;if(r3){const k=pop(t,sHz-.02,.35);HZC.scale.setScalar(Math.max(.001,k));
  mikeAt(t,MKR3,Math.PI*.9,{expr:[['doubt',.55]],arms:t>sNo?.3:0,smile:.05,look:HZC.position});CK.iconAnim(XHZ,t,sDisrupted+.1,sThing3-.1,{pos:V3(EX,1.85,EZ-.25),cam,spin:.2});}else XHZ.visible=false;
 // ---- D: map (president)
 const d3=pl==='map3';CAPG.visible=d3;if(d3){CAPG.scale.setScalar(CSCL*(1+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sPasses+.02)/.3)))));
  PCONG.visible=true;face2cam(PCONG,CP.clone().add(V3(.55,.2,0)));PCONG.scale.setScalar(1);
  const ck3=pop(t,sThing3-.02,.35);PS15(T3,ck3);if(T3.visible){T3.position.copy(mxz(-81.3,39.1,5.75));T3.quaternion.copy(cam.quaternion);}}
 else if(t>=sMeet){PCONG.visible=false;T3.visible=false;}
 badge16(t,d3?pop(t,sThing3,.35):0);
 if(d3){CK.iconAnim(CKP,t,sPasses+.05,sThirds+.6,{pos:CP.clone().add(V3(.4,2.55,.85)),cam,spin:.3});CK.iconAnim(CKS,t,sSigns+.05,sOverride-.1,{pos:DC.clone().add(V3(.4,BH+1.35,.55)),cam,spin:.3});
  CK.iconAnim(XVE,t,sVetoes+.05,sSo2-.1,{pos:DC.clone().add(V3(.4,BH+1.4,-.6)),cam,spin:.3});}else{CKP.visible=CKS.visible=XVE.visible=false;}
 // ---- E: room 4 (pie)
 const r4=pl==='room4';PIE.visible=r4;if(r4){PIE.rotation.z=.15*Math.sin(t*.8);
  SLM.forEach((g,i)=>{const t0=i===0?sSmall-.25:i===1?sBiggest-.15:1e9,k=sm(t0,t0+.3,t);g.position.set(Math.sin(g.userData.mid)*.35*k,-Math.cos(g.userData.mid)*.35*k,0);g.scale.setScalar(1+.08*k);});
  const pk=pop(t,sPen-.1,.35);PS15(PENC,pk);if(PENC.visible){PENC.position.set(FX,3.7,FZ-.3);PENC.quaternion.copy(cam.quaternion);}
  mikeAt(t,MKR4,-.4,{expr:[['doubt',.4]],look:PIE.position,arms:t>sPen?.2:0});}else PENC.visible=false;
 TR.g.visible=false;}
// ================= story camera =================
const BXr=(x0,y0,z0,x1,y1,z1)=>CK.box([x0,y0,z0],[x1,y1,z1]);
const MBr=p=>BXr(p.x-.35,0,p.z-.3,p.x+.35,1.9,p.z+.3);
const MKB3=BXc(MKP,.45,3.05),PRB=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.0],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.0]),PRB2=CK.box([PP.x-.2,PP.y,PP.z-2.2],[PP.x+.2,PP.y+3.6,PP.z+2.2]);
const JB=BXr(JX-2.0,0,JZ-.3,JX+2.6,4.5,JZ+.3);
const SEC=[];const sec=(t0,keys)=>SEC.push({t0,keys});
sec(sMeet,[[sMeet,FT15([MKB3,PUB,PRB],[1,.42,.12],38)],[sYear+.2,FT15([PRB2,MKB3],[1,.42,.05],40)],[sFourteen+.1,FT15([MKB3,PUB,BXc(PP,.5,3.6)],[1,.4,-.05],38)],[sThing1,FT15([MKB3,PUB,BXc(PP,.5,3.6)],[1,.38,0],38,{slack:.95})]]);
sec(sThing1,[[sThing1,FT15([BXr(DX-1.2,3.5,DZ+2,DX+1.2,4.4,DZ+2),MBr(MKR2)],[0,.12,-1],42)],[s18,FT15([BXr(DX-.1,.4,DZ-.3,DX+2.2,2.6,DZ-.3),BXr(DX-1.2,3.5,DZ+2,DX+1.2,4.4,DZ+2),MBr(MKR2)],[-.04,.1,-1],42)],
 [sOnly,FT15([BXr(DX-2.6,0,DZ,DX+2.2,4.4,DZ+1.2),MBr(MKR2)],[.03,.13,-1],44)],[sMath,FT15([BXr(DX-1.3,.7,DZ,DX+1.3,4.4,DZ),MBr(MKR2)],[0,.12,-1],42)],[s276,FT15([BXr(DX-1.3,.7,DZ,DX+1.3,4.4,DZ)],[0,.1,-1],40)],[sThing2,FT15([BXr(DX-1.3,.7,DZ,DX+1.3,4.4,DZ)],[.02,.1,-1],40,{slack:.96})]]);
sec(sThing2,[[sThing2,FT15([JB,MBr(MKR1)],[0,.12,-1],44)],[sHalf+.2,FT15([JB],[.02,.1,-1],42)],[sWash,FT15([JB,BXr(JX+.6,2.6,JZ-.2,JX+2.0,3.3,JZ-.2)],[-.02,.1,-1],42)],[sTaxes,FT15([JB],[0,.1,-1],42)],[sHz,FT15([JB],[.02,.1,-1],42,{slack:.96})]]);
const HB=BXr(EX-3.0,0,EZ-.4,EX+2.75,3.1,EZ);
sec(sHz,[[sHz,FT15([BXr(EX-1.1,.4,EZ,EX+1.1,3.1,EZ),MBr(MKR3)],[0,.12,-1],40)],[sFifth,FT15([BXr(EX-1.1,.4,EZ,EX+2.75,3.1,EZ)],[-.03,.12,-1],42)],[sTwenty,FT15([HB],[0,.12,-1],44)],[sNo,FT15([HB,MBr(MKR3)],[0,.12,-1],44)],[sThing3,FT15([HB,MBr(MKR3)],[.02,.12,-1],44,{slack:.96})]]);
const T3B=BXc(mxz(-81.3,39.1),.4,6.25);
sec(sThing3,[[sThing3,FT15([gbox(-92,36,-74,42,0,.1),DCB,CAPB,T3B],[1,.5,0],40)],[sMay,FT15([DCB,BXc(DC,.5,BH+1.3),T3B],[1,.42,.05],38)],[sPasses,FT15([gbox(-92,36,-74,42,0,.1),DCB,CAPB,T3B],[1,.5,-.03],40)],
 [sThirds,FT15([CAPB,BXc(CP,.6,3.1),DCB],[1,.45,-.05],38)],[sSo2,FT15([CAPB,BXc(CP,.6,3.1),DCB],[1,.44,-.07],38,{slack:.96})]]);
const PB=BXr(FX-2.9,.1,FZ-.4,FX+2.9,4.2,FZ);
sec(sSo2,[[sSo2,FT15([PB,MBr(MKR4)],[0,.25,-1],44)],[sSmall,FT15([PB],[.02,.25,-1],42)],[sBiggest,FT15([PB],[0,.25,-1],42)],[sPen,FT15([PB,MBr(MKR4)],[0,.22,-1],44)],[sWill,FT15([PB,MBr(MKR4)],[.02,.22,-1],44,{slack:.96})]]);
sec(sWill,[[sWill,FT15([MKB3,PUB,BXc(PP,.5,3.4)],[1,.4,.08],38)],[sUp,FT15([MKB3,PUB,CK.box([PP.x,PP.y+2.8,PP.z-1.8],[PP.x+.4,PP.y+4.4,PP.z+1.8])],[1,.38,.03],42)],[SEND,FT15([MKB3,PUB,CK.box([PP.x,PP.y+2.8,PP.z-1.8],[PP.x+.4,PP.y+4.4,PP.z+1.8])],[1,.36,-.03],42,{slack:.94})]]);
const CAMH16=window.CAM14;
window.CAM14=t=>{if(t<HOOK_END)return CAMH16(t);let s=SEC[0];for(const x of SEC)if(t>=x.t0)s=x;return unch15(herm15(s.keys,t));};
window.CAM14_END=SEND+1;
function animateAll(t){animate(t);story16(t);}
