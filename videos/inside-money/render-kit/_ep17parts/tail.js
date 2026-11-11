// ================= EP17 HOOK: "What happens to your tax if El-Sayed becomes president today? Three things decide it, and the last one decides everything." =================
// Same visual language as EP16 (US-flag map, real photo in a circle badge, number-only cards, steady camera, few SFX). Built on _ep16parts/base.js (map + helpers; its pump is hidden).
// Frame 1 (no sound): US-flag USA, El-Sayed PHOTO badge standing on Michigan, a big PAY STUB (west) with the FEDERAL TAX row = '?'.
// 'tax' = TAX row lights up; 'president' = map wipes flag -> blue, badge punch, pill EL-SAYED -> PRESIDENT?; 'Three' = 3 number cards; 'last' = card 3 grows + glows.
const tWhat=0,tTax=W15('tax'),tEls=W15('elsayed'),tBecomes=W15('becomes'),tPres17=W15('president'),tToday=W15('today'),tThree=W15('three'),tLast=W15('last'),tEvery=W15('everything');
const HOOK_END=W15('he');   // story starts on 'He just won a Senate seat'
PUMP.visible=false;
// ---- map wipe flag -> blue on 'becomes president' (overrides EP16 wipe15 timing) ----
function wipe17(t){const k=sm(tBecomes,tToday+.25,t);const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
// ---- PAY STUB (real look: white paper, grey bars, FEDERAL TAX row with a big '?') ----
const SP=mxz(-99.5,37.8);
const STUBC=canv15(768,1024);let STUBK='';
function stub17(hl,q){const key=hl.toFixed(2)+q;if(key===STUBK)return;STUBK=key;const x=STUBC.x;
 x.fillStyle='#f7f6f1';x.fillRect(0,0,768,1024);x.fillStyle='#14305e';x.fillRect(0,0,768,150);
 x.fillStyle='#fff';x.font='900 92px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('PAY STUB',384,80);
 x.strokeStyle='#c9c6bb';x.lineWidth=4;x.setLineDash([16,12]);x.beginPath();x.moveTo(30,980);x.lineTo(738,980);x.stroke();x.setLineDash([]);
 const row=(y,label,barW)=>{x.fillStyle='#2a2c31';x.font='800 50px Mont';x.textAlign='left';x.fillText(label,48,y);x.fillStyle='#cfccc2';x.beginPath();x.roundRect(768-48-barW,y-26,barW,52,14);x.fill();};
 row(250,'PAY',190);
 // FEDERAL TAX row: highlight box grows on 'tax'
 if(hl>0){x.fillStyle=`rgba(255,198,26,${.9*hl})`;x.beginPath();x.roundRect(22,330,724,240,26);x.fill();}
 x.fillStyle="#2a2c31";x.font="900 88px Mont";x.textAlign="left";x.fillText(q===2?"TAX":"YOUR TAX",48,452);
 if(q===2){x.fillStyle='#1fa651';x.font='900 92px Mont';x.textAlign='right';x.fillText('SAME',730,452);}else{x.fillStyle=q?'#d21e2a':'#2a2c31';x.font='900 200px Mont';x.textAlign='right';x.fillText('?',720,460);}
 row(680,'TAKE HOME',190);row(820,'DATE',150);
 STUBC.t.needsUpdate=true;}
stub17(0,0);
const STUB=new THREE.Group();STUB.position.copy(SP);STUB.rotation.y=Math.PI/2;scene.add(STUB);const STS=1.3;
{const sh=add(B(1.66,2.18,.04),M(0x1d1f24,.5,.2),0,1.3,-.03,STUB);
 const pg=add(new THREE.PlaneGeometry(1.56,2.08),new THREE.MeshBasicMaterial({map:STUBC.t,toneMapped:false}),0,1.3,0,STUB,false);pg.renderOrder=3;
 add(CY(.03,.03,.3,10),M(0x1d1f24,.5),0,.15,-.05,STUB);}
const STUBH=2.4*1.3;
// ---- El-Sayed: REAL PHOTO (U.S. Senate HELP committee 2024, public domain) in the circle badge, standing on Michigan ----
const PHOTO=await new THREE.TextureLoader().loadAsync('assets/elsayed_portrait.jpg');PHOTO.colorSpace=THREE.SRGBColorSpace;PHOTO.anisotropy=8;
const MI=mxz(-84.6,43.3),BH=3.2,BR=.66;
const BADGE=new THREE.Group();scene.add(BADGE);const BADGEI=new THREE.Group();BADGE.add(BADGEI);
const RINGB=add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:new THREE.Color(.45,1.1,3),toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,BADGEI,false);
add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,BADGEI,false);
{const fc=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:PHOTO,toneMapped:false}),0,0,0,BADGEI,false);fc.renderOrder=4;}
const FLASH=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({color:0x2c7ce6,toneMapped:false,transparent:true,opacity:0,depthWrite:false}),0,0,.002,BADGEI,false);FLASH.renderOrder=5;
const STEM=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),MI.x,US_Y+(BH-BR)/2,MI.z,scene,false);STEM.rotation.x=Math.PI;
const PEL=pill('EL-SAYED',1.2);PEL.material.depthTest=false;PEL.renderOrder=9;
const PPR=pill('PRESIDENT?',1.35);PPR.material.depthTest=false;PPR.renderOrder=9;
function els17(t){const k=bump(t,-.25,.35);const on=k>.01&&t<tThree+.12;BADGE.visible=STEM.visible=on;PEL.visible=PPR.visible=false;if(!on)return;
 const sh=sm(tPres17-.03,tPres17+.15,t),z=.97-.05*Math.min(1,t/2.5)-.08*sh;PHOTO.repeat.set(z,z);PHOTO.offset.set((1-z)/2,(1-z)/2+.02*sh);
 FLASH.material.opacity=t>tPres17-.02?.4*Math.exp(-(t-tPres17)*4.5):0;RINGB.material.opacity=.55+.4*Math.max(0,Math.sin(t*5))*sh;
 BADGE.position.copy(MI).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(Math.max(.001,k)*(1+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tPres17)/.28)))));
 STEM.scale.set(1,Math.max(.001,k),1);const pp=MI.clone().add(V3(0,BH-BR*k-.34,0));
 const pr=t>=tPres17-.04;const P=pr?PPR:PEL;P.visible=true;face2cam(P,pp);P.scale.setScalar(Math.max(.001,k)*(pr?bump(t,tPres17-.04,.25):1));}
// ---- 3 number cards (numbers only, EP16 user rule); card 3 = 'the last one decides everything' ----
function numCard(n){const P=canv15(1024,384),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(6,6,1012,372,40);x.fill();x.strokeStyle='#fff';x.lineWidth=10;x.stroke();
 x.fillStyle='#ffc61a';x.font='900 300px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),512,205);P.t.needsUpdate=true;return P.t;}
const CARDS17=[1,2,3].map(numCard).map((tx,i)=>{const m=add(new THREE.PlaneGeometry(2.4,.9),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}),0,0,0,scene,false);m.renderOrder=6;m.visible=false;m.userData.t0=tThree-.04+i*.2;m.userData.p=SP.clone().add(V3(.4,3.05-i*1.05,0));return m;});
const GLOW3=add(new THREE.PlaneGeometry(2.9,1.3),new THREE.MeshBasicMaterial({map:tex(512,256,x=>{const g=x.createRadialGradient(256,128,40,256,128,250);g.addColorStop(0,'rgba(255,198,26,.95)');g.addColorStop(1,'rgba(255,198,26,0)');x.fillStyle=g;x.fillRect(0,0,512,256);}),transparent:true,toneMapped:false,depthWrite:false,blending:THREE.AdditiveBlending}),0,0,0,scene,false);GLOW3.renderOrder=5;GLOW3.visible=false;
function cards17(t){const lk=sm(tLast-.05,tLast+.25,t);
 CARDS17.forEach((m,i)=>{const k=bump(t,m.userData.t0,.3);m.visible=k>.01;if(!m.visible)return;m.position.copy(m.userData.p).add(V3(0,.04*Math.sin(t*2.5+i),0));m.quaternion.copy(cam.quaternion);
  const big=i===2?1+.22*lk:1-.12*lk;m.scale.setScalar(k*big);m.material.opacity=i===2?1:1-.55*lk;});
 GLOW3.visible=lk>.01;if(GLOW3.visible){GLOW3.position.copy(CARDS17[2].position).add(V3(-.02,0,0));GLOW3.quaternion.copy(cam.quaternion);GLOW3.scale.setScalar(1.1*lk*(1+.06*Math.sin(t*6)));GLOW3.material.opacity=.75;}}
function animate(t){sun.intensity=2.4;updPops(t);MK.g.visible=false;MIKE.g.visible=false;TR.g.visible=false;DEBT.visible=DFR.visible=false;PUMP.visible=false;
 wipe17(t);els17(t);cards17(t);title17(t);
 const sk=1-sm(tThree-.12,tThree+.1,t);STUB.visible=sk>.01;STUB.scale.setScalar(STS*Math.max(.001,sk)*(1+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tTax+.04)/.3)))));
 if(t<HOOK_END)stub17(sm(tTax-.05,tTax+.2,t),t>=tPres17-.04?1:0);}
// ---------------- camera: wide (stub | El-Sayed on Michigan) -> push to the badge on 'El-Sayed' -> wide on the blue wipe -> the 3 cards -> push on card 3 ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const STB=CK.box([SP.x-.2,SP.y,SP.z-1.15],[SP.x+.2,SP.y+STUBH+.1,SP.z+1.15]),MIB=CK.box([MI.x-.3,US_Y,MI.z-1.15],[MI.x+.3,US_Y+BH+BR*1.4,MI.z+1.15]);
const CRB=CK.box([SP.x+.3,SP.y+.5,SP.z-1.3],[SP.x+.5,SP.y+3.6,SP.z+1.3]),C3B=CK.box([SP.x+.3,SP.y+1.3,SP.z-1.5],[SP.x+.5,SP.y+2.7,SP.z+1.5]);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.24,...o});   // top .24 = room for the hook title
const COL=[gbox(-104,30,-80,47,0,.1),STB,MIB];
const KEYS1=[[0,FT15(COL,[1,.55,0],40,{top:.24})],
 [tTax+.1,FT15(COL,[1,.53,.03],40,{slack:.97})],
 [tEls+.15,FT15([MIB,STB],[1,.5,.06],40,{slack:.95})],
 [tToday+.15,FT15(COL,[1,.6,0],40,{slack:.96})],
 [tThree+.1,FT15([CRB],[1,.22,0],38,{top:.24})],
 [tLast-.05,FT15([CRB],[1,.21,0],38,{slack:.97,top:.24})],
 [tLast+.3,FT15([C3B],[1,.2,0],38,{top:.24})],
 [HOOK_END,FT15([C3B],[1,.2,0],38,{slack:.96,top:.24})]];
// ---- HOOK TITLE (user 2026-11-07): big, short text at the TOP of the frame, readable with no sound, from frame 1 to the end of the hook ----
const HT17=document.createElement('div');HT17.style.cssText='position:absolute;left:0;width:720px;top:3.2%;text-align:center;z-index:4;font-family:Mont,sans-serif;font-weight:800;line-height:1;transform-origin:50% 0';
HT17.innerHTML='<div id="ht1" style="display:inline-block;font-size:48px;color:#fff;background:#0d0d10;border:5px solid #fff;border-radius:46px;padding:10px 30px 8px;letter-spacing:-.5px">PRESIDENT EL-SAYED?</div>'+
 '<div id="ht2" style="font-size:108px;color:#ffc61a;margin-top:10px;letter-spacing:-2px;-webkit-text-stroke:5px #0b1530;paint-order:stroke fill;text-shadow:0 6px 14px rgba(0,0,0,.6)">YOUR TAX?</div>';
document.getElementById('ov').appendChild(HT17);const HT1=HT17.querySelector('#ht1'),HT2=HT17.querySelector('#ht2');
function title17(t){const on=t<HOOK_END;HT17.style.display=on?'block':'none';if(!on)return;
 const p1=1+.06*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tPres17)/.28))),p2=1+.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tTax)/.28)))+.06*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tLast)/.3)));
 HT1.style.transform=`scale(${p1})`;HT2.style.transform=`scale(${p2})`;HT2.style.color=t>=tPres17-.04?'#ff3b3b':'#ffc61a';}
