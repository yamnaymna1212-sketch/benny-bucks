// ================= EP15 HOOK v1: "What happens to gas prices if El-Sayed is president today?" (HYPOTHETICAL) =================
// User 2026-11-06 + 2 TikTok refs (CageNova election map): dark navy sea, flat beige land, the USA filled with ONE flat colour that changes
// (red -> blue), a US flag on a pole with a black pill label, glowing blue pulse rings, golden city lights. Real icons: gas pump + money.
// Beats: wide red USA + flag + Trump at DC + gas pump in the middle -> "gas prices" pump pops, $4.10 red + $ coins orbit -> "El-Sayed" camera
// to DC: Trump shrinks out, El-Sayed pops in with blue rings -> "president" the map wipes red->blue from DC westward, he waves -> "today?"
// pump screen '?' + red UP / green DOWN arrows -> white flash on "Meet": Mike beside the pump, shocked, $ coins fly from him into the pump.
// EP13 rules: steady camera (no shake/DoF/grain), subject centred, a change every ~2 s, crisp high-contrast icons. North-up: camera south (+x).
const W15=(w,n=0)=>{const k=TLN.words.filter(x=>x.w.toLowerCase().replace(/[^a-z0-9]/g,'')===w);return (k[Math.min(n,k.length-1)]||{s:0}).s;};
const tWhat=W15('what'),tGas=W15('gas'),tPrices=W15('prices'),tIf=W15('if'),tEls=W15('elsayed'),tPres=W15('president'),tToday=W15('today'),
 tMeet=W15('meet'),tMike=W15('mike'),tPaid=W15('paid'),tGallon=W15('gallon');
const HOOK_END=Math.max(tMeet+1.9,tGallon+.4);
POPS.forEach(m=>{m.visible=false;scene.remove(m);});POPS.length=0;COIN.visible=WARN.visible=false;
STORY10_OBJS.forEach(o=>o.visible=false);
renderer.localClippingEnabled=true;
const SEA=0x10234d;scene.background=new THREE.Color(SEA);scene.fog=new THREE.Fog(SEA,60,160);
// ---------------- the map ----------------
const MO=V3(400,0,400),S15=.14,LONC=-96,LATC=39,US_Y=.185;
const mxz=(lon,lat,y=US_Y)=>V3(MO.x-(lat-LATC)*S15,y,MO.z-(lon-LONC)*S15);
const MAPG=new THREE.Group();MAPG.position.copy(MO);scene.add(MAPG);
{const o=add(new THREE.PlaneGeometry(140,140),new THREE.MeshBasicMaterial({color:SEA,toneMapped:false}),0,.012,0,MAPG,false);o.rotation.x=-Math.PI/2;}
const GEO=await (await fetch('assets/world-110m.json')).json();
const WIPE=new THREE.Plane(V3(0,0,-1),-1e4),WIPEI=new THREE.Plane(V3(0,0,1),1e4);
const LANDM=new THREE.MeshBasicMaterial({color:0xedcb8e,toneMapped:false}),SIDEM=new THREE.MeshBasicMaterial({color:0xa98250,toneMapped:false}),
 REDM=new THREE.MeshBasicMaterial({color:0xe8505a,toneMapped:false,clippingPlanes:[WIPEI]}),REDS=new THREE.MeshBasicMaterial({color:0x9c2a33,toneMapped:false,clippingPlanes:[WIPEI]}),
 
 BLUM=new THREE.MeshBasicMaterial({color:0x2f7fe8,toneMapped:false,clippingPlanes:[WIPE]}),BLUS=new THREE.MeshBasicMaterial({color:0x1a4c9c,toneMapped:false,clippingPlanes:[WIPE]}),
 EDGEW=new THREE.LineBasicMaterial({color:0xffffff}),EDGED=new THREE.LineBasicMaterial({color:0x8e6c42});
const toV=([lo,la])=>new THREE.Vector2(-(la-LATC)*S15,(lo-LONC)*S15);
for(const f of GEO.features){const nm=f.properties.name;if(nm==='Antarctica')continue;
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 const shapes=polys.map(p=>{const s=new THREE.Shape(p[0].map(toV));for(const h of p.slice(1))s.holes.push(new THREE.Path(h.map(toV)));return s;});
 const us=nm==='United States of America';
 const g=new THREE.ExtrudeGeometry(shapes,{depth:us?.17:.05,bevelEnabled:false});
 const m=new THREE.Mesh(g,us?[REDM,REDS]:[LANDM,SIDEM]);m.rotation.x=-Math.PI/2;m.position.y=.015;m.castShadow=false;MAPG.add(m);
 if(us){const b=new THREE.Mesh(g,[BLUM,BLUS]);b.rotation.x=-Math.PI/2;b.position.y=.0185;MAPG.add(b);}
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,40),us?EDGEW:EDGED);e.rotation.x=-Math.PI/2;e.position.y=us?.02:.016;MAPG.add(e);}
const WEST_Z=mxz(-126,40).z,EAST_Z=mxz(-66,40).z;
// golden city lights (real US cities)
const GLOWT=tex(128,128,x=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,240,190,1)');g.addColorStop(.25,'rgba(255,205,90,.85)');g.addColorStop(1,'rgba(255,170,40,0)');x.fillStyle=g;x.fillRect(0,0,128,128);});
const CITIES=[[-74,40.7],[-118.2,34],[-87.6,41.9],[-95.4,29.8],[-112,33.4],[-75.2,40],[-98.5,29.4],[-117,32.7],[-96.8,32.8],[-122.3,47.6],[-105,39.7],[-80.2,25.8],[-84.4,33.7],[-71,42.4],[-83,42.3],[-93.3,45],
 [-115.1,36.2],[-122.7,45.5],[-122.4,37.8],[-86.8,36.2],[-94.6,39.1],[-90.2,38.6],[-111.9,40.8],[-80.8,35.2],[-90,30],[-106.6,35.1],[-97.5,35.5],[-96,41.3],[-83,40],[-80,40.4],[-81.7,41.5],[-88,43],[-76.6,39.3],[-121.5,38.6]];
const DOTS=CITIES.map(([lo,la],i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOWT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));s.position.copy(mxz(lo,la,US_Y+.05));s.userData.ph=i*1.7;s.scale.setScalar(.22);scene.add(s);return s;});
// ---------------- helpers: pill labels (black, white border) ----------------
const canv15=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,t,x:c.getContext('2d')};};
function pill(s,w=1.2){const P=canv15(512,128),x=P.x;x.fillStyle='#0d0d10';x.strokeStyle='#ffffff';x.lineWidth=9;x.beginPath();x.roundRect(8,8,496,112,56);x.fill();x.stroke();
 x.fillStyle='#fff';x.font='800 74px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText(s,256,70);P.t.needsUpdate=true;
 const m=add(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:P.t,transparent:true,toneMapped:false}),0,0,0,scene,false);m.renderOrder=5;return m;}
const face2cam=(m,p)=>{m.position.copy(p);m.lookAt(cam.position);};
// ---------------- US flag on a pole (west) + USA pill ----------------
const FLP=mxz(-109,42.2);
const POLE=add(CY(.03,.04,2.0,12),M(0xd6d9de,.3,.9),FLP.x,US_Y+1.0,FLP.z);const KNOB=add(new THREE.SphereGeometry(.06,12,8),M(0xd4af37,.3,1),FLP.x,US_Y+2.03,FLP.z);
const FLAG15=add(FG,FLAGM,FLP.x,US_Y+1.62,FLP.z-.62,scene,false);FLAG15.rotation.y=Math.PI/2;
const PUSA=pill('USA',1.05);
// ---------------- the gas pump (real look: red body, white GAS cap, digital screen, hose + nozzle) ----------------
const PP=mxz(-98,38.4);
const PUMP=new THREE.Group();PUMP.position.copy(PP);PUMP.rotation.y=Math.PI/2;scene.add(PUMP);
const SCR=canv15(512,320);let SCRK='';
function screen15(s,col){if(s+col===SCRK)return;SCRK=s+col;const x=SCR.x;x.fillStyle='#06110b';x.fillRect(0,0,512,320);x.fillStyle='#9fb6d0';x.font='800 50px Mont';x.textAlign='center';x.fillText('PRICE / GAL',256,66);
 x.fillStyle=col;x.font='800 170px Mont';x.fillText(s,256,250);x.strokeStyle='#33424f';x.lineWidth=10;x.strokeRect(5,5,502,310);SCR.t.needsUpdate=true;}
screen15('$4.10','#ff3b3b');
const CAPT=tex(512,160,x=>{x.fillStyle='#f4f4f0';x.fillRect(0,0,512,160);x.fillStyle='#d21e2a';x.fillRect(0,128,512,32);x.fillStyle='#d21e2a';x.font='900 110px Mont';x.textAlign='center';x.fillText('GAS',256,108);});
{const red=M(0xd21e2a,.4,.15),dk=M(0x1d1f24,.55,.3),wh=M(0xf4f4f0,.4);
 add(RB(.95,.14,.62,.03),dk,0,.07,0,PUMP);
 add(RB(.82,1.55,.5,.06),red,0,.9,0,PUMP);
 add(RB(.98,.34,.6,.05),wh,0,1.82,0,PUMP);
 const cp=add(new THREE.PlaneGeometry(.94,.3),new THREE.MeshBasicMaterial({map:CAPT,toneMapped:false}),0,1.82,.302,PUMP,false);
 add(B(.66,.44,.03),dk,0,1.32,.255,PUMP);
 add(new THREE.PlaneGeometry(.6,.375),new THREE.MeshBasicMaterial({map:SCR.t,toneMapped:false}),0,1.32,.272,PUMP,false);
 add(B(.5,.08,.03),M(0xffc61a,.4),0,.98,.255,PUMP);   // yellow REGULAR strip
 add(B(.1,.32,.12),dk,.47,.95,0,PUMP);   // nozzle holster
 const noz=new THREE.Group();noz.position.set(.5,1.06,.02);PUMP.add(noz);add(B(.08,.2,.09),M(0x111111,.4,.4),0,0,0,noz);add(CY(.02,.02,.2,10),M(0x9a9a9a,.3,.8),.0,.13,.06,noz).rotation.x=1.1;
 const hose=new THREE.CatmullRomCurve3([V3(.41,1.45,0),V3(.62,1.2,.05),V3(.66,.6,.08),V3(.58,.3,.06),V3(.5,.85,.03)]);add(new THREE.TubeGeometry(hose,40,.028,10),M(0x16171a,.6),0,0,0,PUMP);}
const PUMPH=2.0;
const PRICE_P=PP.clone().add(V3(0,PUMPH+.55,0));
popT('$4.10',.48,RED,PRICE_P,tPrices-.05,tIf+.25);
popT('$4.10',.42,RED,PRICE_P,tPaid-.05,1e9);
const COINS=[0,1,2,3].map(()=>{const c=CK.icon('dollar',{color:'#22d36b',size:.34});scene.add(c);return c;});
const ARUP=CK.icon('up',{color:'#ff2a2a',size:.55}),ARDN=CK.icon('down',{color:'#22e06a',size:.55});scene.add(ARUP);scene.add(ARDN);
const QM=popT('?',.7,YEL,PRICE_P.clone().add(V3(0,.05,0)),tToday-.05,tMeet-.08);
// ---------------- Trump (DC) -> El-Sayed + blue pulse rings ----------------
const DC=mxz(-77.3,38.9),CSC=1.4;
const ELS=person('elsayed',DC.x,DC.y,DC.z,Math.PI/2);FK.rig(ELS,{iris:'#3b2618',brow:'#1e1612'});
ELS.g.traverse(o=>{if(o.isMesh&&/short04|eyebrow/i.test(o.name+o.material.name)){o.material.roughness=.95;o.material.envMapIntensity=.12;o.material.color.setScalar(.55);o.material.needsUpdate=true;}});
const PTR=pill('TRUMP',1.15),PELS=pill('EL-SAYED',1.35);
const RINGM=()=>new THREE.MeshBasicMaterial({color:new THREE.Color(.45,1.3,3),toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const RINGS=[0,1,2].map(()=>{const r=add(new THREE.RingGeometry(.93,1,96),RINGM(),DC.x,US_Y+.03,DC.z,scene,false);r.rotation.x=-Math.PI/2;r.visible=false;return r;});
const PUFF15=add(new THREE.RingGeometry(.8,1,64),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:false}),DC.x,US_Y+.05,DC.z,scene,false);PUFF15.rotation.x=-Math.PI/2;
const bump=(t,t0,d=.32)=>{const k=Math.min(1,Math.max(0,(t-t0)/d));return k<=0?0:(1-Math.pow(1-k,3))*(1+Math.sin(k*Math.PI)*.22);};
function trump15(t){const P=TR,out=sm(tEls-.12,tEls+.12,t),s=CSC*(1-out);P.g.visible=s>.01;PTR.visible=P.g.visible;if(!P.g.visible)return;
 relax(P);idle(P,t,.6);P.g.position.copy(DC);P.g.rotation.y=Math.PI/2+out*2.5;P.g.scale.setScalar(Math.max(.001,s));
 face(P,{jaw:.02,smile:.35});FK.update(P,t,{expr:[['smirk',.6]],look:cam.position});face2cam(PTR,DC.clone().add(V3(.75,.08,0)));}
function els15(t){const P=ELS,k=bump(t,tEls+.02);P.g.visible=k>.01;PELS.visible=P.g.visible;if(!P.g.visible)return;
 relax(P);idle(P,t,.2);P.g.position.copy(DC);P.g.rotation.y=Math.PI/2;P.g.scale.setScalar(CSC*Math.max(.001,k));
 const wv=sm(tPres-.1,tPres+.15,t)*(1-sm(tMeet-.3,tMeet-.05,t));if(wv>0){wave(P,'R',t);}
 face(P,{jaw:.03+.03*Math.abs(Math.sin(t*8)),smile:.4+.3*wv});FK.update(P,t,{expr:[['joy',.35+.4*wv]],look:cam.position});face2cam(PELS,DC.clone().add(V3(.75,.08,0)));}
function rings15(t){RINGS.forEach((r,i)=>{const d=t-tEls-i*.35;r.visible=d>0;if(!r.visible)return;const ph=(d%1.05)/1.05;r.scale.setScalar(.25+1.6*ph);r.material.opacity=(1-ph)*.95;});
 const d=t-(tEls-.1);PUFF15.visible=d>0&&d<.45;if(PUFF15.visible){const k=d/.45;PUFF15.scale.setScalar(.2+.9*k);PUFF15.material.opacity=1-k;}}
// ---------------- Mike beside the pump (after the flash) ----------------
const MKP=mxz(-103.4,38.0);
function mike15(t){const P=MIKE,on=t>=tMeet-.04;P.g.visible=on;if(!on)return;
 relax(P);idle(P,t,1.1);P.g.position.copy(MKP);P.g.rotation.y=Math.PI/2-.12;P.g.scale.setScalar(CSC);
 const sh=sm(tPaid-.15,tPaid+.15,t);armsUp(P,.22*sh);pose(P,'head',-.05*sh,-.35*sh,0);
 face(P,{jaw:.05+.05*sh,smile:.15*(1-sh)});FK.update(P,t,{expr:[['shock',.9*sh],['joy',.3*(1-sh)]],look:sh>.5?PRICE_P:cam.position});}
const PMIKE=pill('MIKE',.95);
// ---------------- the map wipe red -> blue (from DC westward) ----------------
function wipe15(t){const k=sm(tPres-.05,tPres+.65,t);const c=k<=0?-1e4:(EAST_Z+(WEST_Z-EAST_Z)*k);WIPE.constant=c;WIPEI.constant=k<=0?1e4:-c;}
const WF15=document.createElement('div');WF15.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF15);
function animate(t){sun.intensity=2.4;WF15.style.opacity=String(Math.max(0,1-Math.abs(t-tMeet)/.14)*.95);updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;
 wipe15(t);trump15(t);els15(t);rings15(t);mike15(t);
 DOTS.forEach(s=>{const v=.75+.25*Math.sin(t*3+s.userData.ph);s.scale.setScalar(.24*v);s.material.opacity=v;});
 const fv=t<tMeet;[POLE,KNOB,FLAG15,PUSA].forEach(o=>o.visible=fv);FLAG15.rotation.x=.04*Math.sin(t*2.2);face2cam(PUSA,FLP.clone().add(V3(.45,.06,0)));
 const pk=1+.18*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tGas+.05)/.35)));PUMP.scale.setScalar(Math.max(.001,pk));PUMP.visible=pk>.01;
 screen15(t>=tToday-.05&&t<tMeet-.05?'?':'$4.10',t>=tToday-.05&&t<tMeet-.05?'#ffc61a':'#ff3b3b');
 COINS.forEach((c,i)=>{const a=t*2.4+i*Math.PI/2;CK.iconAnim(c,t,tPrices+.05+i*.06,tIf+.3,{pos:PP.clone().add(V3(Math.cos(a)*.95,1.0+.25*Math.sin(a*1.3),Math.sin(a)*.95)),cam,spin:.5});});
 const sw=Math.sin((t-tToday)*7);CK.iconAnim(ARUP,t,tToday,tMeet-.08,{pos:PP.clone().add(V3(.1,PUMPH+.55+.12*Math.max(0,sw),.72)),cam,spin:.3});
 CK.iconAnim(ARDN,t,tToday+.12,tMeet-.08,{pos:PP.clone().add(V3(.1,PUMPH+.55-.12*Math.max(0,-sw),-.72)),cam,spin:.3});
 PMIKE.visible=t>=tMike-.05&&t<tPaid-.1;if(PMIKE.visible)face2cam(PMIKE,MKP.clone().add(V3(0,2.75,0)));
 // after the flash: $ coins fly out of Mike into the pump on "paid"
 if(t>=tMeet){COINS.forEach((c,i)=>{const t0=tPaid+i*.12,u=Math.min(1,Math.max(0,(t-t0)/.55));const a=MKP.clone().add(V3(.7,1.3,-.2)),b=PP.clone().add(V3(.3,1.3,0));
  CK.iconAnim(c,t,t0,t0+.6,{pos:a.lerp(b,u).add(V3(0,Math.sin(u*Math.PI)*.5,0)),cam,spin:.4});});}}
// ---------------- camera (steady, north-up, monotone Hermite) ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const PUB=BXc(PP,.55,PUMPH+.9),DCB=BXc(DC,.5,2.6),MKB=BXc(MKP,.45,2.6);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const KEYS1=[[0,FT15([gbox(-125,25,-67,49,0,.2)],[1,1.55,0],40)],
 [tGas,FT15([gbox(-122,27,-70,48,0,.2),PUB,DCB],[1,1.35,0],40)],
 [tPrices+.25,FT15([PUB,BXc(PP,1.1,PUMPH+1.0)],[1,.75,.05],38)],
 [tIf+.15,FT15([PUB,BXc(PP,1.1,PUMPH+1.0)],[1,.72,.02],38,{slack:.95})],
 [tEls-.05,FT15([DCB,BXc(DC,1.2,.3)],[1,.8,-.06],38)],
 [tPres+.05,FT15([DCB,BXc(DC,1.6,.3)],[1,.8,-.03],38)],
 [tToday-.15,FT15([DCB,PUB,gbox(-104,31,-75,44,0,.2)],[1,1.0,0],40)],
 [tToday+.4,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.6,0],38)],
 [tMeet,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.58,.02],38,{slack:.95})]];
mike15(tPaid);
const PRB=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.0],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.0]),MKB2=BXc(MKP,.45,3.05);
const KEYS2=[[tMeet,FT15([MKB2,PUB],[1,.42,.12],38)],[tPaid+.2,FT15([MKB2,PUB,PRB],[1,.4,.05],38)],[HOOK_END,FT15([MKB2,PUB,PRB],[1,.38,0],38,{slack:.94})]];
mike15(0);
const ch15=F=>[...F.pos,...F.look,F.fov],unch15=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm15(keys,t){const n=keys.length;if(t<=keys[0][0])return ch15(keys[0][1]);if(t>=keys[n-1][0])return ch15(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch15(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
window.CAM14=t=>unch15(herm15(t<tMeet?KEYS1:KEYS2,t));   // the white flash on "Meet" hides the change of framing
window.CAM14_END=HOOK_END+5;
window.HOOK15={tGas,tEls,tPres,tToday,tMeet,HOOK_END};
