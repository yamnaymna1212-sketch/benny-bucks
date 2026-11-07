const W15=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tLost=W15('lost'),tCong=W15('congress'),tSo=W15('so'),tGas=W15('gas'),tCheaper=W15('cheaper'),tMeet=W15('meet'),tMike=W15('mike'),tPays=W15('pays'),tGallon=W15('gallon');
const tPres=tLost+.1;   // wipe15 (EP15 code) starts on this
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
function wipe15(t){const k=sm(tPres-.05,tCong+.6,t);const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
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
screen15('$4.04','#ff3b3b');
popT('$4.04',.48,RED,PRICE_P,tSo-.05,tCheaper-.05);   // before 'so' the pump screen alone shows the price (no clash with the badge)
popT('$4.04',.42,RED,PRICE_P,tPays-.05,1e9);
const BILLS15=[0,1,2,3,4].map(()=>{const b=MNY.note(100,{curve:.012,glow:.12});b.scale.setScalar(2.2);b.visible=false;scene.add(b);return b;});
const ARUP=CK.icon('up',{color:'#ff2a2a',size:.55}),ARDN=CK.icon('down',{color:'#22e06a',size:.55});scene.add(ARUP);scene.add(ARDN);
popT('?',.7,YEL,PRICE_P.clone().add(V3(0,.05,0)),tCheaper-.05,tMeet-.3);
// ---------------- the Capitol (south-west of DC so the badge never hides it) ----------------
const CP=mxz(-77.2,38.6),CSCL=.62;
const CAPG=new THREE.Group();CAPG.position.copy(CP);CAPG.rotation.y=Math.PI/2;CAPG.scale.setScalar(CSCL);scene.add(CAPG);
{const wm=M(0xf6f4ee,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,CAPG);add(B(2.8,.9,1.0),wm,0,.63,0,CAPG);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,.55,CAPG);add(B(2.9,.12,1.1),gm,0,1.14,0,CAPG);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,CAPG);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,CAPG);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,CAPG);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,CAPG);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52,CAPG);}
const PCONG=pill('CONGRESS',1.3);PCONG.material.depthTest=false;PCONG.renderOrder=9;
popT('LOST',.44,RED,CP.clone().add(V3(.85,1.05,0)),tLost-.02,tSo-.05);
// ---------------- Trump: HEAD ONLY in a red badge on DC (live render target) ----------------
const HRT=new THREE.WebGLRenderTarget(640,640,{samples:4,type:THREE.HalfFloatType});
const HCAM=new THREE.PerspectiveCamera(20,1,.05,1.6);const HBG=new THREE.Color(0x9c1f2c);
const DC=mxz(-85.3,39.6),BH=3.4,BR=.62;   // row: pump (west/left) | Capitol (DC/right); the Trump badge high above, between them
const BADGE=new THREE.Group();scene.add(BADGE);
{add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:new THREE.Color(3,.55,.45),toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,BADGE,false);
 add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,BADGE,false);
 const fc=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:HRT.texture}),0,0,0,BADGE,false);fc.renderOrder=4;}
const STEM=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),DC.x,US_Y+(BH-BR)/2,DC.z,scene,false);STEM.rotation.x=Math.PI;
const PTR=pill('TRUMP',1.1);PTR.material.depthTest=false;PTR.renderOrder=9;
const TRH=V3(GX,SY,19.25);
function trump16(t){const k=bump(t,-.25,.35);const on=k>.01&&t<tSo+.12;BADGE.visible=STEM.visible=PTR.visible=on;if(!on){TR.g.visible=false;return;}
 const P=TR;relax(P);idle(P,t,.25);P.g.visible=true;P.g.position.copy(TRH);P.g.rotation.y=Math.PI;
 const sh=sm(tLost-.05,tLost+.2,t);face(P,{jaw:.03+.04*Math.abs(Math.sin(t*8))+.25*sh,smile:.3*(1-sh)});
 P.g.updateMatrixWorld(true);const h=V3();(P.BN.head||P.BN.neck01).getWorldPosition(h);h.y+=.06;
 HCAM.position.copy(h).add(V3(0,.02,-.92));HCAM.lookAt(h.x,h.y-.02,h.z);
 FK.update(P,t,{expr:[['smirk',.6*(1-sh)],['shock',.95*sh]],look:HCAM.position});
 const bg=scene.background;scene.background=HBG;renderer.setRenderTarget(HRT);renderer.clear();renderer.render(scene,HCAM);renderer.setRenderTarget(null);scene.background=bg;P.g.visible=false;
 BADGE.position.copy(DC).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(Math.max(.001,k));
 STEM.scale.set(1,Math.max(.001,k),1);face2cam(PTR,DC.clone().add(V3(0,BH-BR*k-.32,0)));PTR.scale.setScalar(Math.max(.001,k));}
// ---------------- Mike beside the pump (after the white flash on 'Meet') ----------------
const MKP=mxz(-98.9,38.2),CSC=1.4;
function mike15(t){const P=MIKE,on=t>=tMeet-.04;P.g.visible=on;if(!on)return;
 relax(P);idle(P,t,1.1);P.g.position.copy(MKP);P.g.rotation.y=Math.PI/2-.12;P.g.scale.setScalar(CSC);
 const sh=sm(tPays-.15,tPays+.15,t);armsUp(P,.22*sh);pose(P,'head',-.05*sh,-.35*sh,0);
 face(P,{jaw:.05+.05*sh,smile:.15*(1-sh)});FK.update(P,t,{expr:[['shock',.9*sh],['joy',.3*(1-sh)]],look:sh>.5?PRICE_P:cam.position});}
const PMIKE=pill('MIKE',.95);
const WF15=document.createElement('div');WF15.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF15);
function animate(t){sun.intensity=2.4;WF15.style.opacity=String(Math.max(0,1-Math.abs(t-tMeet)/.14)*.95);updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;
 wipe15(t);trump16(t);mike15(t);
 DOTS.forEach(s=>{const v=.75+.25*Math.sin(t*3+s.userData.ph);s.scale.setScalar(.26*v);s.material.opacity=v;});
 const cv=t<tSo+.12;CAPG.visible=cv;const ck=bump(t,tCong-.1,.3);PCONG.visible=cv&&ck>.01;if(PCONG.visible){face2cam(PCONG,CP.clone().add(V3(0,-.05,0)).add(V3(.55,.25,0)));PCONG.scale.setScalar(Math.max(.001,ck));}
 CAPG.scale.setScalar(CSCL*(1+.12*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tLost+.02)/.3)))));
 PUMP.scale.setScalar(1+.18*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tGas+.05)/.35))));
 const q=t>=tCheaper-.05&&t<tMeet-.05;screen15(q?'?':'$4.04',q?'#ffc61a':'#ff3b3b');
 BILLS15.forEach((b,i)=>{const t0=tGas+.05+i*.06;let on=t>=t0&&t<tCheaper+.3,p;
  if(on){const a=t*2.2+i*Math.PI*2/5,k=Math.min(1,(t-t0)/.3);p=PP.clone().add(V3(Math.cos(a)*1.05*k,.6+i*.28+.1*Math.sin(t*3+i),Math.sin(a)*1.05*k));}
  else if(t>=tPays+i*.1&&t<tPays+i*.1+.62){on=true;const u=(t-tPays-i*.1)/.6;p=MKP.clone().add(V3(.7,1.35,-.2)).lerp(PP.clone().add(V3(.35,1.25,0)),u).add(V3(0,Math.sin(u*Math.PI)*.45,0));}
  b.visible=on;if(!on)return;b.position.copy(p);b.lookAt(cam.position);b.rotateZ(.4*Math.sin(t*4+i));MNY.flutter(b,t,i);});
 const sw=Math.sin((t-tCheaper)*7);CK.iconAnim(ARUP,t,tCheaper,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55+.12*Math.max(0,sw),.72)),cam,spin:.3});
 CK.iconAnim(ARDN,t,tCheaper+.12,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55-.12*Math.max(0,-sw),-.72)),cam,spin:.3});
 PMIKE.visible=t>=tMike-.05&&t<tPays-.1;if(PMIKE.visible)face2cam(PMIKE,MKP.clone().add(V3(0,2.75,0)));}
// ---------------- camera: wide (whole red USA, badge, Capitol, pump) -> push in on DC while it wipes blue -> 3/4 front on the pump -> Mike ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const PRB0=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.05],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.05]),PUB=BXc(PP,.55,PUMPH+.9),PUB2=BXc(PP,1.15,PUMPH+1.0),DCB=CK.box([DC.x-.3,US_Y,DC.z-.75],[DC.x+.3,US_Y+BH+BR+.05,DC.z+.75]),CAPB=BXc(CP,1.0,2.9),MKB2=BXc(MKP,.45,3.05);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const COL=[gbox(-99,35,-74,43,0,.1),PUB,PRB0,DCB,CAPB];
const KEYS1=[[0,FT15(COL,[1,.55,0],40)],
 [tLost+.05,FT15(COL,[1,.5,-.04],40,{slack:.97})],
 [tSo-.05,FT15(COL,[1,.48,-.06],40,{slack:.94})],
 [tGas+.2,FT15([PUB2],[1,.5,-.32],38)],
 [tCheaper+.2,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.3],38)],
 [tMeet,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.22],38,{slack:.95})]];
mike15(tPays);
const PRB=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.0],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.0]);
const KEYS2=[[tMeet,FT15([MKB2,PUB],[1,.42,.12],38)],[tPays+.2,FT15([MKB2,PUB,PRB],[1,.4,.05],38)],[HOOK_END,FT15([MKB2,PUB,PRB],[1,.38,0],38,{slack:.94})]];
mike15(0);
const ch15=F=>[...F.pos,...F.look,F.fov],unch15=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm15(keys,t){const n=keys.length;if(t<=keys[0][0])return ch15(keys[0][1]);if(t>=keys[n-1][0])return ch15(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch15(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
window.CAM14=t=>unch15(herm15(t<tMeet?KEYS1:KEYS2,t));
window.CAM14_END=HOOK_END+5;
window.HOOK16={tLost,tCong,tSo,tGas,tCheaper,tMeet,HOOK_END};
