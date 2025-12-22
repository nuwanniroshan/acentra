import { AuroraBox, AuroraTypography, AuroraButton, AuroraGrid } from "@acentra/aurora-design-system";
import { Container, Stack } from "@mui/material";
import { motion } from "framer-motion";
import heroBg from "../../assets/hero-bg.png";

interface HeroSectionProps {
  onDemoClick: () => void;
  onLoginClick: () => void;
}

export const HeroSection = ({ onDemoClick, onLoginClick }: HeroSectionProps) => {
  return (
    <AuroraBox
      sx={{
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: { xs: 8, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <AuroraGrid container spacing={4} alignItems="center">
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <AuroraTypography
                variant="h1"
                sx={{
                  color: "#0c1b3d",
                  fontWeight: 900,
                  mb: 2,
                  lineHeight: 1.1,
                  fontSize: { xs: "2.8rem", md: "3.5rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                Streamline Hiring.<br />
                Connect Teams.<br />
                Secure Data.
              </AuroraTypography>

              <AuroraTypography
                variant="body1"
                sx={{
                  color: "#4a5568",
                  mb: 5,
                  fontSize: "1.25rem",
                  lineHeight: 1.6,
                  maxWidth: "540px",
                }}
              >
                Empower your organization with a unified platform for multi-tenant recruitment. Manage pipelines, track candidates, and gather feedback securely in one place.
              </AuroraTypography>

              <Stack direction="row" spacing={3} alignItems="center">
                <AuroraButton
                  variant="contained"
                  onClick={onDemoClick}
                  sx={{
                    bgcolor: "#ec7211",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "#eb5f07",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Request Demo
                </AuroraButton>

                <AuroraButton
                  variant="text"
                  onClick={onLoginClick}
                  sx={{
                    color: "#0073ff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#005bcc",
                    },
                  }}
                >
                  Sign In
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </AuroraButton>
              </Stack>
            </motion.div>
          </AuroraGrid>

          {/* Right side is intentionally empty to let the background graphic shine */}
          <AuroraGrid size={{ xs: 12, md: 6 }} />
        </AuroraGrid>
      </Container>
    </AuroraBox>
  );
};
