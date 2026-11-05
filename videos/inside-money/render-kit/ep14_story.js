// ================= EP14 STORY (after the hook, 6.3 s -> end) - all on the same 3D world map (Zack-style map world, north-up camera) =================
// Mike lives the story at his place in the western US (safe + pickup + gas pump); the camera flies to every place the voice names:
// S1 Meet Mike (pickup, pump) / S2 1945 + '?' / S3-S5 the oil barrel in the Gulf $70 -> $125 / S6 Strait of Hormuz, tankers, 1/5 /
// S7 June strike +7% in 1 DAY / S8 New York: STOCKS falling + GOLD / S9 Mike's pump $2.82 JAN -> $4.27 FALL / S10 +$22, bills fly into the pump /
// S11 trucks + a ship, prices up / S12 peace talks, oil drops / S13 DAYS (up/down) / S14 CTA GAS or STOCKS.
const WS=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tMike=WS('mike'),tFilled=WS('filled'),tHeres=WS('heres'),tNoOne=WS('no'),t1945=WS('1945'),tNobody=WS('nobody'),tBut=WS('but'),tOil1=WS('oil'),
 tBefore=WS('before'),tBarrel=WS('barrel'),t70=WS('70'),tMarch=WS('march'),t125=WS('125'),tWhy=WS('why'),tStrait=WS('strait'),tHormuz=WS('hormuz'),tFifth=WS('onefifth'),tSails=WS('sails'),
 tLast=WS('last'),tStrike=WS('strike'),t7=WS('7'),tSingle=WS('single'),tStocks=WS('stocks'),tFell=WS('fell'),tGold=WS('gold'),
 tNow=WS('now'),tGas=WS('gas'),tJan=WS('january'),t282=WS('282'),tFall=WS('fall'),t427=WS('427'),tThats=WS('thats'),t22=WS('22'),tFills=WS('fills'),t15=WS('15gallon'),
 tTrucks=WS('trucks'),tShips=WS('ships'),tPrice_S=WS('price'),tTravel=WS('travel'),tPeace=WS('peace'),tDropS=WS('drop'),tFear=WS('fear'),tDays=WS('days'),
 tSo=WS('so',2),tComment=WS('comment'),tGasC=WS('gas',1),tStocksC=WS('stocks',1),TEND=TLN.dur;
const vis=(t,a,b)=>t>=a&&t<b;
const PT_S=(s,size,col,p,t0,t1)=>popT(s,size,col,p,t0,t1);
// ---------------- S1: Mike's place: red pickup + gas pump (east of him = screen right) ----------------
const PICK14=vehicle('pickup',0x8a1c1c,0,0,0);PICK14.scale.setScalar(.3);PICK14.position.copy(MKP14).add(V3(-.35,0,-1.55));PICK14.rotation.y=Math.PI/2;
const PUMP14=makePump(0,0);PUMP14.g.position.copy(MKP14).add(V3(-.45,0,-.62));PUMP14.g.rotation.y=-Math.PI/2;PUMP14.g.scale.setScalar(.85);
// big price board on the pump (faces the camera, +x)
const PBC=document.createElement('canvas');PBC.width=512;PBC.height=300;const PBT=new THREE.CanvasTexture(PBC);PBT.colorSpace=THREE.SRGBColorSpace;
const PBOARD=new THREE.Mesh(new THREE.PlaneGeometry(.9,.53),new THREE.MeshBasicMaterial({map:PBT,toneMapped:false}));PBOARD.position.copy(MKP14).add(V3(-.4,2.15,-.62));PBOARD.rotation.y=Math.PI/2;scene.add(PBOARD);
let PBK='';function pboard(price,col,tag){const k=price+col+tag;if(k===PBK)return;PBK=k;const x=PBC.getContext('2d');x.fillStyle='#0b1530';x.fillRect(0,0,512,300);x.fillStyle='#d21e2a';x.fillRect(0,0,512,64);
 x.fillStyle='#fff';x.font='800 46px Mont';x.textAlign='center';x.fillText('GAS  '+tag,256,48);x.fillStyle=col;x.font='800 150px Mont';x.fillText(price,256,232);x.strokeStyle='#fff';x.lineWidth=8;x.strokeRect(4,4,504,292);PBT.needsUpdate=true;}
pboard('$2.82','#22e06a','JAN');
const LBL_MIKE=PT_S('MIKE',.2,WHT,MKP14.clone().add(V3(0,2.12,0)),tMike-.05,tHeres);
// ---------------- S2: 1945 + question marks (next to Mike) ----------------
const P1945=PT_S('1945',.32,YEL,MKP14.clone().add(V3(.1,1.95,-.75)),t1945-.05,tNobody+.2);
const RAD14=new THREE.Mesh(new THREE.CircleGeometry(.17,48),new THREE.MeshBasicMaterial({map:RADT_(),toneMapped:false,side:THREE.DoubleSide}));scene.add(RAD14);
function RADT_(){return tex(256,256,x=>{x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.fillStyle='#111';for(let k=0;k<3;k++){const a=-Math.PI/2+k*2*Math.PI/3;x.beginPath();x.moveTo(128,128);x.arc(128,128,100,a-.52,a+.52);x.fill();}x.fillStyle='#ffc61a';x.beginPath();x.arc(128,128,26,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(128,128,16,0,7);x.fill();});}
const QS=[0,1,2].map(i=>PT_S('?',.3,YEL,MKP14.clone().add(V3(.1,2.0+(i%2)*.18,.45-i*.45)),tNobody+i*.15,tBut-.1));
// ---------------- S3-S5 / S12: the oil barrel in the Gulf ----------------
const BARP=mxz(51,27.2,.03);
const BARREL=new THREE.Group();BARREL.position.copy(BARP);scene.add(BARREL);
{const bm_S=M(0x1f3d8a,.35,.5),rb=M(0x14295e,.35,.6);add(CY(.3,.3,.9,40),bm_S,0,.45,0,BARREL);for(const y of[.06,.3,.6,.84])add(new THREE.TorusGeometry(.302,.018,8,48),rb,0,y,0,BARREL).rotation.x=Math.PI/2;
 add(CY(.3,.3,.01,40),M(0x2a4a9a,.3,.6),0,.905,0,BARREL);
 const lt_S=tex(512,256,x=>{x.fillStyle='#ffffff';x.font='800 150px Mont';x.textAlign='center';x.fillText('OIL',256,180);});
 const lb_S=new THREE.Mesh(new THREE.CylinderGeometry(.305,.305,.32,40,1,true,-Math.PI*.35,Math.PI*.7),new THREE.MeshBasicMaterial({map:lt_S,transparent:true,toneMapped:false}));lb_S.position.y=.45;lb_S.rotation.y=Math.PI/2;BARREL.add(lb_S);}
const P70=PT_S('$70',.3,GRN,BARP.clone().add(V3(0,1.15,0)),t70-.05,tMarch);
const PMAR=PT_S('MARCH',.16,WHT,BARP.clone().add(V3(0,1.62,0)),tMarch-.05,tWhy-.2);
const P125=PT_S('$125',.34,RED,BARP.clone().add(V3(0,1.2,0)),t125-.05,tWhy-.2);
const UP125=CK.icon('up',{color:'#ff2a2a',size:.28});scene.add(UP125);
// ---------------- S6: Strait of Hormuz + tankers + 1/5 ----------------
const HZ=mxz(56.7,25.7,.03);
const HZR=add(new THREE.RingGeometry(.26,.33,64),new THREE.MeshBasicMaterial({color:0xffc61a,toneMapped:false,side:THREE.DoubleSide}),HZ.x,.21,HZ.z,scene,false);HZR.rotation.x=-Math.PI/2;
const PHZ=PT_S('STRAIT OF HORMUZ',.12,WHT,HZ.clone().add(V3(.75,.3,0)),tStrait-.05,tLast-.1);
const PFIF=PT_S('1/5 OF WORLD OIL',.13,YEL,HZ.clone().add(V3(-.35,.75,0)),tFifth-.05,tLast-.1);
const SHIPR=[mxz(50.8,27.0),mxz(53.6,25.4),mxz(56.4,25.4),mxz(57.8,23.9),mxz(60,22.0),mxz(63,19.8)];const SHIPC=new THREE.CatmullRomCurve3(SHIPR.map(p=>p.setY(.03)));
function tanker(s=1){const g=new THREE.Group(),hm_S=M(0xb3261e,.5,.2),dk_S=M(0x2a2a2a,.5,.3);add(B(.2,.035,.06),hm_S,0,.018,0,g);add(B(.2,.012,.058),dk_S,0,.04,0,g);add(B(.035,.04,.05),M(0xf2f2f2,.5),-.075,.065,0,g);g.scale.setScalar(s);scene.add(g);return g;}
const SHIPS=[0,1,2,3].map(()=>tanker(1.7));
// ---------------- S7: June strike, +7%, 1 DAY ----------------
const STK14=mxz(51.5,33.5,.2);
const BOOM14=add(new THREE.IcosahedronGeometry(.12,1),new THREE.MeshBasicMaterial({color:new THREE.Color(2.6,1.4,.3),toneMapped:false}),STK14.x,STK14.y,STK14.z,scene,false);
const PJUNE=PT_S('JUNE',.15,WHT,STK14.clone().add(V3(0,.45,0)),tLast-.05,tStocks-.3);
const P7=PT_S('+7%',.3,RED,BARP.clone().add(V3(0,1.25,0)),t7-.05,tStocks-.3);
const P1D=PT_S('1 DAY',.16,YEL,BARP.clone().add(V3(0,1.62,0)),tSingle-.05,tStocks-.3);
// ---------------- S8: New York: STOCKS board falling + GOLD bars ----------------
const NYC=mxz(-73,43.5,US_Y);
const SBC=tex(768,512,x=>{x.fillStyle='#0b1530';x.fillRect(0,0,768,512);x.fillStyle='#fff';x.font='800 84px Mont';x.textAlign='center';x.fillText('STOCKS',384,100);
 x.strokeStyle='#33415f';x.lineWidth=3;for(let i=1;i<5;i++){x.beginPath();x.moveTo(40,130+i*70);x.lineTo(728,130+i*70);x.stroke();}
 x.strokeStyle='#ff2a2a';x.lineWidth=14;x.lineJoin='round';x.beginPath();const P=[[50,170],[150,200],[230,180],[320,260],[400,240],[480,330],[560,310],[640,420],[720,470]];P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();
 x.fillStyle='#ff2a2a';x.beginPath();x.moveTo(690,440);x.lineTo(745,480);x.lineTo(680,500);x.fill();x.strokeStyle='#fff';x.lineWidth=8;x.strokeRect(4,4,760,504);});
const SBOARD=new THREE.Group();SBOARD.position.copy(NYC).add(V3(.15,0,.35));scene.add(SBOARD);
{add(CY(.03,.03,1.1,10),M(0xd6d9de,.3,.9),0,.55,0,SBOARD);const p=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.8),new THREE.MeshBasicMaterial({map:SBC,toneMapped:false,side:THREE.DoubleSide}));p.position.y=1.45;p.rotation.y=Math.PI/2;SBOARD.add(p);}
const GOLD=[];{const gm_S=new THREE.MeshStandardMaterial({color:0xffc61a,roughness:.25,metalness:1,emissive:0x5a3c00,emissiveIntensity:.5});
 const pos=[[0,0,-.2],[0,0,0],[0,0,.2],[0,.07,-.1],[0,.07,.1],[0,.14,0]];for(const [x,y,z] of pos){const g=new THREE.Mesh(new THREE.BoxGeometry(.09,.06,.18),gm_S);g.position.copy(NYC).add(V3(.6+x,.03+y,.05+z));scene.add(g);GOLD.push(g);}}
const PGOLD=PT_S('GOLD',.18,YEL,NYC.clone().add(V3(.6,.5,.05)),tGold-.05,tNow-.1);
const DNST=CK.icon('down',{color:'#ff2a2a',size:.25});scene.add(DNST);
// ---------------- S9-S10: Mike's pump: $2.82 JAN -> $4.27 FALL, +$22, bills fly into the pump ----------------
const P22=PT_S('+$22',.3,RED,MKP14.clone().add(V3(.1,1.95,-.35)),t22-.05,tTrucks-.15);
const P15=PT_S('15 GALLONS',.13,WHT,MKP14.clone().add(V3(.1,1.72,-1.35)),t15-.05,tTrucks-.15);
const BILLS=[];for(let i=0;i<8;i++){const b=MNY.note(100,{curve:.01});b.scale.setScalar(.9);b.visible=false;scene.add(b);BILLS.push(b);}
// ---------------- S11: trucks across the US + a ship on the Atlantic, price tags up ----------------
function truck14(){const g=new THREE.Group();add(B(.42,.15,.13),M(0xf4f4f4,.5),-.06,.11,0,g);add(B(.12,.12,.12),M(0x1d4fd0,.4,.3),.22,.095,0,g);add(B(.02,.05,.1),GLASS,.285,.12,0,g,false);
 for(const x of[-.2,.05,.22])for(const z of[-.065,.065]){const w=add(CY(.035,.035,.025,14),M(0x111111,.6),x,.035,z,g);w.rotation.x=Math.PI/2;}scene.add(g);return g;}
const TRK_PATH=new THREE.CatmullRomCurve3([mxz(-118,34.2),mxz(-105,35.2),mxz(-95,36),mxz(-86,37.5),mxz(-77,39.6)].map(p=>p.setY(US_Y)));
const ROAD=new THREE.Mesh(new THREE.TubeGeometry(TRK_PATH,80,.05,4,false),M(0x3a3a3a,.8));ROAD.scale.y=.12;ROAD.position.y=US_Y*.88;scene.add(ROAD);
const truckU=(i,t)=>Math.min(.999,Math.max(0,(t-tTrucks+.4)*.11+i*.22)%1),shipP=t=>mxz(-58+(t-tShips)*4,36,.03);
const TRUCKS=[0,1,2].map(()=>{const g=truck14();g.scale.setScalar(2.2);return g;});
const SHIPA=tanker(3.2);
const TAGS=[0,1,2].map(i=>PT_S('$',.16,RED,V3(),tPrice_S-.05+i*.12,tPeace-.2));
const UPT=[0,1,2].map(()=>{const ic=CK.icon('up',{color:'#ff2a2a',size:.14});scene.add(ic);return ic;});
// ---------------- S12-S13: peace talks (two flags + table), oil drops, DAYS ----------------
const PEACEP=mxz(44,30.5,.07);
function smallFlag(mat,x,z){add(CY(.012,.012,.7,8),M(0xd6d9de,.3,.9),x,.35+.07,z);const f=new THREE.Mesh(new THREE.PlaneGeometry(.38,.22),mat);f.material.side=THREE.DoubleSide;f.position.set(x,.62,z-.2);f.rotation.y=Math.PI/2;scene.add(f);return f;}
const PEACEG=new THREE.Group();scene.add(PEACEG);
const FUS=smallFlag(USFM,PEACEP.x,PEACEP.z+.55),FIR=smallFlag(IRFM,PEACEP.x,PEACEP.z-.15);
const TBL=add(B(.25,.04,.6),M(0x7a4a26,.5),PEACEP.x+.1,.36,PEACEP.z+.15);
const PPEACE=PT_S('PEACE TALKS',.1,WHT,PEACEP.clone().add(V3(0,1.0,.15)),tPeace-.05,tFear-.1);
const DNOIL=CK.icon('down',{color:'#22e06a',size:.28});scene.add(DNOIL);
const PDAYS=PT_S('DAYS',.3,YEL,BARP.clone().add(V3(0,1.35,0)),tDays-.1,tSo-.15);
const UPD=CK.icon('up',{color:'#ff2a2a',size:.2}),DND=CK.icon('down',{color:'#22e06a',size:.2});scene.add(UPD);scene.add(DND);
// ---------------- S14: CTA signs GAS / STOCKS beside Mike ----------------
function ctaSign(txt,col,dz){const g=new THREE.Group();g.position.copy(MKP14).add(V3(.25,0,dz));scene.add(g);add(CY(.025,.025,1.5,10),M(0xd6d9de,.3,.9),0,.75,0,g);
 const c=tex(512,256,x=>{x.fillStyle=col;x.fillRect(0,0,512,256);x.strokeStyle='#fff';x.lineWidth=14;x.strokeRect(7,7,498,242);x.fillStyle='#fff';x.font='800 120px Mont';x.textAlign='center';x.fillText(txt,256,170);});
 const p=new THREE.Mesh(new THREE.PlaneGeometry(.7,.35),new THREE.MeshBasicMaterial({map:c,toneMapped:false,side:THREE.DoubleSide}));p.position.y=1.65;p.rotation.y=Math.PI/2;g.add(p);return g;}
const CGAS=ctaSign('GAS','#d21e2a',.75),CSTK=ctaSign('STOCKS','#1d7f3a',-.75);
// ---------------- Mike's story animation ----------------
let MKS=null;
function mikeS(t){const P=MIKE;relax(P);idle(P,t,1.3);P.g.position.copy(MKP14);P.g.rotation.y=MKR;
 if(!MKS){P.g.updateMatrixWorld(true);MKS={pt:solveReach(P,'L',MKP14.clone().add(V3(.35,1.55,-.55)))};relax(P);MKS.pay=solveReach(P,'R',MKP14.clone().add(V3(.15,1.15,-.45)));relax(P);}
 let joy=0,shock=0,doubt=0;
 if(t<tHeres){wave(P,'R',t);joy=.8;}                                                                         // Meet Mike: waves
 else if(t<tNobody){setA(P,'L',lerpA(REST,MKS.pt,sm(tHeres,tHeres+.3,t)));curl(P,'L',.6,.3);doubt=.5;}       // points at 1945
 else if(t<tBut){const k=sm(tNobody,tNobody+.25,t);arm(P,'L',AD[0]+.35*k,AD[2]-.85*k,1.2*k);arm(P,'R',AD[0]+.35*k,AD[2]-.85*k,1.2*k);pose(P,'head',0,0,.12*k);doubt=.8;}   // shrug
 else if(t<tGas-.3){doubt=.3;}
 else if(t<tThats){const k=sm(t427-.1,t427+.2,t);if(k>0)armsUp(P,.45*k);shock=.95*sm(t427-.1,t427+.2,t);joy=.3*(1-k);}   // sees $4.27: hands up
 else if(t<tTrucks){setA(P,'R',lerpA(REST,MKS.pay,sm(tThats,tThats+.3,t)));curl(P,'R',.75,.5);shock=.7;}       // pays at the pump
 else if(t<tSo-.1){doubt=.3;}
 else{const k=sm(tSo-.1,tSo+.25,t);arm(P,'L',AD[0]+.3*k,AD[2]-.95*k,.5*k);arm(P,'R',AD[0]+.3*k,AD[2]-.95*k,.5*k);joy=.4;}   // CTA: open arms to both signs
 face(P,{jaw:.03+.035*Math.abs(Math.sin(t*9)),smile:joy*.6});
 FK.update(P,t,{expr:[['joy',joy],['shock',shock],['doubt',doubt]],look:t>=tNow&&t<tTrucks?PBOARD.position:cam.position});}
// ---------------- per-frame story update ----------------
const _sp=V3();
function storyUpd(t){const S=t>=HOOK_END-1.3;
 PICK14.visible=PUMP14.g.visible=t>=tMeet14-.15;PBOARD.visible=vis(t,tNow-.3,tThats+.2);LBL_IR.visible=t<HOOK_END;SAFE14.visible=t>=tWhat2-.1;
 if(t>HOOK_END)BLAST.visible=false;
 PUMP14.draw('0.000',t<t427?'$2.82':'$4.27',t<t427?'#22e06a':'#ff4a3a');pboard(t<t427?'$2.82':'$4.27',t<t427?'#22e06a':'#ff2a2a',t<tFall?'JAN':'FALL');
 RAD14.visible=vis(t,t1945,tNobody+.2);if(RAD14.visible){RAD14.scale.setScalar(pop(t,t1945+.1,.3));RAD14.position.copy(MKP14).add(V3(.1,1.55,-.75));RAD14.lookAt(cam.position);}
 BARREL.visible=t>=tOil1-.3&&t<tSo-.1&&!vis(t,tWhy-.05,t7-.3)&&!vis(t,tPeace-.3,tDropS-.3);BARREL.scale.setScalar(BARREL.visible?pop(t,tOil1-.25,.35)*(1+.25*sm(t125-.05,t125+.3,t)*(1-sm(tDropS,tDropS+.4,t))):1);
 CK.iconAnim(UP125,t,t125,tWhy-.2,{pos:BARP.clone().add(V3(0,1.25,-.6)),cam});
 // tankers sail through the strait
 SHIPS.forEach((s,i)=>{const on=vis(t,tWhy-.2,tStocks);s.visible=on;if(!on)return;const u=Math.max(0,((t-tWhy)*.045+i/4))%1;SHIPC.getPoint(u,s.position);const tg=SHIPC.getTangent(u);s.rotation.y=Math.atan2(-tg.z,tg.x);});
 HZR.visible=vis(t,tStrait-.05,tLast);if(HZR.visible)HZR.scale.setScalar(pop(t,tStrait-.05,.3)*(1+.08*Math.sin(t*6)));
 BOOM14.visible=vis(t,tStrike,tStrike+.6);if(BOOM14.visible)BOOM14.scale.setScalar(.4+2.2*sm(0,.2,t-tStrike)*(1-sm(.35,.6,t-tStrike)));
 // New York: stocks + gold
 SBOARD.visible=vis(t,tStocks-.15,tNow);if(SBOARD.visible)SBOARD.scale.setScalar(pop(t,tStocks-.15,.35));
 CK.iconAnim(DNST,t,tFell,tNow-.1,{pos:NYC.clone().add(V3(.15,2.05,.35)),cam});
 GOLD.forEach((g,i)=>{const s=pop(t,tRanG()+i*.08,.25);g.visible=s>.01&&t<tNow;g.scale.setScalar(s);});
 // bills fly from Mike's hand into the pump (paying)
 BILLS.forEach((b,i)=>{const d=t-(tThats+.35+i*.18);b.visible=d>0&&d<.7&&t<tTrucks;if(!b.visible)return;MIKE.BN.wristR.getWorldPosition(_sp);const tgt=PUMP14.g.position.clone().add(V3(0,1.2,0));
  b.position.copy(_sp.lerp(tgt,sm(0,.7,d))).add(V3(0,.2*Math.sin(d/.7*Math.PI),0));b.rotation.set(d*4+i,d*3,d*2);});
 // trucks + ship + price tags
 TRUCKS.forEach((tr,i)=>{const on=vis(t,tTrucks-.4,tPeace);tr.visible=on;if(!on)return;const u=truckU(i,t);TRK_PATH.getPoint(u,tr.position);const tg=TRK_PATH.getTangent(u);tr.rotation.y=Math.atan2(-tg.z,tg.x);
  TAGS[i].userData.pos.copy(tr.position).add(V3(0,.38,0));CK.iconAnim(UPT[i],t,tPrice_S+i*.12,tPeace-.2,{pos:tr.position.clone().add(V3(0,.62,0)),cam,spin:.3});});
 ROAD.visible=vis(t,tTrucks-.4,tPeace);
 SHIPA.visible=vis(t,tShips-.2,tPeace);if(SHIPA.visible){SHIPA.position.copy(shipP(t));SHIPA.rotation.y=Math.PI/2;}
 // peace talks + oil drops + days
 const pc=vis(t,tPeace-.1,tSo-.1);FUS.visible=FIR.visible=TBL.visible=pc;
 CK.iconAnim(DNOIL,t,tDropS-.05,tFear-.1,{pos:BARP.clone().add(V3(0,1.25,-.6)),cam});
 CK.iconAnim(UPD,t,tDays-.1,tSo-.15,{pos:BARP.clone().add(V3(0,1.0,-.75)),cam});CK.iconAnim(DND,t,tDays+.1,tSo-.15,{pos:BARP.clone().add(V3(0,1.0,.75)),cam});
 // CTA signs
 for(const [g,t0] of [[CGAS,tSo+.1],[CSTK,tSo+.3]]){const s=pop(t,t0,.35);g.visible=s>.01;g.scale.setScalar(Math.max(.001,s));}
 if(t>=tMeet14-.15){const _=0;}}
function tRanG(){return WS('ran');}
story14=storyUpd;
// ---------------- story camera: one shot per line, smooth blends, the subject always centred ----------------
const MB=CK.box([MKP14.x-.25,US_Y,MKP14.z-1.6],[MKP14.x+.4,US_Y+2.3,MKP14.z+.95]);   // Mike + pickup + pump + safe
const MFACE=CK.box([MKP14.x-.2,US_Y+1.1,MKP14.z-.3],[MKP14.x+.2,US_Y+2.25,MKP14.z+.3]);
const BX=(p,a,b)=>CK.box([p.x-a,p.y,p.z-a],[p.x+a,p.y+b,p.z+a]);
const SHOTS14=[
 {t:HOOK_END-.6,a:CK.fit([MB],{dir:[1,.35,-.1],fov:38,top:.05})},
 {t:tHeres,a:CK.fit([MFACE,BX(MKP14.clone().add(V3(.1,0,-.75)),.35,2.2),BX(MKP14.clone().add(V3(.1,0,.45)),.3,2.2)],{dir:[1,.25,.08],fov:36,top:.05})},
 {t:tBut-.1,bl_S:.9,a:CK.fit([BX(BARP,.6,1.0),BX(mxz(53,32.5,.1),.9,.2)],{dir:[1,.75,-.05],fov:38,top:.05})},
 {t:tBefore,a:CK.fit([BX(BARP,.5,1.75)],{dir:[1,.38,-.1],fov:36,top:.05})},
 {t:tMarch-.1,a:CK.fit([BX(BARP,.55,2.1)],{dir:[1,.3,.12],fov:36,top:.05})},
 {t:tWhy-.15,bl_S:.7,a:CK.fit([BX(HZ,1.0,.9)],{dir:[1,1.0,0],fov:38,top:.05})},
 {t:tFifth-.2,a:CK.fit([BX(HZ.clone().add(V3(-.2,0,0)),.85,1.0)],{dir:[1,.85,-.05],fov:36,top:.05})},
 {t:tLast-.15,bl_S:.6,a:CK.fit([BX(STK14,.7,.8)],{dir:[1,.9,0],fov:36,top:.05})},
 {t:t7-.25,a:CK.fit([BX(BARP,.6,2.1)],{dir:[1,.35,.05],fov:38,top:.05})},
 {t:tStocks-.35,bl_S:.75,a:CK.fit([BX(NYC.clone().add(V3(.15,0,.35)),.6,1.9),BX(NYC.clone().add(V3(.6,0,.05)),.3,.7)],{dir:[1,.35,0],fov:38,top:.05})},
 {t:tNow-.2,bl_S:.6,a:CK.fit([MB,CK.box([PBOARD.position.x-.1,PBOARD.position.y-.3,PBOARD.position.z-.45],[PBOARD.position.x+.1,PBOARD.position.y+.3,PBOARD.position.z+.45])],{dir:[1,.3,-.15],fov:38,top:.05})},
 {t:tJan-.1,a:CK.fit([CK.box([PBOARD.position.x-.1,PBOARD.position.y-.35,PBOARD.position.z-.5],[PBOARD.position.x+.1,PBOARD.position.y+.32,PBOARD.position.z+.5]),MFACE],{dir:[1,.22,-.2],fov:34,top:.05})},
 {t:tThats-.15,a:CK.fit([MFACE,BX(PUMP14.g.position,.35,2.3)],{dir:[1,.25,-.05],fov:36,top:.05})},
 {t:tTrucks-.35,bl_S:.7,a:CK.fit([CK.box(mxz(-104,33,US_Y).toArray(),mxz(-92,38,US_Y+.8).toArray())],{dir:[1,.7,0],fov:38,top:.05})},
 {t:tShips-.05,a:CK.fit([CK.box(mxz(-62,33,.03).toArray(),mxz(-42,39,.9).toArray())],{dir:[1,.75,0],fov:38,top:.05})},
 {t:tPeace-.25,bl_S:.8,a:CK.fit([BX(PEACEP.clone().add(V3(0,0,.2)),.7,1.25)],{dir:[1,.4,0],fov:36,top:.05})},
 {t:tDropS-.25,a:CK.fit([BX(BARP,.55,1.75)],{dir:[1,.35,-.05],fov:36,top:.05})},
 {t:tFear-.15,a:CK.fit([BX(BARP,.85,1.65)],{dir:[1,.35,.05],fov:36,top:.05})},
 {t:tSo-.3,bl_S:.9,a:CK.fit([MFACE,BX(CGAS.position,.4,2.0),BX(CSTK.position,.4,2.0)],{dir:[1,.22,0],fov:38,top:.05})},
];
SHOTS14.forEach((s,i)=>{const n=SHOTS14[i+1];s.end=n?n.t:TEND;s.b=CK.fit===null?s.a:{pos:s.a.pos.map((v,k)=>v+(s.a.look[k]-v)*.08),look:s.a.look,fov:s.a.fov};});   // slow push-in inside every shot
const _sw=u=>u*u*(3-2*u);
function storyCam(t){const cs=(o,dx,dy,dz)=>({pos:o.clone().add(V3(dx,dy,dz)).toArray(),look:o.clone().add(V3(0,.2,0)).toArray(),fov:38});const TP=TRK_PATH.getPoint(truckU(1,t)),SP=shipP(t);
 if(t>=tTrucks-.35&&t<tShips-.05){const c=cs(TP,1.7,1.15,.35);return t<tTrucks+.35?LF(LF(SHOTS14[12].a,SHOTS14[12].b,1),c,_sw((t-tTrucks+.35)/.7)):c;}
 if(t>=tShips-.05&&t<tPeace-.25){const c=cs(SP,2.0,1.3,.5),p=cs(TP,1.7,1.15,.35);return t<tShips+.45?LF(p,c,_sw((t-tShips+.05)/.5)):c;}
 if(t>=tPeace-.25&&t<tPeace+.55){const p=cs(SP,2.0,1.3,.5),i=SHOTS14.findIndex(x=>x.t===tPeace-.25),c=LF(SHOTS14[i].a,SHOTS14[i].b,0);return LF(p,c,_sw((t-tPeace+.25)/.8));}let i=0;while(i<SHOTS14.length-1&&t>=SHOTS14[i+1].t)i++;const s=SHOTS14[i],u=Math.min(1,Math.max(0,(t-s.t)/Math.max(.1,s.end-s.t)));
 const cur=LF(s.a,s.b,_sw(u)),bl_S=s.bl_S??.45;
 if(i>0&&t<s.t+bl_S){const p=SHOTS14[i-1],prev=LF(p.a,p.b,1);return LF(prev,cur,_sw((t-s.t)/bl_S));}
 if(i===0&&t<s.t+bl_S){const h=CAMH14(HOOK_END-.6);return LF(h,cur,_sw((t-s.t)/bl_S));}return cur;}
const CAMH14=window.CAM14;
window.CAM14=t=>t<HOOK_END-.6?CAMH14(t):storyCam(t);window.CAM14_END=TEND+1;
