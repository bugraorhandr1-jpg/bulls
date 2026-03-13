import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lanyard from "./deneme";

/* ─── brand ─── */
const C = { red: "#e8220a", gold: "#f5a800", bg: "#060402", text: "#ede8dc" };

function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target) - new Date());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function ShaderBG() {
  const ref = useRef();
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const tgt = useRef({ x: 0.5, y: 0.5 });
  const fr = useRef();
  const F = `precision highp float;uniform float T;uniform vec2 R,M;
    vec3 h3(vec2 p){vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)));return fract(sin(q)*43758.5);}
    float ns(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=dot(h3(i).xy,f),b=dot(h3(i+vec2(1,0)).xy,f-vec2(1,0)),c=dot(h3(i+vec2(0,1)).xy,f-vec2(0,1)),d=dot(h3(i+vec2(1,1)).xy,f-vec2(1,1));return mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*.5+.5;}
    float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*ns(p);p=r*p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/R,st=uv*vec2(R.x/R.y,1.),m=M*vec2(R.x/R.y,1.);float t=T*.12;
    vec2 q=vec2(fbm(st+t*.5),fbm(st+vec2(5.2,1.3)+t*.4)),r2=vec2(fbm(st+2.*q+t*.3),fbm(st+2.*q+vec2(8.3,2.8)+t*.28));
    float f=(fbm(st+2.5*r2+t*.2)+fbm(st+r2+t))*.5;float md=length(st-m);f+=.08*exp(-md*md*3.)*sin(md*14.-t*5.);
    vec3 c=mix(vec3(.016,.007,.001),vec3(.45,.04,.007),smoothstep(.1,.44,f));
    c=mix(c,vec3(.7,.28,.01),smoothstep(.42,.64,f));c=mix(c,vec3(.9,.62,.05),smoothstep(.62,.82,f));
    vec2 vg=uv*(1.-uv.yx);c*=pow(vg.x*vg.y*15.,.3)*.6+.4;c*=.38;gl_FragColor=vec4(c,1.);}`;
  const V = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
  useEffect(() => {
    const cv = ref.current;
    const gl = cv.getContext("webgl");
    if (!gl) return;
    const mk = (t, s) => {
      const x = gl.createShader(t);
      gl.shaderSource(x, s);
      gl.compileShader(x);
      return x;
    };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, V));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, F));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const bf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const al = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(al);
    gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(pr, "T");
    const uR = gl.getUniformLocation(pr, "R");
    const uM = gl.getUniformLocation(pr, "M");
    const resize = () => {
      cv.width = innerWidth;
      cv.height = innerHeight;
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    addEventListener("resize", resize);
    addEventListener(
      "mousemove",
      (e) => {
        tgt.current = { x: e.clientX / innerWidth, y: 1 - e.clientY / innerHeight };
      },
      { passive: true }
    );
    let st = null;
    const draw = (ts) => {
      if (!st) st = ts;
      mouse.current.x += (tgt.current.x - mouse.current.x) * 0.04;
      mouse.current.y += (tgt.current.y - mouse.current.y) * 0.04;
      gl.uniform1f(uT, (ts - st) * 0.001);
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform2f(uM, mouse.current.x, mouse.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      fr.current = requestAnimationFrame(draw);
    };
    fr.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(fr.current);
      removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

function Cursor() {
  const [p, setP] = useState({ x: -300, y: -300 });
  const [h, setH] = useState(false);
  useEffect(() => {
    const m = (e) => {
      setP({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setH(!!el?.closest("button,a,input,canvas"));
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      <motion.div
        animate={{ x: p.x, y: p.y, scale: h ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 900, damping: 42, mass: 0.08 }}
        style={{
          position: "fixed",
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: h ? "#f5a800" : "#e8220a",
          boxShadow: `0 0 12px ${h ? "#f5a800" : "#e8220a"}99`,
        }}
      />
      <motion.div
        animate={{ x: p.x, y: p.y, width: h ? 44 : 20, height: h ? 44 : 20 }}
        transition={{ type: "spring", stiffness: 90, damping: 22 }}
        style={{
          position: "fixed",
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: `1.5px solid ${h ? "rgba(245,168,0,.6)" : "rgba(232,34,10,.45)"}`,
        }}
      />
    </div>
  );
}

export default function ComingSoon() {
  const cd = useCountdown("2026-09-01T00:00:00");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html,body{width:100%;height:100%;overflow:hidden;background:#060402}
      *{cursor:none!important}
      ::selection{background:#e8220a;color:#fff}
      body::after{content:'';position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.04;
        background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size:200px}
      input:focus{outline:none}
      input::placeholder{color:rgba(237,232,220,0.22)}
    `}</style>

      <ShaderBG />
      <Cursor />

      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          fontFamily: "'IBM Plex Mono',monospace",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 52px 0 60px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "20px 60px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  background: "linear-gradient(135deg,#e8220a,#f5a800)",
                  clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#fff" }}>B</span>
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
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a800" }}
              />
              <span style={{ fontSize: 8, color: "rgba(237,232,220,.35)", letterSpacing: "0.22em" }}>
                YAKINDA GELİYOR
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontSize: 13, color: "rgba(237,232,220,.4)", lineHeight: 1.7, marginBottom: 6 }}>
              Çok yakında online olacaksınız.
            </p>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(3rem,5.5vw,5.5rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.01em",
                marginBottom: 20,
              }}
            >
              <div style={{ color: "#ede8dc" }}>YENİ BİR</div>
              <div style={{ WebkitTextStroke: "1.5px rgba(255,255,255,.12)", color: "transparent" }}>
                DİJİTAL
              </div>
              <div
                style={{
                  background: "linear-gradient(110deg,#e8220a 30%,#f5a800 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                DENEYIM.
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(237,232,220,.38)", lineHeight: 1.9, maxWidth: 340, marginBottom: 28 }}>
              Tüm detaylar hazır olduğunda sizi e-posta ile bilgilendireceğiz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}
          >
            <span style={{ fontSize: 9, color: "rgba(237,232,220,.35)", letterSpacing: "0.2em" }}>PAYLAŞ</span>
            {["𝕏", "in"].map((icon) => (
              <motion.button
                key={icon}
                whileHover={{ scale: 1.15, color: "#f5a800" }}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)",
                  color: "rgba(237,232,220,.55)",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  cursor: "none",
                  transition: "color .2s,border-color .2s",
                }}
              >
                {icon}
              </motion.button>
            ))}
          </motion.div>

          <div style={{ borderTop: "1px dashed rgba(255,255,255,.08)", marginBottom: 18 }} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ display: "flex", gap: 0, marginBottom: 24, border: "1px solid rgba(255,255,255,.07)" }}
          >
            {[
              { v: cd.d, l: "GÜN" },
              { v: cd.h, l: "SAAT" },
              { v: cd.m, l: "DAK" },
              { v: cd.s, l: "SAN" },
            ].map(({ v, l }, i) => (
              <div
                key={l}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,.07)" : "none",
                }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={v}
                    initial={{ y: -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 14, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: "clamp(1.6rem,2.5vw,2.4rem)",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                      background: "linear-gradient(135deg,#ede8dc,#f5a800)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {String(v).padStart(2, "0")}
                  </motion.div>
                </AnimatePresence>
                <div style={{ fontSize: 7, color: "rgba(237,232,220,.28)", letterSpacing: "0.22em", marginTop: 3 }}>
                  {l}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="f"
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSent(true);
                  }}
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@adresiniz.com"
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.09)",
                      borderRight: "none",
                      color: "#ede8dc",
                      padding: "11px 14px",
                      fontFamily: "'IBM Plex Mono',monospace",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ background: "#ff3d1f", boxShadow: "0 0 32px rgba(232,34,10,.5)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "#e8220a",
                      color: "#fff",
                      border: "none",
                      padding: "11px 18px",
                      fontFamily: "'IBM Plex Mono',monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "none",
                      transition: "all .2s",
                    }}
                  >
                    BİLDİR →
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="s"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 14px",
                    border: "1px solid rgba(34,197,94,.3)",
                    background: "rgba(34,197,94,.06)",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(34,197,94,.85)", letterSpacing: "0.1em" }}>
                    Hazır olunca haber vereceğiz!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <p style={{ fontSize: 8, color: "rgba(237,232,220,.18)", letterSpacing: "0.14em" }}>
              Spam yok. İstediğiniz zaman çıkabilirsiniz.
            </p>
          </motion.div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "14px 60px",
              borderTop: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 8, color: "rgba(237,232,220,.2)", letterSpacing: "0.18em" }}>
              © 2026 BULLS DIGITAL HOUSE
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Instagram", "LinkedIn", "Contact"].map((n) => (
                <motion.a
                  key={n}
                  href="#"
                  whileHover={{ color: "#f5a800" }}
                  style={{
                    fontSize: 8,
                    color: "rgba(237,232,220,.22)",
                    textDecoration: "none",
                    letterSpacing: "0.14em",
                    transition: "color .2s",
                  }}
                >
                  {n}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, borderLeft: "1px solid rgba(255,255,255,.05)", overflow: "hidden" }}>
          <Lanyard />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 9,
              color: "rgba(237,232,220,.28)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            SÜRÜKLE · ÇEVIR İÇİN TIKLA
          </motion.p>
        </div>
      </div>
    </>
  );
}
