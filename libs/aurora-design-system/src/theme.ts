import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Design System Theme
 *
 * Defines the core color palette, typography, and component overrides
 * to achieve the signature "Aurora" aesthetic (glassmorphism, teal gradients).
 */
export const xAuroraDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#14b8a6", // teal-500
      light: "#5eead4", // teal-300
      dark: "#0f766e", // teal-700
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6366f1", // indigo-500
      light: "#818cf8",
      dark: "#4338ca",
    },
    background: {
      default: "#020617", // slate-950
      paper: "#0f172a", // slate-900
    },
    text: {
      primary: "#f1f5f9", // slate-100
      secondary: "#94a3b8", // slate-400
    },
    error: {
      main: "#e11d48", // rose-600
    },
    success: {
      main: "#10b981", // emerald-500
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background:
            "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)",
          border: "1px solid transparent",
        },
        outlinedPrimary: {
          borderColor: "#14b8a6",
          "&:hover": {
            backgroundColor: alpha("#14b8a6", 0.1),
            borderColor: "#5eead4",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#14b8a6", 0.1),
            color: "#5eead4",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#0f172a", 0.6),
          border: "1px solid rgba(148, 163, 184, 0.1)",
        },
        elevation8: {
          backgroundColor: alpha("#0f172a", 0.95),
          border: "1px solid rgba(148, 163, 184, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:hover": {
            borderColor: alpha("#14b8a6", 0.3),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha("#020617", 0.4),
            "& fieldset": {
              borderColor: alpha("#94a3b8", 0.2),
            },
            "&:hover fieldset": {
              borderColor: alpha("#94a3b8", 0.4),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#14b8a6",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#94a3b8",
            "&.Mui-focused": {
              color: "#14b8a6",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: alpha("#14b8a6", 0.1),
          color: "#5eead4",
          border: `1px solid ${alpha("#14b8a6", 0.2)}`,
        },
        outlined: {
          borderColor: "#14b8a6",
          color: "#14b8a6",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#14b8a6",
            "& + .MuiSwitch-track": {
              backgroundColor: "#0d9488",
            },
          },
        },
        track: {
          backgroundColor: "#334155",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          "&.Mui-expanded": {
            backgroundColor: alpha("#14b8a6", 0.05),
            borderColor: alpha("#14b8a6", 0.3),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          color: "#ffffff",
        },
        filledError: {
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#ffffff",
        },
        filledInfo: {
          background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
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
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        },
        head: {
          color: "#94a3b8",
          backgroundColor: alpha("#0f172a", 0.8),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0f172a",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#94a3b8",
          "&.Mui-selected": {
            backgroundColor: alpha("#14b8a6", 0.1),
            color: "#5eead4",
            border: `1px solid ${alpha("#14b8a6", 0.2)}`,
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
        },
      },
    },
  },
});

export const xAuroraLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#14b8a6", // teal-500
      light: "#5eead4", // teal-300
      dark: "#0f766e", // teal-700
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6366f1", // indigo-500
      light: "#818cf8",
      dark: "#4338ca",
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff", // white
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#475569", // slate-600
    },
    error: {
      main: "#e11d48", // rose-600
    },
    success: {
      main: "#10b981", // emerald-500
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background:
            "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)",
          border: "1px solid transparent",
        },
        outlinedPrimary: {
          borderColor: "#14b8a6",
          "&:hover": {
            backgroundColor: alpha("#14b8a6", 0.1),
            borderColor: "#0f766e",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#14b8a6", 0.1),
            color: "#0f766e",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.8),
          border: "1px solid rgba(148, 163, 184, 0.2)",
        },
        elevation8: {
          backgroundColor: alpha("#ffffff", 0.95),
          border: "1px solid rgba(148, 163, 184, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:hover": {
            borderColor: alpha("#14b8a6", 0.5),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha("#f8fafc", 0.6),
            "& fieldset": {
              borderColor: alpha("#94a3b8", 0.3),
            },
            "&:hover fieldset": {
              borderColor: alpha("#64748b", 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#14b8a6",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            "&.Mui-focused": {
              color: "#14b8a6",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: alpha("#14b8a6", 0.15),
          color: "#0f766e",
          border: `1px solid ${alpha("#14b8a6", 0.3)}`,
        },
        outlined: {
          borderColor: "#14b8a6",
          color: "#0f766e",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#14b8a6",
            "& + .MuiSwitch-track": {
              backgroundColor: "#5eead4",
            },
          },
        },
        track: {
          backgroundColor: "#cbd5e1",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          "&.Mui-expanded": {
            backgroundColor: alpha("#14b8a6", 0.05),
            borderColor: alpha("#14b8a6", 0.4),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          color: "#ffffff",
        },
        filledError: {
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#ffffff",
        },
        filledInfo: {
          background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
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
          color: "#475569",
          backgroundColor: alpha("#f1f5f9", 0.8),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#64748b",
          "&.Mui-selected": {
            backgroundColor: alpha("#14b8a6", 0.15),
            color: "#0f766e",
            border: `1px solid ${alpha("#14b8a6", 0.3)}`,
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
        },
      },
    },
  },
});

/**
 * Light Blue Design System Theme
 *
 * Defines the core color palette, typography, and component overrides
 * with a #2563EB (blue-600) accent color for a clean, modern light theme.
 */
export const auroraTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // blue-600
      light: "#60a5fa", // blue-400
      dark: "#1e40af", // blue-800
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7c3aed", // violet-600
      light: "#a78bfa",
      dark: "#5b21b6",
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
    },
    success: {
      main: "#16a34a", // green-600
    },
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
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: alpha("#2563eb", 0.03),
            borderColor: alpha("#2563eb", 0.3),
            margin: "8px 0",
          },
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
  },
});
