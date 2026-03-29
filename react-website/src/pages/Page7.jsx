import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

/* ── Data ── */
const SERVICES = [
  {
    id: "01", title: "Mobile App Design", sub: "iOS · Android · Cross-platform",
    desc: "Hızlı, güçlü ve premium deneyimler. Sadece güzel görünmez — çalışır.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&fit=crop"
  },
  {
    id: "02", title: "Game Production", sub: "Konsept · Oynanış · Kimlik",
    desc: "Tekrar açtıran, bağımlılık yapan dijital deneyimler.",
    img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80&fit=crop"
  },
  {
    id: "03", title: "Tech Support & Growth", sub: "Bakım · Performans · Evrim",
    desc: "Ürününüz canlı kaldığı sürece biz de yanınızdayız.",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&fit=crop"
  },
];

const STATS = [["12+", "Ürün"], ["3", "Servis"], ["24/7", "Destek"], ["Global", "Erişim"]];

const PROCESS = [
  { n: "01", title: "Discover", desc: "Doğru problemi avlıyoruz.", bar: 88 },
  { n: "02", title: "Design", desc: "Sistemi kuruyoruz.", bar: 70 },
  { n: "03", title: "Build", desc: "Temiz kod, ölçekli mimari.", bar: 95 },
  { n: "04", title: "Launch", desc: "Yayın sonrası iterasyon.", bar: 60 },
];

const PROJECTS = [
  {
    code: "PRJ-001", title: "Pulse Commerce", tag: "Mobile Product", year: "2024", temp: 94,
    img: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80&fit=crop"
  },
  {
    code: "PRJ-002", title: "Neon Rally", tag: "Game Concept", year: "2024", temp: 78,
    img: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80&fit=crop"
  },
  {
    code: "PRJ-003", title: "Orbit Ops", tag: "Support System", year: "2025", temp: 61,
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80&fit=crop"
  },
];

const TICKER = [
  "React Native","Game Systems","UI Motion","Technical Support","Launch Ops",
  "Global Delivery","3D Direction","React Native","Game Systems","UI Motion",
  "Technical Support","Launch Ops","Global Delivery","3D Direction",
];

/* ── Heat color mapping ── */
function heatColor(t) {
  if (t < 40) return `hsl(${200 - t * 1.5},80%,45%)`;
  if (t < 65) return `hsl(${140 - (t - 40) * 3.2},75%,42%)`;
  if (t < 85) return `hsl(${60 - (t - 65) * 2.5},88%,48%)`;
  return `hsl(${10 - (t - 85) * 0.5},92%,50%)`;
}

/* ── Thermal Cursor ── */
function ThermalCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [heat, setHeat] = useState(0);
  const [trail, setTrail] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const speed = Math.min(100, Math.sqrt(dx * dx + dy * dy) * 2.5);
      lastPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      setHeat((h) => Math.min(100, h + speed * 0.3));
      setTrail((prev) => [...prev.slice(-16), { x: e.clientX, y: e.clientY, t: speed }]);
    };
    const cool = setInterval(() => setHeat((h) => Math.max(0, h - 1.4)), 30);
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); clearInterval(cool); };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {trail.map((p, i) => (
        <div key={i} style={{
          position: "fixed", left: p.x, top: p.y,
          width: 5 + i * 0.35, height: 5 + i * 0.35,
          borderRadius: "50%",
          background: heatColor(p.t),
          opacity: (i / trail.length) * 0.3,
          transform: "translate(-50%,-50%)",
          filter: "blur(3px)",
        }} />
      ))}
      <div style={{
        position: "fixed", left: pos.x, top: pos.y,
        width: 13, height: 13, borderRadius: "50%",
        background: heatColor(heat),
        transform: "translate(-50%,-50%)",
        boxShadow: `0 0 ${heat * 0.4}px ${heatColor(heat)}`,
        mixBlendMode: "multiply",
        transition: "background 0.08s, box-shadow 0.08s",
      }} />
    </div>
  );
}

/* ── Noise Texture (SVG) ── */
function NoiseTexture() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, opacity: "var(--bg-theme-light-noise-opacity)", mixBlendMode: "multiply" }}>
      <filter id="thermal-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#thermal-noise)" />
    </svg>
  );
}

/* ── HeatText — text that heats up on hover ── */
function HeatText({ children, style, as: Tag = "span", baseTemp = 0 }) {
  const [hot, setHot] = useState(false);
  const [temp, setTemp] = useState(baseTemp);

  useEffect(() => {
    if (hot) {
      const id = setInterval(() => setTemp((t) => Math.min(100, t + 8)), 28);
      return () => clearInterval(id);
    } else {
      const id = setInterval(() => setTemp((t) => Math.max(baseTemp, t - 4)), 38);
      return () => clearInterval(id);
    }
  }, [hot, baseTemp]);

  return (
    <Tag
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{ ...style, color: temp > 5 ? heatColor(temp) : "inherit", transition: "color 0.05s", cursor: "crosshair" }}
    >
      {children}
    </Tag>
  );
}

HeatText.propTypes = { children: PropTypes.node, style: PropTypes.object, as: PropTypes.string, baseTemp: PropTypes.number };

/* ── Thermal Bar ── */
function ThermalBar({ value, label, delay = 0 }) {
  const [go, setGo] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "monospace", fontSize: 10, color: "#888" }}>
        <span>{label}</span>
        <span style={{ color: heatColor(value) }}>{value}°</span>
      </div>
      <div style={{ height: 2, background: "#e0e0e0", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: go ? `${value}%` : 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
          style={{ height: "100%", background: heatColor(value) }}
        />
      </div>
    </div>
  );
}

ThermalBar.propTypes = { value: PropTypes.number, label: PropTypes.string, delay: PropTypes.number };

/* ── ScrambleText ── */
function ScrambleText({ text, active }) {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const [display, setDisplay] = useState(text);
  const frame = useRef(null);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const total = text.length * 3;
    const run = () => {
      setDisplay(
        text.split("").map((c, i) => {
          if (c === " ") return " ";
          if (i < iter / 3) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      iter++;
      if (iter < total) frame.current = requestAnimationFrame(run);
      else setDisplay(text);
    };
    frame.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame.current);
  }, [active, text]);

  return <span>{display}</span>;
}

ScrambleText.propTypes = { text: PropTypes.string, active: PropTypes.bool };

/* ── Project Row ── */
function ProjectRow({ p, index }) {
  const [hover, setHover] = useState(false);
  const [temp, setTemp] = useState(p.temp * 0.3);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (hover) {
      const id = setInterval(() => setTemp((t) => Math.min(p.temp, t + 5)), 25);
      return () => clearInterval(id);
    } else {
      const id = setInterval(() => setTemp((t) => Math.max(p.temp * 0.3, t - 3)), 35);
      return () => clearInterval(id);
    }
  }, [hover, p.temp]);

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid", gridTemplateColumns: "80px 1fr 180px 80px 48px", alignItems: "center",
        padding: "20px 0", borderBottom: "1px solid #e0e0e0", cursor: "crosshair", position: "relative",
      }}
    >
      <motion.div
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, background: `${heatColor(temp)}08`, transformOrigin: "left", zIndex: 0 }}
      />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#999", position: "relative", zIndex: 1 }}>{p.code}</span>
      <span style={{
        fontSize: "clamp(1.1rem,2vw,1.5rem)", fontWeight: 800, letterSpacing: "-0.04em",
        color: hover ? heatColor(temp) : "#0a0a0a", transition: "color 0.08s", position: "relative", zIndex: 1,
        fontFamily: "'Bebas Neue',sans-serif",
      }}>
        <ScrambleText text={p.title} active={hover} />
      </span>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div
          animate={{ width: hover ? 52 : 0, opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 34, overflow: "hidden", borderRadius: 4, flexShrink: 0 }}
        >
          {!imgErr ? (
            <img
              src={p.img} alt={p.title} onError={() => setImgErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.6) contrast(1.1)" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `${heatColor(p.temp)}33` }} />
          )}
        </motion.div>
        <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>{p.tag}</span>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa", position: "relative", zIndex: 1 }}>{p.year}</span>
      <div style={{ position: "relative", zIndex: 1, textAlign: "right" }}>
        <motion.span animate={{ color: hover ? heatColor(temp) : "#bbb" }} style={{ fontSize: 18 }}>↗</motion.span>
      </div>
    </motion.div>
  );
}

ProjectRow.propTypes = { p: PropTypes.object, index: PropTypes.number };

/* ── Service Card ── */
function ServiceCard({ s, index }) {
  const [hover, setHover] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ borderRight: "1px solid #0a0a0a", borderBottom: "1px solid #0a0a0a", position: "relative", overflow: "hidden", cursor: "crosshair" }}
    >
      <div style={{ height: 200, overflow: "hidden", position: "relative", borderBottom: "1px solid #e8e8e8" }}>
        {!imgErr ? (
          <motion.img
            src={s.img} alt={s.title} onError={() => setImgErr(true)}
            animate={{ scale: hover ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: hover ? "grayscale(0%) contrast(1.05) brightness(0.92)" : "grayscale(85%) contrast(1.1) brightness(0.95)",
              transition: "filter 0.5s",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 32, opacity: 0.2 }}>◈</span>
          </div>
        )}
        <motion.div
          animate={{ opacity: hover ? 0.18 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${heatColor(90)}, ${heatColor(40)})`, mixBlendMode: "color" }}
        />
        <div style={{
          position: "absolute", top: 12, left: 12, background: "rgba(245,242,238,0.9)",
          padding: "3px 10px", fontFamily: "monospace", fontSize: 10, color: "#888", letterSpacing: "0.18em",
        }}>
          {s.id}
        </div>
      </div>
      <motion.div
        animate={{ scaleY: hover ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, top: 200, background: "#0a0a0a", transformOrigin: "bottom", zIndex: 0 }}
      />
      <div style={{ padding: 28, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <motion.div
            animate={{ color: hover ? "rgba(245,242,238,0.45)" : "#aaa" }}
            style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace" }}
          >
            {s.sub}
          </motion.div>
          <motion.span animate={{ color: hover ? "#f5f2ee" : "#0a0a0a" }} style={{ fontSize: 15 }}>↗</motion.span>
        </div>
        <motion.h3
          animate={{ color: hover ? "#f5f2ee" : "#0a0a0a" }}
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", letterSpacing: "0.04em", marginBottom: 10, lineHeight: 1 }}
        >
          {s.title}
        </motion.h3>
        <motion.p
          animate={{ color: hover ? "rgba(245,242,238,0.6)" : "#555" }}
          style={{ fontSize: 13, lineHeight: 1.75 }}
        >
          {s.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

ServiceCard.propTypes = { s: PropTypes.object, index: PropTypes.number };

/* ── Hero Mockup Strip ── */
function HeroMockup() {
  const imgs = [
    { src: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80&fit=crop", rot: -8, top: "5%", left: "2%", z: 1 },
    { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80&fit=crop", rot: 3, top: "12%", left: "28%", z: 3 },
    { src: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&q=80&fit=crop", rot: 6, top: "0%", left: "56%", z: 2 },
  ];

  return (
    <div style={{ position: "relative", height: 320 }}>
      {imgs.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: img.rot }}
          animate={{ opacity: 1, y: 0, rotate: img.rot }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8, zIndex: 10, scale: 1.03 }}
          style={{
            position: "absolute", top: img.top, left: img.left, width: "32%", zIndex: img.z,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)", borderRadius: 4, overflow: "hidden",
            border: "1px solid #e0e0e0", cursor: "crosshair",
          }}
        >
          <img
            src={img.src} alt=""
            style={{ width: "100%", display: "block", filter: "grayscale(30%) contrast(1.05)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear", delay: i * 1.2 }}
            style={{
              position: "absolute", inset: "0 0 auto 0", height: 2,
              background: `linear-gradient(90deg, transparent, ${heatColor(60 + i * 15)}, transparent)`,
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE 7 — Thermal Editorial Design
   ═══════════════════════════════════════════════════════════ */
export default function Page7({ t }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page7-thermal bg-theme-editorial" style={{ color: "#0a0a0a", fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,900;1,400&display=swap');
        .page7-thermal *,
        .page7-thermal *::before,
        .page7-thermal *::after { box-sizing: border-box; }
        .page7-thermal { --ink: #0a0a0a; --paper: var(--bg-theme-light-core); --grid: var(--bg-theme-light-grid-opacity); }
        .page7-thermal::before {
          content: ''; position: fixed; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 31px, var(--grid) 31px, var(--grid) 32px);
          pointer-events: none; z-index: 0;
        }
        .page7-thermal .display { font-family: 'Bebas Neue', sans-serif; }
        .page7-thermal section { position: relative; z-index: 2; }
        .page7-thermal hr.rule { border: none; border-top: 1px solid #0a0a0a; }
        .page7-thermal .ticker-wrap {
          overflow: hidden; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink);
          position: relative; z-index: 2;
        }
        @keyframes page7ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .page7-thermal .ticker-inner {
          display: flex; animation: page7ticker 20s linear infinite; width: max-content;
        }
        .page7-thermal .ticker-item {
          padding: 10px 28px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          border-right: 1px solid var(--ink); white-space: nowrap;
        }
      `}</style>

      <NoiseTexture />

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{
          padding: "8px 36px", borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20,
        }}>
          <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.22em" }}>VOL. 01 — 2026</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px #22c55e22" }} />
            <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.16em" }}>AVAILABLE FOR WORK</span>
          </div>
          <span style={{ fontFamily: "IBM Plex Mono", fontSize: 9, color: "#888", letterSpacing: "0.08em", minWidth: "50px", textAlign: "right" }}>{time}</span>
        </div>

        <div style={{
          flex: 1, padding: "48px 40px 60px", display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        }}>
          {/* Left: headline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <div className="display" style={{ fontSize: "clamp(4.5rem,12vw,12rem)", lineHeight: 0.88, letterSpacing: "-0.01em" }}>
                <HeatText as="div" style={{ display: "block" }} baseTemp={0}>WE</HeatText>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.1em", flexWrap: "wrap" }}>
                  <HeatText as="span" baseTemp={0}>BUILD</HeatText>
                  <span style={{
                    fontFamily: "Playfair Display,Georgia,serif", fontStyle: "italic", fontWeight: 400,
                    fontSize: "0.38em", color: "#888", letterSpacing: "0.01em", paddingBottom: "0.2em",
                  }}>
                    digital products
                  </span>
                </div>
                <HeatText as="div" style={{ display: "block" }} baseTemp={0}>THAT</HeatText>
                <HeatText as="div" style={{ display: "block" }} baseTemp={0}>LAST.</HeatText>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} style={{ marginTop: 32 }}>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.85, maxWidth: 400, marginBottom: 28 }}>
                Mobile app, game production ve teknik destek üzerine odaklanan bir ürün stüdyosu. Konseptten lansmanına kadar yanınızdayız.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  whileHover={{ background: "#222" }}
                  style={{
                    background: "var(--ink)", color: "var(--paper)", border: "none",
                    padding: "13px 24px", fontFamily: "IBM Plex Mono", fontSize: 11,
                    letterSpacing: "0.14em", textTransform: "uppercase", transition: "background 0.2s",
                  }}
                >
                  Start a project
                </motion.button>
                <motion.button
                  whileHover={{ borderColor: "#0a0a0a", color: "#0a0a0a" }}
                  style={{
                    background: "transparent", color: "#888", border: "1px solid #ddd",
                    padding: "13px 24px", fontFamily: "IBM Plex Mono", fontSize: 11,
                    letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s",
                  }}
                >
                  See work ↓
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16,
                marginTop: 40, paddingTop: 32, borderTop: "1px solid #e0e0e0",
              }}
            >
              {STATS.map(([v, l]) => (
                <div key={l}>
                  <HeatText
                    as="div"
                    style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 26, letterSpacing: "0.04em", lineHeight: 1 }}
                    baseTemp={15}
                  >
                    {v}
                  </HeatText>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroMockup />
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e0e0e0" }}>
              <ThermalBar value={88} label="Mobile delivery" delay={0.8} />
              <ThermalBar value={74} label="Game systems" delay={0.95} />
              <ThermalBar value={92} label="Client satisfaction" delay={1.1} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {TICKER.map((item, i) => (
            <div key={i} className="ticker-item">
              <HeatText baseTemp={0}>{item}</HeatText>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.26em", color: "#888", textTransform: "uppercase" }}>§ 01 — Services</span>
          <hr className="rule" style={{ flex: 1, margin: "0 24px" }} />
          <span style={{ fontSize: 10, color: "#aaa", fontFamily: "IBM Plex Mono" }}>3 lines</span>
        </div>
        <div className="display" style={{ fontSize: "clamp(2.5rem,6vw,6rem)", letterSpacing: "-0.01em", lineHeight: 0.9, marginBottom: 48 }}>
          <HeatText baseTemp={0}>WHAT WE DO.</HeatText>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid var(--ink)", borderLeft: "1px solid var(--ink)" }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.id} s={s} index={i} />)}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{
        padding: "80px 40px", background: "var(--ink)", color: "var(--paper)",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.26em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>§ 02 — Process</span>
          <hr style={{ flex: 1, margin: "0 24px", border: "none", borderTop: "1px solid rgba(255,255,255,0.12)" }} />
        </div>
        <div className="display" style={{ fontSize: "clamp(2.5rem,6vw,6rem)", letterSpacing: "-0.01em", lineHeight: 0.9, marginBottom: 48 }}>
          HOW WE WORK.
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
          borderTop: "1px solid rgba(255,255,255,0.12)", borderLeft: "1px solid rgba(255,255,255,0.12)",
        }}>
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                borderRight: "1px solid rgba(255,255,255,0.12)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                padding: 28,
              }}
            >
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 18, letterSpacing: "0.2em" }}>{p.n}</div>
              <div className="display" style={{ fontSize: "clamp(1.4rem,2.2vw,2rem)", marginBottom: 10, letterSpacing: "0.04em" }}>
                <HeatText baseTemp={10}>{p.title}</HeatText>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 20 }}>{p.desc}</p>
              <ThermalBar value={p.bar} label={["Research", "System", "Code", "Ship"][i]} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section style={{ padding: "80px 40px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.26em", color: "#888", textTransform: "uppercase" }}>§ 03 — Work</span>
          <hr className="rule" style={{ flex: 1, margin: "0 24px" }} />
          <span style={{ fontSize: 10, color: "#aaa" }}>Selected projects</span>
        </div>
        <div className="display" style={{ fontSize: "clamp(2.5rem,6vw,6rem)", letterSpacing: "-0.01em", lineHeight: 0.9, marginBottom: 48 }}>
          <HeatText baseTemp={0}>LAUNCHED.</HeatText>
        </div>
        <div style={{ borderTop: "1px solid var(--ink)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 180px 80px 48px", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
            {["Code", "Title", "Type", "Year", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.22em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {PROJECTS.map((p, i) => <ProjectRow key={p.code} p={p} index={i} />)}
        </div>
      </section>

     

     
    </div>
  );
}

Page7.propTypes = { t: PropTypes.object.isRequired };
