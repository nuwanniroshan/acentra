import {
  AuroraBox,
  AuroraGrid,
  AuroraPeopleIcon,
  AuroraWorkIcon,
  AuroraBusinessIcon
} from "@acentra/aurora-design-system";
import { AdminQuickActionsWidget } from "@/components/dashboard/widgets/AdminQuickActionsWidget";
import { DepartmentOfficeOverviewWidget } from "@/components/dashboard/widgets/DepartmentOfficeOverviewWidget";
import { PipelineAnalyticsWidget } from "@/components/dashboard/widgets/PipelineAnalyticsWidget";
import { NotificationCenterWidget } from "@/components/dashboard/widgets/NotificationCenterWidget";
import { ComplianceMetricsWidget } from "@/components/dashboard/widgets/ComplianceMetricsWidget";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { usersService } from "@/services/usersService";
import { jobsService } from "@/services/jobsService";
import { candidatesService } from "@/services/candidatesService";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCandidates: 0,
    loading: true
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, jobs, candidates] = await Promise.all([
        usersService.getUsers(),
        jobsService.getJobs(),
        candidatesService.getCandidates()
      ]);

      setStats({
        totalUsers: users.length,
        totalJobs: jobs.length,
        totalCandidates: candidates.data.length,
        loading: false
      });
    } catch (err) {
      console.error("Failed to load admin stats", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title={`Welcome back, ${userName}`}
        subtitle="System overview and administrative controls at your fingertips."
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total System Users"
              value={stats.totalUsers}
              icon={<AuroraPeopleIcon sx={{ fontSize: 28 }} />}
              trend="Platform-wide"
              color="#3b82f6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Active Requisitions"
              value={stats.totalJobs}
              icon={<AuroraWorkIcon sx={{ fontSize: 28 }} />}
              trend="All Departments"
              color="#8b5cf6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Talent Pool"
              value={stats.totalCandidates}
              icon={<AuroraBusinessIcon sx={{ fontSize: 28 }} />}
              trend="+12% this month"
              color="#10b981"
              loading={stats.loading}
            />
          </AuroraGrid>
        </AuroraGrid>

        <AuroraGrid container spacing={5}>
          {/* Left Column */}
          <AuroraGrid size={{ xs: 12, lg: 8 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Quick Actions */}
              <AuroraBox>
                <AdminQuickActionsWidget />
              </AuroraBox>

              {/* Department & Office Overview */}
              <AuroraBox>
                <DepartmentOfficeOverviewWidget />
              </AuroraBox>

              {/* Pipeline Analytics */}
              <AuroraBox>
                <PipelineAnalyticsWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>

          {/* Right Column */}
          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {/* Notification Center */}
              <AuroraBox>
                <NotificationCenterWidget />
              </AuroraBox>

              {/* Compliance Metrics */}
              <AuroraBox>
                <ComplianceMetricsWidget />
              </AuroraBox>
            </AuroraBox>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
