// ================= EP13 HOOK: "If Abdul El-Sayed becomes President tomorrow. What actually happens to your money?" =================
// Readable with NO sound: stage in front of the U.S. GOVERNMENT building, El-Sayed at a lectern raises his right hand (oath),
// the board behind him lights PRESIDENT + confetti; Mike (blue tee) in the foreground holds a fan of $100 bills.
// Then the camera orbits round Mike (never through him) -> he looks down at his money -> TIGHT glowing zoom on the money + yellow "?".
// Voice = the user's own ElevenLabs 'Zack' take (1.15x), word times from timeline_ep13.json. HYPOTHETICAL tag on screen.
const T13=w=>{const k=TLN.words.find(x=>x.w.toLowerCase().replace(/[^a-z-]/g,'')===w);return k?k.s:0;};
const tName=T13('el-sayed'),tBec=T13('becomes'),tPres=T13('president'),tTom=T13('tomorrow'),tWhat=T13('what'),tHap=T13('happens'),tYour=T13('your'),tMoney=T13('money');
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;
// clear the EP10 crate / pallet / Israel flag off the stage (every non-person mesh in that box)
{const bx=new THREE.Box3(V3(GX+1.0,SY-.06,17.4),V3(GX+3.8,3.4,20.3)),bx2=new THREE.Box3(V3(GX-1.4,SY+.6,18.2),V3(GX-.4,SY+1.0,18.7)),c=V3();scene.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh){new THREE.Box3().setFromObject(o).getCenter(c);if(bx.containsPoint(c)||bx2.containsPoint(c))o.visible=false;}});FLY.forEach(m=>m.visible=false);}
const ovr=document.createElement('div');ovr.textContent='HYPOTHETICAL';ovr.style.cssText='position:absolute;left:0;right:0;top:2.2%;text-align:center;color:#ffd21f;font:800 34px Mont,sans-serif;letter-spacing:6px;text-shadow:0 3px 8px rgba(0,0,0,.85),0 0 3px #000';if(Q.get('hyp'))document.getElementById('ov').appendChild(ovr);   // tag removed by the user's request (kept behind ?hyp=1)
// ---- the board: PRESIDENT / EL-SAYED (lights up on "president") ----
function presBoard(){const x=BDC.getContext('2d');x.fillStyle='#0d1838';x.fillRect(0,0,1024,540);x.fillStyle='#b22234';x.fillRect(0,452,1024,30);x.fillStyle='#fff';x.fillRect(0,482,1024,30);
 x.fillStyle='#fff';for(let i=0;i<9;i++){const cx=112+i*100,cy=70;x.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?10:24;x.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}x.fill();}
 x.textAlign='center';x.fillStyle='#fff';x.font='800 150px Mont';x.fillText('PRESIDENT',512,262);x.fillStyle='#ffc61a';x.font='800 118px Mont';x.fillText('EL-SAYED',512,402);
 x.strokeStyle='#ffc61a';x.lineWidth=10;x.strokeRect(8,8,1008,524);BDT.needsUpdate=true;}
presBoard();fl.scale.set(1.25,1.25,1);fl.position.y=SY+2.95;
// ---- lectern with a navy seal ----
const ELZ=19.05,LZ=18.6;
{const wd=M(0x5b3a22,.45),g=new THREE.Group();g.position.set(GX,SY,LZ);scene.add(g);add(B(.66,1.0,.42),wd,0,.5,0,g);add(B(.78,.06,.5),wd,0,1.02,-.02,g);
 const st=tex(256,256,x=>{x.fillStyle='#0d1838';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.strokeStyle='#d4af37';x.lineWidth=12;x.beginPath();x.arc(128,128,108,0,7);x.stroke();
  x.fillStyle='#d4af37';for(let i=0;i<13;i++){const a=i/13*Math.PI*2,cx=128+Math.cos(a)*84,cy=128+Math.sin(a)*84;x.beginPath();x.arc(cx,cy,7,0,7);x.fill();}x.font='800 72px Mont';x.textAlign='center';x.fillText('US',128,152);});
 const s=add(new THREE.CircleGeometry(.22,40),new THREE.MeshStandardMaterial({map:st,roughness:.5,metalness:.2}),0,.6,-.215,g,false);s.rotation.y=Math.PI;}
flagPole(GX+2.15,19.75,3.05,.85);   // US flag beside El-Sayed (flies toward him, behind his shoulder)
// ---- El-Sayed ----
const ELS=person('elsayed',GX,SY,ELZ,Math.PI);FK.rig(ELS,{iris:'#3b2618',brow:'#1e1612'});TR.g.visible=false;
ELS.g.traverse(o=>{if(o.isMesh&&/short04|eyebrow/i.test(o.name+o.material.name)){o.material.roughness=.95;o.material.envMapIntensity=.12;o.material.color.setScalar(.55);o.material.needsUpdate=true;}});
{const pin=add(new THREE.PlaneGeometry(.035,.022),FLAGM,0,0,0,scene,false);ELS.g.updateMatrixWorld(true);const sp=ELS.BN.spine01||ELS.BN.spine02;const h=ELS.BN.spine03?ELS.BN.spine03.getWorldPosition(V3()):V3(GX,SY+1.3,ELZ);
 pin.position.set(GX+.11,h.y+.12,ELZ-.15);pin.rotation.y=Math.PI;scene.add(pin);(ELS.BN.spine03||sp).attach(pin);}
// ---- confetti (red / white / blue / gold) on "president" ----
const CONF13=new THREE.InstancedMesh(new THREE.PlaneGeometry(.05,.03),new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.6,emissive:0x222222}),160);scene.add(CONF13);
const CC=[0xd21e2a,0xffffff,0x1d3fa8,0xffc61a],CSEED=[];for(let i=0;i<160;i++){CONF13.setColorAt(i,new THREE.Color(CC[i%4]));CSEED.push([(Math.sin(i*12.9)*.5+.5),(Math.sin(i*78.2)*.5+.5),(Math.sin(i*39.4)*.5+.5)]);}CONF13.instanceColor.needsUpdate=true;
const _cm=new THREE.Object3D();
function confetti(t){const d=t-tPres;CONF13.visible=d>0&&d<3.6;if(d<=0)return;for(let i=0;i<160;i++){const [a,b,c]=CSEED[i];
 _cm.position.set(GX+(a-.5)*5.2+Math.sin(d*2+i)*.15,4.6+b*1.4-d*(1.1+c*.6),ELZ-.6-c*2.2);_cm.rotation.set(d*(3+a*4)+i,d*(2+b*3),i);_cm.updateMatrix();CONF13.setMatrixAt(i,_cm.matrix);}CONF13.instanceMatrix.needsUpdate=true;}
// ---- Mike's fan of $100 bills (glowing green rim) in his right hand ----
const FAN=MNY.fan(100,7,{spread:.85,glow:.09});FAN.scale.setScalar(1.15);scene.add(FAN);{const f2=MNY.fan(100,7,{spread:.85,glow:.09});f2.rotation.y=Math.PI;f2.position.z=-.003;FAN.add(f2);FAN.userData.back=f2;}   // fronts on both sides (money-kit backs are blank)
const QM=popT('?',.2,YEL,V3(GX+.18,1.2,16.25),tYour-.12,6);
const MIK0=V3(GX+.62,0,15.8);let MRA=null;
function mikeHook(t){const P=MIKE;P.g.visible=true;P.g.position.copy(MIK0);P.g.rotation.y=-.08;relax(P);idle(P,t,1.3);
 if(!MRA){P.g.updateMatrixWorld(true);MRA={low:solveReach(P,'R',V3(GX+.16,1.0,15.98))};relax(P);MRA.up=solveReach(P,'R',V3(GX+.5,1.22,16.12));relax(P);}
 const k=sm(tWhat-.1,tWhat+.35,t),a=lerpA(MRA.low,MRA.up,k);setA(P,'R',a);
 const look=sm(tWhat,tWhat+.3,t)*(1-sm(tMoney-.05,tMoney+.25,t));pose(P,'head',.42*look,0,0);pose(P,'spine03',.08*look,0,0);
 P.g.updateMatrixWorld(true);const w=P.BN.wristR.getWorldPosition(V3()),q=P.BN.wristR.getWorldQuaternion(new THREE.Quaternion());
 curl(P,'R',.75,.55);P.g.updateMatrixWorld(true);const fb=P.BN['finger3-1R']||P.BN.wristR;fb.getWorldPosition(FAN.position);fb.getWorldQuaternion(FAN.quaternion);
 const FR=[[0,0,0],[Math.PI/2,0,0],[0,0,Math.PI/2],[0,Math.PI/2,0],[-Math.PI/2,0,0],[0,0,-Math.PI/2],[Math.PI/2,Math.PI,0],[0,Math.PI,Math.PI/2]][Number(Q.get('fr')||7)];FAN.rotateX(FR[0]);FAN.rotateY(FR[1]);FAN.rotateZ(FR[2]);
 FAN.userData.back.visible=t<tWhat-.05;   // the mirrored fan only while the camera is behind Mike
 const up=sm(tMoney-.05,tMoney+.25,t);FK.update(P,t,{expr:[['doubt',.55*sm(tWhat,tWhat+.3,t)*(1-up)],['shock',.7*up]],look:up>.5?cam.position:look>.5?FAN.position:V3(GX,SY+1.6,ELZ)});}
let ELA=null;
function elsHook(t){const P=ELS;relax(P);idle(P,t,.4);P.g.position.set(GX,SY,ELZ);P.g.rotation.y=Math.PI;
 // right hand up (oath) on "becomes", both arms up on "president", a wave to the crowd on "tomorrow"
 const oath=sm(tName,tBec+.15,t)*(1-sm(tPres-.05,tPres+.15,t)),cheer=sm(tPres-.05,tPres+.2,t)*(1-sm(tTom+.25,tTom+.55,t)),wv=sm(tTom+.25,tTom+.55,t);
 if(oath>0)arm(P,'R',AD[0]+.25*oath,AD[2]-1.85*oath,1.55*oath);
 if(cheer>0)armsUp(P,cheer);
 if(wv>0)wave(P,'R',t);
 if(oath===0&&cheer===0&&wv===0){arm(P,'R',AD[0]+.3,AD[2]-.25,.9);arm(P,'L',AD[0]+.3,AD[2]-.25,.9);}   // hands resting on the lectern
 face(P,{jaw:.03+.035*Math.abs(Math.sin(t*9))*(t<tWhat?1:0),smile:.5});
 FK.update(P,t,{expr:[['joy',.55+.35*cheer]],look:t>tTom-.1?cam.position:V3(GX+.62,1.6,15.8)});
 fl.material.color.setScalar(.25+.75*sm(tPres-.08,tPres+.12,t));}
let story13=()=>{};
function animate(t){updPops(t);updC(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;fl.visible=true;elsHook(t);mikeHook(t);confetti(t);story13(t);
 {const pa=FG2.attributes.position;for(let i=0;i<pa.count;i++){const u=(pa.getX(i)+1.2)/2.4;pa.setZ(i,Math.sin(u*6-t*5)*.12*u);}pa.needsUpdate=true;FG2.computeVertexNormals();}}
// ---------- camera: wide over Mike's shoulder (place + president + money) -> push to the board -> orbit round Mike -> tight glowing zoom on the money ----------
const ELSB=CK.box([GX-.45,SY,ELZ-.3],[GX+.45,SY+1.75,ELZ+.2]),LECT=CK.box([GX-.4,SY,LZ-.25],[GX+.4,SY+1.05,LZ+.25]);
const BOARD=CK.box([GX-1.2,SY+2.95-.65,20.45],[GX+1.2,SY+2.95+.65,20.45]),FANB=()=>{FAN.updateMatrixWorld(true);return new THREE.Box3().setFromObject(FAN);};
const MHEAD=V3(GX+.6,1.6,15.83);
mikeHook(tMoney+.3);const FAN_UP=FANB();mikeHook(0);const FAN_LOW=FANB();
if(Q.get('dbgbox')){const bx=new THREE.Box3(V3(GX-3,SY+.3,17.2),V3(GX-.35,SY+1.6,20)),c=V3();scene.traverse(o=>{if(o.isMesh&&o.visible){const bb=new THREE.Box3().setFromObject(o);bb.getCenter(c);if(bx.containsPoint(c))console.error('BOX',o.name,o.geometry.type,JSON.stringify(bb.min),JSON.stringify(bb.max));}});}
const SH13=[
 {t0:0,t1:tPres,a:()=>CK.overShoulder(MIKE,[GX,SY+1.6,ELZ],{side:-1,back:1.1,out:.75,up:.15,fov:46,top:.1,fit:[ELSB,LECT,BOARD,FAN_LOW]}),b:()=>CK.overShoulder(MIKE,[GX,SY+1.6,ELZ],{side:-1,back:1.1,out:.75,up:.15,fov:46,top:.1,fit:[ELSB,LECT,BOARD,FAN_LOW],slack:.9}),ease:'ramp'},
 {t0:tPres,t1:tTom,in:'whip',a:()=>CK.fit([CK.box([GX-.42,SY+1.0,ELZ-.2],[GX+.42,SY+1.85,ELZ]),CK.box([GX+.3,SY+1.6,19.75],[GX+.9,SY+2.15,19.75])],{dir:[.12,-.02,-1],fov:34,top:.08}),b:()=>CK.fit([CK.box([GX-.42,SY+1.0,ELZ-.2],[GX+.42,SY+1.85,ELZ]),CK.box([GX+.3,SY+1.6,19.75],[GX+.9,SY+2.15,19.75])],{dir:[.1,-.02,-1],fov:34,top:.08,slack:.9}),ease:'ramp'},
 {t0:tTom,t1:tWhat-.05,a:()=>CK.closeUp(ELS,{dist:1.15,fov:30,dy:-.12}),b:()=>CK.closeUp(ELS,{dist:1.0,fov:30,dy:-.1}),ease:'smooth'},
 {t0:tWhat-.05,t1:tMoney-.1,in:'whip',a:()=>CK.fit([CK.box([GX+.35,.75,15.6],[GX+.9,1.75,16.05]),FAN_UP],{dir:[-.3,.08,1],fov:38}),b:()=>CK.fit([CK.box([GX+.35,.75,15.6],[GX+.9,1.75,16.05]),FAN_UP],{dir:[-.32,.1,1],fov:38,slack:.9}),ease:'ramp'},
 {t0:tMoney-.1,t1:5.2,a:()=>CK.macro([FAN_UP,CK.popBox(QM)],{dir:[-.45,.25,1],fov:30,slack:.95}),b:()=>CK.macro([FAN_UP,CK.popBox(QM)],{dir:[-.4,.22,1],fov:30,slack:.85}),ease:'ramp'},
];
window.CAM13=Q.get('elsface')?(()=>CK.closeUp(ELS,{dist:.62,fov:27})):CK.track(SH13,{whip:.24});window.CAM13_END=5.2;
CK.boom(tPres,.6);CK.boom(tMoney,.8);
