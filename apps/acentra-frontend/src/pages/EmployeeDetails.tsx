import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usersService } from "@/services/usersService";
import type { User } from "@/services/usersService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraBox,
  AuroraCard,
  AuroraCardContent,
  AuroraTypography,
  AuroraAvatar,
  AuroraButton,
  AuroraGrid,
  AuroraDivider,
  AuroraChip,
  AuroraArrowBackIcon,
  AuroraEmailIcon,
  AuroraHomeIcon,
  AuroraWorkIcon,
  AuroraBadgeIcon,
  AuroraLiveIconBadgeCheck,
  alpha,
} from "@acentra/aurora-design-system";
import { API_BASE_URL } from "@/services/clients";
import { UserRole } from "@acentra/shared-types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const tenant = useTenant();

  useEffect(() => {
    if (id) {
      loadEmployee(id);
    }
  }, [id]);

  const loadEmployee = async (userId: string) => {
    setLoading(true);
    try {
      const data = await usersService.getUser(userId);
      setEmployee(data);
    } catch {
      showSnackbar("Failed to load employee details", "error");
      navigate(`/${tenant}/people/staff`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraBox sx={{ p: 4 }}>
        <AuroraTypography>Loading employee details...</AuroraTypography>
      </AuroraBox>
    );
  }

  if (!employee) {
    return (
      <AuroraBox sx={{ p: 4 }}>
        <AuroraTypography>Employee not found</AuroraTypography>
      </AuroraBox>
    );
  }

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title="Employee Profile"
        subtitle="View and manage detailed information for this staff member."
        action={
          <AuroraButton
            startIcon={<AuroraArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate(`/${tenant}/people/staff`)}
            sx={{ borderRadius: 2.5, px: 3, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Back to Staff
          </AuroraButton>
        }
      />

      <AuroraBox sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 }, mt: -4, position: "relative", zIndex: 3 }}>
        <AuroraGrid container spacing={4}>
          {/* Left Column - Profile Summary */}
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <AuroraCard sx={{ borderRadius: 5, overflow: 'hidden', height: '100%' }}>
              <AuroraBox sx={{ height: 100, bgcolor: 'primary.main', opacity: 0.8 }} />
              <AuroraCardContent sx={{ pt: 0, textAlign: 'center', px: 3, pb: 4 }}>
                <AuroraBox sx={{ mt: -6, mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <AuroraAvatar
                    src={employee.profile_picture ? `${API_BASE_URL}/api/${employee.profile_picture}` : undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid',
                      borderColor: 'background.paper',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      fontSize: '3rem',
                      fontWeight: 800,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {employee.name?.charAt(0).toUpperCase()}
                  </AuroraAvatar>
                </AuroraBox>

                <AuroraTypography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  {employee.name || "N/A"}
                </AuroraTypography>
                <AuroraTypography variant="body1" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
                  {employee.job_title || "Designation Not Set"}
                </AuroraTypography>

                <AuroraBox sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <AuroraChip
                    label={employee.role.replace('_', ' ')}
                    status={employee.role === UserRole.ADMIN ? "error" : "primary"}
                    size="small"
                    sx={{ textTransform: 'capitalize', fontWeight: 700 }}
                  />
                  <AuroraChip
                    label={employee.is_active ? "Active" : "Disabled"}
                    status={employee.is_active ? "success" : "neutral"}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </AuroraBox>

                <AuroraDivider sx={{ my: 3 }} />

                <AuroraBox sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                  <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AuroraBox sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }}>
                      <AuroraEmailIcon fontSize="small" />
                    </AuroraBox>
                    <AuroraTypography variant="body2" sx={{ fontWeight: 600 }}>
                      {employee.email}
                    </AuroraTypography>
                  </AuroraBox>

                  {employee.employee_number && (
                    <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AuroraBox sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6' }}>
                        <AuroraBadgeIcon fontSize="small" />
                      </AuroraBox>
                      <AuroraTypography variant="body2" sx={{ fontWeight: 600 }}>
                        ID: {employee.employee_number}
                      </AuroraTypography>
                    </AuroraBox>
                  )}
                </AuroraBox>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>

          {/* Right Column - Detailed Info */}
          <AuroraGrid size={{ xs: 12, md: 8 }}>
            <AuroraCard sx={{ borderRadius: 5, p: 2, height: '100%' }}>
              <AuroraCardContent>
                <AuroraTypography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AuroraWorkIcon color="primary" /> Employment Details
                </AuroraTypography>

                <AuroraGrid container spacing={4}>
                  <AuroraGrid size={{ xs: 12, sm: 6 }}>
                    <AuroraTypography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1 }}>
                      Department
                    </AuroraTypography>
                    <AuroraTypography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {employee.department || "No Department Assigned"}
                    </AuroraTypography>
                  </AuroraGrid>

                  <AuroraGrid size={{ xs: 12, sm: 6 }}>
                    <AuroraTypography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1 }}>
                      Office Location
                    </AuroraTypography>
                    <AuroraTypography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {employee.office_location || "Not Specified"}
                    </AuroraTypography>
                  </AuroraGrid>

                  <AuroraGrid size={{ xs: 12, sm: 6 }}>
                    <AuroraTypography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1 }}>
                      Reporting Manager
                    </AuroraTypography>
                    <AuroraBox sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AuroraAvatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'secondary.main' }}>M</AuroraAvatar>
                      <AuroraTypography variant="body1" sx={{ fontWeight: 700 }}>
                        {employee.manager_id || "Direct to CEO"}
                      </AuroraTypography>
                    </AuroraBox>
                  </AuroraGrid>

                  <AuroraGrid size={{ xs: 12, sm: 6 }}>
                    <AuroraTypography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1 }}>
                      Joined Date
                    </AuroraTypography>
                    <AuroraTypography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {new Date(employee.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </AuroraTypography>
                  </AuroraGrid>
                </AuroraGrid>

                <AuroraDivider sx={{ my: 5 }} />

                <AuroraTypography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AuroraHomeIcon color="primary" /> Personal Information
                </AuroraTypography>

                <AuroraGrid container spacing={4}>
                  <AuroraGrid size={{ xs: 12 }}>
                    <AuroraTypography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1 }}>
                      Home Address
                    </AuroraTypography>
                    <AuroraTypography variant="body1" sx={{ fontWeight: 600, mt: 1, lineHeight: 1.6 }}>
                      {employee.address || "No address information available for this employee."}
                    </AuroraTypography>
                  </AuroraGrid>
                </AuroraGrid>

                {/* Performance/Status Banner */}
                <AuroraBox
                  sx={{
                    mt: 6,
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha('#10b981', 0.05),
                    border: '1px dashed',
                    borderColor: alpha('#10b981', 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AuroraLiveIconBadgeCheck width={40} height={40} stroke="#10b981" />
                    <AuroraBox>
                      <AuroraTypography variant="subtitle2" sx={{ fontWeight: 800, color: '#065f46' }}>
                        Good Standing
                      </AuroraTypography>
                      <AuroraTypography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                        Employee is currently in active status and verified.
                      </AuroraTypography>
                    </AuroraBox>
                  </AuroraBox>
                  <AuroraButton variant="text" size="small" sx={{ fontWeight: 800, color: '#059669' }}>
                    View History
                  </AuroraButton>
                </AuroraBox>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
