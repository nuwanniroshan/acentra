
import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { candidatesService } from "@/services/candidatesService";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { AuroraBox, AuroraTypography, AuroraButton, AuroraCard, AuroraCardContent, AuroraGrid, AuroraWorkIcon, AuroraPeopleIcon, AuroraAddIcon } from '@acentra/aurora-design-system';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    newCandidatesThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tenant = useTenant();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load jobs and candidates data
      const [jobsData, candidatesData] = await Promise.all([
        jobsService.getJobs(),
        candidatesService.getCandidates()
      ]);

      // Calculate stats
      const activeJobs = jobsData.filter(job => job.status === 'active' || !job.status).length;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newCandidatesThisWeek = candidatesData.data.filter((candidate: any) =>
        new Date(candidate.created_at) > oneWeekAgo
      ).length;

      setStats({
        totalJobs: jobsData.length,
        activeJobs,
        totalCandidates: candidatesData.data.length,
        newCandidatesThisWeek,
      });
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", textAlign: "center", py: 8 }}>
        <AuroraTypography variant="h6">Loading dashboard...</AuroraTypography>
      </AuroraBox>
    );
  }

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
          <AuroraCard sx={{ height: '100%' }}>
            <AuroraCardContent sx={{ p: 3 }}>
              <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AuroraWorkIcon sx={{ color: 'primary.main', mr: 1 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Jobs
                </AuroraTypography>
              </AuroraBox>
              <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalJobs}
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                {stats.activeJobs} active openings
              </AuroraTypography>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <AuroraCard sx={{ height: '100%' }}>
            <AuroraCardContent sx={{ p: 3 }}>
              <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AuroraPeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Candidates
                </AuroraTypography>
              </AuroraBox>
              <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalCandidates}
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                +{stats.newCandidatesThisWeek} this week
              </AuroraTypography>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <AuroraCard sx={{ height: '100%' }}>
            <AuroraCardContent sx={{ p: 3 }}>
              <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AuroraWorkIcon sx={{ color: 'success.main', mr: 1 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                  Active Jobs
                </AuroraTypography>
              </AuroraBox>
              <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.activeJobs}
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                Currently hiring
              </AuroraTypography>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraGrid>

        <AuroraGrid size={{ xs: 12, sm: 6, md: 3 }}>
          <AuroraCard sx={{ height: '100%' }}>
            <AuroraCardContent sx={{ p: 3 }}>
              <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AuroraPeopleIcon sx={{ color: 'warning.main', mr: 1 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                  New This Week
                </AuroraTypography>
              </AuroraBox>
              <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.newCandidatesThisWeek}
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                New candidates
              </AuroraTypography>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraGrid>
      </AuroraGrid>

      {/* Quick Actions */}
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </AuroraTypography>
        <AuroraGrid container spacing={2}>
          {(user.role === "admin" || user.role === "hr" || user.role === "engineering_manager") && (
            <AuroraGrid size={{ xs: 12, sm: 6, md: 4 }}>
              <AuroraCard
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => navigate(`/${tenant}/create-job`)}
              >
                <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
                  <AuroraAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Create New Job
                  </AuroraTypography>
                  <AuroraTypography variant="body2" color="text.secondary">
                    Post a new job opening
                  </AuroraTypography>
                </AuroraCardContent>
              </AuroraCard>
            </AuroraGrid>
          )}

          <AuroraGrid size={{ xs: 12, sm: 6, md: 4 }}>
            <AuroraCard
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => navigate(`/${tenant}/shortlist/jobs`)}
            >
              <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
                <AuroraWorkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  View All Jobs
                </AuroraTypography>
                <AuroraTypography variant="body2" color="text.secondary">
                  Browse and manage job openings
                </AuroraTypography>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>

          <AuroraGrid size={{ xs: 12, sm: 6, md: 4 }}>
            <AuroraCard
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => navigate(`/${tenant}/shortlist/candidates`)}
            >
              <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
                <AuroraPeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  View Candidates
                </AuroraTypography>
                <AuroraTypography variant="body2" color="text.secondary">
                  Review candidate profiles
                </AuroraTypography>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>

      {/* Recent Activity Placeholder */}
      <AuroraBox>
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Recent Activity
        </AuroraTypography>
        <AuroraCard>
          <AuroraCardContent sx={{ p: 3, textAlign: 'center', py: 6 }}>
            <AuroraTypography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Activity Feed Coming Soon
            </AuroraTypography>
            <AuroraTypography variant="body2" color="text.secondary">
              This section will show recent hiring activities, new applications, and important updates.
            </AuroraTypography>
          </AuroraCardContent>
        </AuroraCard>
      </AuroraBox>
    </AuroraBox>
  );
}
