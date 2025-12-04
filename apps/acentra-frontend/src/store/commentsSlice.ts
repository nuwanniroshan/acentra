import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { candidatesService } from "@/services/candidatesService";
import { commentsService } from "@/services/commentsService";

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  created_by: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  };
  attachment_path?: string;
  attachment_original_name?: string;
  attachment_type?: string;
  attachment_size?: number;
}

export interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error?: string;
  candidateId: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  candidateId: null,
};

export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: string }
>(
  "comments/fetchComments",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const data = await candidatesService.getCandidateComments(candidateId);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load comments",
      );
    }
  },
);

export const addComment = createAsyncThunk<
  Comment,
  { candidateId: string; text: string; attachment?: File },
  { rejectValue: string }
>(
  "comments/addComment",
  async ({ candidateId, text, attachment }, { rejectWithValue }) => {
    try {
      const data = await candidatesService.addCandidateComment(
        candidateId,
        text,
        attachment,
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to add comment",
      );
    }
  },
);

export const deleteCommentAttachment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "comments/deleteAttachment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      await commentsService.deleteCommentAttachment(commentId);
      return commentId;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to delete attachment",
      );
    }
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments(state: CommentsState) {
      state.comments = [];
      state.candidateId = null;
      state.error = undefined;
    },
    setCandidateId(state: CommentsState, action: PayloadAction<string | null>) {
      state.candidateId = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CommentsState>) => {
    builder
      .addCase(fetchComments.pending, (state: CommentsState) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchComments.fulfilled, (state: CommentsState, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state: CommentsState, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load comments";
      })
      .addCase(addComment.pending, (state: CommentsState) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state: CommentsState, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state: CommentsState, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add comment";
      })
      .addCase(
        deleteCommentAttachment.fulfilled,
        (state: CommentsState, action) => {
          const commentId = action.payload;
          const comment = state.comments.find((c) => c.id === commentId);
          if (comment) {
            comment.attachment_path = undefined;
            comment.attachment_original_name = undefined;
            comment.attachment_type = undefined;
            comment.attachment_size = undefined;
          }
        },
      );
  },
});

export const { clearComments, setCandidateId } = commentsSlice.actions;
export default commentsSlice.reducer;
