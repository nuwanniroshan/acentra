import React, { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraInput,
} from "@acentra/aurora-design-system";
import { motion } from "motion/react";
import { AuroraLiveIconRocket } from "@acentra/aurora-design-system";

interface ComingSoonProps {
  moduleName: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ moduleName }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Set target to 14 days from now for demo purposes, or keep existing logic
    const targetDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <AuroraBox
      sx={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      {/* Abstract Background Shapes - Using motion.div directly with inline styles for animations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(156, 39, 176, 0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600 }}
      >
        <AuroraBox
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Light mode glass
            dark: {
              backgroundColor: "rgba(30, 30, 30, 0.6)", // Dark mode glass adjustment (pseudo-syntax, relying on theme)
            },
            // Using theme-aware sx for better adaptability if possible, 
            // but hardcoding a nice semi-transparent white/dark adaptively is safer with MUI theme vars if set.
            // For now, using a generic glass style that works on light/dark backgrounds usually:
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(20, 20, 30, 0.6)"
                : "rgba(255, 255, 255, 0.8)",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: "inline-block", marginBottom: 24 }}
          >
            <AuroraBox
              sx={{
                p: 2,
                borderRadius: "50%",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                display: "inline-flex",
              }}
            >
              <AuroraLiveIconRocket width={40} height={40} stroke="#fff" />
            </AuroraBox>
          </motion.div>

          <AuroraTypography
            variant="overline"
            sx={{ letterSpacing: 3, color: "primary.main", fontWeight: "bold" }}
          >
            Coming Soon
          </AuroraTypography>

          <AuroraTypography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {moduleName}
          </AuroraTypography>

          <AuroraTypography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 400, mx: "auto", lineHeight: 1.6 }}
          >
            We are crafting a powerful numeric experience. Stay tuned for something amazing that will redefine how you manage {moduleName.toLowerCase()}.
          </AuroraTypography>

          {/* Countdown Grid */}
          <AuroraBox
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              mb: 6,
            }}
          >
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <AuroraBox
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <AuroraTypography
                    variant="h4"
                    sx={{ fontWeight: "bold", fontFamily: "monospace" }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </AuroraTypography>
                  <AuroraTypography
                    variant="caption"
                    sx={{
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      letterSpacing: 1,
                      opacity: 0.7,
                    }}
                  >
                    {unit.label}
                  </AuroraTypography>
                </AuroraBox>
              </motion.div>
            ))}
          </AuroraBox>

          {/* Subscribe Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <AuroraBox
              sx={{
                display: "flex",
                gap: 1,
                maxWidth: 400,
                mx: "auto",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <AuroraInput
                placeholder="Enter your email address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: { xs: 1, sm: 0 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                  },
                }}
              />
              <AuroraButton
                variant="contained"
                size="large"
                sx={{ px: 4, whiteSpace: "nowrap" }}
              >
                Notify Me
              </AuroraButton>
            </AuroraBox>
          </motion.div>
        </AuroraBox>
      </motion.div>
    </AuroraBox>
  );
};

export default ComingSoon;
