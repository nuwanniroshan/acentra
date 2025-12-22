import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraGrid,
} from "@acentra/aurora-design-system";
import { Container, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AuroraBox
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "linear-gradient(to right, #c9ffbf, #ffafbd) ", // Dark base
        py: { xs: 8, md: 0 },
      }}
    >
      {/* Background Slideshow with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
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

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <AuroraGrid container spacing={4} alignItems="center">
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ scale: 1.5, opacity: 0, x: -30 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 1, opacity: 0, x: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {slides[currentIndex].tagline}

                <AuroraTypography
                  variant="body1"
                  sx={{
                    mb: 5,
                    fontSize: "1.25rem",
                    lineHeight: 1.6,
                    maxWidth: "540px",
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
                  borderRadius: 4,
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
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

            {/* Slide Indicators */}
            <Stack direction="row" spacing={1} sx={{ mt: 6 }}>
              {slides.map((_, index) => (
                <AuroraBox
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: index === currentIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
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

          <AuroraGrid size={{ xs: 12, md: 6 }} />
        </AuroraGrid>
      </Container>
    </AuroraBox>
  );
};
