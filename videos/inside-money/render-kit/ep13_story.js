// ================= EP13 STORY (after the hook, 4.9 s -> end). One continuous camera, a new place + event on every line. =================
// Camera looks +z everywhere -> SCREEN RIGHT = -x. Scenes along Maple St (sidewalk z ~15), then back to the U.S. GOVERNMENT stage.
// S1 health care (x 15) / S2 who pays: 3 taxes -> MEDICARE jar (x 5) / S3 family $100,000 + workers (x -4.6) / S4 rent (x -14)
// S5 wealthy + business (x -22) / S6 CONGRESS decides (stage) / S7 'depends on your...' (Mike at the stage) / S8 CTA + Trump teaser.
// No numbers beyond what the voice says (facts: ../ep13-el-sayed-president/facts.md).
{
STORY10_OBJS.forEach(o=>o.visible=false);
{const bx=new THREE.Box3(V3(-31.5,-.1,12.0),V3(-24.4,2.6,17.6)),c=V3();scene.children.forEach(o=>{if(o.isLight||o===cam)return;const bb=new THREE.Box3().setFromObject(o);if(bb.isEmpty())return;bb.getCenter(c);const sz=bb.getSize(V3());if(bx.containsPoint(c)&&sz.x<6&&sz.y<3)o.visible=false;});}   // the EP10 story props are not used
const Tn=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9-]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
CH.forEach(c=>{if(/100,000/.test(c.t))c.t='';});   // the number floats in 3D -> not repeated in the caption
QM.userData.t1=4.85;
const HH=Math.PI;
const signTex=(txt,{w=768,h=200,bg='#0d1838',fg='#ffffff',font=110,border='#ffc61a'}={})=>tex(w,h,x=>{x.fillStyle=bg;x.fillRect(0,0,w,h);if(border){x.strokeStyle=border;x.lineWidth=10;x.strokeRect(5,5,w-10,h-10);}x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.font=`800 ${font}px Mont`;x.fillText(txt,w/2,h/2+4);});
function sign(txt,w,h,x,y,z,o={}){const m=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:signTex(txt,o),toneMapped:false,side:THREE.DoubleSide}),x,y,z,scene,false);m.rotation.y=HH;return m;}
const S=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const win=(t,a,b)=>pop(t,a,.3)*(1-sm(b,b+.25,t));
const glowM=(c,e=.6)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:e,roughness:.35});
// ---------- small models ----------
function miniHouse(col){const g=new THREE.Group();add(B(.26,.2,.22),new THREE.MeshStandardMaterial({color:col,roughness:.7}),0,.1,0,g);const sh=new THREE.Shape([new THREE.Vector2(-.16,0),new THREE.Vector2(.16,0),new THREE.Vector2(0,.13)]);
 const rf=add(new THREE.ExtrudeGeometry(sh,{depth:.24,bevelEnabled:false}),M(0x7a2e22,.6),0,.2,-.12,g);add(B(.06,.1,.01),M(0x4a2a14,.6),0,.05,-.115,g);return g;}
function eyeIcon(){const g=new THREE.Group();const w=add(new THREE.SphereGeometry(.12,32,16),glowM(0xffffff,.35),0,0,0,g);w.scale.set(1.6,.85,.5);
 add(new THREE.CircleGeometry(.07,32),glowM(0x2f8cff,.9),0,0,-.062,g,false).rotation.y=HH;add(new THREE.CircleGeometry(.032,24),M(0x050505,.3),0,0,-.064,g,false).rotation.y=HH;return g;}
function toothIcon(){const s=new THREE.Shape();s.moveTo(-.12,.1);s.bezierCurveTo(-.13,.2,-.02,.19,0,.14);s.bezierCurveTo(.02,.19,.13,.2,.12,.1);s.lineTo(.08,-.16);s.lineTo(.03,-.16);s.lineTo(0,-.04);s.lineTo(-.03,-.16);s.lineTo(-.08,-.16);s.closePath();
 const g=new THREE.Group();add(new THREE.ExtrudeGeometry(s,{depth:.05,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3}),glowM(0xffffff,.4),0,0,0,g);return g;}
function earIcon(){const g=new THREE.Group();const e=add(new THREE.TorusGeometry(.1,.035,14,32,Math.PI*1.35),glowM(0xffb08a,.45),0,0,0,g);e.rotation.z=-.55;e.scale.set(.8,1.15,1);add(new THREE.SphereGeometry(.03,16,8),glowM(0xffb08a,.45),.0,-.03,0,g);return g;}
function laptop(){const g=new THREE.Group();add(B(.42,.02,.3),M(0x9aa0a8,.35,.6),0,.01,0,g);const lid=new THREE.Group();lid.position.set(0,.02,.15);g.add(lid);add(B(.42,.28,.015),M(0x9aa0a8,.35,.6),0,.14,0,lid);
 const sc=canvasPlane(.38,.24,512,320,true);scene.remove(sc.m);sc.m.position.set(0,.14,-.009);sc.m.rotation.y=HH;lid.add(sc.m);lid.rotation.x=-.25;g.userData.sc=sc;return g;}
function gavel(){const g=new THREE.Group();const gold=M(0xd4af37,.3,1);const h=add(CY(.09,.09,.42,24),gold,0,0,0,g);h.rotation.z=Math.PI/2;add(CY(.025,.025,.7,12),M(0x5b3a22,.5),0,-.35,0,g);return g;}
// ---------- real backdrops (the street had empty lawn / blank brick there) ----------
const FZ=17.7;   // front faces of the north-side buildings
function glassM(){return M(0x22303f,.08,.3,{envMapIntensity:1.6});}
function clinic(x){const g=new THREE.Group();g.position.set(x,0,FZ+2);scene.add(g);add(B(6.4,3.8,4),pbr('plastered_wall',3,2,0xf3f3f0),0,1.9,0,g);add(B(6.6,.3,4.2),M(0xffffff,.45),0,3.9,0,g);
 for(const dx of[-2.1,0,2.1])add(B(1.6,2.0,.06),glassM(),dx,1.35,-2.01,g,false);add(B(1.2,2.3,.08),M(0xbfd8ff,.1,.2,{envMapIntensity:1.4}),0,1.15,-2.03,g,false);
 const sg=sign('HEALTH CLINIC',3.4,.55,x-.3,3.2,FZ-.05,{w:1400,h:226,bg:'#ffffff',fg:'#1d3fa8',font:150,border:'#1d3fa8'});
 const cr=new THREE.Group();cr.position.set(x+2.35,3.2,FZ-.06);scene.add(cr);const rm=glowM(0xe2202c,.8);add(B(.5,.16,.05),rm,0,0,0,cr);add(B(.16,.5,.05),rm,0,0,0,cr);}
function house(x,col){const g=new THREE.Group();g.position.set(x,0,FZ+2);scene.add(g);add(B(5.6,3.0,4),pbr('plastered_wall',3,2,col),0,1.5,0,g);
 const sh=new THREE.Shape([new THREE.Vector2(-3.1,0),new THREE.Vector2(3.1,0),new THREE.Vector2(0,1.7)]);add(new THREE.ExtrudeGeometry(sh,{depth:4.4,bevelEnabled:false}),M(0x5a3328,.7),0,3.0,-2.2,g);
 add(B(1.0,2.1,.08),M(0x3a2414,.45),0,1.05,-2.02,g,false);for(const dx of[-1.8,1.8]){add(B(1.2,1.0,.06),glassM(),dx,1.7,-2.01,g,false);add(B(1.35,.1,.12),M(0xffffff,.5),dx,1.15,-2.04,g,false);}
 add(B(2.2,.18,.8),pbr('concrete_pavement',1,.3),0,.09,-2.4,g);}
function apartments(x){const g=new THREE.Group();g.position.set(x,0,FZ+2.5);scene.add(g);add(B(6.6,7.2,5),pbr('red_brick',3,3,0xc9a08a),0,3.6,0,g);
 for(let fl=0;fl<3;fl++)for(const dx of[-2.3,-.8,.8,2.3])add(B(1.0,1.3,.06),glassM(),dx,1.5+fl*2.2,-2.51,g,false);
 add(B(1.3,2.2,.08),M(0x2a3542,.3),0,1.1,-2.53,g,false);sign('APARTMENTS',2.4,.42,x,2.7,FZ-.08,{w:1100,h:192,bg:'#1c2a3a',font:130});}
// ================= S1 health care (x 15) =================
const X1=15,Z1=15.0;
const tFirst=Tn('first'),tHealth=Tn('health'),tMed=Tn('medicare'),tVis=Tn('vision'),tDen=Tn('dental'),tHear=Tn('hearing'),tPrem=Tn('premiums'),tCop=Tn('copays'),tDed=Tn('deductibles');
const CARD=canvasPlane(1.05,.66,700,440);CARD.m.rotation.y=HH;CARD.m.position.set(X1-.2,1.55,Z1);
{const x=CARD.x;x.fillStyle='#f7f9fc';x.fillRect(0,0,700,440);x.fillStyle='#1d3fa8';x.fillRect(0,0,700,110);x.fillStyle='#d21e2a';x.fillRect(0,110,700,22);x.fillStyle='#fff';x.textAlign='center';x.font='800 64px Mont';x.fillText('MEDICARE',350,78);
 x.fillStyle='#1d3fa8';x.font='800 92px Mont';x.fillText('FOR ALL',350,250);x.fillStyle='#8c95a6';x.font='700 32px Mont';x.fillText('HEALTH INSURANCE',350,320);for(let i=0;i<3;i++){x.fillStyle='#d9dde6';x.fillRect(70,350+i*24,560-i*120,12);}CARD.t.needsUpdate=true;}
const ICONS=[[eyeIcon(),'VISION',tVis],[toothIcon(),'DENTAL',tDen],[earIcon(),'HEARING',tHear]].map(([g,l,t0],i)=>{g.position.set(X1+.5-i*.65,2.45,Z1);g.rotation.y=HH;scene.add(g);PT(l,.085,YEL,X1+.5-i*.65,2.18,Z1,t0-.05,tPrem-.3);return [g,t0];});
const BILLS=['PREMIUM','COPAY','DEDUCTIBLE'].map((n,i)=>{const c=canvasPlane(.48,.6,384,480);c.m.rotation.y=HH;c.m.position.set(X1+.5-i*.65,1.5,Z1);c.name=n;c.drawn=-1;return c;});
function drawBill(c,paid){const x=c.x;x.fillStyle='#fbfbf7';x.fillRect(0,0,384,480);x.strokeStyle='#222';x.lineWidth=8;x.strokeRect(4,4,376,472);x.fillStyle='#222';x.textAlign='center';x.font=`800 ${c.name.length>8?48:58}px Mont`;x.fillText(c.name,192,80);
 for(let i=0;i<4;i++){x.fillStyle='#dcdcd4';x.fillRect(40,120+i*36,304,16);}
 if(!paid){x.fillStyle='#d21e2a';x.font='800 120px Mont';x.fillText('$ ?',192,400);}else{x.save();x.translate(192,370);x.rotate(-.18);x.strokeStyle='#14b85a';x.lineWidth=14;x.strokeRect(-150,-80,300,150);x.fillStyle='#14b85a';x.font='800 140px Mont';x.fillText('$0',0,45);x.restore();}c.t.needsUpdate=true;}
// ================= S2 who pays: WEALTH / CORPORATE / INVESTMENT -> the MEDICARE jar (x 5) =================
const X2=5,Z2=15.2;const tBut=Tn('but'),tPaid=Tn('paid'),tWealth=Tn('wealth'),tCorp=Tn('corporate'),tInv=Tn('investment'),tInc=Tn('income');
const SRCX=[X2+1.55,X2+.55,X2-.45],SRCN=['WEALTH TAX','CORPORATE TAX','INVESTMENT TAX'],SRCT=[tWealth,tCorp,tInv];
SRCX.forEach((x,i)=>{table(x,Z2,.62,.5,.72);const b=MNY.brick(100,{nx:2,ny:5,nz:2});b.position.set(x,.72+.06,Z2);scene.add(b);});
const SRCS=SRCX.map((x,i)=>sign(SRCN[i],.95,.3,x,1.38,Z2-.05,{w:640,h:200,font:SRCN[i].length>11?72:92}));
const JX=X2-1.6;add(B(.62,.78,.62),M(0xf2f2ee,.6),JX,.39,Z2);
const JAR=add(CY(.3,.3,.72,40,1,true),new THREE.MeshPhysicalMaterial({color:0xe8f4ff,roughness:.05,transmission:.75,transparent:true,opacity:.35,side:THREE.DoubleSide}),JX,.78+.36,Z2);
add(CY(.31,.31,.04,40),M(0xd4af37,.3,1),JX,.78+.74,Z2);const JL=sign('MEDICARE FOR ALL',.62,.15,JX,1.0,Z2-.315,{font:70,border:''});
const FLYS=[];SRCX.forEach((x,i)=>{for(let k=0;k<3;k++){const m=MNY.brick(100,{nx:1,ny:3,nz:1,glow:.08});m.visible=false;m.userData={a:V3(x,.95,Z2),b:V3(JX+(k-1)*.08,.86+(i*3+k)*.055,Z2),t0:SRCT[i]+.1+k*.14};scene.add(m);FLYS.push(m);}});
const JQ=popT('?',.3,RED,V3(JX,1.75,Z2),tPaid-.1,tWealth-.1);
// ================= S3 a family earning $100,000 + ordinary workers (x -4.6) =================
const X3=-6.2,Z3=14.9;const tFam=Tn('family'),tAround=Tn('around'),tHopes=Tn('hopes'),tGo=Tn('go'),tAck=Tn('acknowledged'),tHigher=Tn('higher',1),tOrd=Tn('ordinary'),tWork=Tn('workers');
const MATE=person('teller',X3+1.05,0,Z3+.1,HH);
const WK=[person('guard',X3-1.6,0,Z3+.15,HH),person('printer',X3-2.2,0,Z3+.25,HH)];
PT('$100,000',.2,GRN,X3+.7,2.3,Z3,tAround+.1,tAck);
const TAXEQ=PT('TAXES =',.15,YEL,X3+.7,2.0,Z3,tHopes-.05,tAck);
PT('TAXES',.18,RED,X3-1.25,2.35,Z3+.1,tHigher-.05,30.0);
const UP=CK.icon('up',{color:'#ff2a2a',size:.36});scene.add(UP);
// ================= S4 rent (x -14) =================
const X4=-13.0,Z4=15.3;const tRent=Tn('rent'),tBan=Tn('ban'),tAlg=Tn('algorithmic'),tStop=Tn('stop'),tCorps=Tn('corporations'),tOwn=Tn('owning'),tPlus=Tn('plus'),tBoom=Tn('boom'),tPrices=Tn('prices'),tDown=Tn('down');
table(X4+.6,Z4,1.5,.62,.76);table(X4-.85,Z4,.7,.55,.76);
const LAP=laptop();LAP.position.set(X4-.85,.76,Z4);LAP.rotation.y=0;scene.add(LAP);
function drawLap(banned){const x=LAP.userData.sc.x;x.fillStyle=banned?'#3a0606':'#0b1530';x.fillRect(0,0,512,320);x.textAlign='center';x.fillStyle='#fff';x.font='800 50px Mont';x.fillText('RENT',256,64);x.fillText('ALGORITHM',256,120);
 x.strokeStyle='#22e06a';x.lineWidth=10;x.beginPath();x.moveTo(60,280);x.lineTo(170,240);x.lineTo(270,250);x.lineTo(450,150);x.stroke();
 if(banned){x.fillStyle='rgba(210,30,42,.85)';x.fillRect(0,170,512,90);x.fillStyle='#fff';x.font='800 72px Mont';x.fillText('BANNED',256,240);}LAP.userData.sc.t.needsUpdate=true;}
drawLap(false);let LAPB=0;
const HOUSES=[0xe8d3a8,0xa8c4e8,0xf0f0ea].map((c,i)=>{const h=miniHouse(c);h.position.set(X4+1.1-i*.42,.76,Z4-.08);h.rotation.y=HH;scene.add(h);return h;});
const NEWH=[0xd8e8c8,0xf0c8b8,0xc8d8f0,0xe8e0b0].map((c,i)=>{const h=miniHouse(c);h.position.set(X4+1.15-i*.36,.76,Z4+.18);h.rotation.y=HH;h.scale.setScalar(.001);scene.add(h);return h;});
const CRP=person('manager',X4+2.7,0,Z4+.1,HH);
const FORRENT=sign('FOR RENT',.7,.3,X4+2.05,1.1,Z4+.65,{bg:'#d21e2a',fg:'#fff',font:120,border:'#fff'});add(CY(.02,.02,1.0,8),M(0xffffff,.5),X4+2.05,.5,Z4+.66);
const XB=CK.icon('x',{color:'#ff2a2a',size:.34}),XC=CK.icon('x',{color:'#ff2a2a',size:.42}),DN=CK.icon('down',{color:'#1fd66a',size:.34});scene.add(XB,XC,DN);
PT('BIG CORP',.17,RED,X4+2.15,2.15,Z4+.1,tCorps-.05,tPlus);
PT('RENT',.17,WHT,X4+.85,1.75,Z4,tPrices-.08,tRent+11.5);
// ================= S5 wealthy / business owner (x -22) =================
const X5=-22,Z5=15.3;const tWealthy=Tn('wealthy'),tBiz=Tn('business'),tExpect=Tn('expect'),tBill=Tn('billionaire'),tBreaks=Tn('breaks'),tNo3=Tn('corporate',1);
const TOWER=new THREE.Group();TOWER.position.set(X5+.75,0,Z5);scene.add(TOWER);
for(let y=0;y<7;y++){const b=MNY.brick(100,{nx:3,ny:6,nz:3});b.geometry.computeBoundingBox();const hh=b.geometry.boundingBox.max.y-b.geometry.boundingBox.min.y;b.scale.set(1,.24/hh,1);b.position.y=.12+y*.245;TOWER.add(b);}
const TOP=TOWER.children.slice(5);
sign('BILLIONAIRE WEALTH',1.3,.24,X5+.75,2.02,Z5-.35,{w:900,h:170,font:86});
const RICH=person('manager',X5+1.75,0,Z5+.05,HH);
{const g=new THREE.Group();g.position.set(X5-1.75,0,Z5+.3);scene.add(g);add(B(1.5,1.9,.8),pbr('plastered_wall',1,1,0xe9e1d2),0,.95,0,g);add(B(1.3,1.0,.02),M(0x22303f,.08,.3,{envMapIntensity:1.6}),0,.8,-.41,g,false);
 const aw=tex(256,64,x=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#1d6f4f';x.fillRect(i*32,0,32,64);}});const a=add(B(1.6,.06,.45),new THREE.MeshStandardMaterial({map:aw}),0,1.55,-.55,g);a.rotation.x=-.3;}
const BIZ=sign('BUSINESS',1.2,.28,X5-1.75,2.05,Z5-.12,{bg:'#1d6f4f',font:120});
const TB=sign('TAX BREAKS',1.0,.24,X5-1.75,2.42,Z5-.14,{bg:'#3a3f4a',font:100,border:'#fff'});
const XD=CK.icon('x',{color:'#ff2a2a',size:.5});scene.add(XD);
PT('TAX',.22,RED,X5+.75,2.35,Z5,tExpect+.1,tNo3-.2);
// ================= S6 Congress decides (the U.S. GOVERNMENT building + stage) =================
const tCareful=Tn('careful'),tCant=Tn("can't".replace(/[^a-z0-9-]/g,'')),tAlone=Tn('alone'),tCong=Tn('congress'),tSpend=Tn('spending'),tTax6=Tn('taxes',5);
const FRZ=sign('CONGRESS',10,1.1,GX,8.55,23.68,{w:2048,h:226,bg:'#f4f1ea',fg:'#2a2f3a',font:170,border:''});
const GAV=gavel();GAV.position.set(GX,5.6,22.6);GAV.rotation.y=HH;scene.add(GAV);
PT('SPENDING',.7,GRN,GX+2.2,5.0,22.4,tSpend-.08,tSpend+1.9);PT('TAXES',.7,RED,GX-2.2,5.0,22.4,tTax6-.08,tTax6+1.0);
// ================= S7 'depends on your...' + S8 CTA (Mike in front of the stage) =================
const tSoNo=Tn('no',4),tAuto=Tn('automatically'),tEvery=Tn('everyone'),tLess=Tn('less'),tImpact=Tn('impact'),tYInc=Tn('income',1),tYFam=Tn('family',1),tYRent=Tn('rent',1),tYInv=Tn('investments'),tThink=Tn('think'),tTell=Tn('tell'),tComm=Tn('comments'),tFollow=Tn('follow'),tTrump=Tn('trump'),tEnd=TLN.dur;
const MX=GX+.62,MZ=15.8;
PT('PAY LESS',.15,WHT,MX,2.25,MZ-.1,tEvery-.05,tImpact-.1);const XE=CK.icon('x',{color:'#ff2a2a',size:.5});scene.add(XE);
PT('INCOME',.2,GRN,MX,2.1,MZ-.2,tYInc-.05,tYFam-.12);PT('FAMILY',.2,YEL,MX,2.1,MZ-.2,tYFam-.05,tYRent-.12);
PT('RENT',.2,WHT,MX,2.1,MZ-.2,tYRent-.05,tYInv-.12);PT('INVESTMENTS',.17,GRN,MX,2.1,MZ-.2,tYInv-.05,tThink-.3);
PT('TOMORROW',.16,YEL,MX-.35,2.3,MZ-.1,tFollow+.4,tEnd);
const COMM=CK.icon('dollar',{color:'#1fd66a',size:.001});COMM.visible=false;
clinic(X1-.3);house(X3+.2,0xe8dcc4);apartments(X4+.3);
// ---------- people ----------
const MKS=[[0,X1+1.05,Z1-.1,HH],[tBut-.25,X2-2.55,Z2-.3,HH-.35],[tFam-.6,X3+.35,Z3,HH],[tRent-.55,X4-1.75,Z4-.3,HH+.3]];   // story Mike teleports at mid-flight (off screen)
const MA13={};const solveM=(P,k,sd,tgt)=>{if(!MA13[k]){relax(P);P.g.updateMatrixWorld(true);MA13[k]=solveReach(P,sd,tgt);relax(P);}return MA13[k];};
function mk(t){const P=MK;const on=t>4.85&&t<tWealthy-.35;P.g.visible=on;if(!on)return;let pl=MKS[0];for(const p of MKS)if(t>=p[0])pl=p;P.g.position.set(pl[1],0,pl[3-1]);P.g.rotation.y=pl[3];relax(P);idle(P,t,3);
 let look=cam.position,ex=[['joy',.4]];
 if(t<tBut-.25){   // S1: points at the card, then at the bills
  const k=sm(tMed-.2,tMed+.2,t)*(1-sm(tDed+.5,tDed+.8,t));if(k>0){const tg=t<tPrem-.2?V3(X1-.1,1.6,Z1):V3(X1+.3-.65*Math.min(2,Math.floor((t-tPrem+.2)/.9)),1.5,Z1);const a=solveM(P,'s1'+(t<tPrem-.2?0:Math.min(2,Math.floor((t-tPrem+.2)/.9))),'L',tg);setA(P,'L',lerpA(REST,a,k));}
  look=t<tPrem-.2&&t>tMed?V3(X1-.1,1.8,Z1):t>tPrem-.2?V3(X1-.15,1.5,Z1):cam.position;ex=[['joy',.6]];}
 else if(t<tFam-.6){look=t<tWealth?V3(JX,1.4,Z2):FLYS.find(m=>m.visible)?.position||V3(JX,1.2,Z2);ex=[['doubt',.5]];}
 else if(t<tRent-.55){ex=t<tAck?[['joy',.5]]:[['doubt',.4],['shock',.5*sm(tHigher-.1,tHigher+.2,t)]];look=t>tHigher?V3(X3-1.25,2.3,Z3):cam.position;
  if(t>tHigher-.1){pose(P,'head',0,.25*sm(tHigher-.1,tHigher+.3,t),0);}}
 else{look=t<tStop?LAP.position:t<tPlus?CRP.g.position.clone().add(V3(0,1.5,0)):V3(X4+.6,1.0,Z4);ex=t>tPrices-.1?[['joy',.7]]:[['doubt',.5]];
  if(t>tPrices-.1){const k=sm(tPrices-.1,tPrices+.2,t);arm(P,'R',AD[0]+.3*k,AD[2]-1.0*k,.9*k);}}
 FK.update(P,t,{expr:ex,look});}
function others(t){
 // partner (S3)
 MATE.g.visible=t>tFam-1.5&&t<tRent;if(MATE.g.visible){relax(MATE);idle(MATE,t,2);}
 WK.forEach((W,i)=>{W.g.visible=t>tOrd-1.2&&t<tRent;if(!W.g.visible)return;const k=sm(tOrd-.6,tWork+.4,t);relax(W);W.g.position.set(X3-3.2+k*(1.6-i*.15)-i*.55,0,Z3+.15+i*.1);W.g.rotation.y=HH-.5*(1-k);if(k<1)walk(W,t,.38);else idle(W,t,i);});
 // the corporate buyer walks in (S4)
 CRP.g.visible=t>tRent-1&&t<tWealthy;if(CRP.g.visible){relax(CRP);const k=sm(tStop-.2,tCorps+.4,t);CRP.g.position.set(X4+3.3-1.1*k,0,Z4+.1);if(k>0&&k<1)walk(CRP,t,.36);else idle(CRP,t,4);
  if(t>tOwn+.1){const s=sm(tOwn+.1,tOwn+.4,t);arm(CRP,'L',AD[0]+.3*s,AD[2]-.6*s,.6*s);arm(CRP,'R',AD[0]+.3*s,AD[2]-.6*s,.6*s);}}   // shrug: stopped
 // the rich business owner (S5)
 RICH.g.visible=t>tWealthy-1.5&&t<tCareful;if(RICH.g.visible){relax(RICH);idle(RICH,t,5);if(t>tExpect+.1)face(RICH,{jaw:.09*sm(tExpect+.1,tExpect+.4,t),smile:0});}
 // Trump teaser (S8)
 TR.g.visible=t>tTrump-.35;if(TR.g.visible){TR.g.position.set(MX-.95,0,MZ+.05);TR.g.rotation.y=HH+.25;relax(TR);idle(TR,t,1);wave(TR,'R',t);FK.update(TR,t,{expr:[['smirk',.9]],look:cam.position});}}
// El-Sayed: S2 pointing at the jar; S6 shrug at the lectern ("can't do this alone")
const ELS2=V3(X2+.55,0,Z2+1.0);
function els13(t){const P=ELS;if(t>tBut-.3&&t<tFam-.6){P.g.position.copy(ELS2);P.g.rotation.y=HH;relax(P);idle(P,t,.4);const k=sm(tPaid-.2,tPaid+.2,t);arm(P,'L',AD[0]+.25*k,AD[2]-1.25*k,.15*k);FK.update(P,t,{expr:[['joy',.5]],look:t<tWealth?V3(JX,1.3,Z2):cam.position});return;}
 if(t>tCareful-.3){P.g.position.set(GX,SY,ELZ);P.g.rotation.y=HH;relax(P);idle(P,t,.4);const s=sm(tCant-.15,tCant+.25,t)*(1-sm(tCong+.6,tCong+1.0,t));
  arm(P,'R',AD[0]+.45*s,AD[2]-.85*s,1.1*s);arm(P,'L',AD[0]+.45*s,AD[2]-.85*s,1.1*s);pose(P,'head',0,0,.12*s);FK.update(P,t,{expr:[['doubt',.6*s],['joy',.3]],look:cam.position});}}
function mike7(t){if(t<5.3){return;}FAN.visible=false;const P=MIKE;P.g.position.set(MX,0,MZ);relax(P);idle(P,t,1.3);
 if(t<tSoNo-.4){P.g.rotation.y=-.08;FK.update(P,t,{look:V3(GX,SY+1.6,ELZ)});return;}
 const turn=sm(tSoNo-.4,tSoNo,t);P.g.rotation.y=-.08+(HH+.08)*turn;
 if(t<tAuto)pose(P,'head',0,.3*Math.sin((t-tSoNo)*14)*sm(tSoNo,tSoNo+.1,t)*(1-sm(tSoNo+.5,tSoNo+.6,t)),0);   // 'So no' head shake
 if(t>tImpact&&t<tThink){const k=sm(tImpact,tImpact+.3,t);arm(P,'R',AD[0]+.3*k,AD[2]-.7*k,.8*k);arm(P,'L',AD[0]+.3*k,AD[2]-.7*k,.8*k);}   // open hands: it depends
 if(t>tTell-.1&&t<tFollow+.3)pose(P,'head',.12*Math.sin((t-tTell)*9)*sm(tTell-.1,tTell+.1,t),0,0);   // nods: "tell me"
 if(t>tTrump-.1){const k=sm(tTrump-.1,tTrump+.25,t);arm(P,'L',AD[0]+.3*k,AD[2]-1.2*k,.5*k);}   // presents Trump
 FK.update(P,t,{expr:t>tTell?[['joy',.7]]:[['doubt',.5*sm(tEvery,tEvery+.3,t)]],look:cam.position});}
story13=function(t){if(t<4.85)return;mk(t);others(t);els13(t);mike7(t);
 // S1
 S(CARD.m,win(t,tMed-.1,tPrem-.35));ICONS.forEach(([g,t0],i)=>{S(g,win(t,t0-.05,tPrem-.35));if(g.visible)g.rotation.y=HH+.3*Math.sin(t*2+i);});
 BILLS.forEach((c,i)=>{const t0=[tPrem,tCop,tDed][i];S(c.m,win(t,tPrem-.35+i*.08,tBut-.2));const paid=t>=t0?1:0;if(c.drawn!==paid){drawBill(c,paid);c.drawn=paid;}if(t>t0&&t<t0+.35)c.m.scale.multiplyScalar(1+.12*Math.sin((t-t0)/.35*Math.PI));});
 // S2
 FLYS.forEach(m=>{const u=m.userData,k=sm(u.t0,u.t0+.5,t);m.visible=k>0;if(!m.visible)return;m.position.lerpVectors(u.a,u.b,k);m.position.y+=.45*Math.sin(Math.PI*k);m.rotation.set(0,(1-k)*2.2,(1-k)*.6);});
 SRCS.forEach((s,i)=>{const k=t>SRCT[i]-.05&&t<SRCT[i]+.4?1.12:1;s.scale.setScalar(k);});
 // S3
 CK.iconAnim(UP,t,tHigher,30.0,{pos:V3(X3-1.95,2.4,Z3+.1),cam,spin:.4});
 // S4
 const ban=t>tBan?1:0;if(ban!==LAPB){drawLap(ban);LAPB=ban;}
 CK.iconAnim(XB,t,tBan+.05,tStop-.1,{pos:V3(X4-.85,1.35,Z4-.2),cam,spin:.3});CK.iconAnim(XC,t,tOwn,tPlus+.2,{pos:V3(X4+2.15,2.5,Z4),cam,spin:.3});CK.iconAnim(DN,t,tPrices-.05,tWealthy-.4,{pos:V3(X4+.05,1.85,Z4),cam,spin:.4});
 HOUSES.forEach((h,i)=>{h.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(0xff3030);o.material.emissiveIntensity=.35*sm(tOwn,tOwn+.2,t)*(1-sm(tPlus,tPlus+.3,t));}});});
 NEWH.forEach((h,i)=>{const s=pop(t,tBoom-.25+i*.13,.3);h.scale.setScalar(Math.max(.001,s));});
 // S5
 TOP.forEach((b,i)=>{const k=sm(tExpect+.15,tExpect+.75,t);b.position.x=-k*(1.4+i*.3);b.position.y=.12+(5+i)*.245+Math.sin(k*Math.PI)*.4-k*(5+i)*.2;b.rotation.z=k*(1.2+i*.4);b.visible=k<.98;});
 S(BIZ,1+.15*Math.max(0,Math.sin(Math.min(1,(t-tBiz)/.4)*Math.PI))*(t>tBiz?1:0));CK.iconAnim(XD,t,tNo3-.1,tCareful-.2,{pos:V3(X5-1.75,2.75,Z5-.3),cam,spin:.3});
 // S6
 {const d=t-tCong;GAV.visible=t>tCong-.6&&t<tSoNo-.3;GAV.rotation.z=d<0?-.9*sm(tCong-.6,tCong-.1,t):-.9+.9*Math.min(1,d/.12);}
 // S7
 CK.iconAnim(XE,t,tLess-.05,tImpact-.1,{pos:V3(MX-.85,2.3,MZ-.1),cam,spin:.3});
};
// ---------- camera: one continuous move (fly between places, push/drift inside each place) ----------
const res=(s,k)=>{if(typeof s[k]==='function')s[k]=s[k]();return s[k];};
const fitF=(T,dir,fov,o={})=>()=>CK.fit(T,{dir,fov,top:.07,...o});
const MBX=(x,z,h=1.9)=>CK.box([x-.32,0,z-.3],[x+.32,h,z+.3]);
SH13[SH13.length-1].t1=4.85;
function fly(t0,t1,b){const prev=SH13[SH13.length-1],tm=(t0+t1)/2;const s2={t0:tm,t1,b,ease:'ramp'};
 const s1={t0,t1:tm,a:()=>res(prev,'b'),b:()=>{const A=res(prev,'b'),Bf=res(s2,'b');return {pos:A.pos.map((v,i)=>(v+Bf.pos[i])/2+(i===1?1.4:i===2?-1.0:0)),look:A.look.map((v,i)=>(v+Bf.look[i])/2+(i===1?.3:0)),fov:Math.max(A.fov,Bf.fov)+4};},ease:'rampIn'};
 s2.a=()=>res(s1,'b');SH13.push(s1,s2);}
function hold(t0,t1,a,b,ease='ramp'){SH13.push({t0,t1,a,b:b||a,ease});}
const S1W=[MBX(X1+1.05,Z1-.1),CK.box([X1-1.15,1.1,Z1],[X1+.85,2.65,Z1]),CK.box([X1-1.5,3.0,FZ],[X1+1.2,3.5,FZ])];
fly(4.85,5.7,fitF(S1W,[0,.12,-1],44));hold(5.7,tMed-.1,fitF(S1W,[.05,.12,-1],44,{slack:.93}));
hold(tMed-.1,tPrem-.4,fitF([CK.box([X1-1.15,1.2,Z1],[X1+.85,2.65,Z1]),MBX(X1+1.05,Z1-.1)],[-.08,.05,-1],40),fitF([CK.box([X1-1.15,1.2,Z1],[X1+.85,2.65,Z1])],[.06,.05,-1],40,{slack:.94}),'smooth');
hold(tPrem-.4,tBut-.3,fitF([CK.box([X1-1.15,1.15,Z1],[X1+.85,1.85,Z1]),MBX(X1+1.05,Z1-.1)],[.1,.06,-1],40),fitF([CK.box([X1-1.15,1.15,Z1],[X1+.85,1.85,Z1])],[-.06,.06,-1],38,{slack:.95}),'smooth');
const S2W=[CK.box([X2-2.9,0,Z2-.4],[X2+1.95,1.75,Z2+1.0]),MBX(ELS2.x,ELS2.z,1.8)];
fly(tBut-.3,tBut+.5,fitF(S2W,[0,.14,-1],48));hold(tBut+.5,tWealth-.1,fitF([CK.box([JX-.4,.7,Z2],[JX+.4,2.0,Z2]),MBX(X2-2.55,Z2-.3)],[-.1,.08,-1],40),null,'ramp');
SRCX.forEach((x,i)=>{const T=[CK.box([x-.5,.7,Z2-.25],[x+.5,1.55,Z2+.25]),CK.box([JX-.35,.75,Z2],[JX+.35,1.55,Z2])];hold(SRCT[i]-.15,i<2?SRCT[i+1]-.15:tInc+.1,fitF([T[0]],[.2,.1,-1],34,{slack:1.3}),fitF([T[0]],[.12,.1,-1],34,{slack:1.18}),'ramp');});
hold(tInc+.1,tInc+.6,fitF(S2W,[0,.12,-1],48),null,'ramp');
const S3W=[MBX(X3+.35,Z3),MBX(X3+1.05,Z3+.1),CK.box([X3+.1,1.9,Z3],[X3+1.3,2.85,Z3])];
fly(tInc+.6,tFam-.2,fitF(S3W,[0,.1,-1],42));hold(tFam-.2,tAck,fitF(S3W,[.04,.1,-1],42,{slack:.92}));
hold(tAck,tRent-.5,fitF([MBX(X3+.35,Z3),CK.box([X3-2.75,0,Z3],[X3-.9,2.7,Z3+.3])],[-.08,.1,-1],46),fitF([MBX(X3+.35,Z3),MBX(X3-1.6,Z3+.15),CK.box([X3-2.75,2.0,Z3],[X3-.9,2.7,Z3])],[-.1,.1,-1],46,{slack:.95}),'smooth');
const S4W=[MBX(X4-1.75,Z4-.3),CK.box([X4-1.2,.7,Z4-.3],[X4+2.4,2.0,Z4+.7])];
fly(tRent-.5,tRent+.25,fitF(S4W,[0,.14,-1],48));hold(tRent+.25,tStop-.2,fitF([CK.box([X4-1.15,.75,Z4-.2],[X4-.55,1.5,Z4+.2]),MBX(X4-1.75,Z4-.3)],[-.05,.15,-1],36),null,'ramp');
hold(tStop-.2,tPlus-.1,fitF([CK.box([X4+.1,.7,Z4-.2],[X4+1.3,1.1,Z4+.3]),MBX(X4+2.2,Z4+.1),CK.box([X4+1.7,2.0,Z4],[X4+2.6,2.75,Z4])],[.05,.12,-1],42),null,'smooth');
hold(tPlus-.1,tWealthy-.45,fitF([CK.box([X4-.1,.7,Z4-.2],[X4+1.3,2.0,Z4+.3])],[0,.25,-1],38),fitF([CK.box([X4-.1,.7,Z4-.2],[X4+1.3,2.0,Z4+.3]),MBX(X4-1.75,Z4-.3)],[0,.2,-1],42),'smooth');
const S5W=[CK.box([X5-2.6,0,Z5-.2],[X5+2.1,2.75,Z5+.5])];
fly(tWealthy-.45,tWealthy+.3,fitF(S5W,[0,.12,-1],46));hold(tWealthy+.3,tExpect,fitF(S5W,[.05,.12,-1],46,{slack:.93}),null,'ramp');
hold(tExpect,tNo3-.2,fitF([CK.box([X5+.05,0,Z5],[X5+2.1,2.7,Z5])],[.05,.1,-1],40),null,'smooth');hold(tNo3-.2,tCareful-.2,fitF([CK.box([X5-2.6,1.0,Z5-.3],[X5-.95,3.0,Z5])],[-.05,.05,-1],38),null,'ramp');
const S6W=[CK.box([GX-5,0,23.6],[GX+5,9.3,23.6]),CK.box([GX-3,0,17.1],[GX+3,4.5,20.6])];
fly(tCareful-.2,tCareful+.7,fitF(S6W,[0,.22,-1],52),'rampIn');hold(tCareful+.7,tCant-.1,fitF(S6W,[.03,.2,-1],52,{slack:.95}));
hold(tCant-.1,tCong-.15,fitF([ELSB,LECT],[0,.05,-1],36),null,'ramp');
hold(tCong-.15,tSoNo-.6,fitF([CK.box([GX-4,3.8,22.4],[GX+4,9.3,23.6]),ELSB],[0,.12,-1],50),null,'ramp');
const S7W=[CK.box([MX-.4,.85,MZ-.3],[MX+.4,1.9,MZ+.3]),CK.box([MX-.9,2.0,MZ-.2],[MX+.9,2.45,MZ-.2])];
fly(tSoNo-.6,tSoNo+.1,fitF([MBX(MX,MZ)],[0,.08,-1],34));hold(tSoNo+.1,tImpact,fitF([MBX(MX,MZ),CK.box([MX-1.1,2.1,MZ-.1],[MX+.4,2.45,MZ-.1])],[0,.08,-1],38),null,'smooth');
hold(tImpact,tThink-.3,fitF(S7W,[.05,.08,-1],42),fitF(S7W,[-.05,.08,-1],42,{slack:.95}),'smooth');
hold(tThink-.3,tTrump-.4,()=>CK.closeUp(MIKE,{ry:HH,at:[MX,0,MZ],dist:.95,fov:30,dy:-.12}),()=>CK.closeUp(MIKE,{ry:HH,at:[MX,0,MZ],dist:.82,fov:30,dy:-.1}),'smooth');
hold(tTrump-.4,tEnd,fitF([CK.box([MX-1.35,.9,MZ-.2],[MX+.35,2.45,MZ+.3])],[0,.06,-1],36),fitF([CK.box([MX-1.35,.9,MZ-.2],[MX+.35,2.45,MZ+.3])],[0,.06,-1],36,{slack:.95}),'ramp');
window.CAM13_END=99;
if(Q.get('scout')){const x=Number(Q.get('scout'));window.CAM13=()=>({pos:[x,2.4,8.5],look:[x,1.6,16],fov:62});}
CK.boom(tDed,.4);CK.boom(tPaid,.5);CK.boom(tHigher,.5);CK.boom(tBan,.4);CK.boom(tExpect+.2,.5);CK.boom(tCong,.8);CK.boom(tLess,.4);CK.boom(tTrump,.6);
window.SHOTS13=()=>SH13.map(s=>[s.t0.toFixed(2),s.t1.toFixed(2)]);
}
