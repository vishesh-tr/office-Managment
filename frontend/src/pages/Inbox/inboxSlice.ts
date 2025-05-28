import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Notification, NotificationState } from "./notificationTypes";

// Initial state
const initialState: NotificationState = {
  notifications: [],
  status: "idle",
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "inbox/fetchNotifications",
  async () => {
    const savedNotifications = localStorage.getItem("inbox_notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  },
);

export const addNotification = createAsyncThunk(
  "inbox/addNotification",
  async (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    const saved = localStorage.getItem("inbox_notifications");
    const updated = saved
      ? [newNotification, ...JSON.parse(saved)]
      : [newNotification];
    localStorage.setItem("inbox_notifications", JSON.stringify(updated));
    return newNotification;
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "inbox/markNotificationAsRead",
  async (id: string) => {
    const saved = localStorage.getItem("inbox_notifications");
    if (!saved) return { id };
    const updated = JSON.parse(saved).map((n: Notification) =>
      n.id === id ? { ...n, read: true } : n,
    );
    localStorage.setItem("inbox_notifications", JSON.stringify(updated));
    return { id };
  },
);

export const deleteNotification = createAsyncThunk(
  "inbox/deleteNotification",
  async (id: string) => {
    const saved = localStorage.getItem("inbox_notifications");
    if (!saved) return id;
    const updated = JSON.parse(saved).filter((n: Notification) => n.id !== id);
    localStorage.setItem("inbox_notifications", JSON.stringify(updated));
    return id;
  },
);

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    clearAllNotifications: (state) => {
      state.notifications = [];
      localStorage.setItem("inbox_notifications", JSON.stringify([]));
    },
    markAllAsRead: (state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      state.notifications = updated;
      localStorage.setItem("inbox_notifications", JSON.stringify(updated));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch notifications";
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id,
        );
        if (index !== -1) state.notifications[index].read = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload,
        );
      });
  },
});

export const { clearAllNotifications, markAllAsRead } = inboxSlice.actions;
export default inboxSlice.reducer;
