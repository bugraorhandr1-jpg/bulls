import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

/* ─── PALETTE ─────────────────────────────────── */
const C = {
  black:   "#0a0805",
  deep:    "#110e09",
  card:    "#16120c",
  border:  "#2a2218",
  red:     "#e8220a",
  redHot:  "#ff3d1f",
  redDim:  "#7a1205",
  gold:    "#f5a800",
  goldHot: "#ffc93c",
  goldDim: "#7a5200",
  paper:   "#f5f0e8",
  muted:   "rgba(245,240,232,0.38)",
  faint:   "rgba(245,240,232,0.12)",
};

/* ─── DATA ────────────────────────────────────── */
const SERVICES = [
  { id:"01", title:"Mobile App Design",       sub:"iOS · Android · React Native",   desc:"Sıfırdan premium kullanıcı deneyimi. Hızlı, akıcı, güçlü.", icon:"◈" },
  { id:"02", title:"UI/UX & Prototyping",     sub:"Wireframe · Flow · Visual",       desc:"Kullanıcı akışından piksel detayına, eksiksiz tasarım sistemi.", icon:"⬡" },
  { id:"03", title:"App Store Optimization",  sub:"ASO · Growth · Analytics",        desc:"İndirme sayısını artıran strateji ve büyüme operasyonu.", icon:"↑" },
  { id:"04", title:"Tech Support & Scaling",  sub:"Bakım · Performans · Evrim",      desc:"Ürün canlıyken biz de aktifiz. 24/7 teknik destek.", icon:"⚙" },
];

const PROJECTS = [
  { code:"BDH-001", title:"Pulse Commerce",  tag:"E-Commerce App",    year:"2024", heat:94,
    img:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=900&q=85&fit=crop" },
  { code:"BDH-002", title:"Movi — Transit",  tag:"Navigation App",    year:"2024", heat:81,
    img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=85&fit=crop" },
  { code:"BDH-003", title:"Kore Finance",    tag:"Fintech Mobile",    year:"2025", heat:73,
    img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=85&fit=crop" },
  { code:"BDH-004", title:"Orbit Dashboard", tag:"SaaS · Mobile Web", year:"2025", heat:66,
    img:"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=85&fit=crop" },
];

const STATS = [["18+","Launched Apps"],["4","Core Services"],["24/7","Live Support"],["TR/EU","Coverage"]];

const PROCESS = [
  { n:"01", title:"Discovery",  desc:"Hedef kitle, rakip analizi ve ürün stratejisi.",      icon:"🔎" },
  { n:"02", title:"Design",     desc:"Wireframe'den high-fidelity prototipe sistemli tasarım.", icon:"✦" },
  { n:"03", title:"Develop",    desc:"React Native ile clean, ölçeklenebilir mimari.",        icon:"⟨⟩" },
  { n:"04", title:"Launch",     desc:"Yayın, ASO ve büyüme iterasyonları.",                  icon:"🚀" },
];

const TICKER = [
  "React Native","iOS Development","Android Development","UI/UX Design","App Store Optimization",
  "Mobile Strategy","Firebase","Redux","Figma","Performance Audit",
  "React Native","iOS Development","Android Development","UI/UX Design","App Store Optimization",
  "Mobile Strategy","Firebase","Redux","Figma","Performance Audit",
];

/* ─── HELPERS ─────────────────────────────────── */
function bulbColor(heat) {
  if (heat < 50) {
    const t = heat / 50;
    return `hsl(${38 + t*(-38)}, ${60+t*30}%, ${30+t*18}%)`;
  }
  if (heat < 80) {
    const t = (heat-50)/30;
    return `hsl(${38 - t*32}, ${90+t*5}%, ${48+t*4}%)`;
  }
  const t = (heat-80)/20;
  return `hsl(${6 - t*4}, ${95}%, ${52+t*18}%)`;
}

/* ─── CURSOR ──────────────────────────────────── */
function BullsCursor() {
  const [pos, setPos] = useState({x:-200,y:-200});
  const [heat, setHeat] = useState(0);
  const [trail, setTrail] = useState([]);
  const last = useRef({x:0,y:0});

  useEffect(()=>{
    const mv = (e)=>{
      const dx=e.clientX-last.current.x, dy=e.clientY-last.current.y;
      const spd=Math.min(100,Math.sqrt(dx*dx+dy*dy)*3);
      last.current={x:e.clientX,y:e.clientY};
      setPos({x:e.clientX,y:e.clientY});
      setHeat(h=>Math.min(100,h+spd*0.35));
      setTrail(p=>[...p.slice(-20),{x:e.clientX,y:e.clientY,t:spd}]);
    };
    const cool=setInterval(()=>setHeat(h=>Math.max(0,h-1.6)),28);
    window.addEventListener("mousemove",mv);
    return()=>{window.removeEventListener("mousemove",mv);clearInterval(cool);};
  },[]);

  const col = bulbColor(heat);

  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {trail.map((p,i)=>(
        <div key={i} style={{
          position:"fixed",left:p.x,top:p.y,
          width:4+i*0.4,height:4+i*0.4,borderRadius:"50%",
          background:bulbColor(p.t),
          opacity:(i/trail.length)*0.28,
          transform:"translate(-50%,-50%)",
          filter:"blur(2px)",
        }}/>
      ))}
      <div style={{
        position:"fixed",left:pos.x,top:pos.y,
        width:12,height:12,borderRadius:"50%",
        background:col,
        transform:"translate(-50%,-50%)",
        boxShadow:`0 0 ${8+heat*0.35}px ${col}, 0 0 ${20+heat*0.5}px ${col}44`,
        transition:"background 0.06s,box-shadow 0.06s",
      }}/>
    </div>
  );
}

/* ─── NOISE ───────────────────────────────────── */
function Grain() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1,opacity:"var(--bg-theme-noise-opacity)",mixBlendMode:"overlay"}}>
      <filter id="p9grain"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#p9grain)"/>
    </svg>
  );
}

/* ─── SCRAMBLE ────────────────────────────────── */
function Scramble({text,active}){
  const CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!";
  const [d,setD]=useState(text);
  const fr=useRef(null);
  useEffect(()=>{
    if(!active){setD(text);return;}
    let i=0;const tot=text.length*3;
    const run=()=>{
      setD(text.split("").map((c,idx)=>{
        if(c===" ")return" ";
        if(idx<i/3)return text[idx];
        return CH[Math.floor(Math.random()*CH.length)];
      }).join(""));
      i++;
      if(i<tot)fr.current=requestAnimationFrame(run);else setD(text);
    };
    fr.current=requestAnimationFrame(run);
    return()=>cancelAnimationFrame(fr.current);
  },[active,text]);
  return <span>{d}</span>;
}

Scramble.propTypes = { text: PropTypes.string, active: PropTypes.bool };

/* ─── ANIMATED NUMBER ─────────────────────────── */
function CountUp({target}){
  const [val,setVal]=useState(0);
  const ref=useRef(null);
  const done=useRef(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!done.current){
        done.current=true;
        let start=null;
        const num=parseInt(target)||0;
        const step=(ts)=>{
          if(!start)start=ts;
          const p=Math.min((ts-start)/1400,1);
          const ease=1-Math.pow(1-p,4);
          setVal(Math.floor(ease*num));
          if(p<1)requestAnimationFrame(step);else setVal(num);
        };
        requestAnimationFrame(step);
      }
    },{threshold:0.4});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  const num=parseInt(target)||0;
  const display=isNaN(num)||target.toString().includes("/")||target.toString().includes("TR")
    ? target : val+(target.toString().includes("+")?"+":" ");
  return <span ref={ref}>{display}</span>;
}

CountUp.propTypes = { target: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };

/* ─── FIRE BAR ────────────────────────────────── */
function FireBar({value,label,delay=0,dark=false}){
  const [go,setGo]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setGo(true);},{threshold:0.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const col=bulbColor(value);
  return(
    <div ref={ref} style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontFamily:"monospace",fontSize:10,color:dark?"rgba(245,240,232,0.35)":C.muted}}>
        <span>{label}</span><span style={{color:col}}>{value}%</span>
      </div>
      <div style={{height:2,background:dark?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.06)",overflow:"hidden"}}>
        <motion.div initial={{width:0}} animate={{width:go?`${value}%`:0}}
          transition={{duration:1.4,ease:[0.22,1,0.36,1],delay}}
          style={{height:"100%",background:`linear-gradient(90deg,${C.red},${col})`}}/>
      </div>
    </div>
  );
}

FireBar.propTypes = { value: PropTypes.number, label: PropTypes.string, delay: PropTypes.number, dark: PropTypes.bool };

/* ─── SECTION HEADER ──────────────────────────── */
function SecHead({num,right}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
      <span style={{fontFamily:"monospace",fontSize:10,color:C.muted,letterSpacing:"0.22em",whiteSpace:"nowrap"}}>§ {num}</span>
      <div style={{flex:1,height:1,background:C.border}}/>
      {right&&<span style={{fontFamily:"monospace",fontSize:10,color:C.muted,whiteSpace:"nowrap"}}>{right}</span>}
    </div>
  );
}

SecHead.propTypes = { num: PropTypes.string, right: PropTypes.string };

/* ─── HERO PHONE COLLAGE ──────────────────────── */
function PhoneCollage(){
  const imgs=[
    {src:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=500&q=85&fit=crop",rot:-7,x:"2%",y:"5%",z:1,w:"44%"},
    {src:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=85&fit=crop",rot: 4,x:"32%",y:"0%",z:3,w:"40%"},
    {src:"https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=500&q=85&fit=crop",rot: 9,x:"60%",y:"8%",z:2,w:"38%"},
  ];
  return(
    <div style={{position:"relative",height:360}}>
      {imgs.map((img,i)=>(
        <motion.div key={i}
          initial={{opacity:0,y:50,rotate:img.rot}}
          animate={{opacity:1,y:0,rotate:img.rot}}
          transition={{delay:0.4+i*0.18,duration:1,ease:[0.22,1,0.36,1]}}
          whileHover={{y:-10,scale:1.04,zIndex:20}}
          style={{position:"absolute",top:img.y,left:img.x,width:img.w,zIndex:img.z,
            boxShadow:`0 24px 70px rgba(0,0,0,0.6), 0 0 0 1px ${C.border}`,
            borderRadius:8,overflow:"hidden"}}
        >
          <img src={img.src} alt="" style={{width:"100%",display:"block",
            filter:"contrast(1.1) brightness(0.85) saturate(0.7)"}}
            onError={e=>{e.target.parentElement.style.display="none";}}/>
          <motion.div animate={{y:["-100%","220%"]}} transition={{repeat:Infinity,duration:2.8+i*0.7,ease:"linear",delay:i*1.1}}
            style={{position:"absolute",inset:"0 0 auto 0",height:2,
              background:`linear-gradient(90deg,transparent,${C.redHot},${C.gold},transparent)`,
              filter:"blur(1px)"}}/>
          <div style={{position:"absolute",bottom:8,left:8,background:"rgba(10,8,5,0.75)",
            border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 8px",
            fontFamily:"monospace",fontSize:9,color:C.muted,letterSpacing:"0.14em"}}>
            BDH·{String(i+1).padStart(3,"0")}
          </div>
        </motion.div>
      ))}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 60%, ${C.red}18, transparent 65%)`,
        filter:"blur(20px)"}}/>
    </div>
  );
}

/* ─── PROJECT ROW ─────────────────────────────── */
function ProjRow({p,idx}){
  const [hov,setHov]=useState(false);
  const [tmp,setTmp]=useState(p.heat*0.25);
  const [err,setErr]=useState(false);
  useEffect(()=>{
    if(hov){const id=setInterval(()=>setTmp(t=>Math.min(p.heat,t+6)),22);return()=>clearInterval(id);}
    else{const id=setInterval(()=>setTmp(t=>Math.max(p.heat*0.25,t-4)),32);return()=>clearInterval(id);}
  },[hov,p.heat]);
  const col=bulbColor(tmp);
  return(
    <motion.div
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}}
      viewport={{once:true}} transition={{delay:idx*0.1,duration:0.6,ease:[0.22,1,0.36,1]}}
      style={{display:"grid",gridTemplateColumns:"90px 1fr 200px 72px 40px",
        alignItems:"center",padding:"22px 0",borderBottom:`1px solid ${C.border}`,
        position:"relative"}}
    >
      <motion.div animate={{scaleX:hov?1:0}} transition={{duration:0.4,ease:[0.22,1,0.36,1]}}
        style={{position:"absolute",inset:0,background:`${col}0d`,transformOrigin:"left",zIndex:0}}/>
      <span style={{fontFamily:"monospace",fontSize:10,color:C.muted,position:"relative",zIndex:1}}>{p.code}</span>
      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.2rem,2.2vw,1.8rem)",
        letterSpacing:"0.04em",color:hov?col:C.paper,transition:"color 0.07s",position:"relative",zIndex:1}}>
        <Scramble text={p.title} active={hov}/>
      </span>
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10}}>
        <motion.div animate={{width:hov?56:0,opacity:hov?1:0}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
          style={{height:36,overflow:"hidden",borderRadius:4,flexShrink:0,border:`1px solid ${C.border}`}}>
          {!err
            ?<img src={p.img} alt="" onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.8) saturate(0.6)"}}/>
            :<div style={{width:"100%",height:"100%",background:C.card}}/>}
        </motion.div>
        <span style={{fontSize:10,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"monospace"}}>{p.tag}</span>
      </div>
      <span style={{fontFamily:"monospace",fontSize:10,color:C.muted,position:"relative",zIndex:1}}>{p.year}</span>
      <motion.span animate={{color:hov?col:"#444"}} style={{fontSize:17,position:"relative",zIndex:1,textAlign:"right"}}>↗</motion.span>
    </motion.div>
  );
}

ProjRow.propTypes = { p: PropTypes.object, idx: PropTypes.number };

/* ═══════════════════════════════════════════════════════════
   PAGE 9 — Bulls Digital House (Fire / Dark)
   ═══════════════════════════════════════════════════════════ */
export default function Page9() {
  const [time,setTime]=useState("");

  useEffect(()=>{
    const t=()=>setTime(new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    t();const id=setInterval(t,1000);return()=>clearInterval(id);
  },[]);

  return(
    <div className="page9-bdh bg-theme-tech" style={{color:C.paper,fontFamily:"'IBM Plex Mono',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .page9-bdh *,.page9-bdh *::before,.page9-bdh *::after{box-sizing:border-box}
        .page9-bdh::before{content:'';position:fixed;inset:0;
          background-image:repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(255,255,255,0.022) 47px,rgba(255,255,255,0.022) 48px),
          repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(255,255,255,0.014) 47px,rgba(255,255,255,0.014) 48px);
          pointer-events:none;z-index:0}
        .page9-bdh .D{font-family:'Bebas Neue',sans-serif}
        .page9-bdh .italic{font-family:'Playfair Display',Georgia,serif;font-style:italic}
        .page9-bdh section{position:relative;z-index:2}
        @keyframes p9tk{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .page9-bdh .tk-wrap{overflow:hidden;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};position:relative;z-index:2}
        .page9-bdh .tk-inner{display:flex;animation:p9tk 22s linear infinite;width:max-content}
        .page9-bdh .tk-item{padding:11px 30px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
          border-right:1px solid ${C.border};white-space:nowrap;color:${C.muted}}
        .page9-bdh ::-webkit-scrollbar{width:2px}
        .page9-bdh ::-webkit-scrollbar-thumb{background:${C.red}}
        .page9-bdh ::selection{background:${C.red};color:#fff}
      `}</style>

      <Grain/>

      {/* ══ HERO ══ */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {/* eyebrow bar */}
        <div style={{padding:"10px 44px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:9,color:C.muted,letterSpacing:"0.24em"}}>BULLS DIGITAL HOUSE — EST. 2023</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",
              boxShadow:"0 0 0 3px rgba(34,197,94,0.18)"}}/>
            <span style={{fontSize:9,color:C.muted,letterSpacing:"0.18em"}}>OPEN FOR PROJECTS</span>
          </div>
          <span style={{fontSize:10,color:C.muted,fontFamily:"IBM Plex Mono",letterSpacing:"0.08em"}}>{time}</span>
        </div>

        <div style={{flex:1,padding:"52px 44px 64px",display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:64,alignItems:"center"}}>
          {/* LEFT */}
          <motion.div variants={{hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:0.1}}}}
            initial="hidden" animate="visible">

            <motion.div variants={{hidden:{opacity:0,y:32},visible:{opacity:1,y:0,transition:{duration:0.8,ease:[0.22,1,0.36,1]}}}}>
              <div className="D" style={{fontSize:"clamp(4rem,11vw,11rem)",lineHeight:0.87,letterSpacing:"-0.01em",position:"relative"}}>
                <div style={{color:C.paper}}>MOBILE</div>
                <div style={{display:"flex",alignItems:"baseline",gap:"0.1em",flexWrap:"wrap"}}>
                  <span style={{
                    background:`linear-gradient(110deg,${C.red},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>APPS</span>
                  <span className="italic" style={{fontSize:"0.3em",color:C.muted,paddingBottom:"0.3em",
                    WebkitTextFillColor:C.muted,background:"none"}}>that convert</span>
                </div>
                <div style={{color:C.paper}}>&amp; GROW.</div>
              </div>
            </motion.div>

            <motion.p variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.6}}}}
              style={{fontSize:13,color:C.muted,lineHeight:1.9,maxWidth:440,margin:"28px 0 32px"}}>
              İstanbul merkezli mobil ürün stüdyosu. iOS, Android ve cross-platform projeler için
              strateji, tasarım, geliştirme ve büyüme — tek çatı altında.
            </motion.p>

            <motion.div variants={{hidden:{opacity:0,y:16},visible:{opacity:1,y:0,transition:{duration:0.5}}}}
              style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <motion.button whileHover={{background:C.redHot}} whileTap={{scale:0.97}}
                style={{background:C.red,color:"#fff",border:"none",padding:"14px 28px",
                  fontFamily:"IBM Plex Mono",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}>
                START A PROJECT <span>→</span>
              </motion.button>
              <motion.button whileHover={{borderColor:C.gold,color:C.gold}}
                style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,
                  padding:"14px 28px",fontFamily:"IBM Plex Mono",fontSize:11,
                  letterSpacing:"0.16em",textTransform:"uppercase",transition:"all 0.2s"}}>
                SEE OUR WORK ↓
              </motion.button>
            </motion.div>

            {/* stats */}
            <motion.div variants={{hidden:{opacity:0},visible:{opacity:1,transition:{delay:0.3,duration:0.6}}}}
              style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,
                marginTop:44,paddingTop:36,borderTop:`1px solid ${C.border}`}}>
              {STATS.map(([v,l])=>(
                <div key={l}>
                  <div className="D" style={{fontSize:28,letterSpacing:"0.04em",lineHeight:1,
                    background:`linear-gradient(135deg,${C.paper},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    <CountUp target={v}/>
                  </div>
                  <div style={{fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginTop:4}}>{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — collage */}
          <motion.div initial={{opacity:0,x:36}} animate={{opacity:1,x:0}}
            transition={{delay:0.25,duration:1,ease:[0.22,1,0.36,1]}}>
            <PhoneCollage/>
            <div style={{marginTop:28,paddingTop:22,borderTop:`1px solid ${C.border}`}}>
              <FireBar value={94} label="App Store Rating Avg." delay={0.8}/>
              <FireBar value={87} label="On-time Delivery" delay={0.95}/>
              <FireBar value={91} label="Client Retention" delay={1.1}/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="tk-wrap">
        <div className="tk-inner">
          {TICKER.map((item,i)=>(
            <div key={i} className="tk-item">
              <motion.span whileHover={{color:C.gold}} style={{transition:"color 0.15s"}}>{item}</motion.span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section style={{padding:"88px 44px"}}>
        <SecHead num="01 — SERVICES" right="4 lines"/>
        <div className="D" style={{fontSize:"clamp(2.8rem,7vw,7rem)",letterSpacing:"-0.01em",lineHeight:0.88,marginBottom:52}}>
          <span style={{background:`linear-gradient(110deg,${C.paper} 55%,${C.gold})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            WHAT WE DO.
          </span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:0,
          border:`1px solid ${C.border}`}}>
          {SERVICES.map((s,i)=>(
            <motion.div key={s.id}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.09,duration:0.6}}
              whileHover="hov" style={{position:"relative",overflow:"hidden",
                borderRight:i%2===0?`1px solid ${C.border}`:"none",
                borderBottom:i<2?`1px solid ${C.border}`:"none",
                padding:36}}
            >
              {/* fill */}
              <motion.div variants={{hov:{scaleY:1},rest:{scaleY:0}}} initial="rest"
                transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
                style={{position:"absolute",inset:0,
                  background:`linear-gradient(180deg,${C.red}18,${C.deep})`,
                  transformOrigin:"bottom",zIndex:0,
                  borderTop:`2px solid ${C.red}`}}/>
              {/* left accent line */}
              <motion.div variants={{hov:{scaleY:1},rest:{scaleY:0}}} initial="rest"
                transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
                style={{position:"absolute",left:0,top:0,bottom:0,width:2,
                  background:`linear-gradient(180deg,${C.red},${C.gold})`,
                  transformOrigin:"top",zIndex:1}}/>

              <div style={{position:"relative",zIndex:2}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <motion.span variants={{hov:{color:C.gold},rest:{color:C.muted}}}
                      style={{fontSize:22,fontFamily:"monospace",transition:"color 0.15s"}}>{s.icon}</motion.span>
                    <span style={{fontFamily:"monospace",fontSize:9,color:C.muted,letterSpacing:"0.22em"}}>{s.id}</span>
                  </div>
                  <motion.span variants={{hov:{color:C.gold},rest:{color:"#333"}}} style={{fontSize:16}}>↗</motion.span>
                </div>

                <motion.h3 variants={{hov:{color:C.paper},rest:{color:C.paper}}}
                  className="D" style={{fontSize:"clamp(1.5rem,2.8vw,2.2rem)",letterSpacing:"0.04em",marginBottom:8,lineHeight:1}}>
                  {s.title}
                </motion.h3>

                <motion.div variants={{hov:{color:C.muted},rest:{color:"#3a3228"}}}
                  style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
                    fontFamily:"monospace",marginBottom:16,transition:"color 0.2s"}}>
                  {s.sub}
                </motion.div>

                <motion.p variants={{hov:{color:"rgba(245,240,232,0.65)"},rest:{color:C.muted}}}
                  style={{fontSize:13,lineHeight:1.8}}>
                  {s.desc}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section style={{padding:"80px 44px",background:C.deep,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <SecHead num="02 — PROCESS" right="4 steps"/>
        <div className="D" style={{fontSize:"clamp(2.8rem,7vw,7rem)",letterSpacing:"-0.01em",lineHeight:0.88,marginBottom:52,color:C.paper}}>
          HOW WE<br/>BUILD.
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",
          border:`1px solid ${C.border}`}}>
          {PROCESS.map((p,i)=>(
            <motion.div key={p.n}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.55}}
              style={{borderRight:i<3?`1px solid ${C.border}`:"none",padding:28,position:"relative",overflow:"hidden"}}>
              <div className="D" style={{position:"absolute",right:16,top:12,
                fontSize:64,color:"rgba(255,255,255,0.025)",letterSpacing:"0.02em",lineHeight:1}}>
                {p.n}
              </div>
              <div style={{fontSize:24,marginBottom:16}}>{p.icon}</div>
              <div className="D" style={{fontSize:"clamp(1.3rem,2vw,1.9rem)",letterSpacing:"0.04em",
                marginBottom:10,
                background:`linear-gradient(110deg,${C.paper},${C.gold})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {p.title}
              </div>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.8,marginBottom:20}}>{p.desc}</p>
              <FireBar value={[88,74,96,68][i]} label={["Research","Wireframe","Code","Deploy"][i]} dark/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section style={{padding:"88px 44px"}}>
        <SecHead num="03 — WORK" right="Selected projects"/>
        <div className="D" style={{fontSize:"clamp(2.8rem,7vw,7rem)",letterSpacing:"-0.01em",lineHeight:0.88,marginBottom:52}}>
          <span style={{background:`linear-gradient(110deg,${C.paper} 50%,${C.gold})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>LAUNCHED.</span>
        </div>

        <div style={{borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"grid",gridTemplateColumns:"90px 1fr 200px 72px 40px",
            padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            {["Code","Project","Category","Year",""].map((h,i)=>(
              <span key={i} style={{fontSize:9,color:"#3a3228",letterSpacing:"0.24em",textTransform:"uppercase",fontFamily:"monospace"}}>{h}</span>
            ))}
          </div>
          {PROJECTS.map((p,i)=><ProjRow key={p.code} p={p} idx={i}/>)}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{padding:"0 44px 110px"}}>
        <div style={{borderTop:`2px solid ${C.red}`,paddingTop:64,
          display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:64,alignItems:"end"}}>
          <div>
            <div className="D" style={{fontSize:"clamp(3rem,9vw,9rem)",lineHeight:0.87,letterSpacing:"-0.02em"}}>
              <div style={{color:C.paper}}>LET&apos;S</div>
              <div style={{background:`linear-gradient(110deg,${C.red},${C.gold})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>BUILD</div>
              <div style={{color:C.paper}}>YOUR</div>
              <div style={{color:"#2a2218"}}>APP.</div>
            </div>
          </div>
          <div style={{paddingBottom:4}}>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.9,marginBottom:30,maxWidth:380}}>
              Fikrinizi, hedef kitlenizi ve beklentilerinizi paylaşın.
              24 saat içinde size özel bir teklif ile dönüyoruz.
            </p>
            <div style={{marginBottom:28}}>
              <FireBar value={96} label="Response rate" delay={0.05}/>
              <FireBar value={94} label="Client satisfaction" delay={0.15}/>
              <FireBar value={89} label="On-time delivery" delay={0.25}/>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <motion.button whileHover={{background:C.redHot}} whileTap={{scale:0.97}}
                style={{background:C.red,color:"#fff",border:"none",padding:"15px 30px",
                  fontFamily:"IBM Plex Mono",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",
                  display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}>
                START NOW →
              </motion.button>
              <motion.button whileHover={{color:C.gold,borderColor:C.goldDim}}
                style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,
                  padding:"15px 24px",fontFamily:"IBM Plex Mono",fontSize:11,
                  letterSpacing:"0.18em",textTransform:"uppercase",transition:"all 0.2s"}}>
                PORTFOLIO ↗
              </motion.button>
            </div>
            <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${C.border}`,
              display:"flex",gap:24}}>
              {["hello@bullsdigital.com","+90 xxx xxx xx xx","İstanbul, TR"].map(c=>(
                <div key={c} style={{fontSize:10,color:C.muted,letterSpacing:"0.08em"}}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"20px 44px",
        display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:22,height:22,background:`linear-gradient(135deg,${C.red},${C.gold})`,borderRadius:4,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"Bebas Neue,sans-serif",fontSize:12,color:"#fff"}}>B</span>
          </div>
          <span className="D" style={{fontSize:14,letterSpacing:"0.1em"}}>BULLS DIGITAL HOUSE</span>
        </div>
        <span style={{fontSize:9,color:C.muted,letterSpacing:"0.2em"}}>© 2026 — ISTANBUL / GLOBAL</span>
        <div style={{display:"flex",gap:28}}>
          {["Privacy","Terms","Instagram","LinkedIn"].map(n=>(
            <motion.span key={n} whileHover={{color:C.gold}}
              style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.muted,transition:"color 0.15s"}}>
              {n}
            </motion.span>
          ))}
        </div>
      </footer>
    </div>
  );
}

Page9.propTypes = { t: PropTypes.object };
