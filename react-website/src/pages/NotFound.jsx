// NotFound.jsx  ─── Bulls Digital House — Flashlight 404
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PHOTOS = [
  { url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80", credit: "Istanbul by night" },
  { url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1600&q=80", credit: "Bosphorus Bridge" },
  { url: "https://images.unsplash.com/photo-1562619424-f2d9b695e614?w=1600&q=80", credit: "Galata Tower" },
];

export default function NotFound() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [photoIdx] = useState(() => Math.floor(Math.random() * PHOTOS.length));
  const [entered, setEntered] = useState(false);
  const [radius, setRadius] = useState(160);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
      if (!entered) setEntered(true);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [entered]);

  useEffect(() => {
    const onWheel = (e) => {
      setRadius((r) => Math.min(320, Math.max(80, r - e.deltaY * 0.3)));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const photo = PHOTOS[photoIdx];
  const mask = entered
    ? `radial-gradient(circle ${radius}px at ${mouse.x}px ${mouse.y}px,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) ${radius * 0.55}px,
        rgba(0,0,0,0.55) ${radius * 0.8}px,
        rgba(0,0,0,0.97) ${radius}px,
        rgba(0,0,0,0.97) 100%
      )`
    : "rgba(0,0,0,0.97)";

  return (
    <div
      ref={containerRef}
      className="notfound-page"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'IBM Plex Mono', monospace",
        background: "#060402",
        cursor: "none",
        marginTop: "-82px",
      }}
    >
      {/* Custom cursor — flashlight torch */}
      <motion.div
        style={{
          position: "absolute",
          zIndex: 9999,
          pointerEvents: "none",
          left: mouse.x,
          top: mouse.y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: radius * 2,
            height: radius * 2,
            opacity: entered ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(245,168,0,0.12)",
            position: "absolute",
            translateX: "-50%",
            translateY: "-50%",
            left: "50%",
            top: "50%",
          }}
        />
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#f5a800",
            boxShadow: "0 0 12px 4px rgba(245,168,0,0.6)",
            position: "absolute",
            translateX: "-50%",
            translateY: "-50%",
            left: "50%",
            top: "50%",
          }}
        />
      </motion.div>

      {/* Background photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${photo.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(0.3) contrast(1.1)",
        }}
      />

      {/* Darkness overlay — the "flashlight" mask */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: mask,
          transition: "background 0.02s linear",
          zIndex: 2,
        }}
      />

      {/* Noise grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* UI layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "32px 52px",
        }}
      >
        {/* Top — logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg,#e8220a,#f5a800)",
              clipPath:
                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 13,
                color: "#fff",
              }}
            >
              B
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 15,
              letterSpacing: "0.1em",
              color: "#ede8dc",
            }}
          >
            BULLS DIGITAL HOUSE
          </span>
        </motion.div>

        {/* Center — 404 text */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(8rem,22vw,22rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1px rgba(245,168,0,0.35)",
              userSelect: "none",
              pointerEvents: "none",
              marginBottom: 24,
            }}
          >
            404
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
          >
            <p
              style={{
                fontSize: 11,
                color: "rgba(237,232,220,0.5)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Kaybolmuş görünüyorsunuz.
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(237,232,220,0.28)",
                letterSpacing: "0.16em",
                marginBottom: 40,
              }}
            >
              Aradığınız sayfa bulunamadı.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <motion.a
                href="/"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 50px rgba(232,34,10,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#e8220a",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "13px 26px",
                  fontFamily: "'Inter', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  boxShadow: "0 0 36px rgba(232,34,10,0.3)",
                  transition: "all 0.2s",
                  cursor: "none",
                }}
              >
                ANA SAYFAYA DÖN ↗
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{
                  borderColor: "rgba(245,168,0,0.5)",
                  color: "#f5a800",
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(237,232,220,0.45)",
                  textDecoration: "none",
                  padding: "13px 26px",
                  fontFamily: "'Inter', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                  cursor: "none",
                }}
              >
                İLETİŞİM
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom — photo credit + hint */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              fontSize: 9,
              color: "rgba(237,232,220,0.25)",
              letterSpacing: "0.18em",
            }}
          >
            📷 {photo.credit} — Unsplash
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 0 : 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ textAlign: "right" }}
          >
            <p
              style={{
                fontSize: 9,
                color: "rgba(237,232,220,0.35)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ↑ Fareyi hareket ettirerek ışığı yak
            </p>
            <p
              style={{
                fontSize: 8,
                color: "rgba(237,232,220,0.2)",
                letterSpacing: "0.16em",
                marginTop: 4,
              }}
            >
              Scroll ile ışık boyutunu ayarla
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
