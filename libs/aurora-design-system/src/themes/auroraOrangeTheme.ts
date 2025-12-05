import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Random Theme
 *
 * Defines a vibrant, colorful theme with randomly selected accent colors
 * for a playful and dynamic user experience.
 */
export const auroraLightOrange = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f59e0b", // amber-500
      light: "#fbbf24", // amber-400
      dark: "#d97706", // amber-600
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ec4899", // pink-500
      light: "#f472b6", // pink-400
      dark: "#db2777", // pink-600
    },
    background: {
      default: "#fef7ed", // orange-50
      paper: "#ffffff",
    },
    text: {
      primary: "#1c1917", // stone-900
      secondary: "#57534e", // stone-600
    },
    error: {
      main: "#dc2626", // red-600
    },
    success: {
      main: "#16a34a", // green-600
    },
  },
  shape: {
    borderRadius: 2,
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
          borderRadius: "12px",
          boxShadow: "none",
          transition: "all 0.3s ease-in-out",
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #f59e0b 0%, #ec4899 30%, #8b5cf6 60%, #06b6d4 100%)",
          boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
            transform: "translateY(-1px)",
          },
        },
        outlinedPrimary: {
          borderColor: "#f59e0b",
          color: "#f59e0b",
          "&:hover": {
            backgroundColor: alpha("#f59e0b", 0.1),
            borderColor: "#d97706",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#f59e0b", 0.1),
            color: "#d97706",
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: "4px",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(245, 158, 11, 0.1), 0 1px 2px 0 rgba(245, 158, 11, 0.05)",
        },
        elevation8: {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow:
            "0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          borderRadius: "2px",
          "&:hover": {
            borderColor: alpha("#f59e0b", 0.4),
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.2)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: "2px",
            "& fieldset": {
              borderColor: alpha("#f59e0b", 0.3),
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: alpha("#d97706", 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#57534e",
            "&.Mui-focused": {
              color: "#f59e0b",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "2px",
        },
        filled: {
          backgroundColor: alpha("#f59e0b", 0.15),
          color: "#d97706",
          border: `1px solid ${alpha("#f59e0b", 0.3)}`,
        },
        outlined: {
          borderColor: "#f59e0b",
          color: "#f59e0b",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#f59e0b",
            "& + .MuiSwitch-track": {
              backgroundColor: "#fbbf24",
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: "#fed7aa",
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
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: "12px",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: alpha("#f59e0b", 0.05),
            borderColor: alpha("#f59e0b", 0.4),
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
          borderRadius: "12px",
        },
        filledError: {
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#ffffff",
          borderRadius: "12px",
        },
        filledInfo: {
          background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
          color: "#ffffff",
          borderRadius: "12px",
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
          borderBottom: "1px solid rgba(245, 158, 11, 0.2)",
        },
        head: {
          fontWeight: 600,
          color: "#57534e",
          backgroundColor: "#fef7ed",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)",
          borderRadius: "20px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#57534e",
          borderRadius: "8px",
          "&.Mui-selected": {
            backgroundColor: alpha("#f59e0b", 0.15),
            color: "#d97706",
            border: `1px solid ${alpha("#f59e0b", 0.3)}`,
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
          background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
        },
      },
    },
  },
});