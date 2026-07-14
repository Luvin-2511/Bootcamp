import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { historyService } from "../services/historyService";

// ── Async Thunks ───────────────────────────────────────────────────

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await historyService.getAll();
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to load history");
    }
  }
);

export const fetchDataset = createAsyncThunk(
  "history/fetchDataset",
  async (id, { rejectWithValue }) => {
    try {
      return await historyService.getOne(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to load dataset");
    }
  }
);

export const deleteDataset = createAsyncThunk(
  "history/deleteDataset",
  async (id, { rejectWithValue }) => {
    try {
      await historyService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete");
    }
  }
);

// ── Initial State ──────────────────────────────────────────────────

const initialState = {
  datasets: [],
  selected: null,
  listStatus: "idle",
  detailStatus: "idle",
  deleteStatus: "idle",
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────────

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearSelected(state) { state.selected = null; state.detailStatus = "idle"; },
    clearError(state)    { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending,   (state) => { state.listStatus = "loading"; state.error = null; })
      .addCase(fetchHistory.fulfilled, (state, { payload }) => { state.listStatus = "succeeded"; state.datasets = payload.datasets || []; })
      .addCase(fetchHistory.rejected,  (state, { payload }) => { state.listStatus = "failed"; state.error = payload; })
      .addCase(fetchDataset.pending,   (state) => { state.detailStatus = "loading"; state.error = null; })
      .addCase(fetchDataset.fulfilled, (state, { payload }) => { state.detailStatus = "succeeded"; state.selected = payload.dataset; })
      .addCase(fetchDataset.rejected,  (state, { payload }) => { state.detailStatus = "failed"; state.error = payload; })
      .addCase(deleteDataset.pending,  (state) => { state.deleteStatus = "loading"; })
      .addCase(deleteDataset.fulfilled,(state, { payload }) => { state.deleteStatus = "succeeded"; state.datasets = state.datasets.filter((d) => d._id !== payload); if (state.selected?._id === payload) state.selected = null; })
      .addCase(deleteDataset.rejected, (state, { payload }) => { state.deleteStatus = "failed"; state.error = payload; });
  },
});

// ── Selectors ──────────────────────────────────────────────────────

export const selectDatasets     = (s) => s.history.datasets;
export const selectSelected     = (s) => s.history.selected;
export const selectListStatus   = (s) => s.history.listStatus;
export const selectDetailStatus = (s) => s.history.detailStatus;
export const selectDeleteStatus = (s) => s.history.deleteStatus;
export const selectHistoryError = (s) => s.history.error;

export const { clearSelected, clearError } = historySlice.actions;
export default historySlice.reducer;
