// ================= EP11 STORY (after the hook): one Mike, a new place + action on every line, one continuous camera =================
// S1 fine print (bank front) / S2-S4 bank counter: loan, the bank owns it, IOU11 / S5 FDIC shield / S6 vault slams / S7-S10 cash: taco truck -> butcher, no fees
// S11 card tap: the $100 passes 3 booths in the sky / S12 the cut ($1.57, credit $2-$3) / S13 hidden in the menu price, cash buyer pays too
// S14 $187 billion pile + $500 million a day / S15 $100 around town, 10 stops -> $85.37 / S16 cash still $100 / S17 who gets paid? / S18 CTA CASH or CARD
MK.g.visible=false;
const W11=(w,n=0)=>Wd(w,n);
const ST={dep:W11('deposited'),fine:W11('fine'),am:W11('america'),loan:W11('loan'),owns:W11('owns'),owes:W11('owes'),fdic:W11('fdic'),k250:W11('$250,000'),prot:W11('protected'),those:W11('those'),notY:W11('not'),cashW:W11('cash',1),pays:W11('pays'),gets:W11('gets'),pays2:W11('pays',1),gets2:W11('gets',1),nobody:W11('nobody'),taps:W11('taps'),arrives:W11('arrives'),banks:W11('banks'),cut:W11('cut'),avg:W11('average'),c157:W11('$157'),credit:W11('credit'),c2:W11('$2'),never:W11('never'),hide:W11('hide'),prices:W11('prices'),even:W11('even'),too:W11('too'),y2024:W11('2024'),b187:W11('$187'),m500:W11('$500'),day:W11('day'),follow:W11('follow'),ten:W11('ten'),every:W11('every',1),end:W11('end'),k85:W11('$85'),still:W11('still',1),next:W11('next'),who:W11("who's"),paid2:W11('paid',1),cta:W11('cash',5),cCash:W11('cash',6),cCard:W11('card',5)};
const PS=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const PT=(s,size,col,x,y,z,t0,t1)=>popT(s,size,col,V3(x,y,z),t0,t1);
const wood11=pbr('oak_wood_planks',1,1,0xa07a52);
function plate(w,h,pw,ph,draw,basic=true){const t=tex(pw,ph,draw);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),basic?new THREE.MeshBasicMaterial({map:t,toneMapped:false,side:THREE.DoubleSide,transparent:true}):new THREE.MeshStandardMaterial({map:t,roughness:.7,side:THREE.DoubleSide,transparent:true}));scene.add(m);return m;}
const facing=(m,x,y,z)=>{m.position.set(x,y,z);m.rotation.set(0,Math.PI,0);return m;};   // planes face the camera (-z)
const RC={};function reach(key,P,sd,tgt){if(!RC[key]){relax(P);P.g.updateMatrixWorld(true);RC[key]=solveReach(P,sd,tgt);relax(P);}return RC[key];}
const wrist=(P,sd)=>{P.g.updateMatrixWorld(true);const w=V3();P.BN['wrist'+sd].getWorldPosition(w);return w;};
// ---- money props ----
const B100T=tex(512,218,x=>{x.drawImage(NOTE.image,0,0,512,218);x.fillStyle='#2f5a3c';x.font='800 54px Mont';x.textAlign='center';for(const [a,b] of[[60,64],[452,64],[60,200],[452,200]])x.fillText('100',a,b);x.fillStyle='rgba(60,90,70,.55)';x.beginPath();x.ellipse(256,109,62,78,0,0,7);x.fill();});
const billMat=new THREE.MeshStandardMaterial({map:B100T,roughness:.8,side:THREE.DoubleSide,emissive:0x2a8a3a,emissiveIntensity:.35});
function bill(sc=1){const m=new THREE.Mesh(new THREE.PlaneGeometry(.156*sc,.066*sc),billMat);scene.add(m);m.visible=false;return m;}
const HBILL=bill(1.6);   // the $100 in hands (slightly enlarged so it reads)
const CARDT=tex(344,216,x=>{const g=x.createLinearGradient(0,0,344,216);g.addColorStop(0,'#1d3f9a');g.addColorStop(1,'#3a7be0');x.fillStyle=g;x.fillRect(0,0,344,216);x.fillStyle='#d4af37';x.fillRect(32,70,54,40);x.fillStyle='#fff';x.font='800 26px Mont';x.fillText('4000 1234 5678 9010',30,160);x.font='800 22px Mont';x.fillText('MIKE',30,195);});
const CARD=new THREE.Mesh(new THREE.PlaneGeometry(.086*1.6,.054*1.6),new THREE.MeshStandardMaterial({map:CARDT,roughness:.4,side:THREE.DoubleSide,emissive:0x2050c0,emissiveIntensity:.3}));scene.add(CARD);CARD.visible=false;
// ================= S1 the fine print (Mike at the bank front) =================
const PAPER=plate(.34,.44,408,528,x=>{x.fillStyle='#fbfaf4';x.fillRect(0,0,408,528);x.strokeStyle='#14335f';x.lineWidth=8;x.strokeRect(6,6,396,516);x.fillStyle='#14335f';x.textAlign='center';x.font='800 34px Mont';x.fillText('ACCOUNT',204,62);x.fillText('AGREEMENT',204,100);
 for(let i=0;i<7;i++){x.fillStyle='#cfcfc6';x.fillRect(36,140+i*30,336,12);}x.fillStyle='#ffe066';x.fillRect(22,368,364,104);x.fillStyle='#111';x.font='800 25px Mont';x.fillText('YOUR DEPOSIT IS A',204,402);x.fillText('LOAN TO THE BANK.',204,432);x.fillText('THE BANK OWES YOU.',204,462);},false);PAPER.visible=false;
const MAG=new THREE.Group();scene.add(MAG);{const bk=M(0x1b1b1b,.4,.3);add(new THREE.TorusGeometry(.07,.011,12,32),bk,0,0,0,MAG);add(new THREE.CircleGeometry(.066,32),new THREE.MeshPhysicalMaterial({color:0xddeeff,roughness:.02,transmission:.6,transparent:true,opacity:.3}),0,0,0,MAG,false);add(CY(.011,.013,.13,12),bk,0,-.135,0,MAG);}MAG.visible=false;
// ================= S2-S6 the bank counter, teller, vault (x -12) =================
const CTX=-12,CTZ=16.0;
add(B(2.6,1.05,.8),M(0x5b3b24,.5),CTX,.525,CTZ);add(B(2.7,.06,.9),M(0xe8e1d2,.35),CTX,1.08,CTZ);
{const p=plate(1.2,.32,600,160,x=>{x.fillStyle='#14335f';x.fillRect(0,0,600,160);x.strokeStyle='#d4af37';x.lineWidth=10;x.strokeRect(6,6,588,148);x.fillStyle='#fff';x.font='800 96px Mont';x.textAlign='center';x.fillText('BANK',300,118);});facing(p,CTX,.72,CTZ-.41);}
add(B(5.4,3.2,.25),M(0xd9d4c8,.7),CTX+.6,1.6,18.1);   // back wall of the lobby
const VX=CTX+1.55,VZ=17.95;add(new THREE.CircleGeometry(.98,48),M(0x0e0e10,.9),VX,1.35,VZ-.13,scene,false).rotation.y=Math.PI;add(new THREE.TorusGeometry(1.0,.07,12,48),M(0x9aa0a8,.3,.9),VX,1.35,VZ-.14).rotation.y=Math.PI;
const VSH=add(B(1.7,.05,.6),M(0x8a9098,.4,.8),VX,.9,VZ-.45);   // shelf in the vault
{const tu=add(new THREE.CylinderGeometry(1.03,1.03,.9,48,1,true),M(0x8a9098,.35,.85,{side:THREE.DoubleSide}),VX,1.35,VZ-.55);tu.rotation.x=Math.PI/2;}   // thick vault doorway
const VDOOR=new THREE.Group();VDOOR.position.set(VX+1.02,1.35,VZ-1.12);scene.add(VDOOR);{const st=M(0xb4bac2,.28,.95);const d=add(CY(.97,.97,.22,48),st,-1.02,0,0,VDOOR);d.rotation.x=Math.PI/2;
 for(let i=0;i<3;i++){const s=add(B(.9,.05,.05),M(0xd4af37,.3,1),-1.02,0,-.16,VDOOR);s.rotation.z=i*Math.PI/3;}add(CY(.1,.1,.1,24),M(0xd4af37,.3,1),-1.02,0,-.16,VDOOR).rotation.x=Math.PI/2;}
const TELLER=person('teller',CTX+.25,0,CTZ+.55,Math.PI);
const CLAY=[];for(let i=0;i<5;i++)CLAY.push(layer());   // Mike's $50,000 again (5 layers)
const IOU11=plate(.3,.2,450,300,x=>{x.fillStyle='#fffdf2';x.fillRect(0,0,450,300);x.strokeStyle='#14335f';x.lineWidth=10;x.strokeRect(6,6,438,288);x.fillStyle='#14335f';x.textAlign='center';x.font='800 92px Mont';x.fillText('IOU',225,110);x.fillStyle='#1a7a3a';x.font='800 76px Mont';x.fillText('$50,000',225,200);x.fillStyle='#14335f';x.font='800 26px Mont';x.fillText('FIRST NATIONAL BANK',225,262);},false);IOU11.visible=false;
const FDIC=plate(1.3,1.5,520,600,x=>{x.clearRect(0,0,520,600);const g=x.createLinearGradient(0,0,0,600);g.addColorStop(0,'#2f7de8');g.addColorStop(1,'#123c8c');x.fillStyle=g;x.beginPath();x.moveTo(40,40);x.lineTo(480,40);x.lineTo(480,300);x.quadraticCurveTo(480,500,260,580);x.quadraticCurveTo(40,500,40,300);x.closePath();x.fill();
 x.strokeStyle='#ffffff';x.lineWidth=16;x.stroke();x.fillStyle='#fff';x.textAlign='center';x.font='800 150px Mont';x.fillText('FDIC',260,290);x.font='800 62px Mont';x.fillText('INSURED',260,390);});FDIC.visible=false;
PT('LOAN',.2,YEL,CTX-.35,1.75,CTZ-.3,ST.loan-.08,ST.owns-.1);
PT("BANK'S",.18,RED,VX-.25,2.05,VZ-.9,ST.owns-.06,ST.owes-.15);
PT('$250,000',.22,GRN,CTX-.85,3.25,CTZ-.4,ST.k250-.05,ST.those-.15);
PT('NOT YOURS',.17,RED,VX-.1,2.7,VZ-.9,ST.notY-.08,ST.cashW+.1);
// ================= S7-S13 the taco truck (x 3) + butcher stall (x 9) =================
const TX=3,TZ=17.2,TB=new THREE.Group();TB.position.set(TX,0,TZ);scene.add(TB);
{const body=M(0xf3f1ea,.45),red=M(0xd6342c,.5),dk=M(0x1c1c1e,.5);const L=4.4,D=2.1,y0=.55,y1=2.95,wx0=-1.15,wx1=.75,wy0=1.25,wy1=2.45,fz=-D/2;
 add(B(L,.06,D),body,0,y0,0,TB);add(B(L,.08,D),body,0,y1,0,TB);add(B(L,y1-y0,.06),body,0,(y0+y1)/2,D/2,TB);for(const s of[-1,1])add(B(.06,y1-y0,D),body,s*L/2,(y0+y1)/2,0,TB);   // hollow body (floor, roof, back, ends)
 add(B(L,wy0-y0,.06),body,0,(y0+wy0)/2,fz,TB);add(B(L,y1-wy1,.06),body,0,(wy1+y1)/2,fz,TB);add(B(L/2+wx0,wy1-wy0,.06),body,(-L/2+wx0)/2,(wy0+wy1)/2,fz,TB);add(B(L/2-wx1,wy1-wy0,.06),body,(wx1+L/2)/2,(wy0+wy1)/2,fz,TB);
 add(B(L+.02,.28,D+.02),red,0,.75,0,TB);add(B(1.5,1.55,D-.2),M(0xf3f1ea,.45),-L/2-.72,1.3,0,TB);add(B(.05,.7,D-.5),M(0x2a3c50,.08,.3,{envMapIntensity:1.8}),-L/2-1.46,1.65,0,TB);   // cab + windscreen (screen right)
 for(const [x,z] of[[-1.4,-1],[1.4,-1],[-2.7,-1],[-1.4,1],[1.4,1],[-2.7,1]]){const w=add(CY(.42,.42,.28,24),dk,x,.42,z*.95,TB);w.rotation.x=Math.PI/2;}
 add(B(wx1-wx0+.3,.05,.45),M(0xc9c9c9,.3,.8),(wx0+wx1)/2,wy0,fz-.22,TB);   // serving shelf
 const aw=add(B(wx1-wx0+.5,.05,.9),red,(wx0+wx1)/2,wy1+.25,fz-.38,TB);aw.rotation.x=-.35;
 add(B(L-.3,.9,.4),M(0x8a8178,.6),0,1.0,.75,TB);add(B(L-.3,.05,.5),M(0xbfc4c8,.3,.7),0,1.47,.75,TB);const il=new THREE.PointLight(0xfff0d0,1.6,3,1.5);il.position.set(TX,2.5,TZ);scene.add(il);}   // kitchen counter + warm light inside
{const s=plate(2.6,.62,1040,248,x=>{x.fillStyle='#d6342c';x.fillRect(0,0,1040,248);x.strokeStyle='#ffc61a';x.lineWidth=14;x.strokeRect(8,8,1024,232);x.fillStyle='#fff';x.font='800 170px Mont';x.textAlign='center';x.fillText('TACOS',520,185);});facing(s,TX-.2,3.35,TZ-1.08);}
let MENUK=-1;const MENU=plate(.95,1.05,380,420,x=>{});MENU.material.transparent=false;facing(MENU,TX+1.55,1.85,TZ-1.09);
function drawMenu(k){if(Math.abs(k-MENUK)<.01)return;MENUK=k;const c=MENU.material.map.image,x=c.getContext('2d');x.fillStyle='#1d1d1f';x.fillRect(0,0,380,420);x.strokeStyle='#ffc61a';x.lineWidth=10;x.strokeRect(5,5,370,410);x.fillStyle='#ffc61a';x.textAlign='center';x.font='800 58px Mont';x.fillText('MENU',190,70);
 x.fillStyle='#fff';x.font='800 50px Mont';x.textAlign='left';x.fillText('TACO',26,160);x.fillText('BURRITO',26,250);x.textAlign='right';x.fillText('$3.00',354,160);x.fillText('$9.00',354,250);
 if(k>0){x.fillStyle=`rgba(255,40,40,${.85*k})`;x.fillRect(300,118,54,52);x.fillRect(306,208,48,52);x.fillStyle=`rgba(255,255,255,${k})`;x.font='800 22px Mont';x.textAlign='center';x.fillText('FEES',327,300);x.fillText('INSIDE',327,326);}MENU.material.map.needsUpdate=true;}
drawMenu(0);
const TERM=new THREE.Group();scene.add(TERM);TERM.position.set(TX-.75,1.3,TZ-1.25);{add(B(.1,.16,.05),M(0x222226,.4),0,.08,0,TERM);const sc=add(new THREE.PlaneGeometry(.075,.06),new THREE.MeshBasicMaterial({color:0x6fe0ff,toneMapped:false}),0,.11,-.026,TERM,false);sc.rotation.y=Math.PI;TERM.userData.sc=sc;}
const VENDOR=person('printer',TX-.3,.55,TZ-.45,Math.PI);
const BUX=7.6,BUZ=16.9;{add(B(2.3,.95,.8),M(0xe9e4d8,.5),BUX,.475,BUZ);add(B(2.4,.05,.9),M(0xbfc4c8,.3,.7),BUX,.97,BUZ);for(const s of[-1,1])add(CY(.04,.04,2.5,10),M(0x777777,.3,.8),BUX+s*1.15,1.25,BUZ-.4);
 const aw=plate(2.5,.5,500,100,x=>{for(let i=0;i<10;i++){x.fillStyle=i%2?'#ffffff':'#c8202a';x.fillRect(i*50,0,50,100);}},false);facing(aw,BUX,2.45,BUZ-.45);
 const s=plate(1.7,.42,680,168,x=>{x.fillStyle='#7a1414';x.fillRect(0,0,680,168);x.strokeStyle='#fff';x.lineWidth=8;x.strokeRect(6,6,668,156);x.fillStyle='#fff';x.font='800 112px Mont';x.textAlign='center';x.fillText('BUTCHER',340,124);});facing(s,BUX,2.95,BUZ-.45);
 for(let i=0;i<4;i++){const m=add(new THREE.SphereGeometry(.12,16,10),M(0xb5332e,.6),BUX-.6+i*.4,1.12,BUZ-.1);m.scale.set(1.4,.55,1);}add(B(2.6,2.6,.2),M(0xd9d4c8,.7),BUX,1.3,BUZ+.9);}
const BUTCHER=person('guard',BUX,0,BUZ+.45,Math.PI);
const FLYB=bill(2.2);   // the bill that travels truck -> butcher
const NOFEE=PT('NO FEES',.28,GRN,(TX+BUX)/2+.4,2.75,16.0,ST.nobody-.05,ST.taps-.2);
PT('$100',.14,GRN,TX+.3,2.25,15.2,ST.pays+.45,ST.gets-.2);
PT('+$100',.2,GRN,TX-.25,3.85,TZ-1.2,ST.gets-.06,ST.pays2-.1);
PT('+$100',.2,GRN,BUX,3.5,BUZ-.6,ST.gets2-.06,ST.nobody+.05);
// S11 three booths in the sky over the truck: the tap's path
const BOOTHS=[['YOUR BANK','#14335f',TX+1.75,4.5],['CARD NETWORK','#5a2a8a',TX-.1,5.3],["TRUCK'S BANK",'#0f6a73',TX-1.95,4.5]].map(([lab,col,x,y])=>{const g=new THREE.Group();g.position.set(x,y,TZ-1.6);scene.add(g);add(RB(1.25,.7,.5,.06),M(0xf2efe8,.5),0,0,0,g);
 const s=plate(1.35,.34,540,136,c=>{c.fillStyle=col;c.fillRect(0,0,540,136);c.fillStyle='#fff';c.font=`800 ${lab.length>10?60:72}px Mont`;c.textAlign='center';c.fillText(lab,270,92);});s.position.set(0,.1,-.27);s.rotation.y=Math.PI;scene.remove(s);g.add(s);g.scale.setScalar(1.35);g.visible=false;return g;});
const PATHB=bill(3.2);const CHIPS=[];for(let i=0;i<9;i++){const m=add(CY(.05,.05,.012,20),M(0xff3030,.4,.2,{emissive:0xff2020,emissiveIntensity:1.2}),0,0,0);m.rotation.x=Math.PI/2;m.visible=false;CHIPS.push(m);}
// S12 the big bill with a slice cut off
const BIGB=new THREE.Group();BIGB.position.set(TX,2.2,TZ-3.0);scene.add(BIGB);const BIGM=new THREE.Mesh(new THREE.PlaneGeometry(1.56,.66),billMat);BIGM.rotation.y=Math.PI;BIGB.add(BIGM);
const SLICE=new THREE.Mesh(new THREE.PlaneGeometry(.06,.66),new THREE.MeshBasicMaterial({color:0xff2a2a,toneMapped:false,side:THREE.DoubleSide}));SLICE.rotation.y=Math.PI;BIGB.add(SLICE);BIGB.visible=false;
const BIGCARD=new THREE.Mesh(new THREE.PlaneGeometry(.55,.35),CARD.material);BIGCARD.rotation.y=Math.PI;scene.add(BIGCARD);BIGCARD.visible=false;
PT('$1.57',.22,RED,TX,1.62,TZ-3.1,ST.c157-.05,ST.credit-.1);
PT('$2-$3',.22,RED,TX,1.62,TZ-3.1,ST.c2-.08,ST.never-.15);
const CUST=person('manager',TX-.35,0,TZ-1.65,0);   // a customer who pays cash
const CBILL=bill(1.6);
// ================= S14 $187 billion in 2024 (lawn x 40) =================
const PX14=40,PZ14=18.5;const BRT=tex(624,264,x=>{for(let r=0;r<4;r++)for(let c=0;c<4;c++){x.drawImage(NOTE.image,c*156+1,r*66+1,154,64);x.fillStyle='#2c63c9';x.fillRect(c*156+66,r*66+1,24,64);}});const BRS=tex(256,64,x=>{x.fillStyle='#dfe3cf';x.fillRect(0,0,256,64);for(let i=0;i<64;i+=3){x.fillStyle='rgba(70,95,70,.25)';x.fillRect(0,i,256,1);}for(let c=0;c<4;c++){x.fillStyle='#2c63c9';x.fillRect(c*64+27,0,10,64);}});
const BRM=[new THREE.MeshStandardMaterial({map:BRS,roughness:.9,emissive:0x2a8a3a,emissiveIntensity:.15}),new THREE.MeshStandardMaterial({map:BRT,roughness:.85,emissive:0x2a8a3a,emissiveIntensity:.2})];
const SL=new THREE.InstancedMesh(new THREE.BoxGeometry(.62,.26,.62),BRM[1],900);scene.add(SL);
{const m=new THREE.Matrix4();let n=0;for(let iy=0;iy<15;iy++)for(let ix=0;ix<8;ix++)for(let iz=0;iz<5;iz++){m.makeTranslation(PX14-2.38+ix*.68,.13+iy*.27,PZ14-1.9+iz*.68);SL.setMatrixAt(n++,m);}SL.count=n;SL.userData.n=n;}
SL.visible=false;
PT('$187 BILLION',.42,RED,PX14,5.0,PZ14-2.4,ST.b187-.05,ST.m500-.25);
PT('IN 2024',.2,WHT,PX14,4.5,PZ14-2.4,ST.y2024-.05,ST.m500-.25);
const CAL=plate(1.5,1.7,450,510,x=>{x.fillStyle='#fff';x.fillRect(0,0,450,510);x.fillStyle='#d21e2a';x.fillRect(0,0,450,120);x.fillStyle='#fff';x.textAlign='center';x.font='800 70px Mont';x.fillText('1 DAY',225,88);x.fillStyle='#222';x.font='800 210px Mont';x.fillText('24h',225,370);x.strokeStyle='#999';x.lineWidth=6;x.strokeRect(3,3,444,504);},false);facing(CAL,PX14+2.3,2.2,PZ14-2.7);CAL.visible=false;
PT('$500 MILLION',.2,RED,PX14+.9,4.1,PZ14-2.9,ST.m500-.05,ST.follow-.2);
// ================= S15-S16 $100 around town: 10 stops on Maple St (aerial) =================
const STOPS=[];for(let i=0;i<10;i++){const x=-18+i*4,g=new THREE.Group();g.position.set(x,0,11);scene.add(g);add(CY(.06,.06,1.6,10),M(0xdddddd,.4,.6),0,.8,0,g);
 const pin=add(new THREE.SphereGeometry(.42,24,16),M(0xff3b30,.4,0,{emissive:0xff2a20,emissiveIntensity:.5}),0,1.9,0,g);
 const n=plate(.6,.6,128,128,c=>{c.fillStyle='#fff';c.font='800 96px Mont';c.textAlign='center';c.fillText(String(i+1),64,98);});n.position.set(0,1.9,-.44);n.rotation.y=Math.PI;scene.remove(n);g.add(n);g.visible=false;STOPS.push(g);}
const TOWNB=new THREE.Mesh(new THREE.PlaneGeometry(1.56*1.4,.66*1.4),billMat);scene.add(TOWNB);TOWNB.visible=false;
const CNT=plate(2.6,.8,640,200,x=>{});const drawCnt=(v,col)=>{const c=CNT.material.map.image,x=c.getContext('2d');x.clearRect(0,0,640,200);x.fillStyle=col;x.font='800 150px Mont';x.textAlign='center';x.strokeStyle='#000';x.lineWidth=12;x.strokeText(v,320,155);x.fillText(v,320,155);CNT.material.map.needsUpdate=true;};CNT.visible=false;let CNTV='';
const CASHB=new THREE.Mesh(new THREE.PlaneGeometry(1.56*1.4,.66*1.4),billMat);scene.add(CASHB);CASHB.visible=false;
const CNT2=plate(2.6,.8,640,200,x=>{x.fillStyle='#22e06a';x.font='800 150px Mont';x.textAlign='center';x.strokeStyle='#000';x.lineWidth=12;x.strokeText('$100',320,155);x.fillText('$100',320,155);});CNT2.visible=false;
const TAG=n=>plate(.62,.18,520,144,x=>{x.fillStyle=n?'#1d3f9a':'#1a7a3a';x.fillRect(0,0,520,144);x.fillStyle='#fff';x.font='800 92px Mont';x.textAlign='center';x.fillText(n?'CARD':'CASH',260,108);});
const TCARD=TAG(1),TCASH=TAG(0);TCARD.visible=TCASH.visible=false;
// ================= S17-S18 Mike on the sidewalk: who gets paid? CTA =================
const EX=24,EZ=12.3;
const QM=PT('?',.36,YEL,EX,2.1,EZ-.1,ST.who-.05,ST.cta-.15);
// ---- per-scene camera keys (camera looks +z unless noted; SCREEN RIGHT = -x) ----
KEYS.splice(KEYS.length-1,1,
 [ST.dep-.15,[MBX-.75,1.62,MBZ+1.15],[MBX,1.4,MBZ],40],[ST.fine-.2,[MBX-.45,1.5,MBZ+1.7],[MBX+.05,1.3,MBZ+.4],36],[ST.fine+.25,[MBX-.15,1.35,MBZ+1.35],[MBX+.05,1.25,MBZ+.42],30],[ST.am-.1,[MBX-.14,1.34,MBZ+1.3],[MBX+.05,1.25,MBZ+.42],30],   // S1 paper close-up
 [ST.am+.45,[CTX-.2,1.95,CTZ-4.6],[CTX,1.3,CTZ+.5],52],[ST.loan+.3,[CTX-.2,1.85,CTZ-4.2],[CTX,1.3,CTZ+.5],50],                       // S2 counter wide: loan
 [ST.owns+.15,[CTX+.6,1.85,CTZ-3.6],[CTX+.9,1.25,CTZ+1.2],50],[ST.owes-.1,[CTX+.5,1.8,CTZ-3.4],[CTX+.9,1.2,CTZ+1.2],50],                // S3 the money goes in the vault
 [ST.owes+.25,[CTX-.55,1.5,CTZ-2.6],[CTX-.6,1.3,CTZ-.4],40],[ST.fdic-.3,[CTX-.57,1.48,CTZ-2.45],[CTX-.6,1.3,CTZ-.4],38],          // S4 IOU11 close-up
 [ST.fdic+.1,[CTX-.85,2.1,CTZ-5.6],[CTX-.85,2.05,CTZ-.4],54],[ST.prot+.1,[CTX-.85,2.05,CTZ-5.2],[CTX-.85,2.0,CTZ-.4],52],             // S5 FDIC shield + $250,000
 [ST.those+.05,[VX-.4,1.75,VZ-5.8],[VX-.4,1.6,VZ],50],[ST.cashW-.15,[VX-.4,1.72,VZ-5.4],[VX-.4,1.6,VZ],50],                    // S6 the vault slams: NOT YOURS
 [ST.cashW+.35,[TX+.6,2.0,TZ-6.6],[TX+.4,1.65,TZ],52],[ST.pays+.3,[TX+.5,1.85,TZ-5.0],[TX+.2,1.6,TZ],48],                    // S7-S8 cash at the taco truck
 [ST.gets+.1,[TX-.1,2.6,TZ-6.4],[TX-.1,2.5,TZ],52],[ST.pays2-.1,[TX+.1,2.55,TZ-6.2],[TX,2.45,TZ],52],                                // the truck gets $100
 [ST.pays2+.3,[TX+.9,2.2,TZ-6.0],[TX+.9,1.9,TZ],52],[ST.gets2-.1,[BUX,2.1,TZ-5.6],[BUX,1.7,TZ],52],[ST.gets2+.45,[BUX-.2,2.1,TZ-5.4],[BUX-.2,1.7,TZ],52],[ST.nobody+.05,[(TX+BUX)/2+.4,2.4,TZ-8.6],[(TX+BUX)/2+.4,1.9,TZ],56],[ST.taps-.3,[(TX+BUX)/2+.4,2.35,TZ-8.3],[(TX+BUX)/2+.4,1.9,TZ],56],   // S9-S10 the bill flies to the butcher, no fees
 [ST.taps+.15,[TX+.2,1.65,TZ-3.7],[TX-.05,1.35,TZ],46],[ST.arrives-.25,[TX+.2,1.65,TZ-3.55],[TX-.05,1.38,TZ],46],              // S11 Mike taps his card
 [ST.arrives+.2,[TX-.1,3.7,TZ-10.2],[TX-.1,3.6,TZ],58],[ST.cut+.6,[TX-.1,3.65,TZ-9.9],[TX-.1,3.55,TZ],58],                            //    the path through 3 booths
 [ST.avg-.05,[TX,2.45,TZ-6.9],[TX,2.35,TZ],50],[ST.never-.3,[TX,2.42,TZ-6.6],[TX,2.33,TZ],50],                // S12 the slice: $1.57, credit $2-$3
 [ST.never+.1,[TX+1.4,1.85,TZ-3.4],[TX+1.4,1.75,TZ],46],[ST.hide+.2,[TX+1.55,1.85,TZ-3.3],[TX+1.55,1.85,TZ],42],                // S13 the menu: fees inside the prices
 [ST.even-.1,[TX+.1,1.8,TZ-5.0],[TX,1.5,TZ],50],[ST.too+.15,[TX+.8,1.85,TZ-4.4],[TX+.9,1.65,TZ],48],                    //    a cash customer pays it too
 [ST.y2024+.15,[PX14+.3,3.0,PZ14-14.5],[PX14+.3,2.8,PZ14],52],[ST.m500-.3,[PX14+.3,2.95,PZ14-13.8],[PX14+.3,2.8,PZ14],52],     // S14 $187 billion
 [ST.m500+.15,[PX14+1.3,2.9,PZ14-10.0],[PX14+1.3,2.9,PZ14],50],[ST.follow-.25,[PX14+1.3,2.9,PZ14-9.6],[PX14+1.3,2.9,PZ14],50],     //    $500 million a day
 [ST.follow+.2,[-18,9,1.5],[-18,1.6,11],50],[ST.ten,[-17,9,2.0],[-17,1.6,11],50]);
for(let i=0;i<19;i++){const t0=ST.ten+.3+.2+i*.215,x=-18+i*2;KEYS.push([t0,[x,9,2.0],[x,1.6,11],50]);}   // S15 a smooth follow of the bill (keys 2 m apart: no hold/jerk)
KEYS.push([ST.still-.3,[16.8,5.0,2.6],[16.8,2.9,11],48],[ST.next-.2,[16.8,4.9,2.9],[16.8,2.9,11],48],                               // S16 $85 by card vs $100 cash
 [ST.next+.2,[EX-.1,1.7,EZ-3.6],[EX,1.45,EZ],50],[ST.cta-.15,[EX-.1,1.7,EZ-3.4],[EX,1.5,EZ],50],                                  // S17 who's really getting paid?
 [ST.cta+.2,[EX,1.6,EZ-3.4],[EX,1.5,EZ],52],[64.9,[EX,1.58,EZ-3.1],[EX,1.5,EZ],52]);                                          // S18 CTA
// ================= story animation =================
function story11(t){
 const P=MIKE;let R=null,L=null;
 // reset per-frame visibility
 for(const o of[PAPER,MAG,IOU11,FDIC,HBILL,CARD,FLYB,PATHB,BIGB,BIGCARD,CBILL,TOWNB,CNT,CASHB,CNT2,TCARD,TCASH,CAL,SL])o.visible=false;
 CLAY.forEach(m=>m.visible=false);CHIPS.forEach(m=>m.visible=false);BOOTHS.forEach(g=>g.visible=false);STOPS.forEach(g=>g.visible=false);
 TELLER.g.visible=t>ST.am-.5&&t<ST.cashW+.4;VENDOR.g.visible=BUTCHER.g.visible=CUST.g.visible=t>ST.cashW-.3&&t<ST.y2024;
 // ---- S1 Mike reads the fine print (bank front) ----
 if(t<ST.am+.1){P.g.position.set(MBX,0,MBZ);P.g.rotation.y=-.93+.93*0-.0;relax(P);idle(P,t,1.3);P.g.rotation.y=.35;
  const k=sm(ST.dep,ST.dep+.35,t);const pp=V3(MBX+.05,1.25,MBZ+.42);R=reach('s1R',P,'R',pp.clone().add(V3(-.15,-.05,0)));L=reach('s1L',P,'L',V3(MBX+.22,1.32,MBZ+.38));
  setA(P,'R',lerpA(REST,R,k));setA(P,'L',lerpA(REST,L,sm(ST.fine-.4,ST.fine,t)));pose(P,'head',.25*k,0,0);face(P,{jaw:.02,smile:0});
  PAPER.visible=k>.05;PAPER.position.copy(pp);PAPER.lookAt(cam.position);PAPER.scale.setScalar(Math.max(.01,k));
  MAG.visible=t>ST.fine-.4;MAG.position.copy(wrist(P,'L')).add(V3(0,.14,.02));MAG.lookAt(cam.position);return;}
 // ---- S2-S6 at the counter ----
 if(t<ST.cashW+.2){const mx=CTX-.85,mz=CTZ-.78;P.g.position.set(mx,0,mz);relax(P);idle(P,t,1.3);
  const front=sm(ST.fdic-.2,ST.fdic+.25,t)*(1-sm(ST.those-.2,ST.those+.1,t));P.g.rotation.y=.45+(Math.PI-.45-.25)*front;
  // money: on the counter (pushed to the teller on 'loan'), then into the vault on 'owns'
  const push=sm(ST.loan-.3,ST.loan+.3,t),inV=sm(ST.owns-.05,ST.owns+.55,t);
  CLAY.forEach((m,i)=>{m.visible=true;const a=V3(CTX-.45,1.115+i*.0115,CTZ-.12),b=V3(CTX+.25,1.115+i*.0115,CTZ+.05),c=V3(VX,.93+i*.0115,VZ-.45);m.position.lerpVectors(a,b,push);if(inV>0){m.position.lerpVectors(b,c,inV);m.position.y+=.5*Math.sin(Math.PI*inV);}m.rotation.set(0,0,0);});
  const shut=sm(ST.notY-.1,ST.notY+.18,t);VDOOR.rotation.y=-(1-shut)*1.75;
  // teller: takes the money, hands the IOU11
  {const Q=TELLER;relax(Q);idle(Q,t,.4);face(Q,{jaw:0,smile:.3});const h=sm(ST.owes-.1,ST.owes+.3,t)*(1-sm(ST.fdic,ST.fdic+.3,t));const ta=reach('telR',Q,'R',V3(CTX-.35,1.3,CTZ-.4));setA(Q,'R',lerpA(REST,ta,h));
   if(h>.05&&t<ST.owes+.4){IOU11.visible=true;IOU11.position.copy(wrist(Q,'R')).add(V3(0,.05,-.08));IOU11.rotation.set(-.2,Math.PI,0);}}
  const tk=sm(ST.owes+.3,ST.owes+.55,t);R=reach('s4R',P,'R',V3(mx+.2,1.3,mz+.38));setA(P,'R',lerpA(REST,R,tk));   // Mike takes the IOU11 and keeps it up
  if(t>=ST.owes+.4){IOU11.visible=true;IOU11.position.copy(wrist(P,'R')).add(V3(0,.1,-.05));IOU11.lookAt(cam.position);}
  if(t>ST.fdic-.1&&t<ST.those){PS(FDIC,pop(t,ST.fdic-.1,.35)*(1-sm(ST.those-.25,ST.those,t)));FDIC.position.set(mx,1.95,mz+.7);FDIC.scale.multiplyScalar(1.25);FDIC.rotation.set(0,Math.PI,0);}
  const sml=front;face(P,{jaw:.02,smile:.25+.5*sml});if(front>.5)pose(P,'head',-.08,0,0);
  if(t>ST.those-.1){const s=sm(ST.notY-.1,ST.notY+.2,t);P.g.rotation.y=.45+1.2*s;face(P,{jaw:.08*s,smile:0});arm(P,'L',AD[0]+.25*s,AD[2]-.25*s,.5*s);}   // turns to the vault, shocked
  return;}
 // ---- S7-S13 taco truck ----
 if(t<ST.y2024-.1){const mx=TX+.75,mz=TZ-2.0;P.g.position.set(mx,0,mz);relax(P);idle(P,t,1.3);P.g.rotation.y=-.35;
  {const Q=VENDOR;relax(Q);idle(Q,t,.7);face(Q,{jaw:0,smile:.35});}
  {const Q=BUTCHER;relax(Q);idle(Q,t,2.1);face(Q,{jaw:0,smile:.3});}
  // cash: Mike shows the bill, hands it over; the truck pays the butcher
  const up=sm(ST.cashW+.1,ST.cashW+.45,t)*(1-sm(ST.pays+.7,ST.pays+1.0,t));R=reach('s8R',P,'R',V3(mx-.25,1.45,mz+.45));setA(P,'R',lerpA(REST,R,up));
  if(t<ST.pays+.9&&up>.05){HBILL.visible=true;const w=wrist(P,'R'),v=V3(TX-.35,1.45,TZ-1.15),k=sm(ST.pays+.2,ST.pays+.85,t);HBILL.position.lerpVectors(w.add(V3(0,.06,0)),v,k);HBILL.lookAt(cam.position);}
  {const k=sm(ST.pays2-.05,ST.pays2+.75,t);if(k>0&&k<1){FLYB.visible=true;FLYB.position.lerpVectors(V3(TX-.35,1.6,TZ-1.2),V3(BUX,1.4,BUZ-.5),k);FLYB.position.y+=1.1*Math.sin(Math.PI*k);FLYB.lookAt(cam.position);FLYB.rotateZ(k*6);}}
  // card: tap, the $100 flies up through the three booths and comes back down to the truck
  const card=sm(ST.taps-.25,ST.taps,t)*(1-sm(ST.arrives+.2,ST.arrives+.5,t));if(card>0){const C=reach('s11R',P,'R',V3(TX-.62,1.48,TZ-1.38));setA(P,'R',lerpA(REST,C,card));CARD.visible=true;CARD.position.copy(wrist(P,'R')).add(V3(0,.05,-.03));CARD.lookAt(cam.position);}
  TERM.userData.sc.material.color.set(t>ST.taps&&t<ST.taps+.5?0x40ff70:0x6fe0ff);
  if(t>ST.arrives-.4&&t<ST.avg){BOOTHS.forEach((g,i)=>PS(g,pop(t,ST.arrives-.4+i*.12,.3)));
   const pts=[V3(TX-.75,1.5,TZ-1.3),...BOOTHS.map(g=>g.position.clone().add(V3(0,-.55,-.1))),V3(TX-.75,1.6,TZ-1.3)];const k=sm(ST.banks-.3,ST.cut+.6,t)*(pts.length-1),i=Math.min(pts.length-2,Math.floor(k)),f=k-i;
   if(k>0&&k<pts.length-1){PATHB.visible=true;PATHB.position.lerpVectors(pts[i],pts[i+1],sm(0,1,f));PATHB.lookAt(cam.position);PATHB.scale.setScalar(1-.04*i);}
   CHIPS.forEach((m,j)=>{const b=Math.floor(j/3);if(b>2)return;const t0=ST.banks-.3+(b+1)*(ST.cut+.9-ST.banks)/4,kk=sm(t0,t0+.5,t);m.visible=kk>0&&kk<1;m.position.copy(BOOTHS[b].position).add(V3((j%3-1)*.15,-.5+.5*kk,-.3));});}   // red coins = each cut
  if(t>ST.avg-.15&&t<ST.never){BIGB.visible=true;PS(BIGB,pop(t,ST.avg-.15,.3));const cut=sm(ST.c157-.1,ST.c157+.2,t),cut2=sm(ST.c2-.15,ST.c2+.15,t);SLICE.scale.x=1+1.1*cut2;SLICE.position.set(.75+.03*1.1*cut2+.1*cut,-.04*cut,-.004);SLICE.visible=cut>0;
   if(t>ST.credit-.15){BIGCARD.visible=true;PS(BIGCARD,pop(t,ST.credit-.15,.3));BIGCARD.position.set(TX+.5,2.75,TZ-3.15);BIGCARD.scale.setScalar(.75*BIGCARD.scale.x);}}
  // menu: the fees are inside the prices
  drawMenu(sm(ST.hide-.1,ST.hide+.3,t));
  {const Q=CUST;relax(Q);idle(Q,t,1.9);Q.g.visible=t>ST.even-.6;const w=sm(ST.even-.6,ST.even,t);Q.g.position.set(TX-.35-1.1*(1-w),0,TZ-1.65);Q.g.rotation.y=.15;if(w<1)walk(Q,t,.35*(1-w));
   const g=sm(ST.even+.2,ST.even+.45,t);const a=reach('custR',Q,'R',V3(TX-.5,1.42,TZ-1.25));setA(Q,'R',lerpA(REST,a,g));if(g>.05){CBILL.visible=true;CBILL.position.copy(wrist(Q,'R')).add(V3(0,.05,0));CBILL.lookAt(cam.position);}}
  face(P,{jaw:.02,smile:.3});if(t>ST.c157-.2&&t<ST.never)pose(P,'head',-.3,0,0);   // Mike looks up at the bill
  return;}
 // ---- S14 the $187 billion pile ----
 if(t<ST.follow){P.g.position.set(PX14+1.4,0,PZ14-5.2);relax(P);idle(P,t,1.3);P.g.rotation.y=.15;pose(P,'head',-.3,0,0);
  SL.visible=true;const n=Math.floor(SL.userData.n*sm(ST.y2024,ST.b187+.6,t));SL.count=Math.max(1,n);
  if(t>ST.m500-.2){CAL.visible=true;PS(CAL,pop(t,ST.m500-.2,.3));}return;}
 // ---- S15-S16 the $100 around town ----
 if(t<ST.next){P.g.position.set(EX,0,EZ);P.g.rotation.y=Math.PI;relax(P);idle(P,t,1.3);
  STOPS.forEach((g,i)=>PS(g,pop(t,ST.follow+.1+i*.06,.3)));
  const hop=(t-(ST.ten+.3))/.43,i=Math.max(0,Math.min(9,Math.floor(hop))),f=Math.max(0,Math.min(1,hop-i)),n=hop<0?0:Math.min(10,i+(f>.5?1:0));
  const x=-18+i*4+(hop>=0&&i<9?4*sm(0,1,f):0),bx=Math.min(x,18);TOWNB.visible=true;TOWNB.position.set(bx,2.9+.5*Math.sin(Math.PI*f)*(hop>0&&hop<9?1:0),11);TOWNB.lookAt(cam.position);
  const v=t>ST.k85-.1?'$85.37':'$'+(100*Math.pow(1-.0157,n)).toFixed(2);if(v!==CNTV){CNTV=v;drawCnt(v,n>0?'#ff2a2a':'#22e06a');}CNT.visible=true;CNT.position.set(bx,3.85,11);CNT.lookAt(cam.position);
  CHIPS.forEach((m,j)=>{const k=hop-j;m.visible=hop>0&&k>0&&k<.8&&j<9;if(m.visible)m.position.set(-18+(j+1)*4,2.6-1.2*k,11);});
  if(t>ST.still-.35){const s=pop(t,ST.still-.35,.3);CASHB.visible=CNT2.visible=true;CASHB.position.set(bx-2.4,2.9,11);CASHB.lookAt(cam.position);CASHB.scale.setScalar(s);CNT2.position.set(bx-2.4,3.85,11);CNT2.lookAt(cam.position);CNT2.scale.setScalar(s);}
  return;}
 // ---- S17-S18 who gets paid? + CTA ----
 {P.g.position.set(EX,0,EZ);P.g.rotation.y=Math.PI;relax(P);idle(P,t,1.3);
  const hold=sm(ST.next,ST.next+.3,t);const Lh=reach('ctaL',P,'L',V3(EX-.36,1.22,EZ-.35)),Rh=reach('ctaR',P,'R',V3(EX+.36,1.22,EZ-.35));
  const lu=hold*(1-.0)+0,ru=hold;setA(P,'L',lerpA(REST,Lh,lu));setA(P,'R',lerpA(REST,Rh,ru));
  const think=sm(ST.who-.2,ST.who+.2,t)*(1-sm(ST.cta-.3,ST.cta,t));pose(P,'head',-.05,.25*think,.12*think);face(P,{jaw:.02,smile:.35*(1-think)});
  CBILL.visible=true;CBILL.position.copy(wrist(P,'R')).add(V3(0,.07,-.04));CBILL.lookAt(cam.position);CARD.visible=true;CARD.position.copy(wrist(P,'L')).add(V3(0,.07,-.04));CARD.lookAt(cam.position);
  const a=pop(t,ST.cta-.05,.3),b=pop(t,ST.cCard-.08,.3);TCASH.visible=a>.01;TCASH.scale.setScalar(Math.max(.01,a));TCASH.position.set(EX+.52,2.05,EZ-.35);TCASH.rotation.set(0,Math.PI,0);
  TCARD.visible=t>W11('card',4)-.05;TCARD.scale.setScalar(Math.max(.01,pop(t,W11('card',4)-.05,.3)));TCARD.position.set(EX-.52,2.05,EZ-.35);TCARD.rotation.set(0,Math.PI,0);
  if(t>ST.cCash-.1&&t<ST.cCard-.1)arm(P,'R',AD[0]+.9,AD[2]-.2,.3);if(t>ST.cCard-.1)arm(P,'L',AD[0]+.9,AD[2]-.2,.3);}   // lifts the one he names
}
