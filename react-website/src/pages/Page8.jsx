import { useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { alpha, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import BlurOnRoundedIcon from "@mui/icons-material/BlurOnRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import GradientRoundedIcon from "@mui/icons-material/GradientRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import PropTypes from "prop-types";

/* ── DATA ── */
const services = [
  {
    id: "01",
    title: "Mobile App Design",
    description:
      "iOS, Android ve cross-platform ürünler için hızlı, güçlü ve premium deneyimler.",
    icon: <PhoneIphoneRoundedIcon fontSize="small" />,
  },
  {
    id: "02",
    title: "Game Production",
    description:
      "Konseptten oynanış hissine kadar dikkat çeken, tekrar açtıran dijital deneyimler.",
    icon: <SportsEsportsRoundedIcon fontSize="small" />,
  },
  {
    id: "03",
    title: "Tech Support & Growth",
    description:
      "Bakım, performans, yeni özellikler ve ürün evrimi için sürekli teknik destek.",
    icon: <SupportAgentRoundedIcon fontSize="small" />,
  },
];

const highlights = [
  ["12+", "Products launched"],
  ["3", "Core service lines"],
  ["24/7", "Technical support"],
  ["TR / Global", "Delivery reach"],
];

const processItems = [
  {
    title: "Discover",
    description:
      "Hedef, kullanıcı ve pazar fotoğrafını çıkarıp doğru problemi avlıyoruz.",
    icon: <AutoAwesomeRoundedIcon />,
  },
  {
    title: "Design",
    description:
      "Arayüz, kullanıcı akışı ve marka hissini tek bir net sistemde topluyoruz.",
    icon: <BlurOnRoundedIcon />,
  },
  {
    title: "Build",
    description:
      "React ekosistemiyle sürdürülebilir, temiz ve ölçeklenebilir ürünler geliştiriyoruz.",
    icon: <CodeRoundedIcon />,
  },
  {
    title: "Launch",
    description:
      "Yayın sonrası optimizasyon, bakım ve büyüme iterasyonlarıyla işi diri tutuyoruz.",
    icon: <RocketLaunchRoundedIcon />,
  },
];

const projects = [
  {
    title: "Pulse Commerce",
    category: "Mobile Product",
    description:
      "Yüksek dönüşüm odaklı commerce deneyimi. Hızlı checkout, güçlü kullanıcı akışı.",
    variant: "red",
  },
  {
    title: "Neon Rally",
    category: "Game Concept",
    description:
      "Yüksek tempolu, parlak kimlikli arcade oyun deneyimi için tasarlanan vitrin.",
    variant: "blue",
  },
  {
    title: "Orbit Ops",
    category: "Support System",
    description:
      "Operasyon ekipleri için modern dashboard ve daha temiz karar akışı.",
    variant: "green",
  },
];

const aiGalleryItems = [
  {
    title: "Mobile product concept art",
    description:
      "Karanlık zemin, neon yansıma ve cam yüzey hissi ile app-first bir vitrin tonu.",
    variant: "red",
  },
  {
    title: "Game scene direction",
    description:
      "Daha hızlı, daha arcade, daha parlak enerji veren oyun odaklı soyut sahne dili.",
    variant: "blue",
  },
  {
    title: "Support dashboard atmosphere",
    description:
      "Teknik destek ve sistem görünürlüğü tarafına daha stabil ve kontrol hissi veren ton.",
    variant: "green",
  },
  {
    title: "Launch cinematic frame",
    description:
      "Ürün açılış sahnesi gibi çalışan, sinematik geçişli premium ekran dili.",
    variant: "red",
  },
  {
    title: "Code shell abstraction",
    description:
      "Kod penceresi ile cihaz hissini aynı sahnede birleştiren daha teknik yön.",
    variant: "blue",
  },
  {
    title: "System pulse visual",
    description:
      "Arka planda canlılık ve altyapı hissi veren veri akışı benzeri kompozisyon.",
    variant: "green",
  },
];

const capabilityItems = [
  { label: "Interface Systems", icon: <HubRoundedIcon fontSize="small" /> },
  { label: "Motion Layers", icon: <GradientRoundedIcon fontSize="small" /> },
  {
    label: "Realtime Support",
    icon: <SupportAgentRoundedIcon fontSize="small" />,
  },
  { label: "Engine Thinking", icon: <MemoryRoundedIcon fontSize="small" /> },
];

const marqueeItems = [
  { label: "React Native", icon: <PhoneIphoneRoundedIcon fontSize="small" /> },
  {
    label: "Game Systems",
    icon: <SportsEsportsRoundedIcon fontSize="small" />,
  },
  { label: "UI Motion", icon: <GradientRoundedIcon fontSize="small" /> },
  {
    label: "Technical Support",
    icon: <SupportAgentRoundedIcon fontSize="small" />,
  },
  { label: "Launch Ops", icon: <BoltRoundedIcon fontSize="small" /> },
  { label: "Global Delivery", icon: <PublicRoundedIcon fontSize="small" /> },
  { label: "3D Direction", icon: <ViewInArRoundedIcon fontSize="small" /> },
];

/* ── Variants ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── GlassCard ── */
function GlassCard({ children, sx, motionProps }) {
  return (
    <motion.div {...motionProps}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          ...sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
}

GlassCard.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  motionProps: PropTypes.object,
};

/* ── SectionTitle ── */
function SectionTitle({ eyebrow, title, description }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <motion.div variants={itemVariants}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.28em", color: "text.secondary" }}
          >
            {eyebrow}
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3.25rem" },
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.05rem" },
              lineHeight: 1.85,
            }}
          >
            {description}
          </Typography>
        </motion.div>
      </Stack>
    </motion.div>
  );
}

SectionTitle.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

/* ── FrameShell ── */
function FrameShell() {
  return (
    <>
      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 20,
          borderRadius: "40px",
          zIndex: 1,
          "@keyframes orbitalRotate": {
            "0%": { transform: "rotate(0deg) scale(1)" },
            "50%": { transform: "rotate(180deg) scale(1.025)" },
            "100%": { transform: "rotate(360deg) scale(1)" },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "-22%",
            borderRadius: "50%",
            background:
              "conic-gradient(from 180deg, rgba(255,255,255,0) 0deg, rgba(86,177,255,0.18) 70deg, rgba(255,255,255,0) 120deg, rgba(255,77,77,0.16) 200deg, rgba(255,255,255,0) 260deg, rgba(255,255,255,0.10) 320deg, rgba(255,255,255,0) 360deg)",
            filter: "blur(18px)",
            opacity: 0.75,
            animation: "orbitalRotate 16s linear infinite",
          }}
        />
      </Box>

      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 26,
          borderRadius: "38px",
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 35%, rgba(86,177,255,0.05) 65%, rgba(255,77,77,0.05))",
          maskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          padding: "1px",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      />

      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 44,
          borderRadius: "28px",
          border: "1px dashed rgba(255,255,255,0.08)",
          opacity: 0.55,
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 1,
          "@keyframes diagonalSweep": {
            "0%": {
              transform: "translateX(-120%) translateY(20%) rotate(-18deg)",
              opacity: 0,
            },
            "18%": { opacity: 0.55 },
            "100%": {
              transform: "translateX(130%) translateY(-10%) rotate(-18deg)",
              opacity: 0,
            },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-8%",
            bottom: "-8%",
            width: 180,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(86,177,255,0.12), rgba(255,255,255,0))",
            filter: "blur(12px)",
            animation: "diagonalSweep 9s linear infinite",
          }}
        />
      </Box>
    </>
  );
}

/* ── MagneticButton ── */
function MagneticButton({ children, sx, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (event) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left - rect.width / 2;
    const py = event.clientY - rect.top - rect.height / 2;
    x.set(px * 0.14);
    y.set(py * 0.14);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <Button {...props} sx={sx}>
        {children}
      </Button>
    </motion.div>
  );
}

MagneticButton.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

/* ── FloatingOrbs ── */
function FloatingOrbs({ mouseX, mouseY }) {
  const orb1X = useTransform(mouseX, [-300, 300], [-24, 24]);
  const orb1Y = useTransform(mouseY, [-300, 300], [-18, 18]);
  const orb2X = useTransform(mouseX, [-300, 300], [18, -18]);
  const orb2Y = useTransform(mouseY, [-300, 300], [24, -24]);

  return (
    <>
      <motion.div
        style={{ x: orb1X, y: orb1Y, position: "absolute" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            top: "8%",
            left: "-6%",
            background:
              "radial-gradient(circle, rgba(255,77,77,0.24), rgba(255,77,77,0) 70%)",
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
      <motion.div
        style={{ x: orb2X, y: orb2Y, position: "absolute" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.8, 0.45] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            bottom: "-8%",
            right: "-8%",
            background:
              "radial-gradient(circle, rgba(86,177,255,0.14), rgba(255,255,255,0) 72%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </>
  );
}

FloatingOrbs.propTypes = { mouseX: PropTypes.object, mouseY: PropTypes.object };

/* ── AnimatedMarquee ── */
function AnimatedMarquee() {
  const row = [...marqueeItems, ...marqueeItems];

  return (
    <Box sx={{ position: "relative", overflow: "hidden", mt: { xs: 6, md: 8 } }}>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background:
            "linear-gradient(90deg, #050505 0%, rgba(5,5,5,0) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background:
            "linear-gradient(270deg, #050505 0%, rgba(5,5,5,0) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        style={{ display: "flex", gap: 16, width: "max-content" }}
      >
        {row.map((item, index) => (
          <Chip
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            sx={{
              height: 48,
              px: 1.5,
              borderRadius: 999,
              color: "text.primary",
              bgcolor: alpha("#fff", 0.05),
              border: "1px solid rgba(255,255,255,0.1)",
              "& .MuiChip-icon": { color: alpha("#fff", 0.7) },
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
}

/* ── AIVisualBlock ── */
function AIVisualBlock({ variant = "red", height = 220 }) {
  const palettes = {
    red: {
      glow: "radial-gradient(circle at 24% 30%, rgba(255,77,77,0.30), transparent 30%), radial-gradient(circle at 76% 72%, rgba(255,255,255,0.10), transparent 26%)",
      line: "linear-gradient(135deg, rgba(255,77,77,0.18), rgba(255,255,255,0.04))",
      chip: "rgba(255,77,77,0.16)",
      accent: "#ff6b6b",
    },
    blue: {
      glow: "radial-gradient(circle at 24% 30%, rgba(86,177,255,0.28), transparent 30%), radial-gradient(circle at 76% 72%, rgba(255,255,255,0.10), transparent 26%)",
      line: "linear-gradient(135deg, rgba(86,177,255,0.18), rgba(255,255,255,0.04))",
      chip: "rgba(86,177,255,0.16)",
      accent: "#56b1ff",
    },
    green: {
      glow: "radial-gradient(circle at 24% 30%, rgba(34,197,94,0.26), transparent 30%), radial-gradient(circle at 76% 72%, rgba(255,255,255,0.10), transparent 26%)",
      line: "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(255,255,255,0.04))",
      chip: "rgba(34,197,94,0.16)",
      accent: "#34c55e",
    },
  };

  const palette = palettes[variant] ?? palettes.red;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: height,
        p: 3,
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: palette.line,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 10,
          borderRadius: 5,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            "@keyframes aiFrameSpin": {
              "0%": { transform: "rotate(0deg) scale(1)" },
              "50%": { transform: "rotate(180deg) scale(1.04)" },
              "100%": { transform: "rotate(360deg) scale(1)" },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "-35%",
              background: `conic-gradient(from 180deg, transparent, ${palette.accent}55, transparent, rgba(255,255,255,0.18), transparent)`,
              filter: "blur(20px)",
              animation: "aiFrameSpin 11s linear infinite",
            }}
          />
        </Box>
      </Box>

      <motion.div
        animate={{ rotate: [0, 6, 0], scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: palette.glow,
            filter: "blur(6px)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{ y: ["-12%", "110%"] }}
        transition={{ repeat: Infinity, duration: 7.5, ease: "linear" }}
        style={{ position: "absolute", left: "8%", right: "8%" }}
      >
        <Box
          sx={{
            height: 90,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))",
            filter: "blur(10px)",
            opacity: 0.55,
          }}
        />
      </motion.div>

      <Box
        sx={{
          position: "absolute",
          inset: 18,
          borderRadius: 5,
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "58%",
            height: "58%",
            top: "18%",
            left: "10%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
              boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
              transform: "rotate(-12deg)",
            }}
          />
        </motion.div>

        <motion.div
          animate={{
            x: ["10%", "-8%", "10%"],
            y: ["0%", "6%", "0%"],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "42%",
            height: "42%",
            right: "12%",
            bottom: "16%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.16)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
              backdropFilter: "blur(14px)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
            }}
          />
        </motion.div>

        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 18, left: 18 }}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  i === 1 ? "#ff6b6b" : i === 2 ? "#56b1ff" : "#ffffff",
                opacity: 0.9,
              }}
            />
          ))}
        </Stack>

        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
          label="AI Visual"
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            bgcolor: palette.chip,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        />
      </Box>
    </Box>
  );
}

AIVisualBlock.propTypes = { variant: PropTypes.string, height: PropTypes.number };

/* ── TechPanel ── */
function TechPanel({ mouseX, mouseY }) {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useTransform(
    mouseY,
    [-300, 300],
    prefersReducedMotion ? [0, 0] : [5, -5]
  );
  const rotateY = useTransform(
    mouseX,
    [-300, 300],
    prefersReducedMotion ? [0, 0] : [-6, 6]
  );
  const floatY = useTransform(
    mouseY,
    [-300, 300],
    prefersReducedMotion ? [0, 0] : [-10, 10]
  );

  return (
    <motion.div
      style={{ rotateX, rotateY, y: floatY, transformStyle: "preserve-3d" }}
    >
      <GlassCard
        motionProps={{
          initial: { opacity: 0, scale: 0.82, y: 40 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: {
            duration: 1.05,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.12,
          },
        }}
        sx={{
          p: 2,
          minHeight: 640,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,77,77,0.15), transparent 25%), radial-gradient(circle at 80% 20%, rgba(86,177,255,0.12), transparent 22%), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.06), transparent 24%)",
            pointerEvents: "none",
          }}
        />
        <FrameShell />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: "relative", zIndex: 2, mb: 2 }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.28em", color: "text.secondary" }}
            >
              Hero showcase
            </Typography>
            <Typography
              variant="h5"
              sx={{ mt: 0.5, letterSpacing: "-0.04em" }}
            >
              Expanding product shell
            </Typography>
          </Box>
          <Chip
            icon={<TerminalRoundedIcon sx={{ fontSize: 16 }} />}
            label="Boot sequence"
            sx={{
              bgcolor: alpha("#56b1ff", 0.12),
              color: "#9fd3ff",
              border: "1px solid rgba(86,177,255,0.2)",
            }}
          />
        </Stack>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            minHeight: 560,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 1600,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "72%",
              maxWidth: 360,
              aspectRatio: "10 / 20",
              borderRadius: "40px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 26,
                borderRadius: "999px",
                bgcolor: "rgba(0,0,0,0.65)",
                zIndex: 3,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 10,
                borderRadius: "30px",
                overflow: "hidden",
                background:
                  "radial-gradient(circle at 20% 20%, rgba(255,77,77,0.2), transparent 22%), radial-gradient(circle at 80% 20%, rgba(86,177,255,0.22), transparent 25%), linear-gradient(180deg, #0b0d12 0%, #090909 100%)",
              }}
            >
              <Stack spacing={2} sx={{ p: 3, pt: 7 }}>
                <Stack direction="row" spacing={1}>
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor:
                          i === 1
                            ? "#ff6b6b"
                            : i === 2
                            ? "#56b1ff"
                            : "#ffffff",
                      }}
                    />
                  ))}
                </Stack>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      letterSpacing: "0.24em",
                      color: "text.secondary",
                      textTransform: "uppercase",
                    }}
                  >
                    Bulls OS
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.05em",
                      mt: 0.5,
                    }}
                  >
                    Product launch layer
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 13, color: "text.secondary", mb: 1.2 }}
                  >
                    System activity
                  </Typography>
                  <Stack spacing={1.2}>
                    {[72, 56, 88].map((width, i) => (
                      <Box key={i}>
                        <Box
                          sx={{
                            height: 7,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,0.08)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${width}%`,
                              borderRadius: 999,
                              background:
                                i === 1
                                  ? "linear-gradient(90deg, #56b1ff, #c9ecff)"
                                  : "linear-gradient(90deg, #ff4d4d, #ffffff)",
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(7,10,14,0.65)",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#8fb6d9",
                      whiteSpace: "pre-line",
                      lineHeight: 1.7,
                    }}
                  >
                    {`const studio = launch({\n  product: 'bulls',\n  motion: 'smooth',\n  feel: 'futuristic'\n});`}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              right: { xs: 6, md: 0 },
              top: { xs: 22, md: 60 },
              width: { xs: 150, md: 190 },
              p: 2,
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
              backdropFilter: "blur(18px)",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                color: "text.secondary",
              }}
            >
              Build mode
            </Typography>
            <Typography
              sx={{
                mt: 1.1,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              Mobile + code showcase
            </Typography>
            <Stack spacing={1} sx={{ mt: 1.6 }}>
              {capabilityItems.slice(0, 3).map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  sx={{
                    justifyContent: "flex-start",
                    bgcolor: alpha("#fff", 0.04),
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "text.primary",
                    "& .MuiChip-icon": { color: alpha("#fff", 0.74) },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </GlassCard>
    </motion.div>
  );
}

TechPanel.propTypes = { mouseX: PropTypes.object, mouseY: PropTypes.object };

/* ═══════════════════════════════════════════════════════════
   PAGE 8 — MUI Studio Showcase
   ═══════════════════════════════════════════════════════════ */
export default function Page8() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#ffffff" },
          secondary: { main: "#ff4d4d" },
          background: { default: "#050505", paper: "#0a0a0a" },
          text: {
            primary: "#ffffff",
            secondary: "rgba(255,255,255,0.68)",
          },
        },
        shape: { borderRadius: 24 },
        typography: {
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 600 },
        },
      }),
    []
  );

  const rootRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.25,
  });
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.22], [0, -55]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.72]);

  const handleMouseMove = (event) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        ref={rootRef}
        onMouseMove={handleMouseMove}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* scroll progress bar */}
        <motion.div
          style={{ scaleX: progressScale, transformOrigin: "0%" }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              zIndex: 30,
              background:
                "linear-gradient(90deg, #ff4d4d, #56b1ff, #ffffff, #ff4d4d)",
              boxShadow: "0 0 30px rgba(255,77,77,0.35)",
            }}
          />
        </motion.div>

        <FloatingOrbs mouseX={mouseX} mouseY={mouseY} />
        <FrameShell />

        {/* ambient background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 16% 18%, rgba(255, 77, 77, 0.18), transparent 24%), radial-gradient(circle at 80% 20%, rgba(86, 177, 255, 0.10), transparent 18%), radial-gradient(circle at 50% 78%, rgba(255, 40, 40, 0.12), transparent 28%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            pointerEvents: "none",
          }}
        />

        {/* ── MAIN CONTENT ── */}
        <Box component="main">
          {/* HERO */}
          <Container
            maxWidth="xl"
            sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 10, md: 14 } }}
          >
            <motion.div style={{ y: heroTranslateY, opacity: heroOpacity }}>
              <Grid
                container
                spacing={{ xs: 5, md: 6 }}
                alignItems="stretch"
              >
                <Grid item xs={12} lg={7}>
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Stack spacing={4} sx={{ pr: { lg: 5 } }}>
                      <motion.div variants={itemVariants}>
                        <Chip
                          label="Built for brands that want gravity"
                          sx={{
                            width: "fit-content",
                            borderRadius: 999,
                            color: "text.secondary",
                            bgcolor: alpha("#fff", 0.05),
                            border: "1px solid rgba(255,255,255,0.08)",
                            px: 1,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Typography
                          variant="h1"
                          sx={{
                            fontSize: {
                              xs: "3.15rem",
                              sm: "4.7rem",
                              md: "6.4rem",
                              lg: "7.5rem",
                            },
                            lineHeight: 0.88,
                            letterSpacing: "-0.085em",
                            maxWidth: 960,
                          }}
                        >
                          We build
                          <Box
                            component="span"
                            sx={{ display: "block", color: alpha("#fff", 0.32) }}
                          >
                            digital
                          </Box>
                          <Box component="span" sx={{ display: "block" }}>
                            systems with pulse.
                          </Box>
                        </Typography>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Typography
                          variant="body1"
                          sx={{
                            maxWidth: 760,
                            color: "text.secondary",
                            fontSize: { xs: "1rem", md: "1.12rem" },
                            lineHeight: 1.95,
                          }}
                        >
                          Bulls Digital Studio mobil uygulamalar, oyunlar ve
                          modern web sistemleri tasarlar. Hedef sadece şık
                          görünmek değil. Akışların yumuşak, geçişlerin akıllı
                          ve ürün hissinin ileri teknoloji kokması.
                        </Typography>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2.2}
                        >
                          <MagneticButton
                            variant="contained"
                            endIcon={<ArrowOutwardRoundedIcon />}
                            sx={{
                              bgcolor: "#fff",
                              color: "#050505",
                              "&:hover": { bgcolor: alpha("#fff", 0.9) },
                            }}
                          >
                            Explore our work
                          </MagneticButton>
                          <MagneticButton
                            variant="outlined"
                            sx={{
                              borderColor: "rgba(255,255,255,0.14)",
                              color: "text.primary",
                              "&:hover": {
                                borderColor: "rgba(255,255,255,0.24)",
                                bgcolor: alpha("#fff", 0.04),
                              },
                            }}
                          >
                            Book a discovery call
                          </MagneticButton>
                        </Stack>
                      </motion.div>

                      <Grid
                        container
                        spacing={2}
                        sx={{ pt: 2, maxWidth: 860 }}
                      >
                        {highlights.map(([value, label]) => (
                          <Grid item xs={6} md={3} key={label}>
                            <GlassCard
                              motionProps={{ variants: itemVariants }}
                              sx={{ height: "100%" }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Typography
                                  sx={{
                                    fontSize: { xs: "1.6rem", md: "2rem" },
                                    fontWeight: 700,
                                    letterSpacing: "-0.05em",
                                  }}
                                >
                                  {value}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ mt: 1, color: "text.secondary" }}
                                >
                                  {label}
                                </Typography>
                              </CardContent>
                            </GlassCard>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </motion.div>
                </Grid>

                <Grid item xs={12} lg={5}>
                  <Box sx={{ position: "relative", height: "100%" }}>
                    <TechPanel mouseX={mouseX} mouseY={mouseY} />
                  </Box>
                </Grid>
              </Grid>
            </motion.div>

            <AnimatedMarquee />
          </Container>

          {/* AI GALLERY */}
          <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
            <SectionTitle
              eyebrow="Visual tone"
              title="AI-assisted visuals in the same dark, futuristic tone."
              description="Sayfaya daha fazla soyut AI görsel, frame hissi ve egzantrik geçişler ekledim. Bunlar gerçek image dosyası gerektirmeden premium bir vitrin hissi verir."
            />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {aiGalleryItems.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={`${item.title}-${index}`}
                >
                  <GlassCard sx={{ height: "100%", overflow: "hidden" }}>
                    <AIVisualBlock
                      variant={item.variant}
                      height={index % 3 === 0 ? 300 : 260}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: "text.secondary",
                          lineHeight: 1.8,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* SERVICES */}
          <Container
            id="services"
            maxWidth="xl"
            sx={{ py: { xs: 5, md: 8 } }}
          >
            <SectionTitle
              eyebrow="Services"
              title="Three service lines, one sharper delivery machine."
              description="Geçişleri ağır değil akışkan tuttum. Kartlar daha yumuşak kalkıyor, section girişleri daha sinematik akıyor."
            />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {services.map((service) => (
                <Grid item xs={12} md={4} key={service.title}>
                  <GlassCard sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Stack spacing={2.5}>
                        <Avatar
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: alpha("#56b1ff", 0.12),
                            color: "#8fcbff",
                            border: "1px solid rgba(86,177,255,0.20)",
                          }}
                        >
                          {service.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{ letterSpacing: "-0.04em" }}
                          >
                            {service.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 1.5,
                              color: "text.secondary",
                              lineHeight: 1.9,
                            }}
                          >
                            {service.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* WORK */}
          <Container
            id="work"
            maxWidth="xl"
            sx={{ py: { xs: 5, md: 8 } }}
          >
            <SectionTitle
              eyebrow="Selected work"
              title="Concept-heavy, product-ready, visually loud in the right places."
              description="Buradaki kartlar örnek içerik olarak hazırlandı. Sonra gerçek projelerini ve case study görsellerini buraya gömebiliriz."
            />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {projects.map((project) => (
                <Grid item xs={12} md={4} key={project.title}>
                  <GlassCard sx={{ height: "100%", overflow: "hidden" }}>
                    <Box sx={{ position: "relative" }}>
                      <AIVisualBlock variant={project.variant} height={220} />
                      <Chip
                        label={project.category}
                        sx={{
                          position: "absolute",
                          left: 24,
                          bottom: 24,
                          bgcolor: alpha("#050505", 0.55),
                          color: "#fff",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3.5 }}>
                      <Typography
                        variant="h5"
                        sx={{ letterSpacing: "-0.04em" }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1.5,
                          color: "text.secondary",
                          lineHeight: 1.9,
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Button
                        endIcon={<ArrowOutwardRoundedIcon />}
                        sx={{ mt: 2, px: 0, color: "#fff" }}
                      >
                        View project
                      </Button>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* PROCESS */}
          <Container
            id="process"
            maxWidth="xl"
            sx={{ py: { xs: 5, md: 8 } }}
          >
            <SectionTitle
              eyebrow="Process"
              title="Clear process, less chaos."
              description="İş akışını süslü terimlerle boğmuyoruz. Hızlı karar, net tasarım, sağlam uygulama ve sürdürülebilir yayın akışı kuruyoruz."
            />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {processItems.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={item.title}>
                  <GlassCard sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Stack spacing={2.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha("#fff", 0.06),
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "text.primary",
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Typography
                            sx={{
                              color: alpha("#fff", 0.24),
                              fontWeight: 700,
                            }}
                          >
                            0{index + 1}
                          </Typography>
                        </Stack>
                        <Box>
                          <Typography variant="h6">{item.title}</Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1.5,
                              color: "text.secondary",
                              lineHeight: 1.9,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* CONTACT CTA */}
          <Container
            id="contact"
            maxWidth="xl"
            sx={{ py: { xs: 5, md: 8 } }}
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <GlassCard
                sx={{
                  p: { xs: 4, md: 6 },
                  textAlign: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,77,77,0.12), transparent 28%), radial-gradient(circle at 70% 70%, rgba(86,177,255,0.10), transparent 24%)",
                    pointerEvents: "none",
                  }}
                />
                <Stack
                  spacing={3}
                  alignItems="center"
                  sx={{ position: "relative", zIndex: 2 }}
                >
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="overline"
                      sx={{
                        letterSpacing: "0.28em",
                        color: "text.secondary",
                      }}
                    >
                      Contact
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2rem", md: "3.25rem" },
                        lineHeight: 0.96,
                        letterSpacing: "-0.055em",
                        fontWeight: 700,
                      }}
                    >
                      Let&apos;s build something great together.
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        maxWidth: 540,
                        lineHeight: 1.85,
                      }}
                    >
                      Projenizi ve hedeflerinizi paylaşın. 24 saat içinde
                      size özel bir teklif ile dönüyoruz.
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <MagneticButton
                        variant="contained"
                        endIcon={<ArrowOutwardRoundedIcon />}
                        sx={{
                          bgcolor: "#fff",
                          color: "#050505",
                          "&:hover": { bgcolor: alpha("#fff", 0.9) },
                        }}
                      >
                        Start a project
                      </MagneticButton>
                      <MagneticButton
                        variant="outlined"
                        sx={{
                          borderColor: "rgba(255,255,255,0.14)",
                          color: "text.primary",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.24)",
                            bgcolor: alpha("#fff", 0.04),
                          },
                        }}
                      >
                        hello@bullsdigital.com
                      </MagneticButton>
                    </Stack>
                  </motion.div>
                </Stack>
              </GlassCard>
            </motion.div>
          </Container>

          {/* FOOTER */}
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                pt: 4,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: alpha("#ffffff", 0.05),
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "text.primary",
                    fontSize: 12,
                    letterSpacing: "0.3em",
                    fontWeight: 700,
                  }}
                >
                  BDS
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  © 2026 Bulls Digital Studio — Istanbul / Global
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={3}
                sx={{ color: "text.secondary" }}
              >
                {["Privacy", "Terms", "Instagram", "LinkedIn"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      underline="none"
                      color="inherit"
                      sx={{
                        fontSize: "0.85rem",
                        transition: "0.25s ease",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Page8.propTypes = { t: PropTypes.object };
