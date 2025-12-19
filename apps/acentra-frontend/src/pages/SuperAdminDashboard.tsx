import { AuroraBox, AuroraTypography } from "@acentra/aurora-design-system";

export function SuperAdminDashboard() {
  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto" }}>
      <AuroraTypography variant="h4" sx={{ fontWeight: 700 }}>
        Super Admin Dashboard
      </AuroraTypography>
      {/* Super Admin dashboard content will be added here */}
    </AuroraBox>
  );
}
