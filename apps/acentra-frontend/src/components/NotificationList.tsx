import { useNavigate } from "react-router-dom";
import {
  AuroraBox,
  AuroraList,
  AuroraTypography,
  AuroraDivider,
  AuroraChip,
  alpha,
} from "@acentra/aurora-design-system";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { NotificationImportantTwoTone, CheckCircleOutline } from "@mui/icons-material";

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  // Context now provides latest 10
  const recentNotifications = notifications;

  return (
    <AuroraBox sx={{ width: 400, maxHeight: 600, overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
      <AuroraBox sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", position: 'sticky', top: 0, zIndex: 1 }}>
        <AuroraTypography variant="subtitle1" fontWeight={700}>
          Notifications
        </AuroraTypography>
      </AuroraBox>

      <AuroraBox sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
        {recentNotifications.length === 0 ? (
          <AuroraBox sx={{ p: 6, textAlign: "center" }}>
            <AuroraBox
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: alpha("#2563eb", 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                color: "text.disabled",
              }}
            >
              <CheckCircleOutline sx={{ fontSize: 32 }} />
            </AuroraBox>
            <AuroraTypography color="text.primary" variant="subtitle2" fontWeight={600} gutterBottom>
              You're all caught up!
            </AuroraTypography>
            <AuroraTypography color="text.secondary" variant="caption">
              No new notifications at the moment.
            </AuroraTypography>
          </AuroraBox>
        ) : (
          <AuroraList sx={{ p: 0 }}>
            {recentNotifications.map((notification, index) => (
              <AuroraBox key={notification.id} sx={{ position: 'relative' }}>
                <AuroraBox
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    cursor: "pointer",
                    p: 2,
                    bgcolor: notification.isRead ? "transparent" : "primary.lighter",
                    transition: "0.2s",
                    "&:hover": { bgcolor: "action.hover" },
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <AuroraBox sx={{ mt: 0.5, color: notification.isRead ? 'text.disabled' : 'primary.main' }}>
                    {notification.isRead ? <CheckCircleOutline fontSize="small" /> : <NotificationImportantTwoTone fontSize="small" />}
                  </AuroraBox>

                  <AuroraBox sx={{ flex: 1 }}>
                    <AuroraBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <AuroraChip
                        label={notification.type.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          borderRadius: 0.5,
                          textTransform: 'uppercase'
                        }}
                      />
                      <AuroraTypography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }).replace("about ", "")}
                      </AuroraTypography>
                    </AuroraBox>

                    <AuroraTypography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontWeight: notification.isRead ? 400 : 600,
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}
                    >
                      {notification.message}
                    </AuroraTypography>
                  </AuroraBox>
                </AuroraBox>
                {index < notifications.length - 1 && <AuroraDivider />}
              </AuroraBox>
            ))}
          </AuroraList>
        )}
      </AuroraBox>

      <AuroraBox sx={{ p: 1.5, borderTop: 1, borderColor: "divider", textAlign: "center", bgcolor: "background.paper" }}>
        <AuroraTypography
          variant="body2"
          color="primary"
          sx={{ cursor: "pointer", fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          onClick={() => {
            navigate(`/${localStorage.getItem("tenantId")}/notifications`);
            if (onClose) onClose();
          }}
        >
          See all notifications
        </AuroraTypography>
      </AuroraBox>
    </AuroraBox>
  );
}
