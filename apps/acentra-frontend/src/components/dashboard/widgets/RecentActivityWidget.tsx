import {
  AuroraBox,
  AuroraTypography,
  AuroraCard,
  AuroraCardContent,
} from "@acentra/aurora-design-system";

export const widgetName = "recent-activity";

export function RecentActivityWidget() {
  return (
    <AuroraBox>
      <AuroraTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Recent Activity
      </AuroraTypography>
      <AuroraCard>
        <AuroraCardContent sx={{ p: 3, textAlign: "center", py: 6 }}>
          <AuroraTypography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Activity Feed Coming Soon
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            This section will show recent hiring activities, new applications,
            and important updates.
          </AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    </AuroraBox>
  );
}
