import { useEffect, useRef } from "react";

export default function ShaderBG() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const target = useRef({ x: 0.5, y: 0.5 });
  const frame = useRef(null);

  const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
  const FRAG = `
    precision highp float;
    uniform float T; uniform vec2 R; uniform vec2 M;
    vec3 h3(vec2 p){vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)));return fract(sin(q)*43758.5);}
    float ns(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=dot(h3(i).xy,f),b=dot(h3(i+vec2(1,0)).xy,f-vec2(1,0)),c=dot(h3(i+vec2(0,1)).xy,f-vec2(0,1)),d=dot(h3(i+vec2(1,1)).xy,f-vec2(1,1));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*.5+.5;}
    float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){v+=a*ns(p);p=r*p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/R, st=uv*vec2(R.x/R.y,1.), m=M*vec2(R.x/R.y,1.);
      float t=T*.16;
      vec2 q=vec2(fbm(st+t*.5),fbm(st+vec2(5.2,1.3)+t*.4));
      vec2 r=vec2(fbm(st+2.*q+vec2(1.7,9.2)+t*.3),fbm(st+2.*q+vec2(8.3,2.8)+t*.28));
      float f=(fbm(st+2.8*r+t*.22)+fbm(st+r+t))*.5;
      float md=length(st-m); f+=.12*exp(-md*md*3.)*sin(md*16.-t*5.);
      vec3 c=mix(vec3(.018,.008,.002),vec3(.52,.05,.008),smoothstep(.08,.44,f));
      c=mix(c,vec3(.78,.32,.015),smoothstep(.42,.64,f));
      c=mix(c,vec3(.97,.68,.06),smoothstep(.62,.82,f));
      c=mix(c,vec3(1.,.95,.7),smoothstep(.80,1.,f));
      vec2 vg=uv*(1.-uv.yx); c*=pow(vg.x*vg.y*15.,.3)*.65+.35; c*=.52;
      gl_FragColor=vec4(c,1.);
    }
  `;

  useEffect(() => {
    const cv = ref.current;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;
    const mk = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr); gl.useProgram(pr);
    const bf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const al = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(pr,"T"), uR = gl.getUniformLocation(pr,"R"), uM = gl.getUniformLocation(pr,"M");
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; gl.viewport(0,0,cv.width,cv.height); };
    resize(); window.addEventListener("resize", resize);
    const onMove = (e) => { target.current = { x: e.clientX/innerWidth, y: 1-e.clientY/innerHeight }; };
    window.addEventListener("mousemove", onMove, { passive: true });
    let st = null;
    const draw = ts => {
      if (!st) st = ts;
      mouse.current.x += (target.current.x - mouse.current.x) * .04;
      mouse.current.y += (target.current.y - mouse.current.y) * .04;
      gl.uniform1f(uT, (ts-st)*.001);
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform2f(uM, mouse.current.x, mouse.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}
