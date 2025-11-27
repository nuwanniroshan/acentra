import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestAuth } from "../api";
import { useTheme } from "../context/ThemeContext";
import {
  AuroraBox,
  AuroraCard,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraLoginIcon,
} from "@acentra/aurora-design-system";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loadUserPreferences } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await requestAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Load user preferences (including theme) from backend
      await loadUserPreferences(response.data.user.id);
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuroraBox
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <AuroraCard sx={{ width: "100%", maxWidth: 450 }}>
        <AuroraBox sx={{ textAlign: "center", mb: 3 }}>
          <AuroraTypography variant="h4" color="primary" gutterBottom>
           Acentra
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Sign in to manage your recruitment pipeline
          </AuroraTypography>
        </AuroraBox>

        {error && (
          <AuroraAlert severity="error" sx={{ mb: 2 }}>
            {error}
          </AuroraAlert>
        )}

        <form onSubmit={handleLogin}>
          <AuroraInput
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <AuroraInput
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <AuroraButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<AuroraLoginIcon />}
            sx={{ mt: 2 }}
          >
            Login
          </AuroraButton>
        </form>
      </AuroraCard>
    </AuroraBox>
  );
}
