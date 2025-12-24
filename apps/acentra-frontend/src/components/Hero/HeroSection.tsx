import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraGrid,
} from "@acentra/aurora-design-system";
import { Container, Stack } from "@mui/material";
import { motion, AnimatePresence, useTransform, useSpring, useMotionValue } from "framer-motion";
import heroBg from "../../assets/hero-bg.png";
import heroBg2 from "../../assets/hero-bg-2.png";
import heroBg3 from "../../assets/hero-bg-3.png";

interface HeroSectionProps {
  onDemoClick: () => void;
  onLoginClick: () => void;
}

const slides = [
  {
    bg: heroBg,
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        Streamline Hiring.
        <br />
        Connect Teams.
        <br />
        Secure Data.
      </AuroraTypography>
    ),
    subline:
      "Empower your organization with a unified platform for multi-tenant recruitment. Manage pipelines, track candidates, and gather feedback securely in one place.",
  },
  {
    bg: heroBg2,
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        Scale Your Workforce.
        <br />
        Global Talent.
        <br />
        Local Reach.
      </AuroraTypography>
    ),
    subline:
      "Expand your reach with our globally-distributed talent network. Seamlessly bridge the gap between regional needs and international expertise.",
  },
  {
    bg: heroBg3,
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        Intelligence Driven.
        <br />
        Analytics First.
        <br />
        Smarter Decisions.
      </AuroraTypography>
    ),
    subline:
      "Leverage real-time insights and predictive analytics to optimize your hiring funnel. Turn data into a strategic advantage for your HR operations.",
  },
];

export const HeroSection = ({
  onDemoClick,
  onLoginClick,
}: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transforms for different layers
  const textX = useTransform(springX, [-500, 500], [-15, 15]);
  const textY = useTransform(springY, [-500, 500], [-15, 15]);

  const floatingX = useTransform(springX, [-500, 500], [30, -30]);
  const floatingY = useTransform(springY, [-500, 500], [30, -30]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  return (
    <AuroraBox
      onMouseMove={handleMouseMove}
      sx={{
        width: "100%",
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#000",
        py: { xs: 8, md: 0 },
      }}
    >
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }} // Darkened for overlay effect
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${slides[currentIndex].bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1,
          }}
        />
      </AnimatePresence>

      {/* Dark Overlay Gradient */}
      <AuroraBox
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)",
          zIndex: 2,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <AuroraGrid container spacing={4} alignItems="center">
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <motion.div style={{ x: textX, y: textY }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {slides[currentIndex].tagline}

                  <AuroraTypography
                    variant="body1"
                    sx={{
                      mb: 5,
                      fontSize: "1.25rem",
                      lineHeight: 1.6,
                      maxWidth: "540px",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {slides[currentIndex].subline}
                  </AuroraTypography>
                </motion.div>
              </AnimatePresence>

              <Stack direction="row" spacing={3} alignItems="center">
                <AuroraButton
                  variant="contained"
                  onClick={onDemoClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    bgcolor: "#ec7211",
                    "&:hover": { bgcolor: "#eb5f07" },
                  }}
                >
                  Request Demo
                </AuroraButton>

                <AuroraButton
                  variant="text"
                  onClick={onLoginClick}
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Sign In
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </AuroraButton>
              </Stack>
            </motion.div>

            {/* Slide Indicators */}
            <Stack direction="row" spacing={1} sx={{ mt: 6 }}>
              {slides.map((_, index) => (
                <AuroraBox
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: index === currentIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 2,
                    bgcolor:
                      index === currentIndex
                        ? "white"
                        : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "white",
                    },
                  }}
                />
              ))}
            </Stack>
          </AuroraGrid>

          {/* Floating Glassmorphic Elements */}
          <AuroraGrid size={{ xs: 12, md: 6 }} sx={{ position: "relative", height: "100%", minHeight: 400 }}>
            <AnimatePresence>
              <motion.div
                style={{
                  position: "absolute",
                  top: "10%",
                  right: "5%",
                  x: floatingX,
                  y: floatingY,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <AuroraBox sx={{
                  p: 3,
                  width: 200,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                }}>
                  <AuroraTypography variant="caption" sx={{ opacity: 0.6 }}>AI Match Score</AuroraTypography>
                  <AuroraTypography variant="h4" sx={{ fontWeight: 800, color: "#10b981" }}>98%</AuroraTypography>
                  <AuroraTypography variant="body2" sx={{ mt: 1 }}>Highly recommended for Lead Developer role.</AuroraTypography>
                </AuroraBox>
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "0%",
                  x: useTransform(springX, [-500, 500], [-40, 40]),
                  y: useTransform(springY, [-500, 500], [-40, 40]),
                }}
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <AuroraBox sx={{
                  p: 3,
                  width: 240,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.4)",
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <AuroraTypography variant="subtitle2" sx={{ fontWeight: 700 }}>Active Pipeline</AuroraTypography>
                    <AuroraBox sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ec7211" }} />
                  </Stack>
                  <Stack spacing={1}>
                    {[1, 2, 3].map(i => (
                      <AuroraBox key={i} sx={{ height: 6, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, width: `${100 - (i * 15)}%` }} />
                    ))}
                  </Stack>
                  <AuroraTypography variant="caption" sx={{ mt: 2, display: "block", textAlign: "right", opacity: 0.5 }}>Real-time sync</AuroraTypography>
                </AuroraBox>
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "20%",
                  x: useTransform(springX, [-500, 500], [20, -20]),
                  y: useTransform(springY, [-500, 500], [20, -20]),
                  zIndex: 1,
                }}
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <AuroraBox sx={{
                  p: 2,
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.2)",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec7211" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </AuroraBox>
              </motion.div>
            </AnimatePresence>
          </AuroraGrid>
        </AuroraGrid>
      </Container>
    </AuroraBox>
  );
};
