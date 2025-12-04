import { createSlice, createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { candidatesService } from '@/services/candidatesService';

export interface ActivityLog {
  id: string;
  old_status: string;
  new_status: string;
  changed_at: string;
  changed_by: {
    name?: string;
    email: string;
  };
}

export interface PipelineHistoryState {
  history: ActivityLog[];
  loading: boolean;
  error?: string;
  candidateId: string | null;
}

const initialState: PipelineHistoryState = {
  history: [],
  loading: false,
  candidateId: null,
};

export const fetchPipelineHistory = createAsyncThunk<
  ActivityLog[],
  string,
  { rejectValue: string }
>('pipelineHistory/fetchHistory', async (candidateId: string, { rejectWithValue }) => {
  try {
    const data = await candidatesService.getCandidatePipelineHistory(candidateId);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load pipeline history');
  }
});

const pipelineHistorySlice = createSlice({
  name: 'pipelineHistory',
  initialState,
  reducers: {
    clearPipelineHistory(state: PipelineHistoryState) {
      state.history = [];
      state.candidateId = null;
      state.error = undefined;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<PipelineHistoryState>) => {
    builder
      .addCase(fetchPipelineHistory.pending, (state: PipelineHistoryState) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPipelineHistory.fulfilled, (state: PipelineHistoryState, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPipelineHistory.rejected, (state: PipelineHistoryState, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load pipeline history';
        state.history = [];
      });
  },
});

export const { clearPipelineHistory } = pipelineHistorySlice.actions;
export default pipelineHistorySlice.reducer;
