import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generatorService } from "../services/generatorService";

// ── Async Thunks ───────────────────────────────────────────────────

export const generateData = createAsyncThunk(
  "generator/generateData",
  async (params, { rejectWithValue }) => {
    try {
      return await generatorService.generate(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Generation failed");
    }
  }
);

export const previewData = createAsyncThunk(
  "generator/previewData",
  async (params, { rejectWithValue }) => {
    try {
      return await generatorService.preview(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Preview failed");
    }
  }
);

// ── Initial State ──────────────────────────────────────────────────

const initialState = {
  form: {
    type: "users",
    count: 10,
    locale: "en",
    name: "",
    save: false,
    exportFormat: "json",
  },
  records: [],
  status: "idle",   // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  savedId: null,
  warning: null,
};

// ── Slice ──────────────────────────────────────────────────────────

const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    setFormField(state, { payload: { field, value } }) {
      state.form[field] = value;
      state.error = null;
      state.warning = null;
      state.savedId = null;
    },
    resetForm(state) {
      Object.assign(state, initialState);
    },
    clearRecords(state) {
      state.records = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateData.pending,   (state) => { state.status = "loading"; state.error = null; state.savedId = null; state.warning = null; })
      .addCase(generateData.fulfilled, (state, { payload }) => { state.status = "succeeded"; state.records = payload.data || []; state.savedId = payload.id || null; state.warning = payload.warning || null; })
      .addCase(generateData.rejected,  (state, { payload }) => { state.status = "failed"; state.error = payload; })
      .addCase(previewData.pending,    (state) => { state.status = "loading"; state.error = null; })
      .addCase(previewData.fulfilled,  (state, { payload }) => { state.status = "succeeded"; state.records = payload.data || []; })
      .addCase(previewData.rejected,   (state, { payload }) => { state.status = "failed"; state.error = payload; });
  },
});

// ── Selectors ──────────────────────────────────────────────────────

export const selectGeneratorForm    = (s) => s.generator.form;
export const selectGeneratorRecords = (s) => s.generator.records;
export const selectGeneratorStatus  = (s) => s.generator.status;
export const selectGeneratorError   = (s) => s.generator.error;
export const selectGeneratorSavedId = (s) => s.generator.savedId;
export const selectGeneratorWarning = (s) => s.generator.warning;

export const { setFormField, resetForm, clearRecords } = generatorSlice.actions;
export default generatorSlice.reducer;
