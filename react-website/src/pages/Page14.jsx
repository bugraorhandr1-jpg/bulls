import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, useMotionValue, useSpring, useTransform,
  useScroll, AnimatePresence
} from "framer-motion";
import ShaderBG from "../components/ShaderBG";

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
      style={{ ...base, fontFamily:"IBM Plex Mono,monospace", textTransform:"uppercase", transition:"box-shadow 0.3s,background 0.2s,color 0.2s,border-color 0.2s", x: sx, y: sy, display:"flex", alignItems:"center", gap:10, ...style }}
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

function heatColor(t) {
  if (t < 40) return `hsl(${200 - t * 1.5},80%,45%)`;
  if (t < 65) return `hsl(${140 - (t - 40) * 3.2},75%,42%)`;
  if (t < 85) return `hsl(${60 - (t - 65) * 2.5},88%,48%)`;
  return `hsl(${10 - (t - 85) * 0.5},92%,50%)`;
}

function ThermalText({ children, style = {}, as: Tag = "span", baseTemp = 6 }) {
  const [hot, setHot] = useState(false);
  const [temp, setTemp] = useState(baseTemp);

  useEffect(() => {
    if (hot) {
      const id = setInterval(() => setTemp((t) => Math.min(100, t + 8)), 26);
      return () => clearInterval(id);
    }
    const id = setInterval(() => setTemp((t) => Math.max(baseTemp, t - 4)), 36);
    return () => clearInterval(id);
  }, [hot, baseTemp]);

  return (
    <Tag
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        ...style,
        color: temp > 8 ? heatColor(temp) : style.color,
        textShadow: temp > 8 ? `0 0 ${Math.max(0, (temp - 20) * 0.25)}px ${heatColor(temp)}` : style.textShadow,
        transition: "color 0.08s, text-shadow 0.08s",
      }}
    >
      {children}
    </Tag>
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

function ParticlePanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let particles = [];

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            const a = (1 - d / 90) * 0.22;
            ctx.strokeStyle = `rgba(245,168,0,${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(232,34,10,0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
export default function Page14() {
  const { burst, Confetti } = useConfetti();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const { scrollY } = useScroll();
  const heroOp = useTransform(scrollY, [0, 520], [1, 0]);
  const heroY  = useTransform(scrollY, [0, 520], [0, -100]);

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
  const mobileCards = [
    { badge: "Mobile UX", title: "Pulse Commerce", subtitle: "Checkout akışında mikro etkileşim ve yüksek dönüşüm odaklı ekran dili.", metric: "+38% CVR" },
    { badge: "Product Speed", title: "Orbit Banking", subtitle: "Düşük gecikmeli veri katmanı ile premium ve akıcı mobil his.", metric: "78ms TTFB" },
    { badge: "Retention", title: "Nova Health", subtitle: "Kişiselleştirilmiş bildirim ve davranış tabanlı ekran varyasyonları.", metric: "+27% Retention" },
  ];
  const showcaseRail = [
    { category: "Fintech", title: "Neon Vault", year: "2026" },
    { category: "Gaming", title: "Arena Drift", year: "2026" },
    { category: "SaaS", title: "Signal Deck", year: "2025" },
    { category: "Retail", title: "Flux Store", year: "2025" },
  ];
  const heroSignals = ["Particle Core", "Motion Rhythm", "Contrast Balance", "Mobile First", "Realtime Glow", "Performance Guard"];

  return (
    <div className="page14-wrap bg-theme-tech" style={{ "--bg-theme-glow-strength":0.54, color:"#ede8dc", fontFamily:"'IBM Plex Mono',monospace", overflowX:"hidden", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@1,500;1,700&display=swap');

        .page14-wrap ::selection { background:#e8220a; color:#fff; }
        .page14-wrap ::-webkit-scrollbar { width:2px; }
        .page14-wrap ::-webkit-scrollbar-thumb { background:linear-gradient(#e8220a,#f5a800); }
        .page14-wrap .D { font-family:'Bebas Neue',sans-serif; }
        .page14-wrap .I { font-family:'Playfair Display',Georgia,serif; font-style:italic; }

        .page14-wrap .p14-noise {
          position:fixed; inset:0; z-index:1; pointer-events:none; opacity:var(--bg-theme-noise-opacity,0.035);
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
        .page14-wrap .p14-mobile-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:2px; }
        .page14-wrap .p14-mobile-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); padding:26px; position:relative; overflow:hidden; }
        .page14-wrap .p14-mobile-card::after { content:""; position:absolute; left:0; right:0; bottom:0; height:2px; background:linear-gradient(90deg,#e8220a,#f5a800); opacity:.8; }

        .page14-wrap .p14-rail { overflow-x:auto; overflow-y:hidden; padding-bottom:6px; }
        .page14-wrap .p14-rail-track { display:flex; gap:2px; min-width:max-content; }
        .page14-wrap .p14-rail-card { min-width:280px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); padding:24px; transition:transform .25s,border-color .25s; }
        .page14-wrap .p14-rail-card:hover { transform:translateY(-4px); border-color:rgba(245,168,0,0.35); }

        .page14-wrap .p14-signals-wrap { display:grid; grid-template-columns:1.1fr .9fr; gap:2px; }
        .page14-wrap .p14-signals-tags { display:flex; gap:8px; flex-wrap:wrap; margin-top:20px; }
        .page14-wrap .p14-tag-chip { border:1px solid rgba(255,255,255,0.1); padding:6px 10px; font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:rgba(237,232,220,0.45); background:rgba(255,255,255,0.02); }

        @media (max-width: 1024px) {
          .page14-wrap .p14-mobile-grid { grid-template-columns:1fr; }
          .page14-wrap .p14-signals-wrap { grid-template-columns:1fr; }
          .page14-wrap .p14-proc-grid { grid-template-columns:repeat(2,1fr); }
          .page14-wrap .p14-proc-card:nth-child(2n) { border-right:none; }
        }

        @media (max-width: 768px) {
          .page14-wrap .p14-section { padding:80px 20px; }
          .page14-wrap .p14-footer { padding:16px 20px; flex-direction:column; gap:14px; align-items:flex-start; }
          .page14-wrap .p14-proc-grid { grid-template-columns:1fr; }
          .page14-wrap .p14-proc-card { border-right:none; border-bottom:1px solid rgba(255,255,255,0.07); }
        }
      `}</style>

      <ShaderBG />
      <P14ScrollBar />
      <Confetti />
      <div className="bg-layer-glow" />
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
                    transition={{ duration:1.05, delay:0.1+i*0.13, ease:[0.16,1,0.3,1] }} style={s}>
                    <ThermalText baseTemp={i === 0 ? 8 : 12}>{txt}</ThermalText>
                  </motion.div>
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
                  style={{ color:"#ede8dc" }}><ThermalText baseTemp={7}>ÇÖZÜMLER</ThermalText></motion.div>
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
                      style={{ padding:"28px 22px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", position:"relative", overflow:"hidden", transition:"background 0.3s,border-color 0.3s" }}
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
                    style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.14em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.07)", padding:"4px 10px", transition:"all 0.2s" }}>
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

      {/* MOBILE SHOWCASE */}
      <section className="p14-section bg-section-soft">
        <div style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>01 - Mobile Showcase</div>
        <div className="D" style={{ fontSize:"clamp(2.4rem,6vw,5.8rem)", lineHeight:0.88, marginBottom:40, color:"#ede8dc" }}>
          <CharReveal text="MOBILE POWER BLOCKS" />
        </div>
        <div className="p14-mobile-grid">
          {mobileCards.map((card, idx) => (
            <motion.div
              key={card.title}
              className="p14-mobile-card"
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:idx*0.08, duration:0.55 }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(237,232,220,0.3)" }}>{card.badge}</span>
                <span style={{ fontSize:9, color:"rgba(245,168,0,0.8)", letterSpacing:"0.18em" }}>0{idx+1}</span>
              </div>
              <div className="D" style={{ fontSize:"1.8rem", letterSpacing:"0.05em" }}><ThermalText baseTemp={14}>{card.title}</ThermalText></div>
              <p style={{ marginTop:6, fontSize:12, lineHeight:1.7, color:"rgba(237,232,220,0.42)" }}>{card.subtitle}</p>
              <div className="I" style={{ marginTop:18, fontSize:18, color:"#f5a800", letterSpacing:"0.04em" }}>{card.metric}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SHOWCASE RAIL */}
      <section className="p14-section">
        <div style={{ fontSize:9, color:"rgba(237,232,220,0.3)", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>02 - Showcase Rail</div>
        <div className="D" style={{ fontSize:"clamp(2.2rem,5.5vw,5.2rem)", lineHeight:0.88, marginBottom:32, color:"#ede8dc" }}>
          <CharReveal text="SELECTED MOTION WORKS" />
        </div>
        <div className="p14-rail">
          <div className="p14-rail-track">
            {showcaseRail.map((item, idx) => (
              <motion.article
                key={item.title}
                className="p14-rail-card"
                whileHover={{ scale:1.02 }}
                initial={{ opacity:0, y:16 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:idx*0.07, duration:0.55 }}
              >
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, letterSpacing:"0.18em", color:"rgba(237,232,220,0.3)", textTransform:"uppercase", marginBottom:16 }}>
                  <span>{item.category}</span><span>{item.year}</span>
                </div>
                <div className="D" style={{ fontSize:"2rem", letterSpacing:"0.05em", marginBottom:8 }}><ThermalText baseTemp={10}>{item.title}</ThermalText></div>
                <p style={{ fontSize:12, lineHeight:1.75, color:"rgba(237,232,220,0.42)" }}>Premium motion system with balanced contrast and rhythm.</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* HERO SIGNALS */}
      <section className="p14-section bg-section-soft">
        <div className="p14-signals-wrap">
          <div style={{ padding:"30px 26px", border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize:9, color:"rgba(237,232,220,0.32)", letterSpacing:"0.24em", textTransform:"uppercase", marginBottom:16 }}>03 - Hero Signals</div>
            <div className="D" style={{ fontSize:"clamp(2rem,5vw,4.2rem)", lineHeight:0.9, marginBottom:16, color:"#ede8dc" }}>LIVE SIGNAL LAYER</div>
            <p style={{ fontSize:12, lineHeight:1.85, color:"rgba(237,232,220,0.42)", maxWidth:520 }}>A composed mix of mobile clarity, showcase depth, and particle atmosphere.</p>
            <div className="p14-signals-tags">
              {heroSignals.map((tag, idx) => (
                <motion.span
                  key={tag}
                  className="p14-tag-chip"
                  initial={{ opacity:0, scale:0.9 }}
                  whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:idx*0.05 }}
                  whileHover={{ color:"#f5a800", borderColor:"rgba(245,168,0,0.45)" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
          <div style={{ position:"relative", minHeight:320, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(8,6,4,0.8)", overflow:"hidden" }}>
            <ParticlePanel />
            <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center" }}>
              <div style={{ textAlign:"center", padding:"12px 14px", border:"1px solid rgba(245,168,0,0.25)", background:"rgba(12,9,6,0.72)", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(245,168,0,0.9)" }}>
                Particle Hero Core
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <div className="D" style={{ fontSize:"1.5rem", letterSpacing:"0.06em", marginBottom:10 }}><ThermalText baseTemp={12}>{w.t}</ThermalText></div>
                  <p style={{ fontSize:12, color:"rgba(237,232,220,0.4)", lineHeight:1.85 }}>{w.d}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="p14-section bg-section-hard">
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
              <div className="D" style={{ fontSize:"1.3rem", letterSpacing:"0.05em", marginBottom:10 }}><ThermalText baseTemp={11}>{s.t}</ThermalText></div>
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
    </div>
  );
}







