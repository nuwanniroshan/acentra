import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  AuroraBox,
  AuroraPaper,
  AuroraTypography,
  AuroraInput,
  AuroraButton,
  AuroraLogo,
  AuroraAlert,
} from "@acentra/aurora-design-system";
import { LockOutlined, CheckCircleOutline } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { authService } from "@/services/authService";
import styles from "./LandingPage.module.css";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { tenant } = useParams<{ tenant: string }>(); // Optional if we want to redirect back to tenant login

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.resetPassword({ token, newPassword });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuroraBox sx={{ display: "flex", minHeight: "100vh", width: "100vw", justifyContent: "center", alignItems: "center", bgcolor: "background.default" }}>
        <AuroraPaper sx={{ p: 4, borderRadius: 4, maxWidth: 400, textAlign: "center" }}>
          <AuroraTypography variant="h6" color="error" sx={{ mb: 2 }}>Invalid Link</AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This password reset link is invalid or missing a token.
          </AuroraTypography>
          <AuroraButton onClick={() => navigate("/")} variant="contained">
            Go to Login
          </AuroraButton>
        </AuroraPaper>
      </AuroraBox>
    );
  }

  return (
    <AuroraBox sx={{ display: "flex", minHeight: "100vh", width: "100vw", bgcolor: "background.default" }}>
      {/* Background decoration */}
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
                  Set new password
                </AuroraTypography>
                <AuroraTypography variant="body2" color="text.secondary">
                  Your new password must be different to previously used passwords.
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
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <AuroraInput
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <AuroraButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.2 }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </AuroraButton>
              </form>
            </>
          ) : (
            <AuroraBox sx={{ textAlign: "center", py: 2 }}>
              <AuroraBox sx={{ bgcolor: 'success.light', color: 'success.main', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, bgOpacity: 0.1 }}>
                <CheckCircleOutline sx={{ fontSize: 32 }} />
              </AuroraBox>
              <AuroraTypography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                Password reset
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your password has been successfully reset.
              </AuroraTypography>
              <AuroraButton
                fullWidth
                variant="contained"
                onClick={() => navigate(tenant ? `/${tenant}` : "/")}
              >
                Back to log in
              </AuroraButton>
            </AuroraBox>
          )}

        </AuroraPaper>
      </AuroraBox>
    </AuroraBox>
  );
}
