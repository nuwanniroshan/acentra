import { useEffect, useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraCard,
  AuroraCardContent,
  AuroraChip,
  AuroraStack,
  AuroraIconButton,
} from "@acentra/aurora-design-system";
import { apiClient } from "@/services/clients";
import { formatDistanceToNow } from "date-fns";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";

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
    // Locally update state
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AuroraBox sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <AuroraTypography variant="h5" sx={{ fontWeight: 700 }}>
          Notifications
        </AuroraTypography>
        <AuroraButton variant="outlined" onClick={handleMarkAllAsRead}>
          Mark all as read
        </AuroraButton>
      </AuroraBox>

      {/* Filters */}
      <AuroraStack direction="row" spacing={2} sx={{ mb: 3 }}>
        <AuroraButton
          variant={filter === "all" ? "contained" : "text"}
          onClick={() => setFilter("all")}
          size="small"
        >
          All
        </AuroraButton>
        <AuroraButton
          variant={filter === "unread" ? "contained" : "text"}
          onClick={() => setFilter("unread")}
          size="small"
        >
          Unread
        </AuroraButton>
        <AuroraButton
          variant={filter === "read" ? "contained" : "text"}
          onClick={() => setFilter("read")}
          size="small"
        >
          Read
        </AuroraButton>
      </AuroraStack>

      <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {notifications.map((notification) => (
          <AuroraCard
            key={notification.id}
            sx={{
              bgcolor: notification.isRead ? "background.paper" : "action.hover",
              transition: "0.2s",
              borderLeft: notification.isRead ? "none" : "4px solid",
              borderLeftColor: "primary.main",
            }}
          >
            <AuroraCardContent sx={{ display: "flex", alignItems: "start", gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
              <AuroraBox sx={{ flexGrow: 1 }}>
                <AuroraBox sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
                  <AuroraChip
                    label={notification.type.replace("_", " ")}
                    size="small"
                    color={notification.isRead ? "default" : "primary"}
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                  <AuroraTypography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </AuroraTypography>
                </AuroraBox>
                <AuroraTypography variant="body1" fontWeight={notification.isRead ? 400 : 600}>
                  {notification.message}
                </AuroraTypography>
              </AuroraBox>

              {!notification.isRead && (
                <AuroraIconButton
                  size="small"
                  onClick={() => handleMarkAsRead(notification.id)}
                  title="Mark as read"
                >
                  <RadioButtonUnchecked fontSize="small" color="primary" />
                </AuroraIconButton>
              )}
              {notification.isRead && (
                <CheckCircleOutline fontSize="small" color="disabled" />
              )}
            </AuroraCardContent>
          </AuroraCard>
        ))}

        {notifications.length === 0 && !loading && (
          <AuroraBox sx={{ textAlign: "center", py: 8 }}>
            <AuroraTypography color="text.secondary">
              No notifications found
            </AuroraTypography>
          </AuroraBox>
        )}

        {hasMore && (
          <AuroraBox sx={{ textAlign: "center", mt: 2 }}>
            <AuroraButton
              onClick={() => loadNotifications(false)}
              disabled={loading}
              variant="text"
            >
              {loading ? "Loading..." : "Load More"}
            </AuroraButton>
          </AuroraBox>
        )}
      </AuroraBox>
    </AuroraBox>
  );
}
