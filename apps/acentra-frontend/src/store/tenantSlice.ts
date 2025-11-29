import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/services/clients';

export interface TenantState {
  tenantId: string | null;
  loading: boolean;
  error?: string;
}

const initialState: TenantState = {
  tenantId: null,
  loading: false,
};

export const validateTenant = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tenant/validate', async (slug, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/tenants/${slug}/check`);
    if (response.data.isActive) {
      return slug;
    }
    return rejectWithValue('Tenant is inactive');
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Tenant validation failed');
  }
});

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<string>) {
      state.tenantId = action.payload;
    },
    clearTenant(state) {
      state.tenantId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateTenant.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(validateTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantId = action.payload;
        localStorage.setItem('tenantId', action.payload);
      })
      .addCase(validateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Validation error';
        state.tenantId = null;
        localStorage.removeItem('tenantId');
      });
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
