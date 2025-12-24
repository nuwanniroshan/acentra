import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Dark Theme
 *
 * Defines the core color palette, typography, and component overrides
 * to achieve the signature "Aurora" aesthetic (glassmorphism, teal gradients).
 */
export const auroraDarkTeal = createTheme({
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
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#005b3bff",
          color: "#f0f5fdff",
          boxShadow: "none",
        },
      },
    },
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
          backgroundColor: "#0f172a",
          border: "1px solid rgba(148, 163, 184, 0.1)",
        },
        elevation8: {
          backgroundColor: "#0f172a",
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