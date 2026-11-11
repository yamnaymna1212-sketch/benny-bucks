// ================= EP12 STORY v3 (appended inside the hook block by make_ep12.py) =================
// ONE continuous camera path, no jumps, never through a wall / glass / car: the bank lobby is INSIDE the bank building and the
// camera simply follows him through the open doorway (between the two middle columns). Beats follow vo.wav (timeline_ep12.json).
const Wk=(w,n=0)=>{const k=TL12.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
for(const m of POPS){m.userData.t0=1e9;m.userData.t1=1e9;}   // EP10 floating words off
const S={walks:Wk('walks'),fifty:Wk('50000'),over:Wk('over'),files:Wk('files'),report:Wk('report'),name:Wk('name'),addr:Wk('address'),cash3:Wk('cash',2),
 next:Wk('next'),mikes:Wk('mikes'),owns:Wk('owns'),cust:Wk('customers'),masked:Wk('masked'),register:Wk('register'),no:Wk('no'),knows:Wk('knows'),bag:Wk('bag'),
 heres:Wk('heres'),patterns:Wk('patterns'),three:Wk('three'),red:Wk('red'),normal:Wk('normal'),every:Wk('every'),splitting:Wk('splitting'),
 crime:Wk('crime'),behind:Wk('behind'),quiet:Wk('quiet'),nobody:Wk('nobody'),notcrim:Wk('criminal',1),prove:Wk('prove'),
 weeks:Wk('weeks'),stops:Wk('stops'),agents:Wk('agents'),irs:Wk('irs'),past:Wk('past'),straight:Wk('straight'),why:Wk('why'),part:Wk('part')};
const DUR=TL12.dur,G12=()=>new THREE.Group();
// ---------- places ----------
const SX=RX+13.6,SZ=RZ+3;   // McDonald's right next to the bank
const SHOP12=SK.burgerShop(SX,SZ,{brand:'mcd'});scene.add(SHOP12.g);const SCZ=SZ+SHOP12.counterZ,SCY=SHOP12.counterY;
const LCY=BANK.counterY,TELZ=CNTZ+.58,PX=WIN1+.5;
// ---------- people ----------
const TEL=person('teller',WIN1,0,TELZ,Math.PI);FK.rig(TEL,{iris:'#3b2a1c',brow:'#1c1410'});
const MK12=person('mike',SX+.15,0,SCZ+.55,Math.PI);FK.rig(MK12,{iris:'#5c4330',brow:'#3a281a'});
const AG=[['guard',0x1b2a4a,0x1d2330],['printer',0x1b2a4a,0x22262e]].map(([n,top,low])=>{const P=person(n,SX-1.4,0,RZ-3.3,0);
 P.g.traverse(o=>{if(o.isMesh&&/polo|tucked|cargo/i.test(o.name+o.material.name)){o.material=o.material.clone();o.material.color.set(/cargo/i.test(o.name+o.material.name)?low:top);}});FK.rig(P,{});return P;});
const SUV=vehicle('suv',0x0b0c0f,SX-14,RZ-4.3,0,'IRS');
// hands: a figure facing -z has its LEFT hand on the -x side (no crossed arms)
const reach2=(P,cx,y,z,half=.24)=>{relax(P);const L=solveReach(P,'L',V3(cx-half,y,z));relax(P);const R=solveReach(P,'R',V3(cx+half,y,z));relax(P);return {L,R};};
const RTEL=reach2(TEL,WIN1,LCY+.03,CNTZ+.2),RMK=reach2(MK12,SX+.15,SCY+.04,SCZ+.22,.3);
MA.g.position.set(WIN1,0,CNTZ-.7);MA.g.rotation.y=0;MA.g.updateMatrixWorld(true);relax(MA);
const RMA_C={R:solveReach(MA,'R',V3(WIN1-.2,LCY+.04,CNTZ-.3)),L:(relax(MA),solveReach(MA,'L',V3(WIN1+.2,LCY+.04,CNTZ-.3)))};
MA.g.position.set(SX-.5,0,SCZ-.62);MA.g.updateMatrixWorld(true);relax(MA);
const RMA_S={R:solveReach(MA,'R',V3(SX-.62,SCY+.32,SCZ-.08)),L:(relax(MA),solveReach(MA,'L',V3(SX-.18,SCY+.32,SCZ-.08)))};
MA.g.position.copy(MP);MA.g.rotation.y=MRY;relax(MA);
// ---------- props ----------
const LSTR=[0,1,2,3,4].map(i=>{const m=MNY.strap(100,{glow:.05});m.position.set(WIN1-.15+(i%3)*.15,LCY+.0125+Math.floor(i/3)*.0165,CNTZ-.2+(i%2)*.03);m.rotation.y=(i-2)*.08;m.visible=false;scene.add(m);return m;});
const PRN=G12();PRN.position.set(PX,LCY,CNTZ+.25);scene.add(PRN);add(RB(.42,.2,.34,.03),M(0x2b2e33,.45,.3),0,.1,0,PRN);add(RB(.36,.02,.1,.01),M(0x16181b,.4),0,.2,-.12,PRN);
const FORMC=document.createElement('canvas');FORMC.width=512;FORMC.height=680;const FORMT=new THREE.CanvasTexture(FORMC);FORMT.colorSpace=THREE.SRGBColorSpace;FORMT.anisotropy=8;
function drawForm(k){const x=FORMC.getContext('2d');x.fillStyle='#f7f5ef';x.fillRect(0,0,512,680);x.fillStyle='#14305a';x.fillRect(0,0,512,92);x.fillStyle='#fff';x.font='800 34px Mont';x.textAlign='center';x.fillText('CURRENCY',256,42);x.fillText('TRANSACTION REPORT',256,80);
 x.textAlign='left';const rows=[['NAME','███████  ████'],['ADDRESS','████ ██████ ST'],['CASH IN','$50,000']];rows.forEach(([l,v],i)=>{const y=170+i*150;x.fillStyle='#55606e';x.font='700 30px Mont';x.fillText(l,34,y);
  x.strokeStyle='#9aa3ad';x.lineWidth=3;x.strokeRect(30,y+16,452,74);if(k>i){x.fillStyle=i===2?'#0f8a3c':'#111';x.font='800 44px Mont';x.fillText(v,46,y+70);}});FORMT.needsUpdate=true;}
drawForm(0);
const FORM=add(new THREE.PlaneGeometry(.3,.4),new THREE.MeshStandardMaterial({map:FORMT,roughness:.8}),0,0,0,scene,false);
const ENV=G12();scene.add(ENV);{const et=tex(512,300,x=>{x.fillStyle='#e9dcc0';x.fillRect(0,0,512,300);x.strokeStyle='#b9a98a';x.lineWidth=4;x.beginPath();x.moveTo(0,0);x.lineTo(256,150);x.lineTo(512,0);x.stroke();
 x.fillStyle='#b11d1d';x.font='800 40px Mont';x.textAlign='center';x.fillText('CONFIDENTIAL',256,215);x.fillStyle='#333';x.font='700 26px Mont';x.fillText('SUSPICIOUS ACTIVITY REPORT',256,262);});
 add(new THREE.PlaneGeometry(.34,.2),new THREE.MeshStandardMaterial({map:et,roughness:.8,side:THREE.DoubleSide}),0,0,0,ENV,false);}
const SLOT=BANK.slot.clone().add(BANK.g.position);
const BAG2=SK.duffel({open:1,straps:10});BAG2.visible=false;scene.add(BAG2);
// chart above the shop: weekly cash deposits = real money stacks; week 4 = 3x, then it splits into small stacks
const CHX=SX,CHY=4.6,CHZ=RZ-1.6,BARS=[0,1,2,3].map(i=>{const g=G12();g.position.set(CHX+1.8-i*1.2,CHY,CHZ);scene.add(g);   // screen left -> right = week 1 -> 4
 const n=i<3?40:120,b=MNY.brick(100,{nx:4,ny:n,nz:3});b.position.y=MNY.size(100,{ny:n}).h/2;g.add(b);return g;});
const SPLIT=[0,1,2,3,4,5].map(()=>{const b=MNY.brick(100,{nx:4,ny:20,nz:3});b.visible=false;scene.add(b);return b;});
add(RB(5.0,.06,.8,.02),M(0x2a2d33,.5,.4),CHX,CHY-.03,CHZ,scene);
const WARN12=CK12.icon('warn',{color:'#ff2a2a',size:.5}),XIC=CK12.icon('x',{color:'#ff2a2a',size:.6}),Q1=CK12.icon('warn',{color:'#ffc61a',size:.3});scene.add(WARN12,XIC,Q1);
// ---------- floating words ----------
const T50=popT('$50,000',.14,GRN,V3(),S.fifty,S.over-.05);   // rides above his bag while he walks in
popT('OVER $10,000',.09,YEL,V3(WIN1+.15,1.75,CNTZ-.32),S.over+.05,S.report+.2);
popT('= REPORT',.09,WHT,V3(WIN1+.15,1.6,CNTZ-.32),S.files,S.report+.7);
popT('50 CUSTOMERS',.13,WHT,V3(SX+.15,2.12,SCZ+.3),S.cust-.3,S.masked);popT('A DAY',.11,YEL,V3(SX+.15,1.95,SCZ+.3),S.cust,S.masked);
popT('NO.',.2,RED,V3(SX+.15,2.15,SCZ+.4),S.no,S.knows+.4);
popT('WEEK 1',.13,WHT,V3(CHX+1.8,CHY-.24,CHZ-.5),S.every,S.splitting);popT('WEEK 2',.13,WHT,V3(CHX+.6,CHY-.24,CHZ-.5),S.every+.15,S.splitting);popT('WEEK 3',.13,WHT,V3(CHX-.6,CHY-.24,CHZ-.5),S.every+.3,S.splitting);popT('WEEK 4',.13,RED,V3(CHX-1.8,CHY-.24,CHZ-.5),S.every+.45,S.splitting);
popT('3X',.4,RED,V3(CHX-1.8,CHY+2.25,CHZ-.4),S.three,S.normal);
popT('UNDER $10,000',.22,YEL,V3(CHX,CHY+.95,CHZ-.5),S.splitting+.9,S.crime-.1);popT('CRIME',.34,RED,V3(CHX,CHY+.95,CHZ-.5),S.crime,S.behind-.2);
popT('IRS',.22,YEL,V3(SX-.9,2.3,RZ-2.6),S.irs-.05,S.past+.4);
popT('WHY MIKE?',.09,YEL,V3(SX+.15,1.98,SCZ+.25),S.why,DUR+1);popT('PART 2',.06,WHT,V3(SX+.15,1.9,SCZ+.25),S.part,DUR+1);
// ---------- walks ----------
function pathF(pts){const seg=[];let L=0;for(let i=1;i<pts.length;i++){const d=pts[i].distanceTo(pts[i-1]);seg.push(d);L+=d;}
 return {L,at:s=>{s=Math.max(0,Math.min(L,s));for(let i=0;i<seg.length;i++){if(s<=seg[i]||i===seg.length-1){const k=Math.min(1,s/seg[i]);return [pts[i].clone().lerp(pts[i+1],k),Math.atan2(pts[i+1].x-pts[i].x,pts[i+1].z-pts[i].z)];}s-=seg[i];}}};}
const T_OUT0=S.cash3+.2,T_SHOP1=S.masked+.3;
const P_OUT=pathF([V3(WIN1,0,CNTZ-.7),V3(BX,0,RZ+.7),V3(BX,0,RZ-.9),V3(SX-.7,0,RZ-1.3),V3(SX-.5,0,SCZ-.62)]);
const P_AG=[pathF([V3(SX-1.4,0,RZ-3.3),V3(SX-.9,0,RZ-1.2),V3(SX-.45,0,SCZ-1.6),V3(SX-.15,0,SCZ-.62)]),pathF([V3(SX-1.9,0,RZ-3.4),V3(SX-1.5,0,RZ-1.2),V3(SX+.35,0,SCZ-1.7),V3(SX+.45,0,SCZ-.66)])];
const T_AG0=S.agents+.3,T_AG1=S.straight+.2,MBOOTH=V3(SX-2.2,0,SZ-1.6);
function walker(P,path,t,t0,t1,ry1){const k=Math.max(0,Math.min(1,(t-t0)/(t1-t0))),[p,y]=path.at(k*path.L);P.g.position.copy(p);
 if(k>0&&k<1){const dy=y-P.g.rotation.y;P.g.rotation.y+=Math.atan2(Math.sin(dy),Math.cos(dy))*.4;walk(P,t,.42);}else if(k>=1&&ry1!==undefined)P.g.rotation.y=ry1;return k;}
const EP10PEOPLE=[MIKE,TR,MK,CHEF,...KIDS].filter(Boolean);
const armsTo=(P,A)=>{for(const sd of['L','R'])arm(P,sd,A[sd].ux,A[sd].uz,A[sd].lx);};
function story12(t){
 for(const P of EP10PEOPLE)P.g.visible=false;
 if(!story12.fixed){story12.fixed=1;scene.traverse(o=>{if(o.isMesh&&o.geometry.morphAttributes&&Object.keys(o.geometry.morphAttributes).length&&!o.morphTargetInfluences)o.updateMorphTargets();});}   // shared-geometry clones of FK-rigged cast need their own morph arrays   // EP10 cast clones share geometry with our FK-rigged cast (morphs) -> never render them here
 MA.g.updateMatrixWorld(true);
 T50.userData.pos.copy(BAG.position).add(V3(0,.75,0));   // "$50,000" above the bag while he walks in
 // ----- the masked man after the hook: counter -> out of the bank -> McDonald's -> booth -----
 if(t>=T_IN){relax(MA);idle(MA,t,1);for(const m of MAMATS)m.envMapIntensity=1;
  if(t<T_OUT0){MA.g.position.copy(P_OUT.at(0)[0]);MA.g.rotation.y=0;armsTo(MA,RMA_C);pose(MA,'spine03',.1,0,0);}
  else if(t<S.heres+1.5){const k=walker(MA,P_OUT,t,T_OUT0,T_SHOP1,0);if(k<1)arm(MA,'R',AD[0]+.05,AD[2]-.5,.15);else{armsTo(MA,RMA_S);pose(MA,'spine03',.12,0,0);}}
  else{MA.g.position.copy(MBOOTH);MA.g.rotation.y=.6;}
  FK.update(MA,t,{expr:[['angry',.45]],look:t<T_OUT0?V3(WIN1,1.62,TELZ):V3(SX+.15,1.62,SCZ+.55)});
  MA.g.updateMatrixWorld(true);const hr=MA.BN.wristR.getWorldPosition(V3());
  const onCounter=t>T_SHOP1+.1,inBank=t<T_OUT0;BAG.visible=!onCounter&&t<S.heres+1.5;
  if(inBank){BAG.position.set(WIN1-.45,0,CNTZ-.75);BAG.rotation.y=.3;}else if(!onCounter){BAG.position.copy(hr).add(V3(0,-.36,0));BAG.rotation.y=MA.g.rotation.y+Math.PI/2;}
  BAG2.visible=onCounter&&t<S.weeks;BAG2.position.set(SX-.4,SCY,SCZ-.05);BAG2.rotation.y=.15;}
 LSTR.forEach((m,i)=>{m.visible=t>T_IN+.1+i*.06&&t<T_OUT0;});
 // ----- teller: hands on the counter, types on "files" and "behind the glass" -----
 relax(TEL);idle(TEL,t,4);armsTo(TEL,RTEL);
 const typing=(t>S.files&&t<S.next)||(t>S.behind&&t<S.quiet+.3);if(typing){pose(TEL,'lowerarm01L',RTEL.L.lx+.08*Math.sin(t*30),0,0);pose(TEL,'lowerarm01R',RTEL.R.lx+.08*Math.cos(t*27),0,0);}
 FK.update(TEL,t,{expr:[['doubt',.6*(sm(S.over,S.over+.3,t)*(1-sm(S.next,S.next+.3,t))+sm(S.behind,S.behind+.3,t))]],look:t<S.behind?(t<S.files?V3(WIN1,1.7,CNTZ-.7):FORM.position):(t>S.nobody&&t<S.prove?cam.position:ENV.position)});
 const fk=sm(S.files,S.files+.6,t);FORM.position.set(PX,LCY+.22,CNTZ+.08-.25*fk);FORM.rotation.set(-Math.PI/2+1.15*sm(S.files+.5,S.report+.5,t),Math.PI,0);FORM.visible=t>S.files&&t<T_OUT0+2.2;
 const nf=(t>S.name)+(t>S.addr)+(t>S.cash3);if(nf!==FORM.userData.nf){FORM.userData.nf=nf;drawForm(nf);}
 const ek=sm(S.quiet,S.nobody+.2,t);ENV.visible=t>S.behind&&t<S.notcrim+.2;ENV.position.lerpVectors(V3(WIN1+.25,LCY+.25,CNTZ+.4),SLOT,ek);ENV.rotation.set(-.3*(1-ek),Math.PI,0);
 // ----- Mike: hands on the counter, shakes his head on "no", shock when the agents come to him -----
 SHOP12.registers[0].userData.slide(sm(S.register-.1,S.register+.35,t)*(1-sm(S.no,S.no+.3,t)));
 relax(MK12);idle(MK12,t,3);armsTo(MK12,RMK);
 const shake=t>S.no-.05&&t<S.knows+.2?Math.sin((t-S.no)*16)*.32:0;pose(MK12,'head',0,shake,0);
 const shockM=sm(S.straight-.2,S.straight+.2,t),noK=sm(S.no-.1,S.no+.1,t)*(1-sm(S.bag,S.bag+.3,t));
 FK.update(MK12,t,{expr:[['angry',.55*noK],['doubt',.5*sm(S.bag,S.bag+.3,t)*(1-shockM)],['shock',.9*shockM]],look:t>S.why?cam.position:(t>S.past?AG[0].g.position.clone().setY(1.7):(t<S.no?V3(SX-.5,1.7,SCZ-.62):cam.position))});
 // ----- IRS: SUV drives in and stops, agents walk past the masked man to Mike -----
 const ck=sm(S.weeks+.2,S.stops+.25,t);SUV.position.x=SX-14+12.6*(1-Math.pow(1-ck,2.2));SUV.visible=t>S.weeks-.5;
 AG.forEach((P,i)=>{P.g.visible=t>S.agents-.1;relax(P);idle(P,t,5+i);walker(P,P_AG[i],t,T_AG0+i*.15,T_AG1,0);FK.update(P,t,{expr:[['doubt',.4]],look:V3(SX+.15,1.62,SCZ+.55)});});
 // ----- chart above the shop -----
 BARS.forEach((g,i)=>{const t0=i<3?S.patterns+i*.15:S.three-.15,k=pop(t,t0,.35);g.visible=t>t0&&t<S.splitting+.4;g.scale.set(1,i<3?Math.max(.001,k):Math.max(.001,sm(S.three-.15,S.three+.6,t)),1);});
 const spk=sm(S.splitting,S.splitting+.9,t);SPLIT.forEach((b,i)=>{b.visible=t>S.splitting&&t<S.behind;b.position.set(CHX-1.8+(i-2.5)*.75*spk+1.8*spk,CHY+MNY.size(100,{ny:20}).h/2+(5-i)*.33*(1-spk),CHZ);});
 CK12.iconAnim(WARN12,t,S.red-.05,S.normal+.6,{pos:V3(CHX-1.8,CHY+2.95,CHZ-.4),cam,spin:.5});CK12.iconAnim(XIC,t,S.crime+.05,S.behind-.2,{pos:V3(CHX,CHY+1.75,CHZ-.5),cam,spin:.4});
 CK12.iconAnim(Q1,t,S.prove+.1,S.weeks-.3,{pos:V3(PX,LCY+.95,CNTZ+.1),cam,spin:.3});}
// ---------- ONE camera path (monotone cubic, no overshoot) ----------
const box=(a,b)=>CK12.box(a,b);
const head=(P)=>{P.g.updateMatrixWorld(true);const h=P.BN.head.getWorldPosition(V3());return box([h.x-.14,h.y-.2,h.z-.14],[h.x+.14,h.y+.2,h.z+.14]);};
const KF=(t,targets,o)=>F(CK12.fit(targets,o),t);
const manBox=p=>box([p.x-.35,0,p.z-.3],[p.x+.35,1.92,p.z+.3]);
const TELB=box([WIN1-.25,.9,TELZ-.2],[WIN1+.25,1.85,TELZ+.2]),LCNT=box([WIN1-.35,LCY,CNTZ-.35],[WIN1+.35,LCY+.08,CNTZ]),FORMB=box([PX-.17,LCY+.2,CNTZ-.2],[PX+.17,LCY+.62,CNTZ-.05]);
const MIKEB=box([SX-.15,0,SCZ+.3],[SX+.45,1.9,SCZ+.8]),SCNT=box([SX-.8,SCY,SCZ-.3],[SX+.6,SCY+.35,SCZ+.3]),REGB=box([SX-1.75,SCY,SCZ-.25],[SX-1.25,SCY+.4,SCZ+.4]);
const SIGNB=box([SX-2.9,3.3,RZ+.2],[SX+2.9,4.3,RZ+.2]),CHB=box([CHX-2.4,CHY-.35,CHZ],[CHX+2.4,CHY+2.7,CHZ]),BAR4=box([CHX-2.3,CHY-.3,CHZ],[CHX-1.3,CHY+3.2,CHZ]),SPB=box([CHX-2.3,CHY-.1,CHZ],[CHX+2.3,CHY+1.3,CHZ]);
const SUVB=box([SX-1.4-2.4,0,RZ-5.3],[SX-1.4+2.4,2,RZ-3.3]),BAG2B=box([SX-.75,SCY,SCZ-.25],[SX-.05,SCY+.4,SCZ+.15]);
const MKC=CK12.closeUp(MK12,{dist:.75,fov:28}),TELC=CK12.closeUp(TEL,{dist:.72,fov:28});
const DOOR_OUT=(t)=>[t,[BX,1.85,RZ-1.9],[BX-.6,1.4,CNTZ],50],DOOR_IN=(t,look)=>[t,[BX,1.75,RZ+1.4],look,50];
const INSIDE_OUT=(t)=>[t,[BX+.25,1.8,RZ+2.0],[BX,1.6,RZ+.2],50];
const MANL=t=>{const k=Math.max(0,Math.min(1,(t-T_OUT0)/(T_SHOP1-T_OUT0)));return P_OUT.at(k*P_OUT.L)[0].add(V3(0,1.2,0)).toArray();};
const KEYS12=[...HOOK_KEYS,
 KF(4.9,[manBox(at((4.9-tWalk)*SPEED)[0]),BDOOR],{dir:[-.08,.1,-1],fov:46}),
 DOOR_OUT(DOOR_T+.15),DOOR_IN(DOOR_T+.95,[WIN1,1.3,CNTZ]),
 [T_IN+.7,[BX+.75,1.9,RZ+1.5],[WIN1,1.35,CNTZ+.2],42],
 KF(S.files+.3,[TELB,FORMB,LCNT],{dir:[-.2,.15,-1],fov:38}),
 F(CK12.macro(FORMB,{dir:[-.05,.45,-1],fov:28,slack:.9}),S.name-.2),F(CK12.macro(FORMB,{dir:[-.02,.4,-1],fov:28,slack:.85}),S.cash3+.2),
 F(CK12.macro(FORMB,{dir:[-.02,.4,-1],fov:28,slack:.8}),T_OUT0+1.0),[T_OUT0+1.4,[PX+.1,2.4,CNTZ-1.1],MANL(T_OUT0+1.4),46],[T_OUT0+1.85,[BX+.6,2.35,RZ+1.6],MANL(T_OUT0+1.85),46],[T_OUT0+2.2,[BX,2.3,RZ+.25],MANL(T_OUT0+2.2),54],[T_OUT0+3.1,[BX+.4,3.6,RZ-4.6],MANL(T_OUT0+3.1),50],
 [S.owns-.4,[SX-.4,2.8,RZ-3.6],[SX,1.9,SCZ],48],KF(S.owns+.4,[MIKEB,SCNT],{dir:[.05,.1,-1],fov:40}),
 KF(S.cust+.3,[MIKEB,SCNT,box([SX-.6,1.85,SCZ+.3],[SX+.9,2.3,SCZ+.3])],{dir:[0,.12,-1],fov:42}),KF(S.masked+.3,[MIKEB,manBox(V3(SX-.5,0,SCZ-.62))],{dir:[.32,.12,-1],fov:42}),
 KF(S.register+.1,[REGB,BAG2B,SCNT],{dir:[.1,.45,-1],fov:34}),[S.no+.05,MKC.pos,MKC.look,MKC.fov],KF(S.knows+.6,[MIKEB,manBox(V3(SX-.5,0,SCZ-.62))],{dir:[-.25,.12,-1],fov:40}),
 F(CK12.macro(BAG2B,{dir:[.15,.6,-1],fov:28,ap:.005}),S.bag+.2),KF(S.heres+.4,[SIGNB,MIKEB],{dir:[0,.05,-1],fov:46}),
 KF(S.patterns+.3,[CHB],{dir:[0,.1,-1],fov:44}),KF(S.three+.2,[CHB],{dir:[-.08,.08,-1],fov:42,slack:.95}),KF(S.red+.1,[BAR4,box([CHX-2.3,CHY+2.6,CHZ],[CHX-1.3,CHY+3.3,CHZ])],{dir:[-.1,.05,-1],fov:40}),
 KF(S.every+.2,[CHB],{dir:[.08,.05,-1],fov:44}),KF(S.splitting+1.0,[SPB,box([CHX-1.4,CHY+.95,CHZ],[CHX+1.4,CHY+1.25,CHZ])],{dir:[-.05,.08,-1],fov:44}),
 KF(S.crime+.2,[SPB,box([CHX-.9,CHY+.95,CHZ],[CHX+.9,CHY+2.0,CHZ])],{dir:[0,.06,-1],fov:42}),
 [S.behind-.9,[BX+.6,2.4,RZ-3.4],[BX-.4,1.6,CNTZ],48],DOOR_OUT(S.behind-.3),DOOR_IN(S.behind+.35,[WIN1,1.35,CNTZ+.3]),
 KF(S.quiet+.2,[TELB,LCNT],{dir:[-.15,.1,-1],fov:40}),[S.nobody+.2,TELC.pos,TELC.look,TELC.fov],
 KF(S.prove+.2,[TELB,box([PX-.2,LCY+.75,CNTZ+.1],[PX+.2,LCY+1.15,CNTZ+.1])],{dir:[-.2,.12,-1],fov:40}),
 INSIDE_OUT(S.weeks-.4),[S.weeks+.3,[BX+.1,2.0,RZ+1.4],[BX,1.5,RZ-3],46],[S.weeks+.75,[BX+.1,2.1,RZ-.7],[SX-3,1.3,RZ-4.3],48],[S.weeks+1.2,[BX+.4,3.4,RZ-1.6],[SX-3,1.2,RZ-4.3],50],
 KF(S.stops+.9,[SUVB,SIGNB],{dir:[.25,.16,-1],fov:48}),KF(S.irs,[SUVB,manBox(P_AG[0].at(1)[0]),manBox(P_AG[1].at(1)[0])],{dir:[.3,.18,-1],fov:46}),
 KF(S.past+.2,[manBox(P_AG[0].at(P_AG[0].L*.6)[0]),manBox(MBOOTH),MIKEB],{dir:[-.15,.12,-1],fov:46}),KF(S.straight+.1,[MIKEB,manBox(P_AG[0].at(P_AG[0].L)[0])],{dir:[.3,.1,-1],fov:40}),
 KF(S.why+.1,[head(MK12),box([SX-.35,1.86,SCZ+.25],[SX+.65,2.12,SCZ+.25])],{dir:[.55,.22,-1],fov:32}),KF(DUR+1,[head(MK12),box([SX-.35,1.86,SCZ+.25],[SX+.65,2.12,SCZ+.25])],{dir:[.5,.2,-1],fov:32,slack:.95})];
// inside the bank the camera never backs through the front wall / glass partitions: clamp customer-side keys
for(const k of KEYS12){const inBank=(k[0]>DOOR_T+1.0&&k[0]<T_OUT0+.3)||(k[0]>S.behind+.3&&k[0]<S.weeks);if(inBank){k[1][2]=Math.min(Math.max(k[1][2],RZ+.65),CNTZ-.15);k[1][0]=Math.min(Math.max(k[1][0],BX-2.6),BX+2.6);k[1][1]=Math.min(k[1][1],BANK.H-.6);}}
KEYS12.sort((a,b)=>a[0]-b[0]);
const TS=KEYS12.map(k=>k[0]),CHN=[...[0,1,2].map(j=>mono(TS,KEYS12.map(k=>k[1][j]))),...[0,1,2].map(j=>mono(TS,KEYS12.map(k=>k[2][j]))),mono(TS,KEYS12.map(k=>k[3]))];
CK12.boom(tCatch,.35);CK12.boom(S.over,.3);CK12.boom(S.red,.5);CK12.boom(S.crime,.6);CK12.boom(S.irs,.5);
if(H12)window.CAM12=t=>({pos:[CHN[0](t),CHN[1](t),CHN[2](t)],look:[CHN[3](t),CHN[4](t),CHN[5](t)],fov:CHN[6](t),ap:.0018});
const _h12=hook12;hook12=t=>{_h12(t);story12(t);};
window.CK_REPORT=()=>({keys:KEYS12.map(k=>[+k[0].toFixed(2),k[1].map(v=>+v.toFixed(1))]),door:+DOOR_T.toFixed(2),tin:+T_IN.toFixed(2)});
