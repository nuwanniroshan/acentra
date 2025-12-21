import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiClient } from "@/services/clients";

interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  relatedEntityId: number;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id?: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      // Fetch latest 10 notifications for the panel
      const response = await apiClient.get("/notifications", {
        params: { page: 1, limit: 10 }
      });

      if (response.data && Array.isArray(response.data.data)) {
        setNotifications(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback
        setNotifications(response.data.slice(0, 10));
      } else {
        console.error("Unexpected response data:", response.data);
        setNotifications([]);
      }

      // Fetch unread count separately
      await fetchUnreadCount();

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      if (response.data && typeof response.data.count === 'number') {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const markAsRead = async (id?: number) => {
    try {
      await apiClient.patch("/notifications/read", { id });
      await fetchUnreadCount(); // Update count immediately
      // Update local state to reflect read status without refetching list if possible
      if (id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      } else {
        // If marking all as read (though markAllAsRead is separate)
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch("/notifications/read", {});
      await fetchUnreadCount();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tenantId = localStorage.getItem("tenantId");
    if (!token || !tenantId) {
      // Don't fetch notifications if user is not logged in or tenant not set
      return;
    }

    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}
