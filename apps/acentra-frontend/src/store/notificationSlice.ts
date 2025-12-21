import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/services/clients";

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  relatedEntityId: number;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchUnreadCount = createAsyncThunk<
  { count: number },
  void,
  { rejectValue: string }
>("notification/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to fetch unread count"
    );
  }
});

export const fetchNotifications = createAsyncThunk<
  { data: Notification[]; total: number; page: number; limit: number; totalPages: number },
  { page?: number; limit?: number } | void,
  { rejectValue: string }
>("notification/fetch", async (params, { rejectWithValue }) => {
  try {
    // Determine if params were provided, otherwise default to page 1 limit 10
    const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10
    };
    const response = await apiClient.get("/notifications", { params: queryParams });
    
    // Check if response matches expected paginated structure
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    } else if (Array.isArray(response.data)) {
       // Fallback for backward compatibility if API hasn't deployed or behaves differently
       return {
         data: response.data,
         total: response.data.length,
         page: 1,
         limit: response.data.length,
         totalPages: 1
       };
    } else {
      return rejectWithValue("Unexpected response data");
    }
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to fetch notifications",
    );
  }
});

export const markAsRead = createAsyncThunk<
  void,
  number | undefined,
  { rejectValue: string }
>("notification/markAsRead", async (id, { rejectWithValue, dispatch }) => {
  try {
    await apiClient.patch("/notifications/read", { id });
    dispatch(fetchUnreadCount()); // Update count
    // Optional: Refresh list if needed, but we might just update local state instead for efficiency
    // dispatch(fetchNotifications()); 
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to mark notification as read",
    );
  }
});

export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/markAllAsRead", async (_, { rejectWithValue, dispatch }) => {
  try {
    await apiClient.patch("/notifications/read", {});
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications({ page: 1, limit: 10 })); // Refresh list to show updated status
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ??
        "Failed to mark all notifications as read",
    );
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // If loading first page (or initial load), replace. If loading more (infinite scroll scenario), append could be handled in component or here if we pass a flag.
        // For now, simple replacement strategy, assuming component manages concatenation if using infinite scroll, or we modify this to append if page > 1.
        // Let's stick to simple replacement for table/list view pagination. 
        // For infinite scroll, consumers might want to manually manage the list or we can support an 'append' param.
        // Given requirements, let's keep it simple: replace state.
        state.notifications = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fetch error";
      })
      .addCase(markAsRead.pending, () => {
        // Optimistic update could go here
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        // If we want to verify specific ID was read, we'd need it in payload.
        // For now, we rely on fetchUnreadCount to update the global count.
        // We can locally update the notification's isRead status if we knew the ID.
        // But markAsRead thunk arg is not available in fulfilled payload by default unless returned or using meta.
        // Let's perform a refetch or simple local update if we can access meta.
        const id = action.meta.arg;
        if (id) {
           const note = state.notifications.find(n => n.id === id);
           if (note && !note.isRead) {
               note.isRead = true;
               // Optimistically decrement unread count if we don't fetch it
               // state.unreadCount = Math.max(0, state.unreadCount - 1);
           }
        }
        state.loading = false;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Mark as read error";
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Mark all as read error";
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
