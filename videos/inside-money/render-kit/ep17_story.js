// ================= EP17 STORY (after the hook) - runs inside the hook block (shares mxz, SP, STUB, STUBC, stub17, CARDS17, GLOW3, BADGE*, PHOTO, MI, BH, BR, pill, face2cam, canv15, herm15, unch15, gbox, BXc) =================
// A  map: El-Sayed badge (SENATOR-ELECT) + Trump badge (PRESIDENT); map back to the flag, then blue again on 'picture it' (PRESIDENT?)
// R1 room: Mike + his paycheck as a pie, the TAX slice is cut and flies away before he sees it
// R2 room: DAY 1 calendar + El-Sayed photo (PRESIDENT?) + the pay stub pops twice
// R3 room CLUE 1: PRESIDENT (X) -> Capitol = CONGRESS (check) -> ARTICLE I scroll
// R4 room CLUE 2: gold pile = billionaires, WEALTH TAX, 5% layer lifts, 938, OWN vs EARN, SUPPORTERS vs CRITICS (bars fly off)
// R5 room CLUE 3: Mike at the kitchen table, FAMILIES $100,000, HOPES, EXPERTS DISAGREE
// B  map: the 3 clue cards get checks -> THE ANSWER: pay stub SAME / NO CHANGE -> ASK / SIGN / VETO -> Capitol BILL 2/3 -> '?'
// C  room CTA: Mike + UP / DOWN signs. White flash on every change of place. Few SFX (user rule).
const WS=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const sHe=WS('he'),sSenate=WS('senate'),sTrump=WS('trump'),sPicture=WS('picture'),sMeet=WS('meet'),sEvery=WS('every'),sFriday=WS('friday'),sSlice=WS('slice'),sTaxes=WS('taxes'),sBefore=WS('before'),sCent=WS('cent'),
 sNow=WS('now'),sFirst=WS('first'),sChecks=WS('checks'),sPay2=WS('pay',1),sTwice=WS('twice'),
 sClue1=WS('clue',0),sWho=WS('who'),sNot1=WS('not',0),sCong1=WS('congress',0),sArticle=WS('article'),sConst=WS('constitution'),
 sClue2=WS('clue',1),sWhat2=WS('what',0),sHigher=WS('higher'),sBill1=WS('billionaires',0),sWealth=WS('wealth',0),sCalc=WS('calculator'),s5=WS('5'),s938=WS('938'),
 sThats=WS('thats',1),sOwn=WS('own'),sEarn=WS('earn'),sSupp=WS('supporters'),sCrit=WS('critics'),sMove=WS('move'),sFall=WS('fall'),
 sClue3=WS('clue',2),sHopes=WS('hopes'),sFam=WS('families'),s100=WS('100000'),sExperts=WS('experts'),
 sStay=WS('stay'),sNext=WS('next'),sSoA=WS('so',0),sAnswer=WS('answer',1),sTomorrow=WS('tomorrow'),sSame=WS('same'),sNot2=WS('not',2),
 sPresB=WS('president',4),sAsk=WS('ask'),sSign=WS('sign'),sVeto1=WS('veto',0),sBut=WS('but',1),sCong2=WS('congress',1),sPasses=WS('passes'),sBillB=WS('bill'),sThirds=WS('thirds'),sNobody=WS('nobody'),
 sSoC=WS('so',1),sUp=WS('up'),sDown=WS('down'),sComment=WS('comment'),SEND=TLN.dur;
const FLASHES=[sMeet,sNow,sClue1,sClue2,sClue3,sStay,sSoC];
const place=t=>t<sMeet?'mapA':t<sNow?'r1':t<sClue1?'r2':t<sClue2?'r3':t<sClue3?'r4':t<sStay?'r5':t<sSoC?'mapB':'cta';
const PS17=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const WF17=document.createElement('div');WF17.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF17);
const BLU=0x4d9bff;
const FT17=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.12,margin:.1,...o,slack:1});   // top .12 = room for the clue HUD   // story: no hook title -> normal headroom
// ---------- shared builders ----------
function badgeG(map,ring,r=.62){const g=new THREE.Group();scene.add(g);const i=new THREE.Group();g.add(i);
 add(new THREE.RingGeometry(r*1.02,r*1.3,96),new THREE.MeshBasicMaterial({color:ring,toneMapped:false,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,i,false);
 add(new THREE.CircleGeometry(r*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,i,false);
 const f=add(new THREE.CircleGeometry(r,96),new THREE.MeshBasicMaterial({map,toneMapped:false}),0,0,0,i,false);f.renderOrder=4;g.visible=false;return g;}
function capitol(parent){const wm=M(0xf4f2ec,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,parent);add(B(2.8,.9,1.0),wm,0,.63,0,parent);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,-.55,parent);add(B(2.9,.12,1.1),gm,0,1.14,0,parent);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,parent);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,parent);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,parent);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,parent);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52,parent);}
function clueCard(n){const P=canv15(1024,384),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(6,6,1012,372,40);x.fill();x.strokeStyle='#fff';x.lineWidth=10;x.stroke();
 x.fillStyle='#ffc61a';x.beginPath();x.arc(200,192,130,0,Math.PI*2);x.fill();x.fillStyle='#0b1530';x.font='900 200px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),200,205);
 x.fillStyle='#fff';x.font='900 190px Mont';x.textAlign='left';x.fillText('CLUE',390,205);P.t.needsUpdate=true;return P.t;}
const basic=(w,h,map,x,y,z)=>{const m=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false,transparent:true,side:THREE.DoubleSide}),x,y,z,scene,false);m.rotation.y=Math.PI;return m;};
function sign(txt,col){const P=canv15(512,300),x=P.x;x.fillStyle=col;x.beginPath();x.roundRect(6,6,500,288,40);x.fill();x.strokeStyle='#fff';x.lineWidth=12;x.stroke();x.fillStyle='#fff';x.font='900 150px Mont';x.textAlign='center';x.fillText(txt,256,205);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(1.25,.73),new THREE.MeshBasicMaterial({map:P.t,toneMapped:false,transparent:true}),0,0,0,scene,false);m.renderOrder=6;m.visible=false;return m;}
const pillAt=(s,w)=>{const m=pill(s,w);m.material.depthTest=false;m.renderOrder=9;m.visible=false;return m;};
const icon=(k,c,s)=>{const o=CK.icon(k,{color:c,size:s});scene.add(o);o.visible=false;return o;};
// ================= A: map - SENATOR-ELECT vs PRESIDENT today =================
const TPH=await new THREE.TextureLoader().loadAsync('assets/trump_portrait.jpg');TPH.colorSpace=THREE.SRGBColorSpace;TPH.anisotropy=8;
const TDC=mxz(-75.2,38.4),TBH=1.55,TBR=.56;
const TBADGE=badgeG(TPH,new THREE.Color(3,.55,.45),TBR);
const TSTEM=add(new THREE.ConeGeometry(.1,TBH-TBR,24),M(0xffffff,.4),TDC.x,US_Y+(TBH-TBR)/2,TDC.z,scene,false);TSTEM.rotation.x=Math.PI;TSTEM.visible=false;
const PSEN=pillAt('SENATOR',1.2),PPRES=pillAt('PRESIDENT?',1.35),PTRU=pillAt('PRESIDENT',1.2),PTODAY=pillAt('TODAY',.8);
// ================= rooms (charcoal wall + floor; camera looks +z, SCREEN RIGHT = -x) =================
const RX=-300,RZ=0,Z0=RZ+2.4,XR=[RX,RX-10,RX-20,RX-30,RX-40];
{const wall=new THREE.MeshStandardMaterial({color:0x2a2c31,roughness:.95,envMapIntensity:.2}),flo=new THREE.MeshStandardMaterial({color:0x34363c,roughness:.9,envMapIntensity:.2});
 const w=add(new THREE.PlaneGeometry(110,20),wall,RX-20,10,RZ+5,scene,false);w.rotation.y=Math.PI;w.receiveShadow=true;
 const f=add(new THREE.PlaneGeometry(120,60),flo,RX-20,.035,RZ-20,scene,false);f.rotation.x=-Math.PI/2;f.receiveShadow=true;
 add(B(110,.1,.08),M(0x55585f,.6),RX-20,.08,RZ+4.96,scene,false);
 for(const zx of XR){const L=new THREE.SpotLight(0xfff3e2,14,14,.6,.7,1.2);L.position.set(zx+.5,6,RZ-4);L.target.position.set(zx,1.3,RZ+2);scene.add(L);scene.add(L.target);}}
const MKR=X=>V3(X+1.5,0,Z0-.8),M3P=V3(XR[2]+.15,0,Z0-1.1);
// ---- R1: the paycheck pie ----
const X1=XR[0];
const PIE=new THREE.Group();PIE.position.set(X1-.2,1.65,Z0);PIE.rotation.x=.22;scene.add(PIE);
const PSL=[[.84,0x1fa651],[.16,0xd21e2a]];let a0=Math.PI/2;
const PIES=PSL.map(([f,c])=>{const g=new THREE.Group();PIE.add(g);const th=f*Math.PI*2;
 const m=add(new THREE.CylinderGeometry(1.25,1.25,.28,64,1,false,a0,th),new THREE.MeshStandardMaterial({color:c,roughness:.4,metalness:.05,emissive:c,emissiveIntensity:.15}),0,0,0,g);m.rotation.x=Math.PI/2;
 g.userData.mid=a0+th/2;a0+=th;return g;});
popT('PAYCHECK',.26,GRN,V3(X1-.2,3.35,Z0-.2),sEvery-.05,sNow-.1);popT('EVERY FRIDAY',.16,WHT,V3(X1-.2,3.0,Z0-.2),sFriday-.05,sNow-.1);
const TAXL=popT('TAX',.3,RED,V3(0,0,0),sSlice+.1,sNow-.1);
popT('BEFORE HE SEES IT',.16,YEL,V3(X1-.2,.42,Z0-.4),sBefore-.05,sNow-.1);
// ---- R2: DAY 1 ----
const X2=XR[1];
const ELW=badgeG(PHOTO,new THREE.Color(.45,1.1,3),.6);const PDAY=pillAt('PRESIDENT?',1.3);
const CALT=tex(512,600,x=>{x.fillStyle='#f7f6f1';x.beginPath();x.roundRect(6,6,500,588,30);x.fill();x.fillStyle='#d21e2a';x.beginPath();x.roundRect(6,6,500,170,[30,30,0,0]);x.fill();
 x.fillStyle='#fff';x.font='900 120px Mont';x.textAlign='center';x.fillText('DAY',256,135);x.fillStyle='#14305e';x.font='900 380px Mont';x.fillText('1',256,520);});
const CAL=basic(1.15,1.35,CALT,X2-1.55,2.35,Z0+.2);
const STUB2=basic(1.2,1.6,STUBC.t,X2+.05,1.45,Z0-.5);STUB2.renderOrder=3;
popT('FIRST MORNING',.15,YEL,V3(X2-1.55,3.2,Z0),sFirst-.05,sChecks-.1);
popT('?',.6,YEL,V3(X2+.05,2.75,Z0-.5),sTwice-.05,sClue1-.1);
// ---- R3: CLUE 1 - who writes the tax law ----
const X3=XR[2];
const C1=basic(2.4,.9,clueCard(1),X3-.2,3.55,Z0+2.2);
popT('WHO WRITES THE TAX LAW?',.12,WHT,V3(X3-.2,2.9,Z0+.2),sWho-.05,sNot1-.1);
const P3PRES=pillAt('PRESIDENT',1.2);const X3X=icon('x','#ff2a2a',.5);
const CAP3=new THREE.Group();CAP3.position.set(X3-1.1,0,Z0+.8);scene.add(CAP3);capitol(CAP3);CAP3.visible=false;
popT('CONGRESS',.24,GRN,V3(X3-1.1,2.95,Z0+.4),sCong1-.05,sClue2-.1);const C3CK=icon('check','#22e06a',.42);
const SCRT=tex(512,640,x=>{x.fillStyle='#efe2bf';x.beginPath();x.roundRect(20,40,472,560,18);x.fill();x.fillStyle='#d9c79a';x.fillRect(10,20,492,46);x.fillRect(10,574,492,46);
 x.fillStyle='#3a2a14';x.font='900 92px Mont';x.textAlign='center';x.fillText('ARTICLE',256,200);x.font='900 170px Mont';x.fillText('I',256,380);x.fillStyle='#7a6a4a';[440,480,520].forEach(y=>x.fillRect(90,y,332,12));});
const SCR3=basic(1.0,1.25,SCRT,X3+1.15,1.7,Z0+.1);
popT('CONSTITUTION',.15,YEL,V3(X3+1.15,2.55,Z0),sConst-.05,sClue2-.1);
// ---- R4: CLUE 2 - the wealth tax ----
const X4=XR[3];
const C2=basic(2.4,.9,clueCard(2),X4-.2,3.55,Z0+2.2);
const ELW4=badgeG(PHOTO,new THREE.Color(.45,1.1,3),.48);const PWANT=pillAt('WANTS',.85);
const GOLD=new THREE.Group();GOLD.position.set(X4-.2,0,Z0+.2);scene.add(GOLD);const GTOP=new THREE.Group();GOLD.add(GTOP);const FLY=[];
{const gm=new THREE.MeshStandardMaterial({color:0xd4af37,roughness:.25,metalness:1,emissive:0x5a4000,emissiveIntensity:.25});
 for(let l=0;l<6;l++)for(let i=0;i<4;i++)for(let j=0;j<2;j++){const p=l===5?GTOP:GOLD;const b=add(RB(.46,.17,.24,.03),gm,-.72+i*.48,.09+l*.18,-.13+j*.26,p);if(l===4&&j===0)FLY.push({b,x0:b.position.x,y0:b.position.y,i});}}
popT('BILLIONAIRES',.24,YEL,V3(X4-.2,1.55,Z0-.1),sBill1-.05,sCalc-.1);
popT('WEALTH TAX',.24,RED,V3(X4-.2,2.75,Z0),sWealth-.05,sCalc-.1);
popT('CAMPAIGN CALCULATOR',.14,WHT,V3(X4-.2,2.8,Z0),sCalc-.05,sThats-.1);
popT('5%',.45,YEL,V3(X4+1.3,2.0,Z0-.1),s5-.05,sThats-.1);
popT('938',.42,GRN,V3(X4-1.7,2.25,Z0-.1),s938-.05,sThats-.1);popT('BILLIONAIRES',.15,WHT,V3(X4-1.7,1.88,Z0-.1),s938+.1,sThats-.1);popT('(FORBES)',.11,WHT,V3(X4-1.7,1.66,Z0-.1),s938+.2,sThats-.1);
popT('WHAT THEY OWN',.16,GRN,V3(X4+1.45,2.6,Z0-.1),sOwn-.1,sSupp-.1);popT('WHAT THEY EARN',.16,WHT,V3(X4-1.6,2.6,Z0-.1),sEarn-.15,sSupp-.1);
const OWNCK=icon('check','#22e06a',.4),EARNX=icon('x','#ff2a2a',.4);
popT('SUPPORTERS',.22,GRN,V3(X4+1.45,2.75,Z0-.1),sSupp-.05,sClue3-.1);popT('PAY MORE',.3,GRN,V3(X4+1.45,2.3,Z0-.1),sSupp+.4,sClue3-.1);
popT('CRITICS',.22,RED,V3(X4-1.85,2.75,Z0-.1),sCrit-.05,sClue3-.1);popT('MONEY MOVES',.24,RED,V3(X4-1.85,2.3,Z0-.1),sMove-.1,sClue3-.1);
const FALLA=icon('down','#ff2a2a',.45);
// ---- R5: CLUE 3 - Mike's family ----
const X5=XR[4];
const C3=basic(2.4,.9,clueCard(3),X5-.2,3.55,Z0+2.2);
const TABLE=new THREE.Group();TABLE.position.set(X5-.3,0,Z0-.2);scene.add(TABLE);
{const wd=M(0x8a5a32,.6),lg=M(0x3b2a1c,.6);add(RB(2.3,.08,1.05,.03),wd,0,.92,0,TABLE);for(const [a,b] of [[-1,-.4],[1,-.4],[-1,.4],[1,.4]])add(B(.07,.88,.07),lg,a,.46,b,TABLE);
 add(B(.36,.02,.48),M(0xf7f6f1,.6),.3,.97,-.1,TABLE);add(CY(.06,.05,.13,16),M(0xffffff,.3),-.5,1.03,.1,TABLE);}
const ELW5=badgeG(PHOTO,new THREE.Color(.45,1.1,3),.48);const PHOPE=pillAt('HOPES',.85);
popT('FAMILIES',.17,WHT,V3(X5-.2,2.75,Z0+.2),sFam-.05,sStay-.1);popT('$100,000',.36,GRN,V3(X5-.2,2.3,Z0+.2),s100-.05,sStay-.1);
popT('EXPERTS DISAGREE',.17,YEL,V3(X5-.2,1.6,Z0+.2),sExperts-.05,sStay-.1);
const EXU=icon('up','#ff2a2a',.36),EXD=icon('down','#22e06a',.36);
// ================= B: map - THE ANSWER =================
const CHK=[0,1,2].map(()=>icon('check','#22e06a',.42));
popT('THE ANSWER',.32,YEL,SP.clone().add(V3(.4,4.0,0)),sNext-.05,sAnswer+.3);
popT('SAME',.46,GRN,SP.clone().add(V3(.3,4.0,0)),sSame-.05,sPresB-.1);popT('NO CHANGE',.24,WHT,SP.clone().add(V3(.3,3.55,0)),sNot2-.05,sPresB-.1);
const MKM=mxz(-108.6,37.2),MSC=1.4;
const PASK=pillAt('ASK',.7),PSIGN=pillAt('SIGN',.8),PVETO=pillAt('VETO',.8);const SCK=icon('check','#22e06a',.36),VX=icon('x','#ff2a2a',.36);
const CPB=mxz(-77.2,38.6),CSCL=.62;const CAPB=new THREE.Group();CAPB.position.copy(CPB);CAPB.rotation.y=Math.PI/2;CAPB.scale.setScalar(CSCL);scene.add(CAPB);capitol(CAPB);CAPB.visible=false;
const PCONG=pillAt('CONGRESS',1.3);
popT('BILL',.28,WHT,CPB.clone().add(V3(.4,2.05,-1.05)),sBillB-.05,sNobody-.1);const BCK=icon('check','#22e06a',.36);
popT('2/3',.5,YEL,CPB.clone().add(V3(.4,3.0,.35)),sThirds-.1,sNobody-.1);popT('TO BEAT A VETO',.14,WHT,CPB.clone().add(V3(.4,2.62,.35)),sThirds,sNobody-.1);
popT('?',.8,YEL,CPB.clone().add(V3(.4,2.7,0)),sNobody-.05,sSoC-.1);
// ================= C: CTA =================
const SUP=sign('UP','#e0242c'),SDN=sign('DOWN','#1fa651');const AUP=icon('up','#ff2a2a',.42),ADN=icon('down','#22e06a',.42);
popT("MIKE'S TAX?",.26,YEL,V3(X1+.1,3.25,Z0-.6),sSoC-.05,SEND+1);
// ================= REAL ICONS (user 2026-11-07): flat, high contrast, only where the line needs them =================
function flatIcon(draw,sz=.85){const P=canv15(512,512),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(10,10,492,492,90);x.fill();x.strokeStyle='#fff';x.lineWidth=14;x.stroke();
 x.save();draw(x);x.restore();P.t.needsUpdate=true;const m=add(new THREE.PlaneGeometry(sz,sz),new THREE.MeshBasicMaterial({map:P.t,toneMapped:false,transparent:true}),0,0,0,scene,false);m.renderOrder=7;m.visible=false;return m;}
const IC={
 cal:flatIcon(x=>{x.fillStyle='#fff';x.beginPath();x.roundRect(110,120,292,290,24);x.fill();x.fillStyle='#d21e2a';x.beginPath();x.roundRect(110,120,292,90,[24,24,0,0]);x.fill();
  x.fillStyle='#fff';x.fillRect(160,90,26,60);x.fillRect(326,90,26,60);x.fillStyle='#0b1530';x.font='900 120px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('FRI',256,320);}),
 bill:flatIcon(x=>{x.fillStyle='#2fae5b';x.beginPath();x.roundRect(70,150,372,212,20);x.fill();x.strokeStyle='#d8f5df';x.lineWidth=10;x.strokeRect(92,172,328,168);
  x.fillStyle='#d8f5df';x.beginPath();x.arc(256,256,62,0,Math.PI*2);x.fill();x.fillStyle='#1e7a3e';x.font='900 100px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('$',256,262);}),
 calc:flatIcon(x=>{x.fillStyle='#e9ecf2';x.beginPath();x.roundRect(140,90,232,332,26);x.fill();x.fillStyle='#1d2b45';x.fillRect(166,116,180,70);x.fillStyle='#7cff9b';x.font='900 56px Mont';x.textAlign='right';x.textBaseline='middle';x.fillText('5%',336,153);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){x.fillStyle=c===2?'#ffc61a':'#3a4a68';x.beginPath();x.roundRect(170+c*60,212+r*66,46,48,10);x.fill();}}),
 house:flatIcon(x=>{x.fillStyle='#d21e2a';x.beginPath();x.moveTo(256,96);x.lineTo(430,250);x.lineTo(82,250);x.closePath();x.fill();x.fillStyle='#fff';x.fillRect(122,250,268,170);
  x.fillStyle='#8a5a32';x.fillRect(226,320,60,100);x.fillStyle='#4d9bff';x.fillRect(150,280,56,50);x.fillRect(306,280,56,50);}),
 car:flatIcon(x=>{x.fillStyle='#ffc61a';x.beginPath();x.roundRect(70,240,372,110,34);x.fill();x.beginPath();x.moveTo(150,240);x.lineTo(200,170);x.lineTo(320,170);x.lineTo(370,240);x.closePath();x.fill();
  x.fillStyle='#bfe0ff';x.beginPath();x.moveTo(178,236);x.lineTo(210,186);x.lineTo(252,186);x.lineTo(252,236);x.closePath();x.fill();x.beginPath();x.moveTo(268,236);x.lineTo(268,186);x.lineTo(310,186);x.lineTo(342,236);x.closePath();x.fill();
  x.fillStyle='#111';[160,352].forEach(cx=>{x.beginPath();x.arc(cx,352,40,0,Math.PI*2);x.fill();});x.fillStyle='#bbb';[160,352].forEach(cx=>{x.beginPath();x.arc(cx,352,16,0,Math.PI*2);x.fill();});}),
 plane:flatIcon(x=>{x.translate(256,256);x.rotate(-.6);x.fillStyle='#fff';x.beginPath();x.roundRect(-190,-24,380,48,24);x.fill();
  x.beginPath();x.moveTo(-20,-20);x.lineTo(60,-170);x.lineTo(100,-170);x.lineTo(70,-20);x.closePath();x.fill();x.beginPath();x.moveTo(-20,20);x.lineTo(60,170);x.lineTo(100,170);x.lineTo(70,20);x.closePath();x.fill();
  x.beginPath();x.moveTo(-170,-20);x.lineTo(-150,-90);x.lineTo(-120,-90);x.lineTo(-120,-20);x.closePath();x.fill();x.fillStyle='#d4af37';x.beginPath();x.arc(150,90,52,0,Math.PI*2);x.fill();x.fillStyle='#0b1530';x.font='900 64px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('$',150,94);}),
 doc:flatIcon(x=>{x.fillStyle='#fff';x.beginPath();x.moveTo(140,80);x.lineTo(320,80);x.lineTo(380,140);x.lineTo(380,432);x.lineTo(140,432);x.closePath();x.fill();x.fillStyle='#c9ced8';x.beginPath();x.moveTo(320,80);x.lineTo(320,140);x.lineTo(380,140);x.closePath();x.fill();
  x.fillStyle='#0b1530';x.font='900 66px Mont';x.textAlign='center';x.fillText('BILL',260,200);x.fillStyle='#9aa3b5';[250,290,330,370].forEach(y=>x.fillRect(176,y,168,14));}),
 earn:null};
IC.earn=flatIcon(x=>{x.fillStyle='#fff';x.beginPath();x.roundRect(110,130,292,252,20);x.fill();x.fillStyle='#14305e';x.fillRect(110,130,292,62);x.fillStyle='#fff';x.font='900 46px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('PAYCHECK',256,163);
 x.fillStyle='#2fae5b';x.font='900 120px Mont';x.fillText('$',256,290);});
IC.home2=flatIcon(x=>{x.fillStyle='#4d9bff';x.beginPath();x.moveTo(256,96);x.lineTo(430,250);x.lineTo(82,250);x.closePath();x.fill();x.fillStyle='#fff';x.fillRect(122,250,268,170);
 x.fillStyle='#0b1530';[[200,330],[256,315],[312,330]].forEach(([cx,cy],i)=>{x.beginPath();x.arc(cx,cy-40,i===1?24:20,0,Math.PI*2);x.fill();x.beginPath();x.roundRect(cx-(i===1?28:24),cy-12,i===1?56:48,i===1?100:80,14);x.fill();});});
// [icon, place, t0, t1, position]
const ICT=[[IC.cal,'r1',sFriday-.05,sNow-.1,V3(X1-1.75,2.95,Z0-.2)],[IC.bill,'r1',WS('pay',0)-.05,sNow-.1,V3(X1+.95,2.85,Z0-.2)],
 [IC.calc,'r4',sCalc-.05,s938-.1,V3(X4-1.65,2.05,Z0-.1)],[IC.house,'r4',sOwn,sSupp-.1,V3(X4+1.9,2.0,Z0-.1)],[IC.car,'r4',sOwn+.15,sSupp-.1,V3(X4+1.0,2.0,Z0-.1)],
 [IC.earn,'r4',sEarn-.1,sSupp-.1,V3(X4-1.6,2.0,Z0-.1)],[IC.plane,'r4',sMove-.1,sClue3-.1,V3(X4-1.6,1.75,Z0-.1)],
 [IC.home2,'r5',sFam-.05,sStay-.1,V3(X5-.2,3.35,Z0+.2)],[IC.doc,'mapB',sBillB-.05,sNobody-.1,CPB.clone().add(V3(.4,1.45,-1.05))]];
function icons17(t,pl){for(const [m,P,t0,t1,p] of ICT){const k=pl===P&&t>=t0&&t<t1+.15?pop(t,t0,.3)*(t>t1?1-(t-t1)/.15:1):0;PS17(m,k);if(m.visible){m.position.copy(p);m.position.y+=.03*Math.sin(t*2.6+p.x);m.quaternion.copy(cam.quaternion);}}}
// ================= CLUE PROGRESS HUD + big green check when a clue is DONE (user 2026-11-07: keeps the viewer waiting for the others) =================
const HUD=document.createElement('div');HUD.style.cssText='position:absolute;left:0;width:720px;top:2.6%;display:none;justify-content:center;gap:26px;z-index:4;font-family:Mont,sans-serif;font-weight:800';
const DOTS=[1,2,3].map(n=>{const d=document.createElement('div');d.style.cssText='width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:50px;border:6px solid #fff;background:#0b1530;color:#ffc61a;box-shadow:0 4px 12px rgba(0,0,0,.5)';d.textContent=n;HUD.appendChild(d);return d;});
document.getElementById('ov').appendChild(HUD);
const CHKSVG='<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M22 52 L42 72 L80 30" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BIG=document.createElement('div');BIG.style.cssText='position:absolute;left:230px;top:30%;width:260px;height:260px;border-radius:50%;background:#1fa651;border:10px solid #fff;z-index:4;box-shadow:0 10px 30px rgba(0,0,0,.55);display:none;padding:30px;box-sizing:border-box';BIG.innerHTML=CHKSVG;
document.getElementById('ov').appendChild(BIG);
const CDONE=[sClue2-.55,sClue3-.55,sStay-.55],CSTART=[sClue1,sClue2,sClue3];
function hud17(t){const on=t>=sClue1-.02&&t<sAnswer-.1;HUD.style.display=on?'flex':'none';
 DOTS.forEach((d,i)=>{const done=t>=CDONE[i]+.25,act=!done&&t>=CSTART[i];const key=done?'d':act?'a':'w';if(d.dataset.k!==key){d.dataset.k=key;
  if(done){d.innerHTML=CHKSVG;d.style.background='#1fa651';d.style.borderColor='#fff';d.style.padding='10px';}else{d.textContent=String(i+1);d.style.padding='0';d.style.background='#0b1530';d.style.color=act?'#ffc61a':'#8a93a8';d.style.borderColor=act?'#ffc61a':'#8a93a8';}}
  const pk=done?1+.25*Math.max(0,Math.sin(Math.PI*Math.min(1,(t-CDONE[i]-.25)/.3))):act?1.08:1;d.style.transform=`scale(${pk})`;});
 let b=0;for(const c of CDONE){if(t>=c&&t<c+.5){const u=(t-c)/.5;b=u<.3?(u/.3)*(1+.2*Math.sin(u/.3*Math.PI)):1-Math.max(0,(u-.75)/.25);}}
 BIG.style.display=b>.01?'block':'none';if(b>.01){BIG.style.transform=`scale(${b})`;BIG.style.opacity=String(Math.min(1,b*1.4));}}
// ================= per-frame =================
// Mike (user 2026-11-07): FACES THE CAMERA, walks into every new place, points at what the voice explains, reacts (shock / shrug / think / cheer / nod / shake), talking hands when idle.
const RYR=Math.PI+.45;   // rooms: facing the camera, turned a little toward the subject (screen right)
const GEST={pointL:(P,k)=>arm(P,'L',AD[0]+.55*k,AD[2]-1.35*k,.15*k),pointR:(P,k)=>arm(P,'R',AD[0]+.55*k,AD[2]-1.35*k,.15*k),
 shock:(P,k)=>{armsUp(P,.38*k);pose(P,'spine03',-.08*k,0,0);},shrug:(P,k)=>{arm(P,'L',AD[0]+.3*k,AD[2]-.6*k,1.15*k);arm(P,'R',AD[0]+.3*k,AD[2]-.6*k,1.15*k);},
 cheer:(P,k,t)=>armsUp(P,(.85+.08*Math.sin(t*9))*k),think:(P,k)=>arm(P,'R',AD[0]+.95*k,AD[2]-.35*k,2.1*k),self:(P,k)=>arm(P,'R',AD[0]+.75*k,AD[2]-.15*k,1.7*k),
 nod:(P,k,t)=>pose(P,'neck01',.16*k*Math.sin(t*9),0,0),shake:(P,k,t)=>pose(P,'neck01',0,.3*k*Math.sin(t*9),0)};
function mikeAt(t,p,ry,o={}){const P=MIKE;P.g.visible=true;P.g.scale.setScalar(o.s||1);relax(P);idle(P,t,1.3);
 let pos=p.clone(),r=ry,walking=false;
 if(o.walk){const [t0,from]=o.walk,d=o.wd||.85,k=Math.min(1,Math.max(0,(t-t0)/d)),dir=p.clone().sub(from),rw=Math.atan2(dir.x,dir.z);
  if(k<1){pos=from.clone().lerp(p,k);r=rw;walking=true;walk(P,t,.45);}else{const u=sm(t0+d,t0+d+.3,t);let dr=ry-rw;dr=Math.atan2(Math.sin(dr),Math.cos(dr));r=rw+dr*u;}}
 P.g.position.copy(pos);P.g.rotation.y=r;
 let busy=walking;
 if(!walking){if(o.arms)armsUp(P,o.arms);
  for(const [a,b,type] of (o.g||[])){const k=Math.min(sm(a,a+.25,t),1-sm(b-.2,b,t));if(k>.01){GEST[type](P,k,t);busy=true;}}
  if(o.wave){wave(P,'R',t);busy=true;}
  if(!busy){arm(P,'L',AD[0]+.25,AD[2]-.3+.07*Math.sin(t*3.1),.75+.25*Math.sin(t*4.3));arm(P,'R',AD[0]+.2,AD[2]-.25+.06*Math.sin(t*2.7+1),.6+.2*Math.sin(t*3.7+2));}}
 face(P,{jaw:.03+.04*Math.abs(Math.sin(t*7)),smile:o.smile??.25});FK.update(P,t,{expr:o.expr||[['doubt',.3]],look:o.look||cam.position});}
function wallBadge(g,p,k,t){PS17(g,k);if(g.visible){g.position.copy(p);g.position.y+=.03*Math.sin(t*2.2);g.quaternion.copy(cam.quaternion);}}
function pillTo(m,p,k){PS17(m,k);if(m.visible)face2cam(m,p);}
function wipeStory(t){let k;if(t<sMeet)k=(1-sm(sHe+.05,sHe+.7,t))+sm(sPicture,sPicture+.6,t);else k=1;k=Math.min(1,Math.max(0,k));
 const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
function story17(t){if(t<sHe-.02)return;const pl=place(t);
 WF17.style.opacity=String(Math.max(...FLASHES.map(f=>Math.max(0,1-Math.abs(t-f)/.14)))*.95);
 wipeStory(t);MIKE.g.visible=false;
 // hook leftovers: cards shrink away at the start of the story, back on the map for 'stay with me'
 const ck=pl==='mapA'?1-sm(sHe,sHe+.3,t):pl==='mapB'&&t<sAnswer?pop(t,sStay,.3)*(1-sm(sAnswer-.25,sAnswer,t)):0;
 CARDS17.forEach((m,i)=>{PS17(m,ck);if(m.visible){m.position.copy(m.userData.p);m.quaternion.copy(cam.quaternion);m.material.opacity=1;}});GLOW3.visible=false;
 CHK.forEach((c,i)=>{if(pl==='mapB'&&t<sAnswer-.2)CK.iconAnim(c,t,sStay+.35+i*.3,sAnswer-.2,{pos:CARDS17[i].userData.p.clone().add(V3(.15,0,-1.45)),cam,spin:.2});else c.visible=false;});
 // ---- A: map badges ----
 const mA=pl==='mapA';
 {const k=mA?Math.max(pop(t,sHe-.02,.3),.001):0,on=k>.01&&(mA||pl==='mapB');
  // El-Sayed badge (hook BADGE) on Michigan: A whole scene, B from 'president can ask' to 'but'
  const kb=mA?pop(t,sHe-.02,.3):pl==='mapB'?pop(t,sPresB-.1,.3)*(1-sm(sBut-.1,sBut+.15,t)):0;
  BADGE.visible=STEM.visible=kb>.01;if(BADGE.visible){const z=.9;PHOTO.repeat.set(z,z);PHOTO.offset.set(.05,.05);BADGEI.rotation.z=0;FLASH.material.opacity=0;
   BADGE.position.copy(MI).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(kb*(1+.04*Math.sin(t*2.2)+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sPicture)/.28)))));STEM.scale.set(1,kb,1);}
  const pp=MI.clone().add(V3(0,BH-BR-.34,0));
  pillTo(PSEN,pp,mA&&t<sPicture?pop(t,sSenate-.05,.3):0);pillTo(PPRES,pp,(mA&&t>=sPicture)?pop(t,sPicture,.3):pl==='mapB'?kb:0);
  // Trump badge: 'Trump is president today' -> shrinks away on 'picture it'
  const kt=mA?pop(t,sTrump-.08,.3)*(1-sm(sPicture,sPicture+.3,t)):0;TBADGE.visible=TSTEM.visible=kt>.01;
  if(TBADGE.visible){TPH.repeat.set(.9,.9);TPH.offset.set(.05,.05);TBADGE.position.copy(TDC).add(V3(0,TBH,0));TBADGE.quaternion.copy(cam.quaternion);TBADGE.scale.setScalar(kt);TSTEM.scale.set(1,kt,1);}
  const tp=TDC.clone().add(V3(0,TBH-TBR-.3,0));pillTo(PTRU,tp,kt);pillTo(PTODAY,tp.clone().add(V3(0,-.3,0)),kt*pop(t,WS('today',1)-.05,.3));}
 // ---- R1: paycheck pie / CTA ----
 const r1=pl==='r1',cta=pl==='cta';PIE.visible=r1;
 if(r1){PIE.rotation.z=.08*Math.sin(t*.9);PIE.scale.setScalar(Math.max(.001,pop(t,sMeet,.35)));
  const g=PIES[1],cut=sm(sSlice,sSlice+.3,t),fly=sm(sBefore,sBefore+.7,t);
  g.position.set(Math.cos(g.userData.mid)*.4*cut-1.0*fly,1.1*fly,.35*cut);g.rotation.z=-1.2*fly;g.scale.setScalar(1+.08*cut);
  TAXL.userData.pos=PIE.position.clone().add(V3(1.45-1.0*fly,-.75+1.1*fly,-.35));
  mikeAt(t,MKR(X1),RYR,{walk:[sMeet-.05,V3(X1+3.0,0,Z0-.8)],g:[[sEvery,sSlice,'pointL'],[sSlice+.1,sBefore,'pointL'],[sBefore+.05,sCent+.35,'shock'],[sCent+.35,sNow,'shrug']],expr:t>sBefore?[['shock',.7]]:[['doubt',.35]],look:t<sMike()?cam.position:t<sBefore?PIE.position:PIE.position.clone().add(V3(-1.0,1.2,0)),arms:t>sBefore+.2?.22:0});}
 if(cta){const k=pop(t,sSoC-.02,.35);mikeAt(t,V3(X1+.1,0,Z0-.7),Math.PI,{wave:t>sComment-.1,g:[[sSoC,sUp-.05,'self'],[sUp-.05,sDown,'pointR'],[sDown,sComment-.1,'pointL']],smile:.5,expr:[['joy',.5]]});
  [[SUP,V3(X1+1.0,2.4,Z0-.95),sUp-.02,AUP,1],[SDN,V3(X1-.8,2.4,Z0-.95),sDown-.02,ADN,-1]].forEach(([m,p,t0,ic,sg])=>{PS17(m,pop(t,t0,.3));if(m.visible){m.position.copy(p);m.position.y+=.04*Math.sin(t*3+sg);m.quaternion.copy(cam.quaternion);}
   CK.iconAnim(ic,t,t0+.1,1e9,{pos:p.clone().add(V3(0,.6,0)),cam,spin:.3});});}
 else{SUP.visible=SDN.visible=AUP.visible=ADN.visible=false;}
 // ---- R2: DAY 1 ----
 const r2=pl==='r2';CAL.visible=r2;STUB2.visible=r2;
 if(r2){PS17(CAL,pop(t,sNow,.35));wallBadge(ELW,V3(X2+1.55,2.55,Z0+.2),pop(t,WS('elsayeds')-.1,.35),t);pillTo(PDAY,V3(X2+1.55,1.72,Z0+.1),pop(t,WS('elsayeds'),.3));
  const b2=Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sPay2)/.25))))+Math.max(0,Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sTwice)/.25))));
  PS17(STUB2,pop(t,sChecks-.1,.3)*(1+.12*b2));
  mikeAt(t,MKR(X2),RYR,{walk:[sNow-.05,V3(X2+3.0,0,Z0-.8)],g:[[sFirst,sChecks,'pointL'],[sChecks,sTwice,'think'],[sTwice,sClue1,'shrug']],expr:[['doubt',.45]],look:t<sChecks?CAL.position:STUB2.position,arms:t>sChecks?.15:0});}
 else{ELW.visible=PDAY.visible=false;}
 // ---- R3: CLUE 1 ----
 const r3=pl==='r3';C1.visible=r3;SCR3.visible=r3;CAP3.visible=r3;
 if(r3){PS17(C1,pop(t,sClue1-.02,.35)*(1-sm(sNot1-.25,sNot1,t)));pillTo(P3PRES,V3(X3+1.2,2.3,Z0-.1),pop(t,sNot1-.1,.3)*(1-sm(sArticle-.2,sArticle,t)));
  CK.iconAnim(X3X,t,sNot1+.15,sArticle-.2,{pos:V3(X3+1.2,1.75,Z0-.15),cam,spin:.2});
  PS17(CAP3,pop(t,sCong1-.08,.35));CK.iconAnim(C3CK,t,sCong1+.1,sClue2-.1,{pos:V3(X3-1.1,3.55,Z0+.4),cam,spin:.2});
  PS17(SCR3,pop(t,sArticle-.08,.35));
  mikeAt(t,M3P,Math.PI,{walk:[sClue1-.05,V3(X3+3.0,0,Z0-1.1)],g:[[sNot1,sCong1-.1,'shake'],[sNot1,sCong1-.1,'pointR'],[sCong1,sArticle,'pointL'],[sArticle,sConst+.3,'pointR'],[sConst+.3,sClue2,'nod']],expr:[['doubt',.4]],look:t<sCong1?V3(X3+1.2,2,Z0):t<sArticle?CAP3.position.clone().add(V3(0,1.5,0)):SCR3.position});}
 else{P3PRES.visible=X3X.visible=C3CK.visible=false;}
 // ---- R4: CLUE 2 ----
 const r4=pl==='r4';C2.visible=r4;GOLD.visible=r4;
 if(r4){PS17(C2,pop(t,sClue2-.02,.35)*(1-sm(sCalc-.3,sCalc-.05,t)));wallBadge(ELW4,V3(X4+1.6,3.0,Z0+.2),pop(t,sWhat2,.35)*(1-sm(s5-.3,s5,t)),t);pillTo(PWANT,V3(X4+1.6,2.32,Z0+.1),pop(t,sWhat2+.2,.3)*(1-sm(s5-.3,s5,t)));
  PS17(GOLD,pop(t,sHigher-.05,.4));const lift=sm(s5,s5+.4,t)*(1-sm(sThats-.3,sThats,t));GTOP.position.set(0,.55*lift,0);GTOP.rotation.z=.05*lift*Math.sin(t*3);
  FLY.forEach((f,j)=>{const k=sm(sMove+j*.12,sMove+j*.12+.7,t)*(1-sm(sClue3-.3,sClue3,t));f.b.position.set(f.x0-2.2*k,f.y0+1.6*k*(1-k)*2+.3*k,f.b.position.z);f.b.rotation.z=k*3;f.b.visible=k<.98;});
  CK.iconAnim(OWNCK,t,sOwn,sSupp-.1,{pos:V3(X4+1.45,3.05,Z0-.1),cam,spin:.2});CK.iconAnim(EARNX,t,sEarn,sSupp-.1,{pos:V3(X4-1.6,3.05,Z0-.1),cam,spin:.2});
  CK.iconAnim(FALLA,t,sFall,sClue3-.1,{pos:V3(X4-.2,2.35,Z0-.1),cam,spin:.2});
  mikeAt(t,MKR(X4),RYR,{walk:[sClue2-.05,V3(X4+3.0,0,Z0-.8)],g:[[sHigher,sBill1+.6,'pointL'],[s938,s938+.9,'shock'],[sOwn,sEarn,'pointR'],[sEarn,sSupp,'pointL'],[sSupp,sCrit,'nod'],[sCrit,sFall,'pointL'],[sFall,sClue3,'shrug']],expr:t>sCrit?[['doubt',.55]]:[['doubt',.3],['shock',sm(s938,s938+.3,t)*.4]],look:GOLD.position.clone().add(V3(0,1.2,0)),arms:t>s938&&t<sThats?.2:0});}
 else{ELW4.visible=PWANT.visible=OWNCK.visible=EARNX.visible=FALLA.visible=false;}
 // ---- R5: CLUE 3 ----
 const r5=pl==='r5';C3.visible=r5;TABLE.visible=r5;
 if(r5){PS17(C3,pop(t,sClue3-.02,.35)*(1-sm(sFam-.3,sFam-.05,t)));wallBadge(ELW5,V3(X5-2.0,2.75,Z0+.2),pop(t,WS('elsayed',2)-.1,.35),t);pillTo(PHOPE,V3(X5-2.0,2.05,Z0+.1),pop(t,sHopes-.05,.3));
  CK.iconAnim(EXU,t,sExperts+.1,sStay-.1,{pos:V3(X5-1.55,1.62,Z0+.1),cam,spin:.3});CK.iconAnim(EXD,t,sExperts+.25,sStay-.1,{pos:V3(X5+1.15,1.62,Z0+.1),cam,spin:.3});
  mikeAt(t,V3(X5+1.55,0,Z0-.85),RYR,{walk:[sClue3-.05,V3(X5+3.0,0,Z0-.85)],g:[[WS('mike',2)-.2,sHopes,'self'],[sHopes,sFam,'pointL'],[sFam,sExperts,'think'],[sExperts,sStay,'shrug']],expr:t>sExperts?[['doubt',.6]]:[['doubt',.3]],look:t<WS('mike',2)+.5?cam.position:TABLE.position.clone().add(V3(0,1.6,0)),arms:t>sExperts?.25:0});}
 else{ELW5.visible=PHOPE.visible=EXU.visible=EXD.visible=false;}
 // ---- B: map - the answer ----
 const mB=pl==='mapB';CAPB.visible=false;
 if(mB){const ks=pop(t,sAnswer-.05,.35);STUB.visible=ks>.01;if(STUB.visible){STUB.scale.setScalar(STS*ks*(1+.08*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sSame)/.3)))));stub17(1,t>=sSame-.05?2:1);}
  if(t>=sAnswer-.05)mikeAt(t,MKM,Math.PI/2-.15,{s:MSC,g:[[sTomorrow,sSame,'pointL'],[sSame,sNot2+.6,'cheer'],[sNot2+.6,sPresB,'nod']],expr:t>sSame?[['joy',.35]]:[['doubt',.4]],look:t<sSame?STUB.position.clone().add(V3(0,2,0)):cam.position,arms:t>sNot2&&t<sPresB?.15:0});
  const kp=pop(t,sPresB-.1,.3)*(1-sm(sBut-.1,sBut+.15,t)),bp=MI.clone().add(V3(0,BH,0));
  pillTo(PASK,bp.clone().add(V3(.2,.95,0)),kp*pop(t,sAsk-.05,.3));pillTo(PSIGN,bp.clone().add(V3(.2,.3,1.25)),kp*pop(t,sSign-.05,.3));pillTo(PVETO,bp.clone().add(V3(.2,.3,-1.25)),kp*pop(t,sVeto1-.05,.3));
  if(kp>.01){CK.iconAnim(SCK,t,sSign+.05,sBut-.1,{pos:bp.clone().add(V3(.2,.72,1.25)),cam,spin:.2});CK.iconAnim(VX,t,sVeto1+.05,sBut-.1,{pos:bp.clone().add(V3(.2,.72,-1.25)),cam,spin:.2});}else SCK.visible=VX.visible=false;
  const kc=pop(t,sCong2-.1,.35);CAPB.visible=kc>.01;if(CAPB.visible)CAPB.scale.setScalar(CSCL*kc*(1+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-sPasses+.02)/.3)))));
  pillTo(PCONG,CPB.clone().add(V3(.55,.2,0)),kc);if(kc>.01)CK.iconAnim(BCK,t,sBillB+.05,sNobody-.1,{pos:CPB.clone().add(V3(.4,2.45,-1.05)),cam,spin:.2});else BCK.visible=false;}
 else{if(t>=sHe)STUB.visible=STUB.visible&&false;PASK.visible=PSIGN.visible=PVETO.visible=SCK.visible=VX.visible=PCONG.visible=BCK.visible=false;}
 icons17(t,pl);hud17(t);
 TR.g.visible=false;}
function sMike(){return WS('mike')+.4;}
// ================= story camera =================
const BXr=(x0,y0,z0,x1,y1,z1)=>CK.box([x0,y0,z0],[x1,y1,z1]);
const MBr=p=>BXr(p.x-.35,0,p.z-.3,p.x+.35,1.9,p.z+.3);
const SEC=[];const HOLD=(K,d=.45)=>{const o=[K[0]];for(let i=1;i<K.length;i++){if(K[i][0]-K[i-1][0]>d+.25)o.push([K[i][0]-d,K[i-1][1]]);o.push(K[i]);}return o;};const sec=(t0,keys)=>SEC.push({t0,keys:HOLD(keys)});
const C3B0=CK.box([SP.x+.3,SP.y+1.3,SP.z-1.5],[SP.x+.5,SP.y+2.7,SP.z+1.5]);
const MIBb=CK.box([MI.x-.5,US_Y,MI.z-1.7],[MI.x+.5,US_Y+BH+1.0,MI.z+1.7]),TDB=CK.box([TDC.x-.5,US_Y,TDC.z-1.4],[TDC.x+.5,US_Y+TBH+1.0,TDC.z+1.4]);
const USW=gbox(-104,30,-72,47,0,.1);
sec(sHe,[[sHe,FT15([C3B0],[1,.2,0],38,{slack:.96,top:.24})],[sSenate,FT17([MIBb,gbox(-90,40,-80,46,0,.1)],[1,.5,.05],40)],[sTrump,FT17([MIBb,TDB,gbox(-90,36,-72,46,0,.1)],[1,.52,0],40)],
 [sPicture,FT17([USW,MIBb,TDB],[1,.58,0],40)],[sMeet,FT17([USW,MIBb],[1,.58,.03],40,{slack:.96})]]);
const RB_=(X,x0,x1,y1=4.4)=>BXr(X-x1,.3,Z0-.3,X-x0,y1,Z0+.3);
sec(sMeet,[[sMeet,FT17([RB_(X1,-1.2,1.6,3.6),MBr(MKR(X1))],[0,.12,-1],44)],[sSlice,FT17([RB_(X1,-1.0,2.0,3.6),MBr(MKR(X1))],[.03,.12,-1],42)],[sBefore,FT17([RB_(X1,-1.3,2.0,3.8),MBr(MKR(X1))],[-.03,.13,-1],42)],
 [sCent,FT17([RB_(X1,-1.3,2.0,3.8),MBr(MKR(X1))],[0,.12,-1],42)]]);
sec(sNow,[[sNow,FT17([RB_(X2,-2.6,2.3,3.6),MBr(MKR(X2))],[0,.12,-1],44)],[sFirst,FT17([RB_(X2,-2.6,2.3,3.6)],[.03,.12,-1],42)],[sChecks,FT17([RB_(X2,-.7,.7,3.1),MBr(MKR(X2))],[0,.12,-1],40)],[sClue1,FT17([RB_(X2,-.7,.7,3.1),MBr(MKR(X2))],[.02,.12,-1],40,{slack:.96})]]);
sec(sClue1,[[sClue1,FT17([BXr(X3-1.45,3.05,Z0+2.2,X3+1.05,4.05,Z0+2.2),MBr(M3P)],[0,.12,-1],44)],[sWho,FT17([BXr(X3-1.45,2.7,Z0+.2,X3+1.05,4.05,Z0+2.2),MBr(M3P)],[0,.12,-1],42)],
 [sNot1,FT17([BXr(X3+.5,1.4,Z0-.1,X3+1.9,3.0,Z0-.1),MBr(M3P)],[-.03,.12,-1],40)],[sCong1,FT17([BXr(X3-2.6,0,Z0+.4,X3+1.05,4.05,Z0+1.2)],[.03,.12,-1],42)],
 [sArticle,FT17([BXr(X3-2.6,.9,Z0,X3+1.9,3.3,Z0+.4),MBr(M3P)],[-.02,.12,-1],42)],[sClue2,FT17([BXr(X3-2.6,0,Z0,X3+1.8,4.0,Z0+1.2)],[0,.12,-1],44,{slack:.96})]]);
sec(sClue2,[[sClue2,FT17([BXr(X4-1.45,3.05,Z0+2.2,X4+1.05,4.05,Z0+2.2),BXr(X4+1.0,2.0,Z0,X4+2.2,3.6,Z0)],[0,.12,-1],44)],[sHigher,FT17([BXr(X4-1.45,0,Z0,X4+2.2,4.05,Z0+.4)],[0,.14,-1],42)],
 [sWealth,FT17([BXr(X4-1.45,0,Z0,X4+2.25,4.05,Z0+.4)],[.02,.14,-1],40)],[s5,FT17([BXr(X4-1.45,0,Z0,X4+2.0,4.05,Z0+.4)],[-.02,.14,-1],42)],[s938,FT17([BXr(X4-2.5,0,Z0,X4+2.15,3.0,Z0+.4)],[.03,.14,-1],42)],
 [sOwn,FT17([BXr(X4-2.6,1.0,Z0,X4+2.4,3.4,Z0+.4)],[0,.14,-1],44)],[sSupp,FT17([BXr(X4-1.3,0,Z0,X4+2.3,3.2,Z0+.4),MBr(MKR(X4))],[-.03,.14,-1],42)],
 [sCrit,FT17([BXr(X4-2.7,0,Z0,X4+2.3,3.2,Z0+.4)],[.03,.14,-1],42)],[sFall,FT17([BXr(X4-2.7,0,Z0,X4+2.2,3.2,Z0+.4),MBr(MKR(X4))],[0,.14,-1],46)],[sClue3,FT17([BXr(X4-2.7,0,Z0,X4+2.2,3.2,Z0+.4),MBr(MKR(X4))],[.02,.14,-1],46,{slack:.96})]]);
sec(sClue3,[[sClue3,FT17([BXr(X5-1.45,3.05,Z0+2.2,X5+1.05,4.05,Z0+2.2),MBr(V3(X5+1.55,0,Z0-.85))],[0,.12,-1],44)],[sHopes,FT17([BXr(X5-2.75,1.7,Z0,X5-1.25,3.4,Z0),BXr(X5-1.0,1.4,Z0,X5+.6,3.0,Z0)],[.03,.12,-1],40)],
 [sFam,FT17([BXr(X5-2.75,.4,Z0-.7,X5+1.1,3.4,Z0+.2),MBr(V3(X5+1.55,0,Z0-.85))],[.02,.13,-1],42)],[sExperts,FT17([BXr(X5-2.75,.4,Z0-.7,X5+1.5,3.4,Z0+.2),MBr(V3(X5+1.55,0,Z0-.85))],[0,.13,-1],44)],[sStay,FT17([BXr(X5-2.0,.4,Z0-.7,X5+1.5,3.0,Z0+.2),MBr(V3(X5+1.55,0,Z0-.85))],[.02,.13,-1],44,{slack:.96})]]);
const CRB0=CK.box([SP.x+.3,SP.y+.5,SP.z-1.6],[SP.x+.5,SP.y+3.6,SP.z+1.3]),STBb=CK.box([SP.x-.2,SP.y,SP.z-1.15],[SP.x+.2,SP.y+4.3,SP.z+1.15]),MKMB=BXc(MKM,.45,3.05),CAPBB=CK.box([CPB.x-.6,CPB.y,CPB.z-1.75],[CPB.x+.6,CPB.y+3.5,CPB.z+1.2]);
sec(sStay,[[sStay,FT17([CRB0],[1,.22,0],38)],[sAnswer-.1,FT17([CRB0],[1,.22,0],38,{slack:.96})],[sTomorrow,FT17([STBb,MKMB],[1,.4,.05],38)],[sSame,FT17([STBb,MKMB],[1,.4,0],38,{slack:.95})],
 [sPresB,FT17([STBb,MIBb,BXc(MI,1.3,BH+1.5)],[1,.5,0],40)],[sVeto1,FT17([MIBb,BXc(MI,1.3,BH+1.5),STBb],[1,.45,-.05],40)],[sCong2,FT17([MIBb,CAPBB,gbox(-90,36,-74,44,0,.1)],[1,.5,-.03],40)],
 [sThirds,FT17([CAPBB,BXc(CPB,.6,3.1)],[1,.45,-.05],38)],[sNobody,FT17([CAPBB,BXc(CPB,.6,3.6)],[1,.45,-.03],38)],[sSoC,FT17([CAPBB,BXc(CPB,.6,3.6)],[1,.45,-.01],38,{slack:.96})]]);
const CTB=BXr(X1-2.0,.0,Z0-1.0,X1+1.9,3.5,Z0-.6);
sec(sSoC,[[sSoC,FT17([CTB],[0,.12,-1],44)],[sUp,FT17([CTB],[.02,.12,-1],42)],[SEND,FT17([CTB],[-.02,.12,-1],42,{slack:.96})]]);
const CAMH17=window.CAM14;
window.CAM14=t=>{if(t<HOOK_END)return CAMH17(t);let s=SEC[0];for(const x of SEC)if(t>=x.t0)s=x;return unch15(herm15(s.keys,t));};
window.CAM14_END=SEND+1;
function animateAll(t){animate(t);story17(t);}
