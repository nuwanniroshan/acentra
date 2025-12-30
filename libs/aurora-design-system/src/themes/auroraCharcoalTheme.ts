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
    mode: "light",
    primary: {
      main: "#232F3E", // AWS dark navy
      light: "#37475A",
      dark: "#161E2E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF9900", // AWS orange accent
      light: "#FFAD33",
      dark: "#CC7A00",
      contrastText: "#000000",
    },
    background: {
      default: "#F2F3F3", // Light gray background
      paper: "#FFFFFF", // White paper
    },
    text: {
      primary: "#000716", // Very dark for primary text
      secondary: "#414D5C", // Gray for secondary text
    },
    error: {
      main: "#D13212", // AWS red
      light: "#E84C3D",
      dark: "#A62A0F",
    },
    success: {
      main: "#1D8102", // AWS green
      light: "#2EA043",
      dark: "#146701",
    },
    info: {
      main: "#0073BB", // AWS blue
      light: "#338FCC",
      dark: "#005C96",
    },
    warning: {
      main: "#FF9900",
      light: "#FFAD33",
      dark: "#CC7A00",
    },
    divider: "rgba(0, 7, 22, 0.12)",
  },
  shape: {
    borderRadius: "2px",
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "0.00735em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      letterSpacing: "0.0075em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02857em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          padding: "8px 16px",
          fontSize: "14px",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
          border: "1px solid #232F3E",
          "&:hover": {
            backgroundColor: "#37475A",
            borderColor: "#37475A",
          },
          "&.Mui-disabled": {
            backgroundColor: "#EAEDED",
            color: "#AAB7B8",
            border: "1px solid #D5DBDB",
          },
        },
        containedSecondary: {
          backgroundColor: "#FF9900",
          color: "#000000",
          border: "1px solid #FF9900",
          "&:hover": {
            backgroundColor: "#FFAD33",
            borderColor: "#FFAD33",
          },
        },
        outlined: {
          borderColor: "#D5DBDB",
          backgroundColor: "#FFFFFF",
          color: "#000716",
          "&:hover": {
            backgroundColor: "#FAFAFA",
            borderColor: "#AAB7B8",
          },
        },
        outlinedPrimary: {
          borderColor: "#232F3E",
          color: "#232F3E",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
            borderColor: "#37475A",
          },
        },
        text: {
          color: "#232F3E",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#414D5C",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
            color: "#232F3E",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAEDED",
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        elevation8: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #D5DBDB",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          border: "1px solid #EAEDED",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: "#D5DBDB",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
            "& fieldset": {
              borderColor: "#D5DBDB",
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: "#AAB7B8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0073BB",
              borderWidth: "2px",
            },
            "&.Mui-error fieldset": {
              borderColor: "#D13212",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#414D5C",
            fontSize: "14px",
            fontWeight: 600,
            "&.Mui-focused": {
              color: "#0073BB",
            },
            "&.Mui-error": {
              color: "#D13212",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "#000716",
            fontSize: "14px",
            "&::placeholder": {
              color: "#879596",
              opacity: 1,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D5DBDB",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#AAB7B8",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0073BB",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "2px",
          height: 24,
          fontSize: "0.75rem",
          transition: "all 0.15s ease-in-out",
        },
        filled: {
          backgroundColor: "#EAEDED",
          color: "#000716",
          border: "1px solid #D5DBDB",
          "&:hover": {
            backgroundColor: "#D5DBDB",
          },
        },
        outlined: {
          borderColor: "#D5DBDB",
          color: "#414D5C",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
            borderColor: "#AAB7B8",
          },
        },
        colorPrimary: {
          backgroundColor: alpha("#232F3E", 0.08),
          color: "#232F3E",
          border: "1px solid #232F3E",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.12),
          },
        },
        colorSecondary: {
          backgroundColor: alpha("#FF9900", 0.1),
          color: "#FF9900",
          border: "1px solid #FF9900",
          "&:hover": {
            backgroundColor: alpha("#FF9900", 0.15),
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 1,
          "&.Mui-checked": {
            color: "#FFFFFF",
            transform: "translateX(16px)",
            "& + .MuiSwitch-track": {
              backgroundColor: "#1D8102",
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: "2px",
          backgroundColor: "#AAB7B8",
          opacity: 1,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid #EAEDED",
          borderRadius: "2px !important",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "8px 0",
            borderColor: "#D5DBDB",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.02),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          fontSize: "14px",
        },
        standardSuccess: {
          backgroundColor: alpha("#1D8102", 0.1),
          color: "#146701",
          border: "1px solid #1D8102",
        },
        standardError: {
          backgroundColor: alpha("#D13212", 0.1),
          color: "#A62A0F",
          border: "1px solid #D13212",
        },
        standardWarning: {
          backgroundColor: alpha("#FF9900", 0.1),
          color: "#CC7A00",
          border: "1px solid #FF9900",
        },
        standardInfo: {
          backgroundColor: alpha("#0073BB", 0.1),
          color: "#005C96",
          border: "1px solid #0073BB",
        },
        filledSuccess: {
          backgroundColor: "#1D8102",
          color: "#FFFFFF",
        },
        filledError: {
          backgroundColor: "#D13212",
          color: "#FFFFFF",
        },
        filledWarning: {
          backgroundColor: "#FF9900",
          color: "#000000",
        },
        filledInfo: {
          backgroundColor: "#0073BB",
          color: "#FFFFFF",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#FAFAFA",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #EAEDED",
          fontSize: "14px",
          padding: "12px 16px",
        },
        head: {
          fontWeight: 700,
          color: "#000716",
          backgroundColor: "#FAFAFA",
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        },
        body: {
          color: "#000716",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#FAFAFA",
          },
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          backgroundImage: "none",
          borderRadius: "2px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "20px",
          fontWeight: 600,
          color: "#000716",
          padding: "20px 24px 12px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "12px 24px",
          color: "#414D5C",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          gap: "8px",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            fontSize: "14px",
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#414D5C",
          border: "1px solid #D5DBDB",
          "&:hover": {
            backgroundColor: "#FAFAFA",
            borderColor: "#AAB7B8",
          },
          "&.Mui-selected": {
            backgroundColor: "#232F3E",
            color: "#FFFFFF",
            border: "1px solid #232F3E",
            "&:hover": {
              backgroundColor: "#37475A",
            },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: "11px",
          minWidth: "20px",
          height: "20px",
        },
        colorPrimary: {
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
        },
        colorSecondary: {
          backgroundColor: "#D13212",
          color: "#FFFFFF",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
          fontSize: "12px",
          padding: "8px 12px",
          borderRadius: "2px",
        },
        arrow: {
          color: "#232F3E",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAEDED",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          marginTop: "4px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          padding: "8px 16px",
          color: "#000716",
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
          },
          "&.Mui-selected": {
            backgroundColor: alpha("#232F3E", 0.08),
            "&:hover": {
              backgroundColor: alpha("#232F3E", 0.12),
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #EAEDED",
        },
        indicator: {
          backgroundColor: "#232F3E",
          height: "3px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          color: "#414D5C",
          padding: "12px 16px",
          "&:hover": {
            color: "#232F3E",
            backgroundColor: alpha("#232F3E", 0.04),
          },
          "&.Mui-selected": {
            color: "#232F3E",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#EAEDED",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#EAEDED",
          borderRadius: "2px",
        },
        barColorPrimary: {
          backgroundColor: "#232F3E",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: "#232F3E",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
          boxShadow: "none",
          border: "none 0px",
        },
        colorPrimary: {
          backgroundColor: "#232F3E",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EAEDED",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#232F3E", 0.04),
          },
          "&.Mui-selected": {
            backgroundColor: alpha("#232F3E", 0.08),
            "&:hover": {
              backgroundColor: alpha("#232F3E", 0.12),
            },
          },
        },
      },
    },
  },
});