import { useEffect, useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraPaper,
  AuroraChip,
} from "@acentra/aurora-design-system";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { apiClient } from "@/services/clients";
import { format } from "date-fns";
import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  NotificationImportantTwoTone
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  relatedEntityId: number;
  createdAt: string;
}

export function NotificationsPage() {
  const { markAsRead, markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (filter !== "all") {
        params.filter = filter;
      }

      const response = await apiClient.get("/notifications", { params });

      if (response.data && Array.isArray(response.data.data)) {
        if (reset) {
          setNotifications(response.data.data);
        } else {
          setNotifications(prev => [...prev, ...response.data.data]);
        }
        setHasMore(currentPage < response.data.totalPages);
        if (!reset) {
          setPage(currentPage + 1);
        } else {
          setPage(2);
        }
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true);
  }, [filter]);

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Group notifications by date
  // This is not fully robust for pagination (might break groups across pages), but good for "latest" view.
  // For strictly correct grouping across pagination, we'd need more complex logic or just group visually per chunk.

  return (
    <AuroraBox sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
          pb: 2,
          borderBottom: 1,
          borderColor: "divider"
        }}
      >
        <AuroraBox>
          <AuroraTypography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Notifications
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Stay updated with the latest activities and alerts.
          </AuroraTypography>
        </AuroraBox>

        <AuroraButton size="small" onClick={handleMarkAllAsRead}>
          Mark all as read
        </AuroraButton>
      </AuroraBox>

      {/* Filters */}
      <AuroraBox sx={{ mb: 4, display: 'flex', gap: 1 }}>
        {['all', 'unread', 'read'].map((f) => (
          <AuroraChip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            onClick={() => setFilter(f as any)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            sx={{
              cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
              minWidth: 80
            }}
          />
        ))}
      </AuroraBox>

      {/* Timeline Layout */}
      <Timeline position="right" sx={{ p: 0, m: 0, '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
        {notifications.map((notification, index) => (
          <TimelineItem key={notification.id} sx={{ minHeight: 80 }}>
            <TimelineSeparator>
              <TimelineDot
                color={notification.isRead ? "grey" : "primary"}
                variant={notification.isRead ? "outlined" : "filled"}
                sx={{ mx: 2, my: 1.5 }}
              >
                {!notification.isRead && <NotificationImportantTwoTone sx={{ fontSize: 16 }} />}
                {notification.isRead && <CheckCircleOutline sx={{ fontSize: 16 }} />}
              </TimelineDot>
              {index < notifications.length - 1 && <TimelineConnector sx={{ bgcolor: 'divider' }} />}
            </TimelineSeparator>

            <TimelineContent sx={{ py: 1, px: 2 }}>
              <AuroraPaper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1,
                  bgcolor: notification.isRead ? 'background.paper' : 'primary.lighter',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AuroraChip
                      label={notification.type.replace(/_/g, " ")}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderRadius: 0.5
                      }}
                    />
                    <AuroraTypography variant="caption" color="text.secondary" fontWeight={500}>
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy • h:mm a')}
                    </AuroraTypography>
                  </AuroraBox>

                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                      sx={{ mt: -1, mr: -1 }}
                    >
                      <RadioButtonUnchecked fontSize="small" color="primary" />
                    </IconButton>
                  )}
                </AuroraBox>

                <AuroraTypography
                  variant="body2"
                  color="text.primary"
                  sx={{ fontWeight: notification.isRead ? 400 : 500, lineHeight: 1.6 }}
                >
                  {notification.message}
                </AuroraTypography>
              </AuroraPaper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {notifications.length === 0 && !loading && (
        <AuroraBox sx={{ textAlign: "center", py: 8 }}>
          <AuroraTypography color="text.secondary">
            No notifications found
          </AuroraTypography>
        </AuroraBox>
      )}

      {hasMore && (
        <AuroraBox sx={{ textAlign: "center", mt: 4 }}>
          <AuroraButton
            onClick={() => loadNotifications(false)}
            disabled={loading}
            variant="text"
          >
            {loading ? "Loading..." : "Load Older Notifications"}
          </AuroraButton>
        </AuroraBox>
      )}
    </AuroraBox>
  );
}
