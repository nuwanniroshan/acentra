import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { usersService } from '@/services/usersService';

type ThemeType = "aurora" | "auroraDark" | "auroraLight";

export interface ThemeState {
  currentTheme: ThemeType;
  userId: string | null;
  loading: boolean;
  error?: string;
}

const initialState: ThemeState = {
  currentTheme: "aurora",
  userId: null,
  loading: false,
};

export const loadUserPreferences = createAsyncThunk<
  ThemeType,
  string,
  { rejectValue: string }
>('theme/loadPreferences', async (userId, { rejectWithValue }) => {
  try {
    const response = await usersService.getUserPreferences(userId);
    const theme = response.preferences?.theme as ThemeType;
    if (theme && ["aurora", "auroraDark", "auroraLight"].includes(theme)) {
      return theme;
    }
    return "aurora"; // default
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load user preferences');
  }
});

export const setTheme = createAsyncThunk<
  void,
  { theme: ThemeType; userId?: string },
  { rejectValue: string }
>('theme/setTheme', async ({ theme, userId }, { rejectWithValue }) => {
  if (userId) {
    try {
      await usersService.updateUserPreferences(userId, { theme });
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Failed to save theme preference');
    }
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCurrentTheme(state, action: PayloadAction<ThemeType>) {
      state.currentTheme = action.payload;
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
    },
    resetTheme(state) {
      state.currentTheme = "aurora";
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTheme = action.payload;
      })
      .addCase(loadUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Load preferences error';
      })
      .addCase(setTheme.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(setTheme.fulfilled, (state) => {
        state.loading = false;
        // theme is already set in reducer
      })
      .addCase(setTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Set theme error';
      });
  },
});

export const { setCurrentTheme, setUserId, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;