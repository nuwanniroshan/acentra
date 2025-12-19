import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraCard,
  AuroraCardContent,
  AuroraGrid,
  AuroraLiveIconCheck,
  AuroraLiveIconFolders,
  AuroraLiveIconUsers,
} from "@acentra/aurora-design-system";
import { UserRole } from "@acentra/shared-types";

export const widgetName = "quick-actions";

export function QuickActionsWidget() {
  const navigate = useNavigate();
  const tenant = useTenant();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <AuroraBox>
      <AuroraTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Quick Actions
      </AuroraTypography>
      <AuroraGrid container spacing={2}>
        {(user.role === UserRole.ADMIN ||
          user.role === UserRole.HR ||
          user.role === UserRole.HIRING_MANAGER) && (
            <AuroraGrid size={{ xs: 12, sm: 6, md: 4 }}>
              <AuroraCard
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => navigate(`/${tenant}/create-job`)}
              >
                <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
                  <AuroraLiveIconCheck
                    width={48}
                    height={48}
                    stroke="#1976d2"
                    style={{ marginBottom: 16 }}
                  />
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
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
            onClick={() => navigate(`/${tenant}/shortlist/jobs`)}
          >
            <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
              <AuroraLiveIconFolders
                width={48}
                height={48}
                stroke="#1976d2"
                style={{ marginBottom: 16 }}
              />
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
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
            onClick={() => navigate(`/${tenant}/shortlist/candidates`)}
          >
            <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
              <AuroraLiveIconUsers
                width={48}
                height={48}
                stroke="#1976d2"
                style={{ marginBottom: 16 }}
              />
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
  );
}
