import { AuroraBox, AuroraGrid } from "@acentra/aurora-design-system";
import { AdminQuickActionsWidget } from "@/components/dashboard/widgets/AdminQuickActionsWidget";
import { DepartmentOfficeOverviewWidget } from "@/components/dashboard/widgets/DepartmentOfficeOverviewWidget";
import { PipelineAnalyticsWidget } from "@/components/dashboard/widgets/PipelineAnalyticsWidget";
import { NotificationCenterWidget } from "@/components/dashboard/widgets/NotificationCenterWidget";
import { ComplianceMetricsWidget } from "@/components/dashboard/widgets/ComplianceMetricsWidget";

export function AdminDashboard() {
  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto", p: 3 }}>
      <AuroraGrid container spacing={3}>
        {/* Quick Actions - Full Width */}
        <AuroraGrid size={{ xs: 12 }}>
          <AdminQuickActionsWidget />
        </AuroraGrid>

        {/* Department & Office Overview - Full Width */}
        <AuroraGrid size={{ xs: 12 }}>
          <DepartmentOfficeOverviewWidget />
        </AuroraGrid>

        {/* Pipeline Analytics - Full Width */}
        <AuroraGrid size={{ xs: 12 }}>
          <PipelineAnalyticsWidget />
        </AuroraGrid>

        {/* Notification Center - Half Width */}
        <AuroraGrid size={{ xs: 12, lg: 6 }}>
          <NotificationCenterWidget />
        </AuroraGrid>

        {/* Compliance Metrics - Half Width */}
        <AuroraGrid size={{ xs: 12, lg: 6 }}>
          <ComplianceMetricsWidget />
        </AuroraGrid>
      </AuroraGrid>
    </AuroraBox>
  );
}
