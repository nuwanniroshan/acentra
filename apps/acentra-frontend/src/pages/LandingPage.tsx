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
import { Container, Stack, Divider } from "@mui/material";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
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

  const go = () => {
    if (slug.trim()) {
      const tenantSlug = slug.trim().toLowerCase();
      navigate(`/${tenantSlug}`);
    }
  };

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
          <AuroraButton
            onClick={handleLoginClick}
          >
            Contact Sales
          </AuroraButton>
          <AuroraButton
            onClick={handleLoginClick}
          >
            Sign In
          </AuroraButton>
        </Stack>
      </AuroraBox>

      {/* Hero Section - Animated Light Gradient */}
      <AuroraBox
        className={styles.heroLightGradient}
        sx={{
          minHeight: "60vh",
          py: { xs: 8, md: 12 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="md">
          <AuroraBox sx={{ minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AuroraTypography
              key={taglineIndex}
              variant="h3"
              component="h1"
              className={styles.fadeIn}
              sx={{
                color: "#232f3e",
                m: 3,
              }}
            >
              {taglines[taglineIndex]}
            </AuroraTypography>
          </AuroraBox>
          <AuroraTypography
            sx={{
              fontSize: '1.2rem',
              color: "#545b64",
              m: 5,
              lineHeight: 1.5,
            }}
          >
            Access the capabilities of the Acentra Platform. Manage specific organizations,
            hiring pipelines, and workforce data in one secure environment.
          </AuroraTypography>
          <AuroraButton
            variant="contained"
            size="large"
            onClick={handleLoginClick}
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "4px", // More rectangular like AWS
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#eb5f07" },
            }}
          >
            Log back in
          </AuroraButton>
          <AuroraBox sx={{ mt: 3 }}>
            <AuroraTypography
              variant="body2"
              sx={{
                color: "#007eb9",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={handleLoginClick}
            >
              Create a new organization account
            </AuroraTypography>
          </AuroraBox>
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
            pointerEvents: "none"
          }}
        />
      </AuroraBox>

      {/* Features / Solutions Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <AuroraGrid container spacing={4}>
          <AuroraGrid size={{ xs: 12 }}>
            <AuroraTypography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#232f3e",
                mb: 1,
              }}
            >
              Explore Our Solutions
            </AuroraTypography>
            <AuroraTypography
              variant="body1"
              sx={{ color: "#545b64", mb: 4 }}
            >
              Discover the services designed to simplify your HR operations.
            </AuroraTypography>
          </AuroraGrid>

          {features.map((feature, index) => (
            <AuroraGrid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <AuroraPaper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "white",
                  border: "1px solid #eaeded",
                  borderRadius: "4px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#007eb9",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    transform: "translateY(-2px)",
                  },
                  cursor: "pointer",
                }}
              >
                <AuroraBox sx={{ color: "#232f3e", mb: 2 }}>
                  {feature.icon}
                </AuroraBox>
                <AuroraTypography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#232f3e",
                    mb: 1,
                  }}
                >
                  {feature.title}
                </AuroraTypography>
                <AuroraTypography variant="body2" sx={{ color: "#545b64", lineHeight: 1.6 }}>
                  {feature.description}
                </AuroraTypography>
              </AuroraPaper>
            </AuroraGrid>
          ))}
        </AuroraGrid>
      </Container>

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
          sx: { borderRadius: 2 }
        }}
      >
        <AuroraDialogTitle sx={{ fontWeight: 600 }}>Access Workspace</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2, fontSize: '0.9rem' }}>
            Enter your organization's workspace slug to continue to the dashboard.
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
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ec7211',
                },
              },
            }}
          />
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 2 }}>
          <AuroraButton onClick={handleCloseLogin} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={go}
            variant="contained"
            disabled={!slug.trim()}
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              textTransform: 'none',
              fontWeight: 600,
              "&:hover": { bgcolor: "#eb5f07" },
            }}
          >
            Continue
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}

