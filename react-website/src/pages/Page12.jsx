import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "framer-motion";

/* ── PALETTE ── */
const C = {
  bg:"#060402", ink:"#0c0905", card:"#100d07",
  b1:"#191309", b2:"#221a0d", b3:"#2e2410",
  red:"#e8220a", redHot:"#ff4422", redGlow:"rgba(232,34,10,0.15)",
  gold:"#f5a800", goldHot:"#ffd060", goldGlow:"rgba(245,168,0,0.12)", goldDeep:"#5c3a00",
  white:"#ede8dc", muted:"rgba(237,232,220,0.38)", faint:"rgba(237,232,220,0.06)",
};

/* ════════════════════════════════
   CANVAS PARTICLE FIELD
════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const COLS = ["#e8220a","#f5a800","#ffffff","#ff4422","#ffd060"];
    const count = 120;

    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const onMouse = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const scroll = scrollRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      pts.forEach(p => {
        const sy = (p.y + scroll * (0.02 + p.r * 0.01)) % H;
        const dx = p.x - mx, dy = sy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.4;
          p.vy += (dy / dist) * force * 0.4;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x = (p.x + p.vx + W) % W;
        p.pulse += p.pulseSpeed;
        const alpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, sy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();

        pts.forEach(q => {
          const qsy = (q.y + scroll * (0.02 + q.r * 0.01)) % H;
          const ddx = p.x - q.x, ddy = sy - qsy;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 90 && d > 0) {
            ctx.beginPath();
            ctx.moveTo(p.x, sy); ctx.lineTo(q.x, qsy);
            const a = (1 - d / 90) * 0.08;
            ctx.strokeStyle = `rgba(245,168,0,${a})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.55 }} />;
}

/* ════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════ */
function P12ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:100, damping:30 });
  return (
    <motion.div style={{
      position:"fixed", top:0, left:0, right:0, height:2, zIndex:600,
      background:`linear-gradient(90deg,${C.red},${C.gold})`,
      scaleX, transformOrigin:"left",
    }} />
  );
}

/* ════════════════════════════════
   CURSOR
════════════════════════════════ */
function P12Cursor() {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness:250, damping:18, mass:0.2 });
  const sy = useSpring(my, { stiffness:250, damping:18, mass:0.2 });
  const lx = useSpring(mx, { stiffness:55, damping:22, mass:0.7 });
  const ly = useSpring(my, { stiffness:55, damping:22, mass:0.7 });
  const [type, setType] = useState("default");

  useEffect(() => {
    const mv = e => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", mv);
    const over = e => {
      const el = e.target.closest("[data-p12cur]");
      setType(el ? el.dataset.p12cur : "default");
    };
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", over); };
  }, []);

  const size = type === "view" ? 80 : type === "link" ? 50 : 12;

  return (
    <>
      <motion.div style={{
        x:sx, y:sy, position:"fixed", zIndex:9999, pointerEvents:"none",
        translateX:"-50%", translateY:"-50%",
        width:8, height:8, borderRadius:"50%",
        background: type === "view" ? C.gold : C.red,
        boxShadow:`0 0 10px ${type === "view" ? C.gold : C.red}`,
      }} />
      <motion.div style={{
        x:lx, y:ly, position:"fixed", zIndex:9998, pointerEvents:"none",
        translateX:"-50%", translateY:"-50%",
        border:`1px solid ${type === "view" ? C.gold : C.red}44`,
        borderRadius:"50%",
        background: size > 30 ? `${type === "view" ? C.gold : C.red}0d` : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
        animate={{ width:size, height:size }}
        transition={{ type:"spring", stiffness:260, damping:22 }}
      >
        {type === "view" && <span style={{ fontSize:9, color:C.gold, letterSpacing:"0.14em", fontFamily:"monospace" }}>VIEW</span>}
        {type === "link" && <span style={{ fontSize:9, color:C.red, letterSpacing:"0.14em", fontFamily:"monospace" }}>↗</span>}
      </motion.div>
    </>
  );
}

/* ════════════════════════════════
   GRAIN
════════════════════════════════ */
function P12Grain() {
  return (
    <svg style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1, opacity:"var(--bg-theme-noise-opacity)" }}>
      <filter id="p12gr"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#p12gr)" />
    </svg>
  );
}

/* ════════════════════════════════
   SCROLL REVEAL TEXT (char by char)
════════════════════════════════ */
function RevealText({ text, style = {}, delay = 0, charDelay = 0.025 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} style={{ display:"inline-flex", flexWrap:"wrap", gap:"0.06em", ...style }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ overflow:"hidden", display:"inline-block" }}>
          <motion.span
            initial={{ y:"110%", opacity:0 }}
            animate={vis ? { y:0, opacity:1 } : {}}
            transition={{ duration:0.7, delay: delay + i * charDelay, ease:[0.16,1,0.3,1] }}
            style={{ display:"inline-block" }}
          >{ch === " " ? "\u00A0" : ch}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ════════════════════════════════
   GLITCH
════════════════════════════════ */
function Glitch({ text, style = {} }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setG(true); setTimeout(() => setG(false), 140); }, 3200 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ position:"relative", display:"inline-block", ...style }}>
      {text}
      {g && <>
        <span style={{ position:"absolute", inset:0, color:C.red, clipPath:"polygon(0 20%,100% 20%,100% 42%,0 42%)", transform:"translateX(-4px)", pointerEvents:"none", mixBlendMode:"screen" }}>{text}</span>
        <span style={{ position:"absolute", inset:0, color:C.gold, clipPath:"polygon(0 58%,100% 58%,100% 78%,0 78%)", transform:"translateX(4px)", pointerEvents:"none", mixBlendMode:"screen" }}>{text}</span>
      </>}
    </span>
  );
}

/* ════════════════════════════════
   PARALLAX IMAGE
════════════════════════════════ */
function ParallaxImg({ src, alt = "", speed = 0.15, style = {}, imgStyle = {} }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={ref} style={{ overflow:"hidden", ...style }}>
      <img src={src} alt={alt}
        style={{
          width:"100%", height:`calc(100% + ${Math.abs(speed) * 400}px)`,
          objectFit:"cover", display:"block",
          transform:`translateY(${offset}px)`,
          willChange:"transform",
          ...imgStyle,
        }}
        onError={e => { e.target.parentElement.style.background = `linear-gradient(135deg,${C.b2},${C.b3})`; e.target.style.display = "none"; }}
      />
    </div>
  );
}

/* ════════════════════════════════
   SCRAMBLE
════════════════════════════════ */
function Scramble({ text, active }) {
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░";
  const [d, setD] = useState(text);
  const fr = useRef(null);
  useEffect(() => {
    if (!active) { setD(text); return; }
    let i = 0; const tot = text.length * 4;
    const run = () => {
      setD(text.split("").map((c, idx) => {
        if (c === " ") return " ";
        if (idx < i / 4) return text[idx];
        return CH[Math.floor(Math.random() * CH.length)];
      }).join(""));
      i++; if (i < tot) fr.current = requestAnimationFrame(run); else setD(text);
    };
    fr.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(fr.current);
  }, [active, text]);
  return <span>{d}</span>;
}

/* ════════════════════════════════
   HORIZONTAL SCROLL TEXT
════════════════════════════════ */
function ScrollText({ text, color = C.white }) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 3000], [0, -600]);

  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${C.b2}`, borderBottom:`1px solid ${C.b2}`, padding:"18px 0", position:"relative", zIndex:2 }}>
      <motion.div style={{ x, display:"flex", gap:60, whiteSpace:"nowrap" }}>
        {[...Array(6)].map((_, i) => (
          <span key={i} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"5rem", letterSpacing:"0.08em", color: i % 2 === 0 ? color : "transparent", WebkitTextStroke: i % 2 !== 0 ? `1px ${C.b3}` : "none", lineHeight:1, flexShrink:0 }}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════
   3D TILT CARD
════════════════════════════════ */
function TiltCard({ children, style = {} }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0), rotY = useMotionValue(0);
  const sRX = useSpring(rotX, { stiffness:180, damping:22 });
  const sRY = useSpring(rotY, { stiffness:180, damping:22 });

  const move = e => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(-py * 12); rotY.set(px * 12);
  };
  const reset = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={reset}
      style={{ rotateX:sRX, rotateY:sRY, transformStyle:"preserve-3d", perspective:1000, ...style }}>
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════
   WORKS — FULLSCREEN SCROLL
════════════════════════════════ */
function WorksSection() {
  const WORKS = [
    { id:"01", title:"PULSE", sub:"Commerce App", year:"2024", tag:"Mobile",
      img:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1600&q=90&fit=crop" },
    { id:"02", title:"MOVI", sub:"Transit Navigation", year:"2024", tag:"Navigation",
      img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=90&fit=crop" },
    { id:"03", title:"KORE", sub:"Fintech Platform", year:"2025", tag:"Finance",
      img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1600&q=90&fit=crop" },
    { id:"04", title:"ORBIT", sub:"SaaS Dashboard", year:"2025", tag:"SaaS",
      img:"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=90&fit=crop" },
  ];

  const [active, setActive] = useState(0);
  const [hov, setHov] = useState(-1);

  return (
    <section style={{ padding:"100px 0", borderTop:`1px solid ${C.b2}`, position:"relative", zIndex:2 }}>
      <div style={{ padding:"0 56px", marginBottom:60 }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.muted, letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>§ 01 — Work</div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,7vw,7.5rem)", lineHeight:0.85 }}>
          {["SELECTED","PROJECTS."].map((w, i) => (
            <div key={w} style={{ overflow:"hidden" }}>
              <motion.div initial={{ y:"110%" }} whileInView={{ y:0 }} viewport={{ once:true }}
                transition={{ duration:1, delay:i*0.1, ease:[0.16,1,0.3,1] }}
                style={{
                  background: i === 1 ? `linear-gradient(110deg,${C.red},${C.gold})` : `linear-gradient(110deg,${C.white},${C.white}70)`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>{w}</motion.div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
        <div style={{ borderRight:`1px solid ${C.b2}` }}>
          {WORKS.map((w, i) => (
            <motion.div key={w.id} data-p12cur="view"
              onMouseEnter={() => { setHov(i); setActive(i); }}
              onMouseLeave={() => setHov(-1)}
              initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.7, ease:[0.16,1,0.3,1] }}
              style={{
                padding:"32px 56px", borderBottom:`1px solid ${C.b2}`,
                display:"grid", gridTemplateColumns:"56px 1fr 100px 40px",
                alignItems:"center", gap:24,
                position:"relative", overflow:"hidden",
              }}>
              <motion.div animate={{ scaleX: hov === i ? 1 : 0 }}
                transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
                style={{ position:"absolute", inset:0, background:`${C.red}0a`, transformOrigin:"left", zIndex:0 }} />
              <motion.div animate={{ scaleY: hov === i ? 1 : 0 }}
                transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(180deg,${C.red},${C.gold})`, transformOrigin:"top", zIndex:1 }} />

              <span style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.22em", position:"relative", zIndex:2 }}>{w.id}</span>
              <span style={{
                fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.8rem,3vw,3rem)",
                letterSpacing:"0.04em", lineHeight:1,
                color: hov === i ? C.white : C.muted, transition:"color 0.3s",
                position:"relative", zIndex:2,
              }}>
                <Scramble text={w.title} active={hov === i} />
              </span>
              <span style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.16em", textTransform:"uppercase", position:"relative", zIndex:2 }}>{w.tag}</span>
              <motion.span animate={{ color: hov === i ? C.gold : C.b3, x: hov === i ? 3 : 0, y: hov === i ? -3 : 0 }}
                style={{ fontSize:16, position:"relative", zIndex:2 }}>↗</motion.span>

              <motion.div animate={{ scaleX: hov === i ? 1 : 0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
                style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${C.red},${C.gold},transparent)`, transformOrigin:"left", zIndex:3 }} />
            </motion.div>
          ))}
        </div>

        <div style={{ position:"relative", height: WORKS.length * 97, overflow:"hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity:0, scale:1.06, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96, y:-20 }}
              transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
              style={{ position:"absolute", inset:0 }}>
              <ParallaxImg src={WORKS[active].img} speed={0.08}
                style={{ position:"absolute", inset:0 }}
                imgStyle={{ filter:"brightness(0.45) contrast(1.1) saturate(0.6)" }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(to right,${C.bg} 0%,transparent 40%,transparent 60%,${C.bg} 100%)` }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top,${C.bg} 0%,transparent 50%)` }} />

              <motion.div animate={{ y:["-5%","110%"] }} transition={{ repeat:Infinity, duration:2.2, ease:"linear" }}
                style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.gold},${C.red},transparent)`, filter:"blur(1px)", zIndex:2 }} />

              <div style={{ position:"absolute", bottom:28, right:32, zIndex:3 }}>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.gold, letterSpacing:"0.24em", textTransform:"uppercase", marginBottom:4 }}>{WORKS[active].sub}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.5rem", color:C.white, letterSpacing:"0.04em", lineHeight:1 }}>{WORKS[active].title}</div>
                <div style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.16em" }}>{WORKS[active].year}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   FLOATING FRAMES (hero)
════════════════════════════════ */
function HeroFrames() {
  const { scrollY } = useScroll();
  const frames = [
    { src:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=700&q=90&fit=crop", w:"45%", style:{top:"0%",left:"4%"}, rot:-6, pSpeed:0.08, delay:0 },
    { src:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=90&fit=crop", w:"43%", style:{top:"24%",right:"2%"}, rot:5, pSpeed:-0.12, delay:0.15 },
    { src:"https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=700&q=90&fit=crop", w:"38%", style:{bottom:"0%",left:"20%"}, rot:2, pSpeed:0.06, delay:0.28 },
  ];

  return (
    <div style={{ position:"relative", height:580 }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse at 40% 50%,${C.red}22,transparent 55%),radial-gradient(ellipse at 70% 30%,${C.gold}12,transparent 50%)`,
        filter:"blur(30px)" }} />

      {frames.map((f, i) => {
        const y = useTransform(scrollY, [0, 800], [0, f.pSpeed * 400]);
        return (
          <motion.div key={i} data-p12cur="view"
            initial={{ opacity:0, y:80, rotate:f.rot }}
            animate={{ opacity:1, y:0, rotate:f.rot }}
            transition={{ duration:1.3, delay:f.delay+0.4, ease:[0.16,1,0.3,1] }}
            whileHover={{ y:-18, scale:1.04, rotate:0, zIndex:20 }}
            style={{ ...f.style, position:"absolute", width:f.w, zIndex:i+1 }}>
            <motion.div style={{ y, boxShadow:`0 40px 100px rgba(0,0,0,0.75),0 0 0 1px ${C.b2}`, overflow:"hidden" }}>
              <img src={f.src} alt=""
                style={{ width:"100%", display:"block", filter:"grayscale(40%) contrast(1.1) brightness(0.72) saturate(0.75)" }}
                onError={e => { e.target.parentElement.style.background = C.b2; e.target.style.display = "none"; }} />

              <motion.div animate={{ y:["-100%","220%"] }}
                transition={{ repeat:Infinity, duration:2.5+i*0.9, ease:"linear", delay:i*1.4 }}
                style={{ position:"absolute", inset:"0 0 auto 0", height:1.5,
                  background:`linear-gradient(90deg,transparent,${i===0?C.red:C.gold},transparent)`, filter:"blur(0.5px)" }} />

              {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos, j) => (
                <div key={j} style={{ position:"absolute", ...pos, width:16, height:16,
                  borderTop: pos.top===0 ? `2px solid ${C.gold}` : "none",
                  borderBottom: pos.bottom===0 ? `2px solid ${C.gold}` : "none",
                  borderLeft: pos.left===0 ? `2px solid ${C.gold}` : "none",
                  borderRight: pos.right===0 ? `2px solid ${C.gold}` : "none",
                  opacity:0.7 }} />
              ))}

              <div style={{ position:"absolute", left:0, top:0, width:2, bottom:0,
                background:`linear-gradient(180deg,${C.red},${C.gold})`, opacity:0.8 }} />
              <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(6,4,2,0.85)",
                border:`1px solid ${C.b2}`, padding:"2px 8px",
                fontFamily:"monospace", fontSize:8, color:C.muted, letterSpacing:"0.16em" }}>
                BDH·00{i+1}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════
   SERVICES
════════════════════════════════ */
function ServicesSection() {
  const [open, setOpen] = useState(0);
  const svcs = [
    { n:"01", icon:"◈", title:"Mobile App Design", sub:"iOS · Android · React Native", desc:"Sıfırdan premium kullanıcı deneyimi. Performanslı, akıcı, güçlü.", tags:["Figma","React Native","Swift","Kotlin"] },
    { n:"02", icon:"⬡", title:"UI/UX & Prototyping", sub:"Wireframe · Flow · Visual", desc:"Kullanıcı akışından piksel detayına eksiksiz tasarım sistemi.", tags:["User Research","Wireframe","Prototype","Design System"] },
    { n:"03", icon:"↑", title:"App Store Optimization", sub:"ASO · Growth · Analytics", desc:"İndirme sayısını artıran strateji ve büyüme operasyonu.", tags:["ASO","Analytics","A/B Test","Growth"] },
    { n:"04", icon:"⚙", title:"Tech Support & Scale", sub:"Bakım · Performans · Evrim", desc:"Ürün canlıyken biz de aktifiz. 24/7 teknik destek.", tags:["Monitoring","CI/CD","Firebase","Scaling"] },
  ];

  return (
    <section style={{ padding:"100px 56px", borderBottom:`1px solid ${C.b2}`, position:"relative", zIndex:2 }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:C.muted, letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>§ 02 — Services</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,7vw,7.5rem)", lineHeight:0.85, marginBottom:72 }}>
        <RevealText text="WHAT WE DO."
          style={{ background:`linear-gradient(110deg,${C.white} 40%,${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }} />
      </div>

      <div style={{ borderTop:`1px solid ${C.b2}` }}>
        {svcs.map((s, i) => (
          <div key={s.n} data-p12cur={open === i ? "" : "view"}
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{ borderBottom:`1px solid ${C.b2}`, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"56px 1fr auto 56px", alignItems:"center", gap:24, padding:"28px 0", position:"relative" }}>
              <span style={{ fontFamily:"monospace", fontSize:9, color: open===i ? C.gold : C.muted, letterSpacing:"0.22em", transition:"color 0.3s" }}>{s.n}</span>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                <motion.span animate={{ color: open===i ? C.gold : C.b3, scale: open===i ? 1.1 : 1 }} transition={{ duration:0.3 }} style={{ fontSize:20, display:"inline-block" }}>{s.icon}</motion.span>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,3vw,2.8rem)", letterSpacing:"0.04em", lineHeight:1, color: open===i ? C.white : C.muted, transition:"color 0.3s" }}>{s.title}</span>
              </div>
              <span style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.16em", textTransform:"uppercase" }}>{s.sub}</span>
              <motion.span animate={{ rotate: open===i ? 45 : 0, color: open===i ? C.red : C.muted }}
                transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                style={{ fontSize:24, display:"flex", justifyContent:"flex-end", transformOrigin:"center" }}>+</motion.span>
              <motion.div animate={{ scaleX: open===i ? 1 : 0 }} transition={{ duration:0.5 }}
                style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${C.red},${C.gold},transparent)`, transformOrigin:"left" }} />
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}>
                  <div style={{ paddingBottom:36, paddingLeft:80, display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start" }}>
                    <div>
                      <p style={{ fontSize:14, color:C.muted, lineHeight:1.9, maxWidth:560, marginBottom:24 }}>{s.desc}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                        {s.tags.map((t, j) => (
                          <motion.span key={t} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:j*0.06, duration:0.4 }}
                            style={{ fontFamily:"monospace", fontSize:9, color:C.gold, letterSpacing:"0.18em", textTransform:"uppercase", border:`1px solid ${C.goldDeep}`, padding:"5px 12px" }}>
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════
   STATS
════════════════════════════════ */
function StatsSection() {
  const nums = [["18+","Apps launched"],["4.9★","Store rating"],["24/7","Live support"],["3yr","Experience"]];
  return (
    <section style={{ padding:"80px 56px", background:C.card, borderTop:`1px solid ${C.b2}`, borderBottom:`1px solid ${C.b2}`, position:"relative", zIndex:2, overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 15% 50%,${C.red}18,transparent 45%),radial-gradient(ellipse at 85% 50%,${C.gold}12,transparent 45%)`, filter:"blur(24px)", pointerEvents:"none" }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", position:"relative", zIndex:2 }}>
        {nums.map(([v, l], i) => (
          <TiltCard key={l} style={{ borderRight: i<3 ? `1px solid ${C.b2}` : "none", padding:"0 36px", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:i*0.1, ease:[0.16,1,0.3,1] }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.8rem,5vw,5rem)", letterSpacing:"0.02em", lineHeight:0.9, background:`linear-gradient(135deg,${C.white},${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.22em", textTransform:"uppercase", marginTop:10 }}>{l}</div>
              <motion.div animate={{ scale:[1,1.6,1], opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2+i*0.4, delay:i*0.3 }}
                style={{ width:4, height:4, borderRadius:"50%", background: i%2===0 ? C.red : C.gold, margin:"12px auto 0" }} />
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── PAGE 12 ─────────────── */
const CAPS = ["React Native","iOS","Android","UI/UX","ASO","Firebase","Figma","Redux","Performance","Strategy"];

export default function Page12() {
  const [time, setTime] = useState("");
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);

  useEffect(() => {
    const t = () => setTime(new Date().toLocaleTimeString("tr-TR", { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);

  return (
    <div className="page12-wrap bg-theme-tech" style={{ "--bg-theme-glow-strength":0.88, color:C.white, fontFamily:"'IBM Plex Mono',monospace", overflowX:"hidden", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .page12-wrap .p12-D{font-family:'Bebas Neue',sans-serif}
        .page12-wrap section{position:relative;z-index:2}
        .page12-wrap ::selection{background:${C.red};color:#fff}
        .page12-wrap::-webkit-scrollbar{width:2px}
        .page12-wrap::-webkit-scrollbar-thumb{background:${C.red}}
      `}</style>

      <ParticleField />
      <div className="bg-layer-grid" />
      <div className="bg-layer-glow" />
      <P12ScrollBar />
      <P12Grain />

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", paddingTop:100, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"10px 56px", borderBottom:`1px solid ${C.b1}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ fontSize:9, color:C.muted, letterSpacing:"0.26em" }}>
            BULLS DIGITAL HOUSE — EST. 2023 — ISTANBUL
          </motion.span>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
            style={{ display:"flex", gap:8, alignItems:"center" }}>
            <motion.div animate={{ scale:[1,1.5,1], opacity:[0.6,1,0.6] }} transition={{ repeat:Infinity, duration:2 }}
              style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
            <span style={{ fontSize:9, color:C.muted, letterSpacing:"0.2em" }}>OPEN FOR NEW PROJECTS</span>
            <span style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.1em", marginLeft:16 }}>{time}</span>
          </motion.div>
        </div>

        <motion.div style={{ flex:1, padding:"52px 56px 64px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"center", opacity:heroOpacity, y:heroY }}>
          <div>
            <div className="p12-D" style={{ fontSize:"clamp(5rem,12vw,12rem)", lineHeight:0.84, letterSpacing:"-0.01em", marginBottom:32 }}>
              {[
                { text:"WE", color:C.white },
                { text:"BUILD", grad:`linear-gradient(110deg,${C.red} 30%,${C.gold} 80%)` },
                { text:"MOBILE", color:C.white },
                { text:"APPS.", outline:true },
              ].map(({ text, color, grad, outline }, i) => (
                <div key={text} style={{ overflow:"hidden", marginBottom:"0.03em" }}>
                  <motion.div initial={{ y:"110%" }} animate={{ y:0 }}
                    transition={{ duration:1, delay:0.1+i*0.12, ease:[0.16,1,0.3,1] }}
                    style={{
                      background: grad || "none",
                      color: outline ? "transparent" : color || "inherit",
                      WebkitBackgroundClip: grad ? "text" : "initial",
                      WebkitTextFillColor: grad ? "transparent" : outline ? "transparent" : "initial",
                      WebkitTextStroke: outline ? `1.5px ${C.b3}` : "none",
                    }}>
                    {text}
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.p initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.75 }}
              style={{ fontSize:13, color:C.muted, lineHeight:1.9, maxWidth:420, marginBottom:36 }}>
              İstanbul merkezli mobil ürün stüdyosu. iOS, Android ve cross-platform.
              Strateji, tasarım, geliştirme ve büyüme — tek çatı altında.
            </motion.p>

            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.88 }}
              style={{ display:"flex", gap:12, marginBottom:52 }}>
              <motion.button data-p12cur="link"
                whileHover={{ background:C.redHot, boxShadow:`0 0 50px ${C.red}55` }}
                whileTap={{ scale:0.97 }}
                style={{ background:C.red, color:"#fff", border:"none", padding:"15px 30px", fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, boxShadow:`0 0 40px ${C.red}44`, transition:"all 0.2s" }}>
                START A PROJECT →
              </motion.button>
              <motion.button data-p12cur="link"
                whileHover={{ borderColor:C.gold, color:C.gold }}
                style={{ background:"transparent", color:C.muted, border:`1px solid ${C.b2}`, padding:"15px 28px", fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", transition:"all 0.22s" }}>
                SEE WORK ↓
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
              style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderTop:`1px solid ${C.b2}`, paddingTop:28 }}>
              {[["18+","Apps"],["4.9★","Rating"],["24/7","Support"],["3yr","Track"]].map(([v,l],i) => (
                <div key={l} style={{ borderRight: i<3 ? `1px solid ${C.b2}` : "none", paddingRight:16, paddingLeft: i>0 ? 16 : 0 }}>
                  <div className="p12-D" style={{ fontSize:"clamp(1.5rem,2.5vw,2.2rem)", letterSpacing:"0.04em", lineHeight:1, background:`linear-gradient(135deg,${C.white},${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
                  <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.18em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity:0, x:36 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:1.1, delay:0.2, ease:[0.16,1,0.3,1] }}>
            <HeroFrames />
          </motion.div>
        </motion.div>
      </section>

      {/* scroll-driven text band */}
      <ScrollText text="BULLS DIGITAL HOUSE — MOBILE APPS — " color={C.white} />

      {/* tickers */}
      <div style={{ borderBottom:`1px solid ${C.b2}`, position:"relative", zIndex:2, overflow:"hidden" }}>
        {[1, -1].map((dir, ri) => (
          <motion.div key={ri} animate={{ x: dir > 0 ? ["0%","-33.33%"] : ["-33.33%","0%"] }}
            transition={{ repeat:Infinity, duration:22+ri*6, ease:"linear" }}
            style={{ display:"flex", width:"max-content", borderTop: ri > 0 ? `1px solid ${C.b2}` : "none" }}>
            {[...CAPS,...CAPS,...CAPS].map((item, i) => (
              <div key={i} style={{ padding:"11px 28px", borderRight:`1px solid ${C.b2}`, fontFamily:"monospace", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:C.muted, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:3, height:3, borderRadius:"50%", display:"inline-block", background:[C.red,C.gold,C.b3][i%3], flexShrink:0 }} />
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <WorksSection />

      <ScrollText text="DESIGN — DEVELOP — LAUNCH — GROW — " color={C.gold} />

      <StatsSection />
      <ServicesSection />

      {/* Process */}
      <section style={{ padding:"100px 56px", borderBottom:`1px solid ${C.b2}`, position:"relative", zIndex:2 }}>
        <div style={{ fontFamily:"monospace", fontSize:9, color:C.muted, letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>§ 03 — Process</div>
        <div className="p12-D" style={{ fontSize:"clamp(3rem,7vw,7.5rem)", lineHeight:0.85, marginBottom:72 }}>
          <RevealText text="HOW WE BUILD." style={{ color:C.white }} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", border:`1px solid ${C.b2}` }}>
          {[
            { n:"01", e:"🔎", t:"DISCOVERY", d:"Hedef kitle, pazar ve ürün stratejisi." },
            { n:"02", e:"✦", t:"DESIGN", d:"Wireframe'den high-fi prototipe." },
            { n:"03", e:"⟨⟩", t:"DEVELOP", d:"React Native ile temiz mimari." },
            { n:"04", e:"🚀", t:"LAUNCH", d:"App Store, ASO ve büyüme." },
          ].map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.7 }}
              whileHover="hov"
              style={{ borderRight: i<3 ? `1px solid ${C.b2}` : "none", padding:32, position:"relative", overflow:"hidden" }}>
              <motion.div variants={{ hov:{ opacity:1 }, rest:{ opacity:0 } }} initial="rest" transition={{ duration:0.5 }}
                style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 100%,${C.red}18,transparent 65%)`, zIndex:0 }} />
              <motion.div variants={{ hov:{ scaleX:1 }, rest:{ scaleX:0 } }} initial="rest" transition={{ duration:0.55 }}
                style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.red},${C.gold})`, transformOrigin:"left", zIndex:3 }} />
              <div className="p12-D" style={{ position:"absolute", right:12, top:8, fontSize:72, color:C.faint, lineHeight:1, pointerEvents:"none", zIndex:0 }}>{s.n}</div>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:28, marginBottom:20 }}>{s.e}</div>
                <div className="p12-D" style={{ fontSize:"clamp(1.4rem,2.2vw,2rem)", letterSpacing:"0.04em", marginBottom:12, lineHeight:1, background:`linear-gradient(110deg,${C.white},${C.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.t}</div>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.85 }}>{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"120px 56px 140px", position:"relative", overflow:"hidden", zIndex:2 }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 25% 50%,${C.red}22,transparent 45%),radial-gradient(ellipse at 80% 50%,${C.gold}14,transparent 45%)`, filter:"blur(30px)", pointerEvents:"none" }} />
        <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
          transition={{ duration:1.2 }}
          style={{ position:"absolute", top:0, left:56, right:56, height:2, background:`linear-gradient(90deg,${C.red},${C.gold},transparent)`, transformOrigin:"left" }} />

        <div style={{ display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:60, alignItems:"end", position:"relative", zIndex:2 }}>
          <div>
            <div className="p12-D" style={{ fontSize:"clamp(4rem,11vw,10.5rem)", lineHeight:0.84, letterSpacing:"-0.02em" }}>
              {["LET'S","BUILD","YOUR","APP."].map((l, i) => (
                <div key={l} style={{ overflow:"hidden" }}>
                  <motion.div initial={{ y:"110%" }} whileInView={{ y:0 }} viewport={{ once:true }}
                    transition={{ duration:1, delay:i*0.1, ease:[0.16,1,0.3,1] }}
                    style={{
                      color: i===1 ? "transparent" : i===3 ? "transparent" : C.white,
                      background: i===1 ? `linear-gradient(110deg,${C.red},${C.gold})` : "none",
                      WebkitBackgroundClip: i===1 ? "text" : "initial",
                      WebkitTextFillColor: i===1 ? "transparent" : i===3 ? "transparent" : "initial",
                      WebkitTextStroke: i===3 ? `1.5px ${C.b3}` : "none",
                    }}>{l}</motion.div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingBottom:8 }}>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.9, marginBottom:32, maxWidth:360 }}>
              Fikrinizi ve hedef kitlenizi paylaşın. 24 saat içinde size özel teklif ile dönüyoruz.
            </p>
            {["hello@bullsdigital.com","+90 xxx xxx xx xx","İstanbul, Türkiye"].map((c, i) => (
              <motion.div key={c} initial={{ opacity:0, x:-14 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay:0.1+i*0.1, duration:0.6 }}
                style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${C.b1}` }}>
                <div style={{ width:3, height:3, borderRadius:"50%", background:[C.red,C.gold,C.muted][i], flexShrink:0 }} />
                <span style={{ fontSize:11, color:C.muted, letterSpacing:"0.08em" }}>{c}</span>
              </motion.div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:28 }}>
              <motion.button data-p12cur="link" whileHover={{ background:C.redHot, boxShadow:`0 0 50px ${C.red}55` }}
                whileTap={{ scale:0.97 }}
                style={{ background:C.red, color:"#fff", border:"none", padding:"16px 30px", fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, boxShadow:`0 0 40px ${C.red}44`, transition:"all 0.2s" }}>
                START NOW →
              </motion.button>
              <motion.button data-p12cur="link" whileHover={{ color:C.gold, borderColor:C.gold }}
                style={{ background:"transparent", color:C.muted, border:`1px solid ${C.b2}`, padding:"16px 24px", fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", transition:"all 0.2s" }}>
                PORTFOLIO ↗
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.b2}`, padding:"22px 56px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:22, height:22, background:`linear-gradient(135deg,${C.red},${C.gold})`, clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="p12-D" style={{ fontSize:10, color:"#fff" }}>B</span>
          </div>
          <span className="p12-D" style={{ fontSize:15, letterSpacing:"0.1em" }}>BULLS DIGITAL HOUSE</span>
        </div>
        <span style={{ fontSize:9, color:C.muted, letterSpacing:"0.22em" }}>© 2026 — ISTANBUL / GLOBAL</span>
        <div style={{ display:"flex", gap:28 }}>
          {["Privacy","Terms","Instagram","LinkedIn"].map(n => (
            <motion.a key={n} href="#" whileHover={{ color:C.gold }}
              style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.muted, textDecoration:"none", transition:"color 0.18s" }}>
              {n}
            </motion.a>
          ))}
        </div>
      </footer>
    </div>
  );
}
