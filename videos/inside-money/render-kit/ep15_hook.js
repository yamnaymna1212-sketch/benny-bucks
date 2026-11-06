// ================= EP15 HOOK v2: "What happens to gas prices if El-Sayed is president today?" (HYPOTHETICAL) =================
// User 2026-11-06 v2 feedback: NO character bodies in the hook; only the main character = El-Sayed's HEAD in a circle (live, blinking);
// a more realistic, sharper map (Natural Earth 50m coastlines + US state lines, painted on a 6k canvas: coast glow, soft US lift shadow);
// real icons (3D gas pump, real $100 bills); camera angles that show each element clearly (top view for the map, 3/4 front for the pump).
// Style refs = CageNova election map: navy sea, beige land, USA one flat colour red -> blue, flag on a pole + black pill label, pulse rings.
// EP13 rules: steady camera, no DoF/grain, subject centred, a change every ~2 s. North-up: camera south (+x), screen right = east (-z).
const W15=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tGas=W15('gas'),tPrices=W15('prices'),tIf=W15('if'),tEls=W15('elsayed'),tPres=W15('president'),tToday=W15('today'),
 tMeet=W15('meet'),tMike=W15('mike'),tPaid=W15('paid'),tGallon=W15('gallon');
const HOOK_END=Math.max(tMeet+1.9,tGallon+.4);
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
 x.save();x.beginPath();for(const f of COUN)for(const p of polysOf(f))for(const ring of p){ring.forEach(([lo,la],i)=>{const [a,b]=PX(lo,la);i?x.lineTo(a,b):x.moveTo(a,b);});x.closePath();}x.clip('evenodd');
 for(let i=0;i<26000;i++){x.fillStyle=`rgba(${Math.random()<.5?120:255},${Math.random()<.5?90:240},60,${Math.random()*.05})`;x.fillRect(Math.random()*CW,Math.random()*CH,3+Math.random()*9,3+Math.random()*9);}x.restore();
 x.strokeStyle='rgba(120,88,48,.85)';x.lineWidth=3;for(const f of COUN){if(f===USA)continue;path(x,polysOf(f));x.stroke();}
 // the USA lifted off the map: soft drop shadow, flat colour, white state lines, white outline
 x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=26;x.shadowOffsetY=14;x.fillStyle=usCol;path(x,polysOf(USA));x.fill('evenodd');x.restore();
 x.save();path(x,polysOf(USA));x.clip('evenodd');const gg=x.createLinearGradient(0,PX(0,50)[1],0,PX(0,25)[1]);gg.addColorStop(0,'rgba(255,255,255,.12)');gg.addColorStop(1,'rgba(0,0,0,.12)');x.fillStyle=gg;x.fillRect(0,0,CW,CH);
 x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=3.2;for(const f of STAT){path(x,polysOf(f));x.stroke();}x.restore();
 x.strokeStyle='#ffffff';x.lineWidth=7;path(x,polysOf(USA));x.stroke();
 x.strokeStyle=usDark;x.lineWidth=2;path(x,polysOf(USA));x.stroke();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;return t;}
const WIPE=new THREE.Plane(V3(0,0,-1),-1e4),WIPEI=new THREE.Plane(V3(0,0,1),1e4);
const MW=(L1-L0)*S15,MH=(A1-A0)*S15,MC=mxz((L0+L1)/2,(A0+A1)/2,.012);
function mapPlane(tx,clip){const g=new THREE.Group();g.position.copy(MC);g.rotation.y=Math.PI/2;scene.add(g);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(MW,MH),new THREE.MeshBasicMaterial({map:tx,toneMapped:false,transparent:true,clippingPlanes:[clip]}));m.rotation.x=-Math.PI/2;m.renderOrder=-2;g.add(m);return g;}
mapPlane(paintMap('#e5484f','#8f1f27'),WIPEI);const BLUEMAP=mapPlane(paintMap('#2c7ce6','#103e8c'),WIPE);BLUEMAP.position.y+=.002;
{const o=add(new THREE.PlaneGeometry(400,400),new THREE.MeshBasicMaterial({map:tex(2048,2048,x=>{const g=x.createRadialGradient(1024,1024,10,1024,1024,190);g.addColorStop(0,'#0f2a5e');g.addColorStop(1,'#081a40');x.fillStyle=g;x.fillRect(0,0,2048,2048);}),toneMapped:false}),MO.x,0,MO.z,scene,false);o.rotation.x=-Math.PI/2;}
const WEST_Z=mxz(-126,40).z,EAST_Z=mxz(-66,40).z;
function wipe15(t){const k=sm(tPres-.05,tPres+.7,t);const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
// golden city lights (real US cities)
const GLOWT=tex(128,128,x=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,244,200,1)');g.addColorStop(.22,'rgba(255,205,90,.85)');g.addColorStop(1,'rgba(255,170,40,0)');x.fillStyle=g;x.fillRect(0,0,128,128);});
const CITIES=[[-74,40.7],[-118.2,34],[-87.6,41.9],[-95.4,29.8],[-112,33.4],[-75.2,40],[-98.5,29.4],[-117,32.7],[-96.8,32.8],[-122.3,47.6],[-105,39.7],[-80.2,25.8],[-84.4,33.7],[-71,42.4],[-83,42.3],[-93.3,45],
 [-115.1,36.2],[-122.7,45.5],[-122.4,37.8],[-86.8,36.2],[-94.6,39.1],[-90.2,38.6],[-111.9,40.8],[-80.8,35.2],[-90,30],[-106.6,35.1],[-97.5,35.5],[-96,41.3],[-83,40],[-80,40.4],[-81.7,41.5],[-88,43],[-76.6,39.3],[-121.5,38.6]];
const DOTS=CITIES.map(([lo,la],i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOWT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));s.position.copy(mxz(lo,la,US_Y+.04));s.userData.ph=i*1.7;scene.add(s);return s;});
// ---------------- helpers ----------------
const canv15=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,t,x:c.getContext('2d')};};
function pill(s,w=1.2){const P=canv15(512,128),x=P.x;x.fillStyle='#0d0d10';x.strokeStyle='#ffffff';x.lineWidth=9;x.beginPath();x.roundRect(8,8,496,112,56);x.fill();x.stroke();
 x.fillStyle='#fff';x.font='800 74px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(s,256,70);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:P.t,transparent:true,toneMapped:false}),0,0,0,scene,false);m.renderOrder=5;return m;}
const face2cam=(m,p)=>{m.position.copy(p);m.quaternion.copy(cam.quaternion);};
const bump=(t,t0,d=.32)=>{const k=Math.min(1,Math.max(0,(t-t0)/d));return k<=0?0:(1-Math.pow(1-k,3))*(1+Math.sin(k*Math.PI)*.22);};
// ---------------- US flag on a pole (west) + USA pill ----------------
const FLP=mxz(-110,42.6);
const POLE=add(CY(.025,.035,1.7,12),M(0xd6d9de,.3,.9),FLP.x,US_Y+.85,FLP.z);const KNOB=add(new THREE.SphereGeometry(.05,12,8),M(0xd4af37,.3,1),FLP.x,US_Y+1.72,FLP.z);
const FLAG15=add(FG,FLAGM,FLP.x,US_Y+1.38,FLP.z-.62,scene,false);FLAG15.rotation.y=Math.PI/2;
const PUSA=pill('USA',.95);
// ---------------- the gas pump (real look) ----------------
const PP=mxz(-98,38.4);
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
popT('$4.10',.48,RED,PRICE_P,-1,tIf+.25);
popT('$4.10',.42,RED,PRICE_P,tPaid-.05,1e9);
// real $100 bills circling the pump on "prices" / flying from Mike into it on "paid"
const BILLS15=[0,1,2,3,4].map(()=>{const b=MNY.note(100,{curve:.012,glow:.12});b.scale.setScalar(2.2);b.visible=false;scene.add(b);return b;});
const ARUP=CK.icon('up',{color:'#ff2a2a',size:.55}),ARDN=CK.icon('down',{color:'#22e06a',size:.55});scene.add(ARUP);scene.add(ARDN);
popT('?',.7,YEL,PRICE_P.clone().add(V3(0,.05,0)),tToday-.05,tMeet-.3);
// ---------------- El-Sayed: HEAD ONLY in a map badge (live render target: blinks, moves, smiles) ----------------
const ELS=person('elsayed',GX,SY,19.25,Math.PI);FK.rig(ELS,{iris:'#3b2618',brow:'#1e1612'});
ELS.g.traverse(o=>{if(o.isMesh&&/short04|eyebrow/i.test(o.name+o.material.name)){o.material.roughness=.95;o.material.envMapIntensity=.12;o.material.color.setScalar(.55);o.material.needsUpdate=true;}});
const HRT=new THREE.WebGLRenderTarget(640,640,{samples:4,type:THREE.HalfFloatType});
const HCAM=new THREE.PerspectiveCamera(20,1,.05,1.6);const HBG=new THREE.Color(0x2a66c9);
const DC=mxz(-77.3,38.9),BH=1.45,BR=.62;
const BADGE=new THREE.Group();scene.add(BADGE);
{add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:new THREE.Color(.45,1.3,3),toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,BADGE,false);
 add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,BADGE,false);
 const fc=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:HRT.texture}),0,0,0,BADGE,false);fc.renderOrder=4;}
const STEM=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),DC.x,US_Y+(BH-BR)/2,DC.z,scene,false);STEM.rotation.x=Math.PI;
const PELS=pill('EL-SAYED',1.3);PELS.material.depthTest=false;PELS.renderOrder=9;
const RINGM=()=>new THREE.MeshBasicMaterial({color:new THREE.Color(.45,1.3,3),toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const RINGS=[0,1,2].map(()=>{const r=add(new THREE.RingGeometry(.93,1,96),RINGM(),DC.x,US_Y+.03,DC.z,scene,false);r.rotation.x=-Math.PI/2;r.visible=false;return r;});
function els15(t){const k=bump(t,tEls-.02,.35);const on=k>.01&&t<tMeet;BADGE.visible=STEM.visible=PELS.visible=on;RINGS.forEach(r=>r.visible=false);ELS.g.visible=on;if(!on)return;
 const P=ELS;relax(P);idle(P,t,.2);P.g.position.set(GX,SY,19.25);P.g.rotation.y=Math.PI;
 const joy=sm(tPres-.1,tPres+.3,t);face(P,{jaw:.03+.035*Math.abs(Math.sin(t*8)),smile:.35+.4*joy});
 P.g.updateMatrixWorld(true);const h=V3();(P.BN.head||P.BN.neck01).getWorldPosition(h);h.y+=.06;
 HCAM.position.copy(h).add(V3(0,.02,-.92));HCAM.lookAt(h.x,h.y-.02,h.z);
 FK.update(P,t,{expr:[['joy',.3+.45*joy]],look:HCAM.position});
 const bg=scene.background;scene.background=HBG;renderer.setRenderTarget(HRT);renderer.clear();renderer.render(scene,HCAM);renderer.setRenderTarget(null);scene.background=bg;
 BADGE.position.copy(DC).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(Math.max(.001,k));
 STEM.scale.set(1,Math.max(.001,k),1);face2cam(PELS,DC.clone().add(V3(0,BH-BR*k-.32,0)));PELS.scale.setScalar(Math.max(.001,k));
 RINGS.forEach((r,i)=>{const d=t-tEls-i*.35;r.visible=d>0;if(!r.visible)return;const ph=(d%1.05)/1.05;r.scale.setScalar(.3+1.9*ph);r.material.opacity=(1-ph)*.95;});}
// ---------------- Mike beside the pump (story starts on "Meet", after the white flash) ----------------
const MKP=mxz(-103.4,38.0),CSC=1.4;
function mike15(t){const P=MIKE,on=t>=tMeet-.04;P.g.visible=on;if(!on)return;
 relax(P);idle(P,t,1.1);P.g.position.copy(MKP);P.g.rotation.y=Math.PI/2-.12;P.g.scale.setScalar(CSC);
 const sh=sm(tPaid-.15,tPaid+.15,t);armsUp(P,.22*sh);pose(P,'head',-.05*sh,-.35*sh,0);
 face(P,{jaw:.05+.05*sh,smile:.15*(1-sh)});FK.update(P,t,{expr:[['shock',.9*sh],['joy',.3*(1-sh)]],look:sh>.5?PRICE_P:cam.position});}
const PMIKE=pill('MIKE',.95);
const WF15=document.createElement('div');WF15.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF15);
function animate(t){sun.intensity=2.4;WF15.style.opacity=String(Math.max(0,1-Math.abs(t-tMeet)/.14)*.95);updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;
 wipe15(t);els15(t);mike15(t);
 DOTS.forEach(s=>{const v=.75+.25*Math.sin(t*3+s.userData.ph);s.scale.setScalar(.26*v);s.material.opacity=v;});
 const fv=t<tPrices+.1;[POLE,KNOB,FLAG15,PUSA].forEach(o=>o.visible=fv);FLAG15.rotation.x=.04*Math.sin(t*2.2);face2cam(PUSA,FLP.clone().add(V3(.35,.12,0)));
 PUMP.scale.setScalar(1+.18*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tGas+.05)/.35))));
 const q=t>=tToday-.05&&t<tMeet-.05;screen15(q?'?':'$4.10',q?'#ffc61a':'#ff3b3b');
 BILLS15.forEach((b,i)=>{const t0=tPrices+.05+i*.06;let on=t>=t0&&t<tIf+.3,p;
  if(on){const a=t*2.2+i*Math.PI*2/5,k=Math.min(1,(t-t0)/.3);p=PP.clone().add(V3(Math.cos(a)*1.05*k,.6+i*.28+.1*Math.sin(t*3+i),Math.sin(a)*1.05*k));}
  else if(t>=tPaid+i*.1&&t<tPaid+i*.1+.62){on=true;const u=(t-tPaid-i*.1)/.6;p=MKP.clone().add(V3(.7,1.35,-.2)).lerp(PP.clone().add(V3(.35,1.25,0)),u).add(V3(0,Math.sin(u*Math.PI)*.45,0));}
  b.visible=on;if(!on)return;b.position.copy(p);b.lookAt(cam.position);b.rotateZ(.4*Math.sin(t*4+i));MNY.flutter(b,t,i);});
 const sw=Math.sin((t-tToday)*7);CK.iconAnim(ARUP,t,tToday,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55+.12*Math.max(0,sw),.72)),cam,spin:.3});
 CK.iconAnim(ARDN,t,tToday+.12,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55-.12*Math.max(0,-sw),-.72)),cam,spin:.3});
 PMIKE.visible=t>=tMike-.05&&t<tPaid-.1;if(PMIKE.visible)face2cam(PMIKE,MKP.clone().add(V3(0,2.75,0)));}
// ---------------- camera: a different, clear angle per beat (monotone Hermite; the white flash hides the cut on "Meet") ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const PUB=BXc(PP,.55,PUMPH+.9),PUB2=BXc(PP,1.15,PUMPH+1.0),DCB=CK.box([DC.x-.3,US_Y,DC.z-.75],[DC.x+.3,US_Y+BH+BR+.05,DC.z+.75]),MKB2=BXc(MKP,.45,3.05);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const KEYS1=[[0,FT15([gbox(-124,25,-68,49,0,.1),PUB],[.42,1.0,0],40)],             // high, north-up: the whole red USA + the pump + $4.10
 [tGas,FT15([gbox(-112,30,-84,46,0,.1),PUB],[.75,1.0,0],40)],
 [tPrices+.25,FT15([PUB2],[1,.5,-.32],38)],                                          // 3/4 front-right: the pump screen + bills readable
 [tIf+.1,FT15([PUB2],[1,.52,-.22],38,{slack:.95})],
 [tEls+.05,FT15([DCB,BXc(DC,1.3,.1)],[1,.35,.12],38)],                              // facing the head badge (it is a billboard)
 [tPres+.05,FT15([DCB,BXc(DC,1.7,.1)],[1,.45,.08],38)],
 [tPres+.45,FT15([gbox(-125,24,-67,49,0,.1)],[.35,1.0,0],40)],                       // top view: the map turns blue from DC westward
 [tToday+.25,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.3],38)],                       // 3/4 front-left: '?' + UP / DOWN
 [tMeet,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.22],38,{slack:.95})]];
mike15(tPaid);
const PRB=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.0],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.0]);
const KEYS2=[[tMeet,FT15([MKB2,PUB],[1,.42,.12],38)],[tPaid+.2,FT15([MKB2,PUB,PRB],[1,.4,.05],38)],[HOOK_END,FT15([MKB2,PUB,PRB],[1,.38,0],38,{slack:.94})]];
mike15(0);
const ch15=F=>[...F.pos,...F.look,F.fov],unch15=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm15(keys,t){const n=keys.length;if(t<=keys[0][0])return ch15(keys[0][1]);if(t>=keys[n-1][0])return ch15(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch15(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
window.CAM14=t=>unch15(herm15(t<tMeet?KEYS1:KEYS2,t));
window.CAM14_END=HOOK_END+5;
window.HOOK15={tGas,tEls,tPres,tToday,tMeet,HOOK_END};
