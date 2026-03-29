import { useEffect, useRef } from "react";
import Matter from "matter-js";

/* ─── badge dimensions ─── */
const BW = 160, BH = 240;
const N  = 20;       // rope segment count
const LW = 22, HALF = 11;

/* ─── badge textures ─── */
function makeBadgeCanvas(side) {
  const W = BW * 2, H = BH * 2;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");

  if (side === "front") {
    x.fillStyle = "#111"; x.fillRect(0, 0, W, H);

    // top bar
    const bar = x.createLinearGradient(0,0,W,0);
    bar.addColorStop(0,"#e8220a"); bar.addColorStop(1,"#f5a800");
    x.fillStyle = bar; x.fillRect(0, 0, W, 8);

    // hole
    x.fillStyle = "#0a0a0a";
    x.beginPath(); x.arc(W/2, 36, 16, 0, Math.PI*2); x.fill();
    x.strokeStyle = "rgba(245,168,0,0.5)"; x.lineWidth = 2; x.stroke();

    // ghost letter
    x.font = "bold 380px Arial Black"; x.textAlign = "right"; x.textBaseline = "top";
    x.fillStyle = "rgba(255,255,255,0.04)"; x.fillText("B", W+20, 0);

    // hex logo
    const hx=70, hy=120, hr=36;
    x.beginPath();
    for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;x[i===0?"moveTo":"lineTo"](hx+hr*Math.cos(a),hy+hr*Math.sin(a));}
    x.closePath();
    const hg = x.createLinearGradient(hx-hr,hy-hr,hx+hr,hy+hr);
    hg.addColorStop(0,"#e8220a"); hg.addColorStop(1,"#f5a800");
    x.fillStyle=hg; x.fill();
    x.fillStyle="#fff"; x.font="bold 28px Arial"; x.textAlign="center"; x.textBaseline="middle";
    x.fillText("B", hx, hy);

    // text
    x.fillStyle="rgba(237,232,220,0.5)"; x.font="500 13px monospace"; x.textAlign="left";
    x.fillText("BULLS DIGITAL HOUSE", 120, 98);
    x.fillStyle="rgba(245,168,0,0.5)"; x.font="10px monospace";
    x.fillText("COMING SOON · 2026", 120, 122);
    x.fillStyle="rgba(237,232,220,0.35)"; x.textAlign="right";
    x.font="11px monospace"; x.fillText("SEP 01 2026", W-30, 90);
    x.fillStyle="rgba(245,168,0,0.4)"; x.fillText("ISTANBUL", W-30, 112);

    // divider
    x.strokeStyle="rgba(255,255,255,0.07)"; x.lineWidth=1;
    x.beginPath(); x.moveTo(30,165); x.lineTo(W-30,165); x.stroke();

    // big name
    x.fillStyle="#ede8dc"; x.font="bold 58px Arial Narrow"; x.textAlign="left";
    x.fillText("Bulls",   30, 410);
    x.fillText("Digital", 30, 478);
    x.fillText("House",   30, 546);

    x.fillStyle="rgba(237,232,220,0.35)"; x.font="11px monospace";
    x.fillText("VİRTÜEL KATILIMCI", 30, 592);

    x.strokeStyle="rgba(255,255,255,0.07)"; x.lineWidth=1;
    x.beginPath(); x.moveTo(30,614); x.lineTo(W-30,614); x.stroke();

    x.fillStyle="rgba(237,232,220,0.25)"; x.font="10px monospace";
    x.fillText("BULLSDIGITAL.COM", 30, 636);

    // border
    x.strokeStyle="rgba(245,168,0,0.18)"; x.lineWidth=3;
    x.strokeRect(2,2,W-4,H-4);

    x.fillStyle="rgba(255,255,255,0.12)"; x.font="10px monospace"; x.textAlign="center";
    x.fillText("TAP TO FLIP ↺", W/2, H-14);

  } else {
    x.fillStyle="#0e0e0e"; x.fillRect(0,0,W,H);

    const bar=x.createLinearGradient(0,0,W,0);
    bar.addColorStop(0,"#f5a800"); bar.addColorStop(1,"#e8220a");
    x.fillStyle=bar; x.fillRect(0,H-8,W,8);

    // barcode
    const bars=[3,1,2,1,3,2,1,3,1,2,3,1,2,1,3,2,1,2,3,1,2,3,1];
    let bx=50;
    bars.forEach((w,i)=>{
      x.fillStyle=i%2===0?"rgba(245,168,0,0.7)":"#0e0e0e";
      x.fillRect(bx,70,w*12,90); bx+=w*12;
    });
    x.fillStyle="rgba(237,232,220,0.28)"; x.font="10px monospace"; x.textAlign="center";
    x.fillText("BDH-2026-VIRTUAL", W/2,182);

    [["STÜDYO","Bulls Digital House"],["KONUM","Istanbul, TR"],["UZMANLIK","Mobile · Design · Growth"],["İLETİŞİM","hello@bullsdigital.com"]].forEach(([l,v],i)=>{
      const y=230+i*95;
      x.fillStyle="rgba(237,232,220,0.28)"; x.font="10px monospace"; x.textAlign="left"; x.fillText(l,44,y);
      x.fillStyle="rgba(237,232,220,0.85)"; x.font="bold 15px monospace"; x.fillText(v,44,y+22);
      x.strokeStyle="rgba(255,255,255,0.06)"; x.lineWidth=1;
      x.beginPath(); x.moveTo(44,y+40); x.lineTo(W-44,y+40); x.stroke();
    });

    x.strokeStyle="rgba(232,34,10,0.2)"; x.lineWidth=3; x.strokeRect(2,2,W-4,H-4);
    x.fillStyle="rgba(255,255,255,0.12)"; x.font="10px monospace"; x.textAlign="center";
    x.fillText("TAP TO FLIP ↺", W/2, H-14);
  }
  return c;
}

/* ─── catmull-rom + arc helpers ─── */
function catmull(pts, steps=200) {
  const sp=[];
  for(let t=0;t<=steps;t++){
    const f=t/steps*(pts.length-1);
    const ii=Math.min(Math.floor(f),pts.length-2), u=f-ii;
    const p0=pts[Math.max(ii-1,0)],p1=pts[ii],p2=pts[ii+1],p3=pts[Math.min(ii+2,pts.length-1)];
    sp.push({
      x:.5*((2*p1.x)+(-p0.x+p2.x)*u+(2*p0.x-5*p1.x+4*p2.x-p3.x)*u*u+(-p0.x+3*p1.x-3*p2.x+p3.x)*u*u*u),
      y:.5*((2*p1.y)+(-p0.y+p2.y)*u+(2*p0.y-5*p1.y+4*p2.y-p3.y)*u*u+(-p0.y+3*p1.y-3*p2.y+p3.y)*u*u*u),
    });
  }
  return sp;
}
function arcLengths(sp){
  const c=[0];
  for(let i=1;i<sp.length;i++){
    const dx=sp[i].x-sp[i-1].x,dy=sp[i].y-sp[i-1].y;
    c.push(c[i-1]+Math.sqrt(dx*dx+dy*dy));
  }
  return c;
}
function pointAtDist(sp,cumLen,d){
  let lo=0,hi=cumLen.length-1;
  while(lo<hi-1){ const mid=(lo+hi)>>1; cumLen[mid]<d?lo=mid:hi=mid; }
  const frac=(d-cumLen[lo])/Math.max(cumLen[hi]-cumLen[lo],0.001);
  const a=sp[lo],b=sp[Math.min(hi,sp.length-1)];
  return { x:a.x*(1-frac)+b.x*frac, y:a.y*(1-frac)+b.y*frac, tx:b.x-a.x, ty:b.y-a.y };
}

/* ─── draw lanyard ribbon ─── */
function drawLanyard(ctx, sp, cumLen, totalArc) {
  ctx.save();
  ctx.beginPath(); ctx.moveTo(sp[0].x,sp[0].y);
  for(let i=1;i<sp.length;i++) ctx.lineTo(sp[i].x,sp[i].y);
  ctx.strokeStyle="rgba(0,0,0,0.5)";
  ctx.lineWidth=LW+10; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.stroke();
  ctx.restore();

  for(let i=0;i<sp.length-1;i++){
    const a=sp[i],b=sp[i+1];
    const dx=b.x-a.x, dy=b.y-a.y;
    const len=Math.sqrt(dx*dx+dy*dy);
    if(len<0.05) continue;
    ctx.save();
    ctx.translate(a.x,a.y); ctx.rotate(Math.atan2(dy,dx));
    ctx.fillStyle="#0d0d0d"; ctx.fillRect(0,-HALF,len+0.5,LW);
    ctx.fillStyle="rgba(255,255,255,0.13)"; ctx.fillRect(0,-HALF,len+0.5,2.5);
    ctx.fillStyle="rgba(0,0,0,0.45)"; ctx.fillRect(0,HALF-3,len+0.5,3);
    ctx.restore();
  }

  const LABEL="BULLS DIGITAL HOUSE  ·  ";
  ctx.font=`bold 8.5px "IBM Plex Mono",monospace`;
  ctx.textBaseline="middle"; ctx.textAlign="left";
  const charW=[];
  for(const ch of LABEL) charW.push(ctx.measureText(ch).width+0.8);

  let dist=10, ci=0;
  while(dist < totalArc - 10){
    const idx=ci%LABEL.length, cw=charW[idx], mid=dist+cw/2;
    if(mid>totalArc-10) break;
    const {x,y,tx,ty}=pointAtDist(sp,cumLen,mid);
    ctx.save();
    ctx.translate(x,y); ctx.rotate(Math.atan2(ty,tx));
    ctx.fillStyle="rgba(0,0,0,0.9)"; ctx.fillText(LABEL[idx],-cw/2+1,1);
    ctx.fillStyle="rgba(255,255,255,0.88)"; ctx.fillText(LABEL[idx],-cw/2,0);
    ctx.restore();
    dist+=cw; ci++;
  }
}

/* ─── main component ─── */
export default function Lanyard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv  = canvasRef.current;
    const ctx = cv.getContext("2d");

    const frontTex = makeBadgeCanvas("front");
    const backTex  = makeBadgeCanvas("back");

    const { Engine, World, Bodies, Body, Constraint, Events,
            Mouse, MouseConstraint, Runner } = Matter;

    const engine = Engine.create({ gravity: { x:0, y:0.34 } });
    engine.constraintIterations = 4;
    const world  = engine.world;
    const runner = Runner.create();

    let segBodies   = [];
    let constraints = [];
    let badgeBody   = null;
    let restConstraint = null;
    let mouseConstraint = null;
    let flipped      = false;
    let flipProgress = 0;
    let dragStartPos = null;
    let releaseSpringTimer = null;
    let beforeUpdateHandler = null;
    let mouseDownHandler = null;
    let mouseUpHandler = null;

    function build() {
      if(beforeUpdateHandler) Events.off(engine, "beforeUpdate", beforeUpdateHandler);
      if(mouseConstraint && mouseDownHandler) Events.off(mouseConstraint, "mousedown", mouseDownHandler);
      if(mouseConstraint && mouseUpHandler) Events.off(mouseConstraint, "mouseup", mouseUpHandler);
      beforeUpdateHandler = null;
      mouseDownHandler = null;
      mouseUpHandler = null;
      if(releaseSpringTimer){ clearTimeout(releaseSpringTimer); releaseSpringTimer = null; }

      if(segBodies.length)    World.remove(world, segBodies);
      if(constraints.length)  World.remove(world, constraints);
      if(badgeBody)           World.remove(world, badgeBody);
      if(mouseConstraint)     World.remove(world, mouseConstraint);
      segBodies=[]; constraints=[];

      const aX = cv.width/2, aY = 30;
      /* rope length: badge center sits exactly at cv.height/2 */
      const segLen = Math.max(1, (cv.height / 2 - aY - BH / 2)) / N;

      /* rope segment bodies */
      for(let i=0;i<N;i++){
        const b = Bodies.rectangle(aX, aY+i*segLen, 8, 8, {
          chamfer: { radius: 2.2 },
          frictionAir: 0.035,
          friction: 0.5,
          restitution: 0.05,
          density: 0.0016,
          collisionFilter: { category: 0x0002, mask: 0x0001 | 0x0002 },
          render: { visible:false }
        });
        if(i===0) Body.setStatic(b, true);
        segBodies.push(b);
      }

      /* badge body */
      badgeBody = Bodies.rectangle(aX, aY+N*segLen+BH/2, BW, BH, {
        frictionAir: 0.03,
        friction: 0.55,
        restitution: 0.05,
        collisionFilter: { category:0x0001, mask:0x0001 },
        render: { visible:false }
      });

      World.add(world, [...segBodies, badgeBody]);

      /* segment constraints */
      for(let i=0;i<N-1;i++){
        constraints.push(Constraint.create({
          bodyA: segBodies[i], bodyB: segBodies[i+1],
          length: segLen, stiffness: 0.98,
          render: { visible:false }
        }));
      }
      /* last segment → badge top */
      constraints.push(Constraint.create({
        bodyA: segBodies[N-1],
        bodyB: badgeBody,
        pointB: { x:0, y:-BH/2 },
        length: 1, stiffness: 0.98,
        render: { visible:false }
      }));
      /* rest constraint: badge is softly pinned to screen center → returns there when released */
      restConstraint = Constraint.create({
        pointA: { x: aX, y: cv.height / 2 },
        bodyB: badgeBody,
        length: 0,
        stiffness: 0.0018,
        damping: 0.08,
        render: { visible: false },
      });
      constraints.push(restConstraint);
      World.add(world, constraints);

      /* mouse */
      const mouse = Mouse.create(cv);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness:0.22, render:{ visible:false } },
        collisionFilter: { mask:0x0001 }
      });
      World.add(world, mouseConstraint);

      /* tap to flip + fling */
      let mousePosHistory = [];
      beforeUpdateHandler = () => {
        if(mouseConstraint.body === badgeBody){
          mousePosHistory.push({ x: mouseConstraint.mouse.position.x, y: mouseConstraint.mouse.position.y, t: Date.now() });
          if(mousePosHistory.length > 6) mousePosHistory.shift();
        }
      };
      Events.on(engine, "beforeUpdate", beforeUpdateHandler);

      mouseDownHandler = (e) => {
        if(mouseConstraint.body === badgeBody){
          if(releaseSpringTimer){ clearTimeout(releaseSpringTimer); releaseSpringTimer = null; }
          if(restConstraint){
            restConstraint.stiffness = 0.0002;
            restConstraint.damping = 0.02;
          }
          dragStartPos = { x:e.mouse.position.x, y:e.mouse.position.y };
          mousePosHistory = [];
        }
      };
      Events.on(mouseConstraint, "mousedown", mouseDownHandler);

      mouseUpHandler = (e) => {
        if(dragStartPos){
          const dx=e.mouse.position.x-dragStartPos.x;
          const dy=e.mouse.position.y-dragStartPos.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<8){
            flipped=!flipped;
          } else if(mousePosHistory.length>=2 && badgeBody){
            /* fling: apply velocity based on last mouse movement */
            const a=mousePosHistory[0], b=mousePosHistory[mousePosHistory.length-1];
            const dt=Math.max((b.t-a.t)/1000, 0.016);
            const maxSpeed = 26;
            const vx=Math.max(-maxSpeed, Math.min(maxSpeed, (b.x-a.x)/dt*0.019));
            const vy=Math.max(-maxSpeed, Math.min(maxSpeed, (b.y-a.y)/dt*0.019));
            Body.setVelocity(badgeBody, { x:vx, y:vy });
          }
        }
        releaseSpringTimer = setTimeout(() => {
          if(restConstraint){
            restConstraint.stiffness = 0.0018;
            restConstraint.damping = 0.08;
          }
          releaseSpringTimer = null;
        }, 140);
        dragStartPos=null;
        mousePosHistory=[];
      };
      Events.on(mouseConstraint, "mouseup", mouseUpHandler);

      /* initial swing */
      setTimeout(()=>{
        if(!badgeBody) return;
        Body.applyForce(badgeBody, badgeBody.position, { x:0.015, y:-0.005 });
        segBodies.slice(1).forEach((b,i)=>{
          Body.applyForce(b, b.position, { x:Math.sin(i/N*Math.PI)*0.001, y:0 });
        });
      }, 300);
    }

    function resize(){
      cv.width  = cv.parentElement.offsetWidth;
      cv.height = cv.parentElement.offsetHeight;
      build();
    }

    resize();
    Runner.run(runner, engine);

    /* draw loop */
    let raf;
    function draw() {
      ctx.clearRect(0,0,cv.width,cv.height);

      /* anchor bar */
      const ax=cv.width/2, ay=30;
      ctx.fillStyle="#1e1e1e";
      ctx.beginPath(); ctx.roundRect(ax-28,0,56,20,[0,0,7,7]); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="bold 7px monospace";
      ctx.textAlign="center"; ctx.fillText("BULLS",ax,13);
      ctx.beginPath(); ctx.arc(ax,ay+4,10,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=3.5; ctx.stroke();
      ctx.strokeStyle="rgba(0,0,0,0.4)"; ctx.lineWidth=1.5; ctx.stroke();

      if(!segBodies.length || !badgeBody){ raf=requestAnimationFrame(draw); return; }

      /* rope */
      const pts = segBodies.map(b=>({ x:b.position.x, y:b.position.y }));
      pts.push({ x:badgeBody.position.x, y:badgeBody.position.y - BH/2 });
      const sp=catmull(pts);
      const cumLen=arcLengths(sp);
      drawLanyard(ctx, sp, cumLen, cumLen[cumLen.length-1]);

      /* badge position + angle from physics */
      const bx=badgeBody.position.x, by=badgeBody.position.y;
      const angle=badgeBody.angle;

      flipProgress+=((flipped?1:0)-flipProgress)*0.1;
      const scaleX=flipProgress<0.5?1-flipProgress*2:(flipProgress-0.5)*2;
      const showBack=flipProgress>=0.5;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(angle);

      /* D-ring kanca — badge transform içinde */
      {
        const hy=-BH/2;
        ctx.save();
        ctx.shadowColor="rgba(0,0,0,0.5)"; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
        const mg=ctx.createLinearGradient(-13,hy,13,hy);
        mg.addColorStop(0,"#2a2a2a"); mg.addColorStop(0.3,"#888");
        mg.addColorStop(0.5,"#ddd"); mg.addColorStop(0.7,"#888"); mg.addColorStop(1,"#2a2a2a");
        ctx.fillStyle=mg;
        ctx.beginPath(); ctx.roundRect(-13,hy,26,30,5); ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,0.22)"; ctx.lineWidth=1; ctx.stroke();
        ctx.shadowColor="transparent";
        ctx.fillStyle="rgba(0,0,0,0.65)";
        ctx.beginPath(); ctx.roundRect(-8,hy+5,16,20,3); ctx.fill();
        ctx.beginPath(); ctx.arc(0,hy,12,Math.PI,0);
        ctx.strokeStyle="#444"; ctx.lineWidth=6; ctx.stroke();
        ctx.beginPath(); ctx.arc(0,hy,12,Math.PI,0);
        ctx.strokeStyle="#bbb"; ctx.lineWidth=2; ctx.stroke();
        ctx.fillStyle="rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.roundRect(-12,hy,4,30,3); ctx.fill();
        ctx.restore();
      }

      /* badge image */
      ctx.scale(scaleX,1);
      ctx.shadowColor="rgba(0,0,0,0.55)"; ctx.shadowBlur=32; ctx.shadowOffsetY=12;
      ctx.drawImage(showBack?backTex:frontTex,-BW/2,-BH/2,BW,BH);
      ctx.shadowColor="transparent";
      if(mouseConstraint && mouseConstraint.body===badgeBody){
        ctx.strokeStyle="rgba(245,168,0,0.45)"; ctx.lineWidth=2;
        ctx.shadowColor="#f5a800"; ctx.shadowBlur=16;
        ctx.strokeRect(-BW/2,-BH/2,BW,BH);
      }
      ctx.restore();

      raf=requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener("resize", resize);
    return ()=>{
      if(beforeUpdateHandler) Events.off(engine, "beforeUpdate", beforeUpdateHandler);
      if(mouseConstraint && mouseDownHandler) Events.off(mouseConstraint, "mousedown", mouseDownHandler);
      if(mouseConstraint && mouseUpHandler) Events.off(mouseConstraint, "mouseup", mouseUpHandler);
      if(releaseSpringTimer){ clearTimeout(releaseSpringTimer); releaseSpringTimer = null; }
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(world, false);
      window.removeEventListener("resize", resize);
    };
  },[]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
    />
  );
}
