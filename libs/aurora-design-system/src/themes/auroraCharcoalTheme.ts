import { alpha, createTheme } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Charcoal Theme
 *
 * Defines the core color palette, typography, and component overrides
 * with a charcoal gray color scheme for a clean light theme.
 */
export const auroraCharcoal = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#A5C4CF", // Light blue-gray from palette
      light: "#DCE9EE", // Lightest tone
      dark: "#839DA6", // Mid-tone blue-gray
      contrastText: "#0F1416", // Darkest for contrast
    },
    secondary: {
      main: "#63777E", // Darker blue-gray
      light: "#A5C4CF",
      dark: "#455358",
    },
    background: {
      default: "#0F1416", // Darkest from palette
      paper: "#293236", // Dark gray
    },
    text: {
      primary: "#DCE9EE", // Lightest for primary text
      secondary: "#A5C4CF", // Light blue-gray for secondary
    },
    error: {
      main: "#ef4444", // Bright red for visibility
    },
    success: {
      main: "#22c55e", // Bright green for visibility
    },
    divider: "rgba(165, 196, 207, 0.12)",
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
            "linear-gradient(135deg, #A5C4CF 0%, #839DA6 50%, #63777E 100%)",
          color: "#0F1416",
          boxShadow: "0 2px 8px rgba(165, 196, 207, 0.2)",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(165, 196, 207, 0.3)",
            background:
              "linear-gradient(135deg, #DCE9EE 0%, #A5C4CF 50%, #839DA6 100%)",
          },
          "&.Mui-disabled": {
            color: "#63777E",
            background: "#293236",
          },
        },
        outlinedPrimary: {
          borderColor: "#A5C4CF",
          color: "#A5C4CF",
          "&:hover": {
            backgroundColor: alpha("#A5C4CF", 0.08),
            borderColor: "#DCE9EE",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#A5C4CF", 0.06),
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: alpha("#A5C4CF", 0.12),
          "&:hover": {
            backgroundColor: alpha("#A5C4CF", 0.12),
            color: "#DCE9EE",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#293236",
          border: "1px solid rgba(165, 196, 207, 0.12)",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
        },
        elevation8: {
          backgroundColor: "#293236",
          border: "1px solid rgba(165, 196, 207, 0.15)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            borderColor: alpha("#A5C4CF", 0.4),
            boxShadow: "0 8px 24px rgba(165, 196, 207, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1F2528",
            "& fieldset": {
              borderColor: alpha("#63777E", 0.3),
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: alpha("#839DA6", 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#A5C4CF",
              boxShadow: "0 0 0 3px rgba(165, 196, 207, 0.15)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#839DA6",
            "&.Mui-focused": {
              color: "#A5C4CF",
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
          backgroundColor: alpha("#A5C4CF", 0.15),
          color: "#DCE9EE",
          border: `1px solid ${alpha("#A5C4CF", 0.25)}`,
        },
        outlined: {
          borderColor: "#A5C4CF",
          color: "#A5C4CF",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#A5C4CF",
            "& + .MuiSwitch-track": {
              backgroundColor: "#839DA6",
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: "#455358",
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
          border: "1px solid rgba(165, 196, 207, 0.12)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: alpha("#A5C4CF", 0.05),
            borderColor: alpha("#A5C4CF", 0.25),
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
          background: "linear-gradient(135deg, #839DA6 0%, #A5C4CF 100%)",
          color: "#0F1416",
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
          borderBottom: "1px solid rgba(165, 196, 207, 0.12)",
        },
        head: {
          fontWeight: 600,
          color: "#A5C4CF",
          backgroundColor: "#1F2528",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#293236",
          backgroundImage: "none",
          border: "1px solid rgba(165, 196, 207, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#839DA6",
          "&.Mui-selected": {
            backgroundColor: alpha("#A5C4CF", 0.15),
            color: "#DCE9EE",
            border: `1px solid ${alpha("#A5C4CF", 0.3)}`,
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
          background: "linear-gradient(135deg, #A5C4CF 0%, #839DA6 100%)",
          color: "#0F1416",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(136deg, rgba(41, 50, 54, 1) 0%, rgba(31, 37, 40, 1) 100%)",
          color: "#DCE9EE",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          "&:hover": {
            backgroundColor: alpha("#A5C4CF", 0.08),
          },
        },
      },
    },
  },
});

const xauroraCharcoal = createTheme({
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
      styleOverrides: {},
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
