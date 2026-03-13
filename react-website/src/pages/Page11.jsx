import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const C = {
  bg:"#070504", ink:"#0e0b07", card:"#120e08",
  b1:"#1c1610", b2:"#261e12", b3:"#332811",
  red:"#e8220a", redHot:"#ff4422", redDeep:"#5c0d03",
  gold:"#f5a800", goldHot:"#ffd060", goldDeep:"#5c3a00",
  white:"#f0ebe0", muted:"rgba(240,235,224,0.36)", faint:"rgba(240,235,224,0.07)",
};

const WORKS = [
  { id:"01", title:"PULSE", sub:"Commerce App", year:"2024", tag:"Mobile",
    img:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1400&q=90&fit=crop" },
  { id:"02", title:"MOVI", sub:"Transit Nav", year:"2024", tag:"Navigation",
    img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1400&q=90&fit=crop" },
  { id:"03", title:"KORE", sub:"Fintech", year:"2025", tag:"Finance",
    img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1400&q=90&fit=crop" },
  { id:"04", title:"ORBIT", sub:"Dashboard", year:"2025", tag:"SaaS",
    img:"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1400&q=90&fit=crop" },
];

/* ── CURSOR ── */
function P11Cursor() {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const sx = useSpring(mx,{stiffness:200,damping:16,mass:0.25});
  const sy = useSpring(my,{stiffness:200,damping:16,mass:0.25});
  const lx = useSpring(mx,{stiffness:60,damping:20,mass:0.6});
  const ly = useSpring(my,{stiffness:60,damping:20,mass:0.6});
  const [type,setType]=useState("default");

  useEffect(()=>{
    const mv=e=>{mx.set(e.clientX);my.set(e.clientY);};
    window.addEventListener("mousemove",mv);
    const els=document.querySelectorAll("[data-p11cur]");
    els.forEach(el=>{
      el.addEventListener("mouseenter",()=>setType(el.dataset.p11cur||"default"));
      el.addEventListener("mouseleave",()=>setType("default"));
    });
    return()=>{
      window.removeEventListener("mousemove",mv);
      els.forEach(el=>{
        el.removeEventListener("mouseenter",()=>{});
        el.removeEventListener("mouseleave",()=>{});
      });
    };
  },[]);

  const size=type==="view"?80:type==="drag"?60:type==="link"?44:14;
  const label=type==="view"?"VIEW":type==="drag"?"DRAG":type==="link"?"↗":"";

  return(
    <>
      <motion.div style={{x:sx,y:sy,position:"fixed",zIndex:9999,pointerEvents:"none",
        translateX:"-50%",translateY:"-50%",
        width:8,height:8,borderRadius:"50%",
        background:type==="default"?C.gold:C.red,
        boxShadow:`0 0 12px ${C.gold}`}}/>
      <motion.div style={{x:lx,y:ly,position:"fixed",zIndex:9998,pointerEvents:"none",
        translateX:"-50%",translateY:"-50%",
        border:`1px solid ${C.gold}`,borderRadius:"50%",
        display:"flex",alignItems:"center",justifyContent:"center"}}
        animate={{width:size,height:size,borderColor:type==="view"?C.red:C.gold,
          background:size>20?`${type==="view"?C.red:C.gold}14`:"transparent"}}
        transition={{type:"spring",stiffness:240,damping:20}}>
        {label&&<span style={{fontSize:9,color:type==="view"?C.red:C.gold,
          letterSpacing:"0.14em",fontFamily:"monospace",whiteSpace:"nowrap"}}>{label}</span>}
      </motion.div>
    </>
  );
}

/* ── NOISE ── */
function P11Grain(){
  return(
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1,opacity:0.065}}>
      <filter id="p11gr"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#p11gr)"/>
    </svg>
  );
}

/* ── GLITCH TEXT ── */
function GlitchText({text,style={}}){
  const [g,setG]=useState(false);
  useEffect(()=>{
    const id=setInterval(()=>{setG(true);setTimeout(()=>setG(false),120);},3500+Math.random()*2000);
    return()=>clearInterval(id);
  },[]);
  return(
    <span style={{position:"relative",display:"inline-block",...style}}>
      {text}
      {g&&<>
        <span style={{position:"absolute",inset:0,color:C.red,
          clipPath:"polygon(0 15%,100% 15%,100% 35%,0 35%)",
          transform:"translateX(-3px)",pointerEvents:"none",mixBlendMode:"screen"}}>{text}</span>
        <span style={{position:"absolute",inset:0,color:C.gold,
          clipPath:"polygon(0 55%,100% 55%,100% 75%,0 75%)",
          transform:"translateX(3px)",pointerEvents:"none",mixBlendMode:"screen"}}>{text}</span>
      </>}
    </span>
  );
}

/* ── SCRAMBLE ── */
function Scramble({text,active}){
  const CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░";
  const [d,setD]=useState(text);
  const fr=useRef(null);
  useEffect(()=>{
    if(!active){setD(text);return;}
    let i=0;const tot=text.length*4;
    const run=()=>{
      setD(text.split("").map((c,idx)=>{
        if(c===" ")return" ";
        if(idx<i/4)return text[idx];
        return CH[Math.floor(Math.random()*CH.length)];
      }).join(""));
      i++;if(i<tot)fr.current=requestAnimationFrame(run);else setD(text);
    };
    fr.current=requestAnimationFrame(run);
    return()=>cancelAnimationFrame(fr.current);
  },[active,text]);
  return<span>{d}</span>;
}

/* ── MAGNETIC BUTTON ── */
function MagBtn({children,style={},onClick}){
  const ref=useRef(null);
  const x=useMotionValue(0),y=useMotionValue(0);
  const bsx=useSpring(x,{stiffness:200,damping:14});
  const bsy=useSpring(y,{stiffness:200,damping:14});
  const move=e=>{
    const r=ref.current.getBoundingClientRect();
    x.set((e.clientX-r.left-r.width/2)*0.28);
    y.set((e.clientY-r.top-r.height/2)*0.28);
  };
  const reset=()=>{x.set(0);y.set(0);};
  return(
    <motion.button ref={ref} data-p11cur="link"
      onMouseMove={move} onMouseLeave={reset}
      onClick={onClick}
      style={{x:bsx,y:bsy,...style,cursor:"none"}}
      whileTap={{scale:0.95}}>
      {children}
    </motion.button>
  );
}

/* ── HORIZONTAL SCROLL WORK SECTION ── */
function WorkScroller(){
  const trackRef=useRef(null);
  const [active,setActive]=useState(0);
  const [hov,setHov]=useState(-1);
  const [err,setErr]=useState({});

  const goTo=useCallback(i=>{
    setActive(i);
    trackRef.current?.children[i]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});
  },[]);

  return(
    <section style={{padding:"100px 0",borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`}}>
      <div style={{padding:"0 52px",marginBottom:52,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
            letterSpacing:"0.28em",textTransform:"uppercase",marginBottom:14}}>§ 01 — Selected Work</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(3rem,7vw,7.5rem)",lineHeight:0.85,letterSpacing:"-0.01em"}}>
            {["WHAT","WE","BUILT."].map((w,i)=>(
              <div key={w} style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:i*0.1,ease:[0.16,1,0.3,1]}}
                  style={{
                    background:i===1?`linear-gradient(110deg,${C.red},${C.gold})`:`linear-gradient(110deg,${C.white},${C.white}80)`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}>{w}</motion.div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,paddingBottom:10}}>
          {WORKS.map((_,i)=>(
            <motion.button key={i} onClick={()=>goTo(i)}
              animate={{width:active===i?32:8,background:active===i?C.gold:C.b3}}
              transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
              style={{height:3,border:"none",borderRadius:999,cursor:"none",padding:0}}/>
          ))}
        </div>
      </div>

      <div ref={trackRef} style={{display:"flex",gap:2,paddingLeft:52,overflowX:"auto",
        scrollbarWidth:"none",cursor:"none"}} data-p11cur="drag">
        {WORKS.map((w,i)=>(
          <motion.div key={w.id}
            onMouseEnter={()=>{setHov(i);setActive(i);}}
            onMouseLeave={()=>setHov(-1)}
            data-p11cur="view"
            initial={{opacity:0,x:60}} whileInView={{opacity:1,x:0}}
            viewport={{once:true,amount:0.3}}
            transition={{duration:0.9,delay:i*0.1,ease:[0.16,1,0.3,1]}}
            animate={{width:hov===i?"480px":"260px"}}
            style={{minWidth:hov===i?"480px":"260px",height:560,
              position:"relative",overflow:"hidden",flexShrink:0,
              border:`1px solid ${C.b2}`,cursor:"none",
              transition:"min-width 0.6s cubic-bezier(0.16,1,0.3,1)"
            }}>
            <motion.div animate={{scale:hov===i?1:1.08}}
              transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
              style={{position:"absolute",inset:0}}>
              {!err[i]
                ?<img src={w.img} alt={w.title} onError={()=>setErr(p=>({...p,[i]:true}))}
                    style={{width:"100%",height:"100%",objectFit:"cover",
                      filter:hov===i?"brightness(0.5) contrast(1.1)":"brightness(0.25) contrast(1.2) saturate(0.3)",
                      transition:"filter 0.6s"}}/>
                :<div style={{width:"100%",height:"100%",
                    background:`linear-gradient(135deg,${C.redDeep},${C.goldDeep})`}}/>
              }
            </motion.div>

            <div style={{position:"absolute",inset:0,
              background:`linear-gradient(to top,${C.bg} 0%,transparent 50%)`,
              zIndex:1}}/>

            <motion.div animate={{y:hov===i?["-5%","110%"]:"-20%"}}
              transition={{repeat:hov===i?Infinity:0,duration:1.8,ease:"linear"}}
              style={{position:"absolute",left:0,right:0,height:2,zIndex:4,
                background:`linear-gradient(90deg,transparent,${C.gold},${C.red},transparent)`,
                filter:"blur(1px)"}}/>

            <div style={{position:"absolute",inset:0,zIndex:2,
              padding:28,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.muted,
                  letterSpacing:"0.22em",background:`${C.bg}99`,
                  padding:"3px 8px",border:`1px solid ${C.b2}`}}>
                  {w.year}
                </span>
                <motion.div animate={{opacity:hov===i?1:0,x:hov===i?0:8}}
                  transition={{duration:0.4}}
                  style={{fontFamily:"monospace",fontSize:9,color:C.gold,
                    letterSpacing:"0.18em",textTransform:"uppercase",
                    background:`${C.red}22`,border:`1px solid ${C.red}44`,
                    padding:"3px 8px"}}>
                  {w.tag}
                </motion.div>
              </div>
              <div>
                <motion.div animate={{opacity:hov===i?1:0,y:hov===i?0:12}}
                  transition={{duration:0.5}}
                  style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,
                    color:C.gold,letterSpacing:"0.24em",textTransform:"uppercase",
                    marginBottom:8}}>
                  {w.sub}
                </motion.div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:hov===i?"clamp(3rem,5vw,5.5rem)":"clamp(2rem,3.5vw,3.5rem)",
                  letterSpacing:"0.04em",lineHeight:0.88,color:C.white,
                  transition:"font-size 0.5s"}}>
                  <Scramble text={w.title} active={hov===i}/>
                </div>
                <motion.div animate={{scaleX:hov===i?1:0,opacity:hov===i?1:0}}
                  transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                  style={{height:1,background:`linear-gradient(90deg,${C.red},${C.gold})`,
                    transformOrigin:"left",marginTop:14,marginBottom:14}}/>
                <motion.div animate={{opacity:hov===i?1:0,y:hov===i?0:10}}
                  transition={{duration:0.4,delay:0.05}}
                  style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,
                    color:C.muted,display:"flex",alignItems:"center",gap:8}}>
                  <span>VIEW PROJECT</span>
                  <span style={{color:C.gold}}>↗</span>
                </motion.div>
              </div>
            </div>

            <div style={{position:"absolute",top:"50%",right:hov===i?-40:-24,
              transform:"translateY(-50%) rotate(90deg)",
              fontFamily:"'Bebas Neue',sans-serif",fontSize:11,
              color:C.muted,letterSpacing:"0.28em",
              transition:"right 0.4s",whiteSpace:"nowrap",zIndex:3}}>
              {w.id} / 04
            </div>
          </motion.div>
        ))}
        <div style={{width:52,flexShrink:0}}/>
      </div>
    </section>
  );
}

/* ── TICKER ── */
function Ticker({items,speed=26,dir=1}){
  const row=[...items,...items,...items];
  return(
    <div style={{overflow:"hidden",borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`}}>
      <motion.div animate={{x:dir>0?["0%","-33.33%"]:["-33.33%","0%"]}}
        transition={{repeat:Infinity,duration:speed,ease:"linear"}}
        style={{display:"flex",width:"max-content"}}>
        {row.map((item,i)=>(
          <div key={i} style={{padding:"12px 30px",borderRight:`1px solid ${C.b2}`,
            fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
            letterSpacing:"0.22em",textTransform:"uppercase",
            color:C.muted,whiteSpace:"nowrap",
            display:"flex",alignItems:"center",gap:10}}>
            <span style={{width:3,height:3,borderRadius:"50%",flexShrink:0,display:"inline-block",
              background:[C.red,C.gold,C.b3][i%3]}}/>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── HERO FRAMES ── */
function HeroFrames(){
  const frames=[
    {src:"https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=700&q=90&fit=crop",
     w:"44%",style:{top:"0%",left:"5%"},rot:-6,float:"p11float0",delay:0},
    {src:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=90&fit=crop",
     w:"42%",style:{top:"22%",right:"3%"},rot:5,float:"p11float1",delay:0.15},
    {src:"https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=700&q=90&fit=crop",
     w:"38%",style:{bottom:"0%",left:"18%"},rot:2,float:"p11float2",delay:0.28},
  ];

  return(
    <div style={{position:"relative",height:560}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at 40% 50%,${C.red}22,transparent 55%),radial-gradient(ellipse at 70% 30%,${C.gold}12,transparent 50%)`,
        filter:"blur(28px)"}}/>

      {frames.map((f,i)=>(
        <motion.div key={i} data-p11cur="view"
          initial={{opacity:0,y:80,rotate:f.rot}}
          animate={{opacity:1,y:0,rotate:f.rot}}
          transition={{duration:1.2,delay:f.delay+0.4,ease:[0.16,1,0.3,1]}}
          whileHover={{y:-18,scale:1.04,rotate:0,zIndex:20}}
          style={{...f.style,position:"absolute",width:f.w,
            animation:`${f.float} ${7+i*1.5}s ease-in-out infinite`,
            boxShadow:`0 40px 100px rgba(0,0,0,0.75),0 0 0 1px ${C.b2},0 0 60px ${i===0?C.red+"22":C.gold+"11"}`,
            overflow:"hidden",cursor:"none",zIndex:i+1}}>

          <img src={f.src} alt="" style={{width:"100%",display:"block",
            filter:"grayscale(45%) contrast(1.1) brightness(0.75) saturate(0.7)"}}
            onError={e=>{e.target.parentElement.style.display="none";}}/>

          <motion.div animate={{y:["-100%","220%"]}}
            transition={{repeat:Infinity,duration:2.5+i*0.9,ease:"linear",delay:i*1.4}}
            style={{position:"absolute",inset:"0 0 auto 0",height:1.5,
              background:`linear-gradient(90deg,transparent,${i===0?C.red:C.gold},transparent)`,
              filter:"blur(0.5px)",opacity:0.9}}/>

          {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos,j)=>(
            <div key={j} style={{position:"absolute",...pos,width:14,height:14,
              borderTop:pos.top===0?`1.5px solid ${j<2?C.red:C.gold}`:"none",
              borderBottom:pos.bottom===0?`1.5px solid ${j>=2?C.red:C.gold}`:"none",
              borderLeft:pos.left===0?`1.5px solid ${C.gold}`:"none",
              borderRight:pos.right===0?`1.5px solid ${C.gold}`:"none",
              opacity:0.8}}/>
          ))}

          <div style={{position:"absolute",bottom:8,right:8,
            background:"rgba(7,5,4,0.85)",border:`1px solid ${C.b2}`,
            padding:"2px 8px",fontFamily:"monospace",fontSize:8,
            color:C.muted,letterSpacing:"0.16em"}}>
            BDH·00{i+1}
          </div>

          <div style={{position:"absolute",top:0,left:0,width:2,bottom:0,
            background:`linear-gradient(180deg,${C.red},${C.gold})`,opacity:0.7}}/>
        </motion.div>
      ))}
    </div>
  );
}

/* ── SERVICES ACCORDION ── */
function ServicesAccordion(){
  const [open,setOpen]=useState(0);
  const svcs=[
    {n:"01",icon:"◈",title:"Mobile App Design",sub:"iOS · Android · React Native",
     desc:"Sıfırdan premium kullanıcı deneyimi. Hızlı, akıcı, güçlü. Sadece güzel görünmez — convert eder.",
     tags:["Figma","React Native","Swift","Kotlin"]},
    {n:"02",icon:"⬡",title:"UI/UX & Prototyping",sub:"Wireframe · Flow · Visual",
     desc:"Kullanıcı akışından piksel detayına eksiksiz tasarım sistemi. Her tıklamanın arkasında bir neden var.",
     tags:["User Research","Wireframe","Prototype","Design System"]},
    {n:"03",icon:"↑",title:"App Store Optimization",sub:"ASO · Growth · Analytics",
     desc:"İndirme sayısını artıran strateji ve büyüme operasyonu. Görünür olmak yeterli değil; doğru kitleye ulaşmak.",
     tags:["ASO","Analytics","A/B Test","Growth"]},
    {n:"04",icon:"⚙",title:"Tech Support & Scale",sub:"Bakım · Performans · Evrim",
     desc:"Ürün canlıyken biz de aktifiz. 24/7 teknik destek, performans izleme ve sürekli büyüme iterasyonları.",
     tags:["Monitoring","CI/CD","Firebase","Scaling"]},
  ];

  return(
    <section style={{padding:"100px 52px",borderBottom:`1px solid ${C.b2}`}}>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
        letterSpacing:"0.28em",textTransform:"uppercase",marginBottom:14}}>§ 02 — Services</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",
        fontSize:"clamp(3rem,7vw,7.5rem)",lineHeight:0.85,marginBottom:64}}>
        {["WHAT","WE DO."].map((w,i)=>(
          <div key={w} style={{overflow:"hidden"}}>
            <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
              transition={{duration:1,delay:i*0.1,ease:[0.16,1,0.3,1]}}
              style={{
                background:i===0?`linear-gradient(110deg,${C.white},${C.white}77)`:`linear-gradient(110deg,${C.red},${C.gold})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
              }}>{w}</motion.div>
          </div>
        ))}
      </div>

      <div style={{borderTop:`1px solid ${C.b2}`}}>
        {svcs.map((s,i)=>(
          <motion.div key={s.n}
            data-p11cur={open===i?"drag":"view"}
            onClick={()=>setOpen(open===i?-1:i)}
            style={{borderBottom:`1px solid ${C.b2}`,cursor:"none",overflow:"hidden"}}>

            <div style={{display:"grid",gridTemplateColumns:"56px 1fr auto 56px",
              alignItems:"center",gap:24,padding:"28px 0",position:"relative"}}>

              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
                color:open===i?C.gold:C.muted,letterSpacing:"0.22em",
                transition:"color 0.3s"}}>{s.n}</span>

              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <motion.span animate={{color:open===i?C.gold:C.b3,scale:open===i?1.1:1}}
                  transition={{duration:0.3}}
                  style={{fontSize:20,display:"inline-block"}}>{s.icon}</motion.span>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"clamp(1.5rem,3vw,2.8rem)",letterSpacing:"0.04em",lineHeight:1,
                  color:open===i?C.white:C.muted,transition:"color 0.3s"}}>
                  {s.title}
                </span>
              </div>

              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
                color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase"}}>
                {s.sub}
              </span>

              <motion.span animate={{rotate:open===i?45:0,color:open===i?C.red:C.muted}}
                transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
                style={{fontSize:22,display:"flex",justifyContent:"flex-end",
                  transformOrigin:"center"}}>
                +
              </motion.span>

              <motion.div animate={{scaleX:open===i?1:0}}
                transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                style={{position:"absolute",bottom:0,left:0,right:0,height:1,
                  background:`linear-gradient(90deg,${C.red},${C.gold},transparent)`,
                  transformOrigin:"left"}}/>
            </div>

            <AnimatePresence>
              {open===i&&(
                <motion.div
                  initial={{height:0,opacity:0}}
                  animate={{height:"auto",opacity:1}}
                  exit={{height:0,opacity:0}}
                  transition={{duration:0.55,ease:[0.16,1,0.3,1]}}>
                  <div style={{paddingBottom:36,paddingLeft:80,display:"grid",
                    gridTemplateColumns:"1fr auto",gap:40,alignItems:"start"}}>
                    <div>
                      <p style={{fontSize:14,color:C.muted,lineHeight:1.9,maxWidth:560,marginBottom:24}}>
                        {s.desc}
                      </p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {s.tags.map((t,j)=>(
                          <motion.span key={t}
                            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                            transition={{delay:j*0.06,duration:0.4}}
                            style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
                              color:C.gold,letterSpacing:"0.18em",textTransform:"uppercase",
                              border:`1px solid ${C.goldDeep}`,
                              padding:"5px 12px"}}>
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <MagBtn
                      style={{background:"transparent",border:`1px solid ${C.b3}`,
                        color:C.muted,padding:"12px 22px",
                        fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
                        letterSpacing:"0.18em",textTransform:"uppercase"}}>
                      DETAILS ↗
                    </MagBtn>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── STATS BAND ── */
function StatsBand(){
  const nums=[["18+","Apps launched"],["4.9★","Store rating"],["24/7","Live support"],["3yr","Experience"]];
  const [vis,setVis]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.4});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return(
    <section ref={ref} style={{padding:"80px 52px",background:C.card,
      borderTop:`1px solid ${C.b2}`,borderBottom:`1px solid ${C.b2}`,
      position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at 15% 50%,${C.red}16,transparent 45%),radial-gradient(ellipse at 85% 50%,${C.gold}10,transparent 45%)`,
        filter:"blur(24px)"}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",position:"relative",zIndex:2}}>
        {nums.map(([v,l],i)=>(
          <motion.div key={l}
            initial={{opacity:0,y:30}} animate={vis?{opacity:1,y:0}:{}}
            transition={{duration:0.7,delay:i*0.1,ease:[0.16,1,0.3,1]}}
            style={{borderRight:i<3?`1px solid ${C.b2}`:"none",
              padding:"0 40px",textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(2.8rem,5vw,5rem)",letterSpacing:"0.02em",lineHeight:0.9,
              background:`linear-gradient(135deg,${C.white},${C.gold})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {v}
            </div>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,
              color:C.muted,letterSpacing:"0.22em",textTransform:"uppercase",marginTop:10}}>
              {l}
            </div>
            <motion.div animate={{scale:[1,1.6,1],opacity:[0.5,1,0.5]}}
              transition={{repeat:Infinity,duration:2+i*0.4,delay:i*0.3}}
              style={{width:4,height:4,borderRadius:"50%",
                background:i%2===0?C.red:C.gold,
                margin:"12px auto 0"}}/>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── PROCESS ── */
function ProcessSection(){
  const steps=[
    {n:"01",emoji:"🔎",title:"DISCOVERY",desc:"Hedef kitle, pazar analizi ve ürün stratejisi. Doğru problemi çözmek."},
    {n:"02",emoji:"✦",title:"DESIGN",desc:"Wireframe'den high-fi prototipe. Her etkileşimin arkasında bir neden."},
    {n:"03",emoji:"⟨⟩",title:"DEVELOP",desc:"React Native ile temiz, ölçeklenebilir, test edilmiş kod."},
    {n:"04",emoji:"🚀",title:"LAUNCH",desc:"App Store, ASO ve büyüme operasyonu. Yayın bitiş değil, başlangıç."},
  ];
  return(
    <section style={{padding:"100px 52px",borderBottom:`1px solid ${C.b2}`}}>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,
        letterSpacing:"0.28em",textTransform:"uppercase",marginBottom:14}}>§ 03 — Process</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",
        fontSize:"clamp(3rem,7vw,7.5rem)",lineHeight:0.85,marginBottom:72,color:C.white}}>
        HOW WE<br/>
        <span style={{background:`linear-gradient(110deg,${C.red},${C.gold})`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>BUILD.</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,
        border:`1px solid ${C.b2}`}}>
        {steps.map((s,i)=>(
          <motion.div key={s.n} data-p11cur="view"
            initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{delay:i*0.1,duration:0.7,ease:[0.16,1,0.3,1]}}
            whileHover="hov"
            style={{borderRight:i<3?`1px solid ${C.b2}`:"none",
              padding:36,position:"relative",overflow:"hidden",cursor:"none"}}>

            <motion.div variants={{hov:{scaleX:1},rest:{scaleX:0}}} initial="rest"
              transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
              style={{position:"absolute",top:0,left:0,right:0,height:2,
                background:`linear-gradient(90deg,${C.red},${C.gold})`,
                transformOrigin:"left",zIndex:2}}/>

            <motion.div variants={{hov:{opacity:1},rest:{opacity:0}}} initial="rest"
              transition={{duration:0.5}}
              style={{position:"absolute",inset:0,
                background:`radial-gradient(ellipse at 50% 100%,${C.red}16,transparent 60%)`,zIndex:0}}/>

            {i<3 && <div style={{position:"absolute",top:"50%",right:-1,width:1,height:28,
              background:`linear-gradient(180deg,transparent,${C.red},transparent)`,
              transform:"translateY(-50%)"}}/>}

            <div className="p11-D" style={{position:"absolute",right:16,top:12,
              fontSize:56,color:C.faint,letterSpacing:"0.02em",lineHeight:1,pointerEvents:"none"}}>
              {s.n}
            </div>

            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:28,marginBottom:22}}>{s.emoji}</div>
              <motion.div variants={{hov:{color:C.gold},rest:{color:C.white}}}
                className="p11-D" style={{fontSize:"clamp(1.4rem,2.2vw,2rem)",letterSpacing:"0.04em",
                  marginBottom:12,lineHeight:1,transition:"color 0.3s"}}>
                {s.title}
              </motion.div>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.85}}>{s.desc}</p>
            </div>

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
  );
}

/* ─────────────── PAGE 11 ─────────────── */
const TICKER_ITEMS = ["React Native","iOS","Android","UI/UX","ASO","Firebase","Figma","Redux","Performance","Strategy"];

export default function Page11() {
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

  return(
    <div className="page11-wrap" style={{background:C.bg,color:C.white,fontFamily:"'IBM Plex Mono',monospace",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .page11-wrap .p11-D{font-family:'Bebas Neue',sans-serif}
        .page11-wrap .p11-I{font-family:'Playfair Display',Georgia,serif;font-style:italic}
        .page11-wrap section{position:relative;z-index:2}
        .page11-wrap *{cursor:none!important}
        .page11-wrap ::selection{background:${C.red};color:#fff}
        @keyframes p11float0{0%,100%{transform:translateY(0px) rotate(-6deg)}50%{transform:translateY(-18px) rotate(-6deg)}}
        @keyframes p11float1{0%,100%{transform:translateY(-10px) rotate(5deg)}50%{transform:translateY(10px) rotate(5deg)}}
        @keyframes p11float2{0%,100%{transform:translateY(0px) rotate(2deg)}50%{transform:translateY(-14px) rotate(2deg)}}
      `}</style>

      <P11Cursor/>
      <P11Grain/>

      {/* ═══ HERO ═══ */}
      <section style={{minHeight:"100vh",paddingTop:100,display:"flex",flexDirection:"column"}}>
        {/* eyebrow */}
        <div style={{
          padding:"10px 52px",borderBottom:`1px solid ${C.b1}`,
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
            <span style={{fontSize:9,color:C.muted,letterSpacing:"0.2em"}}>AVAILABLE FOR PROJECTS</span>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.muted,letterSpacing:"0.1em",marginLeft:16}}>{time}</span>
          </motion.div>
        </div>

        <div style={{
          flex:1,padding:"60px 52px 72px",
          display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:64,alignItems:"center"
        }}>
          {/* LEFT */}
          <div>
            <div className="p11-D" style={{
              fontSize:"clamp(5rem,12vw,12rem)",
              lineHeight:0.82,letterSpacing:"-0.02em",
              marginBottom:36,
            }}>
              <div style={{overflow:"hidden",marginBottom:"0.03em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.1,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>WE</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden",marginBottom:"0.03em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.2,ease:[0.16,1,0.3,1]}}>
                  <GlitchText text="BUILD" style={{
                    background:`linear-gradient(110deg,${C.red} 25%,${C.gold} 85%)`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}/>
                </motion.div>
              </div>
              <div style={{overflow:"hidden",marginBottom:"0.03em"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.3,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>MOBILE</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{duration:1,delay:0.4,ease:[0.16,1,0.3,1]}}>
                  <span style={{WebkitTextStroke:`1.5px ${C.b3}`,color:"transparent"}}>APPS.</span>
                </motion.div>
              </div>
            </div>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              transition={{duration:0.8,delay:0.7,ease:[0.16,1,0.3,1]}}
              style={{fontSize:13,color:C.muted,lineHeight:1.95,maxWidth:440,marginBottom:38}}>
              İstanbul merkezli mobil ürün stüdyosu. iOS, Android ve cross-platform.
              Strateji, tasarım, geliştirme ve büyüme — tek çatı altında.
            </motion.p>

            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.85}}
              style={{display:"flex",gap:14,marginBottom:56}}>
              <MagBtn style={{
                background:C.red,color:"#fff",border:"none",
                padding:"16px 32px",fontFamily:"'IBM Plex Mono',monospace",
                fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",
                display:"flex",alignItems:"center",gap:10,
                boxShadow:`0 0 44px ${C.red}44`}}>
                START A PROJECT <span style={{fontSize:14}}>→</span>
              </MagBtn>
              <MagBtn style={{
                background:"transparent",color:C.muted,
                border:`1px solid ${C.b3}`,padding:"16px 28px",
                fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                letterSpacing:"0.18em",textTransform:"uppercase"}}>
                SEE WORK ↓
              </MagBtn>
            </motion.div>

            {/* stats row */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:0.6}}
              style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,
                borderTop:`1px solid ${C.b2}`,paddingTop:28}}>
              {[["18+","Apps launched"],["4.9★","Store avg."],["24/7","Live support"],["3yr","Track record"]].map(([v,l],i)=>(
                <div key={l} style={{borderRight:i<3?`1px solid ${C.b2}`:"none",paddingRight:20,paddingLeft:i>0?20:0}}>
                  <div className="p11-D" style={{
                    fontSize:"clamp(1.6rem,2.8vw,2.4rem)",letterSpacing:"0.04em",lineHeight:1,
                    background:`linear-gradient(135deg,${C.white},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}>{v}</div>
                  <div style={{fontSize:9,color:C.muted,letterSpacing:"0.18em",textTransform:"uppercase",marginTop:5}}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: FLOATING FRAMES */}
          <motion.div initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} transition={{duration:1.2,delay:0.2,ease:[0.16,1,0.3,1]}}>
            <HeroFrames/>
          </motion.div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <Ticker items={TICKER_ITEMS} speed={26} dir={1}/>
      <Ticker items={[...TICKER_ITEMS].reverse()} speed={34} dir={-1}/>

      {/* ═══ WORK ═══ */}
      <WorkScroller/>

      {/* ═══ STATS ═══ */}
      <StatsBand/>

      {/* ═══ SERVICES ═══ */}
      <ServicesAccordion/>

      {/* ═══ PROCESS ═══ */}
      <ProcessSection/>

      {/* ═══ CTA ═══ */}
      <section style={{padding:"130px 52px 140px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",
          background:`radial-gradient(ellipse at 25% 50%,${C.red}22,transparent 50%),radial-gradient(ellipse at 75% 50%,${C.gold}14,transparent 50%)`,
          filter:"blur(24px)"}}/>
        <div style={{position:"absolute",bottom:0,left:52,right:52,height:1,
          background:`linear-gradient(90deg,transparent,${C.red},${C.gold},transparent)`}}/>

        <div style={{position:"relative",zIndex:2,
          display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:64,alignItems:"end"}}>
          <div>
            <div className="p11-D" style={{fontSize:"clamp(4rem,11vw,11rem)",lineHeight:0.82,letterSpacing:"-0.02em"}}>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.05,ease:[0.16,1,0.3,1]}}>
                  <span style={{color:C.white}}>LET&apos;S</span>
                </motion.div>
              </div>
              <div style={{overflow:"hidden"}}>
                <motion.div initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}}
                  transition={{duration:1,delay:0.15,ease:[0.16,1,0.3,1]}}>
                  <GlitchText text="BUILD" style={{
                    background:`linear-gradient(110deg,${C.red},${C.gold})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
                  }}/>
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
                  <span style={{WebkitTextStroke:`1.5px ${C.b3}`,color:"transparent"}}>APP.</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div style={{paddingBottom:8}}>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.95,marginBottom:36,maxWidth:360}}>
              Fikrinizi ve hedef kitlenizi paylaşın.
              24 saat içinde size özel bir teklif ile dönüyoruz.
            </p>

            {["hello@bullsdigital.com","+90 xxx xxx xx xx","İstanbul, Türkiye"].map((c,i)=>(
              <motion.div key={c}
                initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{delay:0.1+i*0.1,duration:0.6}}
                style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,paddingBottom:12,
                  borderBottom:`1px solid ${C.b1}`}}>
                <div style={{width:4,height:4,borderRadius:"50%",
                  background:[C.red,C.gold,C.muted][i],flexShrink:0}}/>
                <span style={{fontSize:11,color:C.muted,letterSpacing:"0.08em"}}>{c}</span>
              </motion.div>
            ))}

            <div style={{display:"flex",gap:14,marginTop:32}}>
              <MagBtn style={{background:C.red,color:"#fff",border:"none",
                padding:"16px 30px",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                letterSpacing:"0.18em",textTransform:"uppercase",
                display:"flex",alignItems:"center",gap:10,
                boxShadow:`0 0 36px ${C.red}44`}}>
                START NOW →
              </MagBtn>
              <MagBtn style={{background:"transparent",color:C.muted,
                border:`1px solid ${C.b3}`,padding:"16px 24px",
                fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
                letterSpacing:"0.18em",textTransform:"uppercase"}}>
                PORTFOLIO ↗
              </MagBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{borderTop:`1px solid ${C.b2}`,padding:"24px 52px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:24,height:24,
            background:`linear-gradient(135deg,${C.red},${C.gold})`,
            clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="p11-D" style={{fontSize:11,color:"#fff"}}>B</span>
          </div>
          <span className="p11-D" style={{fontSize:15,letterSpacing:"0.1em",color:C.white}}>BULLS DIGITAL HOUSE</span>
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
