import {
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
  AuroraWorkIcon,
  AuroraPeopleIcon,
  AuroraCalendarMonthIcon,
  AuroraPaper,
} from "@acentra/aurora-design-system";
import { MyActiveJobsWidget } from "@/components/dashboard/widgets/MyActiveJobsWidget";
import { CandidatesToReviewWidget } from "@/components/dashboard/widgets/CandidatesToReviewWidget";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";
import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { candidatesService } from "@/services/candidatesService";

export function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    newCandidates: 0,
    interviewsToday: 0
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Recruiter";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const jobs = await jobsService.getJobs({ assigneeId: user.userId, status: "OPEN" });
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
        interviewsToday
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  return (
    <AuroraBox sx={{
      minHeight: "100vh",
      bgcolor: "background.default",
      pb: 8
    }}>
      {/* Premium Header Banner */}
      <AuroraBox sx={{
        bgcolor: "#0f172a", // Deep slate for premium look
        color: "white",
        pt: 8,
        pb: 14,
        px: { xs: 3, md: 6 },
        background: "radial-gradient(circle at top right, #1e293b, #0f172a)",
        position: "relative",
        overflow: "hidden",
        mb: -8 // Negative margin to overlap stats
      }}>
        {/* Decorative elements */}
        <AuroraBox sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          zIndex: 0
        }} />

        <AuroraBox sx={{ maxWidth: 1600, mx: "auto", position: "relative", zIndex: 1 }}>
          <AuroraBox sx={{ mb: 1 }}>
            <AuroraTypography variant="overline" sx={{ letterSpacing: 3, fontWeight: 700, color: "primary.light" }}>
              RECRUITER WORKSPACE
            </AuroraTypography>
          </AuroraBox>
          <AuroraTypography variant="h3" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: -1 }}>
            Welcome back, {userName}
          </AuroraTypography>
          <AuroraTypography variant="h6" sx={{ color: "slate.400", fontWeight: 400, maxWidth: 600, opacity: 0.8 }}>
            Your recruitment pipeline is looking healthy. You have {stats.newCandidates} candidates waiting for review today.
          </AuroraTypography>
        </AuroraBox>
      </AuroraBox>

      {/* Main Content Area */}
      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Active Assignments"
              value={stats.activeJobs}
              icon={<AuroraWorkIcon sx={{ fontSize: 28 }} />}
              trend="+2 this week"
              color="#3b82f6"
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Pending Review"
              value={stats.newCandidates}
              icon={<AuroraPeopleIcon sx={{ fontSize: 28 }} />}
              trend="Priority"
              color="#8b5cf6"
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Interviews Today"
              value={stats.interviewsToday}
              icon={<AuroraCalendarMonthIcon sx={{ fontSize: 28 }} />}
              trend="Scheduled"
              color="#10b981"
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
                  <AuroraTypography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    Candidates to Review
                  </AuroraTypography>
                </AuroraBox>
                <CandidatesToReviewWidget />
              </AuroraBox>

              {/* Jobs Section */}
              <AuroraBox>
                <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <AuroraTypography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
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
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
                  Quick Launch
                </AuroraTypography>
                <QuickActionsWidget />
              </AuroraBox>

              {/* Activity Feed */}
              <AuroraBox>
                <AuroraTypography variant="overline" sx={{ fontWeight: 800, color: "text.secondary", mb: 2, display: "block" }}>
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

function StatCard({ label, value, icon, trend, color }: { label: string, value: number, icon: React.ReactNode, trend: string, color: string }) {
  return (
    <AuroraPaper sx={{
      p: 3,
      borderRadius: 4,
      bgcolor: "background.paper",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }
    }}>
      <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <AuroraBox sx={{
          width: 48,
          height: 48,
          borderRadius: 2.5,
          bgcolor: `${color}10`,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </AuroraBox>
        <AuroraBox sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 10,
          bgcolor: "slate.50",
          border: "1px solid",
          borderColor: "slate.100"
        }}>
          <AuroraTypography variant="caption" sx={{ fontWeight: 700, color: "slate.600" }}>
            {trend}
          </AuroraTypography>
        </AuroraBox>
      </AuroraBox>
      <AuroraBox>
        <AuroraTypography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
          {value}
        </AuroraTypography>
        <AuroraTypography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
          {label}
        </AuroraTypography>
      </AuroraBox>
    </AuroraPaper>
  );
}
