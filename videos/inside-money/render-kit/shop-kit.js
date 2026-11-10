// shop-kit.js — real-looking shop interiors + props for every Inside Money episode (NEXT_LEVEL_PLAN stage 4, 2026-11-04).
// Reuses the scene helpers of the episode page (add/B/RB/CY/M/pbr/tex) and money-kit (MNY) for any cash.
// No bare primitives: every prop has rounded edges, panels, handles, labels or real textures.
//
// Use:  import {shopKit} from './shop-kit.js';  const SK=shopKit(THREE,{add,B,RB,CY,M,pbr,tex,MNY});
//   SK.burgerShop(x,z,{brand:'mcd'|'plain',name})  -> {g, counterY, counterZ, drawers:[...], lamps:[...]}  cutaway fast-food restaurant, open side = -z (camera looks +z)
//   SK.burger() / SK.fries() / SK.cup(colour) / SK.tray()   food props (Groups, origin at the bottom centre)
//   SK.register()                                           POS terminal + cash drawer (g.userData.drawer slides along +z = staff side)
//   SK.washer()  front-load washing machine (door faces -z): g.userData {door, drum, water, setDirt(k 0 dirty..1 clean), spin(t,speed), open(k)}
//   SK.dirty(mesh,k)   tint any money mesh/group brown-grey (k=1 fully dirty, 0 = clean)
//   SK.bankBack(x,z,{name})  rear alley of a bank: brick wall + sign + steel back door + dumpster + AC unit + pipes + wall lamp, asphalt
//   SK.bankLobby(x,z,{name}) teller line: marble floor, counter with glass partitions, BANK sign wall, rope stanchions, lamps -> {g,counterY,counterZ}
//   SK.darkRoom(x,z)  Zack-style cutaway secret room (blue cinematic light, one warm bulb) inside a 2-storey brick building, open side -z -> {g,lights,inner(mats)}
//   SK.bankFront(x,z,{name}) stone bank facade (columns, gold-letter frieze, glass doors, steps, lamps) + CCTV camera -> {g,cctv,led,door}
//   SK.duffel({open:1,straps:10,d:100})                     black sports bag full of real $10,000 straps (origin bottom centre, long side = x)
export function shopKit(THREE,{add,B,RB,CY,M,pbr,tex,MNY}){
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const G=()=>new THREE.Group(),S=(r,w=24,h=16,ps=0,pl=Math.PI*2,ts=0,tl=Math.PI)=>new THREE.SphereGeometry(r,w,h,ps,pl,ts,tl);
  const steel=M(0xc9ccd1,.28,.9),darkSteel=M(0x5c6168,.35,.85),black=M(0x18191c,.55,.1),rubber=M(0x0e0e10,.85,0);
  const RED='#da291c',YEL='#ffc72c';
  const logoM=(x,cx,cy,s,col=YEL)=>{x.save();x.strokeStyle=col;x.lineWidth=s*.2;x.lineCap='butt';   // golden arches: two parabolic arches
    for(const sd of[-1,1]){x.beginPath();const a=cx+sd*s*.5;x.moveTo(a-s*.5,cy+s*.62);x.bezierCurveTo(a-s*.5,cy-s*.9,a+s*.5,cy-s*.9,a+s*.5,cy+s*.62);x.stroke();}x.restore();};
  // ---------- food ----------
  const sesame=tex(256,128,x=>{x.fillStyle='#c77a2e';x.fillRect(0,0,256,128);const g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba(255,220,160,.35)');g.addColorStop(1,'rgba(90,40,10,.35)');x.fillStyle=g;x.fillRect(0,0,256,128);
    for(let i=0;i<70;i++){x.fillStyle='#f3e2b8';x.beginPath();x.ellipse(Math.random()*256,10+Math.random()*80,3,1.6,Math.random()*3,0,7);x.fill();}});
  function burger(){const g=G(),bun=new THREE.MeshStandardMaterial({map:sesame,roughness:.55});
    add(CY(.05,.047,.026,28),M(0xc98a45,.6),0,.013,0,g);
    add(CY(.054,.054,.02,28),M(0x4a2a17,.85),0,.036,0,g);   // patty
    const ch=add(B(.104,.004,.104),M(0xf2b32a,.45),0,.048,0,g);ch.rotation.y=.6;   // cheese slice, corners hang out
    add(CY(.057,.057,.006,20),M(0x5fa83a,.6),0,.053,0,g);   // lettuce
    const top=add(S(.056,28,14,0,Math.PI*2,0,Math.PI/2),bun,0,.056,0,g);top.scale.y=.75;return g;}
  function fries(){const g=G(),box=tex(256,256,x=>{x.fillStyle=RED;x.fillRect(0,0,256,256);logoM(x,128,120,70);});
    const b=add(CY(.05,.036,.11,4,1),[new THREE.MeshStandardMaterial({map:box,roughness:.6}),M(0xda291c,.6),M(0xda291c,.6)],0,.055,0,g);b.rotation.y=Math.PI/4;
    const fm=M(0xf1c04e,.55);for(let i=0;i<22;i++){const f=add(B(.008,.09+Math.random()*.03,.008),fm,(Math.random()-.5)*.055,.13,(Math.random()-.5)*.03,g);f.rotation.set((Math.random()-.5)*.35,Math.random()*3,(Math.random()-.5)*.35);}return g;}
  function cup(col=RED){const g=G(),lab=tex(256,256,x=>{x.fillStyle='#fff';x.fillRect(0,0,256,256);x.fillStyle=col;x.fillRect(0,40,256,176);logoM(x,128,120,62);});
    add(CY(.045,.034,.16,28),new THREE.MeshStandardMaterial({map:lab,roughness:.5}),0,.08,0,g);add(CY(.047,.047,.008,28),M(0xf4f4f4,.4),0,.163,0,g);
    const st=add(CY(.003,.003,.11,8),M(0xffffff,.4),.012,.21,0,g);st.rotation.z=.15;return g;}
  function tray(){const g=G();add(RB(.42,.02,.3,.008),M(0x8b1d14,.5),0,.01,0,g);
    const b=burger();b.position.set(-.09,.02,.02);g.add(b);const f=fries();f.position.set(.06,.02,-.05);g.add(f);const c=cup();c.position.set(.14,.02,.08);g.add(c);return g;}
  // ---------- register ----------
  const posUI=tex(512,320,x=>{x.fillStyle='#1c2430';x.fillRect(0,0,512,320);x.fillStyle=RED;x.fillRect(0,0,512,46);x.fillStyle='#fff';x.font='700 26px Mont';x.fillText('ORDER #208',16,32);
    const items=['Big Burger','Cheeseburger','Fries L','Soda M','Nuggets 10'];items.forEach((s,i)=>{x.fillStyle=i%2?'#2a3442':'#243040';x.fillRect(12,58+i*44,300,38);x.fillStyle='#e8eef6';x.font='600 22px Mont';x.fillText(s,24,84+i*44);});
    for(let i=0;i<6;i++){x.fillStyle=['#3a9d4a','#d8a022','#3a6fc4','#c4473a','#7a4fc4','#3aa0a0'][i];x.fillRect(326+(i%2)*92,58+Math.floor(i/2)*76,84,66);}x.fillStyle='#3a9d4a';x.fillRect(326,290-42,176,40);x.fillStyle='#fff';x.font='800 24px Mont';x.fillText('PAY',388,276);});
  function register(){const g=G();add(RB(.36,.09,.4,.015),black,0,.045,0,g);   // drawer housing
    const dr=G();dr.position.set(0,.045,.02);g.add(dr);add(RB(.33,.07,.36,.01),darkSteel,0,0,0,dr);   // drawer: slides out to +z (staff side)
    for(let i=0;i<4;i++)add(B(.07,.012,.15),M(0x2a2d33,.5,.4),-.12+i*.08,.03,.04,dr);   // bill slots
    add(CY(.016,.02,.16,12),black,0,.17,-.05,g);   // stand
    const scr=G();scr.position.set(0,.28,-.05);scr.rotation.x=-.35;g.add(scr);add(RB(.36,.24,.03,.012),black,0,0,0,scr);
    const s=add(new THREE.PlaneGeometry(.33,.21),new THREE.MeshBasicMaterial({map:posUI,toneMapped:false}),0,0,.016,scr,false);s.rotation.y=Math.PI;s.position.z=-.016;   // screen faces -z (customer) and +z
    const s2=add(new THREE.PlaneGeometry(.33,.21),new THREE.MeshBasicMaterial({map:posUI,toneMapped:false}),0,0,.016,scr,false);
    g.userData.drawer=dr;g.userData.slide=k=>{dr.position.z=.02+.3*k;};return g;}
  // ---------- duffel bag full of straps ----------
  function duffel({open=1,straps=10,d=100}={}){const g=G(),L=.62,R=.17;
    const nylon=tex(256,256,x=>{x.fillStyle='#1a1b1f';x.fillRect(0,0,256,256);for(let y=0;y<256;y+=4){x.fillStyle=y%8?'rgba(255,255,255,.025)':'rgba(0,0,0,.25)';x.fillRect(0,y,256,2);}});
    nylon.wrapS=nylon.wrapT=THREE.RepeatWrapping;nylon.repeat.set(4,2);const nm=new THREE.MeshStandardMaterial({map:nylon,roughness:.7,side:THREE.DoubleSide});
    // body = soft capsule (long side x), squashed; the open zipper = dark mouth on top with straps sticking out
    const body=add(new THREE.CapsuleGeometry(R,L-2*R,10,40),nm,0,R*.85,0,g);body.rotation.z=Math.PI/2;body.scale.set(.85,1,.8);
    const top=R*.85*2-.012,mw=.13*open+.02;
    const mouth=add(new THREE.CircleGeometry(.5,40),M(0x050506,.9),0,top+.001,0,g,false);mouth.rotation.x=-Math.PI/2;mouth.scale.set(L*.78,mw,1);
    const zip=M(0x9a9da3,.3,.9);for(const sd of[-1,1])add(RB(L*.8,.012,.014,.005),zip,0,top-.002,sd*mw*.52,g);
    for(const sd of[-1,1])add(RB(.025,.13,.2,.01),M(0xb0242a,.6),sd*(L/2-.005),R*.85,0,g);   // red end panels
    for(const sd of[-1,1]){const h=add(new THREE.TorusGeometry(.09,.011,8,24,Math.PI),M(0x2a2b30,.7),0,top-.01,sd*(mw*.5+.03),g);h.rotation.x=sd*-.35;}
    // straps spill out of the opening (real $10,000 straps from money-kit)
    const s=MNY.size(d,{nx:1,ny:1,nz:1}),list=[];for(let i=0;i<straps;i++){const m=MNY.strap(d);const k=i-(straps-1)/2;
      m.position.set(k*.055,top-.01+Math.abs(Math.sin(i*1.7))*.035,Math.sin(i*2.3)*.015);m.rotation.set(-.2+Math.sin(i*1.3)*.25,Math.sin(i)*.35,Math.cos(i*.7)*.3);g.add(m);list.push(m);}
    g.userData.straps=list;return g;}
  // ---------- the restaurant ----------
  function burgerShop(x0,z0,{brand='mcd',name="McDonald's"}={}){const g=G();g.position.set(x0,0,z0);
    const W=8,D=6,H=3.2;
    const tile=tex(512,512,x=>{for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#2b2b2e':'#d9d5cc';x.fillRect(i*64,j*64,64,64);}x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;for(let i=0;i<=8;i++){x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,512);x.moveTo(0,i*64);x.lineTo(512,i*64);x.stroke();}});
    tile.wrapS=tile.wrapT=THREE.RepeatWrapping;tile.repeat.set(W/2.4,D/2.4);
    add(B(W,.04,D),new THREE.MeshStandardMaterial({map:tile,roughness:.35,metalness:0}),0,.02,0,g,false);
    // back wall: red tile skirt + warm plaster, side wall: brick with a window
    add(B(W,1.1,.12),pbr('plastered_wall',3,1,0xb8281e),0,.55,D/2,g);add(B(W,H-1.1,.12),pbr('plastered_wall',3,1,0xf2e6cf),0,1.1+(H-1.1)/2,D/2,g);
    add(B(W,.06,.14),M(0xffc72c,.4),0,1.1,D/2-.01,g);   // yellow trim line
    add(B(.14,H,D),pbr('red_brick',3,1.6),-W/2,H/2,0,g);
    add(RB(.05,1.2,2.0,.02),M(0x1f2329,.4,.6),-W/2+.08,1.7,-.6,g);add(B(.02,1.1,1.9),new THREE.MeshPhysicalMaterial({color:0xbfd6e6,roughness:.05,transmission:.6,transparent:true,opacity:.35}),-W/2+.1,1.7,-.6,g);
    add(B(W,.12,D*.55),M(0xece6da,.8),0,H+.06,D*.225,g);   // ceiling over the kitchen half
    // menu boards (glowing screens) over the back counter
    const items=[['BIG BURGER','#c77a2e'],['CHEESEBURGER','#f2b32a'],['FRIES','#f1c04e'],['NUGGETS','#d89a4a']];
    for(let i=0;i<3;i++){const mt=tex(640,360,x=>{x.fillStyle='#14161a';x.fillRect(0,0,640,360);x.fillStyle=RED;x.fillRect(0,0,640,58);x.fillStyle='#fff';x.font='800 36px Mont';x.textAlign='center';x.fillText(['BURGERS','MEALS','SIDES & DRINKS'][i],320,42);
      for(let k=0;k<2;k++){const [n,c]=items[(i+k)%4],cx=170+k*300;x.fillStyle=c;x.beginPath();x.ellipse(cx,170,90,52,0,Math.PI,0);x.fill();x.fillStyle='#4a2a17';x.fillRect(cx-92,172,184,22);x.fillStyle='#c98a45';x.fillRect(cx-86,194,172,18);
        x.fillStyle='#fff';x.font='700 30px Mont';x.fillText(n,cx,262);}
      logoM(x,600,320,26);});
      add(RB(1.9,1.07,.06,.02),black,-2.1+i*2.1,2.35,D/2-.1,g);const s=add(new THREE.PlaneGeometry(1.82,1.0),new THREE.MeshBasicMaterial({map:mt,toneMapped:false}),-2.1+i*2.1,2.35,D/2-.135,g,false);s.rotation.y=Math.PI;}
    // back counter + kitchen: fryer, flat-top grill with hood, drink machine
    add(RB(W-.6,.9,.7,.02),steel,0,.45,D/2-.5,g);
    const fx=-2.4;add(RB(.8,.12,.6,.02),darkSteel,fx,.96,D/2-.5,g);for(const sd of[-1,1]){add(B(.3,.05,.4),M(0xc99a2a,.25,.2),fx+sd*.2,.99,D/2-.5,g);   // oil
      const bk=add(RB(.26,.14,.3,.01),M(0xb8bcc2,.4,.9,{wireframe:false}),fx+sd*.2,1.12,D/2-.55,g);add(CY(.01,.01,.3,8),black,fx+sd*.2,1.2,D/2-.78,g).rotation.x=Math.PI/2;}
    add(RB(1.2,.06,.6,.01),M(0x2b2d31,.25,.9),-.8,.93,D/2-.5,g);for(let i=0;i<4;i++){const p=add(CY(.055,.055,.018,20),M(0x4a2a17,.85),-1.15+i*.22,.97,D/2-.55,g);}
    add(RB(1.4,.5,.7,.03),steel,-.8,2.95,D/2-.45,g);   // hood
    const dm=add(RB(.8,.75,.5,.03),M(0x1d1f23,.4,.5),1.6,1.3,D/2-.45,g);for(let i=0;i<4;i++){add(RB(.14,.2,.04,.01),M([0xda291c,0x1f5fbf,0xf2b32a,0x2f9d47][i],.4),1.32+i*.185,1.42,D/2-.71,g);add(CY(.012,.012,.06,8),steel,1.32+i*.185,1.22,D/2-.72,g);}
    for(let i=0;i<5;i++){const c=cup();c.position.set(2.5+(i%2)*.1,.9+Math.floor(i/2)*.17,D/2-.5);g.add(c);}
    // front counter: dark wood panel + red band + steel top
    const CZ=.6,CH=1.05;add(RB(4.6,CH-.05,.7,.03),pbr('wood_planks',3,1,0x6b4a33),0,(CH-.05)/2,CZ,g);add(B(4.62,.16,.02),M(0xda291c,.45),0,.72,CZ-.355,g);
    add(RB(4.8,.05,.8,.015),M(0xd8dadd,.22,.85),0,CH-.025,CZ,g);
    const regs=[-1.5,1.1].map(xx=>{const r=register();r.position.set(xx,CH,CZ);g.add(r);return r;});
    {const t=tray();t.position.set(1.75,CH,CZ-.05);g.add(t);}
    {const n=add(RB(.12,.16,.1,.01),steel,-2.1,CH+.08,CZ-.15,g);}   // napkin dispenser
    // dining room: two booths with tables
    for(const sd of[-1,1]){const bx=sd*2.7,bz=-1.8;add(RB(1.1,.05,.75,.02),M(0xf0ece4,.3),bx,.76,bz,g);add(CY(.04,.06,.72,12),steel,bx,.38,bz,g);add(CY(.25,.25,.03,24),steel,bx,.015,bz,g);
      for(const s2 of[-1,1]){add(RB(1.2,.14,.5,.06),M(0xc1261b,.45),bx,.47,bz+s2*.72,g);add(RB(1.2,.62,.14,.06),M(0xc1261b,.45),bx,.82,bz+s2*.95,g);add(RB(1.2,.4,.45,.03),M(0x3a3d42,.6),bx,.2,bz+s2*.72,g);}}
    // pendant lamps over the counter (warm light)
    const lamps=[];for(let i=0;i<3;i++){const lx=-1.6+i*1.6;add(CY(.004,.004,1.0,6),black,lx,H-.5,CZ+.2,g);const sh=add(CY(.06,.22,.2,28,1,true),M(0xffc72c,.4,.2,{side:THREE.DoubleSide}),lx,H-1.05,CZ+.2,g);
      add(S(.05),new THREE.MeshBasicMaterial({color:0xfff2d6}),lx,H-1.12,CZ+.2,g,false);const L=new THREE.PointLight(0xffd9a8,1.3,7,1.6);L.position.set(lx,H-1.2,CZ-.4);g.add(L);lamps.push(L);}
    // the sign over the open front (readable from the street side, -z)
    const sign=tex(1600,320,x=>{x.fillStyle=RED;x.fillRect(0,0,1600,320);if(brand==='mcd'){logoM(x,190,150,150);x.fillStyle=YEL;x.font='800 170px Mont';x.textAlign='left';x.fillText(name,380,225);}
      else{x.fillStyle='#fff';x.font='800 170px Mont';x.textAlign='center';x.fillText(name,800,225);}x.fillStyle=YEL;x.fillRect(0,296,1600,24);});
    add(RB(W*.72,1.15,.25,.04),M(0xb8231a,.5),0,H+.62,-D/2+.3,g);const sg=add(new THREE.PlaneGeometry(W*.7,1.1*.98*0+1.0),new THREE.MeshBasicMaterial({map:sign,toneMapped:false}),0,H+.62,-D/2+.17,g,false);sg.rotation.y=Math.PI;
    for(const sd of[-1,1])add(RB(.25,H,.25,.04),M(0xb8231a,.5),sd*(W/2-.12),H/2,-D/2+.3,g);   // front pillars
    return {g,counterY:CH,counterZ:CZ,registers:regs,lamps,W,D,H};}

  // ---------- dirty money tint ----------
  function dirty(o,k=1){o.traverse(m=>{if(!m.isMesh)return;const arr=Array.isArray(m.material)?m.material:[m.material];
    const nm=arr.map(mt=>{const c=mt.userData.dirtySrc?mt:mt.clone();c.userData.dirtySrc=c.userData.dirtySrc||mt;c.color=new THREE.Color(1,1,1).lerp(new THREE.Color(.36,.28,.17),k);c.roughness=Math.min(1,(mt.roughness??.8)+.15*k);if(c.emissive&&k>0)c.emissiveIntensity=0;return c;});
    m.material=Array.isArray(m.material)?nm:nm[0];});return o;}
  // ---------- washing machine ----------
  function washer(){const g=G(),Wd=.6,Hh=.85,Dd=.6,white=M(0xf2f3f5,.35,.05);
    // cabinet = 5 panels + a front panel with the round porthole (so the drum is visible through the glass)
    add(RB(Wd,Hh,.03,.012),white,0,Hh/2,Dd/2-.015,g);add(RB(Wd,.03,Dd,.012),white,0,Hh-.015,0,g);add(RB(Wd,.03,Dd,.012),white,0,.015,0,g);
    for(const sd of[-1,1])add(RB(.03,Hh,Dd,.012),white,sd*(Wd/2-.015),Hh/2,0,g);
    {const sh=new THREE.Shape();sh.moveTo(-Wd/2,0);sh.lineTo(Wd/2,0);sh.lineTo(Wd/2,Hh);sh.lineTo(-Wd/2,Hh);sh.closePath();const hl=new THREE.Path();hl.absarc(0,.42,.215,0,Math.PI*2,true);sh.holes.push(hl);
     const fg=new THREE.ExtrudeGeometry(sh,{depth:.025,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:48});const f=add(fg,white,0,0,-Dd/2,g);}
    const pan=tex(512,96,x=>{x.fillStyle='#e9ebee';x.fillRect(0,0,512,96);x.fillStyle='#20252c';x.fillRect(300,22,150,52);x.fillStyle='#46e08a';x.font='700 34px Mont';x.fillText('0:42',330,60);
      x.fillStyle='#3a3f46';x.font='600 16px Mont';x.fillText('HEAVY DUTY',24,30);x.fillText('WASH  RINSE  SPIN',24,70);x.fillStyle='#7f8791';for(let i=0;i<3;i++){x.beginPath();x.arc(470,26+i*22,6,0,7);x.fill();}});
    const p=add(new THREE.PlaneGeometry(Wd*.92,.11),new THREE.MeshStandardMaterial({map:pan,roughness:.4}),0,Hh-.075,-Dd/2-.013,g,false);p.rotation.y=Math.PI;
    const dial=add(CY(.045,.045,.03,28),M(0xd8dbe0,.25,.8),-.03,Hh-.075,-Dd/2-.027,g);dial.rotation.x=Math.PI/2;
    add(B(Wd*.95,.004,.004),M(0xb9bcc2,.4),0,Hh-.14,-Dd/2-.013,g);   // panel seam
    add(RB(.16,.06,.02,.008),M(0xdfe2e6,.4),-.2,.05,-Dd/2-.014,g);   // filter flap
    // drum: dark steel cylinder with holes, axis along z, opening at the front
    const cz=.42,R=.22;const holes=tex(512,256,x=>{x.fillStyle='#9aa0a8';x.fillRect(0,0,512,256);x.fillStyle='#2a2e33';for(let i=0;i<40;i++)for(let j=0;j<14;j++){x.beginPath();x.arc(i*13+(j%2)*6,j*18+9,3.2,0,7);x.fill();}});
    holes.wrapS=holes.wrapT=THREE.RepeatWrapping;holes.repeat.set(3,1);
    const drum=G();drum.position.set(0,cz,0);g.add(drum);const dm=add(new THREE.CylinderGeometry(R,R,.42,40,1,true),new THREE.MeshStandardMaterial({map:holes,metalness:.85,roughness:.35,side:THREE.BackSide}),0,0,.02,drum,false);dm.rotation.x=Math.PI/2;
    add(new THREE.CircleGeometry(R,40),M(0x6f757d,.4,.8),0,0,.23,drum,false).rotation.y=Math.PI;
    for(let i=0;i<3;i++){const l=add(RB(.05,.08,.38,.015),M(0xb7bcc3,.3,.85),0,R-.035,.02,drum,false);const piv=G();piv.rotation.z=i*Math.PI*2/3;piv.add(l);drum.add(piv);}   // paddles
    const water=add(new THREE.CircleGeometry(R*.98,40),new THREE.MeshPhysicalMaterial({color:0x6b5232,roughness:.15,transparent:true,opacity:.55,transmission:0,depthWrite:false}),0,cz,-Dd/2+.1,g,false);water.rotation.y=Math.PI;
    const bub=[];for(let i=0;i<18;i++){const b=add(S(.005+Math.random()*.009,10,8),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.05,transparent:true,opacity:.7,clearcoat:1}),0,0,0,g,false);b.userData.s=Math.random()*9;bub.push(b);}
    // door: chrome ring + tinted glass, hinged on the left (screen right) edge
    const hinge=G();hinge.position.set(-.26*0+.245,cz,-Dd/2-.02);g.add(hinge);const door=G();door.position.set(-.245,0,0);hinge.add(door);
    add(new THREE.TorusGeometry(.2,.03,16,48),M(0xc4c8ce,.3,.8),0,0,0,door);
    add(new THREE.TorusGeometry(.17,.012,10,40),M(0x2c3036,.5,.4),0,0,-.004,door);
    const glass=add(S(.175,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0xcfe3ef,roughness:.03,metalness:0,transparent:true,opacity:.12,clearcoat:1,depthWrite:false}),0,0,.0,door,false);glass.rotation.x=Math.PI/2;glass.scale.y=.3;
    add(RB(.05,.12,.04,.012),M(0xc8ccd2,.2,1),-.19,0,-.01,door);   // handle
    const notes=G();drum.add(notes);
    g.userData={door,drum,water,notes,bub,cz,R,front:-Dd/2,
      open:k=>{hinge.rotation.y=-k*1.9;},
      spin:(t,sp=1)=>{drum.rotation.z=-t*sp*7;notes.rotation.z=Math.sin(t*3)*.4;
        for(const b of bub){const a=b.userData.s+t*1.7*sp,r=R*(.35+.55*((b.userData.s*7)%1));b.position.set(Math.cos(a)*r,cz+Math.sin(a)*r*.8-.03,-Dd/2+.12+((b.userData.s*3)%1)*.05);b.visible=sp>.05;}},
      setDirt:k=>{water.material.color.setRGB(.30+(.74-.30)*(1-k),.21+(.86-.21)*(1-k),.11+(.95-.11)*(1-k));water.material.opacity=.15+.6*k;}};
    return g;}
  // ---------- bank: rear alley ----------
  function bankBack(x0,z0,{name='FIRST NATIONAL BANK'}={}){const g=G();g.position.set(x0,0,z0);
    add(B(14,.02,8),pbr('worn_asphalt',4,2.4),0,.01,-1.5,g,false);
    add(B(12,5.2,.4),pbr('red_brick',5,2.2),0,2.6,2.6,g);
    add(B(12.2,.3,.6),M(0xd8d2c6,.7),0,5.3,2.6,g);   // cornice
    add(B(12.05,.18,.45),M(0xcfc8bb,.8),0,.09,2.42,g);   // base course
    const sg=tex(1600,260,x=>{x.fillStyle='#0f2a4f';x.fillRect(0,0,1600,260);x.strokeStyle='#d4af37';x.lineWidth=12;x.strokeRect(14,14,1572,232);x.fillStyle='#f5f1e6';x.font='800 128px Mont';x.textAlign='center';x.fillText(name,800,178);});
    add(RB(4.3,.74,.12,.03),M(0x0c2240,.5,.3),0,3.3,2.36,g);const s=add(new THREE.PlaneGeometry(4.2,.68),new THREE.MeshBasicMaterial({map:sg,toneMapped:false}),0,3.3,2.295,g,false);s.rotation.y=Math.PI;
    // steel back door with frame, push bar, EMPLOYEES ONLY plate + wall lamp above
    add(RB(1.25,2.35,.12,.02),M(0x3d4249,.5,.6),-2.4,1.17,2.38,g);add(RB(1.05,2.2,.06,.015),M(0x6c737c,.4,.75),-2.4,1.12,2.33,g);
    add(RB(.6,.05,.06,.02),M(0xc9ccd1,.25,.9),-2.4,1.1,2.28,g);
    const pl=tex(300,90,x=>{x.fillStyle='#b8231a';x.fillRect(0,0,300,90);x.fillStyle='#fff';x.font='800 30px Mont';x.textAlign='center';x.fillText('EMPLOYEES ONLY',150,56);});
    {const q=add(new THREE.PlaneGeometry(.5,.15),new THREE.MeshStandardMaterial({map:pl,roughness:.5}),-2.4,1.75,2.295,g,false);q.rotation.y=Math.PI;}
    add(RB(.3,.18,.25,.03),M(0x22252a,.5,.5),-2.4,2.6,2.3,g);const L=new THREE.PointLight(0xfff0d0,2.5,6,1.6);L.position.set(-2.4,2.45,2.0);g.add(L);
    // dumpster (green, lids, wheels), AC unit with fan grille, downpipe
    const dg=M(0x2f5f3a,.55,.35);add(RB(1.9,1.1,1.05,.05),dg,2.6,.68,1.7,g);for(const sd of[-1,1]){const l=add(RB(.94,.05,1.1,.02),M(0x1f2a22,.6),2.6+sd*.48,1.25,1.68,g);l.rotation.x=-.05;}
    for(const sd of[-1,1])for(const s2 of[-1,1]){const w=add(CY(.07,.07,.05,16),rubber,2.6+sd*.8,.07,1.7+s2*.4,g);w.rotation.z=Math.PI/2;}
    add(RB(.9,.75,.8,.04),M(0xd9dbde,.45,.4),5.0,.42,1.95,g);{const gr=add(new THREE.CircleGeometry(.3,32),new THREE.MeshStandardMaterial({color:0x2a2c30,roughness:.6,metalness:.5,wireframe:true}),5.0,.45,1.545,g,false);gr.rotation.y=Math.PI;}
    add(CY(.06,.06,5.0,16),M(0x8d939b,.4,.7),-5.6,2.5,2.35,g);
    for(let i=0;i<3;i++)add(CY(.05,.05,.02,12),M(0x8d939b,.4,.7),-5.6,1+i*1.5,2.31,g);
    return {g};}
  // ---------- bank: teller line ----------
  function bankLobby(x0,z0,{name='FIRST NATIONAL BANK'}={}){const g=G();g.position.set(x0,0,z0);
    const mar=tex(512,512,x=>{x.fillStyle='#e9e4da';x.fillRect(0,0,512,512);for(let i=0;i<60;i++){x.strokeStyle=`rgba(120,110,95,${.05+Math.random()*.12})`;x.lineWidth=1+Math.random()*2;x.beginPath();let px=Math.random()*512,py=Math.random()*512;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(Math.random()-.4)*90;py+=(Math.random()-.5)*60;x.lineTo(px,py);}x.stroke();}
      x.strokeStyle='rgba(80,70,60,.35)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*128,0);x.lineTo(i*128,512);x.moveTo(0,i*128);x.lineTo(512,i*128);x.stroke();}});
    mar.wrapS=mar.wrapT=THREE.RepeatWrapping;mar.repeat.set(4,3);add(B(10,.04,7),new THREE.MeshStandardMaterial({map:mar,roughness:.18,metalness:0}),0,.02,0,g,false);
    add(B(10,4.2,.2),pbr('plastered_wall',3,1.3,0xe8dcc6),0,2.1,3.3,g);add(B(.2,4.2,7),pbr('plastered_wall',2,1.3,0xe8dcc6),-5,2.1,0,g);
    for(let i=0;i<4;i++)add(CY(.22,.26,4.2,32),M(0xf1ece2,.35),-3.6+i*2.4,2.1,2.9,g);   // columns
    const sg=tex(1600,220,x=>{x.fillStyle='#0f2a4f';x.fillRect(0,0,1600,220);x.fillStyle='#d4af37';x.font='800 120px Mont';x.textAlign='center';x.fillText(name,800,155);});
    {const s=add(new THREE.PlaneGeometry(5.4,.74),new THREE.MeshBasicMaterial({map:sg,toneMapped:false}),0,3.55,3.19,g,false);s.rotation.y=Math.PI;}
    // teller counter: dark walnut + marble top + glass partitions with brass frames + window numbers
    const CZ=1.4,CH=1.1;add(RB(6.5,CH-.06,.75,.03),pbr('wood_planks',3,1,0x5a3a26),0,(CH-.06)/2,CZ,g);add(RB(6.7,.06,.85,.02),new THREE.MeshStandardMaterial({map:mar,roughness:.15}),0,CH-.03,CZ,g);
    const brass=M(0xc9a44a,.3,1),gl=new THREE.MeshPhysicalMaterial({color:0xdcecf4,roughness:.04,transparent:true,opacity:.05,clearcoat:1,depthWrite:false});
    for(let i=0;i<4;i++){const xx=-2.4+i*1.6;add(B(1.5,.9,.012),gl,xx,CH+.62,CZ+.12,g,false);add(RB(1.52,.04,.04,.01),brass,xx,CH+1.08,CZ+.12,g);add(RB(.04,.95,.04,.01),brass,xx-.76,CH+.6,CZ+.12,g);
      add(RB(.5,.06,.04,.01),brass,xx,CH+.17,CZ+.12,g);   // pass-through slot rim
      const nt=tex(128,128,x=>{x.fillStyle='#0f2a4f';x.fillRect(0,0,128,128);x.fillStyle='#d4af37';x.font='800 84px Mont';x.textAlign='center';x.fillText(String(i+1),64,96);});
      const n=add(new THREE.PlaneGeometry(.16,.16),new THREE.MeshBasicMaterial({map:nt,toneMapped:false}),xx,CH+1.2,CZ+.1,g,false);n.rotation.y=Math.PI;}
    add(RB(.04,.95,.04,.01),brass,4.0,CH+.6,CZ+.12,g);
    // rope stanchions (customer side)
    for(let i=0;i<4;i++){const xx=-2.4+i*1.6;add(CY(.03,.03,.95,16),brass,xx,.5,CZ-1.6,g);add(S(.045),brass,xx,.99,CZ-1.6,g);add(CY(.14,.16,.04,24),brass,xx,.02,CZ-1.6,g);
      if(i<3){const r=add(new THREE.TorusGeometry(.8,.025,8,32,Math.PI),M(0x8b1d24,.6),xx+.8,.92,CZ-1.6,g);r.rotation.z=Math.PI;r.scale.y=.25;}}
    for(let i=0;i<3;i++){const L=new THREE.PointLight(0xfff1dc,1.0,8,1.6);L.position.set(-2+i*2,3.6,CZ-1.2);g.add(L);add(CY(.25,.25,.06,32),M(0xf6f1e4,.4,0,{emissive:0xfff1dc,emissiveIntensity:.25}),-2+i*2,4.15,CZ-1.2,g,false);}
    return {g,counterY:CH,counterZ:CZ};}

  // ---------- secret room (cutaway): Zack-style bright blue backdrop, nothing but the action ----------
  // user 2026-11-04: a black-clad criminal must read against the background -> mid/bright blue walls, warm key + cyan rim, no clutter
  function darkRoom(x0,z0,{W=4.6,D=3.6,H=2.8}={}){const g=G();g.position.set(x0,0,z0);const inner=[];
    const dim=m=>{m=m.clone();m.envMapIntensity=.25;inner.push(m);return m;};
    const wallT=tex(512,512,x=>{const gr=x.createRadialGradient(256,230,40,256,256,420);gr.addColorStop(0,'#5d8fe0');gr.addColorStop(.6,'#3a64b4');gr.addColorStop(1,'#203c78');x.fillStyle=gr;x.fillRect(0,0,512,512);
      for(let i=0;i<2500;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.035})`;x.fillRect(Math.random()*512,Math.random()*512,2,2);}});
    const wall=dim(new THREE.MeshStandardMaterial({map:wallT,roughness:.9}));
    add(B(W,.05,D),dim(pbr('concrete_pavement',2,1.6,0x9aa6bb)),0,.025,D/2,g,false);
    add(B(W,H,.15),wall,0,H/2,D+.075,g);for(const sd of[-1,1])add(B(.15,H,D),wall,sd*(W/2+.075),H/2,D/2,g);
    add(B(W+.3,.15,D+.15),dim(M(0x1c2a4a,.9)),0,H+.075,D/2,g);
    // outside shell: 2-storey brick building, the ground-floor front is cut away
    const br=pbr('red_brick',3,2,0x9a6a5a);add(B(W+.5,3.2,D+.3),br,0,H+.15+1.6,D/2,g);add(B(.25,H,D+.3),br,-(W/2+.27),H/2,D/2,g);add(B(.25,H,D+.3),br,W/2+.27,H/2,D/2,g);
    for(let i=0;i<3;i++){const wx=-1.4+i*1.4;add(RB(.9,1.2,.06,.02),M(0xe8e2d6,.6),wx,H+1.7,-.02,g);add(B(.8,1.1,.05),M(0x1d2a3a,.1,.4),wx,H+1.7,-.04,g,false);}
    add(B(W+.6,.2,.4),M(0xd8d2c6,.7),0,H+3.35,0,g);add(B(W+.5,.18,.12),M(0x2a2c30,.6),0,H+.06,-.02,g);
    // one bare bulb over the washer (warm key), cool fill, strong cyan rim from behind (separates the black figure)
    add(CY(.004,.004,.6,6),M(0x111111,.6),.6,H-.3,1.6,g);add(S(.05,16,12),new THREE.MeshBasicMaterial({color:0xffd59a}),.6,H-.62,1.6,g,false);
    const warm=new THREE.PointLight(0xffc488,6,7,1.4);warm.position.set(.6,H-.7,1.4);g.add(warm);
    const fill=new THREE.PointLight(0x9ab8ff,3,8,1.2);fill.position.set(-.6,2.0,-.8);g.add(fill);
    const rim=new THREE.PointLight(0x5fe6ff,7,5,1.4);rim.position.set(1.7,1.9,2.6);g.add(rim);
    const rim2=new THREE.PointLight(0x5fe6ff,4,5,1.4);rim2.position.set(-.4,1.9,2.9);g.add(rim2);
    return {g,lights:[warm,fill,rim,rim2],inner,W,D,H};}
  // ---------- laundry basket heaped with straps ----------
  function basket({n=14,d=100}={}){const g=G();const wick=tex(256,128,x=>{x.fillStyle='#d9c9a2';x.fillRect(0,0,256,128);x.strokeStyle='#a58f62';x.lineWidth=5;for(let i=0;i<256;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,128);x.stroke();}for(let j=0;j<128;j+=12){x.strokeStyle='rgba(120,95,55,.6)';x.beginPath();x.moveTo(0,j);x.lineTo(256,j);x.stroke();}});
    wick.wrapS=THREE.RepeatWrapping;wick.repeat.set(3,1);add(new THREE.CylinderGeometry(.33,.27,.36,32,1,true),new THREE.MeshStandardMaterial({map:wick,roughness:.85,side:THREE.DoubleSide}),0,.18,0,g);
    add(new THREE.CircleGeometry(.27,32),M(0xb59f72,.9),0,.01,0,g).rotation.x=-Math.PI/2;add(new THREE.TorusGeometry(.33,.018,8,40),M(0xc4ad7c,.8),0,.36,0,g).rotation.x=Math.PI/2;
    const list=[];for(let i=0;i<n;i++){const m=MNY.strap(d);const a=i*2.4,r=.04+((i*.37)%1)*.17;m.position.set(Math.cos(a)*r,.3+((i*.53)%1)*.1+(i>9?.06:0),Math.sin(a)*r);m.rotation.set(Math.sin(i)*.4,a,Math.cos(i*1.3)*.35);g.add(m);list.push(m);}
    g.userData.straps=list;return g;}
  // ---------- bank: real building (open doorway, lobby INSIDE, so the camera simply follows him in) ----------
  function bankFront(x0,z0,{name='BANK',W=6.4,H=5.4,D=7}={}){const g=G();g.position.set(x0,0,z0);
    const stone=pbr('white_stucco',3,2,0xe4dccb),DW=2.0,DH=2.9;
    // front wall with the doorway, side walls, back wall, roof (shell, so the inside is real space)
    add(B((W-DW)/2,H,.3),stone,-(W+DW)/4,H/2,.15,g);add(B((W-DW)/2,H,.3),stone,(W+DW)/4,H/2,.15,g);add(B(DW,H-DH,.3),stone,0,DH+(H-DH)/2,.15,g);
    for(const sd of[-1,1])add(B(.3,H,D),stone,sd*(W/2-.15),H/2,D/2,g);add(B(W,H,.3),stone,0,H/2,D-.15,g);add(B(W,.3,D),stone,0,H-.15,D/2,g);
    for(let i=0;i<3;i++)add(RB(W+.4-i*.4,.16,1.0-i*.15,.02),M(0xd6cfbf,.7),0,.08+i*.16,-.45+i*.08,g);   // steps
    for(let i=0;i<4;i++){const cx=[-2.75,-1.6,1.6,2.75][i];add(CY(.24,.28,H-1.6,32),M(0xf1ece2,.4),cx,(H-1.6)/2+.48,-.25,g);add(RB(.7,.2,.7,.03),M(0xe8e1d2,.5),cx,H-1.02,-.25,g);add(RB(.66,.18,.66,.03),M(0xe8e1d2,.5),cx,.57,-.25,g);}   // wide middle gap = walkway
    add(B(W+.3,.9,.9),stone,0,H-.45,-.25,g);
    const fr=tex(1800,200,x=>{x.fillStyle='#e9e2d2';x.fillRect(0,0,1800,200);x.fillStyle='#b88a2a';x.font='800 170px Mont';x.textAlign='center';x.fillText(name,900,165);x.fillStyle='rgba(0,0,0,.18)';x.fillText(name,903,169);});
    {const s=add(new THREE.PlaneGeometry(W-.4,(W-.4)/9),new THREE.MeshStandardMaterial({map:fr,roughness:.5,metalness:.1}),0,H-.45,-.705,g,false);s.rotation.y=Math.PI;}
    {const p=new THREE.Shape();p.moveTo(-W/2-.15,0);p.lineTo(W/2+.15,0);p.lineTo(0,1.1);p.closePath();add(new THREE.ExtrudeGeometry(p,{depth:.9,bevelEnabled:false}),stone,0,H,-.7,g);}
    // two glass doors on hinges (open inwards when someone walks through)
    add(RB(DW+.2,.12,.14,.02),M(0x2a2420,.5,.4),0,DH,.0,g);const gl=new THREE.MeshPhysicalMaterial({color:0xbcd6e4,roughness:.05,metalness:.1,transparent:true,opacity:.35,clearcoat:1,depthWrite:false});
    const doors=[-1,1].map(sd=>{const h=G();h.position.set(sd*DW/2,0,.05);g.add(h);const d=add(B(DW/2-.04,DH-.06,.04),gl,-sd*(DW/4),(DH-.06)/2,0,h,false);
      add(RB(.06,DH-.04,.06,.01),M(0x2a2420,.5,.4),-sd*.02,(DH-.04)/2,0,h);add(RB(.06,DH-.04,.06,.01),M(0x2a2420,.5,.4),-sd*(DW/2-.06),(DH-.04)/2,0,h);add(RB(.04,.5,.04,.01),M(0xc9a44a,.3,1),-sd*(DW/2-.16),1.05,-.05,h);return h;});
    for(const sd of[-1,1]){add(CY(.04,.04,.5,12),M(0x1d1d1f,.4,.6),sd*1.3,3.0,-.12,g);add(S(.12,16,12),new THREE.MeshStandardMaterial({color:0xfff1d0,emissive:0xffe0a0,emissiveIntensity:1.1}),sd*1.3,3.3,-.12,g,false);}
    {const atm=G();atm.position.set(W/2-.6,0,-.02);g.add(atm);add(RB(.7,1.7,.3,.03),M(0x2c3a4f,.4,.5),0,.85+.48,0,atm);const sc=tex(256,200,x=>{x.fillStyle='#0c4a8a';x.fillRect(0,0,256,200);x.fillStyle='#fff';x.font='800 44px Mont';x.textAlign='center';x.fillText('ATM',128,110);});
      const s2=add(new THREE.PlaneGeometry(.42,.34),new THREE.MeshBasicMaterial({map:sc,toneMapped:false}),0,1.75,-.155,atm,false);s2.rotation.y=Math.PI;}
    const cctv=G();cctv.position.set(-W/2+.35,3.3,-.75);g.add(cctv);add(RB(.12,.35,.12,.02),M(0xe8e8ea,.4),0,.15,0,cctv);
    const head=G();cctv.add(head);add(RB(.24,.22,.6,.05),M(0xf1f1f3,.35),0,0,-.18,head);add(CY(.075,.075,.05,20),M(0x111216,.2,.5),0,0,-.49,head).rotation.x=Math.PI/2;
    const led=add(S(.02,10,8),new THREE.MeshBasicMaterial({color:0x330000}),.08,.07,-.47,head,false);
    // ---- the lobby inside: marble floor, warm walls, teller counter (2 windows) at depth CZ, rope line, ceiling lights ----
    const mar=tex(512,512,x=>{x.fillStyle='#e9e4da';x.fillRect(0,0,512,512);for(let i=0;i<60;i++){x.strokeStyle=`rgba(120,110,95,${.05+Math.random()*.12})`;x.lineWidth=1+Math.random()*2;x.beginPath();let px=Math.random()*512,py=Math.random()*512;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(Math.random()-.4)*90;py+=(Math.random()-.5)*60;x.lineTo(px,py);}x.stroke();}
      x.strokeStyle='rgba(80,70,60,.35)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*128,0);x.lineTo(i*128,512);x.moveTo(0,i*128);x.lineTo(512,i*128);x.stroke();}});
    mar.wrapS=mar.wrapT=THREE.RepeatWrapping;mar.repeat.set(3,3);add(B(W-.6,.04,D-.6),new THREE.MeshStandardMaterial({map:mar,roughness:.18}),0,.02,D/2,g,false);
    const iw=pbr('plastered_wall',2,1.3,0xeadfca);add(B(W-.62,H-.3,.05),iw,0,(H-.3)/2,D-.33,g);for(const sd of[-1,1])add(B(.05,H-.3,D-.6),iw,sd*(W/2-.33),(H-.3)/2,D/2,g);
    add(B(W-.62,.05,D-.6),M(0xf3ede2,.8),0,H-.33,D/2,g);
    const CZ=2.8,CH=1.1;add(RB(W-.9,CH-.06,.75,.03),pbr('wood_planks',3,1,0x5a3a26),0,(CH-.06)/2,CZ,g);add(RB(W-.8,.06,.85,.02),new THREE.MeshStandardMaterial({map:mar,roughness:.15}),0,CH-.03,CZ,g);
    const brass=M(0xc9a44a,.3,1),pg=new THREE.MeshPhysicalMaterial({color:0xdcecf4,roughness:.04,transparent:true,opacity:.07,clearcoat:1,depthWrite:false});
    for(let i=0;i<2;i++){const xx=-1.3+i*2.6;add(B(2.2,.9,.012),pg,xx,CH+.62,CZ+.12,g,false);add(RB(2.22,.04,.04,.01),brass,xx,CH+1.08,CZ+.12,g);for(const sd of[-1,1])add(RB(.04,.95,.04,.01),brass,xx+sd*1.1,CH+.6,CZ+.12,g);
      const nt=tex(128,128,x=>{x.fillStyle='#0f2a4f';x.fillRect(0,0,128,128);x.fillStyle='#d4af37';x.font='800 84px Mont';x.textAlign='center';x.fillText(String(i+1),64,96);});
      const n=add(new THREE.PlaneGeometry(.16,.16),new THREE.MeshBasicMaterial({map:nt,toneMapped:false}),xx,CH+1.2,CZ+.1,g,false);n.rotation.y=Math.PI;}
    const sg=tex(1200,200,x=>{x.fillStyle='#0f2a4f';x.fillRect(0,0,1200,200);x.fillStyle='#d4af37';x.font='800 120px Mont';x.textAlign='center';x.fillText(name,600,150);});
    {const s=add(new THREE.PlaneGeometry(2.6,.43),new THREE.MeshBasicMaterial({map:sg,toneMapped:false}),0,3.6,D-.37,g,false);s.rotation.y=Math.PI;}
    add(RB(.5,.1,.08,.02),M(0x8d939b,.3,.9),1.6,1.5,D-.37,g);   // mail slot (reports leave through it)
    for(let i=0;i<3;i++){const xx=-1.6+i*1.6;add(CY(.03,.03,.95,16),brass,xx,.5,CZ-1.7,g);add(S(.045),brass,xx,.99,CZ-1.7,g);add(CY(.14,.16,.04,24),brass,xx,.02,CZ-1.7,g);
      if(i<2){const r=add(new THREE.TorusGeometry(.8,.025,8,32,Math.PI),M(0x8b1d24,.6),xx+.8,.92,CZ-1.7,g);r.rotation.z=Math.PI;r.scale.y=.25;}}
    for(let i=0;i<2;i++){const L=new THREE.PointLight(0xfff1dc,3.5,9,1.4);L.position.set(-1.3+i*2.6,H-.8,CZ-1.2);g.add(L);add(CY(.25,.25,.05,32),M(0xf6f1e4,.4,0,{emissive:0xfff1dc,emissiveIntensity:.5}),-1.3+i*2.6,H-.36,CZ-1.2,g,false);}
    const Lt=new THREE.PointLight(0xfff1dc,2.2,5,1.4);Lt.position.set(0,2.4,CZ+1.0);g.add(Lt);
    return {g,cctv:head,led,doors,W,H,D,counterZ:CZ,counterY:CH,slot:V(1.6,1.5,D-.4)};}
  return {burger,fries,cup,tray,register,duffel,burgerShop,logoM,washer,dirty,bankBack,bankLobby,darkRoom,bankFront,basket};
}
