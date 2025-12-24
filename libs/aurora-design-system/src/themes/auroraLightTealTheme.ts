import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Light Theme
 *
 * Defines the core color palette, typography, and component overrides
 * to achieve the signature "Aurora" aesthetic (glassmorphism, teal gradients).
 */
export const auroraLightTeal = createTheme({
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
  shape: {
    borderRadius: 2,
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