import { useTheme } from "@/context/ThemeContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { alpha } from "@mui/material/styles";
import {
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
} from "@acentra/aurora-design-system";

export function PreferenceSettings() {
  const { currentTheme, setTheme } = useTheme();
  const { showSnackbar } = useSnackbar();

  const THEME_CONFIG: {
    id:
    | "auroraBlue"
    | "auroraDarkTeal"
    | "auroraLightTeal"
    | "auroraCharcoal"
    | "auroraLightOrange"
    | "auroraGlass"
    | "auroraClean";
    label: string;
    color: string;
  }[] = [
      { id: "auroraGlass", label: "Crystal Prism", color: "linear-gradient(135deg, #a5f3fc 0%, #3b82f6 100%)" },
      { id: "auroraBlue", label: "Ocean Mist", color: "#1D4ED8" },
      { id: "auroraDarkTeal", label: "Midnight Forest", color: "#0F766E" },
      { id: "auroraLightTeal", label: "Aqua Glass", color: "#2DD4BF" },
      { id: "auroraCharcoal", label: "Urban Slate", color: "#334155" },
      { id: "auroraLightOrange", label: "Sunset Glow", color: "#F97316" },
      { id: "auroraClean", label: "Pure Essence", color: "#F1F5F9" },
    ];

  const handleThemeChange = async (newTheme: typeof THEME_CONFIG[number]["id"]) => {
    try {
      await setTheme(newTheme);
      showSnackbar("Theme updated successfully", "success");
    } catch {
      showSnackbar("Failed to update theme", "error");
    }
  };



  return (
    <AuroraBox sx={{ maxWidth: 800 }}>
      <AuroraGrid container spacing={3}>
        <AuroraGrid size={{ xs: 12 }}>
          <AuroraTypography variant="h6" gutterBottom>
            Theme
          </AuroraTypography>
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {THEME_CONFIG.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <AuroraBox
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? (theme) => alpha(theme.palette.primary.main, 0.04) : "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      borderColor: isSelected ? "primary.main" : "divider",
                      transform: "translateX(4px)"
                    }
                  }}
                >
                  <AuroraBox
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: theme.color,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      mr: 2,
                      border: "1px solid rgba(0,0,0,0.05)"
                    }}
                  />
                  <AuroraBox sx={{ flexGrow: 1 }}>
                    <AuroraTypography
                      variant="subtitle1"
                      sx={{
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "primary.main" : "text.primary"
                      }}
                    >
                      {theme.label}
                    </AuroraTypography>
                  </AuroraBox>

                  {isSelected && (
                    <AuroraBox
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </AuroraBox>
                  )}
                </AuroraBox>
              );
            })}
          </AuroraBox>
        </AuroraGrid>
      </AuroraGrid>

      <AuroraBox sx={{ mt: 4 }}>
        <AuroraTypography variant="body2" color="text.secondary">
          Your theme preference is saved automatically to your account and will
          persist across devices.
        </AuroraTypography>
      </AuroraBox>
    </AuroraBox>
  );
}
