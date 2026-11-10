const W15=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
// EP17: word times + HOOK_END are defined in _ep17parts/tail.js
const tPres=-1;   // EP16 wipe15 unused in EP17 (wipe17)
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;
STORY10_OBJS.forEach(o=>o.visible=false);TR.g.visible=false;
renderer.localClippingEnabled=true;
const SEA=0x081a40;scene.background=new THREE.Color(SEA);scene.fog=null;
// ---------------- the map: two 6k canvases (red USA / blue USA), wiped by a clipping plane ----------------
const MO=V3(400,0,400),S15=.14,LONC=-96,LATC=39,US_Y=.03;
const mxz=(lon,lat,y=US_Y)=>V3(MO.x-(lat-LATC)*S15,y,MO.z-(lon-LONC)*S15);
const L0=-170,L1=-25,A0=-40,A1=75,CW=8192,CH=Math.round(CW*(A1-A0)/(L1-L0));
const GEO=await (await fetch('assets/americas-50m.json')).json();
const PX=(lo,la)=>[(lo-L0)/(L1-L0)*CW,(A1-la)/(A1-A0)*CH];
const polysOf=f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
function path(x,polys){x.beginPath();for(const p of polys)for(const ring of p){ring.forEach(([lo,la],i)=>{const [a,b]=PX(lo,la);i?x.lineTo(a,b):x.moveTo(a,b);});x.closePath();}}
const COUN=GEO.features.filter(f=>f.properties.kind==='c'),STAT=GEO.features.filter(f=>f.properties.kind==='s'),USA=COUN.find(f=>f.properties.name==='United States of America');
function paintMap(usCol,usDark){const c=document.createElement('canvas');c.width=CW;c.height=CH;const x=c.getContext('2d');
 x.clearRect(0,0,CW,CH);   // sea is transparent: the one big sea plane shows through (no seam at the canvas edge)
 // shallow-water glow along every coast
 x.save();x.shadowColor='rgba(70,150,255,.75)';x.shadowBlur=60;x.fillStyle='#1a3f86';for(const f of COUN){path(x,polysOf(f));x.fill('evenodd');}x.restore();
 // land with a fine paper grain
 x.fillStyle='#eccb8f';for(const f of COUN){path(x,polysOf(f));x.fill('evenodd');}
 x.strokeStyle='rgba(120,88,48,.85)';x.lineWidth=3;for(const f of COUN){if(f===USA)continue;path(x,polysOf(f));x.stroke();}
 // the USA lifted off the map: soft drop shadow, flat colour, white state lines, white outline
 x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=26;x.shadowOffsetY=14;x.fillStyle=usCol;path(x,polysOf(USA));x.fill('evenodd');x.restore();
 if(usCol==='FLAG'){x.save();path(x,polysOf(USA));x.clip('evenodd');const [fx0,fy0]=PX(-125,49.6),[fx1,fy1]=PX(-66.8,24.4),fw=fx1-fx0,fh=fy1-fy0,sh=fh/13;
  for(let i=0;i<13;i++){x.fillStyle=i%2?'#ffffff':'#c8102e';x.fillRect(fx0,fy0+i*sh,fw,sh+1);}
  const cw=fw*.4,ch=sh*7;x.fillStyle='#0a3161';x.fillRect(fx0,fy0,cw,ch);x.fillStyle='#ffffff';const star=(cx,cy,R)=>{x.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?R*.38:R;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}x.closePath();x.fill();};
  for(let row=0;row<9;row++){const n=row%2?5:6;for(let c=0;c<n;c++)star(fx0+cw*((row%2?2:1)+c*2)/12,fy0+ch*(row+1)/10,ch*.042);}
  const g2=x.createLinearGradient(0,fy0,0,fy1);g2.addColorStop(0,'rgba(255,255,255,.10)');g2.addColorStop(1,'rgba(0,0,0,.16)');x.fillStyle=g2;x.fillRect(fx0,fy0,fw,fh);x.restore();}
 else{x.save();path(x,polysOf(USA));x.clip('evenodd');const gg=x.createLinearGradient(0,PX(0,50)[1],0,PX(0,25)[1]);gg.addColorStop(0,'rgba(255,255,255,.12)');gg.addColorStop(1,'rgba(0,0,0,.12)');x.fillStyle=gg;x.fillRect(0,0,CW,CH);
 x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=3.2;for(const f of STAT){path(x,polysOf(f));x.stroke();}x.restore();}
 x.strokeStyle='#ffffff';x.lineWidth=7;path(x,polysOf(USA));x.stroke();
 x.strokeStyle=usDark;x.lineWidth=2;path(x,polysOf(USA));x.stroke();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;return t;}
const WIPE=new THREE.Plane(V3(0,0,-1),-1e4),WIPEI=new THREE.Plane(V3(0,0,1),1e4);
const MW=(L1-L0)*S15,MH=(A1-A0)*S15,MC=mxz((L0+L1)/2,(A0+A1)/2,.012);
function mapPlane(tx,clip){const g=new THREE.Group();g.position.copy(MC);g.rotation.y=Math.PI/2;scene.add(g);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(MW,MH),new THREE.MeshBasicMaterial({map:tx,toneMapped:false,transparent:true,clippingPlanes:[clip]}));m.rotation.x=-Math.PI/2;m.renderOrder=-2;g.add(m);return g;}
mapPlane(paintMap('FLAG','#0a3161'),WIPEI);const BLUEMAP=mapPlane(paintMap('#2c7ce6','#103e8c'),WIPE);BLUEMAP.position.y+=.002;
{const o=add(new THREE.PlaneGeometry(400,400),new THREE.MeshBasicMaterial({map:tex(2048,2048,x=>{const g=x.createRadialGradient(1024,1024,10,1024,1024,190);g.addColorStop(0,'#0f2a5e');g.addColorStop(1,'#081a40');x.fillStyle=g;x.fillRect(0,0,2048,2048);}),toneMapped:false}),MO.x,0,MO.z,scene,false);o.rotation.x=-Math.PI/2;}
const WEST_Z=mxz(-126,40).z,EAST_Z=mxz(-66,40).z;
function wipe15(t){const k=sm(tPres-.05,tCong+.6,t);const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
// ---------------- helpers ----------------
const canv15=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,t,x:c.getContext('2d')};};
function pill(s,w=1.2){const P=canv15(512,128),x=P.x;x.fillStyle='#0d0d10';x.strokeStyle='#ffffff';x.lineWidth=9;x.beginPath();x.roundRect(8,8,496,112,56);x.fill();x.stroke();
 x.fillStyle='#fff';x.font='800 74px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(s,256,70);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:P.t,transparent:true,toneMapped:false}),0,0,0,scene,false);m.renderOrder=5;return m;}
const face2cam=(m,p)=>{m.position.copy(p);m.quaternion.copy(cam.quaternion);};
const bump=(t,t0,d=.32)=>{const k=Math.min(1,Math.max(0,(t-t0)/d));return k<=0?0:(1-Math.pow(1-k,3))*(1+Math.sin(k*Math.PI)*.22);};
// ---------------- the gas pump (real look) ----------------
const PP=mxz(-93.5,38.6);
const PUMP=new THREE.Group();PUMP.position.copy(PP);PUMP.rotation.y=Math.PI/2;scene.add(PUMP);
const SCR=canv15(512,320);let SCRK='';
function screen15(s,col){if(s+col===SCRK)return;SCRK=s+col;const x=SCR.x;x.fillStyle='#06110b';x.fillRect(0,0,512,320);x.fillStyle='#9fb6d0';x.font='800 50px Mont';x.textAlign='center';x.fillText('PRICE / GAL',256,66);
 x.fillStyle=col;x.font='800 170px Mont';x.fillText(s,256,250);x.strokeStyle='#33424f';x.lineWidth=10;x.strokeRect(5,5,502,310);SCR.t.needsUpdate=true;}
screen15('$4.10','#ff3b3b');
const CAPT=tex(512,160,x=>{x.fillStyle='#f4f4f0';x.fillRect(0,0,512,160);x.fillStyle='#d21e2a';x.fillRect(0,128,512,32);x.fillStyle='#d21e2a';x.font='900 110px Mont';x.textAlign='center';x.fillText('GAS',256,108);});
{const red=M(0xd21e2a,.35,.15),dk=M(0x1d1f24,.5,.3),wh=M(0xf4f4f0,.35);
 add(RB(.95,.14,.62,.03),dk,0,.07,0,PUMP);add(RB(.82,1.55,.5,.06),red,0,.9,0,PUMP);add(RB(.98,.34,.6,.05),wh,0,1.82,0,PUMP);
 add(new THREE.PlaneGeometry(.94,.3),new THREE.MeshBasicMaterial({map:CAPT,toneMapped:false}),0,1.82,.302,PUMP,false);
 add(B(.66,.44,.03),dk,0,1.32,.255,PUMP);add(new THREE.PlaneGeometry(.6,.375),new THREE.MeshBasicMaterial({map:SCR.t,toneMapped:false}),0,1.32,.272,PUMP,false);
 add(B(.5,.08,.03),M(0xffc61a,.4),0,.98,.255,PUMP);add(B(.1,.32,.12),dk,.47,.95,0,PUMP);
 const noz=new THREE.Group();noz.position.set(.5,1.06,.02);PUMP.add(noz);add(B(.08,.2,.09),M(0x111111,.4,.4),0,0,0,noz);add(CY(.02,.02,.2,10),M(0x9a9a9a,.3,.8),0,.13,.06,noz).rotation.x=1.1;
 const hose=new THREE.CatmullRomCurve3([V3(.41,1.45,0),V3(.62,1.2,.05),V3(.66,.6,.08),V3(.58,.3,.06),V3(.5,.85,.03)]);add(new THREE.TubeGeometry(hose,40,.028,10),M(0x16171a,.6),0,0,0,PUMP);}
const PUMPH=2.0,PRICE_P=PP.clone().add(V3(0,PUMPH+.55,0));
// ================= EP16 HOOK: "Trump just lost Congress. So will gas get cheaper? Meet Mike. He pays about four dollars a gallon." =================
// Same visual language as EP15 (CageNova map, head badges, no bodies before 'Meet', few SFX, steady camera).
// Frame 1 (no sound): red USA + Trump head badge on DC + the Capitol + a gas pump showing $4.04. 'lost' = red LOST stamp, Trump shocked, map wipes red -> blue.
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
const ch15=F=>[...F.pos,...F.look,F.fov],unch15=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm15(keys,t){const n=keys.length;if(t<=keys[0][0])return ch15(keys[0][1]);if(t>=keys[n-1][0])return ch15(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch15(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
window.CAM14=t=>unch15(herm15(KEYS1,t));
window.CAM14_END=HOOK_END+5;
window.HOOK17={tTax,tEls,tPres17,tToday,tThree,tLast,HOOK_END};
