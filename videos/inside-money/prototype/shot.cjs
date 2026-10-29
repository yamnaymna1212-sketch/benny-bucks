const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']});
 const p=await b.newPage({viewport:{width:720,height:1280}});
 p.on('console',m=>console.log('console:',m.text()));p.on('pageerror',e=>console.log('err:',e.message));
 await p.goto('http://localhost:8765/v2.html');
 await p.waitForFunction(()=>document.title==='done',{timeout:60000});
 await p.screenshot({path:'out2.png'});
 await b.close();console.log('saved');
})();
