import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/authSlice";
import {
  AuroraBox,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraLink,
  AuroraAlert,
  AuroraCheckbox,
  AuroraLogo,
  AuroraPaper,
} from "@acentra/aurora-design-system";
import {
  EmailOutlined,
  LockOutlined,
  Google,
  Window
} from "@mui/icons-material";
import { InputAdornment, Divider, Stack } from "@mui/material";


interface LoginProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else if (tenant) {
      navigate(`/${tenant}/forgot-password`);
    } else {
      // Fallback if no tenant is present, though Login usually requires one
      alert("Please contact support or use your specific workspace URL to reset password.");
    }
  };

  useEffect(() => {
    if (user && onSuccess) {
      onSuccess();
    }
  }, [user, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <AuroraBox sx={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Left Side - Logo Placeholder */}
      <AuroraBox
        sx={{
          flex: "0 0 40%", // Reduced width to 40%
          display: { xs: "none", md: "flex" },
          flexDirection: "column", // Stack content vertically
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "hidden", // Clip blobs
        }}
        className={styles.heroLightGradient}
      >
        {/* Soft Abstract Blobs */}
        <AuroraBox
          sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            bgcolor: "rgba(255, 255, 255, 0.4)",
            filter: "blur(60px)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
        <AuroraBox
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            width: "250px",
            height: "250px",
            bgcolor: "rgba(236, 114, 17, 0.15)", // Brand orange tint
            filter: "blur(50px)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <AuroraBox sx={{ zIndex: 1, textAlign: "center", p: 4 }}>
          <AuroraLogo width={180} />
          <AuroraTypography
            variant="h5"
            sx={{
              mt: 4,
              fontWeight: 500,
              color: "#232f3e",
              letterSpacing: "-0.5px",
            }}
          >
            Simplify HR. One platform.
          </AuroraTypography>
          <AuroraTypography
            variant="body1"
            sx={{ mt: 1, color: "#545b64", opacity: 0.8 }}
          >
            Manage your workforce with confidence.
          </AuroraTypography>
        </AuroraBox>
      </AuroraBox>

      {/* Right Side - Login Form */}
      <AuroraBox
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // Center vertically
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <AuroraPaper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 3, sm: 5 },
            borderRadius: 5, // 20px
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            border: "1px solid #eaeded",
            bgcolor: "#ffffff",
          }}
        >
          <AuroraBox sx={{ textAlign: "center", mb: 4 }}>
            <AuroraTypography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1.5, color: "#232f3e", fontSize: "1.75rem" }}
            >
              Log in
            </AuroraTypography>
            <AuroraTypography variant="body1" color="text.secondary">
              Welcome back. Please sign in to continue.
            </AuroraTypography>
          </AuroraBox>

          {/* SSO Buttons */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <AuroraButton
              fullWidth
              variant="outlined"
              startIcon={<Google sx={{ color: "#DB4437" }} />}
              sx={{
                bgcolor: "white",
                color: "#232f3e",
                borderColor: "#d5dbdb",
                justifyContent: "center",
                textTransform: "none",
                fontWeight: 500,
                py: 1.2,
                "&:hover": { bgcolor: "#f2f3f3", borderColor: "#cdd0d0" },
              }}
              onClick={() => { }}
            >
              Continue with Google
            </AuroraButton>
            <AuroraButton
              fullWidth
              variant="outlined"
              startIcon={<Window sx={{ color: "#00a4ef" }} />}
              sx={{
                bgcolor: "white",
                color: "#232f3e",
                borderColor: "#d5dbdb",
                justifyContent: "center",
                textTransform: "none",
                fontWeight: 500,
                py: 1.2,
                "&:hover": { bgcolor: "#f2f3f3", borderColor: "#cdd0d0" },
              }}
              onClick={() => { }}
            >
              Continue with Microsoft
            </AuroraButton>
          </Stack>

          <Divider sx={{ mb: 3, color: "#545b64", fontSize: "0.9rem" }}>OR</Divider>

          {error && (
            <AuroraAlert severity="error" sx={{ mb: 3 }}>
              {error}
            </AuroraAlert>
          )}

          <form onSubmit={handleSubmit}>
            <AuroraInput
              fullWidth
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="none" // Controlled spacing
              disabled={loading}
              sx={{ mb: 2.5 }}
            />

            <AuroraInput
              fullWidth
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="none"
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <AuroraBox
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <AuroraBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover .MuiTypography-root": { color: "#232f3e" } // Micro-interaction
                }}
              >
                <AuroraCheckbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ p: 0.5, mr: 0.5 }}
                />
                <AuroraTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ transition: "color 0.2s" }}
                >
                  Remember me
                </AuroraTypography>
              </AuroraBox>

              <AuroraLink
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ fontWeight: 500 }}
              >
                Forgot Password?
              </AuroraLink>
            </AuroraBox>

            <AuroraButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.2, // Slightly reduced height
                mb: 3,
                bgcolor: "#ec7211",
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#eb5f07",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 10px rgba(236,114,17,0.3)"
                },
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </AuroraButton>
          </form>

          <AuroraBox sx={{ textAlign: "center", mt: 2 }}>
            <AuroraTypography variant="body2" color="text.secondary">
              Don&apos;t know your workspace?{" "}
              <AuroraLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Find Workspace functionality coming soon! Please check your invitation email.");
                }}
                sx={{ fontWeight: 600 }}
              >
                Find it
              </AuroraLink>
            </AuroraTypography>
            <AuroraBox sx={{ mt: 1 }}>
              <AuroraLink
                component="button"
                onClick={() => {
                  localStorage.removeItem("tenantId");
                  navigate("/");
                }}
                variant="caption"
                sx={{ color: "#545b64" }}
              >
                Switch workspace
              </AuroraLink>
            </AuroraBox>
          </AuroraBox>
        </AuroraPaper>
      </AuroraBox>

    </AuroraBox>
  );
};

export default Login;
