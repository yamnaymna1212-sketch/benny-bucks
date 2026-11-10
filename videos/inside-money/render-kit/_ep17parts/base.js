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
