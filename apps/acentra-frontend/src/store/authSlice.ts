import { createSlice, createAsyncThunk, type PayloadAction, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  profile_picture?: string;
  department?: string;
  office_location?: string;
  is_active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string;
}

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let user: User | null = null;

try {
  user = userStr ? JSON.parse(userStr) : null;
} catch (e) {
  console.error('Failed to parse user from local storage');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

const initialState: AuthState = {
  user,
  token,
  loading: false,
};

export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (creds: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await authService.login(creds);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Login failed');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_: void, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state: AuthState, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearCredentials(state: AuthState) {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        // persist to localStorage for backward compatibility
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login error';
      })
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state: AuthState, action) => {
        state.error = action.payload ?? 'Logout error';
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
