// ===================== EP20 STORY (after the hook): 1 COUNT -> 2 SCAN -> rejected bill -> 3 LOCKED BOX -> Friday/Monday -> computer + app on hold
//   -> outside: own ATM 2 days vs other ATM 5 days -> armored truck -> vault + Federal Reserve shredder -> Wednesday -> Mike pops out -> tips -> CASH / PHONE
const {check3D,x3D}=await import('./scenekit/props.js');
const VF=-300;   // vault + Federal Reserve set
// ---------- times (all on the spoken words) ----------
const tCounter=T('a counter'),tSecond=T('about a second'),tScan=T('then scanners'),tInk=T('ink'),tSize=T('size'),tMarks=T('hidden marks'),tNoF=T('no fakes'),
 tEven=T('even mike'),tClean=T('clean'),tOne=T('one wrinkled'),tSpit=T('spit'),tRej=T('rejected'),tRest=T('the rest'),tLocked=T('locked steel'),tStuck=T('stuck inside'),
 tBad=T('bad news'),tFri=T('friday night'),tCut=T('the cutoff'),tCounts=T('so the bank'),tMon=T('as monday'),tRent=T('his rent'),tTwist=T('heres the twist'),tNum=T('a number'),
 tApp=T('his app'),tHold=T('on hold'),tLockW=T('locked',1),tOwn=T('your own'),tTwo=T('two business'),tAnother=T('another banks'),tFive=T('five'),tLater=T('later'),tTruck=T('armored truck'),
 tVault=T('a vault'),tCeleb=T('guarded like'),tExtra=T('extra cash'),tFed=T('federal reserve'),tMach=T('where machines'),tWorn=T('worn-out'),tShred=T('shredded'),tConf=T('confetti'),
 tParty=T('mike throws'),tWed=T('wednesday'),tLift=T('hold lifts'),tReady=T('ready to spend'),tPops=T('mike pops'),tFull=T('full size'),tWant=T('want it'),tBefore=T('before the cutoff'),
 tUse=T('and use your'),tReceipt=T('keep the receipt'),tMis=T('miscounts'),tProof=T('your proof'),tSo=T('so do you'),tCashW=T('deposit cash'),tPhoneW=T('your phone'),tComment=T('comment'),
 tCASH=T('cash or phone'),tPHONE=TE('cash or phone')-.3;
const W1=tOwn-.05,W2=tVault-.05,W3=tWed-.12;   // camera whips between places
// ---------- small helpers ----------
const KF=(t,arr)=>{if(t<=arr[0][0])return arr[0].slice(1);for(let i=0;i<arr.length-1;i++){const a=arr[i],b=arr[i+1];if(t<b[0]){const u=sm(a[0],b[0],t);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);}}return arr[arr.length-1].slice(1);};
const face2cam=m=>m.quaternion.copy(cam.quaternion);
const popS=(m,t0,s=1,t1=1e9,d=.28)=>{const a=pop(t,t0,d)*(1-sm(t1,t1+.25,t));m.visible=a>.01;m.scale.setScalar(Math.max(.001,a)*s);return a;};
let t=0;   // (popS reads the current time)
const plateTex=(w,h,f)=>K.tex(w,h,f);
const PLATE=(tx,w,h,p,x,y,z,ry=Math.PI)=>{const m=K.add(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:.6}),x,y,z,p,false);m.rotation.y=ry;return m;};
// ================= 1 COUNT: digital counter on the rollers =================
const CNT=plateTex(512,200,()=>{});let cntLast=-1;
function cntDraw(n){if(n===cntLast)return;cntLast=n;K.redraw(CNT,(x,w,h)=>{x.fillStyle='#0c0f12';x.fillRect(0,0,w,h);x.strokeStyle='#3a4048';x.lineWidth=8;x.strokeRect(4,4,w-8,h-8);
 x.fillStyle='#9aa3ad';x.font='800 34px Mont';x.textAlign='center';x.fillText('COUNTED',w/2,54);x.fillStyle='#ffffff';x.font='800 92px Mont';x.fillText('$'+(n*100).toLocaleString('en-US'),w/2,160);});}
cntDraw(0);
{const g=K.group(-1.3,YA+3.75,-.05,IG);K.add(K.B(1.5,.62,.14),K.M(0x2b2f35,.4,.7),0,0,0,g);PLATE(CNT,1.38,.54,g,0,0,-.08);}
// ================= 2 SCAN: three checks (ink, size, marks) + sweep line =================
const SW=[['INK',tInk],['SIZE',tSize],['MARKS',tMarks]].map(([s_,tt],i)=>{const m=K.txt3(s_,.24,0xffffff,{ei:.05,p:IG});m.position.set(0,YB+3.12,-.6);return {m,tt,i};});
const SWEEP=K.add(new THREE.PlaneGeometry(2.0,.06),new THREE.MeshBasicMaterial({color:0x2fe06a,transparent:true,opacity:.85}),0,0,0,IG,false);SWEEP.visible=false;
const XF=x3D(K);IG.add(XF);XF.visible=false;const CHC=check3D(K);IG.add(CHC);CHC.visible=false;
// the wrinkled bill (11th mesh: a copy of the top bill that crumples, flies out, Mike flattens it and puts it back)
const WB=MK.note(100,{curve:0});WB.scale.setScalar(GS*.55);IG.add(WB);WB.visible=false;const XR2=x3D(K);IG.add(XR2);XR2.visible=false;
// ================= 3 LOCKED BOX: bigger steel box with a barred window + shutter =================
BOX.visible=false;
const BX=K.group(-1.4,YC,0,IG);{const st=K.M(0x6f767e,.35,.85);
 K.add(K.B(2.6,2.7,.1),st,0,1.35,.95,BX);K.add(K.B(.1,2.7,2.0),st,-1.3,1.35,0,BX);K.add(K.B(2.6,.1,2.0),st,0,2.7,0,BX);           // back, far side, roof
 K.add(K.B(2.6,1.25,.1),st,0,.625,-.95,BX);K.add(K.B(2.6,.55,.1),st,0,2.425,-.95,BX);for(const x of[-1.0,1.0])K.add(K.B(.6,.9,.1),st,x,1.7,-.95,BX);   // front with a window
 for(let i=0;i<5;i++)K.add(K.CY(.025,.025,.9,8),K.M(0x2b2f35,.3,.9),-.56+i*.28,1.7,-.95,BX);
 const lk=K.tex(256,96,(x,w,h)=>{x.fillStyle='#2b2f35';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 52px Mont';x.textAlign='center';x.fillText('LOCKED',w/2,66);});PLATE(lk,.9,.34,BX,0,.75,-1.01);}
const SHUT=K.add(K.B(.1,2.7,2.0),K.M(0x5f666e,.35,.85),1.3,1.35,0,BX);
// clock + calendar on a stand (screen right of the box)
const CLK=K.group(-4.3,0,-.2,IG);K.add(K.CY(.05,.05,4.3,10),K.M(0x2b2f35,.4,.7),0,2.15,.1,CLK);
const CLT=K.tex(512,512,(x,w,h)=>{x.fillStyle='#fff';x.beginPath();x.arc(256,256,250,0,7);x.fill();x.strokeStyle='#1d1d1d';x.lineWidth=18;x.stroke();x.fillStyle='#1d1d1d';
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.fillRect(256+Math.sin(a)*205-6,256-Math.cos(a)*205-18,12,36);}x.lineCap='round';x.lineWidth=20;x.beginPath();x.moveTo(256,256);x.lineTo(256+Math.sin(-Math.PI/3)*120,256-Math.cos(-Math.PI/3)*120);x.stroke();
 x.lineWidth=12;x.beginPath();x.moveTo(256,256);x.lineTo(256,66);x.stroke();x.font='800 56px Mont';x.textAlign='center';x.fillText('PM',256,380);});
{const c=K.add(K.CY(.62,.62,.12,48),K.M(0x2b2f35,.4,.6),0,4.0,0,CLK);c.rotation.x=Math.PI/2;const f=PLATE(CLT,1.12,1.12,CLK,0,4.0,-.07);}
const CALT=K.tex(512,560,()=>{});let calLast='';
function calDraw(d){if(d===calLast)return;calLast=d;K.redraw(CALT,(x,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#d42a2a';x.fillRect(0,0,w,130);x.fillStyle='#fff';x.font='800 64px Mont';x.textAlign='center';x.fillText('DAY',w/2,92);
 x.fillStyle='#1d1d1d';x.font=`800 ${d.length>7?86:104}px Mont`;x.fillText(d,w/2,340);});}
calDraw('FRIDAY');const CALM=PLATE(CALT,1.15,1.26,CLK,0,2.35,-.05);
const CUTW=K.txt3('AFTER CUTOFF',.2,0xff3b3b,{ei:.15,p:IG});CUTW.visible=false;
const RENTT=K.tex(256,256,(x,w,h)=>{x.fillStyle='#ffe066';x.fillRect(0,0,w,h);x.fillStyle='#c81e1e';x.font='800 64px Mont';x.textAlign='center';x.fillText('RENT',w/2,110);x.fillText('DUE!',w/2,190);});
const RENT=PLATE(RENTT,.55,.55,CLK,.42,2.0,-.12);RENT.visible=false;
// ================= computer + app (the money is a number) =================
const MONT=K.tex(768,460,(x,w,h)=>{x.fillStyle='#0f2747';x.fillRect(0,0,w,h);x.fillStyle='#1d4f8f';x.fillRect(0,0,w,86);x.fillStyle='#fff';x.font='800 50px Mont';x.textAlign='center';x.fillText('BANK COMPUTER',w/2,62);
 x.textAlign='left';x.fillStyle='#9fc2ea';x.font='800 46px Mont';x.fillText('ACCOUNT',50,180);x.fillStyle='#fff';x.font='800 64px Mont';x.fillText('MIKE',50,270);x.textAlign='right';x.fillStyle='#ffffff';x.font='800 110px Mont';x.fillText('$1,000',w-50,390);});
const MON=K.group(4.4,6.2,-.5,IG);K.add(K.B(2.7,1.7,.14),K.M(0x15181c,.4,.5),0,0,0,MON);PLATE(MONT,2.5,1.5,MON,0,0,-.08);K.add(K.B(.14,1.2,.14),K.M(0x2b2f35,.4,.7),0,-1.4,.1,MON);
const PHT=K.tex(400,800,()=>{});let phLast=-1;
function phDraw(m){if(m===phLast)return;phLast=m;K.redraw(PHT,(x,w,h)=>{x.fillStyle='#f4f6f9';x.fillRect(0,0,w,h);x.fillStyle='#1d4f8f';x.fillRect(0,0,w,130);x.fillStyle='#fff';x.font='800 40px Mont';x.textAlign='center';x.fillText('MY BANK',w/2,88);
 x.fillStyle='#5a6370';x.font='800 34px Mont';x.fillText('BALANCE',w/2,260);x.fillStyle='#111';x.font='800 92px Mont';x.fillText('$1,000',w/2,370);
 x.fillStyle=m?'#21a052':'#e07a12';x.beginPath();x.roundRect(50,450,w-100,110,24);x.fill();x.fillStyle='#fff';x.font='800 50px Mont';x.fillText(m?'AVAILABLE':'ON HOLD',w/2,523);});}
phDraw(0);
function phoneProp(p){const g=K.group(0,0,0,p);K.add(K.RB(1.0,1.95,.1,.12),K.M(0x111316,.3,.5),0,0,0,g);PLATE(PHT,.9,1.8,g,0,0,-.056);return g;}
const PH1=phoneProp(IG);PH1.position.set(4.4,3.0,-.8);PH1.visible=false;
function padlock(p){const g=K.group(0,0,0,p);const red=K.M(0xd42a2a,.35,.3);K.add(K.RB(.62,.5,.24,.06),red,0,0,0,g);const sh=K.add(new THREE.TorusGeometry(.2,.055,12,24,Math.PI),K.M(0xc9ccd4,.25,.9),0,.25,0,g);g.userData.sh=sh;return g;}
const LOCK1=padlock(IG);LOCK1.visible=false;
// ================= outside: second ATM (another bank) + labels =================
const KIO=K.group(5.7,0,8.55);{K.add(K.RB(1.15,2.25,.7,.06),K.M(0xb3261e,.4,.3),0,1.12,0,KIO);K.add(K.RB(.95,1.85,.62,.04),K.M(0x5c636b,.35,.85),0,1.0,.06,KIO);
 const sc=K.tex(256,200,(x,w,h)=>{x.fillStyle='#3a1010';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 40px Mont';x.textAlign='center';x.fillText('ATM',w/2,90);x.font='800 28px Mont';x.fillText('INSERT CASH',w/2,150);});
 K.add(new THREE.PlaneGeometry(.6,.45),new THREE.MeshBasicMaterial({map:sc,toneMapped:false}),0,1.45,.38,KIO,false);K.add(K.B(.4,.1,.06),K.M(0x0b0b0b,.5),0,.95,.39,KIO);
 const sg=K.tex(320,96,(x,w,h)=>{x.fillStyle='#b3261e';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 46px Mont';x.textAlign='center';x.fillText('OTHER BANK',w/2,64);});K.add(new THREE.PlaneGeometry(1.0,.3),new THREE.MeshBasicMaterial({map:sg,toneMapped:false}),0,2.05,.36,KIO,false);}
function dayBoard(name,days,bg,dcol){const tx=K.tex(512,360,()=>{});const draw=st=>K.redraw(tx,(x,w,h)=>{x.fillStyle=bg;x.beginPath();x.roundRect(0,0,w,h,36);x.fill();x.fillStyle='#fff';x.textAlign='center';x.font='800 58px Mont';x.fillText(name,w/2,82);
 if(st){x.font='800 46px Mont';x.fillStyle='#e8eef6';x.fillText('UP TO',w/2,170);x.fillStyle=dcol;x.font='800 120px Mont';x.fillText(days,w/2,305);}});draw(0);
 const g=K.group();g.userData.sc=.85;K.add(K.RB(1.42,1.0,.06,.05),K.M(0x15181c,.5),0,0,-.04,g);const m=K.add(new THREE.PlaneGeometry(1.36,.96),new THREE.MeshBasicMaterial({map:tx,toneMapped:false}),0,0,0,g,false);g.userData={draw,st:-1};g.visible=false;return g;}
const BD1=dayBoard('YOUR BANK','2 DAYS','#1d4f8f','#ffd21a'),BD2=dayBoard('OTHER BANK','5 DAYS','#b3261e','#ffffff');
// ================= armored truck + guards =================
const TRK=K.group(3.2,0,17.4);{const body=new THREE.MeshPhysicalMaterial({color:0x4d5862,roughness:.4,metalness:.5,clearcoat:.8}),dk=K.M(0x111316,.6),gl=new THREE.MeshPhysicalMaterial({color:0x14202b,roughness:.05,metalness:.3,clearcoat:1});
 K.add(K.RB(3.8,2.2,2.1,.12),body,-.7,1.55,0,TRK);K.add(K.RB(1.7,1.65,2.0,.14),body,2.1,1.25,0,TRK);K.add(K.B(.05,.7,1.7),gl,2.96,1.55,0,TRK);for(const z of[-1.01,1.01])K.add(K.B(1.0,.6,.02),gl,2.2,1.6,z,TRK);
 const at=K.tex(512,128,(x,w,h)=>{x.fillStyle='#4d5862';x.fillRect(0,0,w,h);x.fillStyle='#ffd21a';x.font='800 82px Mont';x.textAlign='center';x.fillText('ARMORED',w/2,96);});
 for(const z of[1.07,-1.07]){const pl=K.add(new THREE.PlaneGeometry(2.6,.65),new THREE.MeshStandardMaterial({map:at,roughness:.5}),-.7,1.7,z,TRK,false);if(z<0)pl.rotation.y=Math.PI;}
 TRK.userData.wh=[];for(const [x,z] of[[-1.9,-1.0],[-1.9,1.0],[2.1,-1.0],[2.1,1.0]]){const w=K.add(K.CY(.45,.45,.3,24),dk,x,.45,z,TRK);w.rotation.x=Math.PI/2;TRK.userData.wh.push(w);}}
const SBOX=K.group();{const st=K.M(0x6f767e,.35,.85);K.add(K.B(.6,.5,.45),st,0,0,0,SBOX);K.add(K.B(.3,.08,.02),K.M(0x2b2f35,.3,.8),0,.06,.235,SBOX);}
const guard=await K.person('guard',null,0,0,12,0,0x333a44),boss=await K.person('manager',null,0,0,12,0,0x333a44);
function shades(){const g=K.group();const bk=K.M(0x070707,.15,.6);for(const s of[-1,1])K.add(K.RB(.07,.042,.012,.012),bk,s*.042,0,0,g,false);K.add(K.B(.03,.008,.008),bk,0,.012,0,g,false);return g;}
const SH1=shades(),SH2=shades();
const headW=P_=>{const b=P_.BN['head'];return b?b.getWorldPosition(V3()):P_.g.position.clone().add(V3(0,1.7,0));};
const FLASH=[];for(let i=0;i<5;i++){const m=K.add(new THREE.SphereGeometry(.09,12,8),new THREE.MeshBasicMaterial({color:0xffffff}),0,0,0,scene,false);m.visible=false;FLASH.push(m);}
// ================= vault + Federal Reserve set =================
const VG=K.group(VF,0,0);
{K.add(K.B(30,.2,20),pbr('marble_01',6,4,0xf2efe8),0,-.07,0,VG,false);K.add(new THREE.PlaneGeometry(30,10),new THREE.MeshStandardMaterial({map:pbr('painted_plaster_wall',6,2,0xe9e2d4).map,color:0xe9e2d4,roughness:.9}),0,5,-3,VG,false);
 const steel=K.M(0x9aa2ab,.25,.9);const ring=K.add(new THREE.TorusGeometry(1.45,.2,16,48),steel,-3,1.75,-2.9,VG);K.add(K.CY(1.42,1.42,.1,48),K.M(0x2e3338,.6,.4),-3,1.75,-2.97,VG).rotation.x=Math.PI/2;
 const door=K.group(-4.55,1.75,-2.8,VG);const d=K.add(K.CY(1.45,1.45,.4,48),steel,-1.0,0,.85,door);d.rotation.x=Math.PI/2;d.rotation.z=0;door.rotation.y=1.45;
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;K.add(K.CY(.05,.05,.7,8),K.M(0x6f767e,.3,.9),-1.0+Math.cos(a)*.35,Math.sin(a)*.35,1.15,door).rotation.x=Math.PI/2;}
 const fs=K.txt3('FEDERAL RESERVE',.22,0xc9932a,{ei:.08,p:VG});fs.position.set(4.0,3.7,-2.85);}
const VBOX=K.group(-3,1.05,-2.4,VG);{const st=K.M(0x6f767e,.35,.85);K.add(K.B(.9,.75,.7),st,0,0,0,VBOX);}
// sorting machine + shredder
const SORT=K.group(2.9,0,-1.2,VG);{K.add(K.RB(1.4,1.2,1.0,.05),K.M(0x6f767e,.35,.8),0,.6,0,SORT);K.add(K.B(.9,.05,.05),new THREE.MeshStandardMaterial({color:0x2fe06a,emissive:0x2fe06a,emissiveIntensity:.6}),0,1.0,-.52,SORT);K.add(K.B(.6,.12,.1),K.M(0x0b0b0b,.5),0,.75,-.5,SORT);}
const SHRD=K.group(5.4,0,-1.0,VG);{K.add(K.RB(1.1,1.1,.9,.05),K.M(0x2b2f35,.4,.6),0,.55,0,SHRD);K.add(K.B(.8,.06,.3),K.M(0x0b0b0b,.5),0,1.11,0,SHRD);
 const st=K.tex(320,96,(x,w,h)=>{x.fillStyle='#2b2f35';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 48px Mont';x.textAlign='center';x.fillText('SHREDDER',w/2,64);});K.add(new THREE.PlaneGeometry(.9,.27),new THREE.MeshStandardMaterial({map:st}),0,.8,.46,SHRD,false);
 K.add(K.B(1.0,.06,.6),K.M(0x9aa2ab,.3,.8),0,.32,.7,SHRD);}
const OLD=[];for(let i=0;i<4;i++){const n=MK.note(100,{curve:.01});n.traverse(m=>{if(m.isMesh){m.material=m.material.clone();m.material.color.set(0xa8a48e);}});VG.add(n);n.visible=false;OLD.push(n);}
const SBILL=[];for(let i=0;i<3;i++){const n=MK.note(100,{curve:.004});VG.add(n);n.visible=false;SBILL.push(n);}
const CONF=[];{const cols=[0x2fae4a,0xe9efe4,0x8fcf7a,0xffd21a];for(let i=0;i<60;i++){const m=K.add(new THREE.PlaneGeometry(.03,.09),new THREE.MeshStandardMaterial({color:cols[i%4],side:THREE.DoubleSide,roughness:.7}),0,0,0,VG,false);m.visible=false;CONF.push({m,a:i*2.39,s:.5+((i*37)%10)/10});}}
const HAT=K.group();{const g=K.add(new THREE.ConeGeometry(.09,.24,20),K.M(0xd42a8a,.5),0,.12,0,HAT,false);K.add(new THREE.SphereGeometry(.035,10,8),K.M(0xffd21a,.5),0,.25,0,HAT,false);}HAT.visible=false;
// ================= outside (end): phone, WEDNESDAY, receipt, clock, checks, CASH / PHONE =================
const PH2=phoneProp(scene);PH2.visible=false;PH2.scale.setScalar(.55);const LOCK2=padlock(scene);LOCK2.visible=false;
const WEDW=K.txt3('WEDNESDAY',.16,0xffd21a,{ei:.08});WEDW.visible=false;
const CK1=check3D(K),CK2=check3D(K),CK3=check3D(K),CK4=check3D(K);for(const c of[CK1,CK2,CK3,CK4])c.visible=false;
const CLK2=K.group();{const c=K.add(K.CY(.3,.3,.06,40),K.M(0x2b2f35,.4,.6),0,0,0,CLK2);c.rotation.x=Math.PI/2;const f=K.add(new THREE.PlaneGeometry(.54,.54),new THREE.MeshStandardMaterial({map:CLT,roughness:.6}),0,0,.035,CLK2,false);}CLK2.visible=false;
const RCPT=K.tex(256,512,(x,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font='800 34px Mont';x.textAlign='center';x.fillText('RECEIPT',w/2,60);x.fillStyle='#777';for(let i=0;i<5;i++)x.fillRect(30,100+i*40,(i%2?150:196),12);
 x.fillStyle='#111';x.font='800 30px Mont';x.fillText('DEPOSIT',w/2,340);x.font='800 56px Mont';x.fillText('$1,000',w/2,410);});
const REC=K.add(new THREE.PlaneGeometry(.13,.26),new THREE.MeshStandardMaterial({map:RCPT,roughness:.8,side:THREE.DoubleSide}),0,0,0,scene,false);REC.visible=false;
function signBoard(txt,col){const g=K.group();K.add(K.RB(.8,.36,.08,.05),K.M(col,.5),0,0,0,g);const m=K.txt3(txt,.17,0xffffff,{ei:.05,p:g});m.position.set(0,0,.06);return g;}
const SCASH=signBoard('CASH',0x21a052),SPHONE=signBoard('PHONE',0x1d4f8f);SCASH.visible=SPHONE.visible=false;
// ================= camera: story shots =================
SH[1].keys.push(
 [tCounter+.5,[-.9,YA+2.4,-6.4],[-1.3,YA+2.15,0],48],[tScan-.25,[-1.4,YA+2.3,-6.6],[-1.4,YA+2.0,0],48],[tScan+.25,[-2.2,YA-.2,-7.4],[-2.4,YA-1.2,0],50],
 [tInk-.3,[-.1,YB+1.8,-7.6],[0,YB+1.6,0],48],[tNoF,[0,YB+1.8,-7.4],[0,YB+1.6,0],48],[tEven+.25,[.1,YB+1.6,-4.9],[0,YB+1.4,0],46],[tOne,[.4,YB+1.8,-5.4],[.5,YB+1.6,0],48],
 [tRej,[1.4,YB+2.0,-6.0],[1.5,YB+1.8,0],50],[tRest+.35,[1.8,YB+.6,-6.2],[1.9,YB-.4,0],50],[tLocked,[.6,YC+1.8,-6.4],[.2,YC+1.2,0],50],[tStuck,[-1.3,YC+1.75,-3.6],[-1.4,YC+1.6,0],42],
 [tBad+.2,[-2.8,YC+2.2,-10.4],[-2.85,YC+1.9,0],46],[tRent+.2,[-3.0,YC+2.2,-9.8],[-3.0,YC+1.9,0],46],[tTwist-.15,[-2.0,YC+2.6,-9.8],[-1.0,YC+6,0],50],
 [tTwist+.35,[3.6,6.2,-6.4],[4.3,6.0,0],46],[tApp-.2,[3.8,5.6,-6.6],[4.4,5.1,0],48],[tApp+.35,[4.2,3.4,-5.0],[4.4,3.2,0],46],[W1-.05,[4.2,3.4,-5.2],[4.4,3.2,0],46],[W1,[4.2,3.5,-5.2],[4.4,9,0],54]);
SH.push(
 {t0:W1,set:'out2',keys:[[W1,[4.4,2.3,15.3],[4.4,9,8.3],54],[W1+.45,[4.6,2.3,16.0],[4.6,2.1,8.4],44],[tLater-.1,[4.6,2.3,15.6],[4.6,2.1,8.4],44],
  [tTruck+.35,[-6.8,3.3,11.8],[1.0,1.2,16.2],48],[W2-.3,[-6.4,3.2,11.6],[1.8,1.2,16.4],48],[W2,[-4.0,2.6,13.2],[-2,9,15],54]]},
 {t0:W2,set:'vf',o:[VF,0,0],keys:[[W2,[-3,2.6,6],[-3,9,-3],54],[W2+.45,[-3,2.0,5.4],[-3,1.6,-2],46],[tExtra,[-2.7,2.0,5.6],[-2.8,1.6,-2],46],[tFed+.3,[3.9,2.3,4.8],[4.0,1.9,-2],46],
  [tWorn,[4.2,2.1,5.4],[4.6,1.4,-1.5],46],[tConf,[5.0,1.8,4.0],[5.4,1.2,-.5],44],[tParty+.2,[5.4,1.5,2.8],[5.45,1.15,0],38],[W3-.05,[5.4,1.5,2.8],[5.45,1.15,0],38],[W3,[5.4,1.6,2.9],[5.45,8,0],52]]},
 {t0:W3,set:'out3',keys:[[W3,[2.6,2.3,13.4],[2.6,9,8.4],54],[W3+.45,[2.5,1.9,13.0],[2.5,1.6,8.4],44],[tPops-.2,[2.6,1.8,12.6],[2.7,1.4,8.4],42],[tPops+.3,[3.2,1.5,11.6],[3.1,1.0,8.4],42],
  [tFull+.3,[2.9,1.75,12.4],[2.9,1.35,8.6],42],[tBefore+.2,[2.6,1.8,12.9],[2.6,1.45,8.6],44],[tUse+.4,[3.2,1.8,12.4],[3.1,1.45,8.6],44],[tReceipt+.5,[2.9,1.7,11.4],[2.9,1.45,8.8],40],
  [tSo,[2.9,1.85,14.3],[2.9,1.6,8.8],44],[DUR,[2.9,1.85,14.6],[2.9,1.6,8.8],44]]});
// ================= the raft path (local x, y on the tracks) =================
const RK=[[tFirst+.4,-.7,YA],[tCounter+.5,-1.3,YA],[tScan-.25,-1.3,YA],[tScan+.15,-2.95,YA],[tScan+.55,-2.4,YB],[tNoF,-.9,YB],[tEven+.25,0,YB],[tOne,0,YB],[tRest-.1,1.3,YB],[tRest+.35,2.95,YB],[tRest+.75,2.4,YC],[tLocked,-1.45,YC]];
// ================= STORY ANIMATION =================
function story(tt){t=tt;
 const sN=t>=tFirst-.05;   // story has started (inside part)
 // ---- inside: raft + Mike ----
 const inIG=sN&&t<W1;
 if(sN){BIG.visible=t<tFirst+.4;if(BIG.visible){BIG.position.set(IN+KF(t,RK)[0],YA+RH+2.0,0);}}
 if(sN&&t>=tFirst+.4){const [rx,ry]=KF(t,RK);RAFT.position.set(rx,ry+.02,0);RAFT.rotation.z=0;
  // bills flip through the counter one by one
  RAFT.children.forEach((n,i)=>{const k=9-i,t0=tCounter+.15+k*(tSecond+.3-tCounter-.15)/10,u=sm(t0,t0+.22,t)*(1-0);const base=.01+i*.011;
   n.position.y=base+(t>t0&&t<t0+.22?.9*Math.sin(Math.PI*sm(t0,t0+.22,t)):0);n.position.x=.04*Math.sin(i*1.9)-(t>t0&&t<t0+.22?.5*Math.sin(Math.PI*sm(t0,t0+.22,t)):0);n.rotation.x=-Math.PI/2-2*Math.PI*u;
   n.visible=!(i===9&&t>tOne+.2&&t<tRest-.05);});
  cntDraw(Math.max(0,Math.min(10,Math.floor((t-tCounter-.15)/((tSecond+.3-tCounter-.15)/10))+1)));
 }
 RAFT.visible=inIG;mikeI.g.visible=(inIG)||(t>=tParty-.1&&t<W3);
 const MI=mikeI;
 if(inIG&&t>=tFirst+.4){const [rx,ry]=KF(t,RK);K.relax(MI);K.idle(MI,t);MI.g.scale.setScalar(1);MI.g.rotation.set(0,Math.PI,0);
  const drop=Math.max(K.win(t,tScan,tScan+.55,.08),K.win(t,tRest+.3,tRest+.75,.08));let mx=rx,my=ry+.02+RH,mz=.05;
  if(t<tScan){const duck=K.win(t,tFirst+.4,tCounter+.6,.2);K.pose(MI,'spine03',.55*duck,0,0);K.pose(MI,'head',.3*duck,0,0);if(duck<.5){K.pose(MI,'head',-.25,.25*Math.sin(t*4),0);K.face(MI,{smile:.8,jaw:.2});K.arm(MI,'R',AD[0]+.3,AD[2]-.9,.6);}}
  else if(t<tNoF){const a=sm(tInk-.1,tInk+.1,t);MI.g.rotation.y=Math.PI-.7*a;K.point(MI,'L',a);K.face(MI,{smile:.6});}
  else if(t<tEven){K.shrug(MI,K.win(t,tNoF,tEven-.1,.15));K.face(MI,{jaw:.35});}
  else if(t<tOne){const a=sm(tEven,tEven+.25,t);K.arm(MI,'L',AD[0]+.1,AD[2]-1.45*a,0);K.arm(MI,'R',AD[0]+.1,AD[2]-1.45*a,0);K.face(MI,{smile:1.0});}   // T-pose for the scan
  else if(t<tRest){const lk=sm(tSpit,tSpit+.3,t);MI.g.rotation.y=Math.PI-.9*lk;const grab=sm(tRej+.2,tRej+.4,t);if(t<tRej+.2)K.point(MI,'L',lk);else K.arm(MI,'L',AD[0]+1.4*(1-grab*.5),AD[2]-.6,.4+grab);K.face(MI,{jaw:.4*lk});}
  else if(t<tLocked+.2){K.armsUp(MI,1);K.face(MI,{jaw:.6});}
  else{mx=-1.4;MI.g.rotation.y=Math.PI;if(t<tRent+.2){const h=sm(tLocked+.3,tStuck,t);K.arm(MI,'L',AD[0]+1.25*h,AD[2]-.9*h,.4*h);K.arm(MI,'R',AD[0]+1.25*h,AD[2]-.9*h,.4*h);K.face(MI,{jaw:.3,smile:-.3});K.pose(MI,'head',0,.2*Math.sin(t*1.5),0);}   // hands on the bars
   else{K.headHold(MI,sm(tRent+.2,tRent+.45,t));K.face(MI,{jaw:.5});}}
  if(drop>0){K.armsUp(MI,drop);K.face(MI,{jaw:.7});}
  MI.g.position.set(IN+mx,my,mz);MI.g.updateMatrixWorld(true);}
 // ---- scan: words + checks, red X on "no fakes", sweep line over Mike, green check on "clean" ----
 SW.forEach((o,i)=>{popS(o.m,o.tt,1,i<2?SW[i+1].tt-.05:tNoF-.05,.2);face2cam(o.m);{const c=t>o.tt+.25?0x2fe06a:0xffffff;o.m.material[0].color.set(c);o.m.material[0].emissive.set(c);}});
 BEAM.material.color.set(K.win(t,tNoF,tEven-.2,.05)>.5?0xff3b3b:0x2fe06a);
 {const a=popS(XF,tNoF,.5,tEven-.25);XF.position.set(0,YB+3.15,-.3);face2cam(XF);}
 {const u=sm(tEven+.25,tClean-.05,t);SWEEP.visible=t>tEven+.2&&t<tClean;SWEEP.position.set(0,YB+2.4-2.2*u,-.3);SWEEP.rotation.y=Math.PI;}
 {popS(CHC,tClean,.45,tOne);CHC.position.set(0,YB+RH+2.15,-.2);face2cam(CHC);}
 // ---- the wrinkled bill: crumples, is spat out (red X), Mike catches it, flattens it, back on the pile ----
 {const on=t>tOne+.2&&t<tRest-.05;WB.visible=on&&inIG;if(WB.visible){const [rx,ry]=KF(t,RK);const c=sm(tOne+.2,tSpit,t),fl=sm(tRej+.3,tRest-.15,t),out=sm(tSpit,tSpit+.4,t);
  MK.bend(WB,.02*c*(1-fl),.015*c*(1-fl));const p0=V3(rx,ry+.15,0),p1=V3(rx+1.7,ry+2.6,-.4),hand=V3(rx+.55,ry+RH+1.2,-.3);
  const p=t<tRej+.2?p0.clone().lerp(p1,out):p1.clone().lerp(hand,sm(tRej+.2,tRej+.4,t)).lerp(p0,sm(tRest-.35,tRest-.1,t));p.y+=t<tRej+.2?0:0;WB.position.copy(p);if(out>.02&&fl<.98){face2cam(WB);WB.rotateZ(.6*Math.sin(t*5)*(1-fl));}else WB.rotation.set(-Math.PI/2,0,Math.PI);}
  const a=popS(XR2,tRej,.35,tRej+.4);XR2.position.copy(WB.position).add(V3(0,.45,-.2));face2cam(XR2);
}
 // ---- box: shutter slams on "locked", clock/calendar, AFTER CUTOFF, FRI -> MON, RENT DUE ----
 {const s=sm(tLocked+.15,tLocked+.4,t);SHUT.scale.y=Math.max(.01,s);SHUT.position.y=2.7-1.35*s;SHUT.visible=s>.01;}
 popS(CUTW,tCut,1,tCounts+.2);CUTW.position.set(-4.3,YC+4.95,-.4);face2cam(CUTW);
 calDraw(t<tCounts+.3?'FRIDAY':t<tCounts+.65?'SATURDAY':t<tMon-.05?'SUNDAY':'MONDAY');
 {const a=pop(t,tRent+.3,.25);RENT.visible=a>.01;RENT.scale.setScalar(Math.max(.01,a));}
 // ---- computer + phone (on hold, padlock on "locked") ----
 {const a=popS(PH1,tApp,1,W1+.5);const b=popS(LOCK1,tLockW,1.4,W1+.5);LOCK1.position.set(4.4,3.25,-1.05);face2cam(LOCK1);if(t<tLift)phDraw(0);}
 // ---- outside 2: own ATM (2 days) vs another bank's ATM (5 days) ----
 KIO.visible=t>=W1;
 for(const [b,t0,t1,x] of[[BD1,tOwn,tTwo,3.4],[BD2,tAnother,tFive-.2,5.5]]){popS(b,t0,.85,tLater-.1,.25);b.position.set(x,3.0,8.9);face2cam(b);const st=t>=t1?1:0;if(st!==b.userData.st){b.userData.st=st;b.userData.draw(st);}}
 // ---- armored truck + guards carrying the steel box (camera flashes) ----
 const trk=t>=tLater-.3&&t<W2+.2;TRK.visible=trk;guard.g.visible=boss.g.visible=trk;SBOX.visible=trk;
 if(trk){const u=sm(tTruck-.1,tVault-.4,t),gp=V3(-1.2+1.6*u,0,12.6+4.2*u);K.relax(guard);K.walk(guard,t,u<1?.35:0);guard.g.position.copy(gp);guard.g.rotation.y=Math.atan2(1.6,4.2);K.handsFront(guard,1);guard.g.updateMatrixWorld(true);
  const bp=V3(-2.0+1.6*u,0,12.3+4.2*u);K.relax(boss);K.walk(boss,t+.3,u<1?.35:0);boss.g.position.copy(bp);boss.g.rotation.y=Math.atan2(1.6,4.2);K.crossArms(boss,.8);boss.g.updateMatrixWorld(true);
  const into=sm(tVault-.4,tVault-.1,t);SBOX.position.copy(wristW(guard,'R').add(wristW(guard,'L')).multiplyScalar(.5).add(V3(0,.05,.12))).lerp(V3(1.0,1.6,17.4),into);SBOX.rotation.y=guard.g.rotation.y;
  for(const [g_,P_] of[[SH1,guard],[SH2,boss]]){g_.visible=true;g_.position.copy(headW(P_)).add(V3(.035,.04,.1).applyAxisAngle(V3(0,1,0),P_.g.rotation.y));g_.rotation.y=P_.g.rotation.y;}
  TRK.position.x=3.2+3*sm(tVault-.15,W2+.2,t)**2;for(const w of TRK.userData.wh)w.rotation.y=-(TRK.position.x-3.2)/.45;}
 else{SH1.visible=SH2.visible=false;}
 // camera flashes ("guarded like a celebrity"): outside around the guards, then at the vault
 FLASH.forEach((m,i)=>{const ph=(t*3.1+i*.37)%1;const live=(t>tTruck&&t<W2)||(t>W2+.2&&t<tExtra);m.visible=live&&ph<.12;if(m.visible){if(t<W2)m.position.set(-2.5+i*1.1,1.4+.4*Math.sin(i*3),14.5+.5*Math.cos(i*2));else m.position.set(VF-5+i*1.0,1.5+.4*Math.sin(i*3),-.2+.5*Math.cos(i*2));}});
 // ---- vault + Fed: two guards stand at the open vault (box inside), bills checked, worn-out bills shredded -> confetti, tiny Mike party ----
 if(t>=W2&&t<W3){guard.g.visible=boss.g.visible=true;for(const [P_,x] of[[guard,-3.9],[boss,-2.1]]){K.relax(P_);K.idle(P_,t,x);P_.g.position.set(VF+x,0,-1.0);P_.g.rotation.y=0;K.crossArms(P_,1);P_.g.updateMatrixWorld(true);}
  for(const [g_,P_] of[[SH1,guard],[SH2,boss]]){g_.visible=true;g_.position.copy(headW(P_)).add(V3(0,.04,.11));g_.rotation.y=0;}}
 SBILL.forEach((n,i)=>{const f=((t-tMach)*.9+i/3)%1;n.visible=t>tFed&&t<tWorn+.6;if(n.visible){n.position.set(1.2+1.2*f,1.02,-1.2);n.rotation.set(-Math.PI/2,0,Math.PI);}});
 OLD.forEach((n,i)=>{const t0=tWorn+.15+i*.2,u=sm(t0,t0+.5,t);n.visible=t>tWorn-.2&&u<.99;if(n.visible){n.position.set(5.4-.6+.6*u-.2+i*.1,1.9-.75*u,-1.0);n.rotation.set(-Math.PI/2+.4,.2*i,Math.PI);MK.bend(n,.015,.01);}});
 CONF.forEach((c,i)=>{const f=t-tShred-i*.012;c.m.visible=f>0&&t<W3;if(c.m.visible){const g=Math.min(f,1.6);c.m.position.set(5.4+.6*Math.sin(c.a)*g*c.s,.45+1.8*g*c.s-1.6*g*g,-.4+.9*g+.3*Math.cos(c.a)*g);if(c.m.position.y<.36)c.m.position.y=.36+.002*i;c.m.rotation.set(c.a+f*5,f*4,c.a);}});
 if(t>=tParty-.1&&t<W3){K.relax(MI);MI.g.scale.setScalar(.22);MI.g.position.set(VF+5.45,.35,-.25);MI.g.rotation.set(0,0,0);K.armsUp(MI,.8+.2*Math.sin(t*10));K.face(MI,{smile:1.2,jaw:.3});K.pose(MI,'spine03',0,.25*Math.sin(t*6),0);MI.g.updateMatrixWorld(true);
  HAT.visible=true;HAT.scale.setScalar(.25);HAT.position.copy(headW(MI)).add(V3(0,.03,0));}else HAT.visible=false;
 // ---- outside 3: Wednesday -> lock breaks, AVAILABLE -> Mike pops out of the ATM -> tips -> receipt -> CASH / PHONE ----
 const o3=t>=W3;
 {popS(PH2,tWed,.55,tPops-.1);PH2.position.set(2.2,1.6,8.75);face2cam(PH2);PH2.rotateY(Math.PI);if(t>=tLift)phDraw(1);
  const br=sm(tLift,tLift+.35,t);LOCK2.visible=o3&&t<tLift+.45&&t<tPops;if(LOCK2.visible){LOCK2.scale.setScalar(.7*Math.max(.01,pop(t,W3+.2,.25)));LOCK2.position.set(2.2,1.75-.5*br*br,8.95+.3*br);LOCK2.rotation.set(0,0,2.5*br);LOCK2.userData.sh.position.y=.25+.25*br;}
  popS(WEDW,tWed,1,tPops-.1);WEDW.position.set(2.65,2.35,8.8);face2cam(WEDW);
  popS(CK1,tReady,.35,tPops-.1);CK1.position.set(2.75,1.95,8.95);face2cam(CK1);}
 const M_=mike;
 if(t>=tPops){M_.g.visible=true;K.relax(M_);K.idle(M_,t);const g=sm(tPops,tFull+.1,t);const p0=SLOT.clone(),p1=V3(2.95,0,9.15);M_.g.position.copy(p0).lerp(p1,g);M_.g.position.y+= .4*Math.sin(Math.PI*g);M_.g.scale.setScalar(.02+.98*g);M_.g.rotation.set(0,(1-g)*2.5,0);
  if(t<tWant){K.armsUp(M_,1);K.face(M_,{smile:1.1,jaw:.4});}
  else if(t<tReceipt){K.shrug(M_,K.win(t,tWant,tBefore-.1,.15));const a=K.win(t,tBefore,tUse-.1,.15),b=K.win(t,tUse,tReceipt-.1,.15);if(a>0)K.point(M_,'R',a);if(b>0){M_.g.rotation.y=-.5*b;K.point(M_,'L',b);}K.face(M_,{smile:.7});}
  else if(t<tSo){const r=sm(tReceipt+.2,tReceipt+.5,t);M_.g.rotation.y=-.4*(1-r);K.arm(M_,'R',AD[0]+.9*r,AD[2]-1.0*r,.5*r);K.face(M_,{smile:.8});}
  else{const a1=K.win(t,tCashW,tPhoneW-.1,.15),a2=K.win(t,tPhoneW,tComment,.15);if(a1>0)K.point(M_,'R',a1);if(a2>0)K.point(M_,'L',a2);if(t>tComment){K.arm(M_,'R',AD[0]+.7,AD[2]-.5,1.3);K.arm(M_,'L',AD[0]+.7,AD[2]-.5,1.3);}K.face(M_,{smile:.8});}
  M_.g.updateMatrixWorld(true);}
 {popS(CLK2,tBefore,1,tReceipt-.1);CLK2.position.set(1.85,1.9,9.1);face2cam(CLK2);popS(CK2,tBefore+.5,.3,tReceipt-.1);CK2.position.set(2.2,2.25,9.2);face2cam(CK2);
  popS(CK3,tUse+.6,.35,tReceipt-.1);CK3.position.set(3.2,2.55,8.6);face2cam(CK3);}
 {REC.visible=t>tReceipt&&t<tSo;if(REC.visible){const pr=sm(tReceipt,tReceipt+.25,t),r=sm(tReceipt+.2,tReceipt+.5,t);const slotP=V3(3.2,1.32,8.4);const hand=t>=tPops?wristW(M_,'R').add(V3(.0,.1,.06)):slotP;REC.position.copy(slotP).lerp(hand,r);REC.position.y+= .1*pr*(1-r);REC.scale.setScalar(Math.max(.05,pr)*(1+.6*r));face2cam(REC);}
  popS(CK4,tProof,.3,tSo);if(t>tMis){CK4.position.copy(REC.position).add(V3(.22,.12,.05));face2cam(CK4);}}
 {const pul=t0=>1+.2*Math.exp(-Math.pow((t-t0-.08)*6,2));const a=popS(SCASH,tCashW,1),b=popS(SPHONE,tPhoneW,1);if(a>.01)SCASH.scale.setScalar(a*pul(tCASH));if(b>.01)SPHONE.scale.setScalar(b*pul(tPHONE));
  SCASH.position.set(2.3,2.35,9.4);SPHONE.position.set(3.5,2.35,9.4);face2cam(SCASH);face2cam(SPHONE);}
 // the hook's outside props stay hidden after the dive
 if(t>=tIn){for(const n of NOTES)n.visible=false;}
 // ---- light: the sun follows the camera (shadows stay sharp in every place) ----
 const gx=cam.position.x+LOOK.x*8,gz=cam.position.z+LOOK.z*8;sun.target.position.set(gx,0,gz);sun.position.set(gx-20,26,gz+22);sun.target.updateMatrixWorld();
}
