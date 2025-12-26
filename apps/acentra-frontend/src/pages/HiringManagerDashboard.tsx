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

export function HiringManagerDashboard() {
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
      // Hiring manager sees their own jobs (created by them or assigned)
      const jobs = await jobsService.getJobs({ assigneeId: user.userId, status: "open" });
      const candidates = await candidatesService.getCandidates();

      // Filter candidates for jobs assigned to this manager or created by them
      // For now, simple filter
      const myJobIds = jobs.map(j => j.id);
      const myCandidates = candidates.data.filter((c: any) => myJobIds.includes(c.job?.id));

      const newCandidates = myCandidates.filter((c: any) =>
        ["NEW", "QUALIFIED", "APPLIED", "SCREENING"].includes(c.status?.toUpperCase())
      ).length;

      const today = new Date().toISOString().split('T')[0];
      const interviewsToday = myCandidates.filter((c: any) =>
        c.interview_date && c.interview_date.startsWith(today)
      ).length;

      setStats({
        activeJobs: jobs.length,
        newCandidates,
        interviewsToday,
        loading: false
      });
    } catch (err) {
      console.error("Failed to load HM dashboard stats", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title={`Welcome back, ${userName}`}
        subtitle={`You have ${stats.newCandidates} candidates to review across your ${stats.activeJobs} active job openings.`}
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="My Open Roles"
              value={stats.activeJobs}
              trend="Hiring"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="New Applicants"
              value={stats.newCandidates}
              trend="Requires Action"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="My Interviews"
              value={stats.interviewsToday}
              trend="Today"
              loading={stats.loading}
            />
          </AuroraGrid>
        </AuroraGrid>

        <AuroraGrid container spacing={5}>
          <AuroraGrid size={{ xs: 12, lg: 8 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <AuroraBox>
                <AuroraTypography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  Applicants for My Roles
                </AuroraTypography>
                <CandidatesToReviewWidget filters={{ status: 'NEW' }} />
              </AuroraBox>

              <AuroraBox>
                <AuroraTypography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  My Active Pipelines
                </AuroraTypography>
                <MyActiveJobsWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>

          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  Quick Launch
                </AuroraTypography>
                <QuickActionsWidget />
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  Team Activity
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
