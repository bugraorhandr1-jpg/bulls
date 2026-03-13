import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';
import logo from '../assets/img/ChatGPT Image 2 Ara 2025 14_59_01.png';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

/* ─── Floating orbs background (red / yellow theme) ─── */
function FloatingOrbs() {
  const orbs = [
    { size: 420, x: '10%', y: '5%', color: 'rgba(255,77,77,0.14)', dur: 22 },
    { size: 320, x: '75%', y: '12%', color: 'rgba(255,184,0,0.12)', dur: 28 },
    { size: 500, x: '50%', y: '68%', color: 'rgba(255,77,77,0.08)', dur: 25 },
    { size: 220, x: '88%', y: '60%', color: 'rgba(255,184,0,0.10)', dur: 20 },
    { size: 280, x: '20%', y: '50%', color: 'rgba(255,77,77,0.08)', dur: 30 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}, transparent 65%)`,
            filter: 'blur(40px)',
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 20, -40, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
          }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Particle field ─── */
function ParticleField() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 8 + 12,
    delay: Math.random() * 5,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── MotionSection — scroll-triggered reveal wrapper ─── */
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

function Hero({ t }) {
  const [loaded, setLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [statCounts, setStatCounts] = useState({ projects: 0, clients: 0, years: 0 });

  /* ─── Mouse parallax ─── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const parallaxX = useTransform(smoothX, [0, 1], [-15, 15]);
  const parallaxY = useTransform(smoothY, [0, 1], [-15, 15]);

  useEffect(() => {
    const h = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mouseX, mouseY]);

  /* ─── Scroll progress bar ─── */
  const { scrollYProgress } = useScroll();
  const progressOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const words = [
    t.hero.feature1,
    t.hero.feature2,
    t.hero.feature3,
  ];

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words.length]);

  // Stat counter
  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => {
      const targets = { projects: 50, clients: 30, years: 5 };
      const duration = 2000;
      const steps = 60;
      const stepInterval = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setStatCounts({
          projects: Math.round(eased * targets.projects),
          clients: Math.round(eased * targets.clients),
          years: Math.round(eased * targets.years),
        });
        if (step >= steps) clearInterval(timer);
      }, stepInterval);
    }, 800);
    return () => clearTimeout(timeout);
  }, [loaded]);

  /* ─── inView refs for CTA ─── */
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' });

  return (
    <>
      {/* ── Scroll progress bar (red → yellow) ── */}
      <motion.div
        style={{ scaleX: scrollYProgress, opacity: progressOpacity }}
        className="v2-scroll-progress"
      />

      {/* ===== HERO ===== */}
      <section className="v2-hero" style={{ position: 'relative' }}>
        {/* Background layers */}
        <div className="v2-hero-bg">
          <div className="v2-hero-gradient"></div>
          <div className="v2-hero-glow v2-hero-glow-1"></div>
          <div className="v2-hero-glow v2-hero-glow-2"></div>
        </div>
        <FloatingOrbs />
        <ParticleField />

        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <motion.div
          className={`v2-hero-content ${loaded ? 'is-visible' : ''}`}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Tag pill */}
          <motion.div className="v2-hero-tag" variants={fadeUp} custom={0}>
            <img src={logo} alt="" className="v2-hero-tag-logo" />
            <span>Bulls Digital Studio</span>
          </motion.div>

          {/* Headline with parallax */}
          <motion.div variants={fadeUp} custom={1} style={{ x: parallaxX, y: parallaxY }}>
            <h1 className="v2-hero-headline">
              <span className="v2-hero-headline-line">{t.home?.heroLine1 || 'Dijital Dünyada'}</span>
              <span className="v2-hero-headline-accent">
                <span className="v2-word-rotator">
                  <span key={wordIndex} className="v2-word-slide">{words[wordIndex]}</span>
                </span>
              </span>
              <span className="v2-hero-headline-line">{t.home?.heroLine3 || 'ile Fark Yaratıyoruz.'}</span>
            </h1>
          </motion.div>

          <motion.p className="v2-hero-subtitle" variants={fadeUp} custom={2}>
            {t.hero.subtitle}
          </motion.p>

          {/* CTA buttons with hover animations */}
          <motion.div className="v2-hero-ctas" variants={fadeUp} custom={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/about" className="v2-btn v2-btn-primary">
                <span>{t.home?.ctaBtn1 || 'İletişime Geçin'}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/gaming" className="v2-btn v2-btn-ghost">
                <span>{t.home?.ctaBtn2 || 'Projelerimizi İnceleyin'}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div className="v2-hero-stats" variants={fadeUp} custom={4}>
            <motion.div className="v2-stat" variants={scaleIn} custom={0}>
              <span className="v2-stat-number">{statCounts.projects}+</span>
              <span className="v2-stat-label">{t.home?.statProjects || 'Proje'}</span>
            </motion.div>
            <div className="v2-stat-divider"></div>
            <motion.div className="v2-stat" variants={scaleIn} custom={1}>
              <span className="v2-stat-number">{statCounts.clients}+</span>
              <span className="v2-stat-label">{t.home?.statClients || 'Müşteri'}</span>
            </motion.div>
            <div className="v2-stat-divider"></div>
            <motion.div className="v2-stat" variants={scaleIn} custom={2}>
              <span className="v2-stat-number">{statCounts.years}+</span>
              <span className="v2-stat-label">{t.home?.statYears || 'Yıl Tecrübe'}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`v2-scroll-indicator ${loaded ? 'is-visible' : ''}`}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="v2-scroll-line"></div>
          <span>SCROLL</span>
        </motion.div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
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

      {/* ===== SERVICES ===== */}
      <MotionSection
        className="v2-section is-revealed"
        dataSectionId="services"
      >
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 15L15 5m0 0H8m7 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ===== WHY US ===== */}
      <MotionSection
        className="v2-section v2-section-alt is-revealed"
        dataSectionId="whyus"
      >
        <div className="v2-section-inner">
          <div className="v2-whyus-layout">
            <motion.div className="v2-whyus-left" variants={fadeUp} custom={0}>
              <span className="v2-tag">{t.home?.whyTag || 'Neden Biz?'}</span>
              <h2 className="v2-section-title v2-text-left">{t.home?.whyTitle || 'Farkımız Ne?'}</h2>
              <p className="v2-section-desc v2-text-left">{t.home?.whyDesc || 'Deneyim, teknoloji ve tutku ile projelerinizi hayata geçiriyoruz.'}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/about" className="v2-btn v2-btn-outline v2-mt-32">
                  <span>{t.home?.whyLearnMore || 'Daha Fazla'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      {/* ===== TECH STACK ===== */}
      <MotionSection
        className="v2-section is-revealed"
        dataSectionId="tech"
      >
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
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="v2-tech-name">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ===== PROCESS ===== */}
      <MotionSection
        className="v2-section v2-section-alt is-revealed"
        dataSectionId="process"
      >
        <div className="v2-section-inner">
          <motion.div className="v2-section-header" variants={fadeUp} custom={0}>
            <span className="v2-tag">{t.home?.processTag || 'Sürecimiz'}</span>
            <h2 className="v2-section-title">{t.home?.processTitle || 'Nasıl Çalışıyoruz?'}</h2>
          </motion.div>
          <div className="v2-process-grid">
            {[
              { num: '01', title: t.home?.step1Title || 'Keşif & Analiz', desc: t.home?.step1Desc },
              { num: '02', title: t.home?.step2Title || 'Tasarım & Planlama', desc: t.home?.step2Desc },
              { num: '03', title: t.home?.step3Title || 'Geliştirme & Test', desc: t.home?.step3Desc },
              { num: '04', title: t.home?.step4Title || 'Lansman & Destek', desc: t.home?.step4Desc },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="v2-process-card"
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ backgroundColor: 'rgba(206, 17, 65, 0.04)' }}
              >
                <div className="v2-process-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="v2-process-line"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ===== CTA BANNER ===== */}
      <section
        className="v2-section v2-cta-section"
        ref={ctaRef}
      >
        <div className="v2-section-inner">
          <motion.div
            className="v2-cta-card"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
    </>
  );
}

Hero.propTypes = {
  t: PropTypes.shape({
    hero: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      cta: PropTypes.string,
      feature1: PropTypes.string,
      feature2: PropTypes.string,
      feature3: PropTypes.string,
    }),
  }).isRequired,
};

export default Hero;
