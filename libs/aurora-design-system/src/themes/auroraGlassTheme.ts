import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * AuroraGlass Design System Theme
 * 
 * A premium glassmorphism theme inspired by aurora gradients.
 * Features 3D depth, glass effects, and subtle glows.
 */
export const auroraGlass = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#10b981", // Emerald 500 - more visible than mint
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9", // Sky 500 - more saturated
      light: "#38bdf8",
      dark: "#0369a1",
      contrastText: "#ffffff",
    },
    background: {
      default: "transparent", 
      paper: "rgba(255, 255, 255, 0.9)", // Increased opacity for readability
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#475569", // Slate 600
    },
    divider: "rgba(0, 0, 0, 0.08)", // More visible divider
  },
  shape: {
    borderRadius: 12, // Reduced from 16
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url('/assets/aurora-bg.png')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.9), // Increased from 0.75
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: `0 8px 32px 0 ${alpha("#1e293b", 0.08)}`,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0 4px 12px 0 ${alpha("#1e293b", 0.05)}`,
        },
        elevation2: {
          boxShadow: `0 8px 24px 0 ${alpha("#1e293b", 0.1)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Reduced from 24
          padding: '16px',
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          "&:hover": {
            transform: "translateY(-6px) scale(1.01)",
            boxShadow: `0 20px 40px 0 ${alpha("#1e293b", 0.12)}, 0 0 15px 0 ${alpha("#10b981", 0.15)}`,
            borderColor: alpha("#10b981", 0.4),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Reduced from 12
          padding: '10px 24px',
          transition: "all 0.3s ease",
          position: 'relative',
          overflow: 'hidden',
          "&:active": {
            transform: "scale(0.95)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: `0 4px 14px 0 ${alpha("#10b981", 0.35)}`,
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: `0 6px 20px 0 ${alpha("#10b981", 0.45)}`,
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          border: '2px solid #10b981',
          color: '#059669',
          backgroundColor: alpha("#10b981", 0.04),
          "&:hover": {
            border: '2px solid #059669',
            backgroundColor: alpha("#10b981", 0.08),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.9), // Increased opacity
          backdropFilter: "blur(20px) saturate(170%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          color: "#0f172a",
          boxShadow: `0 4px 20px 0 ${alpha("#1e293b", 0.05)}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          backgroundColor: alpha("#ffffff", 0.4),
          border: '1px solid rgba(255, 255, 255, 0.3)',
          "&:hover": {
            backgroundColor: alpha("#10b981", 0.1),
            borderColor: alpha("#10b981", 0.3),
            transform: 'rotate(5deg) scale(1.1)',
            color: '#059669',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha("#ffffff", 0.6),
            borderRadius: 8, // Reduced from 12
            transition: 'all 0.3s ease',
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: alpha("#10b981", 0.5),
            },
            "&.Mui-focused": {
              backgroundColor: alpha("#ffffff", 0.9),
              boxShadow: `0 0 15px 0 ${alpha("#10b981", 0.15)}`,
              "& fieldset": {
                borderWidth: '2px',
                borderColor: "#10b981",
              },
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha("#ffffff", 0.95), // Significantly increased for readability
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: `4px 0 24px 0 ${alpha("#1e293b", 0.05)}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          backgroundColor: alpha("#ffffff", 0.3),
          border: "1px solid rgba(255, 255, 255, 0.4)",
          fontWeight: 600,
          borderRadius: '6px',
          height: 24,
          fontSize: '0.75rem',
          transition: 'all 0.2s ease',
          "&.MuiChip-filledPrimary": {
            background: `linear-gradient(135deg, ${alpha("#3b82f6", 0.15)} 0%, ${alpha("#2563eb", 0.15)} 100%)`,
            color: "#1d4ed8",
            borderColor: alpha("#3b82f6", 0.3),
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha("#3b82f6", 0.2)} 0%, ${alpha("#2563eb", 0.2)} 100%)`,
            }
          },
          "&.MuiChip-filledSuccess": {
            background: `linear-gradient(135deg, ${alpha("#10b981", 0.15)} 0%, ${alpha("#059669", 0.15)} 100%)`,
            color: "#047857",
            borderColor: alpha("#10b981", 0.3),
          },
          "&:hover": {
            backgroundColor: alpha("#ffffff", 0.5),
            borderColor: "rgba(255, 255, 255, 0.6)",
          }
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha("#ffffff", 0.95), // Increased opacity
          backdropFilter: "blur(32px) saturate(190%)",
          borderRadius: 16, // Reduced from 24
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: `0 24px 48px 0 ${alpha("#1e293b", 0.15)}`,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: alpha("#ffffff", 0.5),
          fontWeight: 700,
          color: "#1e293b",
          borderBottom: "2px solid rgba(0, 0, 0, 0.05)",
        },
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});
