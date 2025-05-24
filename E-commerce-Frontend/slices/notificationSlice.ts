import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { NotificationType } from "../src/types/Notification";

interface Notification {
  id: string;
  type: NotificationType;
  label: string;
}

interface NotificationState {
   notifications: Notification[];
}

const initialState : NotificationState = {
  notifications: []
}

export const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    Notification: (state, action: PayloadAction<{ type: NotificationType; label: string }>) => {
      state.notifications.push({
        id: nanoid(),
        type: action.payload.type,
        label: action.payload.label,
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (prev) => prev.id !== action.payload
      );
    },
  },
});

export const { Notification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
