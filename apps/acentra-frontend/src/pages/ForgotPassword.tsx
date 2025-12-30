import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AuroraBox,
  AuroraPaper,
  AuroraTypography,
  AuroraInput,
  AuroraButton,
  AuroraLogo,
  AuroraLink,
  AuroraAlert,
} from "@acentra/aurora-design-system";
import { EmailOutlined, ArrowBack } from "@mui/icons-material";
import { authService } from "@/services/authService";
import styles from "./LandingPage.module.css";

export function ForgotPassword() {
  const { tenant } = useParams<{ tenant: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBox sx={{ display: "flex", minHeight: "100vh", width: "100vw", bgcolor: "background.default" }}>
      {/* Background decoration similar to Login */}
      <AuroraBox
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none"
        }}
        className={styles.heroLightGradient}
      >
        <AuroraBox sx={{ position: "absolute", top: "10%", right: "15%", width: "400px", height: "400px", bgcolor: "rgba(236, 114, 17, 0.08)", filter: "blur(80px)", borderRadius: "50%" }} />
        <AuroraBox sx={{ position: "absolute", bottom: "10%", left: "10%", width: "350px", height: "350px", bgcolor: "rgba(59, 130, 246, 0.08)", filter: "blur(80px)", borderRadius: "50%" }} />
      </AuroraBox>

      <AuroraBox
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          zIndex: 1
        }}
      >
        <AuroraBox sx={{ mb: 4, textAlign: 'center' }}>
          <AuroraLogo width={160} />
        </AuroraBox>

        <AuroraPaper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            border: "1px solid #eaeded",
            bgcolor: "#ffffff",
          }}
        >
          {!submitted ? (
            <>
              <AuroraBox sx={{ textAlign: "center", mb: 4 }}>
                <AuroraTypography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#232f3e" }}>
                  Reset your password
                </AuroraTypography>
                <AuroraTypography variant="body2" color="text.secondary">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </AuroraTypography>
              </AuroraBox>

              {error && (
                <AuroraAlert severity="error" sx={{ mb: 3 }}>
                  {error}
                </AuroraAlert>
              )}

              <form onSubmit={handleSubmit}>
                <AuroraInput
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                />

                <AuroraButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.2, mb: 3 }}
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </AuroraButton>
              </form>
            </>
          ) : (
            <AuroraBox sx={{ textAlign: "center", py: 2 }}>
              <AuroraBox sx={{ bgcolor: 'success.light', color: 'success.main', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, bgOpacity: 0.1 }}>
                <EmailOutlined sx={{ fontSize: 32 }} />
              </AuroraBox>
              <AuroraTypography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                Check your email
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We have sent a password reset link to <strong>{email}</strong>.
              </AuroraTypography>
              <AuroraButton
                fullWidth
                variant="outlined"
                onClick={() => setSubmitted(false)}
                sx={{ mb: 2 }}
              >
                Resend email
              </AuroraButton>
            </AuroraBox>
          )}

          <AuroraBox sx={{ textAlign: "center" }}>
            <AuroraLink
              component="button"
              onClick={() => navigate(tenant ? `/${tenant}` : "/")}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 500, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              <ArrowBack sx={{ fontSize: 16 }} />
              Back to log in
            </AuroraLink>
          </AuroraBox>

        </AuroraPaper>
      </AuroraBox>
    </AuroraBox>
  );
}
