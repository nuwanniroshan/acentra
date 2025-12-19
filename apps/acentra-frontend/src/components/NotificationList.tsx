import {
  AuroraBox,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraTypography,
  AuroraDivider,
  AuroraChip,
} from "@acentra/aurora-design-system";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export function NotificationList() {
  const { notifications, markAsRead } = useNotifications();

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  // Limit to 30 most recent notifications
  const recentNotifications = notifications.slice(0, 30);

  return (
    <AuroraBox sx={{ width: 380, maxHeight: 500, overflow: "auto" }}>
      <AuroraBox sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <AuroraTypography variant="h6" fontWeight={600}>
          Notifications
        </AuroraTypography>
      </AuroraBox>

      {recentNotifications.length === 0 ? (
        <AuroraBox sx={{ p: 3, textAlign: "center" }}>
          <AuroraTypography color="text.secondary">
            No notifications
          </AuroraTypography>
        </AuroraBox>
      ) : (
        <AuroraList sx={{ p: 0 }}>
          {recentNotifications.map((notification, index) => (
            <AuroraBox key={notification.id}>
              <AuroraListItem
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  cursor: "pointer",
                  bgcolor: notification.isRead ? "transparent" : "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                  py: 2,
                }}
              >
                <AuroraListItemText
                  primary={
                    <AuroraBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <AuroraTypography
                        variant="body2"
                        fontWeight={notification.isRead ? 400 : 600}
                      >
                        {notification.message}
                      </AuroraTypography>
                      {!notification.isRead && (
                        <AuroraBox
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </AuroraBox>
                  }
                  secondary={
                    <AuroraBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <AuroraChip
                        label={notification.type.replace("_", " ")}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                      <AuroraTypography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </AuroraTypography>
                    </AuroraBox>
                  }
                />
              </AuroraListItem>
              {index < notifications.length - 1 && <AuroraDivider />}
            </AuroraBox>
          ))}
        </AuroraList>
      )}
    </AuroraBox>
  );
}
