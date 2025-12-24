import {
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
  AuroraWorkIcon,
  AuroraPeopleIcon,
} from "@acentra/aurora-design-system";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";

export function Dashboard() {
  const [stats, setStats] = useState({
    openJobs: 0,
    myReferrals: 0,
    loading: true
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "User";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const jobs = await jobsService.getJobs({ status: "open" });
      setStats({
        openJobs: jobs.length,
        myReferrals: 0, // Placeholder for actual referral count
        loading: false
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title={`Hello, ${userName}`}
        subtitle="Explore open opportunities and keep track of your team's activity."
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="Open Opportunities"
              value={stats.openJobs}
              icon={<AuroraWorkIcon sx={{ fontSize: 28 }} />}
              trend="Hiring Now"
              color="#3b82f6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="My Referrals"
              value={stats.myReferrals}
              icon={<AuroraPeopleIcon sx={{ fontSize: 28 }} />}
              trend="Coming Soon"
              color="#10b981"
              loading={stats.loading}
            />
          </AuroraGrid>
        </AuroraGrid>

        <AuroraGrid container spacing={5}>
          <AuroraGrid size={{ xs: 12, lg: 8 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <AuroraBox>
                <AuroraTypography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  Recent Activity
                </AuroraTypography>
                <RecentActivityWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>

          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  Quick Actions
                </AuroraTypography>
                <QuickActionsWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
