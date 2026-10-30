// Downloads the free assets (Poly Haven CC0 + Khronos car CC BY 4.0) into ./dl
import fs from 'node:fs';import path from 'node:path';
const UA={headers:{'User-Agent':'Mozilla/5.0'}};
async function get(url,file){if(fs.existsSync(file)){console.log('ok   ',file);return;}fs.mkdirSync(path.dirname(file),{recursive:true});
  const r=await fetch(url,UA);if(!r.ok)throw new Error(url+' '+r.status);fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));console.log('saved',file);}
const files=async id=>(await (await fetch('https://api.polyhaven.com/files/'+id,UA)).json());
const h=await files('sunset_jhbcentral');await get(h.hdri['4k'].hdr.url,'dl/sunset_jhbcentral_4k.hdr');
for(const t of['excavated_soil_wall','concrete_wall_008','granite_tile','marble_01','white_sandstone_blocks_02','brick_wall_02','asphalt_02','concrete_pavement']){const f=await files(t);
  for(const [m,k] of [['Diffuse','diff'],['nor_gl','nor'],['Rough','rough']]) await get(f[m]['2k'].jpg.url,`dl/tex/${t}_${k}.jpg`);}
await get('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/CarConcept.glb','dl/models/car/CarConcept.glb');
fs.mkdirSync('dl/models/guy',{recursive:true});fs.copyFileSync('assets/guy.glb','dl/models/guy/guy.glb');
// EP3 interior (Poly Haven CC0): textures + glTF furniture (1k, with their texture files)
for(const t of['laminate_floor_02','painted_plaster_wall']){const f=await files(t);
  for(const [m,k] of [['Diffuse','diff'],['nor_gl','nor'],['Rough','rough']]) await get(f[m]['2k'].jpg.url,`dl/tex/${t}_${k}.jpg`);}
for(const m of['sofa_03','modern_coffee_table_01','potted_plant_01','side_table_01','modern_ceiling_lamp_01','hanging_picture_frame_02','desk_lamp_arm_01']){const g=(await files(m)).gltf['1k'].gltf;
  await get(g.url,`dl/models/${m}/${m}.gltf`);for(const [p,v] of Object.entries(g.include||{}))await get(v.url,`dl/models/${m}/${p}`);}
console.log('assets done');
