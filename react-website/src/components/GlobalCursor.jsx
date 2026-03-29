import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const HOVER_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "canvas",
  "[role='button']",
  "[data-cursor-hover]",
].join(",");

const TEXT_SELECTOR = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "span"].join(",");

export default function GlobalCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("idle");
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);
  const idRef = useRef(0);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const coreX = useSpring(x, { stiffness: 900, damping: 44, mass: 0.08 });
  const coreY = useSpring(y, { stiffness: 900, damping: 44, mass: 0.08 });
  const ringX = useSpring(x, { stiffness: 160, damping: 26, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 160, damping: 26, mass: 0.35 });

  const ringSize = useMemo(() => {
    if (pressed) return 18;
    if (mode === "hover") return 54;
    if (mode === "text") return 20;
    return 24;
  }, [mode, pressed]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateEnabled = () => {
      setEnabled(media.matches);
    };

    updateEnabled();
    media.addEventListener("change", updateEnabled);

    return () => {
      media.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      setTrail([]);
      setRipples([]);
      return;
    }

    const onMove = (event) => {
      const cx = event.clientX;
      const cy = event.clientY;
      x.set(cx);
      y.set(cy);
      const target = document.elementFromPoint(cx, cy);
      
      // Skip header area
      if (target?.closest("header")) {
        setMode("idle");
        return;
      }
      
      if (target?.closest(HOVER_SELECTOR)) {
        setMode("hover");
      } else if (target?.closest(TEXT_SELECTOR)) {
        setMode("text");
      } else {
        setMode("idle");
      }
      const tid = ++idRef.current;
      setTrail((prev) => [...prev.slice(-6), { id: tid, x: cx, y: cy }]);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onClick = (event) => {
      // Skip ripple if clicking header
      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (target?.closest("header")) return;
      
      const rid = ++idRef.current;
      setRipples((prev) => [...prev.slice(-4), { id: rid, x: event.clientX, y: event.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rid));
      }, 520);
    };

    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  // Exclude header region (header height ~64px)
  const clipPath = "inset(64px 0 0 0)";

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2147483647, clipPath }}>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.65, scale: 1 }}
          animate={{ opacity: 0, scale: 0.1 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: point.x,
            top: point.y,
            width: 3 + index * 0.5,
            height: 3 + index * 0.5,
            borderRadius: "50%",
            translateX: "-50%",
            translateY: "-50%",
            background: index % 2 === 0 ? "#e8220a" : "#f5a800",
            filter: "blur(1px)",
          }}
        />
      ))}

      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 84, height: 84, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            left: ripple.x,
            top: ripple.y,
            translateX: "-50%",
            translateY: "-50%",
            border: "1.5px solid rgba(245,168,0,0.72)",
            borderRadius: "50%",
          }}
        />
      ))}

      <motion.div
        animate={{ x: ringX, y: ringY, width: ringSize, height: ringSize, rotate: mode === "hover" ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        style={{
          position: "fixed",
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: mode === "hover" ? "36%" : mode === "text" ? "2px" : "50%",
          border:
            mode === "hover"
              ? "1.5px solid rgba(245,168,0,0.72)"
              : mode === "text"
                ? "1.5px solid rgba(245,168,0,0.42)"
                : "1.5px solid rgba(232,34,10,0.52)",
          background: mode === "hover" ? "rgba(245,168,0,0.07)" : "transparent",
          boxShadow:
            mode === "hover"
              ? "0 0 26px rgba(245,168,0,0.26)"
              : mode === "text"
                ? "0 0 14px rgba(245,168,0,0.18)"
                : "0 0 18px rgba(232,34,10,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {mode === "hover" && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ fontSize: 11, color: "#f5a800", fontFamily: "monospace" }}
            >
              ↗
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        animate={{
          x: coreX,
          y: coreY,
          width: mode === "text" ? 16 : mode === "hover" ? 5 : pressed ? 6 : 8,
          height: mode === "text" ? 3 : mode === "hover" ? 5 : pressed ? 6 : 8,
          backgroundColor: mode === "hover" ? "#f5a800" : "#e8220a",
          scale: pressed ? 0.88 : 1,
          boxShadow: mode === "hover" ? "0 0 16px rgba(245,168,0,0.8)" : "0 0 14px rgba(232,34,10,0.72)",
        }}
        transition={{ type: "spring", stiffness: 480, damping: 26 }}
        style={{
          position: "fixed",
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: mode === "text" ? "1px" : "50%",
        }}
      />
    </div>
  );
}
