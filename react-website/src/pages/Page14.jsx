import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, useMotionValue, useSpring, useTransform,
  useScroll, AnimatePresence
} from "framer-motion";

/* ══════════════════════════════════════════════════
   WEBGL SHADER — molten lava
══════════════════════════════════════════════════ */
function ShaderBG() {
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

/* ══════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════ */
function MagneticBtn({ children, style = {}, onClick, primary = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });
  const [active, setActive] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 80;
    if (dist < maxDist) {
      const pull = (1 - dist / maxDist);
      x.set(dx * pull * 0.45);
      y.set(dy * pull * 0.45);
      setActive(true);
    } else {
      x.set(0); y.set(0); setActive(false);
    }
  };

  const base = primary ? {
    background: "#e8220a", color: "#fff", border: "none",
    padding: "14px 28px", fontSize: 11, letterSpacing: "0.18em",
    boxShadow: active ? "0 0 60px rgba(232,34,10,0.7), 0 8px 32px rgba(232,34,10,0.4)" : "0 0 40px rgba(232,34,10,0.35)",
  } : {
    background: "transparent", color: active ? "#f5a800" : "rgba(237,232,220,0.5)",
    border: `1px solid ${active ? "rgba(245,168,0,0.5)" : "rgba(255,255,255,0.1)"}`,
    padding: "14px 26px", fontSize: 11, letterSpacing: "0.18em",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); setActive(false); }}
      onClick={onClick}
      style={{ ...base, fontFamily:"IBM Plex Mono,monospace", textTransform:"uppercase", cursor:"none", transition:"box-shadow 0.3s,background 0.2s,color 0.2s,border-color 0.2s", x: sx, y: sy, display:"flex", alignItems:"center", gap:10, ...style }}
      whileTap={{ scale: 0.95 }}
    >{children}</motion.button>
  );
}

/* ══════════════════════════════════════════════════
   TILT SHADOW CARD
══════════════════════════════════════════════════ */
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    rx.set((ny - 0.5) * -18);
    ry.set((nx - 0.5) * 18);
    setShine({ x: nx * 100, y: ny * 100 });
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx, rotateY: sry,
        transformStyle: "preserve-3d",
        position: "relative",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 5,
        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        transition: "background 0.05s",
      }} />
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   CONFETTI BURST
══════════════════════════════════════════════════ */
function useConfetti() {
  const [particles, setParticles] = useState([]);

  const burst = useCallback((x, y) => {
    const colors = ["#e8220a", "#f5a800", "#ff4422", "#ffd060", "#ede8dc", "#ff8844"];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      angle: (Math.random() * 360),
      speed: Math.random() * 6 + 3,
      size: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => setParticles(p => p.filter(px => !newParticles.find(n => n.id === px.id))), 1200);
  }, []);

  const Confetti = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: p.rotation }}
          animate={{
            x: p.x + Math.cos(p.angle * Math.PI/180) * p.speed * 40,
            y: p.y + Math.sin(p.angle * Math.PI/180) * p.speed * 40 + 120,
            opacity: 0, scale: 0.2, rotate: p.rotation + 540,
          }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.4, 1] }}
          style={{
            position: "fixed",
            width: p.size, height: p.shape === "circle" ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            translateX: "-50%", translateY: "-50%",
          }}
        />
      ))}
    </div>
  );

  return { burst, Confetti };
}

/* ══════════════════════════════════════════════════
   SLOT MACHINE COUNTER
══════════════════════════════════════════════════ */
function SlotCounter({ target, suffix = "", duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      setSpinning(true);
      let start = null;
      const run = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setDisplay(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(run);
        else { setDisplay(target); setSpinning(false); }
      };
      requestAnimationFrame(run);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} style={{ display: "inline-block", overflow: "hidden", position: "relative" }}>
      <motion.span
        animate={spinning ? { y: ["-5px", "3px", "-2px", "0px"] } : { y: 0 }}
        transition={{ duration: 0.08, repeat: spinning ? Infinity : 0, ease: "linear" }}
        style={{ display: "inline-block" }}
      >
        {display}{suffix}
      </motion.span>
    </span>
  );
}

/* ══════════════════════════════════════════════════
   CURSOR — ember trail + morph
══════════════════════════════════════════════════ */
function P14Cursor() {
  const mx = useMotionValue(-300), my = useMotionValue(-300);
  const fx = useSpring(mx, { stiffness: 900, damping: 40, mass: 0.08 });
  const fy = useSpring(my, { stiffness: 900, damping: 40, mass: 0.08 });
  const rx = useSpring(mx, { stiffness: 90, damping: 24, mass: 0.9 });
  const ry = useSpring(my, { stiffness: 90, damping: 24, mass: 0.9 });
  const [ctx, setCtx] = useState("idle");
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);
  const tId = useRef(0);

  useEffect(() => {
    const mv = e => {
      mx.set(e.clientX); my.set(e.clientY);
      const tid = ++tId.current;
      setTrail(t => [...t.slice(-8), { x: e.clientX, y: e.clientY, id: tid }]);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const wrap = el.closest(".page14-wrap");
      if (!wrap) { setCtx("idle"); return; }
      if (el.closest("button,a,[data-mag]")) setCtx("hover");
      else if (el.closest("h1,h2,h3")) setCtx("text");
      else setCtx("idle");
    };
    const click = e => {
      const id = Date.now();
      setRipples(r => [...r, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setRipples(r => r.filter(rx => rx.id !== id)), 700);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("click", click);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("click", click); };
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:99999 }}>
      {trail.map((p, i) => (
        <motion.div key={p.id}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position:"fixed", left:p.x, top:p.y,
            width: 3 + i * 0.5, height: 3 + i * 0.5,
            borderRadius:"50%", translateX:"-50%", translateY:"-50%",
            background: i % 2 === 0 ? "#e8220a" : "#f5a800",
            filter: "blur(1.5px)", pointerEvents:"none",
          }}
        />
      ))}

      {ripples.map(r => (
        <motion.div key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 90, height: 90, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:"fixed", left:r.x, top:r.y,
            translateX:"-50%", translateY:"-50%",
            border: "1.5px solid rgba(245,168,0,0.7)",
            borderRadius:"50%", pointerEvents:"none",
          }}
        />
      ))}

      <motion.div style={{ position:"fixed", x:rx, y:ry, translateX:"-50%", translateY:"-50%", zIndex:1 }}>
        <motion.div
          animate={{
            width: ctx === "hover" ? 58 : ctx === "text" ? 3 : 22,
            height: ctx === "hover" ? 58 : ctx === "text" ? 3 : 22,
            borderRadius: ctx === "text" ? "2px" : "50%",
            borderColor: ctx === "hover" ? "rgba(245,168,0,0.7)" : "rgba(232,34,10,0.55)",
            rotate: ctx === "hover" ? 45 : 0,
            backgroundColor: ctx === "hover" ? "rgba(245,168,0,0.07)" : "transparent",
          }}
          transition={{ type:"spring", stiffness:180, damping:22 }}
          style={{ border:"1.5px solid rgba(232,34,10,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <AnimatePresence>
            {ctx === "hover" && (
              <motion.span initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}}
                style={{ fontSize:11, color:"#f5a800", fontFamily:"monospace" }}>↗</motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div style={{ position:"fixed", x:fx, y:fy, translateX:"-50%", translateY:"-50%", zIndex:2 }}>
        <motion.div
          animate={{
            width: ctx === "text" ? 16 : ctx === "hover" ? 5 : 8,
            height: ctx === "text" ? 3 : ctx === "hover" ? 5 : 8,
            background: ctx === "hover" ? "#f5a800" : "#e8220a",
            borderRadius: ctx === "text" ? "1px" : "50%",
            boxShadow: `0 0 12px ${ctx === "hover" ? "#f5a800" : "#e8220a"}99`,
          }}
          transition={{ type:"spring", stiffness:450, damping:24 }}
        />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   GLOW CARD — animated gradient border
══════════════════════════════════════════════════ */
function GlowCard({ children, style = {} }) {
  const [hov, setHov] = useState(false);
  const [angle, setAngle] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (hov) {
      const run = () => { setAngle(a => (a + 1.5) % 360); animRef.current = requestAnimationFrame(run); };
      animRef.current = requestAnimationFrame(run);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [hov]);

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ y: -6 }}
      transition={{ type:"spring", stiffness:280, damping:22 }}
      style={{
        position: "relative", borderRadius: 0,
        background: hov
          ? `conic-gradient(from ${angle}deg, #e8220a, #f5a800, #e8220a)`
          : "rgba(255,255,255,0.07)",
        padding: "1.5px",
        ...style,
      }}
    >
      <div style={{
        background: "#0c0906",
        backdropFilter: "blur(20px)",
        height: "100%", width: "100%",
        position: "relative",
      }}>
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          style={{
            position:"absolute", inset:0, pointerEvents:"none", zIndex:2,
            background: "radial-gradient(circle at 50% 0%, rgba(245,168,0,0.08), transparent 60%)",
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   CHAR REVEAL — character by character
══════════════════════════════════════════════════ */
function CharReveal({ text, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const chars = text.split("");
  return (
    <span ref={ref} style={{ display:"inline-flex", flexWrap:"wrap", ...style }}>
      {chars.map((ch, i) => (
        <span key={i} style={{ overflow:"hidden", display:"inline-block" }}>
          <motion.span
            initial={{ y:"105%", opacity:0 }}
            animate={vis ? { y:0, opacity:1 } : {}}
            transition={{ duration:0.6, delay: delay + i * 0.03, ease:[0.16,1,0.3,1] }}
            style={{ display:"inline-block", whiteSpace: ch === " " ? "pre" : "normal" }}
          >{ch === " " ? "\u00A0" : ch}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   WORD MORPH rotator
══════════════════════════════════════════════════ */
function WordMorph({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span style={{ display:"inline-block", minWidth:"3ch" }}>
      <AnimatePresence mode="wait">
        <motion.span key={i}
          initial={{ y:44, opacity:0, filter:"blur(10px)", rotateX:-50 }}
          animate={{ y:0, opacity:1, filter:"blur(0px)", rotateX:0 }}
          exit={{ y:-44, opacity:0, filter:"blur(10px)", rotateX:50 }}
          transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
          style={{ display:"inline-block", transformOrigin:"50% 50%" }}
        >{words[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════════════ */
function P14ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness:100, damping:30 });
  return <motion.div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:600, background:"linear-gradient(90deg,#e8220a,#f5a800)", scaleX:sx, transformOrigin:"left", pointerEvents:"none" }} />;
}

/* ══════════════════════════════════════════════════
   PAGE 14 — Spells (WebGL + Magnetic + Tilt + Confetti + GlowCards)
══════════════════════════════════════════════════ */
export default function Page14() {
  const { burst, Confetti } = useConfetti();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const { scrollY } = useScroll();
  const heroOp = useTransform(scrollY, [0, 520], [1, 0]);
  const heroY  = useTransform(scrollY, [0, 520], [0, -100]);

  useEffect(() => {
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("tr-TR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const words = ["Güçlü", "Hızlı", "Premium", "Akıllı"];
  const caps = ["Game Development","Mobil Uygulama","UI/UX Design","Backend & Cloud","Dijital Çözümler"];

  return (
    <div className="page14-wrap" style={{ background:"#060402", color:"#ede8dc", fontFamily:"'IBM Plex Mono',monospace", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        .page14-wrap * { cursor: none !important; }
        .page14-wrap ::selection { background:#e8220a; color:#fff; }
        .page14-wrap ::-webkit-scrollbar { width:2px; }
        .page14-wrap ::-webkit-scrollbar-thumb { background:linear-gradient(#e8220a,#f5a800); }
        .page14-wrap .D { font-family:'Bebas Neue',sans-serif; }

        .page14-wrap .p14-noise {
          position:fixed; inset:0; z-index:1; pointer-events:none; opacity:0.035;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px;
        }

        @keyframes p14mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .page14-wrap .p14-mq-wrap { overflow:hidden; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; z-index:2; }
        .page14-wrap .p14-mq-row { display:flex; width:max-content; }
        .page14-wrap .p14-mq-item { padding:12px 28px; border-right:1px solid rgba(255,255,255,0.06); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(237,232,220,0.28); white-space:nowrap; display:flex; align-items:center; gap:10px; }
        .page14-wrap .p14-mq-dot { width:3px; height:3px; border-radius:50%; flex-shrink:0; }

        .page14-wrap .p14-section { padding:110px 52px; border-bottom:1px solid rgba(255,255,255,0.05); position:relative; z-index:2; }

        .page14-wrap .p14-proc-grid { display:grid; grid-template-columns:repeat(4,1fr); border:1px solid rgba(255,255,255,0.07); }
        .page14-wrap .p14-proc-card { padding:32px 26px; border-right:1px solid rgba(255,255,255,0.07); position:relative; overflow:hidden; transition:background 0.3s; }
        .page14-wrap .p14-proc-card:last-child { border-right:none; }
        .page14-wrap .p14-proc-card:hover { background:rgba(232,34,10,0.04); }
        .page14-wrap .p14-proc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#e8220a,#f5a800); transform:scaleX(0); transform-origin:left; transition:transform 0.5s; }
        .page14-wrap .p14-proc-card:hover::after { transform:scaleX(1); }

        .page14-wrap .p14-footer { border-top:1px solid rgba(255,255,255,0.06); padding:22px 52px; display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }

        .page14-wrap .p14-scroll-hint { position:absolute; bottom:28px; left:52px; display:flex; align-items:center; gap:12px; z-index:10; }
        .page14-wrap .p14-scroll-line { width:1px; height:44px; background:linear-gradient(180deg,transparent,rgba(232,34,10,0.9)); }
        .page14-wrap .p14-scroll-txt { font-size:8px; color:rgba(237,232,220,0.25); letter-spacing:0.3em; writing-mode:vertical-rl; }
      `}</style>

      <ShaderBG />
      <P14ScrollBar />
      <P14Cursor />
      <Confetti />
      <div className="p14-noise" />

      {/* ── HERO ── */}
      <motion.section style={{ minHeight:"100vh", paddingTop:100, display:"flex", flexDirection:"column", position:"relative", zIndex:2, opacity:heroOp, y:heroY }}>
        <div style={{ padding:"10px 52px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            style={{ fontSize:9, color:"rgba(237,232,220,0.28)", letterSpacing:"0.26em" }}>
            BULLS DIGITAL HOUSE — EST. 2023 — ISTANBUL
          </motion.span>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
            style={{ display:"flex", gap:8, alignItems:"center" }}>
            <motion.div animate={{ scale:[1,1.6,1], opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2 }}
              style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
            <span style={{ fontSize:9, color:"rgba(237,232,220,0.28)", letterSpacing:"0.2em" }}>{time} — OPEN FOR PROJECTS</span>
          </motion.div>
        </div>

        <div style={{ flex:1, padding:"52px 52px 72px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(232,34,10,0.1)", border:"1px solid rgba(232,34,10,0.28)", borderRadius:999, padding:"6px 16px", fontSize:10, color:"rgba(245,168,0,0.85)", letterSpacing:"0.16em", marginBottom:24 }}>
                <motion.div animate={{ scale:[1,1.5,1] }} transition={{ repeat:Infinity, duration:2 }}
                  style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e" }} />
                <span>Bulls Digital Studio</span>
              </div>
            </motion.div>

            <div className="D" style={{ fontSize:"clamp(4.5rem,10.5vw,10.5rem)", lineHeight:0.86, letterSpacing:"-0.01em", marginBottom:28 }}>
              {[{ t:"DİJİTAL", s:{ color:"#ede8dc" } }, { t:"DÜNYADA", s:{ WebkitTextStroke:"1.5px rgba(255,255,255,0.13)", color:"transparent" } }].map(({ t: txt, s }, i) => (
                <div key={txt} style={{ overflow:"hidden", marginBottom:"0.03em" }}>
                  <motion.div initial={{ y:"110%" }} animate={{ y:0 }}
                    transition={{ duration:1.05, delay:0.1+i*0.13, ease:[0.16,1,0.3,1] }} style={s}>{txt}</motion.div>
                </div>
              ))}
              <div style={{ overflow:"hidden", marginBottom:"0.03em" }}>
                <motion.div initial={{ y:"110%" }} animate={{ y:0 }}
                  transition={{ duration:1.05, delay:0.36, ease:[0.16,1,0.3,1] }}
                  style={{ background:"linear-gradient(110deg,#e8220a 30%,#f5a800 80%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  <WordMorph words={words} />
                </motion.div>
              </div>
              <div style={{ overflow:"hidden" }}>
                <motion.div initial={{ y:"110%" }} animate={{ y:0 }}
                  transition={{ duration:1.05, delay:0.5, ease:[0.16,1,0.3,1] }}
                  style={{ color:"#ede8dc" }}>ÇÖZÜMLER</motion.div>
              </div>
            </div>

            <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.72 }}
              style={{ fontSize:13, color:"rgba(237,232,220,0.45)", lineHeight:1.9, maxWidth:400, marginBottom:36 }}>
              İstanbul merkezli dijital ürün stüdyosu. Oyun geliştirmeden mobil uygulamaya,
              UI/UX&apos;ten backend&apos;e — tek çatı altında.
            </motion.p>

            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.86 }}
              style={{ display:"flex", gap:12, marginBottom:52 }}>
              <MagneticBtn primary onClick={e => burst(e.clientX, e.clientY)}>
                İLETİŞİME GEÇİN ↗
              </MagneticBtn>
              <MagneticBtn>PROJELERİMİZ ↓</MagneticBtn>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.05 }}
              style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:28 }}>
              {[{ to:50, s:"+", l:"Proje" }, { to:30, s:"+", l:"Müşteri" }, { to:5, s:"+", l:"Yıl Tecrübe" }].map(({ to, s, l }, i) => (
                <div key={l} style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none", padding:"0 20px" }}>
                  <div className="D" style={{ fontSize:"clamp(2rem,3.5vw,2.8rem)", letterSpacing:"0.04em", lineHeight:1, background:"linear-gradient(135deg,#ede8dc,#f5a800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    <SlotCounter target={to} suffix={s} />
                  </div>
                  <div style={{ fontSize:9, color:"rgba(237,232,220,0.35)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:6 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — TILT CARDS */}
          <motion.div initial={{ opacity:0, x:44 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.28, duration:1.1, ease:[0.16,1,0.3,1] }}>
            <div style={{ position:"relative" }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:18, ease:"linear" }}
                style={{ position:"absolute", inset:-28, borderRadius:"50%", border:"1px dashed rgba(245,168,0,0.14)", pointerEvents:"none", zIndex:0 }} />
              <motion.div animate={{ rotate:-360 }} transition={{ repeat:Infinity, duration:11, ease:"linear" }}
                style={{ position:"absolute", inset:10, borderRadius:"50%", border:"1px dashed rgba(232,34,10,0.1)", pointerEvents:"none", zIndex:0 }} />

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, position:"relative", zIndex:1 }}>
                {[
                  { icon:"🎮", title:"Oyun Geliştirme", n:"01" },
                  { icon:"📱", title:"Mobil Uygulama", n:"02" },
                  { icon:"☁️", title:"Backend & Cloud", n:"03" },
                  { icon:"🎨", title:"UI/UX Tasarım", n:"04" },
                ].map((sv, i) => (
                  <TiltCard key={sv.n} style={{ overflow:"hidden" }}>
                    <motion.div
                      initial={{ opacity:0, y:20, scale:0.94 }}
                      animate={{ opacity:1, y:0, scale:1 }}
                      transition={{ delay:0.5+i*0.1, duration:0.7 }}
                      style={{ padding:"28px 22px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", position:"relative", overflow:"hidden", transition:"background 0.3s,border-color 0.3s", cursor:"none" }}
                      whileHover={{ background:"rgba(232,34,10,0.06)", borderColor:"rgba(232,34,10,0.22)" }}
                    >
                      <div style={{ fontSize:9, color:"rgba(237,232,220,0.2)", letterSpacing:"0.22em", marginBottom:14 }}>{sv.n}</div>
                      <motion.div whileHover={{ rotate:10, scale:1.15 }} transition={{ type:"spring", stiffness:300 }}
                        style={{ fontSize:22, marginBottom:12 }}>{sv.icon}</motion.div>
                      <div className="D" style={{ fontSize:"1.1rem", letterSpacing:"0.06em", color:"rgba(237,232,220,0.7)" }}>{sv.title}</div>
                      <motion.div animate={{ y:["-100%","350%"] }} transition={{ repeat:Infinity, duration:3+i*0.7, ease:"linear", delay:i*0.9 }}
                        style={{ position:"absolute", inset:"0 0 auto 0", height:1, background:"linear-gradient(90deg,transparent,rgba(245,168,0,0.3),transparent)", pointerEvents:"none" }} />
                    </motion.div>
                  </TiltCard>
                ))}
              </div>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
                style={{ marginTop:2, padding:"13px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:7, flexWrap:"wrap" }}>
                {["React","React Native","Unity","Node.js","Flutter","AWS"].map((tag, i) => (
                  <motion.span key={tag} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                    transition={{ delay:1.15+i*0.05 }}
                    whileHover={{ color:"#f5a800", borderColor:"rgba(245,168,0,0.4)" }}
                    style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.14em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.07)", padding:"4px 10px", transition:"all 0.2s", cursor:"none" }}>
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div className="p14-scroll-hint" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}>
          <motion.div className="p14-scroll-line" animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:2.2, ease:"easeInOut" }} />
          <span className="p14-scroll-txt">SCROLL</span>
        </motion.div>
      </motion.section>

      {/* ── MARQUEE ── */}
      <div className="p14-mq-wrap">
        {[1,-1].map((dir, ri) => (
          <motion.div key={ri} className="p14-mq-row"
            animate={{ x: dir>0 ? ["0%","-50%"] : ["-50%","0%"] }}
            transition={{ repeat:Infinity, duration: ri===0 ? 26:33, ease:"linear" }}
            style={{ borderTop: ri>0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            {[...caps,...caps,...caps,...caps].map((item, i) => (
              <div key={i} className="p14-mq-item">
                <span className="p14-mq-dot" style={{ background: i%2===0 ? "#e8220a":"#f5a800" }} />
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* ── WHY US — GLOW CARDS ── */}
      <section className="p14-section">
        <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>§ 01 — Neden Biz</motion.div>
        <div className="D" style={{ fontSize:"clamp(2.8rem,7vw,7.5rem)", lineHeight:0.86, marginBottom:60 }}>
          <CharReveal text="FARKIMIZ NE?" style={{ background:"linear-gradient(110deg,#ede8dc 40%,#f5a800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
          {[
            { icon:"⚡", t:"HIZLI TESLİMAT", d:"Sprint bazlı geliştirme ile belirlenen sürelere tam uyum." },
            { icon:"🔒", t:"GÜVENİLİR KOD", d:"Test coverage, code review ve CI/CD pipeline ile üretim kalitesi." },
            { icon:"📊", t:"VERİ ODAKLI", d:"Analytics ve kullanıcı davranışıyla sürekli iyileştirme döngüsü." },
            { icon:"🤝", t:"SÜREKLİ DESTEK", d:"Lansman sonrası 7/24 teknik destek ve aktif geliştirme." },
          ].map((w, i) => (
            <motion.div key={w.t} initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.65 }}>
              <GlowCard>
                <div style={{ padding:"36px 32px" }}>
                  <div style={{ fontSize:24, marginBottom:16 }}>{w.icon}</div>
                  <div className="D" style={{ fontSize:"1.5rem", letterSpacing:"0.06em", marginBottom:10, color:"#ede8dc" }}>{w.t}</div>
                  <p style={{ fontSize:12, color:"rgba(237,232,220,0.4)", lineHeight:1.85 }}>{w.d}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="p14-section" style={{ background:"rgba(0,0,0,0.12)" }}>
        <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>§ 02 — Süreç</motion.div>
        <div className="D" style={{ fontSize:"clamp(2.8rem,7vw,7.5rem)", lineHeight:0.86, marginBottom:60 }}>
          <CharReveal text="NASIL ÇALIŞIYORUZ?" style={{ color:"#ede8dc" }} delay={0.02} />
        </div>
        <div className="p14-proc-grid">
          {[
            { n:"01", e:"🔎", t:"KEŞIF", d:"Hedef, kullanıcı ve pazar analizi." },
            { n:"02", e:"✦",  t:"TASARIM", d:"Wireframe&apos;den high-fi prototipe." },
            { n:"03", e:"⟨⟩", t:"GELİŞTİRME", d:"Temiz, ölçeklenebilir mimari." },
            { n:"04", e:"🚀", t:"LANSMAN", d:"Yayın ve büyüme iterasyonları." },
          ].map((s, i) => (
            <motion.div key={s.n} className="p14-proc-card"
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.65 }}>
              <div className="D" style={{ fontSize:54, color:"rgba(255,255,255,0.04)", lineHeight:1, marginBottom:16 }}>{s.n}</div>
              <div style={{ fontSize:26, marginBottom:14 }}>{s.e}</div>
              <div className="D" style={{ fontSize:"1.3rem", letterSpacing:"0.05em", marginBottom:10, background:"linear-gradient(110deg,#ede8dc,#f5a800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.t}</div>
              <p style={{ fontSize:11, color:"rgba(237,232,220,0.36)", lineHeight:1.85 }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA — CONFETTI on click ── */}
      <motion.div
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
        style={{ margin:"0 52px 110px", padding:"72px 56px", textAlign:"center", position:"relative", overflow:"hidden", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <motion.div
          animate={{ scale:[1,1.25,1], opacity:[0.35,0.7,0.35] }}
          transition={{ repeat:Infinity, duration:5, ease:"easeInOut" }}
          style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,34,10,0.12),transparent 65%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", filter:"blur(40px)", pointerEvents:"none" }}
        />
        <div style={{ position:"relative", zIndex:2 }}>
          <div className="D" style={{ fontSize:"clamp(2.5rem,6vw,6rem)", lineHeight:0.88, marginBottom:20 }}>
            <CharReveal text="PROJENİZİ HAYATA GEÇİRELİM" style={{ color:"#ede8dc" }} />
          </div>
          <p style={{ fontSize:13, color:"rgba(237,232,220,0.42)", lineHeight:1.9, maxWidth:460, margin:"0 auto 36px" }}>
            Ücretsiz danışmanlık için hemen iletişime geçin. 24 saat içinde dönüş yapalım.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <MagneticBtn primary onClick={e => burst(e.clientX, e.clientY)}>
              İLETİŞİME GEÇİN ↗
            </MagneticBtn>
            <MagneticBtn>PROJELERİMİZİ İNCELEYİN</MagneticBtn>
          </div>
        </div>
      </motion.div>

      {/* ── FOOTER ── */}
      <div className="p14-footer">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:24, height:24, background:"linear-gradient(135deg,#e8220a,#f5a800)", clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="D" style={{ fontSize:11, color:"#fff" }}>B</span>
          </div>
          <div>
            <span className="D" style={{ fontSize:15, letterSpacing:"0.1em" }}>BULLS DIGITAL HOUSE</span>
            <div style={{ fontSize:8, color:"rgba(237,232,220,0.28)", letterSpacing:"0.22em" }}>MOBILE · DESIGN · GROWTH</div>
          </div>
        </div>
        <span style={{ fontSize:9, color:"rgba(237,232,220,0.25)", letterSpacing:"0.22em" }}>© 2026 — ISTANBUL / GLOBAL</span>
        <div style={{ display:"flex", gap:26 }}>
          {["Gizlilik","Koşullar","Instagram","LinkedIn"].map(n => (
            <motion.span key={n} whileHover={{ color:"#f5a800" }}
              style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(237,232,220,0.26)", transition:"color 0.18s", cursor:"none" }}>{n}</motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
