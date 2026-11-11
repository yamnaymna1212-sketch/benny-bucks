// ===================== EP19 STORY (after the hook): yard -> living room -> bank -> court -> yard, joined by camera whips =====================
const {check3D}=await import('./scenekit/props.js');
const STOP=2.5;   // (unused guard)
// ---- story times ----
const tGenius=T('genius'),tPizza=T('he orders'),tDay2=T('day two'),tFee=T('a late fee'),tAbout=T('about thirty dollars'),tJust=T('just for being'),
 tDay30=T('day thirty'),tBank=T('the bank tells'),tBureaus=T('bureaus'),tScore=T('his credit score'),tCliff=T('falls off'),tOuch=T('ouch'),tRate=T('now his interest'),tPct=T('thirty percent'),
 tMon=T('his thousand'),tPet=T('pet monster'),tEvery=T('every month'),tFeeds=T('feeds'),tBigger=T('gets bigger'),tDay60=T('day sixty'),tLetters=T('red letters'),tCalls=T('calls'),tPhone=T('his phone'),
 tHides=T('mike hides'),tHorror=T('horror'),tDay180=T('day one hundred'),tGives=T('the bank gives'),tWrites=T('writes it off'),tCeleb=T('mike celebrates'),tMist=T('big mistake'),
 tDidnt=T('the debt didnt'),tSold=T('sold'),tColl=T('the collector'),tWants=T('wants the money'),tSued=T('if he gets'),tJudge=T('judge'),tCheck=T('paycheck'),tTaken=T('taken'),
 tMark=T('and that late'),tSeven=T('seven years'),tLand1=T('landlords'),tCar=T('car lenders'),tApt=T('apartments'),tGood=T('the good news'),tJail=T('jail'),tCalling=T('and calling'),
 tPlan=T('payment plan'),tLower=T('with lower'),tSo=T('so would'),tCallB=T('call the bank'),tHide=T('hide from'),tComment=T('comment'),tCALLw=T('call or hide'),tHIDEw=TE('call or hide')-.3;
for(const ph of['about thirty dollars','thirty percent','seven years']){const [a,b]=FIND(ph);for(let i=a+(ph[0]==='a'?1:0);i<=b;i++)CH[i].t='';}
// whips (camera tilts to the sky, the place changes there)
const F0=tMist,F1=tDidnt-.05;const W1=tDay30-.12,W2=tDay180-.1,W3=tSued-.08,W4=tMark-.06;
const LR=300,BK=-300,CT=600;
// ---------- helpers ----------
const ENVT=K.tex(256,160,(x,w,h)=>{x.fillStyle='#c81e1e';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(80,62,150,10);x.fillRect(80,84,120,10);x.font='800 30px Mont';x.fillText('PAST DUE',14,40);});
const envelope=(p=scene)=>{const m=K.add(new THREE.PlaneGeometry(.27,.17),new THREE.MeshStandardMaterial({map:ENVT,roughness:.7,side:THREE.DoubleSide}),0,0,0,p,false);return m;};
function calendar(p,easel){const g=K.group(0,0,0,p);const tx=K.tex(512,600,()=>{});K.add(K.RB(.66,.76,.06,.02),K.M(0xf4f1ea,.7),0,0,0,g);
 K.add(new THREE.PlaneGeometry(.62,.72),new THREE.MeshStandardMaterial({map:tx,roughness:.7}),0,0,.032,g,false);
 for(const x of[-.18,0,.18])K.add(K.CY(.018,.018,.08,10),K.M(0x777777,.3,.8),x,.39,0,g,false);
 if(easel){for(const [x,z,r] of[[-.25,.05,-.12],[.25,.05,.12]]){const l=K.add(K.B(.035,1.3,.035),K.M(0x6b4a2e,.6),x,-.95,z,g);l.rotation.z=r;}const b=K.add(K.B(.035,1.3,.035),K.M(0x6b4a2e,.6),0,-.95,-.3,g);b.rotation.x=-.25;}
 let cur=null;return {g,set(n){if(n===cur)return;cur=n;K.redraw(tx,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#d42a2a';x.fillRect(0,0,w,150);x.fillStyle='#fff';x.font='800 100px Mont';x.textAlign='center';x.fillText('DAY',w/2,112);
  x.fillStyle='#161616';x.font=`800 ${String(n).length>2?240:330}px Mont`;x.fillText(n,w/2,String(n).length>2?440:480);});}};}
function monster(p){const g=K.group(0,0,0,p);const skin=new THREE.MeshStandardMaterial({color:0x58b63a,roughness:.5}),dark=K.M(0x1b0c0c,.6),white=K.M(0xffffff,.3);
 const body=K.add(new THREE.SphereGeometry(.5,40,28),skin,0,.52,0,g);body.scale.set(1,1.06,.9);
 K.add(new THREE.SphereGeometry(.3,24,16),K.M(0x9ad86a,.6),0,.42,.3,g,false).scale.set(1,1.1,.4);
 for(const [x,y,z] of[[-.3,.85,.15],[.32,.8,.12],[.0,.98,.05],[-.4,.5,.2],[.42,.45,.18]])K.add(new THREE.SphereGeometry(.07,12,8),skin,x,y,z,g,false);
 const eyes=[];for(const s of[-1,1]){const e=K.group(s*.17,.78,.36,g);K.add(new THREE.SphereGeometry(.12,20,14),white,0,0,0,e,false);K.add(new THREE.SphereGeometry(.055,14,10),K.M(0x111111,.2),0,0,.09,e,false);eyes.push(e);}
 for(const s of[-1,1]){const h=K.add(new THREE.ConeGeometry(.07,.22,12),K.M(0x6b3fa0,.5),s*.25,1.08,0,g);h.rotation.z=-s*.35;}
 const mouth=K.group(0,.46,.4,g);const mo=K.add(new THREE.SphereGeometry(.22,24,12),dark,0,0,0,mouth,false);mo.scale.set(1.15,.45,.35);
 for(let i=0;i<5;i++){const tt=K.add(new THREE.ConeGeometry(.035,.07,8),white,-.16+i*.08,.07,.06,mouth,false);tt.rotation.x=Math.PI;}
 const arms=[];for(const s of[-1,1]){const a=K.group(s*.48,.55,.05,g);const m=K.add(K.CY(.06,.05,.35,10),skin,0,-.15,0,a);arms.push(a);}
 for(const s of[-1,1])K.add(new THREE.SphereGeometry(.12,16,10),skin,s*.22,.06,.1,g).scale.set(1,.5,1.3);
 return {g,update(t,chomp=0){body.scale.set(1+.03*Math.sin(t*6),1.06+.04*Math.sin(t*6+1),.9);mouth.scale.y=1+1.1*chomp;const bl=Math.sin(t*1.3)>.97?.1:1;eyes.forEach(e=>e.scale.y=bl);arms.forEach((a,i)=>a.rotation.z=(i?1:-1)*(.5+.3*Math.sin(t*5+i)));}};}
function room(ox,{floor,wall,wcol,fcol}){const g=K.group(ox,0,0);K.add(K.B(7,.1,6.4),pbr(floor,4,3.5,fcol),0,-.05,0,g,false);
 K.add(K.B(7.2,3.4,.2),pbr(wall,3,1.4,wcol),0,1.7,-3.2,g);K.add(K.B(.2,3.4,6.4),pbr(wall,3,1.4,wcol),-3.6,1.7,0,g);K.add(K.B(.2,3.4,6.4),pbr(wall,3,1.4,wcol),3.6,1.7,0,g);
 K.add(K.B(7.2,.12,.06),K.M(0xffffff,.5),0,.1,-3.08,g,false);const L=new THREE.PointLight(0xffd2a0,14,13,1.3);L.position.set(0,2.9,.6);g.add(L);return g;}
// ---------- YARD: calendar on an easel, crown + sunglasses, pizza, mailbox envelope, fee ----------
const CALY=calendar(scene,true);CALY.g.position.set(-1.75,1.3,12.85);CALY.g.rotation.y=.25;
const CROWN=K.group();{const gold=K.M(0xf2c230,.25,.9);K.add(K.CY(.11,.1,.08,24,1),gold,0,0,0,CROWN,false);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const c=K.add(new THREE.ConeGeometry(.028,.09,8),gold,Math.sin(a)*.1,.08,Math.cos(a)*.1,CROWN,false);}
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.6;K.add(new THREE.SphereGeometry(.014,8,6),K.M(0xd0102a,.2,.2),Math.sin(a)*.106,0,Math.cos(a)*.106,CROWN,false);}}CROWN.visible=false;
const SHADES=K.group();{const bk=K.M(0x070707,.15,.6);for(const s of[-1,1])K.add(K.RB(.065,.04,.01,.012),bk,s*.04,0,0,SHADES,false);K.add(K.B(.03,.008,.008),bk,0,.01,0,SHADES,false);}SHADES.visible=false;
const PIZZA=K.group();{const pt=K.tex(256,256,(x,w,h)=>{x.fillStyle='#e9b45a';x.beginPath();x.arc(128,128,120,0,7);x.fill();x.fillStyle='#d8481f';x.beginPath();x.arc(128,128,104,0,7);x.fill();x.fillStyle='#f7d77a';for(let i=0;i<40;i++){x.beginPath();x.arc(128+Math.cos(i*2.4)*80*Math.sqrt((i%10)/10),128+Math.sin(i*2.4)*80*Math.sqrt((i%10)/10),14,0,7);x.fill();}x.fillStyle='#9e1d16';for(let i=0;i<9;i++){x.beginPath();x.arc(128+Math.cos(i*.7)*60,128+Math.sin(i*.7)*60,13,0,7);x.fill();}});
 K.add(K.B(.42,.04,.42),K.M(0xd9c6a3,.9),0,0,0,PIZZA);K.add(new THREE.PlaneGeometry(.38,.38),new THREE.MeshStandardMaterial({map:pt,roughness:.8}),0,.022,0,PIZZA,false).rotation.x=-Math.PI/2;
 const lid=K.group(0,.02,-.21,PIZZA);K.add(K.B(.42,.01,.42),K.M(0xd9c6a3,.9),0,0,.21,lid,false);lid.rotation.x=-1.9;}PIZZA.visible=false;
const ENV1=envelope();ENV1.visible=false;
const FEE=K.txt3('+$30 FEE',.2,0xff2a2a,{ei:1.0});FEE.visible=false;const OWE2=K.txt3('OWES $1,030',.21,0xf2f2f2,{ei:.12});OWE2.visible=false;
// ---------- LIVING ROOM (x 300) ----------
const LRg=room(LR,{floor:'laminate_floor_02',wall:'painted_plaster_wall',wcol:0xe9dccb,fcol:0xc9a27a});
{const win=K.group(.9,1.75,-3.08,LRg);K.add(K.B(1.7,1.25,.06),K.M(0xffffff,.5),0,0,0,win,false);K.add(K.B(1.55,1.1,.02),new THREE.MeshStandardMaterial({color:0xffb46a,emissive:0xff9a50,emissiveIntensity:1.1}),0,0,.03,win,false);K.add(K.B(.05,1.1,.05),K.M(0xffffff,.5),0,0,.05,win,false);}
const SOFA=K.group(.7,0,-2.25,LRg);{const fab=K.M(0x3c5a7a,.85);K.add(K.RB(2.3,.45,.95,.08),fab,0,.32,0,SOFA);K.add(K.RB(2.3,.6,.25,.08),fab,0,.75,-.38,SOFA);for(const s of[-1,1])K.add(K.RB(.22,.6,.95,.08),fab,s*1.15,.45,0,SOFA);for(const s of[-1,1])K.add(K.RB(1.0,.14,.75,.06),K.M(0x46688a,.85),s*.52,.6,.06,SOFA);}
const TABLE=K.group(.7,0,-.75,LRg);K.add(K.B(1.2,.06,.6),pbr('oak_wood_planks',1,.5,0x8a5a3a),0,.42,0,TABLE);for(const [x,z] of[[-.55,-.25],[.55,-.25],[-.55,.25],[.55,.25]])K.add(K.B(.05,.4,.05),K.M(0x2a2a2a,.5,.5),x,.2,z,TABLE);
K.add(K.B(3.2,.01,2.2),K.M(0x8c6f5a,.95),.5,.005,-1.0,LRg,false);
const PHONE=K.group(1.0,.465,-.7,LRg);K.add(K.RB(.09,.012,.18,.012),K.M(0x0b0b0b,.2,.5),0,0,0,PHONE);const PHS=K.add(new THREE.PlaneGeometry(.08,.165),new THREE.MeshStandardMaterial({color:0x111111,emissive:0xff2a2a,emissiveIntensity:0}),0,.008,0,PHONE,false);PHS.rotation.x=-Math.PI/2;
// TV on the left wall (screen redrawn live: bank -> bureaus, credit score gauge)
const TVg=K.group(-3.45,0,.1,LRg);TVg.rotation.y=Math.PI/2;K.add(K.B(1.6,.5,.45),pbr('oak_wood_planks',1,.4,0x5a3a26),0,.25,.1,TVg);
K.add(K.RB(1.9,1.1,.07,.03),K.M(0x0a0a0a,.3,.4),0,1.35,0,TVg);const TVT=K.tex(960,540,()=>{});const TVS=K.add(new THREE.PlaneGeometry(1.8,1.01),new THREE.MeshStandardMaterial({map:TVT,emissive:0xffffff,emissiveMap:TVT,emissiveIntensity:.9,roughness:.3}),0,1.35,.04,TVg,false);
function tvDraw(t){K.redraw(TVT,(x,w,h)=>{x.fillStyle='#0d1530';x.fillRect(0,0,w,h);x.textAlign='center';
 if(t<tScore){ // the bank reports to the credit bureaus: bank -> 3 bureau buildings, red envelopes travel along
  const bank=(cx,cy)=>{x.fillStyle='#e8e8e8';x.beginPath();x.moveTo(cx-110,cy-40);x.lineTo(cx,cy-110);x.lineTo(cx+110,cy-40);x.fill();x.fillRect(cx-100,cy-35,200,18);for(let i=0;i<4;i++)x.fillRect(cx-85+i*52,cy-12,22,110);x.fillRect(cx-110,cy+100,220,20);x.fillStyle='#fff';x.font='800 34px Mont';x.fillText('BANK',cx,cy+165);};
  bank(210,250);for(let i=0;i<3;i++){const by=110+i*160;x.fillStyle='#9fb4ff';x.fillRect(640,by-55,200,100);x.fillStyle='#0d1530';for(let r=0;r<2;r++)for(let c=0;c<4;c++)x.fillRect(660+c*46,by-40+r*42,30,26);x.fillStyle='#fff';x.font='800 24px Mont';x.fillText('CREDIT BUREAU',740,by+75);
   const u=Math.min(1,Math.max(0,(t-tBank-.3-i*.25)/.6));if(u>0&&u<1){const ex=330+(610-330)*u,ey=250+(by-250)*u;x.fillStyle='#d42a2a';x.fillRect(ex-30,ey-20,60,40);x.fillStyle='#fff';x.fillRect(ex-20,ey-4,40,6);}
   if(u>=1){x.fillStyle='#d42a2a';x.font='800 40px Mont';x.fillText('LATE',740,by+8);}}}
 else{ // credit score gauge: needle drops from green to red, then falls off
  const cx=w/2,cy=380,R=260;const seg=[['#d42a2a',Math.PI,Math.PI*1.33],['#f2b417',Math.PI*1.33,Math.PI*1.66],['#2fbf5a',Math.PI*1.66,Math.PI*2]];for(const [c,a,b] of seg){x.strokeStyle=c;x.lineWidth=70;x.beginPath();x.arc(cx,cy,R,a,b);x.stroke();}
  x.fillStyle='#fff';x.font='800 52px Mont';x.fillText('CREDIT SCORE',cx,500);
  const k=sm(tCliff-.05,tCliff+.45,t),a=Math.PI*1.85-(Math.PI*.78)*k+.06*Math.sin((t-tCliff)*25)*Math.exp(-Math.max(0,t-tCliff-.45)*6)*(k>=1?1:0);const drop=Math.max(0,t-tOuch)*900;
  x.save();x.translate(cx,cy+drop);x.rotate(a+(drop>0?drop/300:0));x.fillStyle='#fff';x.fillRect(0,-9,R-30,18);x.restore();x.fillStyle='#fff';x.beginPath();x.arc(cx,cy,26,0,7);x.fill();
  if(t>tPct-.1){x.fillStyle='rgba(212,42,42,.92)';x.fillRect(0,0,w,110);x.fillStyle='#fff';x.font='800 64px Mont';x.fillText('INTEREST RATE UP',cx,80);}}});}
const PCT=K.txt3('30%',.42,0xff2a2a,{ei:1.05});PCT.visible=false;
const CALW=calendar(LRg,false);CALW.g.position.set(-1.6,1.85,-3.05);
const MON=monster(LRg);MON.g.visible=false;
const MONEY=[];for(let i=0;i<10;i++){const s=MK.strap(1);s.visible=false;LRg.add(s);MONEY.push(s);}
const LET=[];for(let i=0;i<34;i++){const e=envelope(LRg);e.visible=false;LET.push({m:e,x:-.9+(Math.sin(i*12.9)*.5),z:1.0+Math.cos(i*7.3)*.35,r:i*1.7,d:i*.045});}
const BLANKET=K.add(K.RB(1.05,1.0,.85,.3),K.M(0xb84a3a,.9),0,0,0,LRg);BLANKET.visible=false;
// ---------- BANK (x -300) ----------
const BKg=room(BK,{floor:'marble_01',wall:'white_sandstone_blocks_02',wcol:0xf0e6d6,fcol:0xffffff});
{const gold=K.M(0xd4a83a,.3,.85);const BT=K.txt3('BANK',.42,0xd4a83a,{ei:.25,p:BKg});BT.position.set(0,2.75,-3.0);for(const x of[-2.6,2.6])K.add(K.CY(.2,.22,3.2,24),K.M(0xf4efe6,.5),x,1.6,-2.8,BKg);}
const CNT=K.group(0,0,-1.0,BKg);K.add(K.B(3.4,1.05,.6),pbr('oak_wood_planks',2,.6,0x7a4a2a),0,.525,0,CNT);K.add(K.B(3.5,.06,.7),K.M(0x2b2b2b,.3,.4),0,1.08,0,CNT);
const DOCT=K.tex(420,540,(x,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#1d2f6b';x.fillRect(0,0,w,64);x.fillStyle='#fff';x.font='800 30px Mont';x.fillText('ACCOUNT: MIKE',20,44);x.fillStyle='#999';for(let i=0;i<8;i++)x.fillRect(24,100+i*44,i%2?300:360,10);});
const DOC=K.group(0,1.115,-.95,BKg);K.add(new THREE.PlaneGeometry(.42,.54),new THREE.MeshStandardMaterial({map:DOCT,roughness:.8}),0,0,0,DOC,false).rotation.x=-Math.PI/2;
const CHG=K.tex(512,160,(x,w,h)=>{x.clearRect(0,0,w,h);x.strokeStyle='#d42a2a';x.lineWidth=12;x.strokeRect(10,10,w-20,h-20);x.fillStyle='#d42a2a';x.font='800 78px Mont';x.textAlign='center';x.fillText('CHARGED OFF',w/2,108);});
const CHGM=K.add(new THREE.PlaneGeometry(.4,.125),new THREE.MeshStandardMaterial({map:CHG,transparent:true,roughness:.6}),0,.003,.02,DOC,false);CHGM.rotation.set(-Math.PI/2,0,.18);CHGM.visible=false;
const STAMP=K.group(0,1.5,-.95,BKg);K.add(K.B(.16,.06,.1),K.M(0x2a2a2a,.4),0,0,0,STAMP);K.add(K.CY(.025,.025,.14,10),K.M(0x7a4a2a,.6),0,.1,0,STAMP);K.add(new THREE.SphereGeometry(.045,12,8),K.M(0x7a4a2a,.6),0,.19,0,STAMP);
const MON2=monster(BKg);MON2.g.visible=false;
const CONF=[];{const cols=[0xff3b3b,0x2fe06a,0xffd21a,0x3b8bff,0xffffff];for(let i=0;i<70;i++){const m=K.add(new THREE.PlaneGeometry(.05,.03),new THREE.MeshBasicMaterial({color:cols[i%5],side:THREE.DoubleSide}),0,0,0,BKg,false);m.visible=false;CONF.push({m,x:-1.3+Math.sin(i*3.1)*.9,z:Math.cos(i*5.7)*.6,v:.8+(i%7)*.12,r:i});}}
// ---------- COURT (x 600) ----------
const CTg=room(CT,{floor:'oak_wood_planks',wall:'wood_planks',wcol:0x8a6a4a,fcol:0x9a7050});
K.add(K.B(3.0,1.25,.8),pbr('oak_wood_planks',2,.8,0x6a3a20),0,.625,-1.8,CTg);K.add(K.B(3.1,.08,.9),K.M(0x3a2414,.4),0,1.27,-1.8,CTg);
{const ST=K.tex(512,512,(x,w,h)=>{x.fillStyle='#c9a24a';x.beginPath();x.arc(256,256,250,0,7);x.fill();x.fillStyle='#1d2f6b';x.beginPath();x.arc(256,256,215,0,7);x.fill();x.fillStyle='#c9a24a';x.font='800 64px Mont';x.textAlign='center';x.fillText('COURT',256,285);});
 K.add(new THREE.CircleGeometry(.55,48),new THREE.MeshStandardMaterial({map:ST,roughness:.5}),0,2.6,-3.08,CTg,false);
 const fl=K.add(FG,FLAGM,2.0,2.2,-2.9,CTg,false);fl.scale.setScalar(1.3);K.add(K.CY(.02,.02,2.6,8),K.M(0xc9a24a,.3,.8),1.2,1.3,-2.9,CTg);}
const GAVEL=K.group();K.add(K.CY(.05,.05,.18,16),K.M(0x5a2a14,.4),0,0,0,GAVEL).rotation.z=Math.PI/2;K.add(K.CY(.015,.015,.3,8),K.M(0x5a2a14,.4),0,-.15,0,GAVEL);scene.add(GAVEL);
const CHK_T=K.tex(1024,440,(x,w,h)=>{x.fillStyle='#e7f3e4';x.fillRect(0,0,w,h);x.strokeStyle='#7aa77a';x.lineWidth=10;x.strokeRect(12,12,w-24,h-24);x.fillStyle='#1d4a2a';x.font='800 70px Mont';x.fillText('PAYCHECK',50,105);
 x.font='800 36px Mont';x.fillText('PAY TO THE ORDER OF   MIKE',50,210);x.fillRect(50,230,w-100,4);x.fillRect(50,330,w-100,4);x.font='800 30px Mont';x.fillText('ACME WORKS INC.',50,395);});
const PCH=K.group(1.05,1.7,.3,CTg);const cl=CHK_T.clone(),cr=CHK_T.clone();cl.repeat.set(.7,1);cl.offset.set(0,0);cr.repeat.set(.3,1);cr.offset.set(.7,0);cl.needsUpdate=cr.needsUpdate=true;
const PCL=K.add(new THREE.PlaneGeometry(1.4*.7,.6),new THREE.MeshStandardMaterial({map:cl,roughness:.7,side:THREE.DoubleSide}),-1.4*.15,0,0,PCH,false);
const PCR=K.add(new THREE.PlaneGeometry(1.4*.3,.6),new THREE.MeshStandardMaterial({map:cr,roughness:.7,side:THREE.DoubleSide}),1.4*.35,0,0,PCH,false);
// ---------- YARD (end): cake with 7 candles, FOR RENT sign, car lender, cage, payment plan, CALL / HIDE ----------
const CAKE=K.group(.55,0,12.95);{K.add(K.CY(.03,.03,.7,10),K.M(0x2a2a2a,.4,.6),0,.35,0,CAKE);K.add(K.CY(.3,.3,.03,24),K.M(0x2a2a2a,.4,.6),0,.71,0,CAKE);
 K.add(K.CY(.2,.2,.16,32),K.M(0xf6efe4,.6),0,.81,0,CAKE);K.add(K.CY(.205,.205,.03,32),K.M(0xd84a6a,.5),0,.86,0,CAKE);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;K.add(K.CY(.008,.008,.08,6),K.M(0x6ab0ff,.5),Math.sin(a)*.12,.93,Math.cos(a)*.12,CAKE,false);K.add(new THREE.SphereGeometry(.014,8,6),new THREE.MeshStandardMaterial({color:0xffc04a,emissive:0xffa020,emissiveIntensity:2.5}),Math.sin(a)*.12,.985,Math.cos(a)*.12,CAKE,false);}}
CAKE.visible=false;const Y7=K.txt3('7 YEARS',.26,0xffd21a,{ei:.9});Y7.visible=false;
const RENT=K.group(-3.7,0,13.6);{K.add(K.B(.06,1.5,.06),K.M(0xf2f2f2,.5),0,.75,0,RENT);K.add(K.B(.7,.05,.05),K.M(0xf2f2f2,.5),.3,1.45,0,RENT);
 const rt=K.tex(512,320,(x,w,h)=>{x.fillStyle='#c81e1e';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(16,16,w-32,h-32);x.fillStyle='#c81e1e';x.font='800 110px Mont';x.textAlign='center';x.fillText('FOR',w/2,140);x.fillText('RENT',w/2,260);});
 K.add(new THREE.PlaneGeometry(.6,.38),new THREE.MeshStandardMaterial({map:rt,roughness:.6,side:THREE.DoubleSide}),.45,1.2,0,RENT,false);}RENT.visible=false;
const CARS=vehicle(K,'suv',{x:3.8,z:17.4,ry:0,color:0xb8bcc2});CARS.root.visible=false;
const XL=x3D(K),XC=x3D(K);XL.visible=XC.visible=false;
const CAGE=K.group(-.55,0,12.45);{const ir=K.M(0x3a3d42,.35,.85);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;K.add(K.CY(.022,.022,2.2,8),ir,Math.sin(a)*.5,1.1,Math.cos(a)*.5,CAGE);}for(const y of[.03,2.2])K.add(new THREE.TorusGeometry(.5,.03,8,40),ir,0,y,0,CAGE).rotation.x=Math.PI/2;}CAGE.visible=false;
const CHK1=check3D(K),CHK2=check3D(K);CHK1.visible=CHK2.visible=false;
const PLANT=K.tex(420,540,(x,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#1f7a3a';x.fillRect(0,0,w,80);x.fillStyle='#fff';x.font='800 38px Mont';x.textAlign='center';x.fillText('PAYMENT PLAN',w/2,54);
 x.fillStyle='#999';x.textAlign='left';for(let i=0;i<5;i++)x.fillRect(30,120+i*44,i%2?280:350,10);x.fillStyle='#1f7a3a';x.font='800 32px Mont';x.fillText('LOWER PAYMENTS',30,400);x.fillText('LOWER INTEREST*',30,450);x.fillStyle='#777';x.font='800 20px Mont';x.fillText('*sometimes',30,500);});
const PLAN=K.add(new THREE.PlaneGeometry(.5,.64),new THREE.MeshStandardMaterial({map:PLANT,roughness:.8,side:THREE.DoubleSide}),0,0,0,scene,false);PLAN.visible=false;
const CALLS=K.txt3('CALL',.3,0x2fe06a,{ei:.9}),HIDES=K.txt3('HIDE',.3,0xff2a2a,{ei:.9});CALLS.visible=HIDES.visible=false;
// ---------- cast for the story ----------
const pz=await K.person('printer',null,-8,0,15.2,0,0x555555);            // pizza delivery
const banker=await K.person('manager',null,BK,0,-1.7,0,0x1b1f27);
const coll=await K.person('guard',{polo:0x15171b,cargo:0x1d2026},BK+4,0,.2,-Math.PI/2,0x15171b);
const judge=await K.person('teller',{'suit|blouse':0x111111},CT,0,-2.35,0,0x111111);
const lord=await K.person('landlord',null,-3.2,0,13.9,.5,0x333333);
const lend=await K.person('seller',null,3.1,0,16.0,-.4,0x7a3a5a);
const HAIR=[];mike.g.traverse(o=>{if(o.isMesh&&/hair|brow|short0/i.test(o.name+o.material.name))HAIR.push({m:o.material,c:o.material.color.clone(),map:o.material.map});});
const headW=(P_)=>{const b=P_.BN['head'];return b?b.getWorldPosition(V3()):P_.g.position.clone().add(V3(0,1.65,0));};
const _f=V3();const fwd=(P_)=>_f.set(Math.sin(P_.g.rotation.y),0,Math.cos(P_.g.rotation.y));
// ---------- the story animation (runs after the hook animate; overrides Mike once the hook is over) ----------
function story(t){
 const ta=(t>F0&&t<F1)?F0:t;     // "Big mistake": freeze frame
 GRADE.uniforms.sat.value=1.06-.9*K.win(t,F0,F1,.05);
 // hook leftovers
 if(t>=W1){CARD.visible=false;PAID.visible=false;OWE.visible=false;}
 const M_=mike;
 // ---- YARD part 1 (Day 1, Day 2) ----
 CALY.g.visible=t>=tDay1-.05&&t<W1;if(CALY.g.visible){CALY.set(t<tDay2?1:2);const s=Math.max(pop(t,tDay1-.05,.3)*(t<tDay2?1:0),t>=tDay2?pop(t,tDay2,.3):0);CALY.g.scale.setScalar(Math.max(.01,t<tDay2?s:Math.max(.8,s)));}
 if(t>tNothing+.55&&t<W1){K.relax(M_);K.idle(M_,t);M_.g.position.set(-.55,0,12.45);M_.g.rotation.y=0;
  if(t<tPizza){const c=sm(tGenius-.15,tGenius+.1,t);K.crossArms(M_,c);K.face(M_,{smile:1.2*c});K.pose(M_,'head',-.1*c,.12*Math.sin(t*2),0);}
  else if(t<tDay2+.1){K.handsFront(M_,1);K.arm(M_,'L',AD[0]+1.0,AD[2]-.25,1.1);K.arm(M_,'R',AD[0]+1.0,AD[2]-.25,1.1);K.face(M_,{smile:1.3,jaw:.15*Math.abs(Math.sin(t*9))});}
  else if(t<tAbout){const lk=sm(tDay2,tDay2+.3,t);M_.g.rotation.y=-.55*lk*(1-sm(tFee+.3,tFee+.6,t));K.pose(M_,'head',.1,-.3*lk,0);if(t>tFee+.3){K.arm(M_,'R',AD[0]+.95,AD[2]-.2,1.0);K.face(M_,{jaw:.15});}}
  else if(t<tJust){K.arm(M_,'R',AD[0]+.95,AD[2]-.2,1.0);const sh=sm(tAbout,tAbout+.15,t);K.arm(M_,'L',AD[0]+.6*sh,AD[2]-1.95*sh,2.3*sh);K.face(M_,{jaw:.4*sh});}
  else{const sh=sm(tJust,tJust+.2,t);K.shrug(M_,sh);K.face(M_,{jaw:.1,smile:-.2});K.pose(M_,'head',0,.2*Math.sin(t*4),.15*sh);}
  M_.g.updateMatrixWorld(true);}
 {const h=headW(M_);const on=t>=tGenius-.05&&t<W1;CROWN.visible=SHADES.visible=on;if(on){const s=pop(t,tGenius-.05,.3);CROWN.scale.setScalar(Math.max(.01,s));CROWN.position.copy(h).add(V3(0,.2,0));CROWN.rotation.y=M_.g.rotation.y;
  SHADES.position.copy(h).add(fwd(M_).multiplyScalar(.1)).add(V3(0,.07,0));SHADES.rotation.y=M_.g.rotation.y;SHADES.scale.setScalar(Math.max(.01,s));}}
 // pizza: the delivery guy walks in, hands the box, walks away
 {const on=t>tGenius&&t<tDay2+.6;pz.g.visible=on;if(on){K.relax(pz);K.idle(pz,t,3);const u=sm(tGenius+.1,tPizza+.1,t),v=sm(tPizza+.6,tDay2+.6,t);pz.g.position.set(-8+6.6*u-6*v,0,14.2-.6*u);pz.g.rotation.y=v>0?-Math.PI/2:Math.PI/2*(1-u)+.0;
   if((u>0&&u<1)||v>0)K.walk(pz,t*1.2,.4);if(u>=1&&v<=0){pz.g.rotation.y=-.6;K.arm(pz,'R',AD[0]+1.0,AD[2]-.2,.5);}}
  const hold=t>tPizza+.35&&t<tDay2+.1,carry=t>tGenius+.1&&t<=tPizza+.35;PIZZA.visible=hold||carry;
  if(carry){pz.g.updateMatrixWorld(true);PIZZA.position.copy(wristW(pz,'R')).add(V3(0,.05,.1));PIZZA.rotation.set(0,0,0);}
  if(hold){PIZZA.position.copy(wristW(M_,'R')).add(wristW(M_,'L')).multiplyScalar(.5).add(V3(0,.05,.12));PIZZA.rotation.set(-.35,0,0);}}
 // Day 2: mailbox -> red envelope flies to Mike's hand; +$30 FEE; OWES $1,030
 {const a=tFee-.1,b=tFee+.35;ENV1.visible=t>a&&t<W1;if(ENV1.visible){const u=sm(a,b,t),src=V3(-3.3,1.15,11.2),dst=wristW(M_,'R').add(V3(0,.05,.1));ENV1.position.copy(src).lerp(dst,u);ENV1.position.y+=.6*u*(1-u);ENV1.quaternion.copy(cam.quaternion);ENV1.rotateZ(.2);}
  const f=pop(t,tAbout+.08,.3);FEE.visible=f>.01&&t<W1;FEE.scale.setScalar(Math.max(.01,f));FEE.position.set(.5,1.98,11.85);FEE.quaternion.copy(cam.quaternion);
  if(t>=tAbout+.1&&t<W1){OWE.visible=false;OWE2.visible=true;OWE2.position.copy(OWE.position);OWE2.quaternion.copy(cam.quaternion);OWE2.scale.setScalar(1+.15*Math.exp(-(t-tAbout-.1)*6));}else OWE2.visible=false;}
 // ---- LIVING ROOM (Day 30 / Day 60) ----
 if(t>=W1-.3&&t<W2+.3)tvDraw(t);
 CALW.set(t<tDay60?30:60);CALW.g.scale.setScalar(Math.max(.6,t<tDay60?pop(t,tDay30,.3):pop(t,tDay60,.3)));
 {const p=pop(t,tPct,.25)*(1-sm(tMon-.1,tMon+.1,t));PCT.visible=p>.01;PCT.scale.setScalar(Math.max(.01,p));PCT.position.set(LR-2.55,2.3,.5);PCT.quaternion.copy(cam.quaternion);}
 {const on=t>=tMon-.05&&t<W2;MON.g.visible=on;if(on){const months=Math.floor(Math.max(0,t-tEvery)/.75),grow=.42+.35*sm(tMon,tPet+.3,t)+.22*Math.min(4,months)*sm(tEvery,tEvery+.2,t)+.15*sm(tBigger,tBigger+.3,t);
   const g=Math.max(.01,grow*pop(t,tMon-.05,.35));MON.g.scale.setScalar(g);const mx=t<tHides?1.6:1.6+.5*sm(tHides-.3,tHides,t);MON.g.position.set(mx,0,t<tHides?-.2:-1.3*sm(tHides-.3,tHides,t)-.2*(1-sm(tHides-.3,tHides,t)));MON.g.rotation.y=-.5;
   let ch=0;MONEY.forEach((s,i)=>{const t0=tEvery+.05+i*.32,u=(t-t0)/.45;s.visible=u>0&&u<1&&t<tDay60;if(s.visible){const a=V3(-.2,1.2,.6),b=V3(mx,.46*g+.1,.25*g-.2);s.position.copy(a).lerp(b,u);s.position.y+=.5*u*(1-u);s.rotation.set(u*6,u*4,0);s.scale.setScalar(1);}if(u>.7&&u<1.2)ch=Math.max(ch,Math.sin((u-.7)*Math.PI*2));});
   MON.update(t,Math.max(ch,K.win(t,tPet,tPet+.5,.1)*.6));}}
 LET.forEach((L,i)=>{const t0=tLetters+L.d,u=Math.min(1,Math.max(0,(t-t0)/.45));L.m.visible=t>t0&&t<W2;if(L.m.visible){L.m.position.set(L.x,2.6*(1-u*u)+.01+i*.004,L.z);L.m.rotation.set(-Math.PI/2+(1-u)*2,0,L.r);}});
 {const b=K.win(t,tCalls,tHides+.2,.1);PHS.material.emissiveIntensity=b*(Math.sin(t*18)>0?1.3:.4);PHONE.position.x=1.0+.012*Math.sin(t*90)*b;PHONE.rotation.y=.06*Math.sin(t*70)*b;}
 if(t>=W1&&t<W2){K.relax(M_);K.idle(M_,t);
  if(t<tHides){M_.g.position.set(LR-.3,0,.55);const toMon=sm(tMon,tMon+.3,t);M_.g.rotation.y=-.9+1.6*toMon;K.pose(M_,'head',0,-.5*(1-toMon)+.3*toMon,0);
   if(t>tScore&&t<tRate){const o=sm(tCliff+.2,tOuch,t);if(o>0){K.headHold(M_,o);K.face(M_,{jaw:.4*o});}else K.point(M_,'R',sm(tScore,tScore+.2,t)*.8);}
   else if(t>=tRate&&t<tMon){const p=sm(tPct-.1,tPct+.1,t);K.point(M_,'L',p);K.face(M_,{jaw:.35*p});}
   else if(t>=tMon){const back=sm(tMon,tMon+.25,t);K.pose(M_,'spine03',-.15*back,0,0);for(const sd of['L','R'])K.arm(M_,sd,AD[0]+.9*back,AD[2]-.6*back,1.6*back);K.face(M_,{jaw:.35*back});
    if(t>tFeeds-.2&&t<tDay60){const h=sm(tFeeds-.2,tFeeds+.1,t);K.headHold(M_,h);}
    if(t>tDay60){M_.g.rotation.y=.2;const lk=sm(tLetters,tLetters+.2,t);K.pose(M_,'head',.35*lk,0,0);K.face(M_,{jaw:.35*lk});const c=sm(tCalls,tCalls+.2,t);if(c>0){M_.g.rotation.y=.2+.5*c;K.headHold(M_,c*.7);}}}}
  else{ // hiding on the sofa under the blanket (shivers)
   M_.g.position.set(LR+.45,-.07,-2.05);M_.g.rotation.y=0;K.sit(M_,1);K.handsFront(M_,1);K.pose(M_,'head',-.05,.25*Math.sin(t*3),0);K.face(M_,{jaw:.25});}
  M_.g.updateMatrixWorld(true);}
 BLANKET.visible=t>=tHides&&t<W2;if(BLANKET.visible){const s=pop(t,tHides,.3);BLANKET.position.set(.45+.02*Math.sin(t*40),.82,-2.0);BLANKET.scale.set(Math.max(.01,s),Math.max(.01,s),Math.max(.01,s));BLANKET.rotation.z=.03*Math.sin(t*35);}
 // ---- BANK (Day 180) ----
 if(t>=W2&&t<W3){const C=CALW;}   // wall calendar lives in the living room; the bank shows its own via BKCAL
 BKCAL.set(180);BKCAL.g.scale.setScalar(Math.max(.6,pop(t,tDay180,.3)));
 {const st=K.win(t,tWrites-.05,tWrites+.25,.08);STAMP.position.y=1.5-.36*st;CHGM.visible=t>tWrites+.05;if(CHGM.visible)CHGM.scale.setScalar(1+.4*Math.exp(-(t-tWrites)*10));}
 K.relax(banker);K.idle(banker,ta,4);banker.g.position.set(BK,0,-1.7);{const st=K.win(ta,tGives,tWrites+.3,.12);K.arm(banker,'R',AD[0]+.9*st,AD[2]-.2*st,.6*st+.3*K.win(ta,tWrites-.05,tWrites+.25,.08));K.face(banker,{jaw:.15*K.win(ta,tGives,tWrites)});
  if(ta>tDidnt){const h=K.win(ta,tDidnt,tColl+.4,.15);K.point(banker,'L',h);}}
 {const on=t>=tDidnt-.05&&t<W3;MON2.g.visible=on;if(on){const u=sm(tSold+.1,tColl+.2,t);const s=Math.max(.01,1.05*pop(t,tDidnt-.05,.35));MON2.g.scale.setScalar(s);MON2.g.position.set(-.9+2.6*u,.35*Math.sin(u*Math.PI),-.2+.4*u);MON2.g.rotation.y=.3;MON2.update(ta,K.win(t,tDidnt,tDidnt+.5,.1)*.6);}}
 {coll.g.visible=t>=tSold-.4&&t<W3;if(coll.g.visible){K.relax(coll);K.idle(coll,t,5);const u=sm(tSold-.4,tSold+.4,t);coll.g.position.set(BK+4.2-2.0*u,0,.4);coll.g.rotation.y=-Math.PI/2+.9*u;if(u<1)K.walk(coll,t*1.2,.4);
   const hd=sm(tWants-.1,tWants+.15,t);if(hd>0){coll.g.rotation.y=-Math.PI/2-.15;K.arm(coll,'R',AD[0]+1.2*hd,AD[2]-.3*hd,.4*hd);K.face(coll,{smile:.6});}}}
 if(t>=W2&&t<W3){K.relax(M_);K.idle(M_,ta);M_.g.position.set(BK-1.25,0,.15);M_.g.rotation.y=.35;K.pose(M_,'head',0,.5*(1-sm(tCeleb-.2,tCeleb,t)),0);
  const c=K.win(ta,tCeleb,tDidnt+.1,.1);if(c>0){K.armsUp(M_,c);M_.g.position.y=Math.abs(Math.sin((ta-tCeleb)*7))*.16*c;M_.g.rotation.y=.35+.4*Math.sin((ta-tCeleb)*6)*c;K.face(M_,{smile:1.4*c,jaw:.25*c});}
  if(t>=tDidnt+.1){const s=sm(tDidnt+.1,tDidnt+.35,t);M_.g.rotation.y=.35-.2*s;K.pose(M_,'head',0,.6*s,0);K.face(M_,{jaw:.4*s});for(const sd of['L','R'])K.arm(M_,sd,AD[0]+.9*s,AD[2]-.6*s,1.6*s);}
  M_.g.updateMatrixWorld(true);}
 CONF.forEach(c=>{const f=ta-tCeleb;c.m.visible=f>0&&t<W3&&f<2.2;if(c.m.visible){c.m.position.set(c.x+.2*Math.sin(f*3+c.r),2.6-c.v*f*1.1,c.z+.2*Math.cos(f*2+c.r));c.m.rotation.set(f*5+c.r,f*3,c.r);if(c.m.position.y<.02)c.m.position.y=.02;}});
 // ---- COURT ----
 K.relax(judge);K.idle(judge,t,6);judge.g.position.set(CT,0,-2.35);{const bang=Math.max(0,Math.sin(Math.min(1,Math.max(0,(t-tJudge)/.5))*Math.PI*2))*K.win(t,tJudge,tCheck+.2,.05);
  const up=K.win(t,tJudge-.2,tTaken+.6,.15);K.arm(judge,'R',AD[0]+(1.1+.5*bang)*up,AD[2]-.3*up,(.6-.5*bang)*up);judge.g.updateMatrixWorld(true);GAVEL.visible=t>W3&&t<W4;GAVEL.position.copy(wristW(judge,'R')).add(V3(0,.05,.12));GAVEL.rotation.set(0,0,-.4-.8*bang);K.face(judge,{jaw:.1});}
 {const k=sm(tTaken-.05,tTaken+.45,t);PCR.position.set(1.4*.35+1.2*k,-.35*k,.0);PCR.rotation.z=-.6*k;PCR.material.color.setRGB(1,1-.6*k,1-.6*k);PCH.scale.setScalar(Math.max(.01,pop(t,tCheck-.05,.3)));PCH.lookAt(cam.position);}
 if(t>=W3&&t<W4){K.relax(M_);K.idle(M_,t);M_.g.position.set(CT-.75,0,.75);M_.g.rotation.y=.25;K.pose(M_,'head',-.15,-.35,0);const s=sm(tJudge,tJudge+.15,t);K.face(M_,{jaw:.3*s});if(t>tTaken){const h=sm(tTaken,tTaken+.2,t);K.headHold(M_,h);K.pose(M_,'head',0,.4*h,0);}M_.g.updateMatrixWorld(true);}
 // ---- YARD part 2 ----
 const old=t>=W4&&t<tGood;HAIR.forEach(h=>{if(old){h.m.color.set(0xe2e2e2);h.m.map=null;}else{h.m.color.copy(h.c);h.m.map=h.map;}h.m.needsUpdate=true;});
 CAKE.visible=t>=W4&&t<tGood;if(CAKE.visible)CAKE.scale.setScalar(Math.max(.01,pop(t,W4+.2,.3)));
 {const y=pop(t,tSeven,.3)*(1-sm(tLand1-.1,tLand1+.1,t));Y7.visible=y>.01;Y7.scale.setScalar(Math.max(.01,y));Y7.position.set(.1,2.15,12.9);Y7.quaternion.copy(cam.quaternion);}
 RENT.visible=lord.g.visible=t>=tMark&&t<tGood;CARS.root.visible=lend.g.visible=t>=tMark&&t<tGood;CARS.update(t,false);
 if(lord.g.visible){K.relax(lord);K.idle(lord,t,7);const n=K.win(t,tLand1,tApt+1.6,.15);K.pose(lord,'head',0,.45*Math.sin(t*9)*n,0);K.crossArms(lord,n);lord.g.rotation.y=.5;
  K.relax(lend);K.idle(lend,t,8);const n2=K.win(t,tCar,tApt+1.6,.15);K.pose(lend,'head',0,.45*Math.sin(t*9+1)*n2,0);K.arm(lend,'R',AD[0]+.9*n2,AD[2]-.6*n2,1.0*n2);}
 {const a=pop(t,tLand1+.25,.3)*(1-sm(tGood-.2,tGood,t)),b=pop(t,tCar+.25,.3)*(1-sm(tGood-.2,tGood,t));XL.visible=a>.01;XC.visible=b>.01;XL.scale.setScalar(.45*Math.max(.01,a));XC.scale.setScalar(.45*Math.max(.01,b));
  XL.position.set(-3.2,2.45,13.9);XC.position.set(3.6,2.2,16.8);XL.quaternion.copy(cam.quaternion);XC.quaternion.copy(cam.quaternion);}
 {const d=sm(tJail-.25,tJail-.05,t),l=sm(tJail+.65,tJail+.95,t);CAGE.visible=d>0&&l<1;CAGE.position.y=3.2*(1-d)+4*l;
  const c1=pop(t,tJail+.7,.3)*(1-sm(tCalling+.1,tCalling+.3,t));CHK1.visible=c1>.01;CHK1.scale.setScalar(.5*Math.max(.01,c1));CHK1.position.set(.35,1.9,12.6);CHK1.quaternion.copy(cam.quaternion);
  const p=pop(t,tPlan-.05,.3)*(1-sm(tSo-.2,tSo,t));PLAN.visible=p>.01;PLAN.scale.setScalar(Math.max(.01,p));PLAN.position.set(.45,1.55,12.7);PLAN.quaternion.copy(cam.quaternion);
  const c2=pop(t,tLower+.4,.3)*(1-sm(tSo-.2,tSo,t));CHK2.visible=c2>.01;CHK2.scale.setScalar(.38*Math.max(.01,c2));CHK2.position.set(.75,1.95,12.75);CHK2.quaternion.copy(cam.quaternion);}
 {const pul=(t0)=>1+.2*Math.exp(-Math.pow((t-t0-.08)*6,2));const a=pop(t,tCallB,.3),b=pop(t,tHide,.3);CALLS.visible=a>.01;HIDES.visible=b>.01;
  CALLS.scale.setScalar(Math.max(.01,a)*pul(tCALLw));HIDES.scale.setScalar(Math.max(.01,b)*pul(tHIDEw));CALLS.position.set(-1.25,2.2,12.7);HIDES.position.set(.25,2.2,12.7);CALLS.quaternion.copy(cam.quaternion);HIDES.quaternion.copy(cam.quaternion);}
 if(t>=W4){K.relax(M_);K.idle(M_,t);M_.g.position.set(-.55,0,12.45);M_.g.rotation.y=0;
  if(t<tGood){K.pose(M_,'spine03',.12,0,0);K.face(M_,{jaw:.1,smile:-.2});const lk=t<tLand1?0:t<tCar?-1:1;M_.g.rotation.y=lk===0?0:lk<0?-.7:.7;if(t>tApt){M_.g.rotation.y=0;K.shrug(M_,sm(tApt,tApt+.2,t));}}
  else if(t<tCalling){const r=sm(tJail+.7,tJail+.9,t);if(t<tJail+.7){K.arm(M_,'L',AD[0]+.4,AD[2]-.5,1.2);K.face(M_,{jaw:.4});}else{K.armsUp(M_,r*.8);K.face(M_,{smile:1.2*r});}}
  else if(t<tSo){K.phone(M_,1);K.face(M_,{jaw:.15*Math.abs(Math.sin(t*8)),smile:.5});K.pose(M_,'head',0,.15,-.1);}
  else{const a1=K.win(t,tCallB,tHide-.1,.15),a2=K.win(t,tHide,tComment,.15);if(a1>0)K.point(M_,'R',a1);if(a2>0)K.point(M_,'L',a2);if(t>tComment){K.arm(M_,'R',AD[0]+.7,AD[2]-.5,1.3);K.arm(M_,'L',AD[0]+.7,AD[2]-.5,1.3);}K.face(M_,{smile:.7});}
  M_.g.updateMatrixWorld(true);}
 // ---- light: the sun follows the camera (shadows stay sharp in every place) ----
 const gx=cam.position.x+LOOK.x*8,gz=cam.position.z+LOOK.z*8;sun.target.position.set(gx,0,gz);sun.position.set(gx-34,11,gz+14);sun.target.updateMatrixWorld();
}
const BKCAL=calendar(BKg,true);BKCAL.g.position.set(-2.3,1.3,-.5);BKCAL.g.rotation.y=.5;
// ---------- full camera (hook keys + story shots) ----------
SH[0].keys.push(
 [tGenius+.1,[.1,1.95,16.0],[-.5,1.7,12.4],44],[tPizza+.2,[-1.8,2.0,16.4],[-.9,1.35,12.8],46],[tDay2+.25,[-1.4,1.9,16.6],[-1.9,1.25,12.2],46],
 [tFee+.45,[-.6,2.0,16.6],[-1.2,1.3,12.0],44],[tAbout+.1,[.4,2.1,16.4],[.0,1.7,12.0],44],[W1-.35,[.4,2.0,16.0],[-.2,1.6,12.2],42],[W1,[.4,2.1,16.0],[-.2,8,10],54]);
SH.push(
 {t0:W1,set:'lr',o:[LR,0,0],keys:[[W1,[.6,2.0,4.6],[.4,8,-1],54],[W1+.45,[.8,1.75,4.2],[-1.3,1.25,-.3],48],[tBank+.3,[-.6,1.55,2.4],[-3.4,1.35,.1],40],[tScore+.2,[-1.0,1.5,1.8],[-3.4,1.35,.1],36],
  [tOuch-.1,[.6,1.7,3.0],[-.3,1.4,.4],42],[tRate+.2,[-.2,1.75,2.9],[-2.0,1.6,.3],44],[tMon+.3,[2.2,1.6,3.0],[1.2,.9,-.3],46],[tBigger+.4,[2.6,2.2,3.7],[1.4,1.15,-.5],50],
  [tLetters+.1,[-.2,1.6,3.3],[-.6,.6,.8],46],[tPhone,[1.6,1.2,.6],[1.0,.47,-.7],40],[tHides+.3,[1.0,1.7,2.4],[.8,.95,-1.9],44],[W2-.35,[1.1,2.0,2.9],[.8,1.0,-1.9],48],[W2,[1.1,2.1,2.9],[.8,8,-2],56]]},
 {t0:W2,set:'bank',o:[BK,0,0],keys:[[W2,[0,2.0,4.4],[0,8,-1],54],[W2+.45,[-.2,1.8,4.2],[-.6,1.2,-.6],46],[tGives+.3,[.3,1.6,.9],[0,1.1,-.95],38],[tCeleb,[-.4,1.7,3.4],[-1.1,1.25,.0],44],
  [F1,[-.6,1.6,2.8],[-1.2,1.3,.1],38],[tSold,[.6,1.9,4.2],[.2,1.0,-.4],48],[tWants+.2,[.4,1.8,3.9],[.3,1.15,-.1],46],[W3-.35,[.3,1.8,3.8],[.2,1.15,-.1],46],[W3,[.3,1.9,3.8],[.2,8,-1],54]]},
 {t0:W3,set:'court',o:[CT,0,0],keys:[[W3,[0,2.0,4.4],[0,8,-1],54],[W3+.45,[.1,1.85,4.4],[0,1.45,-1.4],46],[tJudge,[.4,1.85,2.9],[.0,1.6,-1.9],42],[tCheck+.1,[.9,1.75,3.1],[.7,1.5,.1],42],
  [tTaken+.4,[1.0,1.75,3.2],[.9,1.45,.1],44],[W4-.3,[.5,1.8,3.6],[.3,1.4,-.2],46],[W4,[.5,1.9,3.6],[.3,8,-1],54]]},
 {t0:W4,set:'yard',keys:[[W4,[.4,2.1,17.4],[0,8,12],54],[W4+.45,[.5,2.0,17.0],[0,1.4,12.6],46],[tSeven,[.3,1.8,15.6],[.2,1.35,12.7],42],[tLand1+.1,[-1.4,1.9,17.6],[-3.0,1.3,13.4],44],
  [tCar+.1,[2.4,2.0,21.4],[3.5,1.1,16.9],44],[tApt+.2,[.4,4.2,23.4],[.2,1.4,14.4],50],[tGood+.2,[0,2.0,17.0],[-.5,1.35,12.5],44],[tCalling+.3,[-.2,1.8,15.9],[-.4,1.5,12.5],42],
  [tLower+.2,[.3,1.85,16.3],[0,1.55,12.6],44],[tSo+.3,[-.1,1.7,16.4],[-.5,1.55,12.6],44],[DUR,[-.1,1.7,16.0],[-.5,1.55,12.6],43]]});
