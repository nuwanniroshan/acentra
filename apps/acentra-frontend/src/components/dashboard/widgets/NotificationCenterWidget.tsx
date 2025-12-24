import { useEffect, useState } from "react";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraListItemIcon,
  AuroraChip,
  AuroraDivider,
  AuroraLiveIconBellRing,
  AuroraLiveIconBadgeAlert,
  AuroraLiveIconCheck,
} from "@acentra/aurora-design-system";

export const widgetName = "notification-center";

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
}

export function NotificationCenterWidget() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      // Mock system alerts - in a real implementation, this would fetch from an API
      const mockAlerts: SystemAlert[] = [
        {
          id: "1",
          type: "warning",
          title: "Pipeline Bottleneck Detected",
          message:
            '5 candidates stuck in "Interview Scheduled" stage for over 7 days',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          priority: "high",
        },
        {
          id: "2",
          type: "info",
          title: "New Job Posted",
          message:
            "Senior Software Engineer position has received 12 applications",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          priority: "medium",
        },
        {
          id: "3",
          type: "success",
          title: "Hiring Goal Achieved",
          message: "Congratulations! 3 positions filled this month",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          priority: "low",
        },
        {
          id: "4",
          type: "warning",
          title: "User Access Review Due",
          message: "5 user accounts pending role verification",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          priority: "medium",
        },
      ];

      setAlerts(mockAlerts);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
      case "error":
        return (
          <AuroraLiveIconBadgeAlert width={20} height={20} stroke="#f57c00" />
        );
      case "success":
        return <AuroraLiveIconCheck width={20} height={20} stroke="#2e7d32" />;
      default:
        return (
          <AuroraLiveIconBellRing width={20} height={20} stroke="#1976d2" />
        );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ height: "100%" }}>
        <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
          <AuroraTypography variant="body2">Loading...</AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    );
  }

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AuroraLiveIconBellRing width={24} height={24} stroke="#1976d2" />
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
          Notification Center
        </AuroraTypography>
      </AuroraBox>

      <AuroraCard>
        <AuroraCardContent sx={{ p: 0 }}>
          <AuroraBox
            sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
          >
            <AuroraBox
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                System Alerts
              </AuroraTypography>
              <AuroraChip
                label={`${alerts.filter((a) => a.priority === "high").length} High Priority`}
                status="error"
                variant="outlined"
              />
            </AuroraBox>
          </AuroraBox>

          <AuroraList sx={{ py: 0 }}>
            {alerts.length === 0 ? (
              <AuroraBox sx={{ p: 3, textAlign: "center" }}>
                <AuroraTypography variant="body2" color="text.secondary">
                  No notifications at this time
                </AuroraTypography>
              </AuroraBox>
            ) : (
              alerts.map((alert, index) => (
                <div key={alert.id}>
                  <AuroraListItem sx={{ py: 2, px: 3 }}>
                    <AuroraListItemIcon sx={{ minWidth: 40 }}>
                      {getAlertIcon(alert.type)}
                    </AuroraListItemIcon>
                    <AuroraListItemText
                      primary={alert.title}
                      secondary={`${alert.message} • ${formatTimeAgo(alert.timestamp)}`}
                    />
                  </AuroraListItem>
                  {index < alerts.length - 1 && <AuroraDivider />}
                </div>
              ))
            )}
          </AuroraList>
        </AuroraCardContent>
      </AuroraCard>
    </AuroraBox>
  );
}
