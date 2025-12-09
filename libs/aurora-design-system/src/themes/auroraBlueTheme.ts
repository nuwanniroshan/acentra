import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Light Blue Design System Theme
 *
 * Defines the core color palette, typography, and component overrides
 * with a #2563EB (blue-600) accent color for a clean, modern light theme.
 */
export const auroraBlue = createTheme({
  palette: {
    primary: {
      main: "#3385F0", // base color
      light: "#5CA3F5", // lighter variant (30% lighter)
      dark: "#2667C1", // darker variant (25% darker)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9", // sky-500 (complementary blue)
      light: "#38bdf8", // sky-400
      dark: "#0369a1", // sky-700
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
    error: {
      main: "#dc2626", // red-600
      light: "#ef4444", // red-500
      dark: "#991b1b", // red-800
    },
    warning: {
      main: "#f59e0b", // amber-500
      light: "#fbbf24", // amber-400
      dark: "#d97706", // amber-600
    },
    info: {
      main: "#0ea5e9", // sky-500
      light: "#38bdf8", // sky-400
      dark: "#0369a1", // sky-700
    },
    success: {
      main: "#10b981", // emerald-500
      light: "#34d399", // emerald-400
      dark: "#059669", // emerald-600
    },
    grey: {
      50: "#f8fafc", // slate-50
      100: "#f1f5f9", // slate-100
      200: "#e2e8f0", // slate-200
      300: "#cbd5e1", // slate-300
      400: "#94a3b8", // slate-400
      500: "#64748b", // slate-500
      600: "#475569", // slate-600
      700: "#334155", // slate-700
      800: "#1e293b", // slate-800
      900: "#0f172a", // slate-900
    },
    divider: "#e2e8f0", // slate-200
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a3d6a",
          color: "#f0f5fdff",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          transition: "all 0.3s ease-in-out",
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
          },
          "&.Mui-disabled": {
            color: "#cccccc",
          },
        },
        outlinedPrimary: {
          borderColor: "#2563eb",
          color: "#2563eb",
          "&:hover": {
            backgroundColor: alpha("#2563eb", 0.05),
            borderColor: "#1e40af",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#2563eb", 0.04),
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: alpha("#2563eb", 0.06),
          "&:hover": {
            backgroundColor: alpha("#2563eb", 0.08),
            color: "#1e40af",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(148, 163, 184, 0.15)",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation8: {
          // For Menus/Popovers
          backgroundColor: "#ffffff",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            borderColor: alpha("#021235ff", 0.3),
            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: alpha("#94a3b8", 0.3),
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: alpha("#64748b", 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
              boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            "&.Mui-focused": {
              color: "#2563eb",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha("#2563eb", 0.1),
          color: "#1e40af",
          border: `1px solid ${alpha("#2563eb", 0.2)}`,
        },
        outlined: {
          borderColor: "#2563eb",
          color: "#2563eb",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#2563eb",
            "& + .MuiSwitch-track": {
              backgroundColor: "#3b82f6",
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: "#cbd5e1",
          opacity: 1,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
          color: "#ffffff",
        },
        filledError: {
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#ffffff",
        },
        filledInfo: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          color: "#ffffff",
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
        root: {
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        },
        head: {
          fontWeight: 600,
          color: "#475569",
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#64748b",
          "&.Mui-selected": {
            backgroundColor: alpha("#2563eb", 0.1),
            color: "#1e40af",
            border: `1px solid ${alpha("#2563eb", 0.3)}`,
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
        colorPrimary: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(136deg,rgba(255, 255, 255, 1) 0%, rgba(243, 249, 254, 1) 100%)",
          color: "#000000",
          boxShadow: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
});
