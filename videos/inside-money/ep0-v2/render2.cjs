const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']});
const p=await b.newPage({viewport:{width:720,height:1280}});p.on('pageerror',e=>console.log('err:',e.message));
await p.goto('http://localhost:8765/v2.html?pr=1.5');await p.waitForFunction(()=>document.title==='ready',null,{timeout:300000});
const dur=Number(process.argv[2]||JSON.parse(fs.readFileSync('timeline2.json')).dur),N=Math.round(dur*30);fs.mkdirSync('frames2',{recursive:true});
const a=Date.now();for(let f=0;f<N;f++){await p.evaluate(t=>renderAt(t),f/30);await p.screenshot({path:`frames2/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:93});if(f%60==0)console.log(f,'/',N,((Date.now()-a)/1000).toFixed(0)+'s');}
await b.close();console.log('done',N);})();
