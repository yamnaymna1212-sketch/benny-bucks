// EP5 "Maple Street" assets (Poly Haven CC0): blue-sky HDRI, US-house textures, street/living-room models -> ./dl
import fs from 'node:fs';import path from 'node:path';
const UA={headers:{'User-Agent':'Mozilla/5.0'}};
async function get(url,file){if(fs.existsSync(file)){console.log('ok   ',file);return;}fs.mkdirSync(path.dirname(file),{recursive:true});
  const r=await fetch(url,UA);if(!r.ok)throw new Error(url+' '+r.status);fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));console.log('saved',file);}
const files=async id=>(await (await fetch('https://api.polyhaven.com/files/'+id,UA)).json());
const h=await files('kloofendal_43d_clear_puresky');await get(h.hdri['4k'].hdr.url,'dl/kloofendal_clear_4k.hdr');
const TEX=['excavated_soil_wall','dirt','white_planks_clean','weathered_plank_siding','grey_roof_tiles','roof_07','red_brick','leafy_grass','grass_ground','asphalt_02','worn_asphalt','concrete_pavement','grooved_concrete_driveway','oak_wood_planks','plastered_wall','white_stucco','wood_planks','fabric_pattern_05'];
for(const t of TEX){try{const f=await files(t);for(const [m,k] of [['Diffuse','diff'],['nor_gl','nor'],['Rough','rough']]) await get(f[m]['2k'].jpg.url,`dl/tex/${t}_${k}.jpg`);}catch(e){console.log('skip tex',t,e.message);}}
const MODELS=['Sofa_01','sofa_03','Television_01','CoffeeTable_01','fire_hydrant','street_lamp_01','street_lamp_02','island_tree_01','jacaranda_tree','pine_tree_01','shrub_01','shrub_02','potted_plant_01','metal_trash_can','planter_box_01','wooden_bench','painted_wooden_bench','hanging_picture_frame_01','book_encyclopedia_set_01','modern_ceiling_lamp_01'];
for(const m of MODELS){try{const f=await files(m);const g=f.gltf['1k'].gltf;await get(g.url,`dl/models/${m}/${m}.gltf`);
  for(const [rel,v] of Object.entries(g.include||{})) await get(v.url,`dl/models/${m}/${rel}`);}catch(e){console.log('skip model',m,e.message);}}
console.log('assets5 done');
