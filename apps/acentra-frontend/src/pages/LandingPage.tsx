import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuroraBox,
  AuroraButton,
  AuroraTypography,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraInput,
  AuroraGrid,
  AuroraLogo,
  AuroraPaper,
} from "@acentra/aurora-design-system";
import {
  AuroraLiveIconUsers,
  AuroraLiveIconBadgeDollarSign,
  AuroraLiveIconCalendar1,
  AuroraLiveIconClock8,
} from "@acentra/aurora-design-system";
import { RequestDemoModal } from "../components/RequestDemoModal";
import { Container, Stack, Divider } from "@mui/material";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openDemoModal, setOpenDemoModal] = useState(false);
  const [slug, setSlug] = useState("");
  const navigate = useNavigate();
  const [taglineIndex, setTaglineIndex] = useState(0);

  const taglines = [
    "Unify Recruitment",
    "Orchestrate Operations",
    "Accelerate Hiring",
    "Simplify Management",
    "Empower Teams",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const handleLoginClick = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleDemoClick = () => {
    setOpenDemoModal(true);
  };

  const handleCloseDemo = () => {
    setOpenDemoModal(false);
  };

  const go = () => {
    if (slug.trim()) {
      const tenantSlug = slug.trim().toLowerCase();
      navigate(`/${tenantSlug}`);
    }
  };

  // ... features definition stays the same

  const features = [
    {
      icon: <AuroraLiveIconUsers width={24} height={24} />,
      title: "Recruitment & Hiring",
      description:
        "Streamline your hiring process with intelligent shortlisting and automated workflows.",
    },
    {
      icon: <AuroraLiveIconBadgeDollarSign width={24} height={24} />,
      title: "Payroll Management",
      description:
        "Automate payroll processing with accuracy. Handle taxes and compliance effortlessly.",
    },
    {
      icon: <AuroraLiveIconCalendar1 width={24} height={24} />,
      title: "Leave Management",
      description:
        "Simplify leave requests and policies with an intuitive, transparent system.",
    },
    {
      icon: <AuroraLiveIconClock8 width={24} height={24} />,
      title: "Time Tracking",
      description:
        "Monitor employee hours with precision using real-time tracking integration.",
    },
  ];

  return (
    <AuroraBox
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f2f3f3", // Light gray background common in enterprise consoles
      }}
    >
      {/* Navbar - Dark, Enterprise Style */}
      <AuroraBox
        component="header"
        sx={{
          bgcolor: "#232f3e", // AWS Console dark blue/black
          color: "white",
          py: 1,
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <AuroraBox
            sx={{
              display: "flex",
              alignItems: "center",
              "& svg": { color: "white" }, // Force logo to white if it's an SVG
              filter: "brightness(0) invert(1)", // Fallback to make non-svg generic logo white
            }}
          >
            <AuroraLogo width="100px" height="auto" />
          </AuroraBox>
        </Stack>
        <Stack direction="row" spacing={2}>
          <AuroraButton onClick={handleDemoClick}>Contact Sales</AuroraButton>
          <AuroraButton onClick={handleLoginClick}>Sign In</AuroraButton>
        </Stack>
      </AuroraBox>

      {/* Hero Section - Animated Light Gradient */}
      <AuroraBox
        className={styles.heroLightGradient}
        sx={{
          minHeight: "60vh",
          py: { xs: 6, md: 8 }, // Reduced vertical padding
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="md">
          <AuroraBox
            sx={{
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AuroraTypography
              key={taglineIndex}
              variant="h3"
              component="h1"
              className={styles.fadeIn}
              sx={{
                color: "#232f3e",
                m: 3,
                fontWeight: 600, // Increased font-weight
              }}
            >
              {taglines[taglineIndex]}
            </AuroraTypography>
          </AuroraBox>
          <AuroraTypography
            sx={{
              fontSize: "1.2rem",
              color: "#545b64",
              m: 5,
              lineHeight: 1.5,
            }}
          >
            Access the capabilities of the Acentra Platform. Manage specific
            organizations, hiring pipelines, and workforce data in one secure
            environment.
          </AuroraTypography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <AuroraButton
              variant="contained"
              size="large"
              onClick={handleDemoClick}
              sx={{
                bgcolor: "#ec7211",
                color: "white",
                px: 4,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: "#eb5f07" },
              }}
            >
              Request Demo
            </AuroraButton>
            <AuroraButton
              variant="text"
              size="large"
              onClick={handleLoginClick}
              sx={{
                px: 3,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#545b64",
                borderRadius: "8px",
                "&:hover": { color: "#232f3e", bgcolor: "transparent" },
              }}
            >
              Log back in
            </AuroraButton>
          </Stack>
        </Container>

        {/* Fade to body blend */}
        <AuroraBox
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(to top, #f2f3f3, transparent)",
            pointerEvents: "none",
          }}
        />
        {/* Faded Separator */}
        <AuroraBox
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(35,47,62,0) 0%, rgba(35,47,62,0.15) 50%, rgba(35,47,62,0) 100%)",
          }}
        />
      </AuroraBox>

      {/* Features / Solutions Section */}
      <Container maxWidth="lg" sx={{ py: 10, position: "relative" }}>
        <AuroraBox sx={{ textAlign: "center", mb: 10 }}>
          <AuroraTypography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#232f3e",
              mb: 2,
            }}
          >
            Explore Our Solutions
          </AuroraTypography>
          <AuroraTypography
            variant="h6"
            sx={{
              color: "#545b64",
              fontWeight: 400,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Discover the services designed to simplify your HR operations.
          </AuroraTypography>
        </AuroraBox>

        <Stack spacing={12}>
          {features.map((feature, index) => (
            <AuroraGrid
              key={index}
              container
              spacing={{ xs: 4, md: 8 }}
              alignItems="center"
              direction={index % 2 === 1 ? "row-reverse" : "row"}
              sx={{
                mb: 12, // Increased spacing between sections
                "&:hover .feature-image": {
                  transform: "translateY(-4px)", // Micro-interaction
                },
                "&:hover .feature-text": {
                  opacity: 1,
                },
              }}
            >
              <AuroraGrid size={{ xs: 12, md: 6 }}>
                {/* New Dot Icon Style */}
                <AuroraBox
                  sx={{
                    mb: 3,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)",
                  }}
                >
                  <AuroraBox
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #007eb9 0%, #005a85 100%)",
                    }}
                  />
                </AuroraBox>
                <AuroraTypography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#232f3e", mb: 2 }}
                >
                  {feature.title}
                </AuroraTypography>
                <AuroraTypography
                  className="feature-text"
                  variant="body1"
                  sx={{
                    color: "#545b64",
                    mb: 3,
                    fontSize: "0.95rem", // Reduced size
                    lineHeight: 1.8, // Increased line height
                    opacity: 0.9,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {feature.description}
                  <AuroraBox component="br" />
                  Experience seamless integration and powerful tools designed
                  for modern teams.
                </AuroraTypography>
                <AuroraButton
                  variant="text"
                  sx={{
                    p: 0,
                    color: "#007eb9",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  View more →
                </AuroraButton>
              </AuroraGrid>

              <AuroraGrid size={{ xs: 12, md: 6 }}>
                <AuroraPaper
                  className="feature-image"
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid #eaeded",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    // hover handled by parent
                  }}
                >
                  <img
                    src="/feature-mockup.png"
                    alt={feature.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      backgroundColor: "#f2f3f3",
                      filter: "brightness(0.96)", // Slightly reduced brightness
                    }}
                  />
                </AuroraPaper>
              </AuroraGrid>
            </AuroraGrid>
          ))}
        </Stack>

        {/* Faded Separator at bottom of Explore Section */}
        <AuroraBox
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(35,47,62,0) 0%, rgba(35,47,62,0.15) 50%, rgba(35,47,62,0) 100%)",
          }}
        />
      </Container>


      {/* Pricing Section */}
      <AuroraBox
        sx={{
          bgcolor: "#fff",
          py: 10,
          borderBottom: "1px solid #eaeded",
        }}
      >
        <Container maxWidth="lg">
          <AuroraBox sx={{ mb: 6, textAlign: "center" }}>
            <AuroraTypography
              variant="h4"
              sx={{ fontWeight: 700, color: "#232f3e", mb: 2 }}
            >
              Simple, Transparent Pricing
            </AuroraTypography>
            <AuroraTypography variant="body1" sx={{ color: "#545b64" }}>
              Choose the plan that fits your organization's needs.
            </AuroraTypography>
          </AuroraBox>
          <AuroraGrid container spacing={4} justifyContent="center">
            {/* Light Plan */}
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <AuroraPaper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #eaeded",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <AuroraTypography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#232f3e", mb: 1 }}
                >
                  Light
                </AuroraTypography>
                <AuroraBox
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    mb: 3,
                  }}
                >
                  <AuroraTypography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#ec7211" }}
                  >
                    $29
                  </AuroraTypography>
                  <AuroraTypography
                    variant="subtitle1"
                    sx={{ color: "#545b64", ml: 1 }}
                  >
                    /mo
                  </AuroraTypography>
                </AuroraBox>
                <AuroraTypography
                  variant="body2"
                  sx={{ color: "#545b64", mb: 3 }}
                >
                  Perfect for small teams getting started.
                </AuroraTypography>
                {/* Feature List */}
                <Stack spacing={1.5} sx={{ mb: 4, textAlign: "left" }}>
                  {[
                    "Up to 5 Users",
                    "Basic Recruitment",
                    "Standard Reporting",
                    "Email Support",
                  ].map((feat, i) => (
                    <AuroraBox
                      key={i}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AuroraBox
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#23a6d5",
                          mr: 2,
                        }}
                      />
                      <AuroraTypography
                        variant="body2"
                        sx={{ color: "#232f3e" }}
                      >
                        {feat}
                      </AuroraTypography>
                    </AuroraBox>
                  ))}
                </Stack>
                <AuroraButton
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    color: "#232f3e",
                    borderColor: "#232f3e",
                    borderRadius: 2,
                  }}
                >
                  Get Started
                </AuroraButton>
              </AuroraPaper>
            </AuroraGrid>
            {/* Pro Plan */}
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <AuroraPaper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #007eb9 0%, #ec7211 100%) border-box",
                  borderRadius: 2,
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <AuroraBox
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    px: 3,
                    py: 0.5,
                    borderRadius: 10,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Most Popular
                </AuroraBox>
                <AuroraTypography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#232f3e", mb: 1 }}
                >
                  Pro
                </AuroraTypography>
                <AuroraBox
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    mb: 3,
                  }}
                >
                  <AuroraTypography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#ec7211", fontSize: "3.5rem" }}
                  >
                    $99
                  </AuroraTypography>
                  <AuroraTypography
                    variant="subtitle1"
                    sx={{ color: "#545b64", ml: 1 }}
                  >
                    /mo
                  </AuroraTypography>
                </AuroraBox>
                <AuroraTypography
                  variant="body2"
                  sx={{ color: "#545b64", mb: 3 }}
                >
                  Advanced tools for growing companies.
                </AuroraTypography>
                <Stack spacing={1.5} sx={{ mb: 4, textAlign: "left" }}>
                  {[
                    "Up to 20 Users",
                    "Advanced Workflows",
                    "Payroll Integration",
                    "Priority Support",
                    "Custom Branding",
                  ].map((feat, i) => (
                    <AuroraBox
                      key={i}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AuroraBox
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#ec7211",
                          mr: 2,
                        }}
                      />
                      <AuroraTypography
                        variant="body2"
                        sx={{ color: "#232f3e", fontWeight: 500 }}
                      >
                        {feat}
                      </AuroraTypography>
                    </AuroraBox>
                  ))}
                </Stack>
                <AuroraButton
                  variant="contained"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    bgcolor: "#ec7211",
                    "&:hover": { bgcolor: "#eb5f07" },
                  }}
                >
                  Try Pro Free
                </AuroraButton>
              </AuroraPaper>
            </AuroraGrid>
            {/* Ultra Plan */}
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <AuroraPaper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid #eaeded",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <AuroraTypography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#232f3e", mb: 1 }}
                >
                  Ultra
                </AuroraTypography>
                <AuroraBox
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    mb: 3,
                  }}
                >
                  <AuroraTypography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#ec7211" }}
                  >
                    $249
                  </AuroraTypography>
                  <AuroraTypography
                    variant="subtitle1"
                    sx={{ color: "#545b64", ml: 1 }}
                  >
                    /mo
                  </AuroraTypography>
                </AuroraBox>
                <AuroraTypography
                  variant="body2"
                  sx={{ color: "#545b64", mb: 3 }}
                >
                  Maximum power for large enterprises.
                </AuroraTypography>
                <Stack spacing={1.5} sx={{ mb: 4, textAlign: "left" }}>
                  {[
                    "Unlimited Users",
                    "Enterprise API Access",
                    "Dedicated Account Manager",
                    "SSO / SAML",
                    "Audit Logs",
                  ].map((feat, i) => (
                    <AuroraBox
                      key={i}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AuroraBox
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#23a6d5",
                          mr: 2,
                        }}
                      />
                      <AuroraTypography
                        variant="body2"
                        sx={{ color: "#232f3e" }}
                      >
                        {feat}
                      </AuroraTypography>
                    </AuroraBox>
                  ))}
                </Stack>
                <AuroraButton
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    color: "#232f3e",
                    borderRadius: 2,
                    borderColor: "#232f3e",
                  }}
                >
                  Contact Sales
                </AuroraButton>
              </AuroraPaper>
            </AuroraGrid>
          </AuroraGrid>
        </Container>
      </AuroraBox>

      {/* Request Demo Section (Matching Hero) */}
      <AuroraBox
        className={styles.heroLightGradient}
        sx={{
          py: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="md">
          <AuroraBox
            sx={{
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AuroraTypography
              variant="h3"
              sx={{
                color: "#232f3e",
                m: 3,
                fontWeight: 600, // Matching hero tagline weight
              }}
            >
              Ready to see it in action?
            </AuroraTypography>
          </AuroraBox>
          <AuroraTypography
            variant="body1" // Reset variant but styling matches hero subline
            sx={{
              fontSize: "1.2rem",
              color: "#545b64",
              m: 5,
              lineHeight: 1.5,
            }}
          >
            Schedule a personalized demo to see how Acentra can transform your
            workforce operations.
          </AuroraTypography>
          <AuroraButton
            variant="contained"
            size="large"
            onClick={handleDemoClick}
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#eb5f07" },
            }}
          >
            Request Demo
          </AuroraButton>
        </Container>
      </AuroraBox>

      <Divider />

      {/* Footer - Minimalist */}
      <AuroraBox
        component="footer"
        sx={{
          bgcolor: "#f2f3f3",
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <AuroraTypography variant="caption" color="text.secondary">
              © 2025, Acentra, Inc. or its affiliates. All rights reserved.
            </AuroraTypography>
            <Stack direction="row" spacing={3}>
              {["Privacy", "Terms", "Cookie Preferences"].map((text) => (
                <AuroraTypography
                  key={text}
                  variant="caption"
                  sx={{
                    color: "#545b64",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {text}
                </AuroraTypography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </AuroraBox>

      {/* Login Dialog - Preserved Functionality */}
      <AuroraDialog
        open={openLogin}
        onClose={handleCloseLogin}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <AuroraDialogTitle sx={{ fontWeight: 600 }}>
          Access Workspace
        </AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2, fontSize: "0.9rem" }}>
            Enter your organization's workspace slug to continue to the
            dashboard.
          </AuroraDialogContentText>
          <AuroraInput
            autoFocus
            margin="dense"
            label="Workspace Slug"
            placeholder="e.g. acme-corp"
            fullWidth
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#ec7211",
                },
              },
            }}
          />
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 2 }}>
          <AuroraButton
            onClick={handleCloseLogin}
            color="inherit"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={go}
            variant="contained"
            disabled={!slug.trim()}
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { bgcolor: "#eb5f07" },
            }}
          >
            Continue
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      <RequestDemoModal open={openDemoModal} onClose={handleCloseDemo} />
    </AuroraBox>
  );
}
