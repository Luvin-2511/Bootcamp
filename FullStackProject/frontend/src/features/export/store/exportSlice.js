import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exportService, downloadBlob } from "../services/exportService";

// ── Async Thunk ────────────────────────────────────────────────────

export const exportDataset = createAsyncThunk(
  "export/exportDataset",
  async (params, { rejectWithValue }) => {
    try {
      const { blob, filename } = await exportService.exportData(params);
      downloadBlob(blob, filename);
      return { filename, format: params.format };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Export failed. Make sure the backend is running."
      );
    }
  }
);

// ── Initial State ──────────────────────────────────────────────────

const initialState = {
  form: { type: "users", count: 10, locale: "en", format: "json" },
  status: "idle",
  error: null,
  lastExport: null,
};

// ── Slice ──────────────────────────────────────────────────────────

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    setExportField(state, { payload: { field, value } }) {
      state.form[field] = value;
      state.error = null;
      state.lastExport = null;
      if (state.status === "succeeded" || state.status === "failed") state.status = "idle";
    },
    resetExport(state) {
      state.status = "idle";
      state.error = null;
      state.lastExport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportDataset.pending,   (state) => { state.status = "loading"; state.error = null; state.lastExport = null; })
      .addCase(exportDataset.fulfilled, (state, { payload }) => { state.status = "succeeded"; state.lastExport = payload; })
      .addCase(exportDataset.rejected,  (state, { payload }) => { state.status = "failed"; state.error = payload; });
  },
});

// ── Selectors ──────────────────────────────────────────────────────

export const selectExportForm   = (s) => s.export.form;
export const selectExportStatus = (s) => s.export.status;
export const selectExportError  = (s) => s.export.error;
export const selectLastExport   = (s) => s.export.lastExport;

export const { setExportField, resetExport } = exportSlice.actions;
export default exportSlice.reducer;
