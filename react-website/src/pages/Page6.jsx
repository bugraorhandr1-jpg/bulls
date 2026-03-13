import * as React from 'react';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import logo from '../assets/img/ChatGPT Image 2 Ara 2025 14_59_01.png';

/* ═══════════════════════════════════════════════════════
   MUI ↔ Framer-Motion Bridges
   ═══════════════════════════════════════════════════════ */
const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);
const MotionTypography = motion.create(Typography);
const MotionCard = motion.create(Card);

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS — Refined, cinematic easing
   ═══════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 70, filter: 'blur(12px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER — spring physics count-up
   ═══════════════════════════════════════════════════════ */
function useCounter(end, duration = 2200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const numericEnd = parseInt(String(end).replace(/\D/g, ''), 10);
    if (isNaN(numericEnd)) { setCount(end); return; }
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * numericEnd));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView]);

  return { count, ref };
}

/* ═══════════════════════════════════════════════════════
   AURORA BACKGROUND — Cinematic morphing gradient mesh
   ═══════════════════════════════════════════════════════ */
function AuroraBackground() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {/* Primary red aurora */}
      <MotionBox
        animate={{
          x: ['-5%', '8%', '-3%', '6%', '-5%'],
          y: ['-8%', '5%', '-4%', '8%', '-8%'],
          scale: [1, 1.25, 0.85, 1.15, 1],
          rotate: [0, 12, -8, 15, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: '55vw',
          height: '55vh',
          top: '-10%',
          left: '-8%',
          background: 'radial-gradient(ellipse at center, rgba(255,50,50,0.18), transparent 65%)',
          filter: 'blur(90px)',
        }}
      />
      {/* Gold aurora */}
      <MotionBox
        animate={{
          x: ['6%', '-10%', '4%', '-6%', '6%'],
          y: ['4%', '-5%', '10%', '-8%', '4%'],
          scale: [1.1, 0.85, 1.25, 0.95, 1.1],
          rotate: [0, -18, 10, -12, 0],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: '50vw',
          height: '50vh',
          top: '15%',
          right: '-12%',
          background: 'radial-gradient(ellipse at center, rgba(255,170,0,0.14), transparent 65%)',
          filter: 'blur(90px)',
        }}
      />
      {/* Deep bottom aurora */}
      <MotionBox
        animate={{
          x: ['0%', '12%', '-6%', '0%'],
          y: ['0%', '-12%', '6%', '0%'],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: '65vw',
          height: '60vh',
          bottom: '-15%',
          left: '15%',
          background: 'radial-gradient(ellipse at center, rgba(255,60,60,0.10), transparent 55%)',
          filter: 'blur(110px)',
        }}
      />
      {/* Subtle purple depth */}
      <MotionBox
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: '40vw',
          height: '40vh',
          top: '45%',
          left: '3%',
          background: 'radial-gradient(ellipse at center, rgba(100,40,220,0.06), transparent 65%)',
          filter: 'blur(70px)',
        }}
      />
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════
   MOUSE SPOTLIGHT — cursor-following ambient glow
   ═══════════════════════════════════════════════════════ */
function MouseSpotlight({ mouseXPx, mouseYPx }) {
  const sX = useSpring(mouseXPx, { stiffness: 20, damping: 25 });
  const sY = useSpring(mouseYPx, { stiffness: 20, damping: 25 });
  const bg = useTransform([sX, sY], ([x, y]) =>
    `radial-gradient(900px circle at ${x}px ${y}px, rgba(255,70,70,0.035), transparent 65%)`
  );

  return <MotionBox style={{ background: bg }} sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />;
}

MouseSpotlight.propTypes = { mouseXPx: PropTypes.object, mouseYPx: PropTypes.object };

/* ═══════════════════════════════════════════════════════
   NOISE OVERLAY — film grain texture
   ═══════════════════════════════════════════════════════ */
function NoiseOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    const imgData = ctx.createImageData(200, 200);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v;
      imgData.data[i + 3] = 18;
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        width: '100%',
        height: '100%',
        opacity: 0.35,
        mixBlendMode: 'overlay',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   GLOW CARD — Rotating conic-gradient animated border
   ═══════════════════════════════════════════════════════ */
function GlowCard({ children, sx: sxProp, glowColor = 'rgba(255,77,77,0.5)', hover = true }) {
  return (
    <Box sx={{ position: 'relative', borderRadius: 6, p: '1px', overflow: 'hidden', height: '100%', ...sxProp }}>
      {/* Spinning gradient border */}
      <MotionBox
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        sx={{
          position: 'absolute',
          inset: '-120%',
          background: `conic-gradient(from 0deg, transparent 0%, ${glowColor} 8%, transparent 16%, rgba(255,184,0,0.35) 24%, transparent 32%, transparent 100%)`,
          opacity: 0.6,
        }}
      />
      {/* Card body */}
      <MotionCard
        elevation={0}
        whileHover={hover ? { y: -10, transition: { type: 'spring', stiffness: 300, damping: 22 } } : undefined}
        sx={{
          position: 'relative',
          borderRadius: 6,
          background: 'linear-gradient(180deg, rgba(12,12,12,0.97), rgba(6,6,6,0.99))',
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          height: '100%',
          transition: 'box-shadow 0.5s ease',
          '&:hover': hover
            ? { boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 80px rgba(255,77,77,0.06)' }
            : {},
        }}
      >
        {children}
      </MotionCard>
    </Box>
  );
}

GlowCard.propTypes = { children: PropTypes.node, sx: PropTypes.object, glowColor: PropTypes.string, hover: PropTypes.bool };

/* ─── Simple glass card (lighter variant) ─── */
function GlassCard({ children, sx, hover = true }) {
  return (
    <MotionCard
      elevation={0}
      whileHover={
        hover
          ? { y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 300, damping: 22 } }
          : undefined
      }
      sx={{
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 70px rgba(0,0,0,0.35)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        '&:hover': hover
          ? {
              borderColor: 'rgba(255,255,255,0.10)',
              boxShadow: '0 35px 100px rgba(0,0,0,0.5)',
            }
          : {},
        ...sx,
      }}
    >
      {children}
    </MotionCard>
  );
}

GlassCard.propTypes = { children: PropTypes.node, sx: PropTypes.object, hover: PropTypes.bool };

/* ═══════════════════════════════════════════════════════
   SECTION TITLE — with accent-colored eyebrow
   ═══════════════════════════════════════════════════════ */
function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <MotionStack
      ref={ref}
      spacing={2}
      sx={{ maxWidth: 820, mx: align === 'center' ? 'auto' : undefined, textAlign: align }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {eyebrow && (
        <MotionTypography
          variant="overline"
          variants={fadeUp}
          custom={0}
          sx={{
            letterSpacing: '0.3em',
            background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '0.75rem',
          }}
        >
          {eyebrow}
        </MotionTypography>
      )}
      <MotionTypography
        variant="h2"
        variants={fadeUp}
        custom={1}
        sx={{
          fontSize: { xs: '2.2rem', md: '3.6rem' },
          lineHeight: 1,
          letterSpacing: '-0.05em',
          fontWeight: 800,
        }}
      >
        {title}
      </MotionTypography>
      {description && (
        <MotionTypography
          variant="body1"
          variants={fadeUp}
          custom={2}
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.85,
            maxWidth: 680,
          }}
        >
          {description}
        </MotionTypography>
      )}
    </MotionStack>
  );
}

SectionTitle.propTypes = { eyebrow: PropTypes.string, title: PropTypes.string, description: PropTypes.string, align: PropTypes.string };

/* ═══════════════════════════════════════════════════════
   AI VISUAL BLOCK — upgraded generative canvas
   ═══════════════════════════════════════════════════════ */
function AIVisualBlock({ variant = 'red', height = 220 }) {
  const palettes = {
    red: { glow: 'radial-gradient(circle at 28% 28%, rgba(255,50,50,0.35), transparent 55%)', accent: '#ff4d4d' },
    gold: { glow: 'radial-gradient(circle at 72% 28%, rgba(255,170,0,0.30), transparent 55%)', accent: '#ffb800' },
    dark: { glow: 'radial-gradient(circle at 50% 50%, rgba(255,90,40,0.25), transparent 55%)', accent: '#ff6432' },
  };
  const p = palettes[variant] || palettes.red;

  return (
    <Box sx={{ position: 'relative', minHeight: height, overflow: 'hidden', background: '#040404' }}>
      <MotionBox
        animate={{ rotate: [0, 8, -4, 6, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        sx={{ position: 'absolute', inset: 0, background: p.glow, filter: 'blur(25px)' }}
      />
      <MotionBox
        animate={{ y: ['-18%', '120%'] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
        sx={{
          position: 'absolute',
          left: '5%',
          right: '5%',
          height: 90,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)',
          filter: 'blur(10px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 14,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <MotionBox
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            width: '52%',
            height: '52%',
            top: '20%',
            left: '14%',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07), transparent)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            transform: 'rotate(-12deg)',
          }}
        />
        <MotionBox
          animate={{ x: ['8%', '-8%', '8%'], y: ['0%', '5%', '0%'] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            width: '38%',
            height: '38%',
            right: '12%',
            bottom: '16%',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.09), transparent)',
            backdropFilter: 'blur(12px)',
          }}
        />
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />}
          label="AI"
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            bgcolor: alpha(p.accent, 0.14),
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.65rem',
            height: 24,
          }}
        />
      </Box>
    </Box>
  );
}

AIVisualBlock.propTypes = {
  variant: PropTypes.oneOf(['red', 'gold', 'dark']),
  height: PropTypes.number,
};

/* ─── MotionSection — scroll-triggered wrapper ─── */
function MotionSection({ children, className, dataSectionId, sectionRef }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={(el) => {
        ref.current = el;
        if (sectionRef) sectionRef(el);
      }}
      className={className}
      data-section-id={dataSectionId}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  );
}

MotionSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dataSectionId: PropTypes.string,
  sectionRef: PropTypes.func,
};

/* ═══════════════════════════════════════════════════════════
   PAGE 6 — Bulls Digital Studio (Premium Redesign)
   ═══════════════════════════════════════════════════════════ */
export default function Page6({ t }) {
  const s = t.studio || {};

  /* ─── Mouse tracking (spotlight + parallax) ─── */
  const mouseXPx = useMotionValue(0);
  const mouseYPx = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 30 });
  const parallaxX = useTransform(smoothX, [0, 1], [-20, 20]);
  const parallaxY = useTransform(smoothY, [0, 1], [-20, 20]);

  useEffect(() => {
    const h = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
      mouseXPx.set(e.clientX);
      mouseYPx.set(e.clientY);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mouseX, mouseY, mouseXPx, mouseYPx]);

  /* ─── Scroll ─── */
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  /* ─── Data ─── */
  const services = [
    {
      id: '01',
      title: s.svc1Title || 'Mobile App Design',
      description: s.svc1Desc || 'iOS, Android ve cross-platform ürünler için hızlı, güçlü ve premium deneyimler.',
      icon: <PhoneIphoneRoundedIcon fontSize="small" />,
    },
    {
      id: '02',
      title: s.svc2Title || 'Game Production',
      description: s.svc2Desc || 'Konseptten oynanış hissine kadar dikkat çeken, tekrar açtıran dijital deneyimler.',
      icon: <SportsEsportsRoundedIcon fontSize="small" />,
    },
    {
      id: '03',
      title: s.svc3Title || 'Tech Support & Growth',
      description: s.svc3Desc || 'Bakım, performans, yeni özellikler ve ürün evrimi için sürekli teknik destek.',
      icon: <SupportAgentRoundedIcon fontSize="small" />,
    },
  ];

  const highlights = [
    [s.hi1Val || '12+', s.hi1Label || 'Products launched'],
    [s.hi2Val || '3', s.hi2Label || 'Core service lines'],
    [s.hi3Val || '7/24', s.hi3Label || 'Technical support'],
    [s.hi4Val || 'TR / Global', s.hi4Label || 'Delivery reach'],
  ];

  const capabilities = [
    {
      title: s.cap1Title || 'Generative UI',
      desc: s.cap1Desc || 'AI destekli otomatik arayüz oluşturma, akıllı layout düzenleme ve adaptif renk sistemleri.',
      icon: <BrushRoundedIcon />,
      variant: 'red',
    },
    {
      title: s.cap2Title || '3D Visual Engine',
      desc: s.cap2Desc || 'WebGL ve Three.js ile etkileşimli 3D sahneler, parçacık sistemleri ve gerçek zamanlı render.',
      icon: <ViewInArRoundedIcon />,
      variant: 'gold',
    },
    {
      title: s.cap3Title || 'Smart Prototyping',
      desc: s.cap3Desc || 'Doğal dil komutlarından prototip üretimi, akıllı bileşen eşleme ve otomatik flow dizaynı.',
      icon: <SmartToyRoundedIcon />,
      variant: 'dark',
    },
  ];

  const showcaseItems = [
    {
      title: s.sh1Title || 'Neural Dashboard',
      cat: s.sh1Cat || 'SaaS Interface',
      desc: s.sh1Desc || 'Veri yoğun paneller için AI ile üretilmiş adaptif layout ve akıllı widget sistemi.',
      variant: 'red',
    },
    {
      title: s.sh2Title || 'Prism Commerce',
      cat: s.sh2Cat || 'E-Commerce',
      desc: s.sh2Desc || 'Dönüşüm optimize edilmiş ürün kartları, akıllı filtre ve AI görsel öneri motoru.',
      variant: 'gold',
    },
    {
      title: s.sh3Title || 'Echo Health',
      cat: s.sh3Cat || 'Health App',
      desc: s.sh3Desc || 'Hastane dashboard, telemedicine akışları ve AI destekli hasta deneyimi tasarımı.',
      variant: 'dark',
    },
  ];

  const workflow = [
    { title: s.wf1Title || 'Prompt', desc: s.wf1Desc || 'Proje ihtiyacını tanımlayın — renk, mood, bileşen türü ve hedef platform.', icon: <TuneRoundedIcon /> },
    { title: s.wf2Title || 'Generate', desc: s.wf2Desc || 'AI motoru varyantlar üretir: layout, renk paleti, animasyon ve görsel hiyerarşi.', icon: <AutoAwesomeRoundedIcon /> },
    { title: s.wf3Title || 'Refine', desc: s.wf3Desc || 'İnsan gözüyle ince ayar: marka uyumu, erişilebilirlik ve performans kontrolü.', icon: <LayersRoundedIcon /> },
    { title: s.wf4Title || 'Ship', desc: s.wf4Desc || 'Production-ready kod çıktısı. React, MUI, Tailwind — hangi stack isterseniz.', icon: <RocketLaunchRoundedIcon /> },
  ];

  const processItems = [
    { title: s.proc1Title || 'Discover', description: s.proc1Desc || 'Hedef, kullanıcı ve pazar fotoğrafını çıkarıp doğru problemi avlıyoruz.', icon: <AutoAwesomeRoundedIcon /> },
    { title: s.proc2Title || 'Design', description: s.proc2Desc || 'Arayüz, kullanıcı akışı ve marka hissini tek bir net sistemde topluyoruz.', icon: <BlurOnRoundedIcon /> },
    { title: s.proc3Title || 'Build', description: s.proc3Desc || 'React ekosistemiyle sürdürülebilir, temiz ve ölçeklenebilir ürünler geliştiriyoruz.', icon: <CodeRoundedIcon /> },
    { title: s.proc4Title || 'Launch', description: s.proc4Desc || 'Yayın sonrası optimizasyon, bakım ve büyüme iterasyonlarıyla işi diri tutuyoruz.', icon: <RocketLaunchRoundedIcon /> },
  ];

  /* ─── Theme (ultra-dark, refined) ─── */
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#ffffff' },
          secondary: { main: '#ff4d4d' },
          background: { default: '#020202', paper: '#080808' },
          text: { primary: '#f5f5f5', secondary: 'rgba(255,255,255,0.50)' },
        },
        shape: { borderRadius: 24 },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontWeight: 900 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 700 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 999, paddingInline: 28, paddingBlock: 14, fontSize: '0.95rem' },
            },
          },
        },
      }),
    [],
  );

  /* ─── Section refs ─── */
  const svcRef = useRef(null);
  const capRef = useRef(null);
  const showRef = useRef(null);
  const wfRef = useRef(null);
  const procRef = useRef(null);
  const ctaRef = useRef(null);
  const svcInView = useInView(svcRef, { once: true, margin: '-60px' });
  const capInView = useInView(capRef, { once: true, margin: '-60px' });
  const showInView = useInView(showRef, { once: true, margin: '-60px' });
  const wfInView = useInView(wfRef, { once: true, margin: '-60px' });
  const procInView = useInView(procRef, { once: true, margin: '-60px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' });
  const v2CtaRef = useRef(null);
  const v2CtaInView = useInView(v2CtaRef, { once: true, margin: '-60px' });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Scroll progress bar (red → gold gradient) ── */}
        <MotionBox
          style={{ scaleX: scrollYProgress, opacity: headerOpacity }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #ff4d4d, #ffb800)',
            transformOrigin: '0%',
            zIndex: 9999,
          }}
        />

        {/* ── Ambient layers ── */}
        <AuroraBackground />
        <MouseSpotlight mouseXPx={mouseXPx} mouseYPx={mouseYPx} />
        <NoiseOverlay />

        {/* Grid overlay */}
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            opacity: 0.025,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Vignette edges ── */}
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        <Box component="main" sx={{ position: 'relative', zIndex: 4 }}>
          {/* ═══════════════════════════════════════════
              HERO — Cinematic full-viewport intro
              ═══════════════════════════════════════════ */}
          <Container maxWidth="xl" sx={{ pt: { xs: 16, md: 20 }, pb: { xs: 10, md: 16 }, minHeight: { md: '100vh' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
              {/* ── Left: Typography ── */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <MotionStack
                  spacing={4.5}
                  sx={{ pr: { lg: 6 } }}
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {/* Chip */}
                  <MotionBox variants={fadeUp} custom={0}>
                    <motion.div
                      animate={{ boxShadow: ['0 0 0px rgba(255,77,77,0)', '0 0 20px rgba(255,77,77,0.15)', '0 0 0px rgba(255,77,77,0)'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ display: 'inline-block', borderRadius: 999 }}
                    >
                      <Chip
                        icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
                        label={s.heroChip || 'Built for brands that want gravity'}
                        sx={{
                          borderRadius: 999,
                          color: 'rgba(255,255,255,0.7)',
                          bgcolor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          px: 1.5,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      />
                    </motion.div>
                  </MotionBox>

                  {/* Main heading — massive with gradient text */}
                  <MotionBox variants={fadeUp} custom={1} style={{ x: parallaxX, y: parallaxY }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem', lg: '7.5rem' },
                        lineHeight: 0.88,
                        letterSpacing: '-0.07em',
                        maxWidth: 950,
                      }}
                    >
                      {s.heroLine1 || 'We build'}
                      <MotionBox
                        component="span"
                        sx={{
                          display: 'block',
                          background: 'linear-gradient(135deg, #ff4d4d 0%, #ff8c00 40%, #ffb800 70%, #ff4d4d 100%)',
                          backgroundSize: '300% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {s.heroLine2 || 'digital'}
                      </MotionBox>
                      <Box component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>
                        {s.heroLine3 || 'things that hit hard.'}
                      </Box>
                    </Typography>
                  </MotionBox>

                  {/* Description */}
                  <MotionTypography
                    variants={fadeUp}
                    custom={2}
                    variant="body1"
                    sx={{
                      maxWidth: 620,
                      color: 'text.secondary',
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 1.9,
                    }}
                  >
                    {s.heroDesc || 'Bulls Digital Studio; mobil uygulamalar, oyunlar ve modern web sistemleri tasarlar.'}
                  </MotionTypography>

                  {/* CTA Buttons */}
                  <MotionBox variants={fadeUp} custom={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                      <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                        <Button
                          variant="contained"
                          endIcon={<ArrowOutwardRoundedIcon />}
                          sx={{
                            bgcolor: '#fff',
                            color: '#050505',
                            fontWeight: 700,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
                            boxShadow: '0 8px 40px rgba(255,255,255,0.08)',
                          }}
                        >
                          {s.ctaExplore || 'Explore our work'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(255,255,255,0.10)',
                            color: 'text.primary',
                            '&:hover': { borderColor: 'rgba(255,255,255,0.22)', bgcolor: 'rgba(255,255,255,0.03)' },
                          }}
                        >
                          {s.ctaDiscovery || 'Book a discovery call'}
                        </Button>
                      </motion.div>
                    </Stack>
                  </MotionBox>

                  {/* Stats row */}
                  <MotionBox variants={fadeUp} custom={4}>
                    <Grid container spacing={2} sx={{ pt: 3, maxWidth: 900 }}>
                      {highlights.map(([value, label], i) => {
                        const isNum = /^\d/.test(String(value));
                        const suffix = String(value).replace(/[\d]/g, '');
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const { count, ref } = useCounter(value, 2000);
                        return (
                          <Grid key={label} size={{ xs: 6, md: 3 }} ref={ref}>
                            <MotionBox variants={scaleIn} custom={i}>
                              <GlowCard
                                glowColor={i % 2 === 0 ? 'rgba(255,77,77,0.4)' : 'rgba(255,184,0,0.4)'}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Typography
                                    sx={{
                                      fontSize: { xs: '1.6rem', md: '2.2rem' },
                                      fontWeight: 800,
                                      letterSpacing: '-0.06em',
                                      background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}
                                  >
                                    {isNum ? `${count}${suffix}` : value}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.82rem' }}>
                                    {label}
                                  </Typography>
                                </CardContent>
                              </GlowCard>
                            </MotionBox>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </MotionBox>
                </MotionStack>
              </Grid>

              {/* ── Right: Studio Engine card ── */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <MotionBox
                  initial={{ opacity: 0, x: 100, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  sx={{ position: 'relative', height: '100%' }}
                >
                  {/* Ambient glow behind card */}
                  <MotionBox
                    sx={{
                      position: 'absolute',
                      inset: { xs: '-6%', md: '-10%' },
                      background: 'radial-gradient(circle, rgba(255,60,60,0.18), transparent 50%)',
                      filter: 'blur(50px)',
                    }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <GlowCard hover={false} glowColor="rgba(255,77,77,0.5)">
                    <Box
                      sx={{
                        borderRadius: 5,
                        border: '1px solid rgba(255,255,255,0.05)',
                        bgcolor: 'background.paper',
                        p: { xs: 2.5, md: 3 },
                        height: '100%',
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ pb: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{ letterSpacing: '0.3em', color: 'text.secondary', fontSize: '0.68rem' }}
                          >
                            {s.engineEyebrow || 'Live capability'}
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, letterSpacing: '-0.04em', fontWeight: 800 }}>
                            {s.engineTitle || 'Studio Engine'}
                          </Typography>
                        </Box>
                        <motion.div
                          animate={{ boxShadow: ['0 0 0px rgba(255,184,0,0)', '0 0 16px rgba(255,184,0,0.2)', '0 0 0px rgba(255,184,0,0)'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ borderRadius: 999, alignSelf: 'flex-start' }}
                        >
                          <Chip
                            label={s.engineChip || 'Available now'}
                            sx={{
                              bgcolor: alpha('#ffb800', 0.12),
                              color: '#ffd666',
                              border: '1px solid rgba(255,184,0,0.15)',
                              fontWeight: 600,
                            }}
                          />
                        </motion.div>
                      </Stack>

                      <Stack spacing={2} sx={{ mt: 3 }}>
                        {services.map((service, index) => (
                          <GlassCard
                            key={service.title}
                            sx={{
                              transform: { md: `translateX(${index * 10}px)` },
                              '&:hover': {
                                transform: { md: `translateX(${index * 10}px) translateY(-4px)` },
                                borderColor: 'rgba(255,255,255,0.10)',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                  <motion.div
                                    whileHover={{ rotate: 15, scale: 1.15 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                  >
                                    <Avatar
                                      sx={{
                                        bgcolor: alpha('#fff', 0.04),
                                        color: 'text.primary',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                      }}
                                    >
                                      {service.icon}
                                    </Avatar>
                                  </motion.div>
                                  <Box>
                                    <Typography
                                      variant="overline"
                                      sx={{ letterSpacing: '0.25em', color: 'text.secondary', fontSize: '0.65rem' }}
                                    >
                                      {service.id}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                                      {service.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.8, fontSize: '0.85rem' }}
                                    >
                                      {service.description}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <EastRoundedIcon sx={{ color: alpha('#fff', 0.18), mt: 0.5, flexShrink: 0 }} />
                              </Stack>
                            </CardContent>
                          </GlassCard>
                        ))}
                      </Stack>

                      <GlassCard sx={{ mt: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                          >
                            <Box>
                              <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: 'text.secondary', fontSize: '0.65rem' }}>
                                {s.signatureEyebrow || 'Signature style'}
                              </Typography>
                              <Typography variant="h5" sx={{ mt: 1, letterSpacing: '-0.04em', fontWeight: 700 }}>
                                {s.signatureTitle || 'Bold interface. Fast feel.'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <motion.img
                                src={logo}
                                alt="Bulls"
                                style={{ width: 48, height: 48, objectFit: 'contain', opacity: 0.5 }}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                              />
                              <Typography
                                sx={{
                                  fontSize: { xs: '2rem', md: '3rem' },
                                  color: alpha('#fff', 0.12),
                                  fontWeight: 900,
                                  letterSpacing: '-0.08em',
                                }}
                              >
                                BULLS
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </GlassCard>
                    </Box>
                  </GlowCard>
                </MotionBox>
              </Grid>
            </Grid>
          </Container>

          {/* ═══════════════════ MARQUEE STRIP ═══════════════════ */}
          <section className="v2-marquee-section">
            <div className="v2-marquee-track">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="v2-marquee-content">
                  <span>GAME DEVELOPMENT</span>
                  <span className="v2-marquee-dot">◆</span>
                  <span>MOBİL UYGULAMA</span>
                  <span className="v2-marquee-dot">◆</span>
                  <span>UI/UX DESIGN</span>
                  <span className="v2-marquee-dot">◆</span>
                  <span>BACKEND & CLOUD</span>
                  <span className="v2-marquee-dot">◆</span>
                  <span>DİJİTAL ÇÖZÜMLER</span>
                  <span className="v2-marquee-dot">◆</span>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════ SERVICES ═══════════════════ */}
          <Container id="services" maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={svcRef}>
            <SectionTitle
              eyebrow={s.svcEyebrow || 'Services'}
              title={s.svcHeadline || 'Three service lines, one sharp delivery machine.'}
              description={s.svcDesc || 'Tasarım, ürün düşüncesi ve teknik uygulamayı ayrı ayrı değil, tek ritimde çalıştırıyoruz.'}
            />
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {services.map((service, i) => (
                <Grid key={service.title} size={{ xs: 12, md: 4 }}>
                  <MotionBox
                    initial="hidden"
                    animate={svcInView ? 'visible' : 'hidden'}
                    variants={scaleIn}
                    custom={i}
                  >
                    <GlowCard
                      glowColor={
                        i === 0
                          ? 'rgba(255,77,77,0.4)'
                          : i === 1
                          ? 'rgba(255,184,0,0.4)'
                          : 'rgba(255,100,50,0.4)'
                      }
                    >
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack spacing={3}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <motion.div
                              whileHover={{ rotate: 15, scale: 1.15 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Avatar
                                sx={{
                                  width: 56,
                                  height: 56,
                                  bgcolor: alpha(i === 0 ? '#ff4d4d' : i === 1 ? '#ffb800' : '#ff6432', 0.12),
                                  color: i === 0 ? '#ff7b7b' : i === 1 ? '#ffd666' : '#ff9466',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                }}
                              >
                                {service.icon}
                              </Avatar>
                            </motion.div>
                            <Typography
                              sx={{
                                fontSize: '3rem',
                                fontWeight: 900,
                                color: 'rgba(255,255,255,0.04)',
                                letterSpacing: '-0.06em',
                                lineHeight: 1,
                              }}
                            >
                              {service.id}
                            </Typography>
                          </Stack>
                          <Box>
                            <Typography variant="h5" sx={{ letterSpacing: '-0.04em', fontWeight: 700 }}>
                              {service.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.9, fontSize: '0.95rem' }}
                            >
                              {service.description}
                            </Typography>
                          </Box>
                          <motion.div whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Button
                              endIcon={<EastRoundedIcon />}
                              sx={{
                                px: 0,
                                color: 'text.secondary',
                                '&:hover': { color: '#fff' },
                              }}
                            >
                              Learn more
                            </Button>
                          </motion.div>
                        </Stack>
                      </CardContent>
                    </GlowCard>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* ═══════════════════ V2 SERVICES (EMOJI CARDS) ═══════════════════ */}
          <MotionSection className="v2-section is-revealed" dataSectionId="v2-services">
            <div className="v2-section-inner">
              <motion.div className="v2-section-header" variants={fadeUp} custom={0}>
                <span className="v2-tag">{t.home?.servicesTag || 'Hizmetlerimiz'}</span>
                <h2 className="v2-section-title">{t.home?.servicesTitle || 'Neler Yapıyoruz?'}</h2>
                <p className="v2-section-desc">{t.home?.servicesDesc || 'Dijital dünyanın her alanında profesyonel çözümler sunuyoruz.'}</p>
              </motion.div>
              <div className="v2-services-grid">
                {[
                  { emoji: '🎮', title: t.home?.service1Title || 'Oyun Geliştirme', desc: t.home?.service1Desc, link: '/gaming', accent: '#a855f7' },
                  { emoji: '📱', title: t.home?.service2Title || 'Mobil Uygulama', desc: t.home?.service2Desc, link: '/advertising', accent: '#ce1141' },
                  { emoji: '☁️', title: t.home?.service3Title || 'Backend & Cloud', desc: t.home?.service3Desc, link: '/advertising', accent: '#06b6d4' },
                  { emoji: '🎨', title: t.home?.service4Title || 'UI/UX Tasarım', desc: t.home?.service4Desc, link: '/about', accent: '#f59e0b' },
                ].map((svc, i) => (
                  <motion.div key={i} variants={scaleIn} custom={i}>
                    <Link to={svc.link} className="v2-service-card" style={{ '--card-accent': svc.accent }}>
                      <div className="v2-service-card-num">{String(i + 1).padStart(2, '0')}</div>
                      <motion.div
                        className="v2-service-card-icon"
                        whileHover={{ rotate: 12, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {svc.emoji}
                      </motion.div>
                      <h3>{svc.title}</h3>
                      <p>{svc.desc}</p>
                      <span className="v2-service-card-arrow">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 15L15 5m0 0H8m7 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </MotionSection>

          {/* ═══════════════════ AI CAPABILITIES ═══════════════════ */}
          <Container maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={capRef}>
            <SectionTitle
              eyebrow={s.capEyebrow || 'Capabilities'}
              title={s.capHeadline || 'Her visual blok bir AI çıktısı. Her piksel kasıtlı.'}
              description={s.capDesc || 'Generative UI motoru 3 ana dalda çalışır — her biri farklı ihtiyaca cevap verir.'}
            />
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {capabilities.map((cap, i) => (
                <Grid key={cap.title} size={{ xs: 12, md: 4 }}>
                  <MotionBox
                    initial="hidden"
                    animate={capInView ? 'visible' : 'hidden'}
                    variants={scaleIn}
                    custom={i}
                  >
                    <GlowCard
                      glowColor={
                        cap.variant === 'red'
                          ? 'rgba(255,77,77,0.45)'
                          : cap.variant === 'gold'
                          ? 'rgba(255,184,0,0.45)'
                          : 'rgba(255,100,50,0.45)'
                      }
                    >
                      <AIVisualBlock variant={cap.variant} height={190} />
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack spacing={2.5}>
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.15 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Avatar
                              sx={{
                                width: 52,
                                height: 52,
                                bgcolor:
                                  cap.variant === 'red'
                                    ? alpha('#ff4d4d', 0.12)
                                    : cap.variant === 'gold'
                                    ? alpha('#ffb800', 0.12)
                                    : alpha('#ff6432', 0.12),
                                color:
                                  cap.variant === 'red'
                                    ? '#ff7b7b'
                                    : cap.variant === 'gold'
                                    ? '#ffd666'
                                    : '#ff9466',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {cap.icon}
                            </Avatar>
                          </motion.div>
                          <Box>
                            <Typography variant="h5" sx={{ letterSpacing: '-0.04em', fontWeight: 700 }}>
                              {cap.title}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.9, fontSize: '0.95rem' }}>
                              {cap.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </GlowCard>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* ═══════════════════ WHY US ═══════════════════ */}
          <MotionSection className="v2-section v2-section-alt is-revealed" dataSectionId="whyus">
            <div className="v2-section-inner">
              <div className="v2-whyus-layout">
                <motion.div className="v2-whyus-left" variants={fadeUp} custom={0}>
                  <span className="v2-tag">{t.home?.whyTag || 'Neden Biz?'}</span>
                  <h2 className="v2-section-title v2-text-left">{t.home?.whyTitle || 'Farkımız Ne?'}</h2>
                  <p className="v2-section-desc v2-text-left">{t.home?.whyDesc || 'Deneyim, teknoloji ve tutku ile projelerinizi hayata geçiriyoruz.'}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/about" className="v2-btn v2-btn-outline v2-mt-32">
                      <span>{t.home?.whyLearnMore || 'Daha Fazla'}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
                <div className="v2-whyus-right">
                  {[
                    { icon: '⚡', title: t.home?.why1Title || 'Hızlı Teslimat', desc: t.home?.why1Desc },
                    { icon: '🔒', title: t.home?.why2Title || 'Güvenilir Kod', desc: t.home?.why2Desc },
                    { icon: '📊', title: t.home?.why3Title || 'Veri Odaklı', desc: t.home?.why3Desc },
                    { icon: '🤝', title: t.home?.why4Title || 'Sürekli Destek', desc: t.home?.why4Desc },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="v2-whyus-card"
                      variants={fadeUp}
                      custom={i + 1}
                      whileHover={{ x: 8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="v2-whyus-card-icon">{item.icon}</div>
                      <div className="v2-whyus-card-body">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </MotionSection>

          {/* ═══════════════════ SHOWCASE ═══════════════════ */}
          <Container maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={showRef}>
            <SectionTitle
              eyebrow={s.showEyebrow || s.workEyebrow || 'Showcase'}
              title={s.showHeadline || s.workHeadline || 'AI visual ile üretilen gerçek projeler.'}
              description={s.showDesc || s.workDesc || 'Her kart gerçek bir proje çıktısı — AI visual bloklar doğrudan ürün akışına entegre.'}
            />
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {showcaseItems.map((item, i) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <MotionBox
                    initial="hidden"
                    animate={showInView ? 'visible' : 'hidden'}
                    variants={fadeUp}
                    custom={i}
                  >
                    <GlowCard
                      glowColor={
                        item.variant === 'red'
                          ? 'rgba(255,77,77,0.45)'
                          : item.variant === 'gold'
                          ? 'rgba(255,184,0,0.45)'
                          : 'rgba(255,100,50,0.45)'
                      }
                    >
                      <AIVisualBlock variant={item.variant} height={210} />
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Chip
                          label={item.cat}
                          size="small"
                          sx={{
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.04)',
                            color: 'text.secondary',
                            border: '1px solid rgba(255,255,255,0.06)',
                            fontSize: '0.72rem',
                          }}
                        />
                        <Typography variant="h5" sx={{ letterSpacing: '-0.04em', fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.9, fontSize: '0.95rem' }}>
                          {item.desc}
                        </Typography>
                        <motion.div whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Button
                            endIcon={<ArrowOutwardRoundedIcon />}
                            sx={{ mt: 2.5, px: 0, color: 'text.secondary', '&:hover': { color: '#fff' } }}
                          >
                            {s.viewProject || 'Projeyi İncele'}
                          </Button>
                        </motion.div>
                      </CardContent>
                    </GlowCard>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* ═══════════════════ TECH STACK ═══════════════════ */}
          <MotionSection className="v2-section is-revealed" dataSectionId="tech">
            <div className="v2-section-inner">
              <motion.div className="v2-section-header" variants={fadeUp} custom={0}>
                <span className="v2-tag">{t.home?.techTag || 'Teknolojiler'}</span>
                <h2 className="v2-section-title">{t.home?.techTitle || 'Kullandığımız Teknolojiler'}</h2>
              </motion.div>
              <div className="v2-tech-grid">
                {['React', 'React Native', 'Flutter', 'Unity', 'Unreal Engine', 'Node.js', 'Python', 'Swift', 'Kotlin', 'AWS', 'Docker', 'Figma'].map((tech, i) => (
                  <motion.div
                    key={i}
                    className="v2-tech-item"
                    variants={scaleIn}
                    custom={i}
                    whileHover={{ y: -6, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="v2-tech-name">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </MotionSection>

          {/* ═══════════════════ WORKFLOW — Timeline ═══════════════════ */}
          <Container maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={wfRef}>
            <SectionTitle
              eyebrow={s.wfEyebrow || 'Workflow'}
              title={s.wfHeadline || 'Prompt → Generate → Refine → Ship.'}
              description={s.wfDesc || '4 adımda AI visual entegrasyonu. Hızlı iterasyon, yüksek kalite çıktı.'}
            />

            {/* Horizontal connecting line */}
            <Box sx={{ position: 'relative', mt: 5 }}>
              <MotionBox
                initial={{ scaleX: 0 }}
                animate={wfInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  position: 'absolute',
                  top: 36,
                  left: '6%',
                  right: '6%',
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(255,77,77,0.3), rgba(255,184,0,0.2), rgba(255,77,77,0.3))',
                  transformOrigin: '0%',
                  zIndex: 0,
                }}
              />

              <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                {workflow.map((step, index) => (
                  <Grid key={step.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <MotionBox
                      initial="hidden"
                      animate={wfInView ? 'visible' : 'hidden'}
                      variants={fadeUp}
                      custom={index}
                    >
                      <GlowCard
                        glowColor={index % 2 === 0 ? 'rgba(255,77,77,0.35)' : 'rgba(255,184,0,0.35)'}
                      >
                        <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                          <Stack spacing={3}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 200, duration: 0.5 }}
                              >
                                <Avatar
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: 'text.primary',
                                  }}
                                >
                                  {step.icon}
                                </Avatar>
                              </motion.div>
                              <MotionTypography
                                sx={{
                                  fontSize: '2.5rem',
                                  fontWeight: 900,
                                  background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  letterSpacing: '-0.06em',
                                  lineHeight: 1,
                                }}
                                animate={wfInView ? { opacity: [0, 1] } : {}}
                                transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                              >
                                0{index + 1}
                              </MotionTypography>
                            </Stack>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                              <Typography
                                variant="body2"
                                sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.9, fontSize: '0.88rem' }}
                              >
                                {step.desc}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </GlowCard>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>

          {/* ═══════════════════ PROCESS ═══════════════════ */}
          <Container id="process" maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={procRef}>
            <SectionTitle
              eyebrow={s.procEyebrow || 'Process'}
              title={s.procHeadline || 'Clear process, less chaos.'}
              description={s.procDesc || 'Hızlı karar, net tasarım, sağlam uygulama ve sürdürülebilir yayın akışı kuruyoruz.'}
            />
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {processItems.map((item, index) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <MotionBox
                    initial="hidden"
                    animate={procInView ? 'visible' : 'hidden'}
                    variants={fadeUp}
                    custom={index}
                  >
                    <GlowCard
                      glowColor={index % 2 === 0 ? 'rgba(255,77,77,0.35)' : 'rgba(255,184,0,0.35)'}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                        <Stack spacing={3}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.2 }}
                              transition={{ type: 'spring', stiffness: 200, duration: 0.5 }}
                            >
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  color: 'text.primary',
                                }}
                              >
                                {item.icon}
                              </Avatar>
                            </motion.div>
                            <Typography
                              sx={{
                                fontSize: '2.5rem',
                                fontWeight: 900,
                                color: 'rgba(255,255,255,0.04)',
                                letterSpacing: '-0.06em',
                                lineHeight: 1,
                              }}
                            >
                              0{index + 1}
                            </Typography>
                          </Stack>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                            <Typography
                              variant="body2"
                              sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.9, fontSize: '0.88rem' }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </GlowCard>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* ═══════════════════ V2 CTA BANNER ═══════════════════ */}
          <section className="v2-section v2-cta-section" ref={v2CtaRef}>
            <div className="v2-section-inner">
              <motion.div
                className="v2-cta-card"
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={v2CtaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="v2-cta-glow"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <h2>{t.home?.ctaTitle || 'Projenizi Hayata Geçirelim'}</h2>
                <p>{t.home?.ctaDesc || 'Ücretsiz danışmanlık için hemen iletişime geçin. 24 saat içinde size dönüş yapalım.'}</p>
                <div className="v2-cta-buttons">
                  <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/about" className="v2-btn v2-btn-primary v2-btn-lg">
                      <span>{t.home?.ctaBtn1 || 'İletişime Geçin'}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/gaming" className="v2-btn v2-btn-ghost">
                      <span>{t.home?.ctaBtn2 || 'Projelerimizi İnceleyin'}</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══════════════════ CONTACT CTA ═══════════════════ */}
          <Container maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }} ref={ctaRef}>
            <MotionBox
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlowCard hover={false} glowColor="rgba(255,77,77,0.5)">
                <CardContent sx={{ p: { xs: 4, md: 7 }, position: 'relative', overflow: 'hidden' }}>
                  {/* CTA ambient glow */}
                  <MotionBox
                    sx={{
                      position: 'absolute',
                      top: '-40%',
                      left: '50%',
                      width: 600,
                      height: 500,
                      background: 'radial-gradient(circle, rgba(255,60,60,0.14), transparent 55%)',
                      pointerEvents: 'none',
                      transform: 'translateX(-50%)',
                    }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <Grid container spacing={5} alignItems="center" sx={{ position: 'relative' }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={2.5}>
                        <Typography
                          variant="overline"
                          sx={{
                            letterSpacing: '0.3em',
                            background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {s.contactEyebrow || 'Contact'}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{
                            fontSize: { xs: '2rem', md: '3.5rem' },
                            lineHeight: 1,
                            letterSpacing: '-0.05em',
                            fontWeight: 800,
                          }}
                        >
                          {s.contactTitle || "Ready to build something that doesn't look like everyone else?"}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9, maxWidth: 640, fontSize: '1.05rem' }}>
                          {s.contactDesc || 'İster iletişim formu, ister WhatsApp butonu — en hızlı yolu seçin, biz buradayız.'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Stack spacing={2.5} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
                        <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowOutwardRoundedIcon />}
                            sx={{
                              bgcolor: '#fff',
                              color: '#050505',
                              fontWeight: 700,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
                              boxShadow: '0 8px 40px rgba(255,255,255,0.08)',
                            }}
                          >
                            {s.contactCta || 'Start your project'}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                          <Button
                            variant="outlined"
                            size="large"
                            sx={{
                              borderColor: 'rgba(255,255,255,0.10)',
                              color: 'text.primary',
                              '&:hover': { borderColor: 'rgba(255,255,255,0.20)', bgcolor: 'rgba(255,255,255,0.03)' },
                            }}
                          >
                            {s.contactEmail || 'hello@bullsdigitalstudio.com'}
                          </Button>
                        </motion.div>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlowCard>
            </MotionBox>
          </Container>
        </Box>

        {/* ═══════════════════════════════════════════
            FOOTER — Premium integrated
            ═══════════════════════════════════════════ */}
        <Box
          component="footer"
          sx={{
            position: 'relative',
            pt: 12,
            pb: 5,
            overflow: 'hidden',
          }}
        >
          {/* Top gradient separator */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '5%',
              right: '5%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,77,77,0.35) 30%, rgba(255,184,0,0.25) 70%, transparent 100%)',
            }}
          />

          <Container maxWidth="xl">
            <Grid container spacing={{ xs: 5, md: 8 }}>
              {/* Brand */}
              <Grid size={{ xs: 12, md: 4 }}>
                <MotionBox
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <motion.img
                        src={logo}
                        alt="Bulls"
                        style={{ width: 44, height: 44, objectFit: 'contain' }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>
                        Bulls Digital Studio
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.85, maxWidth: 320, fontSize: '0.9rem' }}>
                      {t.footer?.aboutText || 'Modern web çözümleri sunan profesyonel ekip.'}
                    </Typography>

                    {/* Social icons */}
                    <Stack direction="row" spacing={1.2}>
                      {[
                        { label: 'Instagram', href: 'https://instagram.com', path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a6.7 6.7 0 002.126-1.384 6.7 6.7 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a6.7 6.7 0 00-1.384-2.126A6.7 6.7 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.8 3.8 0 01-.899 1.382 3.74 3.74 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.72 3.72 0 01-1.379-.899 3.64 3.64 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z' },
                        { label: 'LinkedIn', href: 'https://linkedin.com', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 11-.001-4.128 2.064 2.064 0 01.001 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                        { label: 'Behance', href: 'https://behance.net', path: 'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z' },
                        { label: 'Dribbble', href: 'https://dribbble.com', path: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zm7.56-7.872c.282.386 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-2.13-1.9-4.93-3.058-8.01-3.058-.39 0-.78.03-1.18.076zm10.02 4.476c-.218.3-1.91 2.533-5.724 4.073.236.484.46.976.67 1.473.073.17.14.34.204.51 3.39-.43 6.75.26 7.09.33-.02-2.42-.88-4.64-2.24-6.39z' },
                        { label: 'Twitter', href: 'https://twitter.com', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                      ].map((social) => (
                        <motion.div key={social.label} whileHover={{ y: -4, scale: 1.15 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <IconButton
                            component="a"
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            sx={{
                              color: 'text.secondary',
                              border: '1px solid rgba(255,255,255,0.06)',
                              transition: 'all 0.3s',
                              '&:hover': {
                                color: '#fff',
                                borderColor: 'rgba(255,255,255,0.15)',
                                bgcolor: 'rgba(255,255,255,0.04)',
                                boxShadow: '0 4px 20px rgba(255,77,77,0.1)',
                              },
                            }}
                            size="small"
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
                          </IconButton>
                        </motion.div>
                      ))}
                    </Stack>
                  </Stack>
                </MotionBox>
              </Grid>

              {/* Services */}
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <MotionBox
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: '0.25em',
                      background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      mb: 2.5,
                      display: 'block',
                    }}
                  >
                    {t.footer?.services || 'Hizmetler'}
                  </Typography>
                  <Stack spacing={1.8}>
                    {[
                      { label: 'Game Development', href: '/gaming' },
                      { label: 'Mobile Apps', href: '/advertising' },
                      { label: 'UI/UX Design', href: '/about' },
                      { label: 'Consulting', href: '/about' },
                    ].map((link) => (
                      <motion.div key={link.label} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <MuiLink
                          href={link.href}
                          underline="none"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.88rem',
                            '&:hover': { color: '#fff' },
                            transition: 'color 0.3s',
                          }}
                        >
                          {link.label}
                        </MuiLink>
                      </motion.div>
                    ))}
                  </Stack>
                </MotionBox>
              </Grid>

              {/* Company */}
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <MotionBox
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: '0.25em',
                      background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      mb: 2.5,
                      display: 'block',
                    }}
                  >
                    {t.footer?.company || 'Şirket'}
                  </Typography>
                  <Stack spacing={1.8}>
                    {[
                      { label: 'About Us', href: '/about' },
                      { label: 'Our Team', href: '/about' },
                      { label: 'Careers', href: '/about' },
                    ].map((link) => (
                      <motion.div key={link.label} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <MuiLink
                          href={link.href}
                          underline="none"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.88rem',
                            '&:hover': { color: '#fff' },
                            transition: 'color 0.3s',
                          }}
                        >
                          {link.label}
                        </MuiLink>
                      </motion.div>
                    ))}
                  </Stack>
                </MotionBox>
              </Grid>

              {/* Contact */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <MotionBox
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: '0.25em',
                      background: 'linear-gradient(135deg, #ff4d4d, #ffb800)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      mb: 2.5,
                      display: 'block',
                    }}
                  >
                    {t.footer?.contact || 'İletişim'}
                  </Typography>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,77,77,0.08)',
                          border: '1px solid rgba(255,77,77,0.12)',
                          fontSize: '1rem',
                        }}
                      >
                        📧
                      </Box>
                      <MuiLink
                        href="mailto:info@bullsdigital.com"
                        underline="none"
                        sx={{ color: 'text.secondary', fontSize: '0.88rem', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}
                      >
                        info@bullsdigital.com
                      </MuiLink>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,184,0,0.08)',
                          border: '1px solid rgba(255,184,0,0.12)',
                          fontSize: '1rem',
                        }}
                      >
                        📱
                      </Box>
                      <MuiLink
                        href="tel:+905551234567"
                        underline="none"
                        sx={{ color: 'text.secondary', fontSize: '0.88rem', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}
                      >
                        +90 555 123 45 67
                      </MuiLink>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255,100,50,0.08)',
                          border: '1px solid rgba(255,100,50,0.12)',
                          fontSize: '1rem',
                        }}
                      >
                        📍
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                        Istanbul, Turkey
                      </Typography>
                    </Stack>
                  </Stack>
                </MotionBox>
              </Grid>
            </Grid>

            {/* Bottom bar */}
            <Divider
              sx={{
                borderColor: 'rgba(255,255,255,0.04)',
                mt: 10,
                mb: 4,
              }}
            />
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'center', md: 'center' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <motion.img
                  src={logo}
                  alt="Bulls"
                  style={{ width: 22, height: 22, objectFit: 'contain', opacity: 0.3 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.82rem' }}>
                  {t.footer?.copyright || '© 2026 Bulls Digital Studio'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={4}>
                {['Privacy Policy', 'Terms of Service'].map((name) => (
                  <motion.div key={name} whileHover={{ y: -2 }}>
                    <MuiLink
                      href="#"
                      underline="none"
                      sx={{
                        color: 'rgba(255,255,255,0.30)',
                        fontSize: '0.82rem',
                        '&:hover': { color: 'text.secondary' },
                        transition: 'color 0.3s',
                      }}
                    >
                      {name}
                    </MuiLink>
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Page6.propTypes = { t: PropTypes.object.isRequired };
