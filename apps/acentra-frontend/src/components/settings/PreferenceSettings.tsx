import { useTheme } from "@/context/ThemeContext";
import { useSnackbar } from "@/context/SnackbarContext";
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
          <AuroraBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.background.paper,
              border: "1px solid",
              borderColor: "divider",
              overflowX: "auto",
            }}
          >
            <AuroraTypography variant="body1" fontWeight={500} sx={{ mr: 2 }}>
              Colour
            </AuroraTypography>
            {THEME_CONFIG.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <AuroraBox
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <AuroraBox
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: theme.color,
                      border: isSelected ? "3px solid" : "2px solid transparent",
                      borderColor: isSelected ? "primary.main" : "transparent",
                      boxShadow: isSelected ? "0 0 0 2px white" : "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  {isSelected && (
                    <AuroraTypography
                      variant="caption"
                      sx={{
                        mt: 1,
                        position: "absolute",
                        bottom: -20,
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                        color: "text.primary"
                      }}
                    >
                      {theme.label}
                    </AuroraTypography>
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
