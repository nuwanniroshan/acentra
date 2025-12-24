import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Aurora Clean Design System Theme
 *
 * A flat, minimalist theme inspired by modern dashboard designs.
 * Features soft colors, minimal shadows, clean typography, and generous whitespace.
 * Perfect for professional, data-driven applications.
 */
export const auroraClean = createTheme({
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.04)", // elevation 1 - Very subtle
    "0px 1px 3px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.06)",
    "0px 2px 6px rgba(0, 0, 0, 0.07)",
    "0px 3px 8px rgba(0, 0, 0, 0.08)", // elevation 5
    "0px 3px 10px rgba(0, 0, 0, 0.09)",
    "0px 4px 12px rgba(0, 0, 0, 0.1)",
    "0px 6px 16px rgba(0, 0, 0, 0.1)", // elevation 8 - Menus
    "0px 8px 20px rgba(0, 0, 0, 0.11)",
    "0px 10px 24px rgba(0, 0, 0, 0.12)",
    "0px 12px 28px rgba(0, 0, 0, 0.13)",
    "0px 14px 32px rgba(0, 0, 0, 0.14)",
    "0px 16px 36px rgba(0, 0, 0, 0.15)",
    "0px 18px 40px rgba(0, 0, 0, 0.16)",
    "0px 20px 44px rgba(0, 0, 0, 0.17)",
    "0px 12px 24px rgba(0, 0, 0, 0.12)", // elevation 16 - Modals
    "0px 14px 28px rgba(0, 0, 0, 0.13)",
    "0px 16px 32px rgba(0, 0, 0, 0.14)",
    "0px 18px 36px rgba(0, 0, 0, 0.15)",
    "0px 20px 40px rgba(0, 0, 0, 0.16)",
    "0px 22px 44px rgba(0, 0, 0, 0.17)",
    "0px 24px 48px rgba(0, 0, 0, 0.18)",
    "0px 26px 52px rgba(0, 0, 0, 0.19)",
    "0px 28px 56px rgba(0, 0, 0, 0.2)",
  ] as any,
  palette: {
    primary: {
      main: "#5B8DEF", // Soft blue - similar to the dashboard
      light: "#7FA5F3",
      dark: "#4A7BD4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6B7280", // Gray-500 for secondary text
      light: "#9CA3AF",
      dark: "#4B5563",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F9FAFB", // Very light gray - almost white
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937", // Gray-800 - softer than pure black
      secondary: "#6B7280", // Gray-500
    },
    error: {
      main: "#EF4444", // Soft red
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B", // Amber
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6", // Blue
      light: "#60A5FA",
      dark: "#2563EB",
    },
    success: {
      main: "#10B981", // Emerald
      light: "#34D399",
      dark: "#059669",
    },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    divider: "#E5E7EB", // Gray-200
  },
  shape: {
    borderRadius: 8, // Moderate roundness
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      color: "#111827",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      color: "#111827",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: "#1F2937",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: "#1F2937",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
      color: "#1F2937",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
      color: "#374151",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#6B7280",
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 500,
      color: "#9CA3AF",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#374151",
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      color: "#6B7280",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#9CA3AF",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        containedPrimary: {
          backgroundColor: "#5B8DEF",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#4A7BD4",
            boxShadow: "0px 2px 4px rgba(91, 141, 239, 0.2)",
          },
          "&.Mui-disabled": {
            backgroundColor: "#E5E7EB",
            color: "#9CA3AF",
          },
        },
        containedSecondary: {
          backgroundColor: "#F3F4F6",
          color: "#374151",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#E5E7EB",
          },
        },
        outlinedPrimary: {
          borderColor: "#D1D5DB",
          color: "#5B8DEF",
          "&:hover": {
            backgroundColor: alpha("#5B8DEF", 0.04),
            borderColor: "#5B8DEF",
          },
        },
        textPrimary: {
          color: "#5B8DEF",
          "&:hover": {
            backgroundColor: alpha("#5B8DEF", 0.04),
          },
        },
        containedError: {
          backgroundColor: "#EF4444",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#DC2626",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px",
          color: "#6B7280",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#F3F4F6",
            color: "#374151",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
          border: "1px solid #F3F4F6",
        },
        elevation2: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          border: "1px solid #E5E7EB",
        },
        elevation8: {
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
          border: "1px solid #F3F4F6",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
            borderColor: "#E5E7EB",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          boxShadow: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "2px 8px",
          padding: "10px 12px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            backgroundColor: alpha("#5B8DEF", 0.08),
            color: "#4A7BD4",
            "&:hover": {
              backgroundColor: alpha("#5B8DEF", 0.12),
            },
            "& .MuiListItemIcon-root": {
              color: "#5B8DEF",
            },
          },
          "&:hover": {
            backgroundColor: "#F9FAFB",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#E5E7EB",
              transition: "border-color 0.2s",
            },
            "&:hover fieldset": {
              borderColor: "#D1D5DB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#5B8DEF",
              borderWidth: "1px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#6B7280",
            fontSize: "0.875rem",
            "&.Mui-focused": {
              color: "#5B8DEF",
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "0.875rem",
            padding: "10px 14px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "6px",
          height: 28,
          fontSize: "0.75rem",
          transition: "all 0.2s ease",
        },
        filled: {
          backgroundColor: "#F3F4F6",
          color: "#374151",
          border: "1px solid #E5E7EB",
          "&:hover": {
            backgroundColor: "#E5E7EB",
          },
        },
        outlined: {
          borderColor: "#D1D5DB",
          color: "#6B7280",
          "&:hover": {
            backgroundColor: "#F9FAFB",
          },
        },
        colorPrimary: {
          backgroundColor: alpha("#5B8DEF", 0.1),
          color: "#4A7BD4",
          border: `1px solid ${alpha("#5B8DEF", 0.2)}`,
        },
        colorSuccess: {
          backgroundColor: alpha("#10B981", 0.1),
          color: "#059669",
          border: `1px solid ${alpha("#10B981", 0.2)}`,
        },
        colorError: {
          backgroundColor: alpha("#EF4444", 0.1),
          color: "#DC2626",
          border: `1px solid ${alpha("#EF4444", 0.2)}`,
        },
        colorWarning: {
          backgroundColor: alpha("#F59E0B", 0.1),
          color: "#D97706",
          border: `1px solid ${alpha("#F59E0B", 0.2)}`,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 24,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          "&.Mui-checked": {
            transform: "translateX(18px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: "#5B8DEF",
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
        },
        track: {
          borderRadius: 12,
          backgroundColor: "#D1D5DB",
          opacity: 1,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "0",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "0.875rem",
        },
        filledSuccess: {
          backgroundColor: "#10B981",
          color: "#ffffff",
        },
        filledError: {
          backgroundColor: "#EF4444",
          color: "#ffffff",
        },
        filledInfo: {
          backgroundColor: "#5B8DEF",
          color: "#ffffff",
        },
        filledWarning: {
          backgroundColor: "#F59E0B",
          color: "#ffffff",
        },
        standardSuccess: {
          backgroundColor: alpha("#10B981", 0.1),
          color: "#059669",
          border: `1px solid ${alpha("#10B981", 0.2)}`,
        },
        standardError: {
          backgroundColor: alpha("#EF4444", 0.1),
          color: "#DC2626",
          border: `1px solid ${alpha("#EF4444", 0.2)}`,
        },
        standardInfo: {
          backgroundColor: alpha("#5B8DEF", 0.1),
          color: "#4A7BD4",
          border: `1px solid ${alpha("#5B8DEF", 0.2)}`,
        },
        standardWarning: {
          backgroundColor: alpha("#F59E0B", 0.1),
          color: "#D97706",
          border: `1px solid ${alpha("#F59E0B", 0.2)}`,
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
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F9FAFB",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F3F4F6",
          padding: "12px 16px",
          fontSize: "0.875rem",
        },
        head: {
          fontWeight: 600,
          color: "#6B7280",
          backgroundColor: "#F9FAFB",
          borderBottom: "1px solid #E5E7EB",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
        body: {
          color: "#374151",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F9FAFB",
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
          borderRadius: "12px",
          boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#111827",
          padding: "20px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "20px 24px",
          color: "#374151",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          borderTop: "1px solid #F3F4F6",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#6B7280",
          fontSize: "0.875rem",
          "&.Mui-selected": {
            backgroundColor: "#5B8DEF",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#4A7BD4",
            },
          },
          "&:hover": {
            backgroundColor: "#F3F4F6",
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: "0.625rem",
          minWidth: "18px",
          height: "18px",
          padding: "0 4px",
        },
        colorPrimary: {
          backgroundColor: "#5B8DEF",
        },
        colorError: {
          backgroundColor: "#EF4444",
        },
        colorSuccess: {
          backgroundColor: "#10B981",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
          marginTop: "4px",
        },
        list: {
          padding: "4px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          padding: "8px 12px",
          borderRadius: "6px",
          margin: "2px 0",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#F9FAFB",
          },
          "&.Mui-selected": {
            backgroundColor: alpha("#5B8DEF", 0.08),
            color: "#4A7BD4",
            "&:hover": {
              backgroundColor: alpha("#5B8DEF", 0.12),
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1F2937",
          fontSize: "0.75rem",
          padding: "6px 12px",
          borderRadius: "6px",
        },
        arrow: {
          color: "#1F2937",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          backgroundColor: "#E5E7EB",
          height: "6px",
        },
        bar: {
          borderRadius: "4px",
          backgroundColor: "#5B8DEF",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#5B8DEF",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5E7EB",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#E5E7EB",
          color: "#6B7280",
          fontWeight: 500,
        },
        colorDefault: {
          backgroundColor: alpha("#5B8DEF", 0.1),
          color: "#4A7BD4",
        },
      },
    },
  },
});
