import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraGrid,
} from "@acentra/aurora-design-system";
import { Container, Stack } from "@mui/material";
import { motion, AnimatePresence, useTransform, useSpring, useMotionValue } from "framer-motion";

interface HeroSectionProps {
  onDemoClick: () => void;
  onLoginClick: () => void;
}

const slides = [
  {
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "#0f172a", // Dark Slate
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "#0f172a",
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
    tagline: (
      <AuroraTypography
        variant="h1"
        sx={{
          fontWeight: 900,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "2.8rem", md: "3.5rem" },
          letterSpacing: "-0.02em",
          color: "#0f172a",
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
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
        // Aurora Light Gradient Background
        background: `
          radial-gradient(circle at 10% 20%, rgba(219, 234, 254, 0.6) 0%, rgba(255, 255, 255, 0) 40%),
          radial-gradient(circle at 90% 80%, rgba(254, 243, 199, 0.4) 0%, rgba(255, 255, 255, 0) 40%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)
        `,
        py: { xs: 8, md: 0 },
      }}
    >
      {/* Decorative Blobs */}
      <AuroraBox
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "40%",
          height: "60%",
          background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.15), transparent 70%)",
          filter: "blur(60px)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <AuroraBox
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "40%",
          height: "60%",
          background: "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.1), transparent 70%)",
          filter: "blur(60px)",
          borderRadius: "50%",
          zIndex: 0,
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
                      color: "#475569", // Slate 600
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
                    bgcolor: "#0f172a", // Dark button for contrast
                    color: "white",
                    "&:hover": { bgcolor: "#1e293b" },
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)",
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
                    color: "#475569",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { bgcolor: "rgba(15, 23, 42, 0.05)", color: "#0f172a" },
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
                        ? "#0f172a"
                        : "rgba(15, 23, 42, 0.2)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#0f172a",
                    },
                  }}
                />
              ))}
            </Stack>
          </AuroraGrid>

          {/* Floating Glassmorphic Elements */}
          <AuroraGrid size={{ xs: 12, md: 6 }} sx={{ position: "relative", height: "100%", minHeight: 450 }}>
            <AnimatePresence>
              {/* Card 1: Match Score */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "5%",
                  right: "10%",
                  x: floatingX,
                  y: floatingY,
                }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <AuroraBox sx={{
                  p: 3,
                  width: 220,
                  background: "rgba(255, 255, 255, 0.65)", // More opaque for light mode
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  borderRadius: 3,
                  color: "#1e293b",
                  boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0,0,0,0.05)",
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <AuroraTypography variant="caption" sx={{ fontWeight: 600, color: "#64748b" }}>MATCH SCORE</AuroraTypography>
                    <AuroraBox sx={{ p: 0.5, bgcolor: "#ecfdf5", borderRadius: 1 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </AuroraBox>
                  </Stack>
                  <AuroraTypography variant="h3" sx={{ fontWeight: 800, color: "#10b981", mb: 0.5 }}>98%</AuroraTypography>
                  <AuroraTypography variant="body2" sx={{ fontSize: "0.85rem", color: "#475569" }}>
                    Top candidate match for <span style={{ fontWeight: 600 }}>Lead Dev</span> role.
                  </AuroraTypography>
                </AuroraBox>
              </motion.div>

              {/* Card 2: Active Pipeline */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "5%",
                  x: useTransform(springX, [-500, 500], [-30, 30]),
                  y: useTransform(springY, [-500, 500], [-30, 30]),
                }}
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <AuroraBox sx={{
                  p: 3,
                  width: 260,
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  borderRadius: 3,
                  color: "#1e293b",
                  boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.12)",
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <AuroraTypography variant="subtitle2" sx={{ fontWeight: 700 }}>Active Pipeline</AuroraTypography>
                    <AuroraBox sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981", boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2)" }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {[1, 2, 3].map(i => (
                      <AuroraBox key={i} sx={{ position: "relative", height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - (i * 20)}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                          style={{
                            height: "100%",
                            background: i === 1 ? "#3b82f6" : i === 2 ? "#6366f1" : "#8b5cf6",
                            borderRadius: 4
                          }}
                        />
                      </AuroraBox>
                    ))}
                  </Stack>
                  <AuroraTypography variant="caption" sx={{ mt: 2, display: "block", textAlign: "right", color: "#64748b", fontWeight: 500 }}>
                    Updated just now
                  </AuroraTypography>
                </AuroraBox>
              </motion.div>

              {/* Element 3: Circular Icon */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "45%",
                  right: "15%",
                  x: useTransform(springX, [-500, 500], [20, -20]),
                  y: useTransform(springY, [-500, 500], [20, -20]),
                  zIndex: 2,
                }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <AuroraBox sx={{
                  p: 2,
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: "50%",
                  width: 90,
                  height: 90,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.1)",
                }}>
                  <AuroraBox sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: "0 10px 20px -5px rgba(236, 72, 153, 0.4)"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </AuroraBox>
                </AuroraBox>
              </motion.div>
            </AnimatePresence>
          </AuroraGrid>
        </AuroraGrid>
      </Container>
    </AuroraBox>
  );
};
