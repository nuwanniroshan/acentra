import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tenantReducer from "./tenantSlice";
import notificationReducer from "./notificationSlice";
import snackbarReducer from "./snackbarSlice";
import themeReducer from "./themeSlice";
import commentsReducer from "./commentsSlice";
import pipelineHistoryReducer from "./pipelineHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    notification: notificationReducer,
    snackbar: snackbarReducer,
    theme: themeReducer,
    comments: commentsReducer,
    pipelineHistory: pipelineHistoryReducer,
  },
  // Redux Toolkit includes thunk middleware by default
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
