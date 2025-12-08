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
    mode: "dark",
    primary: {
      main: "#EFAB10", // Vibrant golden yellow
      light: "#FFD9AE", // Lightest peach
      dark: "#BE870A", // Deep golden
      contrastText: "#1A0F00", // Darkest for contrast
    },
    secondary: {
      main: "#8F6505", // Mid-tone amber
      light: "#EFAB10",
      dark: "#634502",
    },
    background: {
      default: "#1A0F00", // Darkest from palette
      paper: "#3B2701", // Dark brown
    },
    text: {
      primary: "#FFD9AE", // Lightest for primary text
      secondary: "#EFAB10", // Golden yellow for secondary
    },
    error: {
      main: "#ef4444", // Bright red for visibility
    },
    success: {
      main: "#22c55e", // Bright green for visibility
    },
    divider: "rgba(239, 171, 16, 0.12)",
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
            "linear-gradient(135deg, #EFAB10 0%, #BE870A 50%, #8F6505 100%)",
          color: "#1A0F00",
          boxShadow: "0 2px 8px rgba(239, 171, 16, 0.25)",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(239, 171, 16, 0.4)",
            background:
              "linear-gradient(135deg, #FFD9AE 0%, #EFAB10 50%, #BE870A 100%)",
          },
          "&.Mui-disabled": {
            color: "#8F6505",
            background: "#3B2701",
          },
        },
        outlinedPrimary: {
          borderColor: "#EFAB10",
          color: "#EFAB10",
          "&:hover": {
            backgroundColor: alpha("#EFAB10", 0.08),
            borderColor: "#FFD9AE",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#EFAB10", 0.06),
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: alpha("#EFAB10", 0.12),
          "&:hover": {
            backgroundColor: alpha("#EFAB10", 0.12),
            color: "#FFD9AE",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#3B2701",
          border: "1px solid rgba(239, 171, 16, 0.12)",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        },
        elevation8: {
          backgroundColor: "#3B2701",
          border: "1px solid rgba(239, 171, 16, 0.15)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            borderColor: alpha("#EFAB10", 0.4),
            boxShadow: "0 8px 24px rgba(239, 171, 16, 0.25)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2A1A00",
            "& fieldset": {
              borderColor: alpha("#8F6505", 0.3),
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: alpha("#BE870A", 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#EFAB10",
              boxShadow: "0 0 0 3px rgba(239, 171, 16, 0.15)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#BE870A",
            "&.Mui-focused": {
              color: "#EFAB10",
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
          backgroundColor: alpha("#EFAB10", 0.15),
          color: "#FFD9AE",
          border: `1px solid ${alpha("#EFAB10", 0.25)}`,
        },
        outlined: {
          borderColor: "#EFAB10",
          color: "#EFAB10",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#EFAB10",
            "& + .MuiSwitch-track": {
              backgroundColor: "#BE870A",
              opacity: 1,
            },
          },
        },
        track: {
          backgroundColor: "#634502",
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
          border: "1px solid rgba(239, 171, 16, 0.12)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: alpha("#EFAB10", 0.05),
            borderColor: alpha("#EFAB10", 0.25),
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
          background: "linear-gradient(135deg, #BE870A 0%, #EFAB10 100%)",
          color: "#1A0F00",
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
          borderBottom: "1px solid rgba(239, 171, 16, 0.12)",
        },
        head: {
          fontWeight: 600,
          color: "#EFAB10",
          backgroundColor: "#2A1A00",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#3B2701",
          backgroundImage: "none",
          border: "1px solid rgba(239, 171, 16, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#BE870A",
          "&.Mui-selected": {
            backgroundColor: alpha("#EFAB10", 0.15),
            color: "#FFD9AE",
            border: `1px solid ${alpha("#EFAB10", 0.3)}`,
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
          background: "linear-gradient(135deg, #EFAB10 0%, #BE870A 100%)",
          color: "#1A0F00",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(136deg, rgba(59, 39, 1, 1) 0%, rgba(42, 26, 0, 1) 100%)",
          color: "#FFD9AE",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          "&:hover": {
            backgroundColor: alpha("#EFAB10", 0.08),
          },
        },
      },
    },
  },
});
