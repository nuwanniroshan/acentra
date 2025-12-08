import { createTheme } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Charcoal Theme
 *
 * Defines the core color palette, typography, and component overrides
 * with a charcoal gray color scheme for a clean light theme.
 */
export const auroraCharcoal = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#656161", // medium gray
      light: "#969393", // light gray
      dark: "#424040", // dark gray
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#424040", // dark gray
      light: "#656161", // medium gray
      dark: "#1a1a1a", // darkest gray
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a", // darkest gray
      secondary: "#424040", // dark gray
    },
    error: {
      main: "#ef4444", // red-500
    },
    success: {
      main: "#10b981", // emerald-500
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
          backgroundColor: "#656161",
          border: "1px solid transparent",
          "&:hover": {
            backgroundColor: "#424040",
          },
        },
        outlinedPrimary: {
          borderColor: "#656161",
          color: "#656161",
          "&:hover": {
            backgroundColor: "#b8b8b8",
            borderColor: "#424040",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#b8b8b8",
            color: "#424040",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "none",
        },
        elevation8: {
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "none",
          "&:hover": {
            borderColor: "#424040",
            boxShadow: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "#656161",
          color: "#b8b8b8",
          border: `1px solid #424040`,
        },
        outlined: {
          borderColor: "#656161",
          color: "#656161",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#656161",
            "& + .MuiSwitch-track": {
              backgroundColor: "#424040",
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: "#969393",
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
          border: "1px solid #656161",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: "#b8b8b8",
            borderColor: "#424040",
            margin: "8px 0",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: "#10b981",
          color: "#ffffff",
        },
        filledError: {
          backgroundColor: "#ef4444",
          color: "#ffffff",
        },
        filledInfo: {
          backgroundColor: "#656161",
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
          borderBottom: "1px solid #656161",
        },
        head: {
          fontWeight: 600,
          color: "#1a1a1a",
          backgroundColor: "#969393",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#969393",
          backgroundImage: "none",
          border: "1px solid #424040",
          boxShadow: "none",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#424040",
          "&.Mui-selected": {
            backgroundColor: "#656161",
            color: "#b8b8b8",
            border: `1px solid #424040`,
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
          backgroundColor: "#656161",
        },
      },
    },
  },
});