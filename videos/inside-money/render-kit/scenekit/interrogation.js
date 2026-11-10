// scenekit/interrogation.js - gray interrogation room downtown: concrete walls, metal table, two chairs, one hanging lamp (warm cone of light),
// a dark one-way mirror on the left wall, a steel door, and prison bars that can slam down in front of the table.
//   const IR=interrogation(K,{x,z});  IR.bars(k) 0 = up/hidden, 1 = down   IR.lampSwing(t)   room-local: table centre (0,.76,0), suspect chair z=+.75 faces -z, agent side z=-.75
export function interrogation(K,{x=-300,z=0}={}){
 const {THREE,add,B,RB,CY,M}=K;const R=K.group(x,0,z);
 const wall=K.pbr('concrete_wall_008',2.5,1.4,0x9ea3a8),floor=K.pbr('concrete_pavement',3,3,0x8a8d90);
 add(B(7,.1,8.4),floor,0,-.035,.7,R,false);add(B(7,3.2,.12),wall,0,1.6,-3.0,R);add(B(7,3.2,.12),wall,0,1.6,4.1,R);add(B(.12,3.2,8.4),wall,-3.2,1.6,.7,R);add(B(.12,3.2,8.4),wall,3.2,1.6,.7,R);add(B(7,.1,8.4),M(0x2a2c2e,.9),0,3.2,.7,R,false);   // closed box: no outdoor light leaks
 // one-way mirror (left wall) + door (right wall)
 add(B(.06,1.3,2.6),M(0x0d1013,.05,.9,{envMapIntensity:1.4}),-3.12,1.65,-.4,R,false);add(B(.08,1.42,2.72),M(0x55595e,.4,.7),-3.14,1.65,-.4,R,false);
 add(B(.06,2.15,1.0),M(0x6d737a,.35,.8),3.12,1.08,1.5,R,false);add(new THREE.SphereGeometry(.04,10,8),M(0xd8dade,.2,1),3.07,1.05,1.15,R,false);
 // metal table + chairs
 const steel=M(0x9aa0a6,.35,.8),ttop=M(0x454b51,.5,.55);add(RB(1.6,.05,.9,.02),ttop,0,.76,0,R);for(const [lx,lz] of[[-.72,-.38],[.72,-.38],[-.72,.38],[.72,.38]])add(CY(.025,.025,.74,10),steel,lx,.37,lz,R);
 const chair=(cz,ry)=>{const g=K.group(0,0,cz,R);g.rotation.y=ry;add(B(.46,.04,.44),M(0x3a3d40,.6,.4),0,.47,0,g);add(B(.46,.5,.04),M(0x3a3d40,.6,.4),0,.74,.22,g);for(const [a,b] of[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])add(CY(.015,.015,.46,8),steel,a,.23,b,g);return g;};
 chair(.78,0);chair(-.78,Math.PI);
 // the lamp (hangs over the table) - the only warm light: a strong cone, dark corners
 const LG=K.group(0,3.2,0,R);const cord=add(CY(.008,.008,1.0,6),M(0x111111,.6),0,-.5,0,LG,false);
 const shade=add(new THREE.ConeGeometry(.28,.24,28,1,true),new THREE.MeshStandardMaterial({color:0x2c3a2e,roughness:.4,metalness:.5,side:THREE.DoubleSide}),0,-1.1,0,LG,false);
 add(new THREE.SphereGeometry(.07,14,10),new THREE.MeshStandardMaterial({color:0xfff2d0,emissive:0xffe2a0,emissiveIntensity:1.6}),0,-1.16,0,LG,false);
 const SP=new THREE.SpotLight(0xffe2b0,10,8,.8,.6,1.3);SP.position.set(0,-1.15,0);SP.castShadow=true;SP.shadow.mapSize.set(1024,1024);LG.add(SP);LG.add(SP.target);SP.target.position.set(0,-3.2,0);
 const AMB=new THREE.PointLight(0x9fb0c0,9,9,1.3);AMB.position.set(0,2.6,2.4);R.add(AMB);
 // prison bars (frame + 14 round bars) that slide down from the ceiling between the camera side (+z) and the table
 const BARS=K.group(0,0,1.55,R);const bm=new THREE.MeshStandardMaterial({color:0x2b2e33,roughness:.35,metalness:.9});
 for(let i=0;i<14;i++)add(CY(.03,.03,3.1,12),bm,-2.6+i*.4,1.55,0,BARS);for(const yy of[.15,1.6,3.0])add(B(5.4,.07,.07),bm,0,yy,0,BARS);
 const api={root:R,bars(k){BARS.position.y=3.2*(1-k);BARS.visible=k>.001;},lampSwing(t){LG.rotation.z=.05*Math.sin(t*1.6);LG.rotation.x=.03*Math.sin(t*1.1);}};
 api.bars(0);return api;}
