import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════
   CURSOR — Morph + Trail + Context-Aware
═══════════════════════════════════════════ */
function P13Cursor() {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const fx = useSpring(mx, { stiffness: 800, damping: 35, mass: 0.1 });
  const fy = useSpring(my, { stiffness: 800, damping: 35, mass: 0.1 });
  const rx = useSpring(mx, { stiffness: 120, damping: 28, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 120, damping: 28, mass: 0.6 });

  const [state, setState] = useState("idle");
  const [trail, setTrail] = useState([]);
  const [clicked, setClicked] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      velRef.current = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 20);
      lastPos.current = { x: e.clientX, y: e.clientY };
      mx.set(e.clientX); my.set(e.clientY);
      setTrail(t => [...t.slice(-12), { x: e.clientX, y: e.clientY, v: velRef.current }]);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const wrap = el.closest(".page13-wrap");
      if (!wrap) { setState("idle"); return; }
      if (el.closest("button,a,[data-hover]")) setState("hover");
      else if (el.closest("p,h1,h2,h3,h4,span,[data-text]")) setState("text");
      else setState("idle");
    };
    const onDown = () => { setClicked(true); setTimeout(() => setClicked(false), 300); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  const ringSize = state === "hover" ? 52 : state === "text" ? 3 : 18;
  const ringBorder = state === "hover" ? "1.5px solid rgba(245,168,0,0.8)" : state === "text" ? "none" : "1.5px solid rgba(232,34,10,0.7)";
  const ringBg = state === "hover" ? "rgba(245,168,0,0.08)" : state === "text" ? "rgba(232,34,10,0.9)" : "transparent";
  const dotSize = state === "text" ? 0 : state === "hover" ? 4 : 7;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      {trail.map((p, i) => (
        <div key={i} style={{
          position: "fixed", left: p.x, top: p.y,
          width: 4 + i * 0.3, height: 4 + i * 0.3,
          borderRadius: "50%", transform: "translate(-50%,-50%)",
          background: i % 2 === 0
            ? `rgba(232,34,10,${(i / trail.length) * p.v * 0.5})`
            : `rgba(245,168,0,${(i / trail.length) * p.v * 0.4})`,
          filter: "blur(1px)", pointerEvents: "none",
        }} />
      ))}

      <motion.div style={{ position: "fixed", x: fx, y: fy, translateX: "-50%", translateY: "-50%", zIndex: 2 }}>
        <motion.div
          animate={{
            width: dotSize, height: dotSize,
            background: state === "hover" ? "#f5a800" : "#e8220a",
            boxShadow: clicked
              ? "0 0 0 8px rgba(232,34,10,0.2), 0 0 20px rgba(232,34,10,0.6)"
              : `0 0 8px ${state === "hover" ? "rgba(245,168,0,0.8)" : "rgba(232,34,10,0.6)"}`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{ borderRadius: "50%" }}
        />
      </motion.div>

      <motion.div style={{ position: "fixed", x: rx, y: ry, translateX: "-50%", translateY: "-50%", zIndex: 1 }}>
        <motion.div
          animate={{
            width: ringSize, height: ringSize,
            border: ringBorder, background: ringBg,
            borderRadius: state === "text" ? "2px" : "50%",
            rotate: state === "hover" ? 45 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {state === "hover" && (
            <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ fontSize: 8, color: "#f5a800", letterSpacing: "0.12em", fontFamily: "monospace", whiteSpace: "nowrap" }}>↗</motion.span>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {clicked && (
          <motion.div key="ripple"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "fixed", left: lastPos.current.x, top: lastPos.current.y,
              translateX: "-50%", translateY: "-50%", borderRadius: "50%",
              border: "1.5px solid rgba(232,34,10,0.6)", pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId;
    const mouse = { x: W / 2, y: H / 2 };

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      col: Math.random() > 0.5 ? [232, 34, 10] : [245, 168, 0],
      alpha: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) { p.vx += (dx / d) * 0.3; p.vy += (dy / d) * 0.3; }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        p.phase += 0.015;

        const a = p.alpha * (0.5 + Math.sin(p.phase) * 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
        ctx.fill();

        pts.forEach(q => {
          const ddx = p.x - q.x, ddy = p.y - q.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 80 && dd > 0) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(245,168,0,${(1 - dd / 80) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }} />;
}

/* ═══════════════════════════════════════════
   WORD ROTATOR
═══════════════════════════════════════════ */
function WordRotator({ words }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span style={{ position: "relative", display: "inline-block", minWidth: "3ch" }}>
      <AnimatePresence mode="wait">
        <motion.span key={idx}
          initial={{ y: 40, opacity: 0, filter: "blur(8px)", rotateX: -40 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          exit={{ y: -40, opacity: 0, filter: "blur(8px)", rotateX: 40 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", transformOrigin: "center" }}
        >{words[idx]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ═══════════════════════════════════════════
   COUNT UP
═══════════════════════════════════════════ */
function CountUp({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let st = null;
        const run = (ts) => {
          if (!st) st = ts;
          const p = Math.min((ts - st) / 1800, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(run); else setVal(target);
        };
        requestAnimationFrame(run);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   SPLIT REVEAL
═══════════════════════════════════════════ */
function SplitReveal({ text, delay = 0, style = {}, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em", ...style }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            initial={{ y: "105%", opacity: 0 }}
            animate={vis ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block" }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS
═══════════════════════════════════════════ */
function P13ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 600,
      background: "linear-gradient(90deg,#e8220a,#f5a800)",
      scaleX, transformOrigin: "left", pointerEvents: "none",
    }} />
  );
}

/* ═══════════════════════════════════════════
   FLOATING ORB
═══════════════════════════════════════════ */
function Orb({ size, x, y, color, dur, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, transparent 65%)`,
        filter: "blur(48px)", left: x, top: y, pointerEvents: "none",
      }}
      animate={{ x: [0, 35, -25, 20, 0], y: [0, -28, 18, -35, 0], scale: [1, 1.12, 0.92, 1.08, 1] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ═══════════════════════════════════════════
   PAGE 13
═══════════════════════════════════════════ */
export default function Page13() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  useEffect(() => {
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  const words = ["Güçlü", "Hızlı", "Premium", "Akıllı"];

  const orbs = [
    { size: 500, x: "-5%", y: "0%", color: "rgba(232,34,10,0.18)", dur: 22, delay: 0 },
    { size: 360, x: "70%", y: "5%", color: "rgba(245,168,0,0.14)", dur: 28, delay: 2 },
    { size: 420, x: "40%", y: "55%", color: "rgba(232,34,10,0.1)", dur: 26, delay: 1 },
    { size: 240, x: "85%", y: "55%", color: "rgba(245,168,0,0.12)", dur: 20, delay: 3 },
  ];

  const services = [
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
    <div className="page13-wrap" style={{ background: "#060402", color: "#ede8dc", fontFamily: "'IBM Plex Mono', monospace", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@1,700&display=swap');

        .page13-wrap * { cursor: none !important; }
        .page13-wrap ::selection { background: #e8220a; color: #fff; }

        .page13-wrap .p13-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .page13-wrap .p13-noise {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        .page13-wrap .p13-hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden; background: #060402;
        }

        .page13-wrap .p13-eyebrow {
          position: relative; z-index: 10;
          padding: 10px 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; justify-content: space-between; align-items: center;
        }

        .page13-wrap .p13-main {
          flex: 1; position: relative; z-index: 10;
          padding: 56px 52px 72px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 52px; align-items: center;
        }

        .page13-wrap .p13-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 11vw, 11rem);
          line-height: 0.86; letter-spacing: -0.01em;
          margin-bottom: 28px;
        }

        .page13-wrap .hl-plain { color: #ede8dc; }
        .page13-wrap .hl-grad {
          background: linear-gradient(110deg, #e8220a 30%, #f5a800 80%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page13-wrap .hl-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.12);
        }

        .page13-wrap .p13-sub {
          font-size: 13px; color: rgba(237,232,220,0.5);
          line-height: 1.9; max-width: 400px; margin-bottom: 36px;
        }

        .page13-wrap .p13-btns { display: flex; gap: 12px; margin-bottom: 52px; }
        .page13-wrap .btn-primary {
          background: #e8220a; color: #fff; border: none;
          padding: 14px 28px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 0 40px rgba(232,34,10,0.35);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .page13-wrap .btn-primary:hover { background: #ff3d1f; box-shadow: 0 0 60px rgba(232,34,10,0.55); }
        .page13-wrap .btn-ghost {
          background: transparent; color: rgba(237,232,220,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 14px 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          transition: all 0.22s;
        }
        .page13-wrap .btn-ghost:hover { border-color: #f5a800; color: #f5a800; }

        .page13-wrap .p13-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          border-top: 1px solid rgba(255,255,255,0.08); padding-top: 28px;
        }
        .page13-wrap .stat-item { border-right: 1px solid rgba(255,255,255,0.06); padding-right: 16px; padding-left: 16px; }
        .page13-wrap .stat-item:first-child { padding-left: 0; }
        .page13-wrap .stat-item:last-child { border-right: none; }
        .page13-wrap .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          letter-spacing: 0.04em; line-height: 1;
          background: linear-gradient(135deg, #ede8dc, #f5a800);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page13-wrap .stat-lbl { font-size: 9px; color: rgba(237,232,220,0.4); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px; }

        .page13-wrap .service-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        .page13-wrap .svc-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px 22px; position: relative; overflow: hidden;
          transition: background 0.3s, border-color 0.3s;
        }
        .page13-wrap .svc-card:hover { background: rgba(232,34,10,0.06); border-color: rgba(232,34,10,0.25); }
        .page13-wrap .svc-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, #e8220a, #f5a800, transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s ease;
        }
        .page13-wrap .svc-card:hover::before { transform: scaleX(1); }
        .page13-wrap .svc-num { font-size: 9px; color: rgba(237,232,220,0.25); letter-spacing: 0.22em; margin-bottom: 14px; }
        .page13-wrap .svc-icon { font-size: 22px; margin-bottom: 12px; }
        .page13-wrap .svc-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.06em; color: rgba(237,232,220,0.75); }

        .page13-wrap .p13-marquee-wrap {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden; position: relative; z-index: 2;
        }
        .page13-wrap .p13-marquee-item {
          padding: 12px 30px; border-right: 1px solid rgba(255,255,255,0.06);
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(237,232,220,0.35); white-space: nowrap;
          display: flex; align-items: center; gap: 10px;
        }

        .page13-wrap .p13-scroll-hint {
          position: absolute; bottom: 28px; left: 52px;
          z-index: 10; display: flex; align-items: center; gap: 12px;
        }
        .page13-wrap .p13-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(180deg, transparent, rgba(232,34,10,0.8));
          animation: p13scrollPulse 2s ease-in-out infinite;
        }
        .page13-wrap .p13-scroll-txt { font-size: 8px; color: rgba(237,232,220,0.3); letter-spacing: 0.3em; writing-mode: vertical-rl; }
        @keyframes p13scrollPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

        .page13-wrap .tag-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(232,34,10,0.12); border: 1px solid rgba(232,34,10,0.25);
          border-radius: 999px; padding: 6px 16px;
          font-size: 10px; color: rgba(245,168,0,0.9); letter-spacing: 0.16em;
          margin-bottom: 24px;
        }
        .page13-wrap .tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: p13blink 2s infinite; }
        @keyframes p13blink { 0%,100%{opacity:0.5;} 50%{opacity:1;} }

        .page13-wrap .p13-section { padding: 100px 52px; position: relative; z-index: 2; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .page13-wrap .p13-section-label { font-size: 9px; color: rgba(237,232,220,0.35); letter-spacing: 0.28em; text-transform: uppercase; margin-bottom: 14px; }
        .page13-wrap .p13-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem,7vw,7rem); line-height: 0.87; letter-spacing: -0.01em;
          margin-bottom: 64px;
        }

        .page13-wrap .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(255,255,255,0.07); }
        .page13-wrap .why-card {
          padding: 36px; border-right: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; transition: background 0.3s;
        }
        .page13-wrap .why-card:hover { background: rgba(232,34,10,0.04); }
        .page13-wrap .why-card:nth-child(2n) { border-right: none; }
        .page13-wrap .why-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #e8220a, #f5a800);
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .page13-wrap .why-card:hover::after { transform: scaleX(1); }
        .page13-wrap .why-icon { font-size: 24px; margin-bottom: 16px; }
        .page13-wrap .why-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.05em; margin-bottom: 8px; color: #ede8dc; }
        .page13-wrap .why-desc { font-size: 12px; color: rgba(237,232,220,0.45); line-height: 1.8; }

        .page13-wrap .process-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border: 1px solid rgba(255,255,255,0.07); }
        .page13-wrap .process-card {
          padding: 28px; border-right: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
        }
        .page13-wrap .process-card:last-child { border-right: none; }
        .page13-wrap .process-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #e8220a, #f5a800); transform: scaleX(0);
          transform-origin: left; transition: transform 0.5s ease;
        }
        .page13-wrap .process-card:hover::before { transform: scaleX(1); }
        .page13-wrap .process-num { font-size: 48px; font-family: 'Bebas Neue', sans-serif; color: rgba(255,255,255,0.05); line-height: 1; margin-bottom: 16px; }
        .page13-wrap .process-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.05em; margin-bottom: 8px;
          background: linear-gradient(110deg, #ede8dc, #f5a800); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .page13-wrap .process-desc { font-size: 11px; color: rgba(237,232,220,0.4); line-height: 1.8; }

        .page13-wrap .p13-cta-wrap {
          margin: 80px 52px 100px; padding: 72px 56px;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; text-align: center;
          background: linear-gradient(135deg, rgba(232,34,10,0.06), rgba(245,168,0,0.04));
        }
        .page13-wrap .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem,6vw,6rem); letter-spacing: -0.01em; line-height: 0.88; margin-bottom: 20px; color: #ede8dc; }
        .page13-wrap .cta-desc { font-size: 13px; color: rgba(237,232,220,0.5); line-height: 1.9; max-width: 480px; margin: 0 auto 36px; }
        .page13-wrap .cta-btns { display: flex; gap: 12px; justify-content: center; }
        .page13-wrap .p13-cta-glow {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,34,10,0.12), transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          filter: blur(40px); pointer-events: none;
          animation: p13ctaGlow 5s ease-in-out infinite;
        }
        @keyframes p13ctaGlow { 0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1);} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.2);} }

        .page13-wrap .p13-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 20px 52px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
      `}</style>

      <P13ScrollBar />
      <P13Cursor />
      <div className="p13-noise" />

      {/* ═══ HERO ═══ */}
      <motion.div className="p13-hero" style={{ opacity: heroOpacity, y: heroY, paddingTop: 100 }}>
        <ParticleCanvas />

        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          {orbs.map((o, i) => <Orb key={i} {...o} />)}
        </div>

        <div className="p13-grid" />

        <div className="p13-eyebrow">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontSize: 9, color: "rgba(237,232,220,0.35)", letterSpacing: "0.26em" }}>
            BULLS DIGITAL HOUSE — EST. 2023 — ISTANBUL
          </motion.span>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 9, color: "rgba(237,232,220,0.35)", letterSpacing: "0.2em" }}>OPEN FOR PROJECTS</span>
          </motion.div>
        </div>

        <div className="p13-main">
          <div style={{ position: "relative", zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <div className="tag-pill">
                <div className="tag-dot" />
                <span>Bulls Digital Studio</span>
              </div>
            </motion.div>

            <div className="p13-headline">
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
                  <WordRotator words={words} />
                </motion.div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.div initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="hl-plain">ÇÖZÜMLER</motion.div>
              </div>
            </div>

            <motion.p className="p13-sub"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.7 }}>
              İstanbul merkezli dijital ürün stüdyosu. Oyun geliştirmeden mobil uygulamaya,
              UI/UX&apos;ten backend&apos;e — tek çatı altında eksiksiz çözümler.
            </motion.p>

            <motion.div className="p13-btns"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.86, duration: 0.7 }}>
              <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                İLETİŞİME GEÇİN →
              </motion.button>
              <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                PROJELERİMİZ ↓
              </motion.button>
            </motion.div>

            <motion.div className="p13-stats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.7 }}>
              {stats.map(({ val, suffix, label }) => (
                <div key={label} className="stat-item">
                  <div className="stat-num"><CountUp target={val} suffix={suffix} /></div>
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

            <div className="service-grid">
              {services.map((s, i) => (
                <motion.div key={s.num} className="svc-card"
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, scale: 1.02 }}>
                  <div className="svc-num">{s.num}</div>
                  <motion.div className="svc-icon" whileHover={{ rotate: 10, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                    {s.icon}
                  </motion.div>
                  <div className="svc-title">{s.title}</div>
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

        <motion.div className="p13-scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <div className="p13-scroll-line" />
          <span className="p13-scroll-txt">SCROLL</span>
        </motion.div>
      </motion.div>

      {/* ═══ MARQUEE ═══ */}
      <div className="p13-marquee-wrap">
        {[0, 1].map(row => (
          <motion.div key={row}
            animate={{ x: row === 0 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
            transition={{ repeat: Infinity, duration: row === 0 ? 24 : 30, ease: "linear" }}
            style={{ display: "flex", width: "max-content", borderTop: row > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            {["GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER",
              "GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER",
              "GAME DEVELOPMENT", "MOBİL UYGULAMA", "UI/UX DESIGN", "BACKEND & CLOUD", "DİJİTAL ÇÖZÜMLER"
            ].map((item, i) => (
              <div key={i} className="p13-marquee-item">
                <span style={{ width: 3, height: 3, borderRadius: "50%", display: "inline-block", background: i % 2 === 0 ? "#e8220a" : "#f5a800", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* ═══ WHY US ═══ */}
      <section className="p13-section">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p13-section-label">§ 01 — Neden Biz</div>
        </motion.div>
        <div className="p13-section-title">
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
      <section className="p13-section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="p13-section-label">§ 02 — Sürecimiz</div>
        </motion.div>
        <div className="p13-section-title">
          <SplitReveal text="NASIL ÇALIŞIYORUZ?" style={{ color: "#ede8dc" }} delay={0.05} />
        </div>

        <div className="process-grid">
          {[
            { n: "01", t: "KEŞIF", d: "Hedef, kullanıcı ve pazar analizi." },
            { n: "02", t: "TASARIM", d: "Wireframe'den high-fi prototipe." },
            { n: "03", t: "GELİŞTİRME", d: "Temiz, ölçeklenebilir mimari." },
            { n: "04", t: "LANSMAN", d: "Yayın ve sürekli büyüme." },
          ].map((s, i) => (
            <motion.div key={s.n} className="process-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.65 }}
              whileHover={{ background: "rgba(232,34,10,0.04)" }}>
              <div className="process-num">{s.n}</div>
              <div className="process-title">{s.t}</div>
              <div className="process-desc">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <motion.div className="p13-cta-wrap"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="p13-cta-glow" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="cta-title">
            <SplitReveal text="PROJENİZİ HAYATA GEÇİRELİM" style={{ color: "#ede8dc" }} />
          </div>
          <p className="cta-desc">
            Ücretsiz danışmanlık için hemen iletişime geçin. 24 saat içinde dönüş yapalım.
          </p>
          <div className="cta-btns">
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
      <div className="p13-footer">
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
