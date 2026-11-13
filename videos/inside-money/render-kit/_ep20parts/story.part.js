// ===================== EP20 STORY (after the hook) =====================
// yard interior (trail) -> whip -> car dealer (x 300) -> whip -> bank (x -300) -> whip -> neighbour porch (x -18) -> whip -> IRS interrogation cell (x 600)
// -> REWIND -> yard lawn (legal path: 401(k) vault, HSA cabinet, Roth money tree, 14-day renter, gift to kid, SOLD sign, 5 YEARS twist, CRIME vs RULES, 4-option CTA)
const story=await (async()=>{
const tTrail=T('trail'),tMoment=T('the moment'),tSpend=T('spend it'),tBuy=T('buy a car'),tTen=T('ten thousand'),tDealer=T('the dealer'),tRep1=T('report it'),
 tDeposit=T('deposit it'),tBank=T('the bank'),tRep2=T('report it too'),tEven=T('even your neighbor'),tOnline=T('online'),tNoName=T('without giving'),
 tCaught=T('get caught'),tBack=T('all back'),t75=T('seventy five'),tFiveP=T('up to five years'),tPrison=T('prison'),tRew=T('rewind'),tLegal=T('legally'),
 t401=T('put money'),t245=T('twenty four thousand'),tSkip=T('skips tax'),tHSA=T('an hsa'),tIn=T('going in'),tGrow=T('while it grows'),tMed=T('medical bills'),
 tRoth=T('in a roth'),tNever=T('never taxed'),tRent=T('rent out'),t14=T('fourteen days'),tRentFree=T('that rent'),tGive=T('give each kid'),t19=T('nineteen thousand'),
 tGift=T('no gift tax'),tWatch=T('and watch'),tTwist=T('twist'),tLive=T('live in your home'),t2of5=T('two of the last'),t250=T('two hundred fifty'),tSell=T('when you sell'),
 tFive=T('five years',2),tSameN=T('the same number'),tPrison2=T('prison sentence'),tSameM=T('same money'),tCrime=T('one is a crime'),tRules=T('reading the rules'),
 tWhere=T('so wheres yours'),tUF=T('under the floor'),tK2=T('four oh one k',1),tR2=T('a roth',1),tH2=T('an hsa',1),tCom=T('comment one');
// captions: numbers as digits (all words of the phrase show the label)
const LBL=(ph,lab,o=0)=>{const [a,b]=FIND(ph,o);const s0=WS[a].s-.02,s1=WS[b].s+.02;for(const c of CH)if(c.s>=s0&&c.s<=s1)c.t=lab;};
LBL('ten thousand','$10,000');LBL('seventy five percent','75%');LBL('five years','5 YEARS');LBL('twenty four thousand five hundred','$24,500');LBL('fourteen days','14 DAYS');
LBL('nineteen thousand dollars','$19,000');LBL('two of the last five years','2 OF 5 YEARS');LBL('two hundred fifty thousand dollars','$250,000');LBL('five years','5 YEARS',2);
LBL('roth ira','ROTH IRA');
// ---------- helpers ----------
const COL={G:0x22e85e,R:0xf00000,Y:0xffd21a,W:0xffffff};
const TX=(s,size,c,plate=false)=>{const m=K.txt3(s,size,c,{ei:0});m.material=[new THREE.MeshBasicMaterial({color:c,toneMapped:false}),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(.35),toneMapped:false})];
 if(plate){m.geometry.computeBoundingBox();const bb=m.geometry.boundingBox,w=bb.max.x-bb.min.x+size*.9,h=size*1.75;K.add(K.RB(w,h,.03,size*.25),new THREE.MeshBasicMaterial({color:0x0b0b0e,transparent:true,opacity:.8,toneMapped:false}),0,0,-size*.25,m,false);
  K.add(K.RB(w+size*.16,h+size*.16,.02,size*.28),new THREE.MeshBasicMaterial({color:c,toneMapped:false}),0,0,-size*.3,m,false);}
 m.visible=false;return m;};
const SHOW=(m,t,t0,t1,x,y,z,s=1)=>{const a=pop(t,t0,.3)*(t1?1-sm(t1,t1+.2,t):1);m.visible=a>.01;if(!m.visible)return;m.scale.setScalar(s*Math.max(.001,a));m.position.set(x,y,z);m.quaternion.copy(cam.quaternion);};
const room2=(ox,oz,{floor,wall,wcol,fcol})=>{const g=K.group(ox,0,oz);K.add(K.B(9,.1,10),pbr(floor,4,5,fcol),0,-.02,1,g,false);
 K.add(K.B(9,3.6,.2),pbr(wall,3,1.4,wcol),0,1.8,-3.2,g);for(const s of[-1,1])K.add(K.B(.2,3.6,7),pbr(wall,3,1.4,wcol),s*4.5,1.8,.2,g);
 const L=new THREE.PointLight(0xffe2bf,16,14,1.3);L.position.set(0,3.0,.8);g.add(L);return g;};
const sign=(txt,w,h,bg,fg,font=110)=>new THREE.MeshStandardMaterial({map:tex(1024,Math.round(1024*h/w),(x)=>{const H_=Math.round(1024*h/w);x.fillStyle=bg;x.fillRect(0,0,1024,H_);x.fillStyle=fg;x.font=`800 ${font}px Mont`;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,512,H_/2+4);}),roughness:.5});
const {check3D,x3D}=await import('./scenekit/props.js');
const STR=(n,p=scene)=>{const a=[];for(let i=0;i<n;i++){const s=MK.strap(100);s.visible=false;p.add(s);a.push(s);}return a;};
// ---------- 1) interior: light beam out of the hole + glowing trail along Mike's walk ----------
const BEAM=K.add(new THREE.CylinderGeometry(.42,.3,6,24,1,true),new THREE.MeshBasicMaterial({color:0xffe27a,transparent:true,opacity:.0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false}),PIT.x,FY+3,PIT.z,scene,false);
const HL=new THREE.PointLight(0xffd76a,0,6,1.4);HL.position.set(PIT.x,FY+.4,PIT.z);scene.add(HL);
const PATH=[V3(PIT.x,FY+.03,PIT.z),V3(.1,FY+.03,1.2),V3(-.1,FY+.03,3.0),V3(-.25,.63,5.0),V3(-.4,.33,6.6),V3(-.3,.03,8.2),V3(.2,.03,10.2)];
const PC=new THREE.CatmullRomCurve3(PATH);const TRG=new THREE.TubeGeometry(PC,160,.045,8,false);const TRAIL=K.add(TRG,new THREE.MeshBasicMaterial({color:0xffd21a,toneMapped:false}),0,0,0,scene,false);TRAIL.visible=false;
const BAG2=K.group();{K.add(K.RB(.62,.32,.34,.12),K.M(0x16181c,.8),0,0,0,BAG2);K.add(new THREE.TorusGeometry(.16,.02,8,20,Math.PI),K.M(0x16181c,.8),0,.16,0,BAG2);}BAG2.visible=false;
// ---------- 2) car dealer (x 300) ----------
const DX=300;{K.add(K.B(40,.12,30),pbr('asphalt_02',10,8),DX,.0,0,scene,false);for(let i=-3;i<=3;i++)K.add(K.B(.1,.005,4.4),K.M(0xffffff,.6),DX+i*3,.07,-2.0,scene,false);
 const sh=K.group(DX,0,-6);K.add(K.B(16,4.2,.3),pbr('white_stucco',4,1),0,2.1,0,sh);K.add(K.B(10,2.6,.05),new THREE.MeshPhysicalMaterial({color:0x1d3a52,roughness:.05,metalness:.3,clearcoat:1}),0,1.5,.17,sh,false);
 K.add(new THREE.PlaneGeometry(7,1.0),sign('MAPLE AUTO SALES',7,1,'#c81e2a','#ffffff',120),0,3.55,.17,sh,false);
 const cols=[0xff2a2a,0xffffff,0x1f4fd6,0xffd21a];for(const [y,z0] of[[3.2,1.2]])for(let i=0;i<22;i++){const f=K.add(new THREE.ConeGeometry(.16,.35,3),K.M(cols[i%4],.6),-7.5+i*.72,y,z0,sh,false);f.rotation.x=Math.PI;}
 vehicle(K,'suv',{x:DX-6.2,z:-2.2,ry:Math.PI/2,color:0xf2f2f2});vehicle(K,'pickup',{x:DX+6.4,z:-2.2,ry:Math.PI/2,color:0x2f5aa8});
 for(const [x,z] of[[DX-12,4],[DX+12,4]])palm(x,z,9,.12,x);}
const CAR=vehicle(K,'pickup',{x:DX+.6,z:-1.2,ry:-.35,color:0xd61f2a});
const PRICE=K.add(new THREE.PlaneGeometry(.9,.42),sign('$31,000',.9,.42,'#fff7c2','#111',190),0,1.75,.0,CAR.root,false);PRICE.position.set(.9,1.6,0);PRICE.rotation.y=Math.PI/2;
const DESK=K.group(DX-1.6,0,.6);K.add(K.B(1.2,.06,.6),pbr('oak_wood_planks',1,.5,0x8a5a3a),0,.76,0,DESK);for(const [x,z] of[[-.55,-.25],[.55,-.25],[-.55,.25],[.55,.25]])K.add(K.B(.05,.74,.05),K.M(0x2a2a2a,.5,.5),x,.37,z,DESK);
const FORM=(title,sub,col)=>{const m=K.add(new THREE.PlaneGeometry(.42,.54),new THREE.MeshStandardMaterial({map:tex(420,540,x=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,420,540);x.fillStyle=col;x.fillRect(0,0,420,92);x.fillStyle='#fff';x.font='800 46px Mont';x.fillText(title,22,62);
 x.fillStyle='#111';x.font='800 26px Mont';x.fillText(sub,22,140);x.fillStyle='#999';for(let i=0;i<7;i++)x.fillRect(22,180+i*44,i%2?300:370,10);x.strokeStyle=col;x.lineWidth=6;x.strokeRect(22,480-40,200,60);x.fillStyle=col;x.font='800 30px Mont';x.fillText('TO: IRS',34,482);}),roughness:.8,side:THREE.DoubleSide}),0,0,0,scene,false);m.visible=false;return m;};
const F8300=FORM('FORM 8300','CASH OVER $10,000','#1d2f6b'),FCTR=FORM('BANK REPORT','CASH OVER $10,000','#1f6b3a');
const DSTR=STR(5);const dealer=await K.person('landlord',null,DX-1.0,0,-.2,.5,0x333333);
// ---------- 3) bank (x -300) ----------
const BX=-300;const BKg=room2(BX,0,{floor:'marble_01',wall:'white_sandstone_blocks_02',wcol:0xf0e6d6,fcol:0xffffff});
{K.add(K.B(3.6,1.08,.6),pbr('oak_wood_planks',2,.6,0x7a4a2a),0,.54,-1.0,BKg);K.add(K.B(3.7,.06,.7),K.M(0x2b2b2b,.3,.4),0,1.1,-1.0,BKg);
 K.add(new THREE.PlaneGeometry(3.2,.8),sign('BANK',3.2,.8,'#0f2b55','#ffffff',260),0,2.75,-3.08,BKg,false);
 const fp=K.group(-3.2,0,-2.6,BKg);K.add(CY(.02,.02,2.4,8),M(0xd4af37,.3,.9),0,1.2,0,fp);const bf=K.add(FG,FLAGM,.62,2.05,0,fp,true);
 for(const x of[-2.6,2.6])K.add(K.B(.5,3.6,.5),pbr('white_sandstone_blocks_02',1,3,0xf6efe2),x,1.8,-2.9,BKg);}
const teller=await K.person('teller',null,BX,0,-1.75,0,0x111111);const BSTR=STR(6);
// ---------- 4) neighbour (porch of the house at x -22) with a laptop ----------
const NX=-17.5,NZ=8.6;const NB=await K.person('masked',null,NX,0,NZ,1.15,0x333333);
const LAP=K.group(NX+.45,0,NZ+.15);{K.add(K.B(.7,.05,.5),pbr('oak_wood_planks',1,.5,0x8a5a3a),0,.72,0,LAP);for(const [x,z] of[[-.3,-.2],[.3,-.2],[-.3,.2],[.3,.2]])K.add(K.B(.04,.7,.04),K.M(0x2a2a2a,.5,.5),x,.36,z,LAP);
 K.add(K.B(.36,.015,.25),K.M(0x9ea3aa,.3,.8),0,.76,0,LAP);}
const SCR=K.tex(512,320,x=>{});const SCRM=K.add(new THREE.PlaneGeometry(.36,.23),new THREE.MeshBasicMaterial({map:SCR,toneMapped:false}),0,.88,-.12,LAP,false);SCRM.rotation.x=-.2;LAP.rotation.y=1.15;
let scrState=-1;const scrDraw=k=>{if(k===scrState)return;scrState=k;K.redraw(SCR,(x,w,h)=>{x.fillStyle='#f4f6fa';x.fillRect(0,0,w,h);x.fillStyle='#1d2f6b';x.fillRect(0,0,w,60);x.fillStyle='#fff';x.font='800 30px Mont';x.fillText('REPORT TAX FRAUD',18,42);
 x.fillStyle='#111';x.font='800 24px Mont';x.fillText('Who: Mike, Maple St.',18,110);x.fillText('What: cash under floor',18,150);x.fillText('Your name:',18,200);x.strokeStyle='#999';x.lineWidth=3;x.strokeRect(160,176,320,36);
 if(k>=1){x.fillStyle='#d42a2a';x.font='800 26px Mont';x.fillText('(optional) - skipped',166,203);}if(k>=2){x.fillStyle='#1f7a3a';x.fillRect(18,240,200,56);x.fillStyle='#fff';x.font='800 30px Mont';x.fillText('SENT',70,278);}});};
// ---------- 5) IRS interrogation cell (x 600) ----------
const {interrogation}=await import('./scenekit/interrogation.js');const IR=interrogation(K,{x:600,z:0});
const agentC=await K.person('guard',{'polo|cargo':0x141c2e},600,0,.95,Math.PI,0x141c2e);{const bp=K.add(new THREE.PlaneGeometry(.5,.17),IRSM,0,1.22,-.2,agentC.g,false);bp.rotation.y=Math.PI;}
const FOLDER=K.add(new THREE.PlaneGeometry(.5,.36),new THREE.MeshStandardMaterial({map:tex(500,360,x=>{x.fillStyle='#e9c46a';x.fillRect(0,0,500,360);x.fillStyle='#7a2a1a';x.font='800 60px Mont';x.fillText('IRS - MIKE',30,90);x.fillStyle='#d42a2a';x.font='800 70px Mont';x.fillText('EVASION',30,220);}),roughness:.8}),600,.79,.0,scene,false);FOLDER.rotation.x=-Math.PI/2;FOLDER.visible=false;
// ---------- 6) yard legal path props (lawn line z ~9.6) ----------
const VZ=9.4;
const VAULT=K.group(-2.7,0,VZ);{const gl=new THREE.MeshPhysicalMaterial({color:0xcfe9ff,roughness:.05,metalness:0,transmission:.0,transparent:true,opacity:.28,clearcoat:1});
 K.add(K.B(.9,.12,.7),K.M(0x2a2d31,.35,.85),0,.06,0,VAULT);K.add(K.B(.9,.9,.7),gl,0,.57,0,VAULT,false);K.add(K.B(.92,.08,.72),K.M(0x2a2d31,.35,.85),0,1.04,0,VAULT);
 K.add(new THREE.PlaneGeometry(.86,.26),sign('401(k)',.86,.26,'#14532d','#ffffff',190),0,.86,.36,VAULT,false);}
const VSTR=[];for(let i=0;i<12;i++){const s=MK.strap(100);s.visible=false;VAULT.add(s);VSTR.push({m:s,to:V3(-.2+(i%3)*.2- .0,.14+Math.floor(i/6)*.02+ (Math.floor(i/3)%2)*.0,-.15+Math.floor(i/3)%2*.3)});}
const HSAB=K.group(-.9,0,VZ+.2);{K.add(K.RB(.7,.95,.45,.06),K.M(0xf5f5f2,.35),0,.48,0,HSAB);const cr=K.M(0x1faa55,.35,0,{emissive:0x1faa55,emissiveIntensity:.25});K.add(K.B(.36,.11,.02),cr,0,.62,.235,HSAB,false);K.add(K.B(.11,.36,.02),cr,0,.62,.235,HSAB,false);
 K.add(new THREE.PlaneGeometry(.56,.17),sign('HSA',.56,.17,'#1faa55','#ffffff',150),0,.24,.235,HSAB,false);}
const TREE=K.group(.85,0,VZ);{K.add(K.CY(.26,.2,.4,24),K.M(0xb5562a,.7),0,.2,0,TREE);K.add(K.CY(.25,.25,.03,24),pbr('dirt',1,1),0,.4,0,TREE,false);
 K.add(new THREE.PlaneGeometry(.5,.16),sign('ROTH IRA',.5,.16,'#14532d','#fff',120),0,.22,.27,TREE,false);}
const TRUNK=K.add(K.CY(.03,.05,1,10),K.M(0x6b4a2e,.8),0,.4,0,TREE);const LEAF=[];for(let i=0;i<14;i++){const l=K.add(new THREE.SphereGeometry(.12+.04*(i%3),14,10),K.M(0x2f9a3a,.6),Math.sin(i*2.4)*.28,0,Math.cos(i*2.4)*.22,TREE);LEAF.push(l);}
const BILLS=[];for(let i=0;i<8;i++){const b=MK.note?MK.note(100):MK.strap(1);b.visible=false;TREE.add(b);BILLS.push(b);}
const CAL=(()=>{const g=K.group(2.6,0,VZ-.6);const tx=tex(512,600,x=>{x.fillStyle='#fff';x.fillRect(0,0,512,600);x.fillStyle='#d42a2a';x.fillRect(0,0,512,150);x.fillStyle='#fff';x.font='800 92px Mont';x.textAlign='center';x.fillText('RENTED',256,108);
 x.fillStyle='#161616';x.font='800 300px Mont';x.fillText('14',256,440);x.font='800 70px Mont';x.fillText('DAYS',256,540);});
 K.add(K.RB(.66,.76,.06,.02),K.M(0xf4f1ea,.7),0,1.25,0,g);K.add(new THREE.PlaneGeometry(.62,.72),new THREE.MeshStandardMaterial({map:tx,roughness:.7}),0,1.25,.032,g,false);
 for(const [x,z,r] of[[-.25,.05,-.12],[.25,.05,.12]]){const l=K.add(K.B(.035,1.3,.035),K.M(0x6b4a2e,.6),x,.55,z,g);l.rotation.z=r;}return g;})();
const renter=await K.person('printer',null,6,0,12,-Math.PI/2,0x555555);const SUIT=K.group();{K.add(K.RB(.4,.55,.22,.05),K.M(0x2f6f8f,.5),0,0,0,SUIT);K.add(K.B(.04,.25,.04),K.M(0x222222,.4),0,.38,0,SUIT);}
const RENTCASH=STR(2);
const kid=await K.person('seller',null,3.2,0,VZ+.2,-.6,0x7a3a5a);kid.g.scale.setScalar(.8);
const GIFT=K.group();{K.add(K.B(.36,.3,.36),K.M(0xd42a2a,.5),0,0,0,GIFT);K.add(K.B(.37,.31,.06),K.M(0xffd21a,.4),0,0,0,GIFT,false);K.add(K.B(.06,.31,.37),K.M(0xffd21a,.4),0,0,0,GIFT,false);}GIFT.visible=false;
const SOLD=K.group(-3.9,0,10.6);{K.add(K.B(.08,1.6,.08),K.M(0xf2f2f2,.5),0,.8,0,SOLD);K.add(K.B(.9,.06,.06),K.M(0xf2f2f2,.5),.4,1.5,0,SOLD);
 K.add(new THREE.PlaneGeometry(.8,.5),sign('FOR SALE',.8,.5,'#ffffff','#c81e2a',150),.42,1.15,.04,SOLD,false);}
const SOLDR=K.add(new THREE.PlaneGeometry(.8,.2),sign('SOLD',.8,.2,'#c81e2a','#ffffff',150),.42,1.52,.05,SOLD,false);SOLDR.visible=false;SOLD.visible=false;
const CAGE=K.group(-1.5,0,10.2);{const ir=K.M(0x3a3d42,.35,.85);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;K.add(K.CY(.022,.022,2.1,8),ir,Math.sin(a)*.5,1.05,Math.cos(a)*.5,CAGE);}for(const y of[.03,2.1])K.add(new THREE.TorusGeometry(.5,.03,8,40),ir,0,y,0,CAGE).rotation.x=Math.PI/2;}CAGE.visible=false;
// floating words / numbers (clear colours)
const N10K=TX('$10,000+',.2,COL.Y,true),NCTR=TX('$10,000+',.2,COL.Y,true),ANON=TX('ANONYMOUS',.3,COL.Y,true),
 NBACK=TX('$100,000',.2,COL.W,true),N75=TX('+75% PENALTY',.2,COL.R,true),N5Y=TX('5 YEARS',.3,COL.R,true),
 N245=TX('$24,500 / YEAR',.2,COL.G,true),NLATER=TX('NO TAX TODAY',.15,COL.Y,true),NFREE=TX('TAX $0',.2,COL.G,true),N14=TX('RENT: TAX $0',.2,COL.G,true),
 N19=TX('$19,000 EACH',.2,COL.G,true),NGIFT=TX('NO GIFT TAX',.15,COL.Y,true),NQ=TX('?',.8,COL.Y),N25=TX('2 OF 5 YEARS',.2,COL.Y,true),N250=TX('$250,000 TAX FREE',.2,COL.G,true),
 N5A=TX('5 YEARS',.26,COL.R,true),N5B=TX('5 YEARS',.26,COL.G,true),NCRIME=TX('CRIME',.26,COL.R,true),NRULES=TX('RULES',.26,COL.G,true);
const HSAL=[TX('IN',.16,COL.G,true),TX('GROW',.16,COL.G,true),TX('OUT',.16,COL.G,true)];const HSAC=[check3D(K),check3D(K),check3D(K)];HSAC.forEach(c=>c.visible=false);
const XC=x3D(K),CK=check3D(K);XC.visible=CK.visible=false;
const OPTS=[['FLOOR',COL.R,tUF],['401(k)',COL.G,tK2],['ROTH',COL.G,tR2],['HSA',COL.G,tH2]].map(([s,c,t0])=>({m:TX(s,.2,c,true),t0}));
// ---------- REWIND overlay (VHS) ----------
const RW=document.createElement('div');RW.style.cssText='position:absolute;inset:0;opacity:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 2px,transparent 2px 6px);';RW.innerHTML='<div style="position:absolute;left:44px;top:220px;font:800 64px Mont,sans-serif;color:#fff;-webkit-text-stroke:6px #000;paint-order:stroke fill">&#9664;&#9664; REWIND</div>';document.getElementById('ov').appendChild(RW);
// ---------- shots (one continuous camera; whips = tilt to the sky/ceiling, the place changes there) ----------
const W1=tBuy-.12,W2=tDeposit-.1,W3=tEven-.1,W4=tCaught-.08,W5=tRew-.15;
SH[0].keys=SH[0].keys.slice(0,-1);SH[0].keys.push([tBut,[1.4,1.75,16.8],[0,2.4,5],46],[tBut+.75,[.35,1.75,5.2],[.55,.6,.4],44],[tMoment,[.3,1.8,5.0],[.4,.75,.5],44],
 [tSpend+.5,[1.6,1.7,6.6],[-.1,.9,2.4],48],[tTrail,[2.6,1.9,13.4],[-.1,.6,6.4],50],[W1-.1,[2.6,1.9,13.6],[-.1,.7,7.2],50],[W1,[2.6,2.2,13.6],[-.1,9,6],56]);
SH.push(
 {t0:W1,o:[DX,0,0],keys:[[W1,[.8,2.3,6.8],[0,9,1],56],[W1+.45,[.6,1.7,5.4],[-.5,1.1,-.4],46],[tDealer,[-.2,1.6,3.6],[-1.2,1.1,.2],42],[tRep1+.1,[-.4,2.0,3.9],[-1.3,2.1,.2],46],[W2-.1,[-.4,2.0,3.9],[-1.3,2.6,.1],48],[W2,[-.4,2.2,3.9],[-1.3,9,0],56]]},
 {t0:W2,o:[BX,0,0],keys:[[W2,[.4,2.2,3.8],[0,9,-1],56],[W2+.45,[.5,1.65,2.6],[0,1.2,-1.2],44],[tRep2,[.3,1.8,2.4],[0,1.6,-1.1],44],[W3-.1,[.3,1.9,2.5],[0,2.2,-1.2],46],[W3,[.3,2.2,2.5],[0,9,-1],56]]},
 {t0:W3,o:[NX,0,NZ],keys:[[W3,[-1.6,2.0,2.6],[.4,9,0],56],[W3+.45,[-1.3,1.6,1.9],[.5,1.0,-.1],44],[tOnline,[-1.0,1.55,1.4],[.4,.95,.0],40],[tNoName,[-1.6,1.9,2.6],[1.0,1.4,-.3],46],[W4-.1,[-1.6,1.9,2.6],[1.0,1.8,-.3],46],[W4,[-1.6,2.2,2.6],[1.0,9,-.3],56]]},
 {t0:W4,o:[600,0,0],keys:[[W4,[.3,2.0,3.3],[0,6,-1],56],[W4+.45,[.25,1.5,2.9],[0,1.05,-.6],44],[tBack,[.2,1.45,2.7],[0,1.1,-.5],42],[tFiveP,[.2,1.5,3.1],[0,1.25,-.5],44],[tPrison+.6,[.1,1.4,3.4],[0,1.2,-.5],44],[W5,[.1,1.6,3.4],[0,6,-.5],56]]},
 {t0:W5,keys:[[W5,[0,4,22],[0,12,5],56],[tLegal,[0,2.6,17.5],[0,1.6,8.5],50],[t401-.1,[-1.6,1.8,14.0],[-2.2,.9,9.2],44],[t245,[-2.0,1.6,12.6],[-2.6,.8,9.3],42],
  [tHSA,[-.7,1.6,12.6],[-1.0,.8,9.5],42],[tMed,[-.5,1.6,12.8],[-.9,.9,9.5],43],[tRoth,[.6,1.6,12.5],[.8,.9,9.3],42],[tNever+.2,[.7,1.7,12.7],[.85,1.1,9.3],43],
  [tRent,[2.0,1.9,13.4],[2.0,1.0,8.6],44],[tRentFree,[2.4,1.8,13.0],[2.4,1.1,8.8],43],[tGive,[2.9,1.7,12.8],[2.7,1.0,9.5],42],[tGift+.2,[2.8,1.7,12.9],[2.6,1.0,9.5],43],
  [tWatch,[.6,2.6,17.5],[0,2.4,6],48],[tTwist+.2,[.2,2.3,15.0],[0,2.6,6],44],[tLive,[-2.6,1.9,14.0],[-3.4,1.2,9.6],44],[tSell,[-2.4,1.9,13.6],[-3.2,1.3,9.8],43],
  [tFive,[-1.4,2.0,14.6],[-2.0,1.4,9.6],46],[tSameN+.3,[-1.2,2.1,15.0],[-1.8,1.5,9.6],47],[tSameM,[-.2,2.2,16.0],[-.6,1.4,9.6],48],[tRules+.3,[-.2,2.2,15.8],[-.6,1.5,9.6],48],
  [tWhere,[0,1.9,14.6],[0,1.4,10.4],46],[DUR,[0,1.85,14.2],[0,1.45,10.4],45]]});
// ---------- per-frame ----------
return function(t){
 if(t<tBut)return;
 const yard=t<W1||t>=W5;
 // hook leftovers: TAX EVASION / raid / stars go away after the first whip
 if(t>tBut+.4)EVA.visible=false;
 for(const v of CARS){v.root.visible=t<W1;}for(const a of AG)a.P.g.visible=a.P.g.visible&&t<W1;
 const pr=t>=W4&&t<W5;HUD.style.opacity=String(t<tBut+.3?1-sm(tBut,tBut+.3,t):pr?sm(tPrison-.1,tPrison+.1,t):0);
 if(pr)STAR.forEach(s=>{s.style.color=Math.sin(t*14)>0?'#ff3b3b':'#4d7bff';s.style.transform='scale(1)';});
 // ===== interior + trail =====
 const op=sm(tBut+.05,tBut+.5,t);if(t<W1)BOARDS.forEach((b,i)=>{const lean=V3(PIT.x+.62,FY+.32,PIT.z-.35+i*.07),flat=V3(PIT.x-PIT.w/2+.1+i*.193,FY+.02,PIT.z);b.position.lerpVectors(flat,lean,sm(tBut+i*.06,tBut+.3+i*.06,t));b.position.y+=.25*Math.sin(sm(tBut+i*.06,tBut+.3+i*.06,t)*Math.PI);b.rotation.set(0,0,1.25*sm(tBut+i*.06,tBut+.3+i*.06,t));});
 BEAM.material.opacity=.32*op*(1-sm(tSpend-.1,tSpend+.2,t));BEAM.visible=t<W1;HL.intensity=(t<W1?18:0)*op*(1-sm(tSpend,tSpend+.3,t));
 if(t>=tSpend-.15&&t<W1)STRAPS.forEach((s,i)=>{s.m.visible=i<50*(1-sm(tSpend-.15,tSpend+.2,t));});else if(t>=W1)STRAPS.forEach(s=>s.m.visible=false);
 const wk=sm(tSpend+.15,tTrail+.35,t);
 TRAIL.visible=t>=tSpend&&t<W1;if(TRAIL.visible){TRG.setDrawRange(0,Math.floor(TRG.index.count*Math.max(.02,wk)/6)*6);}
 const M_=mike;
 if(t<W1){K.relax(M_);K.idle(M_,t);
  if(t<tSpend+.15){const p=V3(-.35,FY,.35);M_.g.position.copy(p);M_.g.rotation.y=.25;const sc=K.win(t,tBut,tMoment,.15);K.headHold(M_,sc*.7);K.face(M_,{jaw:.45*sc});K.pose(M_,'head',.3*(1-sc),-.2,0);
   const gr=sm(tMoment,tSpend+.1,t);if(gr>0){K.pose(M_,'spine03',.45*gr*(1-sm(tSpend,tSpend+.15,t)),0,0);K.arm(M_,'R',AD[0]+.9*gr,AD[2]-.2,.6);}}
  else{const p=PC.getPointAt(Math.min(.999,Math.max(.12,wk)));const p2=PC.getPointAt(Math.min(1,Math.max(.12,wk)+.01));M_.g.position.set(p.x-.0,p.y-.03,p.z);M_.g.rotation.y=Math.atan2(p2.x-p.x,p2.z-p.z);K.walk(M_,t*1.1,.5);K.face(M_,{smile:.8});}
  M_.g.updateMatrixWorld(true);}
 BAG.visible=t<tSpend+.1;BAG2.visible=t>=tSpend+.1&&t<W2;if(BAG2.visible&&t<W1){const w=wristW(M_,'R');BAG2.position.copy(w).add(V3(0,-.22,0));BAG2.rotation.y=M_.g.rotation.y;}
 // ===== dealer =====
 const dl=t>=W1&&t<W2;dealer.g.visible=dl;CAR.root.visible=dl;
 if(dl){K.relax(M_);K.idle(M_,t);M_.g.position.set(DX-.45,0,.75);M_.g.rotation.y=-1.35;K.relax(dealer);
  K.idle(dealer,t,2);dealer.g.position.set(DX-1.65,0,.05);dealer.g.rotation.y=1.25;
  const hand=sm(tBuy+.2,tTen,t);K.arm(M_,'R',AD[0]+1.2*hand,AD[2]-.2,.3);K.face(M_,{smile:.9});
  const w=wristW(M_,'R');BAG2.position.copy(w).add(V3(0,-.22,0));BAG2.rotation.y=-1.35;
  DSTR.forEach((s,i)=>{const u=sm(tTen-.1+i*.08,tTen+.25+i*.08,t);s.visible=u>0;s.position.set(DX-1.6+.6*(1-u)*0+(-.3+i*.14),.8+.25*(1-u)+i*.0,.6);s.rotation.set(0,.3,0);});
  const dk=K.win(t,tTen,tDealer,.12);K.arm(dealer,'R',AD[0]+.9*dk,AD[2]-.3,1.2*dk);K.face(dealer,{smile:.9*dk});
  const st=K.win(t,tDealer,tRep1+.1,.1);K.arm(dealer,'L',AD[0]+.8*st,AD[2]-.4,1.0*st);K.pose(dealer,'head',.35*st,0,0);
  F8300.visible=t>=tDealer;const fly=sm(tRep1,tRep1+.8,t);F8300.position.set(DX-1.6+1.2*fly,.8+.0+3.2*fly*fly,.6-0.6*fly);F8300.rotation.set(-Math.PI/2*(1-sm(tRep1-.05,tRep1+.2,t)),.3*fly,0);if(t>tRep1+.1)F8300.quaternion.copy(cam.quaternion);
  F8300.scale.setScalar(1+.6*sm(tRep1-.1,tRep1+.2,t));
  CAR.update(t,false);}
 else F8300.visible=false;
 SHOW(N10K,t,tTen,tDealer+.3,DX-1.3,1.55,.55);DSTR.forEach(s=>s.visible=s.visible&&dl);
 // ===== bank =====
 const bk=t>=W2&&t<W3;teller.g.visible=bk;
 if(bk){K.relax(M_);K.idle(M_,t);M_.g.position.set(BX+.35,0,-.25);M_.g.rotation.y=Math.PI-.15;K.relax(teller);K.idle(teller,t,4);
  const put=sm(tDeposit+.1,tDeposit+.6,t);K.arm(M_,'R',AD[0]+1.1*put,AD[2]-.2,.4);
  BSTR.forEach((s,i)=>{const u=sm(tDeposit+.15+i*.07,tDeposit+.45+i*.07,t);s.visible=u>0;s.position.set(BX-.35+(i%3)*.26,1.14+Math.floor(i/3)*.022+.3*(1-u),-.95);});
  const tk=K.win(t,tBank,tRep2+.2,.12);K.arm(teller,'R',AD[0]+.9*tk,AD[2]-.3,1.0*tk);K.face(teller,{smile:.5});
  FCTR.visible=t>=tBank;const fly=sm(tRep2,tRep2+.7,t);FCTR.position.set(BX+.5+.6*fly,1.4+2.6*fly*fly,-1.1+.3*fly);FCTR.quaternion.copy(cam.quaternion);FCTR.scale.setScalar(1.2+.3*fly);
  K.face(M_,{jaw:.4*sm(tRep2,tRep2+.2,t)});BAG2.visible=false;}
 else{FCTR.visible=false;if(t>=W3)BSTR.forEach(s=>s.visible=false);}
 SHOW(NCTR,t,tBank-.05,tRep2+.6,BX-.1,1.75,-.9);
 // ===== neighbour =====
 const nb=t>=W3&&t<W4;NB.g.visible=true;
 if(nb){K.relax(NB);K.idle(NB,t,3);NB.g.position.set(NX,0,NZ);NB.g.rotation.y=1.15;const ty=K.win(t,W3+.2,W4,.1);K.handsFront(NB,.85*ty);K.pose(NB,'lowerarm01L',.9+.15*Math.sin(t*22),0,0);K.pose(NB,'lowerarm01R',.9+.15*Math.sin(t*19+1),0,0);
  K.pose(NB,'head',.35,0,0);scrDraw(t>tNoName?(t>tNoName+.6?2:1):0);
  // Mike in the distance in his yard, unaware, counting cash
  K.relax(M_);K.idle(M_,t);M_.g.position.set(-1.0,0,9.0);M_.g.rotation.y=-.6;K.arm(M_,'R',AD[0]+.9,AD[2]-.2,1.2+.2*Math.sin(t*10));K.face(M_,{smile:.9});}
 SHOW(ANON,t,tNoName,W4-.05,NX+.2,1.9,NZ+.2);
 // ===== interrogation cell =====
 const ce=t>=W4&&t<W5;agentC.g.visible=ce;FOLDER.visible=ce&&t>tCaught+.2;
 if(ce){IR.lampSwing(t);IR.bars(sm(tPrison-.12,tPrison+.12,t));K.relax(M_);M_.g.position.set(600,-.45,-.72);M_.g.rotation.y=0;K.sit(M_,1);K.idle(M_,t);
  const sad=sm(tBack,tBack+.3,t);K.headHold(M_,.9*sad);K.face(M_,{jaw:.35*sad});
  K.relax(agentC);agentC.g.position.set(600.95,0,-.1);agentC.g.rotation.y=-Math.PI/2;K.idle(agentC,t,5);const sl=K.win(t,tCaught,tBack,.1);K.arm(agentC,'R',AD[0]+1.0*sl,AD[2]-.2,.4);K.point(agentC,'R',K.win(t,t75-.1,tPrison,.1));}
 SHOW(NBACK,t,tBack-.05,tPrison-.1,600,1.95,-.5);SHOW(N75,t,t75,tPrison-.1,600,1.65,-.5);SHOW(N5Y,t,tPrison-.05,W5,600,1.85,.4);
 RW.style.opacity=String(K.win(t,W5,tLegal,.1));
 // ===== legal path (yard lawn) =====
 const lg=t>=W5;for(const g of[VAULT,HSAB,TREE,CAL,SOLD])g.visible=lg;renter.g.visible=lg;kid.g.visible=lg&&t>tGive-.6;
 if(lg){K.relax(M_);K.idle(M_,t);
  // Mike walks from prop to prop, faces the camera, gestures on each beat
  const STOPS=[[W5,-.2,10.6],[t401-.2,-1.85,10.3],[tHSA-.25,-.2,10.4],[tRoth-.2,1.45,10.3],[tRent-.2,1.6,10.8],[tGive-.2,2.15,10.4],[tWatch-.1,0,11.0],[tLive-.2,-2.9,10.4],[tSameM-.2,-.4,10.8],[tWhere-.2,0,10.9]];
  let i=0;while(i<STOPS.length-1&&t>=STOPS[i+1][0])i++;const a=STOPS[i],b=STOPS[Math.min(i+1,STOPS.length-1)],u=sm(a[0],a[0]+.55,t);const pa=i>0?STOPS[i-1]:a;
  const x=pa[1]+(a[1]-pa[1])*u,z=pa[2]+(a[2]-pa[2])*u;M_.g.position.set(x,0,z);const moving=u>0&&u<1&&i>0&&(Math.abs(a[1]-pa[1])+Math.abs(a[2]-pa[2]))>.1;
  M_.g.rotation.y=moving?Math.atan2(a[1]-pa[1],a[2]-pa[2]):0;if(moving)K.walk(M_,t*1.2,.45);
  const g1=K.win(t,t401+.2,tHSA-.3,.12);if(g1>0){K.arm(M_,'L',AD[0]+1.1*g1,AD[2]-.3,.4);K.face(M_,{smile:.8*g1});}
  const g2=K.win(t,tHSA+.1,tRoth-.3,.12);if(g2>0){K.point(M_,'L',g2*(.6+.4*Math.max(0,Math.sin(t*4))));K.face(M_,{smile:.7});}
  const g3=K.win(t,tRoth,tRent-.3,.12);if(g3>0){K.shrug(M_,g3);K.face(M_,{smile:1.0*g3});}
  const g4=K.win(t,tRent,tGive-.3,.12);if(g4>0){K.point(M_,'L',g4);}
  const g5=K.win(t,tGive,tWatch-.2,.12);if(g5>0){K.arm(M_,'R',AD[0]+1.2*g5,AD[2]-.25,.35);K.face(M_,{smile:1.0});}
  const g6=K.win(t,tWatch,tLive-.3,.12);if(g6>0){K.point(M_,'R',g6);K.pose(M_,'head',0,.3*g6,0);}
  const g7=K.win(t,tLive+.3,tSameM-.3,.12);if(g7>0){K.armsUp(M_,g7*(.8+.2*Math.sin(t*6)));K.face(M_,{smile:1.1*g7});}
  const g8=K.win(t,tSameM,tWhere-.2,.12);if(g8>0){K.arm(M_,'L',AD[0]+1.0*g8,AD[2]-.6*g8,.3);K.arm(M_,'R',AD[0]+1.0*g8,AD[2]-.6*g8,.3);}
  const g9=sm(tWhere,tWhere+.3,t);if(g9>0){K.shrug(M_,g9*(.7+.3*Math.sin(t*3)));K.face(M_,{smile:.8});K.pose(M_,'head',0,.2*Math.sin(t*1.5),.1);}
  M_.g.updateMatrixWorld(true);
  // 401(k): straps fly from Mike into the glass vault
  VSTR.forEach((s,k)=>{const t0=t401+.15+k*.09,uu=Math.min(1,Math.max(0,(t-t0)/.3));s.m.visible=t>=t0;if(!s.m.visible)return;const from=VAULT.worldToLocal(wristW(M_,'L').clone());
   s.m.position.set(from.x+(s.to.x-from.x)*uu,from.y+(s.to.y+Math.floor(k/6)*.035-from.y)*uu+.3*uu*(1-uu)*4*.3,from.z+(s.to.z-from.z)*uu);s.m.rotation.set((1-uu)*2,0,0);});
  SHOW(N245,t,t245,tHSA-.1,-2.7,1.55,VZ);SHOW(NLATER,t,tSkip,tHSA-.1,-2.7,1.3,VZ);
  // HSA: three green checks IN / GROW / OUT
  [tIn,tGrow,tMed].forEach((tt,k)=>{SHOW(HSAL[k],t,tt,tRoth-.1,-1.35+k*.45,1.55,VZ+.25);const c=HSAC[k],a2=pop(t,tt+.05,.3)*(1-sm(tRoth-.1,tRoth+.1,t));c.visible=a2>.01;c.scale.setScalar(.22*Math.max(.001,a2));c.position.set(-1.35+k*.45,1.25,VZ+.25);c.quaternion.copy(cam.quaternion);});
  // Roth: money tree grows; growth never taxed
  const gr=sm(tRoth,tNever,t);TRUNK.scale.set(1,Math.max(.01,gr),1);TRUNK.position.y=.4+.5*gr;LEAF.forEach((l,k)=>{const s=Math.max(.001,sm(tRoth+.3+k*.05,tRoth+.7+k*.05,t));l.scale.setScalar(s);l.position.y=.75+.75*gr+Math.sin(k*1.3)*.18;});
  BILLS.forEach((b,k)=>{const s=sm(tRoth+.6+k*.06,tRoth+.9+k*.06,t);b.visible=s>0;b.position.set(Math.sin(k*2.1)*.32,.8+.7*gr+Math.cos(k*1.7)*.2,Math.cos(k*2.1)*.26);b.rotation.set(1.2,k,.3*Math.sin(t*3+k));b.scale.setScalar(.8*Math.max(.001,s));});
  SHOW(NFREE,t,tNever,tRent-.1,.85,2.25,VZ);
  // renter: walks in with a suitcase, pays Mike, rent tax free (14 days)
  {const rw=sm(tRent,t14+.2,t);K.relax(renter);renter.g.position.set(6-3.3*rw,0,11.4-0.3*rw);renter.g.rotation.y=rw<1?-Math.PI/2:-1.9;if(rw>0&&rw<1)K.walk(renter,t*1.2,.45);else K.idle(renter,t,6);
   K.arm(renter,'L',AD[0]+.15,AD[2]+.05,.1);renter.g.updateMatrixWorld(true);SUIT.visible=lg&&t<tGive;SUIT.position.copy(wristW(renter,'L')).add(V3(0,-.3,0));SUIT.rotation.y=renter.g.rotation.y;
   const pay=K.win(t,tRentFree-.3,tGive-.2,.1);K.arm(renter,'R',AD[0]+1.1*pay,AD[2]-.2,.3);RENTCASH.forEach((s,k)=>{s.visible=pay>.2;s.position.copy(wristW(renter,'R')).add(V3(0,.03+k*.02,0));s.rotation.y=renter.g.rotation.y;});
   renter.g.visible=lg&&t<tWatch;}
  CAL.visible=lg&&t>tRent-.1&&t<tWatch;CAL.scale.setScalar(Math.max(.001,pop(t,t14-.1,.3)));
  SHOW(N14,t,tRentFree,tGive-.1,2.3,2.05,VZ-.3);
  // gift to the kid
  {K.relax(kid);K.idle(kid,t,8);kid.g.position.set(3.15,0,VZ+.35);kid.g.rotation.y=-.9;const gv=sm(t19-.2,t19+.3,t);GIFT.visible=lg&&t>tGive&&t<tWatch;
   const wr=wristW(M_,'R'),wk2=wristW(kid,'R');GIFT.position.lerpVectors(wr,wk2,gv);GIFT.position.y+=.1;const jo=K.win(t,t19+.3,tWatch,.1);K.armsUp(kid,jo*(.8+.2*Math.sin(t*8)));K.face(kid,{smile:1.2*jo,jaw:.3*jo});}
  SHOW(N19,t,t19,tWatch-.1,2.85,1.75,VZ+.1);SHOW(NGIFT,t,tGift,tWatch-.1,2.85,1.48,VZ+.1);
  // twist teaser: big yellow ? over the house
  SHOW(NQ,t,tTwist-.1,tLive,0,4.4,5.8,1+.08*Math.sin(t*6));
  // sell: SOLD sign, 2 of 5 years, $250,000 tax free
  SOLD.visible=lg&&t>tLive-.2;SOLD.scale.setScalar(Math.max(.001,pop(t,tLive-.1,.3)));SOLDR.visible=t>tSell;SOLDR.scale.setScalar(Math.max(.001,pop(t,tSell,.25)));
  SHOW(N25,t,t2of5,tFive-.05,-3.5,2.15,10.4);SHOW(N250,t,t250,tSameM-.1,-3.4,1.9,10.4);
  // twist: 5 YEARS in prison (cage) vs 5 YEARS in your home
  CAGE.visible=lg&&t>tFive-.1&&t<tWhere;CAGE.scale.setScalar(Math.max(.001,pop(t,tFive-.1,.3)));
  SHOW(N5A,t,tFive,tWhere-.1,-1.5,2.45,10.2);SHOW(N5B,t,tFive+.15,tWhere-.1,-3.4,2.45,10.4);
  // same money: CRIME (red X on the cage) vs RULES (green check on the SOLD house side)
  SHOW(NCRIME,t,tCrime,tWhere-.1,-1.5,2.0,10.2);SHOW(NRULES,t,tRules-.1,tWhere-.1,-3.4,2.0,10.4);
  {const a2=pop(t,tCrime+.1,.3)*(1-sm(tWhere-.1,tWhere+.1,t));XC.visible=a2>.01;XC.scale.setScalar(.45*Math.max(.001,a2));XC.position.set(-1.5,1.1,10.75);XC.quaternion.copy(cam.quaternion);
   const b2=pop(t,tRules,.3)*(1-sm(tWhere-.1,tWhere+.1,t));CK.visible=b2>.01;CK.scale.setScalar(.45*Math.max(.001,b2));CK.position.set(-3.4,1.1,10.9);CK.quaternion.copy(cam.quaternion);}
  // CTA: four floating choices around Mike
  const PO=[[-.75,2.25],[.75,2.25],[-.75,1.7],[.75,1.7]];OPTS.forEach((o,k)=>SHOW(o.m,t,o.t0,0,PO[k][0],PO[k][1],10.9,1+.04*Math.sin(t*4+k)));}
 else{XC.visible=CK.visible=false;CAGE.visible=false;GIFT.visible=false;SUIT.visible=false;RENTCASH.forEach(s=>s.visible=false);}
};})();
