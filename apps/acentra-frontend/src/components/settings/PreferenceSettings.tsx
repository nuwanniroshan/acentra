import { useTheme } from "../../context/ThemeContext";
import { useSnackbar } from "../../context/SnackbarContext";
import { AuroraBox, AuroraTypography, AuroraGrid, AuroraSelect, AuroraMenuItem, AuroraFormControl, AuroraInputLabel } from '@acentra/aurora-design-system';

export function PreferenceSettings() {
  const { currentTheme, setTheme } = useTheme();
  const { showSnackbar } = useSnackbar();

  const handleThemeChange = (newTheme: "aurora" | "auroraDark" | "auroraLight") => {
    setTheme(newTheme);
    showSnackbar("Theme updated successfully", "success");
  };

  return (
    <AuroraBox sx={{ maxWidth: 600 }}>
      <AuroraTypography variant="h6" gutterBottom>
        Appearance
      </AuroraTypography>
      
      <AuroraGrid container spacing={3}>
        <AuroraGrid size={{ xs: 12 }}>
          <AuroraFormControl fullWidth>
            <AuroraInputLabel>Theme</AuroraInputLabel>
            <AuroraSelect
              value={currentTheme}
              label="Theme"
              onChange={(e) => handleThemeChange(e.target.value as "aurora" | "auroraDark" | "auroraLight")}
            >
              <AuroraMenuItem value="aurora">Aurora (Light Blue)</AuroraMenuItem>
              <AuroraMenuItem value="auroraLight">Aurora Light (Teal)</AuroraMenuItem>
              <AuroraMenuItem value="auroraDark">Aurora Dark (Teal)</AuroraMenuItem>
            </AuroraSelect>
          </AuroraFormControl>
        </AuroraGrid>
      </AuroraGrid>

      <AuroraBox sx={{ mt: 3 }}>
        <AuroraTypography variant="body2" color="text.secondary">
          Your theme preference is saved automatically and will persist across sessions.
        </AuroraTypography>
      </AuroraBox>
    </AuroraBox>
  );
}