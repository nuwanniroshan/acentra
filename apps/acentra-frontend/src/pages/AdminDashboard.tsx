import { AuroraBox, AuroraTypography } from '@acentra/aurora-design-system';

export function AdminDashboard() {
  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto" }}>
      <AuroraTypography variant="h4" sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </AuroraTypography>
      {/* Admin dashboard content will be added here */}
    </AuroraBox>
  );
}