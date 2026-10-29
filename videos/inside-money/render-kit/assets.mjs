// Downloads the free assets (Poly Haven CC0 + Khronos car CC BY 4.0) into ./dl
import fs from 'node:fs';import path from 'node:path';
const UA={headers:{'User-Agent':'Mozilla/5.0'}};
async function get(url,file){if(fs.existsSync(file)){console.log('ok   ',file);return;}fs.mkdirSync(path.dirname(file),{recursive:true});
  const r=await fetch(url,UA);if(!r.ok)throw new Error(url+' '+r.status);fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));console.log('saved',file);}
const files=async id=>(await (await fetch('https://api.polyhaven.com/files/'+id,UA)).json());
const h=await files('sunset_jhbcentral');await get(h.hdri['4k'].hdr.url,'dl/sunset_jhbcentral_4k.hdr');
for(const t of['excavated_soil_wall','concrete_wall_008','granite_tile','marble_01','white_sandstone_blocks_02']){const f=await files(t);
  for(const [m,k] of [['Diffuse','diff'],['nor_gl','nor'],['Rough','rough']]) await get(f[m]['2k'].jpg.url,`dl/tex/${t}_${k}.jpg`);}
await get('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/CarConcept.glb','dl/models/car/CarConcept.glb');
console.log('assets done');
