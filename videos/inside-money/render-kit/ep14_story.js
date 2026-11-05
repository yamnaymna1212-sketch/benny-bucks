// ================= EP14 STORY v2 (user 2026-11-05: "not all on maps - a normal explainer in real places") =================
// Hook 0-5.1 s stays on the map (ep14_hook.js, approved). Story = real places, one place + event per sentence, a white flash on each change of place
// (the same flash the approved hook uses), continuous camera inside a place. Camera looks +z in every street/room set -> SCREEN RIGHT = -x.
// A  GAS & GO station (Maple St x -31): Meet Mike / sign $2.82 JAN -> $4.27 FALL / +$22, bills fly into the pump
// B  Zack blue room (x -300): 1945 + radiation icon + ? ? ? / oil chart +7% JUNE 1 DAY / peace talks table (US + Iran flags, handshake, oil drops) / DAYS / CTA GAS or STOCKS
// C  desert oil field (x 300): pumpjacks, tanks, the barrel $70 -> MARCH $125, worker reacts
// D  ONE map shot: Strait of Hormuz, tankers, 1/5 OF WORLD OIL
// E  FIRST NATIONAL BANK (Maple St x -20): STOCKS screen falls red, two investors carry gold bars out, then fly along Maple St to the gas station
// F  Maple St: a delivery truck drives to MAPLE ELECTRONICS, price tags go up, Mike reacts
// EP13 rules: steady camera (no shake, no DoF), subject centred, a change every ~2 s, crisp high-contrast icons, characters react.
{
STORY10_OBJS.forEach(o=>o.visible=false);
// long facade signs of the bank + electronics store never fit a 9:16 close shot (cropped words) -> off; a short BANK sign stands in front instead
for(const o of scene.children)if(o.isGroup&&Math.abs(o.position.z-22.8)<.01&&(Math.abs(o.position.x+20)<.01||Math.abs(o.position.x+1)<.01))o.children.forEach(c=>{if(c.geometry&&c.geometry.type==='PlaneGeometry'&&Math.abs(c.position.y-3.5)<.01)c.visible=false;});
const WS=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tMeet=WS('meet'),tMike=WS('mike'),tFilled=WS('filled'),tCar=WS('car'),tHeres=WS('heres'),tNoOne=WS('no'),tNucW=WS('nuclear',1),t1945=WS('1945'),tSo1=WS('so'),tNobody=WS('nobody'),tBut=WS('but'),
 tIranW=WS('iran',1),tOil1=WS('oil'),tBefore=WS('before'),tBarrel=WS('barrel'),t70=WS('70'),tMarch=WS('march'),t125=WS('125'),
 tWhy=WS('why'),tStrait=WS('strait'),tFifth=WS('onefifth'),tLast=WS('last'),tJune=WS('june'),tStrike=WS('strike'),tPushed=WS('pushed'),t7=WS('7'),tSingle=WS('single'),
 tStocks=WS('stocks'),tFell=WS('fell'),tInv=WS('investors'),tRan=WS('ran'),tGold=WS('gold'),tNow=WS('now'),tJan=WS('january'),t282=WS('282'),tFall=WS('fall'),t427=WS('427'),
 tThats=WS('thats'),t22=WS('22'),tEvery=WS('every'),tFills=WS('fills'),t15=WS('15gallon'),tTank=WS('tank'),tTrucks=WS('trucks'),tPrice=WS('price'),tTravel=WS('travel'),
 tAnd4=WS('and',3),tPeace=WS('peace'),tOilD=WS('oil',4),tDrop=WS('drop'),tFast=WS('fast'),tFear=WS('fear'),tMoves=WS('moves'),tPricesW=WS('prices'),tDays=WS('days'),tSo=WS('so',2),
 tComment=WS('comment'),tGasC=WS('gas',1),tStocksC=WS('stocks',1),TEND=TLN.dur;
const HH=Math.PI,vis=(t,a,b)=>t>=a&&t<b,PS=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const win=(t,a,b)=>pop(t,a,.3)*(1-sm(b,b+.25,t));
const PTX=(s,size,col,p,t0,t1)=>popT(s,size,col,p,t0,t1);
const basicPlane=(w,h,map,x,y,z,ry=HH)=>{const m=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false,side:THREE.DoubleSide,transparent:true}),x,y,z,scene,false);m.rotation.y=ry;return m;};
const canv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,t,x:c.getContext('2d')};};
const FLASH=[tMeet,tHeres,tBut,tWhy,tLast,tStocks,tAnd4];   // a white flash on every change of place
const placeAt=t=>t<tMeet?'hook':t<tHeres?'gasA':t<tBut?'room1':t<tWhy?'oil':t<tLast?'map':t<tStocks?'room2':t<tTrucks-.15?'street':t<tAnd4?'shop':'room3';
// ================= A: GAS & GO (x -31) =================
const MKG=V3(-30.25,0,14.7);
const PYL=new THREE.Group();PYL.position.set(-33.4,0,14.4);scene.add(PYL);
add(B(.22,2.2,.22),M(0x2a2d33,.5,.4),0,1.1,0,PYL);add(B(1.5,2.0,.3),M(0xf2f2ee,.45),0,3.1,0,PYL);
const PYC=canv(600,800);const PYS=add(new THREE.PlaneGeometry(1.36,1.81),new THREE.MeshBasicMaterial({map:PYC.t,toneMapped:false}),0,3.1,-.16,PYL,false);PYS.rotation.y=HH;
let PYK='';function pylon(price,col,tag){const k=price+tag;if(k===PYK)return;PYK=k;const x=PYC.x;x.fillStyle='#0b1530';x.fillRect(0,0,600,800);x.fillStyle='#c25b0a';x.fillRect(0,0,600,150);
 x.fillStyle='#fff';x.textAlign='center';x.font='800 92px Mont';x.fillText('GAS & GO',300,108);x.font='800 70px Mont';x.fillText('REGULAR',300,250);
 x.fillStyle=col;x.font='800 190px Mont';x.fillText(price,300,470);x.fillStyle=tag==='FALL'?'#ff3b3b':'#ffc61a';x.fillRect(150,560,300,120);x.fillStyle='#0b1530';x.font='800 84px Mont';x.fillText(tag,300,650);
 x.strokeStyle='#fff';x.lineWidth=12;x.strokeRect(6,6,588,788);PYC.t.needsUpdate=true;}
pylon('$2.82','#22e06a','JAN');
PTX('$2.82',.42,GRN,V3(-33.4,4.55,14.2),t282-.05,tFall-.1);PTX('JANUARY',.2,WHT,V3(-33.4,5.12,14.2),tJan-.05,tFall-.1);
PTX('$4.27',.46,RED,V3(-33.4,4.55,14.2),t427-.05,tThats-.15);PTX('THIS FALL',.2,WHT,V3(-33.4,5.15,14.2),tFall-.05,tThats-.15);
const UP427=CK.icon('up',{color:'#ff2a2a',size:.36});scene.add(UP427);
PTX('+$22',.4,RED,V3(-29.15,2.3,14.6),t22-.05,tTrucks-.2);PTX('15 GALLONS',.17,WHT,V3(-29.15,1.9,14.6),t15-.05,tTrucks-.2);
PTX('MIKE',.22,WHT,MKG.clone().add(V3(0,2.12,0)),tMike-.1,tHeres-.15);
const FANG=MNY.fan(100,5,{spread:.8,glow:.12});FANG.scale.setScalar(1.1);scene.add(FANG);FANG.visible=false;
const BILLS=[];for(let i=0;i<8;i++){const b=MNY.note(100,{curve:.01});b.scale.setScalar(.9);b.visible=false;scene.add(b);BILLS.push(b);}
// ================= B: the Zack blue room (x -300) =================
const RX=-300,RZ=0;
{const wall=new THREE.MeshStandardMaterial({color:0x1b2f72,roughness:.95,envMapIntensity:.2}),flo=new THREE.MeshStandardMaterial({color:0x13235a,roughness:.9,envMapIntensity:.2});
 const w=add(new THREE.PlaneGeometry(60,20),wall,RX,10,RZ+5,scene,false);w.rotation.y=HH;w.receiveShadow=true;
 const f=add(new THREE.PlaneGeometry(80,60),flo,RX,.035,RZ-20,scene,false);f.rotation.x=-Math.PI/2;f.receiveShadow=true;
 add(B(60,.1,.08),M(0x2e4aa0,.6),RX,.08,RZ+4.96,scene,false);}
// --- zone 1 (x RX): 1945 + radiation icon + ? ? ?
const RADT=tex(256,256,x=>{x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.fillStyle='#111';for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,128);x.arc(128,128,100,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,26,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,128,16,0,7);x.fill();});
const RAD=add(new THREE.CircleGeometry(.42,64),new THREE.MeshBasicMaterial({map:RADT,toneMapped:false,side:THREE.DoubleSide}),RX-1.0,2.95,RZ+2.2,scene,false);RAD.rotation.y=HH;
PTX('1945',.62,WHT,V3(RX-1.0,1.75,RZ+2.2),t1945-.05,tBut-.2);
[0,1,2].forEach(i=>PTX('?',.5,YEL,V3(RX-2.2+i*1.2,3.55+(i%2)*.25,RZ+2.2),tNobody+i*.14,tBut-.2));
// --- zone 2 (x RX-8): oil price chart, LAST JUNE, strike, +7%, 1 DAY
const Z2=V3(RX-8,0,RZ);
const CHC=canv(1024,640);const CHART=add(new THREE.PlaneGeometry(4.2,2.62),new THREE.MeshBasicMaterial({map:CHC.t,toneMapped:false}),Z2.x,2.4,RZ+4.9,scene,false);CHART.rotation.y=HH;
let CHK=-1;function chart(k){const q=Math.round(k*60);if(q===CHK)return;CHK=q;const x=CHC.x;x.fillStyle='#0d1838';x.fillRect(0,0,1024,640);x.strokeStyle='#fff';x.lineWidth=10;x.strokeRect(5,5,1014,630);
 x.fillStyle='#fff';x.font='800 70px Mont';x.textAlign='center';x.fillText('OIL PRICE',512,92);
 x.strokeStyle='#3a4a78';x.lineWidth=4;for(let i=0;i<4;i++){x.beginPath();x.moveTo(70,190+i*100);x.lineTo(960,190+i*100);x.stroke();}
 const P=[[70,470],[160,455],[250,468],[340,450],[430,462],[520,448],[610,458]];x.strokeStyle='#ffffff';x.lineWidth=14;x.lineJoin='round';x.lineCap='round';x.beginPath();P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();
 if(k>0){const e=[610+260*k,458-250*k];x.strokeStyle='#ff2a2a';x.lineWidth=18;x.beginPath();x.moveTo(610,458);x.lineTo(e[0],e[1]);x.stroke();x.fillStyle='#ff2a2a';x.beginPath();x.arc(e[0],e[1],18,0,7);x.fill();}
 CHC.t.needsUpdate=true;}
chart(0);
PTX('LAST JUNE',.26,WHT,V3(Z2.x,4.05,RZ+4.6),tJune-.05,tStocks-.1);
PTX('+7%',.55,RED,V3(Z2.x-1.15,1.75,RZ+4.5),t7-.05,tStocks-.1);PTX('1 DAY',.26,YEL,V3(Z2.x-1.15,1.28,RZ+4.5),tSingle-.05,tStocks-.1);
const BOOMI=CK.icon('warn',{color:'#ff2a2a',size:.5});scene.add(BOOMI);
// --- zone 3 (x RX+8): peace talks: table, US + Iran flags, two diplomats shake hands, the oil barrel drops
const Z3=V3(RX+8,0,RZ);
{const wd=pbr('oak_wood_planks',1,1,0x8a5a3a);add(B(2.4,.06,.9),wd,Z3.x,.76,RZ+2.35);for(const sx of[-1,1])for(const sz of[-1,1])add(B(.07,.76,.07),wd,Z3.x+sx*1.1,.38,RZ+2.35+sz*.36);
 for(const [mat,dx] of[[USFM,.7],[IRFM,-.7]]){add(CY(.012,.012,.42,10),M(0xd6d9de,.3,.9),Z3.x+dx,.99,RZ+2.35);const f=add(new THREE.PlaneGeometry(.34,.2),mat,Z3.x+dx,1.1,RZ+2.34,scene,false);f.rotation.y=HH;}
 for(const [mat,dx] of[[USFM,1.75],[IRFM,-1.75]]){add(CY(.03,.03,2.6,12),M(0xd6d9de,.3,.9),Z3.x+dx,1.3,RZ+3.4);const f=add(new THREE.PlaneGeometry(1.1,.62),mat,Z3.x+dx,2.25,RZ+3.38,scene,false);f.rotation.y=HH;}}
PTX('PEACE TALKS',.3,WHT,V3(Z3.x,3.0,RZ+2.6),tPeace-.05,tOilD-.15);
const DIP=[person('elsayed',Z3.x+.5,0,RZ+1.55,HH+.45),person('teller',Z3.x-.5,0,RZ+1.55,HH-.45)];DIP.forEach(P=>FK.rig(P,{}));
function oilBarrel(g,r=.38,h=1.15){const bm=M(0x1f4f9a,.45,.4);add(CY(r,r,h,40),bm,0,h/2,0,g);for(const y of[.06,.33,.67,.94])add(CY(r+.015,r+.015,.045,40),M(0x173d78,.4,.5),0,y*h,0,g);
 const lt=tex(512,256,x=>{x.fillStyle='#f2f2ee';x.fillRect(0,0,512,256);x.fillStyle='#111';x.font='800 140px Mont';x.textAlign='center';x.fillText('OIL',256,180);});
 const l=add(new THREE.PlaneGeometry(r*1.15,r*.58),new THREE.MeshStandardMaterial({map:lt,roughness:.7}),0,h*.52,-r-.006,g,false);l.rotation.y=HH;return g;}
const BAR3=new THREE.Group();BAR3.position.set(Z3.x-2.15,0,RZ+1.7);scene.add(BAR3);oilBarrel(BAR3);
const DNOIL=CK.icon('down',{color:'#22e06a',size:.5});scene.add(DNOIL);PTX('OIL',.3,GRN,V3(Z3.x-2.15,2.5,RZ+1.6),tOilD-.05,tFear-.1);
// --- zone 4 (x RX+3): DAYS (calendar flips, up/down arrows) + CTA GAS / STOCKS
const Z4=V3(RX+3,0,RZ);
PTX('DAYS',.7,YEL,V3(Z4.x-.9,2.85,RZ+2.4),tDays-.08,tSo-.15);PTX('FEAR',.36,RED,V3(Z4.x-.9,3.75,RZ+2.4),tFear-.05,tSo-.15);
const CAL=new THREE.Group();CAL.position.set(Z4.x-.9,1.55,RZ+2.4);scene.add(CAL);
const CALC=canv(512,512);add(B(1.0,1.0,.12),M(0xf6f6f4,.5),0,0,0,CAL);const CALP=add(new THREE.PlaneGeometry(.96,.96),new THREE.MeshBasicMaterial({map:CALC.t,toneMapped:false}),0,0,-.065,CAL,false);CALP.rotation.y=HH;
const PAGE=new THREE.Group();PAGE.position.set(0,.48,-.075);CAL.add(PAGE);const PG=add(new THREE.PlaneGeometry(.96,.96),new THREE.MeshBasicMaterial({map:CALC.t,toneMapped:false}),0,-.48,0,PAGE,false);PG.rotation.y=HH;add(new THREE.PlaneGeometry(.96,.96),new THREE.MeshBasicMaterial({color:0xf2f2f2,toneMapped:false}),0,-.48,.001,PAGE,false);
let CALK='';const DAYN=['MON','TUE','WED','THU','FRI'];function cal(i){const k=DAYN[i%5];if(k===CALK)return;CALK=k;const x=CALC.x;x.fillStyle='#ffffff';x.fillRect(0,0,512,512);x.fillStyle='#d21e2a';x.fillRect(0,0,512,150);
 x.fillStyle='#fff';x.font='800 96px Mont';x.textAlign='center';x.fillText('DAY',256,110);x.fillStyle='#111';x.font='800 200px Mont';x.fillText(k,256,390);CALC.t.needsUpdate=true;}cal(0);
const UPD=CK.icon('up',{color:'#ff2a2a',size:.42}),DND=CK.icon('down',{color:'#22e06a',size:.42});scene.add(UPD,DND);
function ctaSign(txt,col,dx){const g=new THREE.Group();g.position.set(Z4.x+dx,0,RZ+1.5);scene.add(g);add(CY(.035,.035,1.7,12),M(0xd6d9de,.3,.9),0,.85,0,g);
 const c=tex(640,320,x=>{x.fillStyle=col;x.fillRect(0,0,640,320);x.strokeStyle='#fff';x.lineWidth=18;x.strokeRect(9,9,622,302);x.fillStyle='#fff';x.font='800 150px Mont';x.textAlign='center';x.fillText(txt,320,215);});
 const p=add(new THREE.PlaneGeometry(1.1,.55),new THREE.MeshBasicMaterial({map:c,toneMapped:false,side:THREE.DoubleSide}),0,1.95,0,g,false);p.rotation.y=HH;g.visible=false;return g;}
const CGAS=ctaSign('GAS','#d21e2a',1.35),CSTK=ctaSign('STOCKS','#13a34a',-1.35);
const MKR4=V3(Z4.x,0,RZ+1.25);
// ================= C: the oil field (x 300) =================
const OX=300,OZ=0;
{const s=add(new THREE.CircleGeometry(260,64),new THREE.MeshStandardMaterial({color:0xc48f55,roughness:.95,envMapIntensity:.3}),OX,.03,OZ+40,scene,false);s.rotation.x=-Math.PI/2;s.receiveShadow=true;
 for(let i=0;i<18;i++){const d=add(new THREE.SphereGeometry(1,16,8),M(0xb98450,.95),OX-60+i*7+Math.sin(i*3)*3,0,OZ+40+Math.sin(i*1.7)*6,scene,false);d.scale.set(6+3*Math.sin(i),1.4+.8*Math.sin(i*2.3),5);}}   // dunes on the horizon
const JACKS=[];function pumpjack(x,z,s=1,ph=0){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);const st=M(0x2b2f36,.5,.6),yl=M(0xf2b51c,.45,.3);
 add(B(3.4,.18,.9),M(0x6b6f75,.7,.4),0,.09,0,g);for(const dz of[-.32,.32]){const l=add(B(.12,2.3,.12),st,0,1.2,dz,g);l.rotation.x=dz>0?-.12:.12;}
 const beam=new THREE.Group();beam.position.set(0,2.35,0);g.add(beam);add(B(3.2,.2,.22),yl,0,0,0,beam);
 const head=add(new THREE.CylinderGeometry(.55,.55,.26,24,1,false,0,Math.PI),yl,1.7,-.15,0,beam);head.rotation.set(Math.PI/2,0,Math.PI/2);
 const crank=new THREE.Group();crank.position.set(-1.25,.9,0);g.add(crank);add(B(.25,1.1,.12),M(0xd21e2a,.45),0,-.3,.28,crank);add(CY(.12,.12,.7,16),st,0,0,0,crank).rotation.x=Math.PI/2;
 add(CY(.03,.03,1.9,8),M(0x9a9ea5,.4,.8),1.9,1.0,0,g);add(B(.6,.6,.6),M(0x5a5e64,.6,.5),-1.25,.3,0,g);JACKS.push({beam,crank,ph});return g;}
pumpjack(OX+4.2,OZ+7.5,1,0);pumpjack(OX-5.5,OZ+10,1.1,1.7);pumpjack(OX+11,OZ+14,1.2,3.1);pumpjack(OX-14,OZ+16,1.2,.8);
for(const [x,z,r,h] of[[OX-9,OZ+22,3.2,4.2],[OX-1.5,OZ+24,3.6,4.6],[OX+7,OZ+21,2.8,3.6]]){add(CY(r,r,h,40),M(0xe8e9ec,.45,.3),x,h/2,z);add(CY(r+.02,r+.02,.2,40),M(0xd21e2a,.5),x,h*.72,z);}
for(let i=0;i<7;i++){const g=new THREE.Group();const row=i<4?0:1;g.position.set(OX-3.3+(row?.4:0)+(i%4)*.8,row?1.1:0,OZ+3.3);scene.add(g);oilBarrel(g,.36,1.1);}
const BARO=new THREE.Group();BARO.position.set(OX,0,OZ+1.6);scene.add(BARO);oilBarrel(BARO,.42,1.3);
{add(CY(.04,.04,3.6,12),M(0xd6d9de,.3,.9),OX+6.2,1.8,OZ+4.5);const f=add(new THREE.PlaneGeometry(1.4,.8),IRFM,OX+6.9,3.1,OZ+4.5,scene,false);f.rotation.y=HH;}
PTX('$70',.5,GRN,V3(OX,2.0,OZ+1.6),t70-.05,tMarch-.05);PTX('1 BARREL',.2,0x0b1a3d,V3(OX,2.6,OZ+1.6),tBarrel-.05,tMarch-.05);
PTX('$125',.55,RED,V3(OX,2.05,OZ+1.6),t125-.05,tWhy-.2);PTX('MARCH',.24,0x0b1a3d,V3(OX,2.72,OZ+1.6),tMarch-.05,tWhy-.2);
const UP125=CK.icon('up',{color:'#ff2a2a',size:.42});scene.add(UP125);
const WORK=person('seller',OX+1.15,0,OZ+1.3,HH-.35);FK.rig(WORK,{});
{WORK.g.updateMatrixWorld(true);const h=V3();WORK.BN.head.getWorldPosition(h);const hat=new THREE.Group();hat.position.copy(h).add(V3(0,.1,0));scene.add(hat);const ym=M(0xf2c31c,.35,.1);
 const d=add(new THREE.SphereGeometry(.135,24,12,0,Math.PI*2,0,Math.PI/2),ym,0,0,0,hat);d.scale.set(1,.9,1.1);add(CY(.17,.17,.02,24),ym,0,0,0,hat);WORK.BN.head.attach(hat);}
// ================= D: the map shot (Strait of Hormuz) - the map is built in ep14_hook.js =================
const HZ=mxz(56.7,25.7,.03);
const HZR=add(new THREE.RingGeometry(.26,.33,64),new THREE.MeshBasicMaterial({color:0xffc61a,toneMapped:false,side:THREE.DoubleSide}),HZ.x,.21,HZ.z,scene,false);HZR.rotation.x=-Math.PI/2;
PTX('STRAIT OF HORMUZ',.16,0x0b1a3d,HZ.clone().add(V3(1.05,.3,.1)),tStrait-.05,tLast-.1);
PTX('1/5 OF WORLD OIL',.2,YEL,HZ.clone().add(V3(1.75,.3,.1)),tFifth-.05,tLast-.1);
const SHIPC=new THREE.CatmullRomCurve3([mxz(50.8,27.0),mxz(53.6,25.4),mxz(56.4,25.4),mxz(57.8,23.9),mxz(60,22.0),mxz(63,19.8)].map(p=>p.setY(.03)));
function tanker(s=1){const g=new THREE.Group();add(B(.2,.035,.06),M(0xb3261e,.5,.2),0,.018,0,g);add(B(.2,.012,.058),M(0x2a2a2a,.5,.3),0,.04,0,g);add(B(.035,.04,.05),M(0xf2f2f2,.5),-.075,.065,0,g);g.scale.setScalar(s);scene.add(g);return g;}
const SHIPS=[0,1,2,3].map(()=>tanker(1.7));
// ================= E: the bank (x -20): STOCKS screen + investors carry gold =================
const BKX=-20,BKZ=18.8;
const STC=canv(900,600);const STK=new THREE.Group();STK.position.set(BKX-1.6,0,BKZ-1.4);scene.add(STK);
add(CY(.05,.05,1.5,12),M(0xd6d9de,.3,.9),0,.75,0,STK);add(B(2.2,1.5,.1),M(0x111318,.4,.4),0,2.15,.06,STK);const STS=add(new THREE.PlaneGeometry(2.1,1.4),new THREE.MeshBasicMaterial({map:STC.t,toneMapped:false}),0,2.15,0,STK,false);STS.rotation.y=HH;
let STKK=-1;function stocks(k){const q=Math.round(k*50);if(q===STKK)return;STKK=q;const x=STC.x;x.fillStyle='#0b1530';x.fillRect(0,0,900,600);x.fillStyle='#fff';x.font='800 96px Mont';x.textAlign='center';x.fillText('STOCKS',450,110);
 x.strokeStyle='#33415f';x.lineWidth=4;for(let i=1;i<5;i++){x.beginPath();x.moveTo(40,140+i*85);x.lineTo(860,140+i*85);x.stroke();}
 const P=[[50,200],[150,215],[240,195],[330,230],[420,215],[510,300],[600,285],[690,420],[790,520]],n=k*(P.length-1);x.strokeStyle=k>.4?'#ff2a2a':'#22e06a';x.lineWidth=16;x.lineJoin='round';x.lineCap='round';x.beginPath();
 for(let i=0;i<=Math.min(P.length-1,Math.ceil(n));i++){let [a,b]=P[i];if(i>n){const p0=P[i-1],f=n-(i-1);a=p0[0]+(a-p0[0])*f;b=p0[1]+(b-p0[1])*f;}i?x.lineTo(a,b):x.moveTo(a,b);}x.stroke();
 x.strokeStyle='#fff';x.lineWidth=10;x.strokeRect(5,5,890,590);STC.t.needsUpdate=true;}
stocks(.4);
const DNST=CK.icon('down',{color:'#ff2a2a',size:.42});scene.add(DNST);
const INV=[person('guard',BKX+.6,0,BKZ-.4,HH),person('printer',BKX+1.4,0,BKZ-.2,HH)];INV.forEach(P=>FK.rig(P,{}));
const goldM=new THREE.MeshStandardMaterial({color:0xffc61a,roughness:.22,metalness:1,emissive:0x8a5a00,emissiveIntensity:.9});
const GOLDS=INV.map(()=>{const g=new THREE.Group();for(const [x,y] of[[-.07,0],[.07,0],[0,.06]]){const b=new THREE.Mesh(new THREE.BoxGeometry(.13,.06,.26),goldM);b.position.set(x,y,0);b.castShadow=true;g.add(b);}scene.add(g);return g;});
{const bt=tex(800,220,x=>{x.fillStyle='#14335f';x.fillRect(0,0,800,220);x.strokeStyle='#ffc61a';x.lineWidth=12;x.strokeRect(6,6,788,208);x.fillStyle='#fff';x.font='800 150px Mont';x.textAlign='center';x.fillText('BANK',400,165);});add(CY(.05,.05,2.0,12),M(0xd6d9de,.3,.9),BKX+2.9,1.0,BKZ-1.1);basicPlane(1.4,.39,bt,BKX+2.9,2.15,BKZ-1.16);}
PTX('GOLD',.34,YEL,V3(BKX+1.5,2.3,BKZ-1.9),tGold-.05,tNow-.1);
// ================= F: delivery truck + MAPLE ELECTRONICS price tags =================
const SHX=-2.2,SHZ=16.6;
function boxTruck(){const g=new THREE.Group();scene.add(g);const wh=M(0xf4f4f4,.5),bl=M(0x1d4fd0,.4,.3),dk=M(0x111111,.6);
 add(RB(4.2,2.3,2.1,.06),wh,-.7,1.6,0,g);add(RB(1.6,1.7,2.0,.12),bl,2.2,1.25,0,g);add(B(.06,.7,1.7),GLASS,3.0,1.6,0,g,false);
 for(const x of[-2.2,-1.2,2.3])for(const z of[-.98,.98]){const w=add(CY(.42,.42,.3,24),dk,x,.42,z,g);w.rotation.x=Math.PI/2;}
 const lt=tex(1024,320,x=>{x.fillStyle='#f4f4f4';x.fillRect(0,0,1024,320);x.fillStyle='#d21e2a';x.font='800 150px Mont';x.textAlign='center';x.fillText('DELIVERY',512,210);});
 const l=add(new THREE.PlaneGeometry(3.6,1.1),new THREE.MeshStandardMaterial({map:lt,roughness:.6}),-.7,1.75,-1.06,g,false);l.rotation.y=HH;return g;}
const TRK=boxTruck();const TRZ=11.4,trkX=t=>{const k=sm(tTrucks-.6,tPrice-.2,t);return -34+k*(SHX-8.5+34);};
const SHOP=new THREE.Group();SHOP.position.set(SHX,0,SHZ);scene.add(SHOP);
{const wd=pbr('oak_wood_planks',1,1,0x8a5a3a);add(B(2.8,.06,.8),wd,0,.8,0,SHOP);for(const sx of[-1,1])for(const sz of[-1,1])add(B(.06,.8,.06),wd,sx*1.32,.4,sz*.33,SHOP);}
model('Television_01',SHX+.95,.83,SHZ,.55,HH,scene);
const boxP=(w,h,d,txt,col,x)=>{const t=tex(512,512,c=>{c.fillStyle=col;c.fillRect(0,0,512,512);c.fillStyle='#fff';c.font='800 110px Mont';c.textAlign='center';c.fillText(txt,256,290);});
 const tm=new THREE.MeshStandardMaterial({map:t,roughness:.6});return add(B(w,h,d),[M(col,.6),M(col,.6),M(col,.6),M(col,.6),tm,tm],SHX+x,.83+h/2,SHZ);};
boxP(.42,.6,.18,'CEREAL','#e0782a',0);boxP(.6,.3,.36,'SHOES','#2a2f3a',-.9);
const TAGS=[.95,0,-.9].map(dx=>{const t=tex(256,160,c=>{c.fillStyle='#fff';c.fillRect(0,0,256,160);c.strokeStyle='#111';c.lineWidth=8;c.strokeRect(4,4,248,152);c.fillStyle='#d21e2a';c.font='800 120px Mont';c.textAlign='center';c.fillText('$',128,130);});
 return basicPlane(.3,.19,t,SHX+dx,1.75,SHZ-.35);});
const UPT=TAGS.map(()=>{const ic=CK.icon('up',{color:'#ff2a2a',size:.22});scene.add(ic);return ic;});
const MKS=V3(SHX-1.95,0,SHZ-.45);
// ================= Mike =================
const MA14={};const solveAt=(P,key,sd,tgt)=>{if(!MA14[key]){P.g.updateMatrixWorld(true);MA14[key]=solveReach(P,sd,tgt);relax(P);}return MA14[key];};
function mikeStory(t){const P=MIKE,pl=placeAt(t);let at=null,ry=HH;
 if(pl==='gasA'||(pl==='street'&&t>=tNow-.3)){at=MKG;ry=HH-.25;}else if(pl==='room1')at=V3(RX+1.0,0,RZ+1.1);else if(pl==='room2'){at=V3(Z2.x+2.55,0,RZ+3.4);ry=HH-.2;}
 else if(pl==='shop'){at=MKS;ry=HH-.5;}else if(pl==='room3'&&t>=tFear-.3)at=MKR4;
 if(pl==='hook')return;P.g.visible=!!at;if(!at)return;relax(P);P.g.position.copy(at);P.g.rotation.y=ry;idle(P,t,1.3);
 let ex=[['joy',.4]],look=cam.position;const A=(sd,key,tg,k)=>{if(k<=0)return;setA(P,sd,lerpA(REST,solveAt(P,key,sd,tg),k));curl(P,sd,.55,.3);};
 if(pl==='gasA'){if(t<tFilled-.15){wave(P,'R',t);ex=[['joy',.9]];}else{A('R','pick',V3(-28.6,1.25,15.0),sm(tFilled-.15,tFilled+.2,t));ex=[['joy',.7]];look=t<tCar+.3?V3(-27,1.2,15.6):cam.position;}}
 else if(pl==='room1'){
  if(t<tNoOne-.1){A('R','up1',at.clone().add(V3(.25,1.85,-.25)),sm(tHeres,tHeres+.25,t));ex=[['doubt',.3]];}                      // "Here's the thing": one finger up
  else if(t<tSo1-.1){A('L','p1945',V3(RX-.7,2.0,RZ+2.0),sm(tNoOne-.1,tNoOne+.25,t));ex=[['doubt',.5]];look=V3(RX-1,2.3,RZ+2.2);}   // points at 1945
  else{const k=sm(tSo1-.1,tSo1+.25,t);arm(P,'L',AD[0]+.35*k,AD[2]-.85*k,1.2*k);arm(P,'R',AD[0]+.35*k,AD[2]-.85*k,1.2*k);pose(P,'head',0,.15*Math.sin((t-tSo1)*3),.12*k);ex=[['doubt',.9]];}}   // shrug
 else if(pl==='room2'){
  if(t<t7-.15){A('L','pch',V3(Z2.x+1.6,2.0,RZ+4.3),sm(tLast+.1,tLast+.4,t));look=V3(Z2.x+.6,2.3,RZ+4.8);ex=[['doubt',.4]];}
  else{const k=sm(t7-.15,t7+.15,t);armsUp(P,.5*k);ex=[['shock',.95*k]];}}
 else if(pl==='street'){   // at his gas station: looks at the sign, shocked at $4.27, pays (bills fly into the pump)
  if(t<t427-.1){look=V3(-33.4,3.2,14.4);ex=[['doubt',.3]];}
  else if(t<tThats){const k=sm(t427-.1,t427+.2,t);arm(P,'L',AD[0]+.6*k,AD[2]-.5*k,1.4*k);arm(P,'R',AD[0]+.6*k,AD[2]-.5*k,1.4*k);ex=[['shock',.95*k]];}   // hands to the face
  else{A('R','pay',V3(-30.85,1.25,14.9),sm(tThats,tThats+.3,t));ex=[['shock',.55]];look=V3(-31,1.4,15.3);
   if(t>tFills)pose(P,'head',0,.3*Math.sin((t-tFills)*9)*(1-sm(tTank,tTank+.3,t)),0);}}   // head shake
 else if(pl==='shop'){look=t<tPrice-.3?TRK.position.clone().add(V3(0,1.5,0)):V3(SHX,1.6,SHZ);ex=t<tPrice?[['doubt',.4]]:[['shock',.8]];
  if(t>tPrice){const k=sm(tPrice,tPrice+.3,t);arm(P,'R',AD[0]+.3*k,AD[2]-1.0*k,.9*k);}}
 else if(pl==='room3'){
  if(t<tSo-.1){A('R','pdays',V3(Z4.x-.7,2.2,RZ+2.1),sm(tFear,tFear+.3,t)*(1-sm(tSo-.4,tSo-.1,t)));look=V3(Z4.x-.9,2.6,RZ+2.4);ex=[['doubt',.5]];}
  else{const kg=sm(tGasC-.25,tGasC+.05,t)*(1-sm(tStocksC-.35,tStocksC-.1,t)),ks=sm(tStocksC-.25,tStocksC+.05,t),ko=sm(tSo,tSo+.3,t)*(1-sm(tComment-.4,tComment-.1,t));
   if(ko>0){arm(P,'L',AD[0]+.3*ko,AD[2]-.95*ko,.5*ko);arm(P,'R',AD[0]+.3*ko,AD[2]-.95*ko,.5*ko);}
   A('R','pgas',V3(Z4.x+1.25,1.9,RZ+1.4),kg);A('L','pstk',V3(Z4.x-1.25,1.9,RZ+1.4),ks);ex=[['joy',.6]];}}
 face(P,{jaw:.03+.035*Math.abs(Math.sin(t*9)),smile:ex[0][0]==='joy'?.4:0});FK.update(P,t,{expr:ex,look});}
// ================= other people =================
function others(t){const pl=placeAt(t);
 WORK.g.visible=pl==='oil';if(WORK.g.visible){const P=WORK;relax(P);P.g.position.set(OX+1.15,0,OZ+1.3);P.g.rotation.y=HH-.35;idle(P,t,2);let ex=[['joy',.3]],look=cam.position;
  if(t>t70-.3&&t<t125-.1){setA(P,'L',lerpA(REST,solveAt(P,'w70','L',V3(OX+.35,1.25,OZ+1.3)),sm(t70-.3,t70,t)*(1-sm(tMarch,tMarch+.3,t))));curl(P,'L',.55,.3);look=V3(OX,1.6,OZ+1.6);}
  if(t>t125-.1){const k=sm(t125-.1,t125+.2,t);armsUp(P,.45*k);ex=[['shock',.95*k]];}
  FK.update(P,t,{expr:ex,look});}
 INV.forEach((P,i)=>{const on=pl==='street'&&t<tNow+.6;P.g.visible=GOLDS[i].visible=on;if(!on)return;relax(P);
  const k=sm(tRan-.2+i*.15,tNow+.5,t),x=BKX+.6+i*.9+k*(1.2+i*.3),z=BKZ-.5-k*2.0;P.g.position.set(x,0,z);P.g.rotation.y=HH+.45;if(k>0&&k<1)walk(P,t*1.25+i,.42);else idle(P,t,i);
  arm(P,'L',AD[0]+.75,AD[2]-.35,1.1);arm(P,'R',AD[0]+.75,AD[2]-.35,1.1);P.g.updateMatrixWorld(true);const a=V3(),b=V3();P.BN.wristL.getWorldPosition(a);P.BN.wristR.getWorldPosition(b);GOLDS[i].position.copy(a.add(b).multiplyScalar(.5)).add(V3(0,.06,0));GOLDS[i].rotation.y=P.g.rotation.y;
  FK.update(P,t,{expr:[['shock',.6]],look:cam.position});});
 DIP.forEach((P,i)=>{P.g.visible=pl==='room3'&&t<tFear+.4;if(!P.g.visible)return;relax(P);P.g.position.set(Z3.x+(i?-.5:.5),0,RZ+1.55);P.g.rotation.y=HH+(i?-.45:.45);idle(P,t,i*2);
  const sd=i?'R':'L',k=sm(tPeace-.1,tPeace+.3,t);const a=solveAt(P,'dip'+i,sd,V3(Z3.x,1.08,RZ+1.32));setA(P,sd,lerpA(REST,a,k));curl(P,sd,.75,.55);
  if(k>.95){const s=.05*Math.sin((t-tPeace)*12)*(1-sm(tOilD,tOilD+.3,t));pose(P,'lowerarm01'+sd,a.lx+s,0,0);}
  face(P,{jaw:0,smile:.5});FK.update(P,t,{expr:[['joy',.7]],look:t<tOilD?DIP[1-i].g.position.clone().add(V3(0,1.6,0)):cam.position});});}
// ================= per-frame story update =================
const _w2=V3(),SEA14=new THREE.Color(0x2a7be4),FOG14=new THREE.Fog(0x2a7be4,40,120);
story14=function(t){const pl=placeAt(t);
 const onMap=pl==='hook'||pl==='map';MAPG.visible=onMap;LBL_IR.visible=pl==='hook';
 if(!onMap){scene.background=hdr;scene.fog=null;sun.intensity=3.4;}else if(pl==='map'){scene.background=SEA14;scene.fog=FOG14;sun.intensity=2.2;}
 if(t>=tMeet){BLAST.visible=false;SAFE14.visible=false;LBL_USA.visible=false;FAN14.visible=false;DOWN14.visible=false;}
 {let f=Math.max(0,1-Math.abs(t-HOOK14.tWhat2)/.14)*.95;for(const tf of FLASH)f=Math.max(f,(1-Math.abs(t-tf)/.12)*.92);WF14.style.opacity=String(f);}
 // A: pump + pylon
 P1.draw(pl==='gasA'?'15.000':(15*sm(tEvery,tTank,t)).toFixed(3),t<t427?'$2.82':'$4.27',t<t427?'#4dff74':'#ff4a3a');
 pylon(t<t427?'$2.82':'$4.27',t<t427?'#22e06a':'#ff3b3b',t<tFall?'JAN':'FALL');
 {const d=t-t427;PYL.scale.setScalar(d>0&&d<.4?1+.06*Math.sin(d/.4*Math.PI):1);}
 CK.iconAnim(UP427,t,t427+.05,tThats-.15,{pos:V3(-32.25,4.6,14.2),cam,spin:.3});
 FANG.visible=pl==='street'&&t>tThats+.1&&t<tFills;if(FANG.visible){MIKE.g.updateMatrixWorld(true);const fb=MIKE.BN['finger3-1R']||MIKE.BN.wristR;fb.getWorldPosition(FANG.position);fb.getWorldQuaternion(FANG.quaternion);FANG.rotateY(Math.PI);FANG.rotateZ(Math.PI/2);}
 BILLS.forEach((b,i)=>{const d=t-(tEvery+i*.16);b.visible=pl==='street'&&d>0&&d<.6;if(!b.visible)return;MIKE.g.updateMatrixWorld(true);MIKE.BN.wristR.getWorldPosition(_w2);const tg=V3(-31,1.45,15.25);
  b.position.copy(_w2.lerp(tg,sm(0,.6,d))).add(V3(0,.25*Math.sin(d/.6*Math.PI),0));b.rotation.set(d*4+i,d*3,d*2);b.scale.setScalar(.9*(1-sm(.45,.6,d))+.001);});
 // B zone 1
 PS(RAD,pl==='room1'?win(t,tNucW-.05,tBut-.2):0);if(RAD.visible)RAD.rotation.z=.4*Math.sin(t*1.5);
 // B zone 2: chart spikes on 'strike' -> '7%'
 chart(sm(tStrike,t7+.1,t));CK.iconAnim(BOOMI,t,tStrike-.05,tPushed+.2,{pos:V3(Z2.x-2.6,3.7,RZ+4.5),cam,spin:.3});
 // B zone 3 + 4
 PS(BAR3,pl==='room3'&&t<tFear+.4?pop(t,tOilD-.3,.3)*(1-.25*sm(tDrop,tDrop+.5,t)):0);CK.iconAnim(DNOIL,t,tDrop-.05,tFear-.1,{pos:V3(Z3.x-2.15,1.75,RZ+1.4),cam,spin:.3});
 PS(CAL,win(t,tFear-.05,tSo-.15));if(CAL.visible){const e=Math.max(0,t-tFear),i=Math.floor(e/.32),f=(e/.32)%1;cal(i+1);PAGE.rotation.x=-f*Math.PI*.9;PG.visible=f<.9;}
 CK.iconAnim(UPD,t,tMoves+.05,tSo-.15,{pos:V3(Z4.x-2.05,2.1,RZ+2.3),cam,spin:.3});CK.iconAnim(DND,t,tPricesW+.05,tSo-.15,{pos:V3(Z4.x+.25,2.1,RZ+2.3),cam,spin:.3});
 for(const [g,t0,tw] of[[CGAS,tSo+.15,tGasC],[CSTK,tSo+.3,tStocksC]]){let s=pl==='room3'?pop(t,t0,.35):0;if(t>tw&&t<tw+.4)s*=1+.18*Math.sin((t-tw)/.4*Math.PI);PS(g,s);}
 // C oil field
 JACKS.forEach(j=>{const a=t*2.2+j.ph;j.beam.rotation.z=.22*Math.sin(a);j.crank.rotation.z=-a;});
 PS(BARO,pl==='oil'?pop(t,tBut-.05,.35)*(1+.22*sm(t125-.05,t125+.3,t)):0);
 CK.iconAnim(UP125,t,t125,tWhy-.2,{pos:V3(OX-.85,2.2,OZ+1.6),cam,spin:.3});
 // D map
 SHIPS.forEach((s,i)=>{const on=pl==='map';s.visible=on;if(!on)return;const u=Math.min(1,Math.max(0,((t-tWhy)*.045+i/4)%1));SHIPC.getPoint(u,s.position);const tg=SHIPC.getTangent(u);s.rotation.y=Math.atan2(-tg.z,tg.x);});
 HZR.visible=pl==='map'&&t>tStrait-.05;if(HZR.visible)HZR.scale.setScalar(pop(t,tStrait-.05,.3)*(1+.08*Math.sin(t*6)));
 // E bank
 stocks(.4+.6*sm(tStocks,tFell+.6,t));STK.visible=pl==='street'&&t<tNow+.8;CK.iconAnim(DNST,t,tFell,tNow-.1,{pos:V3(BKX-2.95,2.6,BKZ-1.5),cam,spin:.3});
 // F truck + shop tags
 TRK.visible=pl==='shop';TRK.position.set(trkX(t),0,TRZ);
 TAGS.forEach((m,i)=>{PS(m,pl==='shop'?pop(t,tPrice-.05+i*.13,.3):0);if(m.visible)m.rotation.z=.08*Math.sin(t*4+i);});
 UPT.forEach((ic,i)=>CK.iconAnim(ic,t,tTravel-.1+i*.12,tAnd4-.1,{pos:V3(SHX+[.95,0,-.9][i],2.15,SHZ-.35),cam,spin:.3}));
 mikeStory(t);others(t);};
// ================= camera: framings per place, monotone Hermite inside a place, a cut (under the flash) between places =================
const BX=(x0,y0,z0,x1,y1,z1)=>CK.box([x0,y0,z0],[x1,y1,z1]);
const MB=(p,h=1.9)=>BX(p.x-.35,0,p.z-.3,p.x+.35,h,p.z+.3);
const FT=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const SEC=[];const sec=(t0,keys)=>SEC.push({t0,keys});   // keys [t, framing]
// A1 Meet Mike at GAS & GO
sec(tMeet,[[tMeet,FT([MB(MKG),BX(-31.5,0,15.2,-28.2,2.2,15.9),BX(-32.6,3.9,13.95,-27.8,4.5,14)],[.05,.14,-1],46)],
 [tFilled,FT([MB(MKG),BX(-31.5,0,15.2,-28.2,2.2,15.9)],[-.06,.12,-1],42)],
 [tHeres,FT([MB(MKG),BX(-29,0,15,-27.8,1.6,15.6)],[-.1,.1,-1],38)]]);
// B1 blue room: 1945 + radiation + ???
const M1=MB(V3(RX+1,0,RZ+1.1));
sec(tHeres,[[tHeres,FT([M1,BX(RX-.2,0,RZ+1,RX+.3,2.1,RZ+1)],[0,.1,-1],36)],
 [tNoOne+.3,FT([M1,BX(RX-1.45,2.5,RZ+2.2,RX-.55,3.4,RZ+2.2)],[.04,.1,-1],40)],
 [t1945+.2,FT([M1,BX(RX-2.05,1.7,RZ+2.2,RX+.05,3.4,RZ+2.2)],[-.03,.1,-1],42)],
 [tSo1+.1,FT([M1,BX(RX-2.4,1.6,RZ+2.2,RX+.2,4.1,RZ+2.2)],[0,.1,-1],44)],
 [tBut,FT([M1,BX(RX-2.4,1.6,RZ+2.2,RX+.2,4.1,RZ+2.2)],[.03,.1,-1],44,{slack:.94})]]);
// C oil field
sec(tBut,[[tBut,FT([BX(OX-4,0,OZ+1,OX+5.5,3.6,OZ+8)],[0,.16,-1],46)],
 [tIranW,FT([BX(OX-4,0,OZ+1,OX+7.5,4.2,OZ+5)],[-.05,.16,-1],44)],
 [tBefore+.2,FT([BX(OX-.5,0,OZ+1.2,OX+1.5,2.0,OZ+2)],[0,.15,-1],40)],
 [t70+.1,FT([BX(OX-.5,0,OZ+1.2,OX+1.6,2.75,OZ+2)],[.08,.12,-1],38)],
 [tMarch,FT([BX(OX-.5,0,OZ+1.2,OX+1.5,2.95,OZ+2)],[-.05,.12,-1],38)],
 [t125+.15,FT([BX(OX-1.2,0,OZ+1.2,OX+1.6,3.0,OZ+2)],[.04,.1,-1],40)],
 [tWhy,FT([BX(OX-1.2,0,OZ+1.2,OX+1.6,3.0,OZ+2)],[-.03,.1,-1],40,{slack:.95})]]);
// D map: Strait of Hormuz
const BXc=(p,a,b)=>CK.box([p.x-a,p.y,p.z-a],[p.x+a,p.y+b,p.z+a]);
const HZW=CK.box(mxz(46,22,.03).toArray(),mxz(62,34,.5).toArray()),HZT=CK.box(HZ.clone().add(V3(-1.0,0,-1.4)).toArray(),HZ.clone().add(V3(2.1,.7,1.4)).toArray());
sec(tWhy,[[tWhy,CK.fit([HZW],{dir:[1,1.2,0],fov:40,top:.05})],[tStrait+.2,CK.fit([HZT],{dir:[1,1.05,0],fov:40,top:.05})],
 [tFifth+.2,CK.fit([HZT],{dir:[1,.95,-.05],fov:40,top:.05})],[tLast,CK.fit([HZT],{dir:[1,.9,.05],fov:40,top:.05,slack:.95})]]);
// B2 chart
const CHB=BX(Z2.x-2.1,1.1,RZ+4.9,Z2.x+2.1,3.75,RZ+4.9),M2=MB(V3(Z2.x+2.55,0,RZ+3.4)),P7B=BX(Z2.x-2.95,1.2,RZ+4.5,Z2.x+.6,4.0,RZ+4.5);
sec(tLast,[[tLast,FT([CHB,M2,BX(Z2.x-.8,3.9,RZ+4.6,Z2.x+.8,4.4,RZ+4.6)],[0,.1,-1],46)],[tStrike,FT([CHB,M2],[-.04,.1,-1],44)],
 [t7+.1,FT([CHB,P7B],[.02,.1,-1],42)],
 [tSingle,FT([CHB,P7B],[-.02,.1,-1],40)],
 [tStocks,FT([CHB,P7B],[.02,.1,-1],40,{slack:.95})]]);
// E bank -> (fly along Maple St) -> A2 gas station sign / pump
const STB=BX(BKX-2.7,1.3,BKZ-1.4,BKX-.5,2.95,BKZ-1.4),INVB=BX(BKX+.3,0,BKZ-2.6,BKX+3.2,2.0,BKZ-.3),BSB=BX(BKX+2.2,1.9,BKZ-1.16,BKX+3.6,2.4,BKZ-1.16);
const PYB=BX(-34.15,2.1,14.2,-32.65,5.4,14.2),PUB=BX(-31.5,.2,15.2,-30.5,2.95,15.2),TOPB=BX(-34.1,4.4,14.2,-32.7,5.9,14.2);
sec(tStocks,[[tStocks,FT([STB,INVB,BSB],[0,.45,-1],46)],[tFell+.3,FT([STB,BX(BKX-3.2,2.3,BKZ-1.5,BKX-2.6,3.0,BKZ-1.5)],[.05,.45,-1],40)],
 [tRan+.1,FT([STB,INVB,BSB],[-.04,.45,-1],46)],[tGold+.1,FT([INVB,BSB,BX(BKX+1.6,2.2,BKZ-1.8,BKX+2.8,2.8,BKZ-1.8)],[-.06,.45,-1],42)],
 [tNow+.75,FT([PYB,MB(MKG),PUB],[0,.14,-1],46)],[tJan+.1,FT([PYB,TOPB],[.04,.08,-1],40)],
 [tFall,FT([PYB,TOPB,MB(MKG)],[-.03,.08,-1],44)],[t427+.15,FT([PYB,BX(-34.1,4.4,14.2,-31.9,5.9,14.2),MB(MKG)],[.02,.08,-1],44)],
 [tThats-.25,FT([PYB,BX(-34.1,4.4,14.2,-31.9,5.9,14.2),MB(MKG)],[-.02,.08,-1],44,{slack:.96})],[tThats+.35,FT([MB(MKG),PUB,BX(-29.9,1.8,14.6,-28.4,2.85,14.6)],[.06,.2,-1],40)],[tEvery+.3,FT([MB(MKG),PUB,BX(-29.9,1.8,14.6,-28.4,2.85,14.6)],[-.05,.2,-1],38)],
 [t15+.1,FT([BX(-31.4,1.0,15.0,-28.4,2.6,15.2),MB(MKG)],[0,.08,-1],36)],[tTrucks-.15,FT([BX(-31.4,1.0,15.0,-28.4,2.6,15.2),MB(MKG)],[.03,.08,-1],36,{slack:.95})]]);
// F truck (live framing) -> shop
const SHB=BX(SHX-1.4,.8,SHZ-.4,SHX+1.25,2.45,SHZ+.2),MKSB=MB(MKS);
sec(tTrucks-.15,[[tTrucks-.15,null],[tPrice-.25,FT([SHB,MKSB],[0,.7,-1],42)],[tTravel,FT([SHB,MKSB],[.04,.66,-1],38)],[tAnd4,FT([SHB,MKSB],[-.03,.66,-1],38,{slack:.95})]]);
// B3 peace talks -> DAYS -> CTA (one room, continuous)
const TBB=BX(Z3.x-2.0,0,RZ+1.3,Z3.x+2.0,3.3,RZ+3.4),DIPB=BX(Z3.x-.8,0,RZ+1.2,Z3.x+.8,1.9,RZ+1.9),M4=MB(MKR4),BARB=BX(Z3.x-2.6,0,RZ+1.3,Z3.x-1.7,2.6,RZ+1.7);
const CTAB=BX(Z4.x-1.95,0,RZ+1.5,Z4.x+1.95,2.3,RZ+1.5),DAYB=BX(Z4.x-2.4,1.0,RZ+2.4,Z4.x+.2,4.35,RZ+2.4);
sec(tAnd4,[[tAnd4,FT([TBB],[0,.12,-1],46)],[tPeace+.2,FT([DIPB,BX(Z3.x-1,2.9,RZ+2.6,Z3.x+1,3.35,RZ+2.6)],[0,.1,-1],34)],
 [tOilD,FT([DIPB,BARB],[-.05,.1,-1],40)],[tFast,FT([BARB,BX(Z3.x-.8,0,RZ+1.2,Z3.x,1.9,RZ+1.9)],[-.08,.1,-1],38)],
 [tFear+.15,FT([M4,DAYB],[0,.1,-1],44)],[tDays+.1,FT([M4,DAYB],[.04,.1,-1],42)],
 [tSo+.15,FT([M4,CTAB],[0,.1,-1],42)],[tGasC,FT([M4,BX(Z4.x+.75,1.6,RZ+1.5,Z4.x+1.95,2.3,RZ+1.5)],[.05,.1,-1],40)],
 [tStocksC,FT([M4,BX(Z4.x-1.95,1.6,RZ+1.5,Z4.x-.75,2.3,RZ+1.5)],[-.05,.1,-1],40)],[TEND,FT([M4,CTAB],[0,.1,-1],42)]]);
const truckF=t=>{const x=trkX(t);return FT([BX(x-3,0,TRZ-1.1,x+3.1,2.9,TRZ+1.1)],[1,.28,-.42],44);};
const ch=F=>[...F.pos,...F.look,F.fov],unch=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm(keys,t){const n=keys.length;if(t<=keys[0][0])return ch(keys[0][1]);if(t>=keys[n-1][0])return ch(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
const CAMH14=window.CAM14;
function storyCam(t){let s=SEC[0];for(const x of SEC)if(t>=x.t0)s=x;
 if(s.keys[0][1]===null){const k1=s.keys[1][0];if(t<k1-.6)return truckF(t);const A=ch(truckF(k1-.6)),Bk=ch(s.keys[1][1]);if(t<k1){const u=sm(k1-.6,k1,t);return unch(A.map((v,i)=>v+(Bk[i]-v)*u));}return unch(herm(s.keys.slice(1),t));}
 return unch(herm(s.keys,t));}
window.CAM14=t=>t<tMeet?CAMH14(t):storyCam(t);window.CAM14_END=TEND+1;
if(Q.get('scout')){const v=Q.get('scout').split(',').map(Number);window.CAM14=()=>({pos:v.slice(0,3),look:v.slice(3,6),fov:v[6]});}
}
