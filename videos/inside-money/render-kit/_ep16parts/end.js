const ch15=F=>[...F.pos,...F.look,F.fov],unch15=a=>({pos:a.slice(0,3),look:a.slice(3,6),fov:a[6]});
function herm15(keys,t){const n=keys.length;if(t<=keys[0][0])return ch15(keys[0][1]);if(t>=keys[n-1][0])return ch15(keys[n-1][1]);let i=0;while(t>keys[i+1][0])i++;
 const v=keys.map(k=>ch15(k[1])),h=k=>keys[k+1][0]-keys[k][0],d=k=>v[k+1].map((x,c)=>(x-v[k][c])/h(k));
 const tan=(k,c)=>{if(k===0||k===n-1)return 0;const a=d(k-1)[c],b=d(k)[c];if(a*b<=0)return 0;const m=(a+b)/2;return Math.sign(m)*Math.min(Math.abs(m),3*Math.min(Math.abs(a),Math.abs(b)));};
 const u=(t-keys[i][0])/h(i),u2=u*u,u3=u2*u,h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
 return v[i].map((x,c)=>h00*x+h10*h(i)*tan(i,c)+h01*v[i+1][c]+h11*h(i)*tan(i+1,c));}
window.CAM14=t=>unch15(herm15(KEYS1,t));
window.CAM14_END=HOOK_END+5;
window.HOOK16={tLost,tCong,tSo,tGas,tCheaper,tThree,HOOK_END};
