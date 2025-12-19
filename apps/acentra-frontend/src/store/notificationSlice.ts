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
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notification/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/notifications");
    if (Array.isArray(response.data)) {
      return response.data;
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
    dispatch(fetchNotifications());
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
    dispatch(fetchNotifications());
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fetch error";
      })
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(markAsRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Mark as read error";
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Mark all as read error";
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
