import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { AuroraBox, AuroraTypography, AuroraCard, AuroraCardContent, AuroraGrid, AuroraLiveIconUsers, AuroraLiveIconChartColumn, AuroraLiveIconSlidersVertical } from '@acentra/aurora-design-system';

export const widgetName = 'admin-quick-actions';

export function AdminQuickActionsWidget() {
  const navigate = useNavigate();
  const tenant = useTenant();

  return (
    <AuroraBox>
      <AuroraTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Admin Quick Actions
      </AuroraTypography>
      <AuroraGrid container spacing={2}>
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
            onClick={() => navigate(`/${tenant}/admin/users`)}
          >
            <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
              <AuroraLiveIconUsers width={48} height={48} stroke="#1976d2" style={{ marginBottom: 16 }} />
              <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Manage Users
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                Add, edit, and manage user accounts
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
            onClick={() => navigate(`/${tenant}/admin/reports`)}
          >
            <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
              <AuroraLiveIconChartColumn width={48} height={48} stroke="#1976d2" style={{ marginBottom: 16 }} />
              <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                View Reports
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                Analytics and performance metrics
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
            onClick={() => navigate(`/${tenant}/settings`)}
          >
            <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
              <AuroraLiveIconSlidersVertical width={48} height={48} stroke="#1976d2" style={{ marginBottom: 16 }} />
              <AuroraTypography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Access Settings
              </AuroraTypography>
              <AuroraTypography variant="body2" color="text.secondary">
                Configure system preferences
              </AuroraTypography>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraGrid>
      </AuroraGrid>
    </AuroraBox>
  );
}