import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraCard,
  AuroraGrid,
  AuroraLiveIconCheck,
  AuroraLiveIconFolders,
  AuroraLiveIconUsers,
} from "@acentra/aurora-design-system";
import { ActionPermission } from "@acentra/shared-types";

export function QuickActionsWidget() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const tenant = useTenant();

  const actions = [
    {
      label: "Create Job",
      icon: <AuroraLiveIconCheck width={24} height={24} stroke="#3b82f6" />,
      path: `/${tenant}/create-job`,
      permission: ActionPermission.CREATE_JOBS,
      color: "#3b82f6"
    },
    {
      label: "View All Jobs",
      icon: <AuroraLiveIconFolders width={24} height={24} stroke="#8b5cf6" />,
      path: `/${tenant}/ats/jobs`,
      color: "#8b5cf6"
    },
    {
      label: "Candidates",
      icon: <AuroraLiveIconUsers width={24} height={24} stroke="#10b981" />,
      path: `/${tenant}/ats/candidates`,
      color: "#10b981"
    }
  ];

  return (
    <AuroraGrid container spacing={2}>
      {actions.map((action, index) => {
        if (action.permission && !hasPermission(action.permission)) return null;

        return (
          <AuroraGrid key={index} size={{ xs: 12 }}>
            <AuroraCard
              noPadding
              sx={{
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateX(4px)",
                  bgcolor: "rgba(255,255,255,0.7)"
                },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
              }}
              onClick={() => navigate(action.path)}
            >
              <AuroraBox sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <AuroraBox sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${action.color}15`
                }}>
                  {action.icon}
                </AuroraBox>
                <AuroraBox>
                  <AuroraTypography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {action.label}
                  </AuroraTypography>
                </AuroraBox>
              </AuroraBox>
            </AuroraCard>
          </AuroraGrid>
        );
      })}
    </AuroraGrid>
  );
}
