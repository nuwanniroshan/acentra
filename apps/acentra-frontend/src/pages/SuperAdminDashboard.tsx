import {
  AuroraBox,
  AuroraGrid,
  AuroraBusinessIcon,
  AuroraPeopleIcon,
  AuroraSettingsIcon,
  AuroraTypography
} from "@acentra/aurora-design-system";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { usersService } from "@/services/usersService";

export function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalTenants: 1, // Placeholder
    activeUsers: 0,
    systemHealth: "100%",
    loading: true
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Super Admin";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const users = await usersService.getUsers();
      setStats({
        totalTenants: 1,
        activeUsers: users.length,
        systemHealth: "99.9%",
        loading: false
      });
    } catch (err) {
      console.error("Failed to load super admin stats", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title={`Welcome, ${userName}`}
        subtitle="Global platform management and infrastructure monitoring."
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Active Tenants"
              value={stats.totalTenants}
              icon={<AuroraBusinessIcon sx={{ fontSize: 28 }} />}
              trend="Global"
              color="#3b82f6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Users"
              value={stats.activeUsers}
              icon={<AuroraPeopleIcon sx={{ fontSize: 28 }} />}
              trend="Cross-tenant"
              color="#8b5cf6"
              loading={stats.loading}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="System Health"
              value={stats.systemHealth}
              icon={<AuroraSettingsIcon sx={{ fontSize: 28 }} />}
              trend="Optimal"
              color="#10b981"
              loading={stats.loading}
            />
          </AuroraGrid>
        </AuroraGrid>

        <AuroraGrid container spacing={5}>
          <AuroraGrid size={{ xs: 12 }}>
            <AuroraBox sx={{ p: 8, textAlign: "center", bgcolor: "background.paper", borderRadius: 4, border: "1px dashed", borderColor: "divider" }}>
              <AuroraTypography variant="h6" color="text.secondary">
                Management tools and infrastructure metrics will appear here.
              </AuroraTypography>
            </AuroraBox>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
