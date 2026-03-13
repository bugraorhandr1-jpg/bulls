import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════
   WEBGL SHADER BACKGROUND — Molten Bulls
═══════════════════════════════════════════ */
function ShaderBG() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const progRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec2  u_mouse;

    vec3 hash3(vec2 p){
      vec3 q = vec3(dot(p,vec2(127.1,311.7)),
                    dot(p,vec2(269.5,183.3)),
                    dot(p,vec2(419.2,371.9)));
      return fract(sin(q)*43758.5453);
    }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      float a=dot(hash3(i        ).xy,f-vec2(0,0));
      float b=dot(hash3(i+vec2(1,0)).xy,f-vec2(1,0));
      float c=dot(hash3(i+vec2(0,1)).xy,f-vec2(0,1));
      float d=dot(hash3(i+vec2(1,1)).xy,f-vec2(1,1));
      return mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*0.5+0.5;
    }
    float fbm(vec2 p){
      float v=0.0, a=0.5;
      mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
      for(int i=0;i<6;i++){
        v+=a*noise(p);
        p=rot*p*2.1+vec2(1.7,9.2);
        a*=0.5;
      }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      float asp = u_res.x / u_res.y;
      vec2 st = uv * vec2(asp,1.0);
      float t  = u_time * 0.18;
      vec2 m   = u_mouse * vec2(asp,1.0);

      vec2 q = vec2(fbm(st + t*0.5),
                    fbm(st + vec2(5.2,1.3) + t*0.4));
      vec2 r = vec2(fbm(st + 2.0*q + vec2(1.7,9.2) + t*0.35),
                    fbm(st + 2.0*q + vec2(8.3,2.8) + t*0.3 ));

      float f = fbm(st + 2.8*r + t*0.25);
      f = (f + fbm(st + r + t)) * 0.5;

      float md = length(st - m);
      f += 0.10 * exp(-md * md * 3.5) * sin(md * 18.0 - t * 5.0);

      vec3 col = mix(vec3(0.02,0.01,0.00), vec3(0.55,0.06,0.01), smoothstep(0.10,0.45,f));
      col = mix(col, vec3(0.82,0.38,0.02), smoothstep(0.42,0.65,f));
      col = mix(col, vec3(0.98,0.72,0.08), smoothstep(0.62,0.82,f));
      col = mix(col, vec3(1.0,0.96,0.72), smoothstep(0.80,1.00,f));

      vec2 vig = uv * (1.0 - uv.yx);
      float v   = pow(vig.x * vig.y * 16.0, 0.35);
      col *= v * 0.7 + 0.3;
      col *= 0.55;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    progRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1,-1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let start = null;
    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) * 0.001;
      mouseRef.current.x += (targetMouse.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetMouse.current.y - mouseRef.current.y) * 0.04;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0,
      width: "100%", height: "100%", pointerEvents: "none",
    }} />
  );
}

/* ═══════════════════════════════════════════
   CURSOR — liquid drop
═══════════════════════════════════════════ */
function P5Cursor() {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const fx = useSpring(mx, { stiffness: 900, damping: 38, mass: 0.08 });
  const fy = useSpring(my, { stiffness: 900, damping: 38, mass: 0.08 });
  const rx = useSpring(mx, { stiffness: 100, damping: 26, mass: 0.8 });
  const ry = useSpring(my, { stiffness: 100, damping: 26, mass: 0.8 });

  const [state, setState] = useState("idle");
  const [ripples, setRipples] = useState([]);
  const lastRef = useRef({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX); my.set(e.clientY);
      lastRef.current = { x: e.clientX, y: e.clientY };
      setTrail(t => [...t.slice(-10), { x: e.clientX, y: e.clientY, id: Date.now() }]);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const wrap = el.closest(".page5-wrap");
      if (!wrap) { setState("idle"); return; }
      if (el.closest("button,a,[data-hover]")) setState("hover");
      else if (el.closest("h1,h2,h3,p,span")) setState("text");
      else setState("idle");
    };
    const onClick = (e) => {
      const id = Date.now();
      setRipples(r => [...r, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setRipples(r => r.filter(x => x.id !== id)), 700);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  const ringSize  = state === "hover" ? 56 : state === "text" ? 2 : 20;
  const dotSize   = state === "text" ? 14 : state === "hover" ? 5 : 8;
  const dotColor  = state === "hover" ? "#f5a800" : "#e8220a";
  const ringColor = state === "hover" ? "rgba(245,168,0,0.5)" : "rgba(232,34,10,0.45)";

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      {trail.map((p, i) => (
        <motion.div key={p.id}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "fixed", left: p.x, top: p.y,
            translateX: "-50%", translateY: "-50%",
            width: 4 + (i / trail.length) * 3, height: 4 + (i / trail.length) * 3,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#e8220a" : "#f5a800",
            filter: "blur(2px)",
          }}
        />
      ))}

      {ripples.map(r => (
        <motion.div key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ width: 100, height: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", left: r.x, top: r.y,
            translateX: "-50%", translateY: "-50%",
            border: "1.5px solid rgba(245,168,0,0.7)", borderRadius: "50%",
          }}
        />
      ))}

      <motion.div style={{ position: "fixed", x: rx, y: ry, translateX: "-50%", translateY: "-50%", zIndex: 1 }}>
        <motion.div animate={{ width: ringSize, height: ringSize, borderColor: ringColor, borderRadius: state === "text" ? "2px" : "50%", rotate: state === "hover" ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          style={{ border: `1.5px solid ${ringColor}`, background: state === "hover" ? "rgba(245,168,0,0.07)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence>
            {state === "hover" && (
              <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                style={{ fontSize: 10, color: "#f5a800", fontFamily: "monospace" }}>↗</motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div style={{ position: "fixed", x: fx, y: fy, translateX: "-50%", translateY: "-50%", zIndex: 2 }}>
        <motion.div animate={{ width: dotSize, height: dotSize, background: dotColor, boxShadow: `0 0 ${dotSize * 2}px ${dotColor}88` }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          style={{ borderRadius: state === "text" ? "1px" : "50%" }} />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCROLL BAR
═══════════════════════════════════════════ */
function P5ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 600, background: "linear-gradient(90deg,#e8220a,#f5a800)", scaleX, transformOrigin: "left", pointerEvents: "none" }} />;
}

/* ═══════════════════════════════════════════
   WORD MORPH
═══════════════════════════════════════════ */
function WordMorph({ words }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span style={{ display: "inline-block", minWidth: "4ch" }}>
      <AnimatePresence mode="wait">
        <motion.span key={idx}
          initial={{ y: 48, opacity: 0, filter: "blur(10px)", rotateX: -50 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          exit={{ y: -48, opacity: 0, filter: "blur(10px)", rotateX: 50 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", transformOrigin: "50% 50%" }}>
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ═══════════════════════════════════════════
   COUNT UP
═══════════════════════════════════════════ */
function CountUp({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      let st = null;
      const run = ts => {
        if (!st) st = ts;
        const p = Math.min((ts - st) / 1800, 1);
        setV(Math.floor((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) requestAnimationFrame(run); else setV(to);
      };
      requestAnimationFrame(run);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   SPLIT WORD REVEAL
═══════════════════════════════════════════ */
function SplitReveal({ text, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.22em", ...style }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span initial={{ y: "110%", opacity: 0 }} animate={vis ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block" }}>{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   PAGE 5 — Landing (WebGL Shader)
═══════════════════════════════════════════ */
export default function Page5() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -120]);
  const heroOp = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = ["Güçlü", "Hızlı", "Premium", "Akıllı"];

  const caps = [
    { icon: "🎮", title: "Oyun Geliştirme", num: "01" },
    { icon: "📱", title: "Mobil Uygulama", num: "02" },
    { icon: "☁️", title: "Backend & Cloud", num: "03" },
    { icon: "🎨", title: "UI/UX Tasarım", num: "04" },
  ];

  const stats = [
    { val: 50, suffix: "+", label: "Proje" },
    { val: 30, suffix: "+", label: "Müşteri" },
    { val: 5, suffix: "+", label: "Yıl" },
  ];

  return (
    <div className="page5-wrap" style={{ background: "#060402", color: "#ede8dc", fontFamily: "'IBM Plex Mono', monospace", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@1,700&display=swap');

        .page5-wrap * { cursor: none !important; }
        .page5-wrap ::selection { background: #e8220a; color: #fff; }

        .page5-wrap .p5-noise {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        .page5-wrap .p5-hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden; background: transparent;
        }

        .page5-wrap .p5-eyebrow {
          position: relative; z-index: 10;
          padding: 10px 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: center;
        }

        .page5-wrap .p5-main {
          flex: 1; position: relative; z-index: 10;
          padding: 56px 52px 72px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 52px; align-items: center;
        }

        .page5-wrap .p5-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 11vw, 11rem);
          line-height: 0.86; letter-spacing: -0.01em;
          margin-bottom: 28px;
        }

        .page5-wrap .hl-plain { color: #ede8dc; }
        .page5-wrap .hl-grad {
          background: linear-gradient(110deg, #e8220a 30%, #f5a800 80%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page5-wrap .hl-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.12);
        }

        .page5-wrap .p5-sub {
          font-size: 13px; color: rgba(237,232,220,0.5);
          line-height: 1.9; max-width: 400px; margin-bottom: 36px;
        }

        .page5-wrap .p5-btns { display: flex; gap: 12px; margin-bottom: 52px; }
        .page5-wrap .btn-primary {
          background: #e8220a; color: #fff; border: none;
          padding: 14px 28px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 0 40px rgba(232,34,10,0.35);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .page5-wrap .btn-primary:hover { background: #ff3d1f; box-shadow: 0 0 60px rgba(232,34,10,0.55); }
        .page5-wrap .btn-ghost {
          background: transparent; color: rgba(237,232,220,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 14px 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          transition: all 0.22s;
        }
        .page5-wrap .btn-ghost:hover { border-color: #f5a800; color: #f5a800; }

        .page5-wrap .p5-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          border-top: 1px solid rgba(255,255,255,0.08); padding-top: 28px;
        }
        .page5-wrap .stat-item { border-right: 1px solid rgba(255,255,255,0.06); padding-right: 16px; padding-left: 16px; }
        .page5-wrap .stat-item:first-child { padding-left: 0; }
        .page5-wrap .stat-item:last-child { border-right: none; }
        .page5-wrap .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          letter-spacing: 0.04em; line-height: 1;
          background: linear-gradient(135deg, #ede8dc, #f5a800);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page5-wrap .stat-lbl { font-size: 9px; color: rgba(237,232,220,0.4); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px; }

        .page5-wrap .p5-g-card-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        .page5-wrap .p5-g-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px 22px; position: relative; overflow: hidden;
          transition: background 0.3s, border-color 0.3s;
        }
        .page5-wrap .p5-g-card:hover { background: rgba(232,34,10,0.06); border-color: rgba(232,34,10,0.25); }
        .page5-wrap .p5-g-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, #e8220a, #f5a800, transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s ease;
        }
        .page5-wrap .p5-g-card:hover::before { transform: scaleX(1); }
        .page5-wrap .p5-g-num { font-size: 9px; color: rgba(237,232,220,0.25); letter-spacing: 0.22em; margin-bottom: 14px; }
        .page5-wrap .p5-g-icon { font-size: 22px; margin-bottom: 12px; }
        .page5-wrap .p5-g-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.06em; color: rgba(237,232,220,0.75); }

        .page5-wrap .p5-marquee-wrap {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden; position: relative; z-index: 2;
        }
        .page5-wrap .p5-marquee-item {
          padding: 12px 30px; border-right: 1px solid rgba(255,255,255,0.06);
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(237,232,220,0.35); white-space: nowrap;
          display: flex; align-items: center; gap: 10px;
        }

        .page5-wrap .p5-scroll-hint {
          position: absolute; bottom: 28px; left: 52px;
          z-index: 10; display: flex; align-items: center; gap: 12px;
        }
        .page5-wrap .p5-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(180deg, transparent, rgba(232,34,10,0.8));
          animation: p5sh 2s ease-in-out infinite;
        }
        .page5-wrap .p5-scroll-txt { font-size: 8px; color: rgba(237,232,220,0.3); letter-spacing: 0.3em; writing-mode: vertical-rl; }
        @keyframes p5sh { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

        .page5-wrap .tag-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(232,34,10,0.12); border: 1px solid rgba(232,34,10,0.25);
          border-radius: 999px; padding: 6px 16px;
          font-size: 10px; color: rgba(245,168,0,0.9); letter-spacing: 0.16em;
          margin-bottom: 24px;
        }
        .page5-wrap .tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: p5blink 2s infinite; }
        @keyframes p5blink { 0%,100%{opacity:0.5;} 50%{opacity:1;} }

        .page5-wrap .p5-section { padding: 100px 52px; position: relative; z-index: 2; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .page5-wrap .p5-section-label { font-size: 9px; color: rgba(237,232,220,0.35); letter-spacing: 0.28em; text-transform: uppercase; margin-bottom: 14px; }
        .page5-wrap .p5-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem,7vw,7rem); line-height: 0.87; letter-spacing: -0.01em;
          margin-bottom: 64px;
        }

        .page5-wrap .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(255,255,255,0.07); }
        .page5-wrap .why-card {
          padding: 36px; border-right: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; transition: background 0.3s;
        }
        .page5-wrap .why-card:hover { background: rgba(232,34,10,0.04); }
        .page5-wrap .why-card:nth-child(2n) { border-right: none; }
        .page5-wrap .why-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #e8220a, #f5a800);
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .page5-wrap .why-card:hover::after { transform: scaleX(1); }
        .page5-wrap .why-icon { font-size: 24px; margin-bottom: 16px; }
        .page5-wrap .why-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.05em; margin-bottom: 8px; color: #ede8dc; }
        .page5-wrap .why-desc { font-size: 12px; color: rgba(237,232,220,0.45); line-height: 1.8; }

        .page5-wrap .p5-proc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border: 1px solid rgba(255,255,255,0.07); }
        .page5-wrap .p5-proc-card {
          padding: 28px; border-right: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
        }
        .page5-wrap .p5-proc-card:last-child { border-right: none; }
        .page5-wrap .p5-proc-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #e8220a, #f5a800); transform: scaleX(0);
          transform-origin: left; transition: transform 0.5s ease;
        }
        .page5-wrap .p5-proc-card:hover::before { transform: scaleX(1); }
        .page5-wrap .p5-proc-num { font-size: 48px; font-family: 'Bebas Neue', sans-serif; color: rgba(255,255,255,0.05); line-height: 1; margin-bottom: 16px; }
        .page5-wrap .p5-proc-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.05em; margin-bottom: 8px;
          background: linear-gradient(110deg, #ede8dc, #f5a800); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .page5-wrap .p5-proc-desc { font-size: 11px; color: rgba(237,232,220,0.4); line-height: 1.8; }

        .page5-wrap .p5-cta-box {
          margin: 80px 52px 100px; padding: 72px 56px;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; text-align: center;
          background: linear-gradient(135deg, rgba(232,34,10,0.06), rgba(245,168,0,0.04));
        }
        .page5-wrap .p5-cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem,6vw,6rem); letter-spacing: -0.01em; line-height: 0.88; margin-bottom: 20px; color: #ede8dc; }
        .page5-wrap .p5-cta-desc { font-size: 13px; color: rgba(237,232,220,0.5); line-height: 1.9; max-width: 480px; margin: 0 auto 36px; }
        .page5-wrap .p5-cta-btns { display: flex; gap: 12px; justify-content: center; }
        .page5-wrap .p5-cta-glow {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,34,10,0.12), transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          filter: blur(40px); pointer-events: none;
          animation: p5cglow 5s ease-in-out infinite;
        }
        @keyframes p5cglow { 0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1);} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.2);} }

        .page5-wrap .p5-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 20px 52px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
      `}</style>

      <ShaderBG />
      <P5ScrollBar />
      <P5Cursor />
      <div className="p5-noise" />

      {/* ═══ HERO ═══ */}
      <motion.div className="p5-hero" style={{ opacity: heroOp, y: heroY, paddingTop: 100 }}>
        <div className="p5-eyebrow">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontSize: 9, color: "rgba(237,232,220,0.35)", letterSpacing: "0.26em" }}>
            BULLS DIGITAL HOUSE — EST. 2023 — ISTANBUL
          </motion.span>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 9, color: "rgba(237,232,220,0.35)", letterSpacing: "0.2em" }}>{time} — OPEN FOR PROJECTS</span>
          </motion.div>
        </div>

        <div className="p5-main">
          <div style={{ position: "relative", zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <div className="tag-pill">
                <div className="tag-dot" />
                <span>Bulls Digital Studio</span>
              </div>
            </motion.div>

            <div className="p5-headline">
              {[
                { text: "DİJİTAL", cls: "hl-plain" },
                { text: "DÜNYADA", cls: "hl-outline" },
              ].map(({ text, cls }, i) => (
                <div key={text} style={{ overflow: "hidden", marginBottom: "0.03em" }}>
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={cls}>{text}</motion.div>
                </div>
              ))}
              <div style={{ overflow: "hidden", marginBottom: "0.03em" }}>
                <motion.div initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="hl-grad">
                  <WordMorph words={words} />
                </motion.div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.div initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="hl-plain">ÇÖZÜMLER</motion.div>
              </div>
            </div>

            <motion.p className="p5-sub"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.7 }}>
              İstanbul merkezli dijital ürün stüdyosu. Oyun geliştirmeden mobil uygulamaya,
              UI/UX&apos;ten backend&apos;e — tek çatı altında eksiksiz çözümler.
            </motion.p>

            <motion.div className="p5-btns"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.86, duration: 0.7 }}>
              <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                İLETİŞİME GEÇİN →
              </motion.button>
              <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                PROJELERİMİZ ↓
              </motion.button>
            </motion.div>

            <motion.div className="p5-stats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.7 }}>
              {stats.map(({ val, suffix, label }) => (
                <div key={label} className="stat-item">
                  <div className="stat-num"><CountUp to={val} suffix={suffix} /></div>
                  <div className="stat-lbl">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div style={{ position: "relative" }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}>

            <motion.div animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", border: "1px dashed rgba(245,168,0,0.2)", pointerEvents: "none", zIndex: 0 }} />
            <motion.div animate={{ rotate: [360, 0] }}
              transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
              style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", border: "1px dashed rgba(232,34,10,0.2)", pointerEvents: "none", zIndex: 0 }} />

            <div className="p5-g-card-grid">
              {caps.map((s, i) => (
                <motion.div key={s.num} className="p5-g-card"
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, scale: 1.02 }}>
                  <div className="p5-g-num">{s.num}</div>
                  <motion.div className="p5-g-icon" whileHover={{ rotate: 10, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                    {s.icon}
                  </motion.div>
                  <div className="p5-g-title">{s.title}</div>
                  <motion.div animate={{ y: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 3 + i * 0.6, ease: "linear", delay: i * 0.8 }}
                    style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "linear-gradient(90deg,transparent,rgba(245,168,0,0.4),transparent)", pointerEvents: "none" }} />
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{ marginTop: 2, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["React", "React Native", "Unity", "Node.js", "Flutter", "AWS"].map((t, i) => (
                <motion.span key={t}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.05 }}
                  whileHover={{ color: "#f5a800", borderColor: "rgba(245,168,0,0.4)" }}
                  style={{ fontSize: 9, color: "rgba(237,232,220,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.07)", padding: "4px 10px", transition: "all 0.2s", cursor: "none" }}>
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="p5-scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <div className="p5-scroll-line" />
          <span className="p5-scroll-txt">SCROLL</span>
        </motion.div>
      </motion.div>

      {/* ═══ MARQUEE ═══ */}
      <div className="p5-marquee-wrap">
        {[0, 1].map(row => (
          <motion.div key={row}
            animate={{ x: row === 0 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
            transition={{ repeat: Infinity, duration: row === 0 ? 24 : 30, ease: "linear" }}
            style={{ display: "flex", width: "max-content", borderTop: row > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            {["GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER",
              "GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER",
              "GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER"
            ].map((item, i) => (
              <div key={i} className="p5-marquee-item">
                <span style={{ width: 3, height: 3, borderRadius: "50%", display: "inline-block", background: i % 2 === 0 ? "#e8220a" : "#f5a800", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* ═══ WHY US ═══ */}
      <section className="p5-section">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p5-section-label">§ 01 — Neden Biz</div>
        </motion.div>
        <div className="p5-section-title">
          <SplitReveal text="FARKIMIZ NE?" style={{
            background: "linear-gradient(110deg,#ede8dc 40%,#f5a800)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }} />
        </div>

        <div className="why-grid">
          {[
            { icon: "⚡", title: "HIZLI TESLİMAT", desc: "Sprint tabanlı geliştirme ile belirlenen sürelere tam uyum sağlıyoruz." },
            { icon: "🔒", title: "GÜVENİLİR KOD", desc: "Test coverage, code review ve CI/CD pipeline ile üretim kalitesi." },
            { icon: "📊", title: "VERİ ODAKLI", desc: "Analytics ve kullanıcı davranışı ile sürekli iyileştirme döngüsü." },
            { icon: "🤝", title: "SÜREKLİ DESTEK", desc: "Lansman sonrası 7/24 teknik destek ve aktif geliştirme." },
          ].map((w, i) => (
            <motion.div key={w.title} className="why-card"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="why-icon">{w.icon}</div>
              <div className="why-title">{w.title}</div>
              <div className="why-desc">{w.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="p5-section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p5-section-label">§ 02 — Sürecimiz</div>
        </motion.div>
        <div className="p5-section-title">
          <SplitReveal text="NASIL ÇALIŞIYORUZ?" style={{ color: "#ede8dc" }} delay={0.05} />
        </div>

        <div className="p5-proc-grid">
          {[
            { n: "01", t: "KEŞIF", d: "Hedef, kullanıcı ve pazar analizi." },
            { n: "02", t: "TASARIM", d: "Wireframe'den high-fi prototipe." },
            { n: "03", t: "GELİŞTİRME", d: "Temiz, ölçeklenebilir mimari." },
            { n: "04", t: "LANSMAN", d: "Yayın ve sürekli büyüme." },
          ].map((s, i) => (
            <motion.div key={s.n} className="p5-proc-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.65 }}
              whileHover={{ background: "rgba(232,34,10,0.04)" }}>
              <div className="p5-proc-num">{s.n}</div>
              <div className="p5-proc-title">{s.t}</div>
              <div className="p5-proc-desc">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <motion.div className="p5-cta-box"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="p5-cta-glow" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="p5-cta-title">
            <SplitReveal text="PROJENİZİ HAYATA GEÇİRELİM" style={{ color: "#ede8dc" }} />
          </div>
          <p className="p5-cta-desc">
            Ücretsiz danışmanlık için hemen iletişime geçin. 24 saat içinde dönüş yapalım.
          </p>
          <div className="p5-cta-btns">
            <motion.button className="btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              İLETİŞİME GEÇİN →
            </motion.button>
            <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              PROJELERİMİZİ İNCELEYİN
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ═══ FOOTER ═══ */}
      <div className="p5-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#e8220a,#f5a800)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 12, color: "#fff" }}>B</span>
          </div>
          <div>
            <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 15, letterSpacing: "0.1em" }}>BULLS DIGITAL HOUSE</div>
            <div style={{ fontSize: 8, color: "rgba(237,232,220,0.3)", letterSpacing: "0.22em" }}>MOBILE · DESIGN · GROWTH</div>
          </div>
        </div>
        <span style={{ fontSize: 9, color: "rgba(237,232,220,0.3)", letterSpacing: "0.2em" }}>© 2026 — ISTANBUL</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Gizlilik", "Koşullar", "Instagram", "LinkedIn"].map(n => (
            <motion.span key={n} whileHover={{ color: "#f5a800" }}
              style={{ fontSize: 9, color: "rgba(237,232,220,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", transition: "color 0.18s", cursor: "none" }}>
              {n}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
