import {
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
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

export function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    newCandidates: 0,
    interviewsToday: 0,
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
      const jobs = await jobsService.getJobs({ assigneeId: user.userId, status: "open" });
      const candidates = await candidatesService.getCandidates();
      const newCandidates = candidates.data.filter((c: any) =>
        ["NEW", "QUALIFIED", "APPLIED", "SCREENING"].includes(c.status?.toUpperCase())
      ).length;

      const today = new Date().toISOString().split('T')[0];
      const interviewsToday = candidates.data.filter((c: any) =>
        c.interview_date && c.interview_date.startsWith(today)
      ).length;

      setStats({
        activeJobs: jobs.length,
        newCandidates,
        interviewsToday,
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
        title={`Welcome back, ${userName}`}
        subtitle={`Your recruitment pipeline is looking healthy. You have ${stats.newCandidates} candidates waiting for review today.`}
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Active Assignments"
              value={stats.activeJobs}
              trend="+2 this week"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Pending Review"
              value={stats.newCandidates}
              trend="Priority"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Interviews Today"
              value={stats.interviewsToday}
              trend="Scheduled"
              loading={stats.loading}
            />
          </AuroraGrid>
        </AuroraGrid>

        {/* Dashboard Sections */}
        <AuroraGrid container spacing={5}>
          {/* Main Column */}
          <AuroraGrid size={{ xs: 12, lg: 8 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Candidates Section */}
              <AuroraBox>
                <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <AuroraTypography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                    Candidates to Review
                  </AuroraTypography>
                </AuroraBox>
                <CandidatesToReviewWidget />
              </AuroraBox>

              {/* Jobs Section */}
              <AuroraBox>
                <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <AuroraTypography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                    Your Active Jobs
                  </AuroraTypography>
                </AuroraBox>
                <MyActiveJobsWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>

          {/* Sidebar Column */}
          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {/* Quick Actions */}
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 700, color: "text.secondary", mb: 2, display: "block" }}>
                  Quick Launch
                </AuroraTypography>
                <QuickActionsWidget />
              </AuroraBox>

              {/* Activity Feed */}
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 700, color: "text.secondary", mb: 2, display: "block" }}>
                  Portfolio Activity
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
