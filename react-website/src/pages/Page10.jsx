import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── PALETTE ── */
const C = {
  bg: "#080604", ink: "#0d0a06", card: "#111008",
  b1: "#1a1510", b2: "#221c12",
  red: "#e8220a", redHot: "#ff4422", redDeep: "#6b0e03",
  gold: "#f5a800", goldHot: "#ffd060", goldDeep: "#6b4800",
  white: "#f0ebe0", muted: "rgba(240,235,224,0.38)", faint: "rgba(240,235,224,0.08)",
};

/* ── DATA ── */
const WORKS = [
  { id:"01", title:"PULSE", sub:"Commerce", year:"2024", tag:"Mobile App",
    img:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1200&q=90&fit=crop&crop=center" },
  { id:"02", title:"MOVI", sub:"Transit", year:"2024", tag:"Navigation",
    img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=90&fit=crop&crop=center" },
  { id:"03", title:"KORE", sub:"Finance", year:"2025", tag:"Fintech",
    img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=90&fit=crop&crop=center" },
  { id:"04", title:"ORBIT", sub:"Dashboard", year:"2025", tag:"SaaS",
    img:"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=90&fit=crop&crop=center" },
];

const CAPS = ["React Native","iOS","Android","UI/UX","ASO","Firebase","Figma","Redux","Performance","Strategy"];
const NUMBERS = [["18+","Apps launched"],["4.9★","App Store avg."],["24/7","Live support"],["3yr","Track record"]];

/* ── MAGNETIC CURSOR ── */
function P10Cursor() {
  const cx = useMotionValue(-100), cy = useMotionValue(-100);
  const sx = useSpring(cx,{stiffness:180,damping:18,mass:0.3});
  const sy = useSpring(cy,{stiffness:180,damping:18,mass:0.3});
  const [size, setSize] = useState(14);
  const [label, setLabel] = useState("");
  const [blend, setBlend] = useState("normal");

  useEffect(()=>{
    const mv = e => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener("mousemove", mv);

    const enter = e => {
      const lbl = e.currentTarget.dataset.p10cursor || "";
      setLabel(lbl); setSize(lbl ? 72 : 44); setBlend("difference");
    };
    const leave = () => { setLabel(""); setSize(14); setBlend("normal"); };

    const els = document.querySelectorAll("[data-p10cursor]");
    els.forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      window.removeEventListener("mousemove", mv);
      els.forEach(el => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  },[]);

  return (
    <motion.div
      style={{ x: sx, y: sy, position:"fixed", zIndex:9999, pointerEvents:"none",
        translateX:"-50%", translateY:"-50%",
        width: size, height: size,
        borderRadius: "50%",
        border: `1px solid ${C.gold}`,
        background: size > 20 ? `${C.gold}22` : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        mixBlendMode: blend,
      }}
      animate={{ width: size, height: size }}
      transition={{ type:"spring", stiffness:280, damping:22 }}
    >
      {label && <span style={{ fontSize:10, color:C.gold, letterSpacing:"0.14em", fontFamily:"monospace", whiteSpace:"nowrap" }}>{label}</span>}
    </motion.div>
  );
}

/* ── SPLIT TEXT REVEAL ── */
function SplitReveal({ text, delay=0, style={} }) {
  const words = text.split(" ");
  return (
    <span style={{ display:"inline-flex", flexWrap:"wrap", gap:"0.22em", ...style }}>
      {words.map((w,i) => (
        <span key={i} style={{ overflow:"hidden", display:"inline-block" }}>
          <motion.span
            initial={{ y:"110%", opacity:0 }}
            whileInView={{ y:0, opacity:1 }}
            viewport={{ once:true, amount:0.8 }}
            transition={{ duration:0.85, delay: delay + i*0.08, ease:[0.16,1,0.3,1] }}
            style={{ display:"inline-block" }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── GRAIN ── */
function P10Grain() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1,opacity:0.07}}>
      <filter id="p10gr">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#p10gr)" opacity="1"/>
    </svg>
  );
}

/* ── WORK CARD ── */
function WorkCard({ w, idx }) {
  const [hov, setHov] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <motion.div
      data-p10cursor="VIEW"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      initial={{ opacity:0, y:60 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.2 }}
      transition={{ duration:0.9, delay:idx*0.12, ease:[0.16,1,0.3,1] }}
      style={{ position:"relative", overflow:"hidden", borderRadius:0,
        border:`1px solid ${C.b2}`,
        background:C.card, height:320 }}
    >
      <motion.div
        animate={{ opacity: hov?1:0, scale: hov?1:1.06 }}
        transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0 }}
      >
        {!err
          ? <img src={w.img} alt={w.title} onError={()=>setErr(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover",
                filter:"brightness(0.45) saturate(0.5) contrast(1.15)" }}/>
          : <div style={{ width:"100%", height:"100%",
              background:`linear-gradient(135deg,${C.redDeep},${C.goldDeep})` }}/>
        }
        <div style={{ position:"absolute", inset:0,
          background:`linear-gradient(135deg, ${C.red}44 0%, transparent 50%, ${C.gold}22 100%)` }}/>
      </motion.div>

      <motion.div
        animate={{ y: hov ? ["0%","110%"] : "-20%" }}
        transition={{ repeat: hov ? Infinity:0, duration:1.6, ease:"linear" }}
        style={{ position:"absolute", left:0, right:0, height:2, zIndex:3,
          background:`linear-gradient(90deg,transparent,${C.gold},${C.red},transparent)`,
          filter:"blur(1px)", opacity:0.8 }}
      />

      <div style={{ position:"absolute", inset:0, zIndex:2, padding:28,
        display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <span style={{ fontFamily:"monospace", fontSize:10, color:C.muted, letterSpacing:"0.2em" }}>{w.year}</span>
          <motion.div
            animate={{ background: hov ? C.red : C.b2, borderColor: hov ? C.red : C.b2 }}
            style={{ padding:"4px 10px", border:"1px solid", borderRadius:2,
              fontSize:9, color:C.white, letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"monospace" }}>
            {w.tag}
          </motion.div>
        </div>
        <div>
          <motion.div
            animate={{ y: hov ? 0 : 8, opacity: hov ? 1:0.6 }}
            transition={{ duration:0.5 }}
            style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11,
              color:C.gold, letterSpacing:"0.24em", textTransform:"uppercase", marginBottom:8 }}>
            {w.sub}
          </motion.div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(2.8rem,5vw,4.2rem)", letterSpacing:"0.04em",
            lineHeight:0.88, color: hov?C.white:C.muted,
            transition:"color 0.3s" }}>
            {w.title}
          </div>
          <motion.div
            animate={{ scaleX: hov?1:0, opacity: hov?1:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            style={{ height:1, background:`linear-gradient(90deg,${C.red},${C.gold})`,
              transformOrigin:"left", marginTop:14 }}/>
        </div>
      </div>
    </motion.div>
  );
}

/* ── FLOATING FRAMES ── */
function FloatingFrames() {
  const frames = [
    { src:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=85&fit=crop",
      style:{ top:"4%", left:"8%", width:"52%", zIndex:2 }, rot:-4, delay:0 },
    { src:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=85&fit=crop",
      style:{ top:"30%", right:"2%", width:"48%", zIndex:3 }, rot:5, delay:0.18 },
    { src:"https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&q=85&fit=crop",
      style:{ bottom:"2%", left:"14%", width:"42%", zIndex:4 }, rot:2, delay:0.32 },
  ];

  return (
    <div style={{ position:"relative", height:520, width:"100%" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 50%, ${C.red}20 0%, ${C.gold}10 40%, transparent 70%)`,
        filter:"blur(30px)" }}/>

      {frames.map((f,i) => (
        <motion.div key={i}
          data-p10cursor="VIEW"
          initial={{ opacity:0, y:60, rotate:f.rot }}
          animate={{ opacity:1, y:0, rotate:f.rot }}
          transition={{ duration:1.1, delay:f.delay+0.3, ease:[0.16,1,0.3,1] }}
          whileHover={{ y:-14, scale:1.03, zIndex:10, rotate:0 }}
          style={{ ...f.style, position:"absolute",
            boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.b2}`,
            overflow:"hidden" }}
        >
          <img src={f.src} alt="" style={{
            width:"100%", display:"block",
            filter:"grayscale(40%) contrast(1.1) brightness(0.8) saturate(0.75)" }}
            onError={e=>{ e.target.parentElement.style.display="none"; }}/>

          <div style={{ position:"absolute", top:0, left:0, width:2, bottom:0,
            background:`linear-gradient(180deg,${C.red},${C.gold})`, opacity:0.8 }}/>

          <motion.div
            animate={{ y:["-100%","220%"] }}
            transition={{ repeat:Infinity, duration:3+i*0.8, ease:"linear", delay:i*1.2 }}
            style={{ position:"absolute", inset:"0 0 auto 0", height:1,
              background:`linear-gradient(90deg,transparent,${C.goldHot},transparent)`,
              filter:"blur(0.5px)" }}/>

          {[{top:8,left:8},{top:8,right:8},{bottom:8,left:8},{bottom:8,right:8}].map((pos,j)=>(
            <div key={j} style={{ position:"absolute", ...pos, width:4, height:4,
              borderRadius:"50%", background:C.gold, opacity:0.7 }}/>
          ))}

          <div style={{ position:"absolute", bottom:8, right:8,
            background:"rgba(8,6,4,0.8)", border:`1px solid ${C.b2}`,
            padding:"2px 8px", fontFamily:"monospace", fontSize:8, color:C.muted, letterSpacing:"0.16em" }}>
            BDH·00{i+1}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── HORIZONTAL MARQUEE ── */
function Marquee({ items, speed=28, reverse=false }) {
  const doubled = [...items,...items,...items];
  return (
    <div style={{ overflow:"hidden", position:"relative" }}>
      <motion.div
        animate={{ x: reverse ? ["-33.33%","0%"] : ["0%","-33.33%"] }}
        transition={{ repeat:Infinity, duration:speed, ease:"linear" }}
        style={{ display:"flex", gap:0, width:"max-content" }}
      >
        {doubled.map((item,i)=>(
          <div key={i} style={{
            padding:"14px 32px", borderRight:`1px solid ${C.b2}`,
            fontFamily:"'IBM Plex Mono',monospace",
            fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase",
            color:C.muted, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:12
          }}>
            <span style={{ width:4, height:4, borderRadius:"50%",
              background: i%3===0?C.red:i%3===1?C.gold:"#333",
              flexShrink:0, display:"inline-block" }}/>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── BIG NUMBER ── */
function BigNum({ val, label, delay=0 }) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const num = parseInt(val) || 0;

  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !done){
        setDone(true);
        let st=null;
        const step = ts => {
          if(!st) st=ts;
          const p = Math.min((ts-st)/1600,1);
          const ease = 1-Math.pow(1-p,4);
          setN(Math.floor(ease*num));
          if(p<1) requestAnimationFrame(step); else setN(num);
        };
        requestAnimationFrame(step);
      }
    },{threshold:0.5});
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[num,done]);

  const display = (isNaN(num)||val.includes("★")||val.includes("yr")) ? val
    : n+(val.includes("+")?"+":" ");

  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
      viewport={{once:true}} transition={{duration:0.7,delay,ease:[0.16,1,0.3,1]}}
      style={{ textAlign:"center" }}>
      <div style={{
        fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,6vw,5.5rem)",
        letterSpacing:"0.02em", lineHeight:0.9,
        background:`linear-gradient(135deg,${C.white},${C.gold})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
      }}>{display}</div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
        color:C.muted, letterSpacing:"0.22em", textTransform:"uppercase", marginTop:8 }}>{label}</div>
    </motion.div>
  );
}

/* ─────────────── PAGE 10 ─────────────── */
export default function Page10() {
  const [time, setTime] = useState("");

  useEffect(()=>{
    const t = ()=>setTime(new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    t(); const id=setInterval(t,1000); return()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  },[]);

  return (
    <div className="page10-mobile" style={{ background:C.bg, color:C.white, fontFamily:"'IBM Plex Mono',monospace", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .page10-mobile .D{font-family:'Bebas Neue',sans-serif}
        .page10-mobile .I{font-family:'Playfair Display',Georgia,serif;font-style:italic}
        .page10-mobile section{position:relative;z-index:2}
        .page10-mobile *{cursor:none!important}
        .page10-mobile ::selection{background:${C.red};color:#fff}
      `}</style>

      <P10Cursor/>
      <P10Grain/>

      {/* ═══ HERO ═══ */}
      <section style={{minHeight:"100vh",paddingTop:100,display:"flex",flexDirection:"column"}}>
        {/* eyebrow */}
        <div style={{
          padding:"10px 44px",borderBottom:`1px solid ${C.b1}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }}>
          <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
            style={{fontSize:9,color:C.muted,letterSpacing:"0.26em"}}>
            BULLS DIGITAL HOUSE — EST. 2023 — ISTANBUL
          </motion.span>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
            style={{display:"flex",gap:8,alignItems:"center"}}>
            <motion.div animate={{scale:[1,1.4,1],opacity:[1,0.5,1]}} transition={{repeat:Infinity,duration:2}}
              style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>
            <span style={{fontSize:9,color:C.muted,letterSpacing:"0.2em"}}>OPEN FOR NEW PROJECTS</span>
          </motion.div>
        </div>

        <div style={{
          flex:1,padding:"52px 44px 60px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"center"
        }}>
          {/* ── LEFT ── */}
          <div>
            <div className="D" style={{
              fontSize:"clamp(5rem,12vw,11.5rem)",
              lineHeight:0.85,letterSpacing:"-0.01em",
              marginBottom:32,
            }}>
              <div style={{overflow:"hidden",marginBottom:"0.04em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.1,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>WE</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden",marginBottom:"0.04em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.2,ease:[0.16,1,0.3,1]}}>
                  <span style={{
                    background:`linear-gradient(110deg,${C.red} 30%,${C.gold} 80%)`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}>BUILD</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden",marginBottom:"0.04em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.3,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>MOBILE</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.4,ease:[0.16,1,0.3,1]}}>
                  <span style={{WebkitTextStroke:`1px ${C.b2}`,color:"transparent"}}>APPS.</span>
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              transition={{duration:0.8,delay:0.7,ease:[0.16,1,0.3,1]}}
              style={{fontSize:13,color:C.muted,lineHeight:1.9,maxWidth:420,marginBottom:36}}>
              İstanbul merkezli mobil ürün stüdyosu. iOS, Android ve cross-platform.
              Strateji, tasarım, geliştirme ve büyüme — tek çatı altında.
            </motion.p>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.85}}
              style={{display:"flex",gap:12,marginBottom:52}}>
              <motion.button data-p10cursor=""
                whileHover={{scale:1.03,background:C.redHot}}
                whileTap={{scale:0.97}}
                style={{
                  background:C.red,color:"#fff",border:"none",
                  padding:"15px 30px",fontFamily:"'IBM Plex Mono',monospace",
                  fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",gap:10,
                  boxShadow:`0 0 40px ${C.red}44`,
                  transition:"background 0.2s,box-shadow 0.2s"
                }}>
                START A PROJECT <span style={{fontSize:14}}>→</span>
              </motion.button>
              <motion.button data-p10cursor=""
                whileHover={{borderColor:C.gold,color:C.gold}}
                style={{
                  background:"transparent",color:C.muted,
                  border:`1px solid ${C.b2}`,padding:"15px 28px",
                  fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                  letterSpacing:"0.18em",textTransform:"uppercase",
                  transition:"all 0.22s"
                }}>
                SEE WORK ↓
              </motion.button>
            </motion.div>

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:0.6}}
              style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,
                borderTop:`1px solid ${C.b2}`,paddingTop:28}}>
              {NUMBERS.map(([v,l],i)=>(
                <div key={l} style={{borderRight:i<3?`1px solid ${C.b2}`:"none",paddingRight:20,paddingLeft:i>0?20:0}}>
                  <div className="D" style={{
                    fontSize:"clamp(1.6rem,2.8vw,2.4rem)",letterSpacing:"0.04em",lineHeight:1,
                    background:`linear-gradient(135deg,${C.white},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}>{v}</div>
                  <div style={{fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginTop:5}}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: FLOATING FRAMES ── */}
          <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:1.1,delay:0.2,ease:[0.16,1,0.3,1]}}>
            <FloatingFrames/>
          </motion.div>
        </div>
      </section>

      {/* ═══ TICKER STRIP ═══ */}
      <div style={{borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`,position:"relative",zIndex:2,overflow:"hidden"}}>
        <Marquee items={CAPS} speed={26}/>
        <div style={{borderTop:`1px solid ${C.b2}`}}>
          <Marquee items={[...CAPS].reverse()} speed={34} reverse/>
        </div>
      </div>

      {/* ═══ WORK GRID ═══ */}
      <section style={{padding:"100px 44px"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:56}}>
          <div>
            <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{duration:0.6}} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
              color:C.muted,letterSpacing:"0.26em",textTransform:"uppercase",marginBottom:12}}>
              § 01 — Selected Work
            </motion.div>
            <div className="D" style={{fontSize:"clamp(2.8rem,6.5vw,7rem)",lineHeight:0.87,letterSpacing:"-0.01em"}}>
              <SplitReveal text="WHAT WE LAUNCHED." style={{
                background:`linear-gradient(110deg,${C.white} 40%,${C.gold})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
              }}/>
            </div>
          </div>
          <motion.a href="#" whileHover={{color:C.gold,borderColor:C.gold}}
            initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
            style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
              letterSpacing:"0.2em",textTransform:"uppercase",textDecoration:"none",
              border:`1px solid ${C.b2}`,padding:"10px 18px",
              transition:"all 0.2s",alignSelf:"flex-end",marginBottom:8}}>
            ALL PROJECTS ↗
          </motion.a>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:2}}>
          {WORKS.map((w,i)=><WorkCard key={w.id} w={w} idx={i}/>)}
        </div>
      </section>

      {/* ═══ NUMBERS BAND ═══ */}
      <section style={{
        padding:"80px 44px",
        borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`,
        background:C.card,position:"relative",zIndex:2,overflow:"hidden"
      }}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(ellipse at 20% 50%,${C.red}14,transparent 55%),radial-gradient(ellipse at 80% 50%,${C.gold}10,transparent 55%)`}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative",zIndex:2}}>
          {NUMBERS.map(([v,l],i)=>(
            <div key={l} style={{borderRight:i<3?`1px solid ${C.b2}`:"none",padding:"0 32px",textAlign:"center"}}>
              <BigNum val={v} label={l} delay={i*0.1}/>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section style={{padding:"100px 44px"}}>
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
            letterSpacing:"0.26em",textTransform:"uppercase",marginBottom:12}}>
          § 02 — Services
        </motion.div>
        <div className="D" style={{fontSize:"clamp(2.8rem,6.5vw,7rem)",lineHeight:0.87,marginBottom:64}}>
          <SplitReveal text="WHAT WE DO." delay={0.05} style={{
            background:`linear-gradient(110deg,${C.white} 50%,${C.gold})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
          }}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:0,
          border:`1px solid ${C.b2}`}}>
          {[
            {n:"01",icon:"◈",title:"Mobile App Design",sub:"iOS · Android · React Native",desc:"Sıfırdan premium kullanıcı deneyimi. Performanslı, akıcı, güçlü."},
            {n:"02",icon:"⬡",title:"UI/UX & Prototyping",sub:"Wireframe · Flow · Visual",desc:"Kullanıcı akışından piksel detayına eksiksiz tasarım sistemi."},
            {n:"03",icon:"↑",title:"App Store Optimization",sub:"ASO · Growth · Analytics",desc:"İndirme sayısını artıran strateji ve büyüme operasyonu."},
            {n:"04",icon:"⚙",title:"Tech Support & Scale",sub:"Bakım · Performans · Evrim",desc:"Ürün canlıyken biz de aktifiz. 24/7 teknik destek."},
          ].map((s,i)=>(
            <motion.div key={s.n} data-p10cursor="MORE"
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.09,duration:0.7,ease:[0.16,1,0.3,1]}}
              whileHover="hov"
              style={{
                position:"relative",overflow:"hidden",
                borderRight:i%2===0?`1px solid ${C.b2}`:"none",
                borderBottom:i<2?`1px solid ${C.b2}`:"none",
                padding:36
              }}>
              <motion.div variants={{hov:{scaleX:1},rest:{scaleX:0}}} initial="rest"
                transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                style={{position:"absolute",top:0,left:0,right:0,height:2,
                  background:`linear-gradient(90deg,${C.red},${C.gold})`,
                  transformOrigin:"left",zIndex:2}}/>

              <motion.div variants={{hov:{opacity:1},rest:{opacity:0}}} initial="rest"
                transition={{duration:0.5}}
                style={{position:"absolute",inset:0,
                  background:`radial-gradient(ellipse at 0% 100%,${C.red}12,transparent 60%)`,
                  zIndex:0}}/>

              <div style={{position:"relative",zIndex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <motion.span variants={{hov:{color:C.gold},rest:{color:"#2a2218"}}}
                      style={{fontSize:22,transition:"color 0.2s"}}>{s.icon}</motion.span>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,letterSpacing:"0.22em"}}>{s.n}</span>
                  </div>
                  <motion.span variants={{hov:{color:C.gold,x:3,y:-3},rest:{color:"#2a2218",x:0,y:0}}}
                    style={{fontSize:16,display:"inline-block"}}>↗</motion.span>
                </div>
                <motion.h3 variants={{hov:{color:C.white}}}
                  className="D" style={{fontSize:"clamp(1.5rem,2.8vw,2.2rem)",letterSpacing:"0.04em",marginBottom:8,lineHeight:1,color:C.white}}>
                  {s.title}
                </motion.h3>
                <div style={{fontSize:9,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace",marginBottom:16}}>
                  {s.sub}
                </div>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.8}}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section style={{padding:"100px 44px",background:C.card,
        borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`}}>
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
            letterSpacing:"0.26em",textTransform:"uppercase",marginBottom:12}}>
          § 03 — Process
        </motion.div>
        <div className="D" style={{fontSize:"clamp(2.8rem,6.5vw,7rem)",lineHeight:0.87,marginBottom:64,color:C.white}}>
          HOW WE BUILD.
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,
          border:`1px solid ${C.b2}`}}>
          {[
            {n:"01",emoji:"🔎",title:"Discovery",desc:"Hedef kitle, rakip analizi ve ürün stratejisi."},
            {n:"02",emoji:"✦",title:"Design",desc:"Wireframe'den high-fi prototipe sistemli tasarım."},
            {n:"03",emoji:"⟨⟩",title:"Develop",desc:"React Native ile clean, ölçeklenebilir mimari."},
            {n:"04",emoji:"🚀",title:"Launch",desc:"Yayın, ASO ve büyüme iterasyonları."},
          ].map((p,i)=>(
            <motion.div key={p.n}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.6,ease:[0.16,1,0.3,1]}}
              whileHover={{background:C.b1}}
              style={{borderRight:i<3?`1px solid ${C.b2}`:"none",
                padding:32,position:"relative",overflow:"hidden",transition:"background 0.3s"}}>

              {i<3 && <div style={{position:"absolute",top:"50%",right:-1,width:1,height:28,
                background:`linear-gradient(180deg,transparent,${C.red},transparent)`,
                transform:"translateY(-50%)"}}/>}

              <div className="D" style={{position:"absolute",right:16,top:12,
                fontSize:56,color:C.faint,letterSpacing:"0.02em",lineHeight:1,pointerEvents:"none"}}>
                {p.n}
              </div>

              <div style={{fontSize:26,marginBottom:20}}>{p.emoji}</div>
              <div className="D" style={{fontSize:"clamp(1.3rem,2vw,1.9rem)",letterSpacing:"0.04em",
                marginBottom:10,lineHeight:1,
                background:`linear-gradient(110deg,${C.white},${C.gold})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {p.title}
              </div>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.82}}>{p.desc}</p>

              <motion.div
                initial={{scaleX:0}} whileInView={{scaleX:1}}
                viewport={{once:true}} transition={{delay:0.4+i*0.12,duration:0.7,ease:[0.16,1,0.3,1]}}
                style={{position:"absolute",bottom:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,${C.red},${C.gold},transparent)`,
                  transformOrigin:"left"}}/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{padding:"120px 44px 130px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(ellipse at 30% 50%,${C.red}20,transparent 50%),radial-gradient(ellipse at 75% 50%,${C.gold}12,transparent 50%)`,
          filter:"blur(20px)"}}/>
        <div style={{position:"absolute",bottom:0,left:44,right:44,height:1,
          background:`linear-gradient(90deg,transparent,${C.red},${C.gold},transparent)`}}/>

        <div style={{position:"relative",zIndex:2,
          display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:60,alignItems:"end"}}>
          <div>
            <div className="D" style={{fontSize:"clamp(3.5rem,10vw,10rem)",lineHeight:0.85,letterSpacing:"-0.02em"}}>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.05,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>LET&apos;S</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.15,ease:[0.16,1,0.3,1]}}>
                  <span style={{
                    background:`linear-gradient(110deg,${C.red},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}>BUILD</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.25,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>YOUR</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.35,ease:[0.16,1,0.3,1]}}>
                  <span style={{WebkitTextStroke:`1.5px ${C.b2}`,color:"transparent"}}>APP.</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div style={{paddingBottom:8}}>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.9,marginBottom:32,maxWidth:360}}>
              Fikrinizi ve hedef kitlenizi paylaşın.
              24 saat içinde size özel bir teklif ile dönüyoruz.
            </p>

            {["hello@bullsdigital.com","+90 xxx xxx xx xx","İstanbul, Türkiye"].map((c,i)=>(
              <motion.div key={c}
                initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{delay:0.1+i*0.1,duration:0.6}}
                style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,paddingBottom:10,
                  borderBottom:`1px solid ${C.b1}`}}>
                <div style={{width:4,height:4,borderRadius:"50%",
                  background:[C.red,C.gold,C.muted][i],flexShrink:0}}/>
                <span style={{fontSize:11,color:C.muted,letterSpacing:"0.08em"}}>{c}</span>
              </motion.div>
            ))}

            <div style={{display:"flex",gap:12,marginTop:28}}>
              <motion.button data-p10cursor=""
                whileHover={{background:C.redHot,boxShadow:`0 0 50px ${C.red}55`}}
                whileTap={{scale:0.97}}
                style={{background:C.red,color:"#fff",border:"none",
                  padding:"16px 30px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                  letterSpacing:"0.18em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",gap:10,
                  boxShadow:`0 0 30px ${C.red}44`,transition:"all 0.2s"}}>
                START NOW →
              </motion.button>
              <motion.button data-p10cursor=""
                whileHover={{color:C.gold,borderColor:C.goldDeep}}
                style={{background:"transparent",color:C.muted,
                  border:`1px solid ${C.b2}`,padding:"16px 24px",
                  fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                  letterSpacing:"0.18em",textTransform:"uppercase",
                  transition:"all 0.2s"}}>
                PORTFOLIO ↗
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{borderTop:`1px solid ${C.b2}`,padding:"22px 44px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:24,height:24,
            background:`linear-gradient(135deg,${C.red},${C.gold})`,
            clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="D" style={{fontSize:11,color:"#fff"}}>B</span>
          </div>
          <span className="D" style={{fontSize:15,letterSpacing:"0.1em",color:C.white}}>BULLS DIGITAL HOUSE</span>
        </div>
        <span style={{fontSize:9,color:C.muted,letterSpacing:"0.22em"}}>© 2026 — ISTANBUL / GLOBAL</span>
        <div style={{display:"flex",gap:28}}>
          {["Privacy","Terms","Instagram","LinkedIn"].map(n=>(
            <motion.a key={n} href="#" whileHover={{color:C.gold}}
              style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
                color:C.muted,textDecoration:"none",transition:"color 0.18s"}}>
              {n}
            </motion.a>
          ))}
        </div>
      </footer>
    </div>
  );
}
