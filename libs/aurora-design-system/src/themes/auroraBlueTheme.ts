import { createTheme, alpha } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

/**
 * Light Blue Design System Theme
 *
 * Defines the core color palette, typography, and component overrides
 * with a #2563EB (blue-600) accent color for a clean, modern light theme.
 * 
 * Refined based on UX Feedback to improve contrast, hierarchy, and depth.
 */
export const auroraBlue = createTheme({
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)", // elevation 1 (Cards)
    "0px 4px 6px -1px rgba(0, 0, 0, 0.06), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)",
    "0px 6px 8px -2px rgba(0, 0, 0, 0.07), 0px 3px 6px -2px rgba(0, 0, 0, 0.04)",
    "0px 8px 10px -3px rgba(0, 0, 0, 0.08), 0px 4px 8px -3px rgba(0, 0, 0, 0.05)",
    "0px 10px 12px -4px rgba(0, 0, 0, 0.1), 0px 5px 10px -4px rgba(0, 0, 0, 0.06)", // elevation 5
    "0px 12px 14px -5px rgba(0, 0, 0, 0.1), 0px 6px 12px -5px rgba(0, 0, 0, 0.07)",
    "0px 14px 16px -6px rgba(0, 0, 0, 0.1), 0px 7px 14px -6px rgba(0, 0, 0, 0.08)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)", // elevation 8 (Drawers/Menus)
    "0px 12px 18px -4px rgba(0, 0, 0, 0.1), 0px 5px 8px -2px rgba(0, 0, 0, 0.06)",
    "0px 14px 21px -5px rgba(0, 0, 0, 0.1), 0px 6px 10px -3px rgba(0, 0, 0, 0.07)",
    "0px 16px 24px -6px rgba(0, 0, 0, 0.1), 0px 7px 12px -4px rgba(0, 0, 0, 0.08)",
    "0px 18px 27px -7px rgba(0, 0, 0, 0.1), 0px 8px 14px -5px rgba(0, 0, 0, 0.09)",
    "0px 20px 30px -8px rgba(0, 0, 0, 0.1), 0px 9px 16px -6px rgba(0, 0, 0, 0.1)",
    "0px 22px 33px -9px rgba(0, 0, 0, 0.1), 0px 10px 18px -7px rgba(0, 0, 0, 0.11)",
    "0px 24px 36px -10px rgba(0, 0, 0, 0.1), 0px 11px 20px -8px rgba(0, 0, 0, 0.12)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)", // elevation 16 (Modals)
    "0px 22px 28px -6px rgba(0, 0, 0, 0.1), 0px 11px 12px -6px rgba(0, 0, 0, 0.05)",
    "0px 24px 31px -7px rgba(0, 0, 0, 0.1), 0px 12px 14px -7px rgba(0, 0, 0, 0.06)",
    "0px 26px 34px -8px rgba(0, 0, 0, 0.1), 0px 13px 16px -8px rgba(0, 0, 0, 0.07)",
    "0px 28px 37px -9px rgba(0, 0, 0, 0.1), 0px 14px 18px -9px rgba(0, 0, 0, 0.08)",
    "0px 30px 40px -10px rgba(0, 0, 0, 0.1), 0px 15px 20px -10px rgba(0, 0, 0, 0.09)",
    "0px 32px 43px -11px rgba(0, 0, 0, 0.1), 0px 16px 22px -11px rgba(0, 0, 0, 0.1)",
    "0px 34px 46px -12px rgba(0, 0, 0, 0.1), 0px 17px 24px -12px rgba(0, 0, 0, 0.11)",
    "0px 36px 49px -13px rgba(0, 0, 0, 0.1), 0px 18px 26px -13px rgba(0, 0, 0, 0.12)",
  ] as any,
  palette: {
    primary: {
      main: "#3385F0", // base color
      light: "#5CA3F5", // lighter variant
      dark: "#2667C1", // darker variant
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#475569", // slate-600 - Updated for better text contrast/hierarchy
      light: "#64748b", // slate-500
      dark: "#334155", // slate-700
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#475569", // slate-600 - Darker for better contrast (WCAG)
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
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    divider: "#e2e8f0",
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a3d6a",
          color: "#f0f5fdff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)", // Enhanced shadow
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
          border: "1px solid transparent",
          boxShadow: "0px 4px 6px rgba(37, 99, 235, 0.2)",
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(37, 99, 235, 0.3)",
            transform: "translateY(-1px)",
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
        containedError: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          boxShadow: "0px 4px 6px rgba(220, 38, 38, 0.15)",
          color: "#fff",
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(220, 38, 38, 0.25)",
            transform: "translateY(-1px)",
          },
        },
        textSecondary: {
          color: "#475569", // Matches new secondary color
          "&:hover": {
            backgroundColor: alpha("#475569", 0.05),
            color: "#1e293b",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          transition: "all 0.2s ease",
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
          // Removed redundant border for better shadow visibility
        },
        elevation1: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
        },
        elevation8: {
          // For Menus/Popovers
          backgroundColor: alpha("#ffffff", 0.98),
          backdropFilter: "blur(12px)",
           border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0px 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 8px 16px -4px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)", // Increased base shadow
          border: "1px solid rgba(148, 163, 184, 0.1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 14px 24px -5px rgba(0, 0, 0, 0.12), 0px 8px 12px -5px rgba(0, 0, 0, 0.06)",
            borderColor: alpha("#2563eb", 0.3),
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: "4px 0px 16px rgba(0, 0, 0, 0.06)", // More defined shadow
          borderRight: "1px solid rgba(148, 163, 184, 0.1)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "0px 20px 20px 0px", // Rounded right side for list items
          marginRight: "8px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            backgroundColor: alpha("#2563eb", 0.08),
            borderLeft: "3px solid #2563eb",
            color: "#1d4ed8",
            "&:hover": {
              backgroundColor: alpha("#2563eb", 0.12),
            },
            "& .MuiListItemIcon-root": {
              color: "#2563eb",
            },
          },
          "&:hover": {
            backgroundColor: alpha("#2563eb", 0.04),
            paddingLeft: "18px", // Slight push effect
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
          fontWeight: 600,
          borderRadius: '4px',
          height: 24,
          fontSize: '0.75rem',
          transition: 'all 0.2s ease',
        },
        filled: {
          backgroundColor: alpha("#2563eb", 0.08),
          color: "#2563eb",
          border: `1px solid ${alpha("#2563eb", 0.15)}`,
          '&:hover': {
            backgroundColor: alpha("#2563eb", 0.15),
          }
        },
        outlined: {
          borderColor: alpha("#2563eb", 0.3),
          color: "#2563eb",
          '&:hover': {
            backgroundColor: alpha("#2563eb", 0.04),
            borderColor: "#2563eb",
          }
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
          border: "1px solid rgba(148, 163, 184, 0.1)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
             margin: "0",
             borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
          }
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
          color: "#ffffff",
          boxShadow: "0px 4px 6px rgba(22, 163, 74, 0.2)",
        },
        filledError: {
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
          color: "#ffffff",
          boxShadow: "0px 4px 6px rgba(220, 38, 38, 0.2)",
        },
        filledInfo: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          color: "#ffffff",
          boxShadow: "0px 4px 6px rgba(37, 99, 235, 0.2)",
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
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          color: "#475569",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          borderRadius: "4px",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
          boxShadow: "0 0 0 2px #fff",
        },
        colorPrimary: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: alpha("#ffffff", 0.98),
          backdropFilter: "blur(12px)",
          color: "#0f172a",
          borderRadius: "4px",
          border: "1px solid rgba(37, 99, 235, 0.08)",
          boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          padding: "10px 16px",
          "&:hover": {
            backgroundColor: alpha("#2563eb", 0.04),
          },
        },
      },
    },
  },
});
