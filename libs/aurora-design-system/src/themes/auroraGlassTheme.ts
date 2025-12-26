import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * AuroraGlass Design System Theme - Refined
 *
 * A premium glassmorphism theme inspired by emerald aurora gradients.
 * Features 3D depth, frosted glass effects, and a modern aesthetic.
 */
export const auroraGlass = createTheme({
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
    mode: "light",
    primary: {
      main: "#10b981", // Emerald 500
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9", // Sky 500
      light: "#38bdf8",
      dark: "#0369a1",
      contrastText: "#ffffff",
    },
    background: {
      default: "transparent",
      paper: alpha("#FFFFFF", 0.6), // Glassy paper
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#334155", // Slate 700
    },
    divider: "rgba(16, 185, 129, 0.1)", // Emerald tint divider
  },
  shape: {
    borderRadius: 16,
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
            "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 25%, #a7f3d0 50%, #d1fae5 75%, #ecfdf5 100%)", // Emerald aurora gradient
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.6),
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: `0 10px 40px rgba(16, 185, 129, 0.05)`,
          backgroundImage: "none",
          borderRadius: "16px",
        },
        elevation1: {
          boxShadow: `0 4px 12px 0 ${alpha("#10b981", 0.05)}`,
        },
        elevation2: {
          boxShadow: `0 8px 24px 0 ${alpha("#10b981", 0.08)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha("#ffffff", 0.65),
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: `0 4px 20px rgba(16, 185, 129, 0.05)`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 14px 28px rgba(16, 185, 129, 0.1)`,
            borderColor: alpha("#10b981", 0.3),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 20px",
          transition: "all 0.2s ease",
          boxShadow: "none",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: `0 4px 12px ${alpha("#10b981", 0.3)}`,
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: `0 6px 16px ${alpha("#10b981", 0.4)}`,
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          borderColor: "#10b981",
          color: "#059669",
          "&:hover": {
            backgroundColor: alpha("#10b981", 0.05),
            borderColor: "#059669",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.6),
          backdropFilter: "blur(20px) saturate(170%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          color: "#0f172a",
          boxShadow: `0 4px 20px 0 ${alpha("#10b981", 0.05)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha("#ffffff", 0.8),
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: `4px 0 24px 0 ${alpha("#1e293b", 0.02)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha("#ffffff", 0.5),
             backdropFilter: "blur(10px)",
            borderRadius: 12,
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: alpha("#10b981", 0.2),
            },
            "&:hover": {
                 backgroundColor: alpha("#ffffff", 0.7),
            },
            "&:hover fieldset": {
              borderColor: alpha("#10b981", 0.4),
            },
            "&.Mui-focused": {
              backgroundColor: alpha("#ffffff", 0.8),
            },
            "&.Mui-focused fieldset": {
                borderColor: "#10b981",
                borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(4px)",
          fontWeight: 600,
          borderRadius: "8px",
        },
        filled: {
             backgroundColor: alpha("#10b981", 0.1),
             color: "#065F46", // Emerald 800
             "&:hover": {
                 backgroundColor: alpha("#10b981", 0.2),
             }
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: alpha("#F0FDF4", 0.5), // Emerald 50
          fontWeight: 600,
          color: "#334155",
        },
        root: {
          borderBottom: "1px solid rgba(16, 185, 129, 0.06)",
        },
      },
    },
  },
});
