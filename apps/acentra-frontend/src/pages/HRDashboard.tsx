import {
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
  AuroraWorkIcon,
  AuroraPeopleIcon,
  AuroraCalendarMonthIcon,
} from "@acentra/aurora-design-system";
import { MyActiveJobsWidget } from "@/components/dashboard/widgets/MyActiveJobsWidget";
import { CandidatesToReviewWidget } from "@/components/dashboard/widgets/CandidatesToReviewWidget";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { candidatesService } from "@/services/candidatesService";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";

export function HRDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    pendingApprovals: 0,
    loading: true
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      const [jobs, candidates] = await Promise.all([
        jobsService.getJobs(),
        candidatesService.getCandidates()
      ]);

      const pendingJobs = jobs.filter(j => j.status?.toLowerCase() === "pending_approval" || j.status?.toLowerCase() === "pending");

      setStats({
        activeJobs: jobs.filter(j => j.status?.toLowerCase() === "open").length,
        totalCandidates: candidates.total || candidates.data.length,
        pendingApprovals: pendingJobs.length,
        loading: false
      });
    } catch (err) {
      console.error("Failed to load HR dashboard stats", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title={`Welcome back, ${userName}`}
        subtitle={`There are ${stats.activeJobs} active openings and ${stats.pendingApprovals} requisitions awaiting approval.`}
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Company Openings"
              value={stats.activeJobs}
              icon={<AuroraWorkIcon sx={{ fontSize: 28 }} />}
              trend="Global"
              color="#3b82f6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Awaiting Approval"
              value={stats.pendingApprovals}
              icon={<AuroraCalendarMonthIcon sx={{ fontSize: 28 }} />}
              trend="Urgent"
              color="#f59e0b"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Candidates"
              value={stats.totalCandidates}
              icon={<AuroraPeopleIcon sx={{ fontSize: 28 }} />}
              trend="+5% this week"
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
                  Global Talent Pipeline
                </AuroraTypography>
                <CandidatesToReviewWidget />
              </AuroraBox>

              <AuroraBox>
                <AuroraTypography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  Active Job Requisitions
                </AuroraTypography>
                <MyActiveJobsWidget filters={{ status: 'open' }} />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>

          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  HR Actions
                </AuroraTypography>
                <QuickActionsWidget />
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  System Activity
                </AuroraTypography>
                <RecentActivityWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
