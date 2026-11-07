// ================= EP16 HOOK v2 (user 2026-11-07): "Trump just lost Congress. So will gas get cheaper? Three things decide it." =================
// v2: real Trump photo (official White House portrait 2025, public domain) in the same circle badge, animated (slow push-in, shock punch + red flash on 'lost');
// USA painted with the real US flag; nothing distracting (no city lights, no map grain, no bills, no Mike); end = 3 numbered cards TAX / OIL / PRESIDENT.
screen15('$4.04','#ff3b3b');
popT('$4.04',.48,RED,PRICE_P,tSo-.05,tCheaper-.05);
const ARUP=CK.icon('up',{color:'#ff2a2a',size:.55}),ARDN=CK.icon('down',{color:'#22e06a',size:.55});scene.add(ARUP);scene.add(ARDN);
popT('?',.7,YEL,PRICE_P.clone().add(V3(0,.05,0)),tCheaper-.05,tThree-.08);
// ---------------- the Capitol (DC) ----------------
const CP=mxz(-77.2,38.6),CSCL=.62;
const CAPG=new THREE.Group();CAPG.position.copy(CP);CAPG.rotation.y=Math.PI/2;CAPG.scale.setScalar(CSCL);scene.add(CAPG);
{const wm=M(0xf6f4ee,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,CAPG);add(B(2.8,.9,1.0),wm,0,.63,0,CAPG);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,.55,CAPG);add(B(2.9,.12,1.1),gm,0,1.14,0,CAPG);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,CAPG);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,CAPG);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,CAPG);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,CAPG);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52,CAPG);}
const PCONG=pill('CONGRESS',1.3);PCONG.material.depthTest=false;PCONG.renderOrder=9;
popT('LOST',.44,RED,CP.clone().add(V3(.85,1.05,0)),tLost-.02,tSo-.05);
// ---------------- Trump: REAL PHOTO in the circle badge, animated ----------------
const PHOTO=await new THREE.TextureLoader().loadAsync('assets/trump_portrait.jpg');PHOTO.colorSpace=THREE.SRGBColorSpace;PHOTO.anisotropy=8;
const DC=mxz(-85.3,39.6),BH=3.4,BR=.62;
const BADGE=new THREE.Group();scene.add(BADGE);const BADGEI=new THREE.Group();BADGE.add(BADGEI);
const RINGB=add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:new THREE.Color(3,.55,.45),toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,BADGEI,false);
add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,BADGEI,false);
{const fc=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:PHOTO,toneMapped:false}),0,0,0,BADGEI,false);fc.renderOrder=4;}
const FLASH=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({color:0xff2030,toneMapped:false,transparent:true,opacity:0,depthWrite:false}),0,0,.002,BADGEI,false);FLASH.renderOrder=5;
const STEM=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),DC.x,US_Y+(BH-BR)/2,DC.z,scene,false);STEM.rotation.x=Math.PI;
const PTR=pill('TRUMP',1.1);PTR.material.depthTest=false;PTR.renderOrder=9;
function trump16(t){const k=bump(t,-.25,.35);const on=k>.01&&t<tSo+.12;BADGE.visible=STEM.visible=PTR.visible=on;if(!on)return;
 // slow push-in on the face; a punch-in on 'lost'
 const sh=sm(tLost-.03,tLost+.12,t),z=.97-.06*Math.min(1,t/2)-.1*sh;PHOTO.repeat.set(z,z);PHOTO.offset.set((1-z)/2,(1-z)/2+.03*sh);
 const wig=t>tLost?Math.exp(-(t-tLost)*5)*Math.sin((t-tLost)*30)*.09:0;BADGEI.rotation.z=wig;
 FLASH.material.opacity=t>tLost-.02?.45*Math.exp(-(t-tLost)*4.5):0;RINGB.material.opacity=.55+.4*Math.max(0,Math.sin(t*5))*sh;
 BADGE.position.copy(DC).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(Math.max(.001,k)*(1+.08*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tLost)/.25)))));
 STEM.scale.set(1,Math.max(.001,k),1);face2cam(PTR,DC.clone().add(V3(0,BH-BR*k-.32,0)));PTR.scale.setScalar(Math.max(.001,k));}
// ---------------- 3 numbered cards: TAX / OIL / PRESIDENT (the 3 things the story explains) ----------------
function card16(n,title,fs,draw){const P=canv15(1024,384),x=P.x;x.fillStyle='#0b1530';x.beginPath();x.roundRect(6,6,1012,372,40);x.fill();x.strokeStyle='#fff';x.lineWidth=10;x.stroke();
 x.save();x.translate(250,192);x.scale(.82,.82);x.translate(-256,-270);draw(x);x.restore();
 x.fillStyle='#ffc61a';x.beginPath();x.arc(74,74,46,0,Math.PI*2);x.fill();x.fillStyle='#0b1530';x.font='900 64px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),74,78);
 x.fillStyle='#fff';x.font=`900 ${fs}px Mont`;x.textAlign='left';x.textBaseline='middle';x.fillText(title,420,200);P.t.needsUpdate=true;return P.t;}
const CARDS16=[
 card16(1,'TAX',150,x=>{x.fillStyle='#f4f4f0';x.beginPath();x.moveTo(166,110);x.lineTo(346,110);x.lineTo(346,430);for(let i=0;i<6;i++){x.lineTo(346-i*30-15,410);x.lineTo(346-(i+1)*30,430);}x.closePath();x.fill();
  x.fillStyle='#d21e2a';x.font='900 150px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('%',256,265);}),
 card16(2,'OIL',150,x=>{x.fillStyle='#1b1b1f';x.beginPath();x.roundRect(176,110,160,300,22);x.fill();x.fillStyle='#3a3a42';[170,260,350].forEach(y=>x.fillRect(170,y,172,16));
  x.fillStyle='#ffc61a';x.beginPath();x.moveTo(256,190);x.bezierCurveTo(300,250,300,300,256,310);x.bezierCurveTo(212,300,212,250,256,190);x.fill();}),
 card16(3,'PRESIDENT',84,x=>{x.fillStyle='#f4f4f0';x.fillRect(150,130,212,270);x.fillStyle='#9aa3b5';[180,215,250,285].forEach(y=>x.fillRect(178,y,156,12));
  x.strokeStyle='#0b1530';x.lineWidth=7;x.beginPath();x.moveTo(180,360);x.bezierCurveTo(215,320,240,390,275,345);x.stroke();
  x.save();x.translate(320,330);x.rotate(-.75);x.fillStyle='#d4af37';x.fillRect(-14,-120,28,150);x.fillStyle='#222';x.beginPath();x.moveTo(-14,30);x.lineTo(14,30);x.lineTo(0,62);x.fill();x.restore();})]
 .map((tx,i)=>{const m=add(new THREE.PlaneGeometry(2.4,.9),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}),0,0,0,scene,false);m.renderOrder=6;m.visible=false;m.userData.t0=tThree-.04+i*.2;m.userData.p=PP.clone().add(V3(.4,3.05-i*1.05,0));return m;});
function cards16(t){CARDS16.forEach((m,i)=>{const k=bump(t,m.userData.t0,.3);m.visible=k>.01;if(!m.visible)return;m.position.copy(m.userData.p).add(V3(0,.04*Math.sin(t*2.5+i),0));m.quaternion.copy(cam.quaternion);m.scale.setScalar(k);});}
function animate(t){sun.intensity=2.4;updPops(t);MK.g.visible=false;MIKE.g.visible=false;TR.g.visible=false;DEBT.visible=DFR.visible=false;
 wipe15(t);trump16(t);cards16(t);
 const cv=t<tSo+.12;CAPG.visible=cv;const ck=bump(t,tCong-.1,.3);PCONG.visible=cv&&ck>.01;if(PCONG.visible){face2cam(PCONG,CP.clone().add(V3(.55,.2,0)));PCONG.scale.setScalar(Math.max(.001,ck));}
 CAPG.scale.setScalar(CSCL*(1+.12*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tLost+.02)/.3)))));
 const pk=1-sm(tThree-.12,tThree+.1,t);PUMP.visible=pk>.01;PUMP.scale.setScalar(Math.max(.001,pk)*(1+.18*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tGas+.05)/.35)))));
 const q=t>=tCheaper-.05;screen15(q?'?':'$4.04',q?'#ffc61a':'#ff3b3b');
 const sw=Math.sin((t-tCheaper)*7);CK.iconAnim(ARUP,t,tCheaper,tThree-.08,{pos:PP.clone().add(V3(.1,PUMPH+.55+.12*Math.max(0,sw),.72)),cam,spin:.3});
 CK.iconAnim(ARDN,t,tCheaper+.12,tThree-.08,{pos:PP.clone().add(V3(.1,PUMPH+.55-.12*Math.max(0,-sw),-.72)),cam,spin:.3});}
// ---------------- camera: wide row (pump | badge | Capitol) -> 3/4 front on the pump -> the 3 cards ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const PRB0=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.05],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.05]),PUB=BXc(PP,.55,PUMPH+.9),PUB2=BXc(PP,1.15,PUMPH+1.0),DCB=CK.box([DC.x-.3,US_Y,DC.z-.75],[DC.x+.3,US_Y+BH+BR+.05,DC.z+.75]),CAPB=BXc(CP,1.0,2.9);
const CRB=CK.box([PP.x+.3,PP.y+.5,PP.z-1.3],[PP.x+.5,PP.y+3.6,PP.z+1.3]);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const COL=[gbox(-99,35,-74,43,0,.1),PUB,DCB,CAPB];
const KEYS1=[[0,FT15(COL,[1,.55,0],40)],
 [tLost+.05,FT15(COL,[1,.5,-.04],40,{slack:.97})],
 [tSo-.05,FT15(COL,[1,.48,-.06],40,{slack:.94})],
 [tGas+.2,FT15([PUB2],[1,.5,-.32],38)],
 [tCheaper+.2,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.3],38)],
 [tThree+.1,FT15([CRB],[1,.22,0],38)],
 [HOOK_END,FT15([CRB],[1,.2,0],38,{slack:.95})]];
