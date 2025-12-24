import { AuroraBox, AuroraTypography } from "@acentra/aurora-design-system";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <AuroraBox sx={{
      bgcolor: "#0f172a", // Deep slate for premium look
      color: "white",
      pt: 8,
      pb: 14,
      px: { xs: 3, md: 6 },
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)",
      position: "relative",
      overflow: "hidden",
      mb: -8 // Negative margin to overlap content
    }}>
      {/* Decorative elements */}
      <AuroraBox sx={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        zIndex: 0
      }} />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", position: "relative", zIndex: 1 }}>
        <AuroraTypography variant="h3" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: -1 }}>
          {title}
        </AuroraTypography>
        <AuroraTypography variant="h6" sx={{ color: "slate.400", fontWeight: 400, maxWidth: 600, opacity: 0.8 }}>
          {subtitle}
        </AuroraTypography>
      </AuroraBox>
    </AuroraBox>
  );
}
