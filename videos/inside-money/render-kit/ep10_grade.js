const ZG=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.12},sat:{value:1.26},vig:{value:.16},blur:{value:new THREE.Vector2()},grain:{value:.03},time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig,grain,time;uniform vec2 blur;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\
void main(){vec3 v=vec3(0.);float ca=length(blur)*.06;for(int i=0;i<12;i++){vec2 uv=vUv+blur*(float(i)/11.-.5);v.r+=texture2D(tDiffuse,uv+blur*ca).r;v.g+=texture2D(tDiffuse,uv).g;v.b+=texture2D(tDiffuse,uv-blur*ca).b;}v/=12.;\
float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v=pow(max(v,vec3(0.)),vec3(.85));v=(v-.5)*con+.5;\
float l2=dot(clamp(v,0.,1.),vec3(.2126,.7152,.0722));v*=mix(vec3(.95,1.,1.06),vec3(1.05,1.,.94),smoothstep(.15,.85,l2));\
float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);v+=(h(vUv*vec2(720.,1280.)+fract(time)*91.)-.5)*grain;gl_FragColor=vec4(clamp(v,0.,1.),1.);}'});comp.addPass(ZG);
