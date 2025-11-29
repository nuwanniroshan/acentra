
import { AuroraBox, AuroraTypography, AuroraGrid } from '@acentra/aurora-design-system';
import { TotalJobsWidget } from '@/components/dashboard/widgets/TotalJobsWidget';
import { TotalCandidatesWidget } from '@/components/dashboard/widgets/TotalCandidatesWidget';
import { ActiveJobsWidget } from '@/components/dashboard/widgets/ActiveJobsWidget';
import { NewCandidatesWidget } from '@/components/dashboard/widgets/NewCandidatesWidget';
import { QuickActionsWidget } from '@/components/dashboard/widgets/QuickActionsWidget';
import { RecentActivityWidget } from '@/components/dashboard/widgets/RecentActivityWidget';

export function Dashboard() {

  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Header */}
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraTypography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome back!
        </AuroraTypography>
        <AuroraTypography variant="body1" color="text.secondary">
          Here's an overview of your recruitment activities
        </AuroraTypography>
      </AuroraBox>

      {/* Stats Cards */}
      <AuroraGrid container spacing={3} sx={{ mb: 4 }}>
        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <TotalJobsWidget />
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <TotalCandidatesWidget />
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <ActiveJobsWidget />
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <NewCandidatesWidget />
        </AuroraGrid>
      </AuroraGrid>

      {/* Quick Actions */}
      <AuroraBox sx={{ mb: 4 }}>
        <QuickActionsWidget />
      </AuroraBox>

      {/* Recent Activity */}
      <AuroraBox>
        <RecentActivityWidget />
      </AuroraBox>
    </AuroraBox>
  );
}
