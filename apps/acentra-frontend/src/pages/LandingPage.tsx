import { useState } from "react";
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
  AuroraPaper,
  AuroraGrid,
  AuroraLogo,
} from "@acentra/aurora-design-system";
import {
  AuroraLiveIconUsers,
  AuroraLiveIconBadgeDollarSign,
  AuroraLiveIconCalendar1,
  AuroraLiveIconClock8,
} from "@acentra/aurora-design-system";
import { Container, Stack } from "@mui/material";

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [slug, setSlug] = useState("");
  const navigate = useNavigate();

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
      icon: (
        <AuroraLiveIconUsers
          width={32}
          height={32}
          stroke="currentColor"
          style={{ padding: 0 }}
        />
      ),
      title: "Recruitment & Hiring",
      description:
        "Streamline your hiring process with intelligent candidate shortlisting, automated workflows, and collaborative decision-making tools.",
    },
    {
      icon: (
        <AuroraLiveIconBadgeDollarSign
          width={32}
          height={32}
          stroke="currentColor"
          style={{ padding: 0 }}
        />
      ),
      title: "Payroll Management",
      description:
        "Automate payroll processing with accuracy. Handle taxes, deductions, and compliance effortlessly while ensuring timely payments.",
    },
    {
      icon: (
        <AuroraLiveIconCalendar1
          width={32}
          height={32}
          stroke="currentColor"
          style={{ padding: 0 }}
        />
      ),
      title: "Leave Management",
      description:
        "Simplify leave requests and approvals with an intuitive system. Track balances, manage policies, and maintain transparency.",
    },
    {
      icon: (
        <AuroraLiveIconClock8
          width={32}
          height={32}
          stroke="currentColor"
          style={{ padding: 0 }}
        />
      ),
      title: "Time Tracking",
      description:
        "Monitor employee hours with precision. Real-time tracking, automated timesheets, and seamless integration with payroll.",
    },
  ];

  return (
    <AuroraBox
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AuroraBox
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AuroraLogo width="150px" height="auto" />
        <AuroraButton variant="contained" onClick={handleLoginClick}>
          Login
        </AuroraButton>
      </AuroraBox>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          pt: 6,
          pb: 6,
          background: "linear-gradient(135deg, #fafbff 0%, #b9ccf9 100%)",
        }}
      >
        <AuroraGrid container spacing={6} alignItems="center">
          <AuroraGrid size={{ xs: 12, md: 12 }}>
            <AuroraBox>
              <AuroraBox
                sx={{
                  display: "inline-block",
                  bgcolor: "grey.100",
                  color: "text.primary",
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  mb: 2,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Modern HR Management
              </AuroraBox>
              <AuroraTypography
                variant="h2"
                component="h1"
                fontWeight="800"
                gutterBottom
                sx={{ lineHeight: 1.2 }}
              >
                Transform Your <br />
                <AuroraBox component="span" sx={{ color: "primary.main" }}>
                  Workforce Management
                </AuroraBox>
              </AuroraTypography>
              <AuroraTypography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400, maxWidth: 500 }}
              >
                The all-in-one HR platform that empowers teams to work smarter.
                From recruitment to payroll, we&apos;ve got you covered.
              </AuroraTypography>
              <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
                <AuroraButton
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                >
                  Get Started →
                </AuroraButton>
                <AuroraButton
                  variant="outlined"
                  size="large"
                  onClick={handleLoginClick}
                >
                  Watch Demo
                </AuroraButton>
              </Stack>
            </AuroraBox>
          </AuroraGrid>
        </AuroraGrid>
      </Container>

      {/* Features Section */}
      <AuroraBox sx={{ bgcolor: "background.paper", py: 10 }}>
        <Container maxWidth="lg">
          <AuroraBox sx={{ textAlign: "center", mb: 8 }}>
            <AuroraBox
              sx={{
                display: "inline-block",
                bgcolor: "grey.100",
                color: "text.primary",
                px: 2,
                py: 0.5,
                borderRadius: 4,
                mb: 2,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Features
            </AuroraBox>
            <AuroraTypography variant="h3" fontWeight="800" gutterBottom>
              Everything You Need in{" "}
              <AuroraBox component="span" sx={{ color: "primary.main" }}>
                One Platform
              </AuroraBox>
            </AuroraTypography>
            <AuroraTypography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400, maxWidth: 700, mx: "auto" }}
            >
              Powerful tools designed to simplify HR operations and boost
              productivity
            </AuroraTypography>
          </AuroraBox>

          <AuroraGrid container spacing={4}>
            {features.map((feature, index) => (
              <AuroraGrid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <AuroraPaper
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: "background.default",
                  }}
                  elevation={0}
                >
                  <AuroraBox
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "primary.main",
                    }}
                  >
                    {feature.icon}
                  </AuroraBox>
                  <AuroraTypography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </AuroraTypography>
                  <AuroraTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </AuroraTypography>
                </AuroraPaper>
              </AuroraGrid>
            ))}
          </AuroraGrid>
        </Container>
      </AuroraBox>

      {/* CTA Section */}
      <AuroraBox
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <AuroraBox
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: { xs: 4, md: 8 },
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <AuroraTypography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{ color: "text.primary", mb: 3 }}
            >
              Ready to Transform Your HR?
            </AuroraTypography>
            <AuroraTypography
              variant="h6"
              sx={{
                mb: 6,
                fontWeight: 400,
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Join thousands of companies that trust acentra to manage their
              workforce effectively
            </AuroraTypography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <AuroraButton
                variant="contained"
                size="large"
                onClick={handleLoginClick}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(63, 81, 181, 0.3)",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "0 6px 20px rgba(63, 81, 181, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Free Trial →
              </AuroraButton>
              <AuroraButton
                variant="outlined"
                size="large"
                onClick={handleLoginClick}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    borderColor: "primary.main",
                    boxShadow: "0 4px 14px rgba(63, 81, 181, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Sign In
              </AuroraButton>
            </Stack>
          </AuroraBox>
        </Container>

        {/* Decorative elements */}
        <AuroraBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
      </AuroraBox>

      {/* Footer */}
      <AuroraBox
        component="footer"
        sx={{ py: 4, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AuroraLogo width={120} height={"auto"} />
            </Stack>
            <AuroraTypography variant="body2" color="text.secondary">
              © 2025 acentra. All rights reserved.
            </AuroraTypography>
            <Stack direction="row" spacing={3}>
              <AuroraTypography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Privacy
              </AuroraTypography>
              <AuroraTypography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Terms
              </AuroraTypography>
              <AuroraTypography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Contact
              </AuroraTypography>
            </Stack>
          </Stack>
        </Container>
      </AuroraBox>

      {/* Login Dialog */}
      <AuroraDialog
        open={openLogin}
        onClose={handleCloseLogin}
        maxWidth="xs"
        fullWidth
      >
        <AuroraDialogTitle>Sign in to your workspace</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2 }}>
            Enter your company&apos;s workspace name to continue.
          </AuroraDialogContentText>
          <AuroraInput
            autoFocus
            margin="dense"
            label="Company Name"
            placeholder="your-company-name"
            fullWidth
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 3, pt: 0 }}>
          <AuroraButton onClick={handleCloseLogin} color="inherit">
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={go}
            variant="contained"
            disabled={!slug.trim()}
          >
            Continue
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
