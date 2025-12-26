import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Blue Design System Theme - Glass Edition
 *
 * A modern, glassmorphic theme built on a strong blue foundation.
 * Features a dynamic blue aurora gradient, frosted glass elements,
 * and high-contrast blue accents.
 */
export const auroraBlue = createTheme({
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.04)", // elevation 1
    "0px 1px 3px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.06)",
    "0px 2px 6px rgba(0, 0, 0, 0.07)",
    "0px 3px 8px rgba(0, 0, 0, 0.08)", // elevation 5
    "0px 3px 10px rgba(0, 0, 0, 0.09)",
    "0px 4px 12px rgba(0, 0, 0, 0.1)",
    "0px 6px 16px rgba(0, 0, 0, 0.1)", // elevation 8
    "0px 8px 20px rgba(0, 0, 0, 0.11)",
    "0px 10px 24px rgba(0, 0, 0, 0.12)",
    "0px 12px 28px rgba(0, 0, 0, 0.13)",
    "0px 14px 32px rgba(0, 0, 0, 0.14)",
    "0px 16px 36px rgba(0, 0, 0, 0.15)",
    "0px 18px 40px rgba(0, 0, 0, 0.16)",
    "0px 20px 44px rgba(0, 0, 0, 0.17)",
    "0px 12px 24px rgba(0, 0, 0, 0.12)", // elevation 16
    "0px 14px 28px rgba(0, 0, 0, 0.13)",
    "0px 16px 32px rgba(0, 0, 0, 0.14)",
    "0px 18px 36px rgba(0, 0, 0, 0.15)",
    "0px 20px 40px rgba(0, 0, 0, 0.16)",
    "0px 22px 44px rgba(0, 0, 0, 0.17)",
    "0px 24px 48px rgba(0, 0, 0, 0.18)",
    "0px 26px 52px rgba(0, 0, 0, 0.19)",
    "0px 28px 56px rgba(0, 0, 0, 0.2)",
  ] as any,
  palette: {
    primary: {
      main: "#1D4ED8", // Blue-700 - Punchier blue
      light: "#3B82F6", // Blue-500
      dark: "#1E40AF", // Blue-800
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#334155", // Slate-700
      light: "#475569",
      dark: "#1e293b",
      contrastText: "#ffffff",
    },
    background: {
      default: "transparent", // Handled in CssBaseline
      paper: alpha("#FFFFFF", 0.6), // Glassy paper
    },
    text: {
      primary: "#0F172A", // Slate-900
      secondary: "#334155", // Slate-700
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#F59E0B",
    },
    info: {
      main: "#3B82F6",
    },
    success: {
      main: "#10B981",
    },
    divider: "rgba(51, 133, 240, 0.1)", // Subtle blue divider
  },
  shape: {
    borderRadius: "2px",
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", color: "#0F172A" },
    h2: { fontWeight: 700, fontSize: "2rem", color: "#0F172A" },
    h3: { fontWeight: 600, fontSize: "1.5rem", color: "#1E293B" },
    h4: { fontWeight: 600, fontSize: "1.25rem", color: "#1E293B" },
    h5: { fontWeight: 600, fontSize: "1.125rem", color: "#1E293B" },
    h6: { fontWeight: 600, fontSize: "1rem", color: "#334155" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #dbeafe 75%, #eff6ff 100%)", // Blue aurora gradient
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#FFFFFF", 0.6),
          backdropFilter: "blur(20px)",
          boxShadow: "0px 4px 20px rgba(37, 99, 235, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          color: "#0F172A",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          padding: "8px 20px",
          transition: "all 0.2s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #3385F0 0%, #2563EB 100%)",
          boxShadow: "0px 4px 12px rgba(37, 99, 235, 0.3)",
          "&:hover": {
            boxShadow: "0px 6px 16px rgba(37, 99, 235, 0.4)",
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          borderColor: "#3385F0",
          color: "#2563EB",
          "&:hover": {
            backgroundColor: alpha("#3385F0", 0.05),
            borderColor: "#2563EB",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha("#FFFFFF", 0.6),
          backdropFilter: "blur(25px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0px 10px 40px rgba(37, 99, 235, 0.06)",
          borderRadius: "2px",
        },
        elevation1: { boxShadow: "0px 4px 12px rgba(37, 99, 235, 0.04)" },
        elevation2: { boxShadow: "0px 8px 24px rgba(37, 99, 235, 0.06)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          backgroundColor: alpha("#FFFFFF", 0.65),
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0px 4px 20px rgba(37, 99, 235, 0.04)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 12px 28px rgba(37, 99, 235, 0.1)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha("#FFFFFF", 0.8),
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.5)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(37, 99, 235, 0.06)",
        },
        head: {
          backgroundColor: alpha("#F1F5F9", 0.5), // Slate-100 half transparent
          color: "#334155",
          fontWeight: 600,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#FFFFFF", 0.5),
          backdropFilter: "blur(10px)",
          "&:hover": {
            backgroundColor: alpha("#FFFFFF", 0.7),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          "& fieldset": {
            borderColor: alpha("#3385F0", 0.2),
          },
          "&:hover fieldset": {
            borderColor: alpha("#3385F0", 0.4),
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3385F0",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          backdropFilter: "blur(4px)",
        },
        filled: {
          backgroundColor: alpha("#3385F0", 0.1),
          color: "#1E40AF", // Blue-800
          "&:hover": {
            backgroundColor: alpha("#3385F0", 0.2),
          },
        },
      },
    },
  },
});
