import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { usersService } from '@/services/usersService';

type ThemeType = "aurora" | "auroraDark" | "auroraLight" | "auroraCharcoal" | "auroraRandom";

export interface ThemeState {
  currentTheme: ThemeType;
  userId: string | null;
  loading: boolean;
  error?: string;
}

const THEME_STORAGE_KEY = "acentra-theme";
const DEFAULT_THEME: ThemeType = "aurora";

// Helper functions for localStorage
const getStoredTheme = (): ThemeType | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "aurora" || stored === "auroraDark" || stored === "auroraLight" || stored === "auroraCharcoal" || stored === "auroraRandom" ? (stored as ThemeType) : null;
  } catch {
    return null;
  }
};

const setStoredTheme = (theme: ThemeType): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
};

const initialState: ThemeState = {
  currentTheme: getStoredTheme() || DEFAULT_THEME,
  userId: null,
  loading: false,
};

export const loadUserPreferences = createAsyncThunk<
  { theme: ThemeType; shouldUpdateLocalStorage: boolean },
  string,
  { rejectValue: string }
>('theme/loadPreferences', async (userId, { rejectWithValue }) => {
  try {
    const response = await usersService.getUserPreferences(userId);
    const apiTheme = response.preferences?.theme as ThemeType;

    if (apiTheme && ["aurora", "auroraDark", "auroraLight", "auroraCharcoal", "auroraRandom"].includes(apiTheme)) {
      const storedTheme = getStoredTheme();
      const shouldUpdateLocalStorage = storedTheme !== apiTheme;

      return {
        theme: apiTheme,
        shouldUpdateLocalStorage: shouldUpdateLocalStorage || !storedTheme
      };
    }
    return {
      theme: DEFAULT_THEME,
      shouldUpdateLocalStorage: !getStoredTheme()
    };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load user preferences');
  }
});

export const setTheme = createAsyncThunk<
  void,
  { theme: ThemeType; userId?: string },
  { rejectValue: string }
>('theme/setTheme', async ({ theme, userId }, { rejectWithValue }) => {
  // Save to localStorage immediately
  setStoredTheme(theme);

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
      state.currentTheme = DEFAULT_THEME;
      state.userId = null;
      // Clear localStorage on logout to allow fresh start
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear theme from localStorage:", error);
      }
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
        state.currentTheme = action.payload.theme;
        if (action.payload.shouldUpdateLocalStorage) {
          setStoredTheme(action.payload.theme);
        }
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