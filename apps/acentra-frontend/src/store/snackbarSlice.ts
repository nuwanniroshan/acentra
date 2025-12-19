import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AlertSeverity = "success" | "info" | "warning" | "error";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertSeverity;
}

const initialState: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar(
      state,
      action: PayloadAction<{ message: string; severity?: AlertSeverity }>,
    ) {
      state.message = action.payload.message;
      state.severity = action.payload.severity ?? "info";
      state.open = true;
    },
    closeSnackbar(state) {
      state.open = false;
    },
  },
});

export const { showSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
