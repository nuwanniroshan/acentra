import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
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
  AuroraAlert,
  AuroraCircularProgress,
} from "@acentra/aurora-design-system";
import { jobsService, type Job } from "../services/jobsService";
import {
  AuroraLiveIconUsers,
  AuroraLiveIconBadgeDollarSign,
  AuroraLiveIconCalendar1,
  AuroraLiveIconClock8,
} from "@acentra/aurora-design-system";
import { HeroSection } from "../components/Hero/HeroSection";
import { RequestDemoModal } from "../components/RequestDemoModal";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { Container, Stack, Divider } from "@mui/material";
import styles from "./LandingPage.module.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FeatureRow = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 0]); // Keep text stable but animate entrance

  const isReversed = index % 2 === 1;

  return (
    <AuroraGrid
      ref={ref}
      container
      spacing={{ xs: 4, md: 8 }}
      alignItems="center"
      direction={isReversed ? "row-reverse" : "row"}
      sx={{
        py: 8,
        position: "relative",
      }}
    >
      <AuroraGrid size={{ xs: 12, md: 6 }}>
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: textY }}
        >
          <AuroraPaper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative background gradient inside card */}
            <AuroraBox
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                zIndex: 0
              }}
            />

            <AuroraBox
              sx={{
                position: "relative",
                zIndex: 1,
                mb: 3,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 8px 16px -4px rgba(59, 130, 246, 0.5)",
                color: "white"
              }}
            >
              <AuroraBox sx={{ "& svg": { width: 32, height: 32 } }}>
                {feature.icon}
              </AuroraBox>
            </AuroraBox>

            <AuroraTypography
              variant="h3"
              sx={{
                position: "relative",
                zIndex: 1,
                fontWeight: 800,
                color: "#0f172a",
                mb: 2,
                fontSize: "2rem"
              }}
            >
              {feature.title}
            </AuroraTypography>

            <AuroraTypography
              variant="body1"
              sx={{
                position: "relative",
                zIndex: 1,
                color: "#475569",
                mb: 4,
                fontSize: "1.05rem",
                lineHeight: 1.7,
              }}
            >
              {feature.description}
            </AuroraTypography>

            <AuroraButton
              variant="outlined"
              sx={{
                position: "relative",
                zIndex: 1,
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderColor: "#cbd5e1",
                color: "#334155",
                px: 3,
                py: 1,
                bgcolor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  bgcolor: "white",
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
                },
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.3s ease"
              }}
            >
              Learn more
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </AuroraButton>
          </AuroraPaper>
        </motion.div>
      </AuroraGrid>

      <AuroraGrid size={{ xs: 12, md: 6 }}>
        <motion.div style={{ y: imageY }}>
          <AuroraPaper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              p: 1.5,
            }}
          >
            <AuroraBox sx={{ borderRadius: 3, overflow: "hidden", position: "relative" }}>
              <img
                src={feature.image}
                alt={feature.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
              {/* Glass Overlay on Image */}
              <AuroraBox sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.03) 100%)",
                pointerEvents: "none"
              }} />
            </AuroraBox>
          </AuroraPaper>
        </motion.div>
      </AuroraGrid>
    </AuroraGrid>
  );
};

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openDemoModal, setOpenDemoModal] = useState(false);
  const [slug, setSlug] = useState("");
  const [checkingTenant, setCheckingTenant] = useState(false);
  const [tenantError, setTenantError] = useState("");
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const result = await jobsService.getPublicJobs(undefined, 1);
        if (result.data) {
          setRecentJobs(result.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch recent jobs", err);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleLoginClick = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
    setTenantError("");
    setSlug("");
  };

  const handleDemoClick = () => {
    setOpenDemoModal(true);
  };

  const handleCloseDemo = () => {
    setOpenDemoModal(false);
  };

  const go = async () => {
    if (slug.trim()) {
      setCheckingTenant(true);
      setTenantError("");
      const tenantSlug = slug.trim().toLowerCase();

      try {
        const result = await authService.checkTenant(tenantSlug);
        if (result.exists) {
          if (result.tenantId) {
            localStorage.setItem("tenantId", result.tenantId);
          }
          navigate(`/${tenantSlug}`);
        } else {
          setTenantError(
            "Workspace not found. Please check the name and try again."
          );
        }
      } catch (error) {
        console.error("Error checking tenant:", error);
        setTenantError(
          "An error occurred while checking workspace. Please try again."
        );
      } finally {
        setCheckingTenant(false);
      }
    }
  };

  // ... features definition stays the same

  const features = [
    {
      icon: <AuroraLiveIconUsers width={24} height={24} />,
      title: "Recruitment & Hiring",
      description:
        "Streamline your hiring process with intelligent shortlisting and automated workflows.",
      image: "/recruitment-hiring.png",
    },
    {
      icon: <AuroraLiveIconBadgeDollarSign width={24} height={24} />,
      title: "Payroll Management",
      description:
        "Automate payroll processing with accuracy. Handle taxes and compliance effortlessly.",
      image: "/payroll-management.png",
    },
    {
      icon: <AuroraLiveIconCalendar1 width={24} height={24} />,
      title: "Leave Management",
      description:
        "Simplify leave requests and policies with an intuitive, transparent system.",
      image: "/leave-management.png",
    },
    {
      icon: <AuroraLiveIconClock8 width={24} height={24} />,
      title: "Time Tracking",
      description:
        "Monitor employee hours with precision using real-time tracking integration.",
      image: "/time-tracking.png",
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
          <Link to="/public/careers" style={{ textDecoration: 'none' }}>
            <AuroraButton variant="text" sx={{ color: "white" }}>Careers</AuroraButton>
          </Link>

        </Stack>
      </AuroraBox>

      {/* Hero Section - Animated Light Gradient */}
      <HeroSection
        onDemoClick={handleDemoClick}
        onLoginClick={handleLoginClick}
      />

      {/* Features / Solutions Section */}
      {/* Features / Solutions Section */}
      <Container maxWidth="lg" sx={{ py: 15, position: "relative" }}>
        {/* Background Decorations for Section */}
        <AuroraBox
          sx={{
            position: "absolute",
            top: "10%",
            right: "-10%",
            width: "50%",
            height: "50%",
            background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.05), transparent 70%)",
            filter: "blur(80px)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <AuroraBox
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "-10%",
            width: "50%",
            height: "50%",
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05), transparent 70%)",
            filter: "blur(80px)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <AuroraBox sx={{ textAlign: "center", mb: 16, position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AuroraTypography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 3,
                fontSize: { xs: "2rem", md: "2.5rem" },
                letterSpacing: "-0.01em",
              }}
            >
              Explore Our Solutions
            </AuroraTypography>
            <AuroraTypography
              variant="h6"
              sx={{
                color: "#64748b",
                fontWeight: 400,
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Comprehensive tools designed to restrict complexity and unleash potential across your entire HR operation.
            </AuroraTypography>
          </motion.div>
        </AuroraBox>

        <Stack spacing={8}>
          {features.map((feature, index) => (
            <FeatureRow key={index} feature={feature} index={index} />
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
              "linear-gradient(90deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.05) 50%, rgba(15, 23, 42, 0) 100%)",
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
              Choose the plan that fits your organization&apos;s needs.
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
                    sx={{
                      fontWeight: 700,
                      color: "#ec7211",
                      fontSize: "3.5rem",
                    }}
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
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Request Demo
          </AuroraButton>
        </Container>
      </AuroraBox>

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <AuroraBox sx={{ py: 12, bgcolor: "#fff", borderTop: "1px solid #eaeded" }}>
          <Container maxWidth="lg">
            <AuroraBox sx={{ textAlign: "center", mb: 8 }}>
              <AuroraTypography variant="h4" sx={{ fontWeight: 700, color: "#232f3e", mb: 2 }}>
                Recent Opportunities
              </AuroraTypography>
              <AuroraTypography variant="body1" sx={{ color: "#545b64", mb: 4 }}>
                Explore the latest roles from top companies using Acentra.
              </AuroraTypography>
            </AuroraBox>
            <AuroraGrid container spacing={4}>
              {recentJobs.map((job, index) => (
                <AuroraGrid key={job.id || index} size={{ xs: 12, md: 6, lg: 3 }}>
                  <Link to={`/public/careers/${(job as any).tenantId || 'default'}/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <AuroraPaper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        borderRadius: "3px",
                        border: '1px solid #eaeded',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <AuroraTypography variant="h6" fontWeight={700} sx={{ color: '#232f3e', mb: 1, fontSize: '1.1rem', lineHeight: 1.3 }}>
                        {job.title}
                      </AuroraTypography>
                      <AuroraBox display="flex" alignItems="center" gap={1} mb={2}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <AuroraTypography variant="caption" color="text.secondary">
                          {job.branch || 'Remote'}
                        </AuroraTypography>
                      </AuroraBox>
                      <AuroraButton size="small" endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ textTransform: 'none', p: 0 }}>
                        View Details
                      </AuroraButton>
                    </AuroraPaper>
                  </Link>
                </AuroraGrid>
              ))}
            </AuroraGrid>
            <AuroraBox textAlign="center" mt={6}>
              <Link to="/public/careers" style={{ textDecoration: 'none' }}>
                <AuroraButton variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: "3px" }}>
                  View All Positions
                </AuroraButton>
              </Link>
            </AuroraBox>
          </Container>
        </AuroraBox>
      )}

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
          sx: {
            borderRadius: 2,
            bgcolor: "#ffffff", // Solid white background
            backdropFilter: "none", // Remove glass effect blur
            backgroundImage: "none", // Remove any gradients
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)", // Strong shadow for separation
          },
        }}
      >
        <AuroraDialogTitle sx={{ fontWeight: 600, color: "#232f3e" }}>
          Access Workspace
        </AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2, fontSize: "0.9rem", color: "#545b64" }}>
            Enter your organization&apos;s workspace slug to continue to the
            dashboard.
          </AuroraDialogContentText>
          {tenantError && (
            <AuroraAlert severity="error" sx={{ mb: 2 }}>
              {tenantError}
            </AuroraAlert>
          )}
          <AuroraInput
            autoFocus
            margin="dense"
            label="Workspace Slug"
            placeholder="e.g. acme-corp"
            fullWidth
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              if (tenantError) setTenantError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && go()}
            disabled={checkingTenant}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff", // Ensure input background is white
                "&.Mui-focused fieldset": {
                  borderColor: "#ec7211",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#545b64", // Ensure label is visible
              },
              "& .MuiInputBase-input": {
                color: "#232f3e", // Ensure input text is visible
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
            disabled={!slug.trim() || checkingTenant}
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 100,
              "&:hover": { bgcolor: "#eb5f07" },
              // Ensure spinner is visible when loading (disabled state)
              "&.Mui-disabled": {
                bgcolor: checkingTenant ? "#ec7211" : undefined,
                color: "white",
                opacity: checkingTenant ? 0.7 : undefined,
              },
            }}
          >
            {checkingTenant ? (
              <AuroraCircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Continue"
            )}
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      <RequestDemoModal open={openDemoModal} onClose={handleCloseDemo} />
    </AuroraBox>
  );
}
