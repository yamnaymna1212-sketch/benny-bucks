// ================= EP10 STORY (after the hook). One Mike, a new place + event on every line, one continuous camera. =================
// Camera looks +z (north) everywhere, so SCREEN RIGHT = -x.
// S1 taxes (x -22) / S2 2016 deal + 10 yearly stacks (-14) / S3 a month (-4.6) / S4 jet + Iron Dome (5) / S5 lump-sum tower (15) / S6 'most people miss' (16.9)
// S7 factory: money in, check, workers, planes + missiles (35) / S8 debt clock + interest + $3B a day (stage 27) / S9 Mike's math board (stage)
// S10 defense vs interest scale (40.3) / S11 the debt as 10,000 squares (stage clock) / S12 CTA AID or DEBT (in front of the stage)
for(const o of[...CHAIN,STK,CHEF.g,P4.g,CANG,JUG,P9.g,SAFE,TAXF,IOU,BILL50,BUB,NOZ,...KIDS.map(k=>k.g)])o.visible=false;   // EP9 story props off
for(const o of scene.children)if(o.isGroup&&Math.abs(o.position.x+13.05)<.01&&Math.abs(o.position.z-15)<.01)o.visible=false;   // EP9 steak sign
POPS.forEach(m=>m.visible=false);POPS.length=0;   // EP9 floating words off (the EP10 ones are created below)
for(const o of scene.children)if(o.isGroup&&Math.abs(o.position.x+7.4)<.01&&Math.abs(o.position.z-15.6)<.01)o.visible=false;   // EP9 pickup at the S3 calendar
const PS=(o,s)=>{o.visible=s>.01;if(o.visible)o.scale.setScalar(Math.max(.001,s));};
const pin=(t,t0,t1=99)=>pop(t,t0,.3)*(1-sm(t1,t1+.25,t));
const PT=(s,size,col,x,y,z,t0,t1)=>popT(s,size,col,V3(x,y,z),t0,t1);
const zbG=(p,x,y,z)=>{const m=new THREE.Mesh(ZBG,[ZBM[0],ZBM[0],ZBM[1],ZBM[0],ZBM[2],ZBM[2]]);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;};
const wood=pbr('oak_wood_planks',1,1,0xa07a52);
function table(x,z,w,d,h=.76){add(B(w,.05,d),wood,x,h,z);for(const sx of[-1,1])for(const sz of[-1,1])add(B(.05,h,.05),wood,x+sx*(w/2-.06),h/2,z+sz*(d/2-.06));}
function canvasPlane(w,h,pw,ph,basic=false){const {c,t}=canvasTex(pw,ph);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),basic?new THREE.MeshBasicMaterial({map:t,toneMapped:false,side:THREE.DoubleSide}):new THREE.MeshStandardMaterial({map:t,roughness:.75,side:THREE.DoubleSide}));scene.add(m);return {m,c,t,x:c.getContext('2d')};}
// ---- a generic grey fighter jet (nose to -x = screen right), ~2.15 m long ----
function jetModel(){const g=new THREE.Group();const paint=M(0x7f8890,.45,.5),dk=M(0x2a2e33,.5,.6);
 const fu=add(CY(.13,.11,1.6,24),paint,0,0,0,g);fu.rotation.z=Math.PI/2;
 const no=add(new THREE.ConeGeometry(.13,.45,24),paint,-1.02,0,0,g);no.rotation.z=Math.PI/2;
 const ex=add(CY(.1,.12,.14,20),dk,.86,0,0,g);ex.rotation.z=Math.PI/2;
 const ws=new THREE.Shape([new THREE.Vector2(-.3,0),new THREE.Vector2(.5,-.95),new THREE.Vector2(.66,-.95),new THREE.Vector2(.62,0),new THREE.Vector2(.66,.95),new THREE.Vector2(.5,.95)]);
 const w=add(new THREE.ExtrudeGeometry(ws,{depth:.03,bevelEnabled:false}),paint,0,-.03,0,g);w.rotation.x=-Math.PI/2;
 const ts=new THREE.Shape([new THREE.Vector2(.42,0),new THREE.Vector2(.8,0),new THREE.Vector2(.86,.46),new THREE.Vector2(.72,.46)]);
 add(new THREE.ExtrudeGeometry(ts,{depth:.026,bevelEnabled:false}),paint,0,.06,-.013,g);
 const hs=new THREE.Shape([new THREE.Vector2(.6,-.36),new THREE.Vector2(.84,-.36),new THREE.Vector2(.84,.36),new THREE.Vector2(.6,.36)]);const h=add(new THREE.ExtrudeGeometry(hs,{depth:.02,bevelEnabled:false}),paint,0,0,0,g);h.rotation.x=-Math.PI/2;
 const cp=add(new THREE.SphereGeometry(.1,24,12),GLASS,-.55,.1,0,g);cp.scale.set(2.3,.85,.9);return g;}
// ---- a missile (axis +y) with a flame ----
function missileModel(col){const g=new THREE.Group();const b=M(col,.4,.3);add(CY(.045,.045,.55,16),b,0,0,0,g);add(new THREE.ConeGeometry(.045,.16,16),b,0,.355,0,g);
 for(let i=0;i<4;i++){const f=add(B(.008,.12,.09),M(0x333333,.5),0,-.22,0,g);f.rotation.y=i*Math.PI/2;f.translateZ(.06);}
 const fl=add(new THREE.ConeGeometry(.05,.3,12),new THREE.MeshBasicMaterial({color:0xffa030,toneMapped:false}),0,-.43,0,g,false);fl.rotation.x=Math.PI;g.userData.fl=fl;scene.add(g);return g;}
const Y1=V3(0,1,0);
// ================= S1 Mike pays his taxes, looks for the real numbers (x -22) =================
const TAXP=canvasPlane(.3,.4,384,512);const drawTax=paid=>{const x=TAXP.x;x.fillStyle='#fbfbf7';x.fillRect(0,0,384,512);x.strokeStyle='#111';x.lineWidth=8;x.strokeRect(6,6,372,500);x.fillStyle='#111';x.textAlign='center';
 x.font='800 54px Mont';x.fillText('TAXES',192,80);x.font='800 30px Mont';x.fillText('FORM 1040',192,122);for(let i=0;i<6;i++){x.fillStyle='#d9d9d2';x.fillRect(40,160+i*44,304,22);}
 if(paid){x.save();x.translate(192,330);x.rotate(-.25);x.strokeStyle='#d21e2a';x.lineWidth=12;x.strokeRect(-150,-62,300,124);x.fillStyle='#d21e2a';x.font='800 100px Mont';x.fillText('PAID',0,36);x.restore();}TAXP.t.needsUpdate=true;};
drawTax(false);TAXP.m.visible=false;
const MAG=new THREE.Group();scene.add(MAG);{const bk=M(0x1b1b1b,.4,.3);add(new THREE.TorusGeometry(.085,.013,12,32),bk,0,0,0,MAG);
 add(new THREE.CircleGeometry(.08,32),new THREE.MeshPhysicalMaterial({color:0xddeeff,roughness:.02,transmission:.6,transparent:true,opacity:.35}),0,0,0,MAG,false);add(CY(.013,.016,.16,12),bk,0,-.165,0,MAG);}MAG.visible=false;
// ================= S2 the 2016 deal on a desk + 10 yearly money stacks (x -14) =================
table(-14.1,15.3,1.2,.7);
const DOC=canvasPlane(.42,.55,512,672);DOC.m.position.set(-14.1,.83,15.25);DOC.m.rotation.y=Math.PI;DOC.m.rotateX(-1.0);
let DOCK=-1;function drawDoc(k){if(Math.abs(k-DOCK)<.01)return;DOCK=k;const x=DOC.x;x.fillStyle='#fbfaf4';x.fillRect(0,0,512,672);x.strokeStyle='#1f3b6e';x.lineWidth=10;x.strokeRect(10,10,492,652);x.fillStyle='#111';x.textAlign='center';
 x.font='800 40px Mont';x.fillText('MEMORANDUM',256,80);x.fillText('OF UNDERSTANDING',256,126);x.font='800 34px Mont';x.fillStyle='#1f3b6e';x.fillText('UNITED STATES · ISRAEL',256,190);
 x.fillStyle='#c9952f';x.font='800 92px Mont';x.fillText('2016',256,300);for(let i=0;i<4;i++){x.fillStyle='#d9d9d2';x.fillRect(60,350+i*40,392,18);}
 x.strokeStyle='#111';x.lineWidth=3;x.beginPath();x.moveTo(90,600);x.lineTo(422,600);x.stroke();
 if(k>0){x.strokeStyle='#14306a';x.lineWidth=7;x.lineCap='round';x.beginPath();for(let i=0;i<=60*k;i++){const u=i/60;x.lineTo(110+300*u,585-18*Math.sin(u*19)-10*Math.sin(u*7));}x.stroke();}DOC.t.needsUpdate=true;}
drawDoc(0);
const PEN=add(CY(.007,.009,.15,10),M(0x111111,.3,.5),0,0,0,scene);PEN.visible=false;
{for(const [x,tx] of[[-13.6,FT],[-14.6,ILT]]){add(CY(.005,.005,.3,8),M(0xd6d9de,.3,.9),x,.93,15.5);const f=add(new THREE.PlaneGeometry(.2,.13),new THREE.MeshStandardMaterial({map:tx,roughness:.8,side:THREE.DoubleSide}),x-.1,1.01,15.5,scene,false);f.rotation.y=Math.PI;}}   // desk flags: US (screen left) + Israel
table(-14.04,16.6,3.7,.45,.75);
const STACKS=[];for(let i=0;i<10;i++){const g=new THREE.Group();g.position.set(-15.66+i*.36,.775,16.6);scene.add(g);for(let k=0;k<6;k++)zbG(g,0,.055+k*.112,0);g.visible=false;STACKS.push(g);}
// ================= S3 about $317 million a month: a pallet of straps + a calendar (x -4.6) =================
const S3P=new THREE.Group();S3P.position.set(-4.85,0,15.6);scene.add(S3P);
{for(let i=0;i<3;i++)add(B(.95,.06,.09),wood,0,.03,-.38+i*.38,S3P);for(let i=0;i<5;i++)add(B(.17,.03,.95),wood,-.38+i*.19,.075,0,S3P);for(let y=0;y<3;y++)for(let ix=0;ix<3;ix++)for(let iz=0;iz<3;iz++)zbG(S3P,(ix-1)*.29,.145+y*.112,(iz-1)*.3);}
S3P.visible=false;
const calTex=(top,big,col)=>tex(512,580,x=>{x.fillStyle='#ffffff';x.fillRect(0,0,512,580);x.fillStyle=col;x.fillRect(0,0,512,120);x.fillStyle='#fff';x.textAlign='center';x.font='800 78px Mont';x.fillText(top,256,90);
 x.fillStyle='#222';if(big){x.font='800 230px Mont';x.fillText(big,256,410);}else{x.font='800 34px Mont';for(let r=0;r<5;r++)for(let c=0;c<7;c++){const d=r*7+c+1;if(d<=30)x.fillText(d,48+c*69,190+r*80);}}x.strokeStyle='#999';x.lineWidth=6;x.strokeRect(3,3,506,574);});
function calendar(x,z,y0,w,h,front,back){const g=new THREE.Group();g.position.set(x,y0,z);scene.add(g);const dk=M(0x2a2a2a,.5,.4);
 if(y0<.5)for(const s of[-1,1])add(CY(.015,.015,1.1,8),dk,s*w*.4,.55,.05,g);
 const base=add(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:back,roughness:.7}),0,1.1,0,g,false);base.rotation.y=Math.PI;
 const pv=new THREE.Group();pv.position.set(0,1.1+h/2,-.012);g.add(pv);const pg=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:front,roughness:.7,side:THREE.DoubleSide}));pg.position.y=-h/2;pg.rotation.y=Math.PI;pv.add(pg);
 g.visible=false;return {g,pv,pg,base};}
const CAL3=calendar(-3.95,15.6,0,.7,.8,calTex('1 MONTH',null,'#d21e2a'),calTex('1 MONTH',null,'#d21e2a'));
// ================= S4 $3.3B military equipment (jet) + $500M missile defense (Iron Dome) (x 5) =================
add(CY(.035,.035,.62,12),M(0x9aa0a6,.3,.8),5.6,.31,15.8);add(CY(.3,.34,.05,32),M(0x3a3f45,.5,.4),5.6,.025,15.8);
const JET=jetModel();scene.add(JET);JET.position.set(5.6,.75,15.8);JET.visible=false;
const LCH=new THREE.Group();LCH.position.set(6.1,0,16.8);scene.add(LCH);
{const od=M(0x5a6648,.7,.2),dk=M(0x1a1a1a,.8);add(B(1.6,.35,.8),od,0,.55,0,LCH);add(B(.5,.55,.78),od,-.9,.72,0,LCH);add(B(.04,.3,.6),M(0x22303f,.1,.4),-1.16,.82,0,LCH);
 for(const x of[-.85,-.1,.55])for(const z of[-.42,.42]){const w=add(CY(.2,.2,.14,20),dk,x,.2,z,LCH);w.rotation.x=Math.PI/2;}
 const tt=tex(256,256,x=>{x.fillStyle='#4a5640';x.fillRect(0,0,256,256);x.fillStyle='#111';for(let r=0;r<4;r++)for(let c=0;c<5;c++){x.beginPath();x.arc(30+c*49,36+r*61,19,0,7);x.fill();}});
 const bx=add(B(.95,.5,.7),[od,new THREE.MeshStandardMaterial({map:tt,roughness:.7}),od,od,od,od],.15,1.12,0,LCH);bx.rotation.z=-.9;}
LCH.visible=false;
const INT=missileModel(0xf2f2f2),ROCK=missileModel(0x555a52);INT.visible=ROCK.visible=false;
const SMK=[];{const sm_=new THREE.MeshStandardMaterial({color:0xd8d8d8,roughness:1,transparent:true,opacity:.5,depthWrite:false});for(let i=0;i<60;i++){const m=add(new THREE.SphereGeometry(.11,10,8),sm_,0,0,0,scene,false);m.visible=false;SMK.push(m);}}
const BOOMS=add(new THREE.SphereGeometry(1,24,16),new THREE.MeshBasicMaterial({color:0xffb030,toneMapped:false,transparent:true}),0,0,0,scene,false);BOOMS.visible=false;
const BOOML=new THREE.PointLight(0xffa040,0,14,1.5);scene.add(BOOML);
const T_HIT=T('down')+.05,T_INT=T('shoots'),P_LA=V3(5.85,1.55,16.7),P_HIT=V3(4.9,5.4,16.2),P_RK=V3(2.4,8.9,16.2);
const mPath=(a,b,k,bend)=>{const p=a.clone().lerp(b,k);p.x+=bend*Math.sin(Math.PI*k);return p;};
// ================= S5 the yearly money early, in one lump sum: the whole tower drops at once (x 15) =================
BRK.forEach(m=>{m.userData.by=m.position.y;});
const SHAD=add(new THREE.CircleGeometry(1.9,40),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthWrite:false}),15,.02,16.4,scene,false);SHAD.rotation.x=-Math.PI/2;
const EMB5=add(new THREE.PlaneGeometry(1.0,.7),new THREE.MeshStandardMaterial({map:EMB,roughness:.75,transparent:true}),15.75,.45,15.05,scene,false);EMB5.rotation.y=Math.PI;EMB5.visible=false;
const DUST=[];{const dm=new THREE.MeshStandardMaterial({color:0xc9b89a,roughness:1,transparent:true,opacity:.5,depthWrite:false});for(let i=0;i<14;i++){const m=add(new THREE.SphereGeometry(.25,10,8),dm,0,0,0,scene,false);m.userData.a=i/14*Math.PI*2;m.visible=false;DUST.push(m);}}
// ================= S7 the factory: money in, the check, workers, planes + missiles (x 35) =================
const FX7=35,FZ7=17.6;
{const br=pbr('red_brick',3,2,0xc89a8a);add(B(4.4,3.0,3.5),br,FX7,1.5,FZ7);
 for(let i=0;i<3;i++){const sh=new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(1.467,0),new THREE.Vector2(1.467,.6)]);const m=add(new THREE.ExtrudeGeometry(sh,{depth:3.5,bevelEnabled:false}),M(0x6b6f75,.6,.3),FX7-2.2+i*1.467,3.0,FZ7-1.75);}
 add(CY(.22,.26,2.4,16),pbr('red_brick',1,2,0x8a5a4a),FX7+1.6,4.2,FZ7+.8);
 const dr=add(new THREE.PlaneGeometry(1.6,2.0),M(0x15171a,.9),FX7,1.0,FZ7-1.76,scene,false);dr.rotation.y=Math.PI;
 add(B(1.75,.1,.08),M(0xe8e8e8,.5),FX7,2.05,FZ7-1.78);for(const s of[-1,1])add(B(.08,2.05,.08),M(0xe8e8e8,.5),FX7+s*.84,1.02,FZ7-1.78);
 for(const s of[-1,1])for(const y of[1.0,2.2]){const w=add(new THREE.PlaneGeometry(.6,.6),M(0x22303f,.08,.3,{envMapIntensity:1.6}),FX7+s*1.5,y,FZ7-1.76,scene,false);w.rotation.y=Math.PI;}}
const SIGN7=canvasPlane(1.9,.4,1024,214);{const x=SIGN7.x;x.fillStyle='#16224a';x.fillRect(0,0,1024,214);x.strokeStyle='#fff';x.lineWidth=10;x.strokeRect(5,5,1014,204);x.drawImage(FT.image,30,45,236,124);
 x.fillStyle='#fff';x.font='800 100px Mont';x.textAlign='center';x.fillText('MADE IN USA',630,146);SIGN7.t.needsUpdate=true;}
SIGN7.m.position.set(FX7,2.5,FZ7-1.8);SIGN7.m.rotation.y=Math.PI;SIGN7.m.visible=false;
const STREAM=[];for(let i=0;i<10;i++){const m=zbrick(0,0,0);m.visible=false;STREAM.push(m);}
const CHK=canvasPlane(1.5,.64,1024,436);{const x=CHK.x;x.fillStyle='#e4f0e0';x.fillRect(0,0,1024,436);x.strokeStyle='#3d6b4f';x.lineWidth=10;x.strokeRect(10,10,1004,416);x.fillStyle='#1f3b2a';x.textAlign='left';
 x.font='800 40px Mont';x.fillText('UNITED STATES',40,70);x.font='800 30px Mont';x.fillText('PAY TO THE ORDER OF',40,170);x.font='800 76px Mont';x.fillStyle='#0038b8';x.fillText('ISRAEL',420,180);
 x.fillStyle='#fff';x.fillRect(600,230,380,80);x.strokeStyle='#1f3b2a';x.lineWidth=4;x.strokeRect(600,230,380,80);x.fillStyle='#1f3b2a';x.font='800 50px Mont';x.fillText('$3.8 BILLION',614,288);
 x.strokeStyle='#1f3b2a';x.lineWidth=3;x.beginPath();x.moveTo(40,375);x.lineTo(520,375);x.stroke();x.font='800 26px Mont';x.fillText('FOR: MILITARY AID',40,410);CHK.t.needsUpdate=true;}
CHK.m.visible=false;
const WK=[['guard',FX7-.7],['printer',FX7],['teller',FX7+.7]].map(([n,x],i)=>{const P=person(n,x,0,15.55,Math.PI);P.g.updateMatrixWorld(true);const h=V3();P.BN.head.getWorldPosition(h);
 const hat=new THREE.Group();hat.position.copy(h).add(V3(0,.1,0));scene.add(hat);const ym=M(0xf2c418,.35,.1);add(new THREE.SphereGeometry(.125,24,12,0,Math.PI*2,0,Math.PI/2),ym,0,0,0,hat);add(CY(.16,.16,.015,24),ym,0,0,0,hat);P.BN.head.attach(hat);
 P.g.visible=false;P.x0=x;return P;});
const JET2=jetModel();scene.add(JET2);JET2.scale.setScalar(.5);JET2.position.set(FX7+1.15,.08,15.0);JET2.visible=false;
const MRACK=new THREE.Group();MRACK.position.set(FX7-1.55,0,15.0);scene.add(MRACK);{add(B(.6,.08,.3),M(0x3a3f45,.5,.4),0,.04,0,MRACK);for(let i=0;i<3;i++){const m=missileModel(0xf2f2f2);m.userData.fl.visible=false;scene.remove(m);m.position.set(-.18+i*.18,.38,0);MRACK.add(m);}}
MRACK.visible=false;
// ================= S8 debt clock: $40T, interest straps flying in, $3B every day calendar (stage) =================
const FLY2=[];for(let i=0;i<12;i++){const m=zbrick(0,0,0);m.visible=false;m.userData.x=GX+.1+((i*37)%7)/7*.6;FLY2.push(m);}
const CAL8=calendar(GX-1.5,18.0,SY-.45,.75,.85,calTex('DAY',' 1','#b22234'),calTex('DAY',' 2','#b22234'));
const DAYT=[...Array(9)].map((_,i)=>calTex('DAY',String(i+1).padStart(2,' '),'#b22234'));
const FLY3=[];for(let i=0;i<6;i++){const m=zbrick(0,0,0);m.visible=false;FLY3.push(m);}
// ================= S9 Mike's math on a whiteboard (stage) =================
const WB=canvasPlane(1.4,1.0,1024,732);WB.m.position.set(GX-.9,SY+1.3,18.4);WB.m.rotation.y=Math.PI;WB.m.visible=false;
const WBL=[];{const dk=M(0x3a3f45,.5,.5);for(const s of[-1,1])WBL.push(add(CY(.018,.018,1.8,8),dk,GX-.9+s*.6,SY+.9,18.45));add(B(1.46,.05,.05),M(0xd6d9de,.3,.8),GX-.9,SY+.79,18.42);WBL.forEach(l=>l.visible=false);}
let WBK='';function drawWB(t){const l1=t>T('yearly',1)-.1,l2=t>T('costs')-.1,l3=t>T('32')-.05;const ang=(Math.min(1,Math.max(0,(t-T('32'))/2.2)))*32/12*Math.PI*2;
 const k=[l1,l2,l3,ang.toFixed(2)].join();if(k===WBK)return;WBK=k;const x=WB.x;x.fillStyle='#fbfbf8';x.fillRect(0,0,1024,732);x.strokeStyle='#9aa0a6';x.lineWidth=16;x.strokeRect(8,8,1008,716);
 x.textAlign='left';x.fillStyle='#1d2b4f';x.font='800 50px Mont';x.fillText("MIKE'S MATH",50,90);
 if(l1){x.fillStyle='#1a8a3e';x.font='800 84px Mont';x.fillText('$3.8B',50,250);x.fillStyle='#555';x.font='800 40px Mont';x.fillText('a year',330,250);}
 if(l2){x.fillStyle='#c23030';x.font='800 84px Mont';x.fillText('÷ $2.9B',50,400);x.fillStyle='#555';x.font='800 40px Mont';x.fillText('a day',390,400);}
 if(l3){x.fillStyle='#d21e2a';x.font='800 100px Mont';x.fillText('= 32 HOURS',50,600);}
 const cx=830,cy=290,r=130;x.fillStyle='#fff';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='#1d2b4f';x.lineWidth=12;x.stroke();x.lineWidth=6;
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.beginPath();x.moveTo(cx+Math.sin(a)*(r-12),cy-Math.cos(a)*(r-12));x.lineTo(cx+Math.sin(a)*(r-30),cy-Math.cos(a)*(r-30));x.stroke();}
 if(ang>0){x.fillStyle='rgba(210,30,42,.25)';x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r-8,-Math.PI/2,-Math.PI/2+Math.min(ang,Math.PI*2*.999));x.closePath();x.fill();}
 x.strokeStyle='#111';x.lineCap='round';x.lineWidth=12;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.sin(ang)*70,cy-Math.cos(ang)*70);x.stroke();x.lineWidth=7;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.sin(ang*4)*105,cy-Math.cos(ang*4)*105);x.stroke();WB.t.needsUpdate=true;}
// ================= S10 defense vs interest on a balance scale (x 40.3) =================
const SCX=40.3,SCZ=15.8,SCY=1.55,gold=M(0xd4af37,.3,1);
add(B(.6,.08,.4),gold,SCX,.04,SCZ);add(CY(.035,.05,1.5,16),gold,SCX,.79,SCZ);add(new THREE.SphereGeometry(.06,16,10),gold,SCX,SCY+.06,SCZ);
const BEAM=new THREE.Group();BEAM.position.set(SCX,SCY,SCZ);scene.add(BEAM);add(B(1.35,.05,.05),gold,0,0,0,BEAM);
const PANS=[-1,1].map(s=>{const g=new THREE.Group();scene.add(g);add(CY(.36,.3,.05,32),gold,0,-.48,0,g);add(CY(.008,.008,.46,6),gold,0,-.23,0,g);g.userData.s=s;return g;});
const JET3=jetModel();JET3.scale.setScalar(.3);JET3.position.set(0,-.4,0);PANS[0].add(JET3);
const PILE=new THREE.Group();PANS[1].add(PILE);for(let y=0;y<3;y++)for(let ix=0;ix<2;ix++)for(let iz=0;iz<2;iz++)zbG(PILE,(ix-.5)*.29,-.4+y*.112,(iz-.5)*.3);
// ================= S11 the debt as 10,000 squares, the aid fits inside ONE (1 square = $4 billion) =================
let GRID=0;function drawGrid(){if(GRID)return;GRID=1;const x=DCC.getContext('2d');x.fillStyle='#0b1530';x.fillRect(0,0,1536,640);x.fillStyle='#b22234';x.fillRect(0,0,1536,110);x.fillStyle='#fff';x.textAlign='center';x.font='800 84px Mont';x.fillText('U.S. NATIONAL DEBT',768,84);
 x.fillStyle='#e0303a';for(let r=0;r<100;r++)for(let c=0;c<100;c++)x.fillRect(518+c*5,125+r*5,4,4);
 x.fillStyle='#22ff6a';x.fillRect(518+99*5-1,125-1,6,6);x.strokeStyle='#22ff6a';x.lineWidth=6;x.beginPath();x.arc(518+99*5+2,127,26,0,7);x.stroke();
 x.strokeStyle='#fff';x.lineWidth=14;x.strokeRect(7,7,1522,626);DCT.needsUpdate=true;}
// ================= floating 3D words (glow colour = meaning) =================
PT('2016',.16,YEL,-14.0,1.55,15.3,T('2016')-.05,T('$38',1)-.1);
PT('$38 BILLION',.26,GRN,-14.04,2.62,16.6,T('$38',1),T("that's")-.1);PT('10 YEARS',.17,YEL,-14.04,2.32,16.6,T('10'),T("that's")-.1);
STACKS.forEach((g,i)=>PT(String(2019+i),.075,WHT,g.position.x,1.55,16.6,T('from')+i*(T('2028')+.3-T('from'))/10,T("that's")-.1));
PT('$317 MILLION',.2,GRN,-4.75,2.25,15.6,T('$317'),T('$33')-.1);PT('A MONTH',.15,YEL,-4.75,2.0,15.6,T('a',1)-.05,T('$33')-.1);
PT('$3.3 BILLION',.2,GRN,5.15,2.3,15.8,T('$33'),T('$500')-.1);PT('A YEAR',.14,YEL,5.15,2.07,15.8,T('a',2)-.05,T('$500')-.1);
PT('$500 MILLION',.26,GRN,6.3,6.3,16.2,T('$500'),T('and',0)+.1);PT('IRON DOME',.22,YEL,6.3,5.95,16.2,T('iron'),T('and',0)+.1);
PT('EARLY',.24,YEL,15,2.0,15.4,T('early')-.05,T('lump')-.05);
PT('$3.8 BILLION',.3,GRN,15,4.62,16.4,T('lump'),T('miss')-.3);PT('ONE LUMP SUM',.2,YEL,15,4.3,16.4,T('sum')-.1,T('miss')-.3);
PT('!',.3,YEL,16.62,1.95,14.5,T('miss'),T('under')+.15);
PT('PAID',.32,GRN,FX7,3.0,15.5,T('paid'),T('and',2)+.2);
PT('$40 TRILLION',.25,RED,GX,2.1,19.6,T('$40',1),T('last')-.1);
PT('$1.05 TRILLION',.22,RED,GX,2.1,19.6,T('$105'),T("that's",1)-.1);PT('INTEREST',.16,YEL,GX,1.78,19.6,T('interest')-.05,T("that's",1)-.1);
PT('$3 BILLION',.2,RED,GX-1.5,SY+1.95,18.0,T('$3'),T('so',2)-.1);PT('EVERY DAY',.13,YEL,GX-1.5,SY+1.66,18.0,T('every')-.05,T('so',2)-.1);
const H32=PT('32 HOURS',.22,YEL,GX-.9,SY+1.95,18.3,T('32'),T('defense',1)-.3);
PT('$965 BILLION',.075,GRN,SCX-.55,2.4,SCZ,T('$965'),57.6);PT('DEFENSE',.07,YEL,SCX-.55,2.24,SCZ,T('defense',1)-.05,57.6);
PT('$1.05 TRILLION',.075,RED,SCX+.55,2.4,SCZ,T('interest',2)-.05,57.6);PT('INTEREST',.07,YEL,SCX+.55,2.24,SCZ,T('interest',2)-.05,57.6);
PT('1 SQUARE = $4 BILLION',.085,WHT,GX,4.5,20.15,T('aid')-.1,T('so',3)-.1);PT('THE AID',.08,GRN,GX-.8,4.06,20.15,T('aid')+.2,T('so',3)-.1);PT('< 0.01%',.2,YEL,GX,4.72,20.15,T('less'),T('so',3)-.1);
PT('AID',.24,GRN,GX+1.25,2.05,15.6,T('aid',1)-.05,99);PT('DEBT',.22,RED,GX-.05,2.05,15.6,T('debt',3)-.05,99);
// ================= Mike: arm goals (local: x = his right, y up, z forward), solved with solveMike() after load =================
Object.assign(MGOAL,{holdL:['L',-.1,1.12,.32],magR:['R',.16,1.5,.36],pointL:['L',-.42,1.42,.45],up:['R',.12,1.75,.25]});
const MKP=[[0,-22,0,14.8,Math.PI],[8.45,-13.15,0,14.95,Math.PI+.35],[14.15,-5.55,0,14.8,Math.PI-.45],[16.65,4.15,0,15.2,Math.PI-.4],[24.7,16.9,0,14.6,Math.PI+.45],
 [29.3,FX7-1.25,0,14.9,Math.PI-.5],[38.3,GX+.62,0,15.8,-.08],[47.0,GX+.25,SY,18.2,Math.PI],[54.0,SCX,0,16.6,Math.PI],[57.8,GX+.62,0,15.8,-.08]];
function story10(t){
 const P=MK;relax(P);idle(P,t,3);let pl=MKP[0];for(const p of MKP)if(t>=p[0])pl=p;P.g.position.set(pl[1],pl[2],pl[3]);P.g.rotation.y=pl[4];
 const A=(sd,k,s=1)=>{if(s>0)setA(P,sd,lerpA(REST,MA[k],s));};
 // ---- S1 ----
 if(t<8.45){A('L','holdL',1);P.g.updateMatrixWorld(true);P.BN.wristL.getWorldPosition(_w);TAXP.m.visible=true;TAXP.m.position.copy(_w).add(V3(.04,.13,-.08));TAXP.m.lookAt(cam.position);
  if(t>T('taxes')-.05&&!TAXP.paid){TAXP.paid=1;drawTax(true);}if(t<T('taxes')-.05&&TAXP.paid){TAXP.paid=0;drawTax(false);}
  const k=sm(T('looking')-.3,T('looking'),t);A('R','magR',k);MAG.visible=k>.3;if(MAG.visible){P.BN.wristR.getWorldPosition(_w);MAG.position.copy(_w).add(V3(-.02,.16,-.06));MAG.lookAt(cam.position);}
  pose(P,'head',.12*k,-.15*k,0);face(P,{smile:.35});}
 else{TAXP.m.visible=false;MAG.visible=false;}
 // ---- S2 ----
 if(t>=8.45&&t<14.15){A('L','openL',sm(T('deal')-.2,T('deal')+.1,t)*(1-sm(T('$38',1)-.2,T('$38',1)+.1,t)));if(t>T('$38',1)){pose(P,'head',-.2,.25,0);face(P,{jaw:.08,smile:.4});}}
 {const k=sm(T('signed')-.1,T('2016'),t);drawDoc(k);PEN.visible=t>T('signed')-.3&&t<T('2016')+.4;if(PEN.visible){const u=k;DOC.m.updateMatrixWorld(true);const lp=V3(-.21+(110+300*u)/512*.42,.275-(585-18*Math.sin(u*19)-10*Math.sin(u*7))/672*.55,.0);
  PEN.position.copy(DOC.m.localToWorld(lp)).add(V3(0,.07,0));PEN.rotation.set(.3,0,-.4);}}
 STACKS.forEach((g,i)=>{const t0=T('from')+i*(T('2028')+.3-T('from'))/10;PS(g,pin(t,t0-.05,14.6));});
 // ---- S3 ----
 PS(S3P,pin(t,T('$317')-.1,17));PS(CAL3.g,pin(t,T('about')-.1,17));CAL3.pv.rotation.x=-Math.PI*.96*sm(T('month')-.35,T('month')+.1,t);
 if(t>=14.15&&t<16.65){A('R','point',sm(T('$317')-.2,T('$317')+.1,t));face(P,{smile:.3});}
 // ---- S4: the jet, then the jet takes off and the Iron Dome intercepts a rocket ----
 {const s=pin(t,T('$33')-.1,99);JET.visible=s>.01&&t<T('missile')+1.2;if(JET.visible){const k=sm(T('$500')-.1,T('missile')+1.0,t);JET.scale.setScalar(Math.max(.001,s));
  JET.position.set(5.6-6*k*k,.75+7*k*k,15.8);JET.rotation.z=-.5*sm(0,.25,k);}}
 PS(LCH,pin(t,T('missile')-.15,26));
 {const kI=sm(T_INT,T_HIT,t),kR=sm(T('rockets')-.6,T_HIT,t);INT.visible=t>T_INT&&t<T_HIT;ROCK.visible=t>T('rockets')-.6&&t<T_HIT;
  const pI=mPath(P_LA,P_HIT,kI,-.3),pR=mPath(P_RK,P_HIT,kR,.25);INT.position.copy(pI);ROCK.position.copy(pR);
  INT.quaternion.setFromUnitVectors(Y1,mPath(P_LA,P_HIT,Math.min(1,kI+.02),-.3).sub(pI).normalize());ROCK.quaternion.setFromUnitVectors(Y1,mPath(P_RK,P_HIT,Math.min(1,kR+.02),.25).sub(pR).normalize());
  INT.userData.fl.scale.set(1,1+.3*Math.sin(t*40),1);ROCK.userData.fl.scale.set(1,1+.3*Math.sin(t*37),1);
  SMK.forEach((m,i)=>{const isI=i<30,j=i%30,tt=t-j*.02,k=isI?sm(T_INT,T_HIT,tt):sm(T('rockets')-.6,T_HIT,tt),on=isI?tt>T_INT:tt>T('rockets')-.6;
   m.visible=on&&t<T_HIT+1.2&&t>15;if(!m.visible)return;m.position.copy(isI?mPath(P_LA,P_HIT,k,-.3):mPath(P_RK,P_HIT,k,.25));m.scale.setScalar((1+j*.03)*(1-sm(T_HIT,T_HIT+1.2,t)));});
  const db=t-T_HIT;BOOMS.visible=db>0&&db<.7;if(BOOMS.visible){BOOMS.position.copy(P_HIT);BOOMS.scale.setScalar(.15+.85*sm(0,.25,db));BOOMS.material.opacity=1-sm(.15,.7,db);}
  BOOML.position.copy(P_HIT);BOOML.intensity=db>0?40*Math.exp(-db*5):0;}
 if(t>=16.65&&t<24.7){A('R','point',sm(T('$33')-.3,T('$33'),t)*(1-sm(T('$500')-.2,T('$500')+.1,t)));
  if(t>T('missile')){pose(P,'head',-.35*sm(T('missile'),T('missile')+.4,t),.15,0);}
  if(t>T_HIT){const k=sm(T_HIT,T_HIT+.15,t)*(1-sm(T_HIT+.9,T_HIT+1.3,t));arm(P,'L',AD[0]+.4*k,AD[2]-.35*k,.8*k);arm(P,'R',AD[0]+.4*k,AD[2]-.35*k,.8*k);face(P,{jaw:.1*k});}}
 // ---- S5: the lump-sum drop ----
 {const tl=T('lump'),k=sm(tl-.3,tl,t);EMB5.visible=t>T('israel',1)-.1&&t<29.5;if(EMB5.visible)EMB5.scale.setScalar(Math.max(.001,pop(t,T('israel',1)-.1,.3)));
  SHAD.material.opacity=.45*sm(T('yearly')-.2,tl,t)*(1-sm(29,29.5,t));SHAD.scale.setScalar(.4+.6*sm(T('yearly')-.2,tl,t));
  const fall=t<tl?12*(1-k*k)*(t>tl-.3?1:1):0,db=t-tl,sq=db>0?1-.06*Math.exp(-db*9)*Math.cos(db*30):1;
  BRK.forEach(m=>{m.visible=t>tl-.3&&t<29.5;if(m.visible){m.position.y=m.userData.by*sq+fall;m.scale.y=1;}});
  DUST.forEach((m,i)=>{m.visible=db>0&&db<1.2;if(!m.visible)return;const r=1.7+1.4*sm(0,1,db);m.position.set(15+Math.cos(m.userData.a)*r,.2+.3*sm(0,1,db),16.4+Math.sin(m.userData.a)*r*.6);m.scale.setScalar(1+db);m.material.opacity=.5*(1-sm(.3,1.2,db));});
  FX.position.set(15,3,14);FX.intensity=db>0&&db<1?6*Math.exp(-db*4):0;}
 if(t>=24.7&&t<29.3){const tl=T('lump');if(t>tl-.05&&t<T('now')){const k=sm(tl-.05,tl+.15,t);arm(P,'L',AD[0]+.4*k,AD[2]-.35*k,.8*k);arm(P,'R',AD[0]+.4*k,AD[2]-.35*k,.8*k);face(P,{jaw:.12*k});pose(P,'spine03',-.1*k,0,0);}
  if(t>T('now')-.2){const k=sm(T('now')-.2,T('now')+.3,t);P.g.rotation.y=Math.PI+.45*(1-k);A('R','point',sm(T('part')-.2,T('part')+.1,t));face(P,{smile:.45});pose(P,'head',.05*Math.sin(t*6)*sm(T('most'),T('miss'),t),0,0);}}
 // ---- S7: money into the factory, the check, workers + planes + missiles ----
 PS(SIGN7.m,pin(t,T('made')-.15,40));
 STREAM.forEach((m,i)=>{const t0=T('money',1)-.1+i*.11,k=sm(t0,t0+.55,t);m.visible=t>t0&&k<.99;if(!m.visible)return;m.position.copy(V3(FX7-1.05,1.2,14.8).lerp(V3(FX7,1.0,16.3),k));m.position.y+=.7*Math.sin(Math.PI*k);m.rotation.set(0,k*3,k*.6);});
 {const s=pop(t,T('check')-.1,.3),k=sm(T('but')-.05,T('but')+.5,t);CHK.m.visible=s>.01&&k<.98;if(CHK.m.visible){CHK.m.position.copy(V3(FX7,1.95,15.2).lerp(V3(FX7,1.0,16.1),k));CHK.m.rotation.set(0,Math.PI,.04*Math.sin(t*2)+k*.5);CHK.m.scale.setScalar(Math.max(.001,s*(1-.7*k)));}}
 WK.forEach((K,i)=>{const t0=T('workers')-.15+i*.12;K.g.visible=t>t0&&t<38.4;if(!K.g.visible)return;relax(K);idle(K,t,i*2);const k=sm(t0,t0+.7,t);K.g.position.set(K.x0,0,16.5-1.0*k);
  if(k<1)walk(K,t+i,.35);else{const h=Math.max(0,Math.sin((t+i*.3)*9));arm(K,'R',AD[0]+.9+.5*h,AD[2]-.5,1.2-.5*h);}face(K,{smile:.4});});
 PS(JET2,pin(t,T('planes')-.1,38.4)*.5);PS(MRACK,pin(t,T('missiles')-.1,38.4));
 if(t>=29.3&&t<38.3){A('L','openL',sm(T('made')-.2,T('made')+.1,t)*(1-sm(T('check')-.2,T('check'),t)));if(t>T('paid')-.2){face(P,{smile:.6});pose(P,'head',0,.2,0);}}
 // ---- S8: clock, interest straps, the $3B-a-day calendar ----
 FLY2.forEach((m,i)=>{const t0=T('paid',1)+.2+i*(T("that's",1)-.6-T('paid',1))/12,k=sm(t0,t0+.75,t);m.visible=t>t0&&k<.98;if(!m.visible)return;m.position.copy(V3(m.userData.x,1.05,16.3).lerp(V3(GX,SY+3.0,20.2),k));m.position.x+=.4*Math.sin(Math.PI*k)*(i%2?1:-1);m.rotation.set(k*2,k*3,0);m.scale.setScalar(1-.5*k);});
 {const s=pin(t,T("that's",1)-.15,47.5);PS(CAL8.g,s);const n=Math.floor(Math.max(0,(t-T('$3'))/.24));const ph=((t-T('$3'))/.24)%1;
  if(CAL8.g.visible){const a=Math.min(n,8),b=Math.min(n+1,8);if(CAL8.n!==a){CAL8.n=a;CAL8.pg.material.map=DAYT[a];CAL8.base.material.map=DAYT[b];CAL8.pg.material.needsUpdate=CAL8.base.material.needsUpdate=true;}CAL8.pv.rotation.x=t>T('$3')&&n<8?-Math.PI*.96*sm(.35,.95,ph):0;}
  FLY3.forEach((m,i)=>{const t0=T('$3')+.1+i*.3,k=sm(t0,t0+.55,t);m.visible=t>t0&&k<.98&&t<47.6;if(!m.visible)return;m.position.copy(V3(GX-1.5,SY+1.3,17.9).lerp(V3(GX-.2,SY+3.0,20.2),k));m.position.y+=.3*Math.sin(Math.PI*k);m.rotation.set(k*2,k*3,0);m.scale.setScalar(1-.5*k);});}
 if(t>=38.3&&t<47.0){pose(P,'head',-.22,0,0);if(t>T('interest')-.2)pose(P,'head',-.15,.3*Math.sin((t-T('interest'))*8)*(1-sm(T('interest')+.4,T('interest')+.9,t)),0);}
 // ---- S9: whiteboard math ----
 {const s=pin(t,T('math')-.4,53.7);PS(WB.m,s);WBL.forEach(l=>l.visible=WB.m.visible);if(WB.m.visible)drawWB(t);
  const dt=t-T('32',1);if(H32.visible&&dt>0)H32.scale.multiplyScalar(1+.25*Math.exp(-dt*6)*Math.cos(dt*20));}
 if(t>=47.0&&t<54.0){A('L','pointL',sm(T('yearly',1)-.3,T('yearly',1),t)*(1-sm(T('32')-.3,T('32'),t)));
  if(t>T('32')-.2){const k=sm(T('32')-.2,T('32')+.15,t);A('L','openL',k*(1-sm(T('just',1)-.2,T('just',1),t)));A('R','openR',k*(1-sm(T('just',1)-.2,T('just',1),t)));face(P,{smile:.6,jaw:.05});}
  if(t>T('just',1)-.2){A('R','up',sm(T('just',1)-.2,T('just',1)+.1,t));face(P,{smile:.5});}}
 // ---- S10: the scale ----
 {const th=.12*sm(T('$965')-.2,T('$965')+.4,t)-.42*sm(T('more')-.35,T('more')+.05,t);const db=t-T('more');const w=th+(db>0?.05*Math.exp(-db*5)*Math.sin(db*18):0);BEAM.rotation.z=w;
  PANS.forEach(g=>{const s=g.userData.s;g.position.set(SCX+s*.65*Math.cos(w),SCY+s*.65*Math.sin(w),SCZ);});
  PS(JET3,pin(t,T('defense',1)-.1,99)*.3);PS(PILE,pin(t,T('interest',2)-.1,99));}
 if(t>=54.0&&t<57.8){pose(P,'head',-.1,.35*Math.sin(t*1.6),0);if(t>T('more')-.1){face(P,{jaw:.1});A('L','openL',sm(T('more')-.1,T('more')+.2,t));A('R','openR',sm(T('more')-.1,T('more')+.2,t));}}
 // ---- S11 + S12 CTA ----
 if(t>=57.8){const k=sm(T('so',3)-.3,T('so',3)+.2,t);P.g.rotation.y=-.08+(Math.PI+.08)*k;if(k<.05)pose(P,'head',-.22,0,0);
  if(t>T('so',3)+.1&&t<T('cut')-.1){const s=sm(T('what',1),T('what',1)+.3,t);A('L','openL',s);A('R','openR',s);pose(P,'head',0,0,.12*s);face(P,{smile:.2});}
  if(t>=T('cut')-.1){A('R','right',sm(T('aid',1)-.3,T('aid',1),t)*(1-sm(T('comment')-.2,T('comment'),t)));A('L','left',sm(T('debt',3)-.3,T('debt',3),t)*(1-sm(T('comment')-.2,T('comment'),t)));
   if(t>T('comment')-.2)A('R','point',sm(T('comment')-.2,T('comment')+.1,t));face(P,{smile:.5});}}
}
