import { AuroraBox, AuroraTypography } from "@acentra/aurora-design-system";
import { useTheme } from "@mui/material/styles";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const theme = useTheme();

  return (
    <AuroraBox sx={{
      color: "text.primary",
      pt: 6,
      pb: 10,
      px: { xs: 3, md: 6 },
      borderBottom: `1px solid ${theme.palette.divider}`,
      position: "relative",
      overflow: "hidden",
      mb: -6 // Negative margin to overlap content
    }}>
      {/* Decorative elements - subtle for clean themes */}
      <AuroraBox sx={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(91, 141, 239, 0.03)'} 0%, transparent 70%)`,
        zIndex: 0
      }} />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <AuroraBox>
          <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: -0.5, color: "text.primary" }}>
            {title}
          </AuroraTypography>
          <AuroraTypography variant="h6" sx={{ color: "text.secondary", fontWeight: 400, maxWidth: 600 }}>
            {subtitle}
          </AuroraTypography>
        </AuroraBox>
        {action && (
          <AuroraBox sx={{ mb: 1 }}>
            {action}
          </AuroraBox>
        )}
      </AuroraBox>
    </AuroraBox>
  );
}
