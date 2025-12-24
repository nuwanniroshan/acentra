import {
  AuroraBox,
  AuroraTypography,
  AuroraCard,
} from "@acentra/aurora-design-system";

export function RecentActivityWidget() {
  return (
    <AuroraCard
      sx={{
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
        bgcolor: "transparent",
        boxShadow: "none"
      }}
    >
      <AuroraBox sx={{ p: 4, textAlign: "center", py: 6 }}>
        <AuroraTypography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
          No recent activity
        </AuroraTypography>
        <AuroraTypography variant="body2" color="text.secondary">
          When you start moving candidates or posting jobs, your activity feed will appear here.
        </AuroraTypography>
      </AuroraBox>
    </AuroraCard>
  );
}
