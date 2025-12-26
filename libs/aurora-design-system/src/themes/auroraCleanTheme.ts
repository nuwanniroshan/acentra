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
      main: "#4F46E5", // Indigo-600
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EC4899", // Pink-500
      light: "#F472B6",
      dark: "#DB2777",
      contrastText: "#ffffff",
    },
    background: {
      default: "transparent", // Handled in CssBaseline
      paper: alpha("#FFFFFF", 0.6), // Glassy paper
    },
    text: {
      primary: "#111827", // Gray-900
      secondary: "#374151", // Gray-700
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#F59E0B",
    },
    info: {
      main: "#3B82F6",
    },
    success: {
      main: "#10B981",
    },
    divider: "rgba(255, 255, 255, 0.3)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", color: "#111827" },
    h2: { fontWeight: 700, fontSize: "2rem", color: "#111827" },
    h3: { fontWeight: 600, fontSize: "1.5rem", color: "#1F2937" },
    h4: { fontWeight: 600, fontSize: "1.25rem", color: "#1F2937" },
    h5: { fontWeight: 600, fontSize: "1.125rem", color: "#1F2937" },
    h6: { fontWeight: 600, fontSize: "1rem", color: "#374151" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #ffe4e6 100%)", // Aurora-like pastel gradient
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#FFFFFF", 0.7),
          backdropFilter: "blur(20px)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          color: "#1F2937",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "none",
          padding: "8px 20px",
          transition: "all 0.2s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
          boxShadow: "0px 4px 12px rgba(79, 70, 229, 0.3)",
          "&:hover": {
            boxShadow: "0px 6px 16px rgba(79, 70, 229, 0.4)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha("#FFFFFF", 0.6),
          backdropFilter: "blur(25px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
        },
        elevation1: { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)" },
        elevation2: { boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: alpha("#FFFFFF", 0.6),
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha("#FFFFFF", 0.8),
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.5)",
        },
        root: {
             // ensure backdrop is consistent
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        },
        head: {
          backgroundColor: alpha("#F3F4F6", 0.5),
          color: "#374151",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#FFFFFF", 0.5),
          backdropFilter: "blur(10px)",
           "&:hover": {
              backgroundColor: alpha("#FFFFFF", 0.7),
           }
        }
      }
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: "12px",
                "& fieldset": {
                    borderColor: "rgba(0,0,0,0.1)",
                },
            }
        }
    }
  },
});
