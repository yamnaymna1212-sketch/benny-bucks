// ================= EP12 cast test: masked criminal (cast 'masked', balaclava from make_cast.py) + Mike =================
// Knit look: rib-stitch canvas texture + matching normal map on the 'balaclava' material (UVs = body atlas, so high repeat).
const KNIT=(()=>{const W=256,mk=(f)=>{const c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');f(x);return c;};
 const col=mk(x=>{x.fillStyle='#08080a';x.fillRect(0,0,W,W);for(let i=0;i<8;i++)for(let j=0;j<8;j++){const cx=i*32+16,cy=j*32;   // V stitches in columns
  for(const sd of[-1,1]){const g=x.createLinearGradient(cx,cy,cx+sd*14,cy+30);g.addColorStop(0,'#1c1c20');g.addColorStop(.5,'#121215');g.addColorStop(1,'#08080a');x.fillStyle=g;
   x.beginPath();x.ellipse(cx+sd*7,cy+16,6.5,15,sd*.45,0,7);x.fill();}}
  for(let k=0;k<2500;k++){x.fillStyle=`rgba(${60+Math.random()*40|0},${60+Math.random()*40|0},${70+Math.random()*40|0},.08)`;x.fillRect(Math.random()*W,Math.random()*W,1,2);}});
 const nrm=mk(x=>{x.fillStyle='rgb(128,128,255)';x.fillRect(0,0,W,W);for(let i=0;i<8;i++)for(let j=0;j<8;j++){const cx=i*32+16,cy=j*32;
  for(const sd of[-1,1]){x.fillStyle=`rgb(${128+sd*70},150,235)`;x.beginPath();x.ellipse(cx+sd*7,cy+16,6.5,15,sd*.45,0,7);x.fill();}
  x.fillStyle='rgb(128,128,190)';x.fillRect(cx-1,cy,2,32);}});
 const T=(c,srgb)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(90,90);t.anisotropy=8;if(srgb)t.colorSpace=THREE.SRGBColorSpace;return t;};
 return new THREE.MeshPhysicalMaterial({map:T(col,1),normalMap:T(nrm,0),normalScale:new THREE.Vector2(.7,.7),roughness:.97,sheen:.3,sheenRoughness:.9,sheenColor:new THREE.Color(.22,.22,.24)});})();
function styleMasked(P){P.g.traverse(o=>{if(!o.isMesh)return;const n=o.name+o.material.name;if(Q.get('dbg2')){o.geometry.computeBoundingBox();console.error('MESH',n,o.isSkinnedMesh,o.geometry.attributes.position.count,JSON.stringify(o.geometry.boundingBox),o.visible);}
 if(/balaclava/i.test(n)){o.material=KNIT;}
 else if(/sweater/i.test(n)){o.material.color.set(0x2b2b30);}   // red knit sweater -> charcoal
 else if(/cargo/i.test(n)){o.material.color.set(0x1d1f24);}
 else if(/eyebrow|lash/i.test(n)){o.visible=false;}});}   // brows sit under the mask
const LAB=Q.get('lab');
const SK=shopKit(THREE,{add,B,RB,CY,M,pbr,tex,MNY});
if(LAB){document.getElementById('ov').style.display='none';const X0=Number(Q.get('lx')||80),Z0=15;
 const SHOP=window.SHOP=SK.burgerShop(X0,Z0,{brand:Q.get('brand')||'mcd'});scene.add(SHOP.g);const CY0=SHOP.counterY,CZ0=Z0+SHOP.counterZ;
 const BAG=SK.duffel({open:1});BAG.position.set(X0-.15,CY0,CZ0-.02);scene.add(BAG);
 window.MASKED=person('masked',X0-.5,0,CZ0-.62,.25);styleMasked(MASKED);
 window.VIC=person('mike',X0+.15,0,CZ0+.55,Math.PI);
 FK.rig(VIC,{iris:'#5c4330',brow:'#3a281a'});FK.rig(MASKED,{iris:'#4a3a2a'});
 relax(MASKED);relax(VIC);
 const RM={L:solveReach(MASKED,'L',V3(X0+.05,CY0+.2,CZ0-.12)),R:solveReach(MASKED,'R',V3(X0-.4,CY0+.2,CZ0-.12))};   // both hands on the bag
 const RV={L:solveReach(VIC,'L',V3(X0+.45,CY0+.05,CZ0+.25)),R:solveReach(VIC,'R',V3(X0-.15,CY0+.05,CZ0+.25))};   // Mike's hands on the counter
 window.labPose=t=>{relax(MASKED);relax(VIC);idle(MASKED,t,1);idle(VIC,t,3);
  for(const sd of['L','R']){arm(MASKED,sd,RM[sd].ux,RM[sd].uz,RM[sd].lx);arm(VIC,sd,RV[sd].ux,RV[sd].uz,RV[sd].lx);}
  pose(MASKED,'spine03',.12,0,0);
  const eye=V3(X0+.15,1.62,CZ0+.55);
  FK.update(MASKED,t,{expr:[['angry',.6]],look:eye});FK.update(VIC,t,{expr:[['shock',.85]],look:V3(X0-.15,CY0+.2,CZ0)});};}
