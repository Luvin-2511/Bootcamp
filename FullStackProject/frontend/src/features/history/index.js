/**
 * History Feature — Public API (Barrel Export)
 * Consumers import from here, never from internal sub-folders.
 *
 * Usage:
 *   import { HistoryPage, useHistory } from '../features/history';
 */

// Pages
export { default as HistoryPage } from "./pages/HistoryPage";

// Hooks
export { default as useHistory } from "./hooks/useHistory";

// Store
export {
  default as historyReducer,
  fetchHistory,
  fetchDataset,
  deleteDataset,
  clearSelected,
  clearError,
  selectDatasets,
  selectSelected,
  selectListStatus,
  selectDetailStatus,
  selectDeleteStatus,
  selectHistoryError,
} from "./store/historySlice";

// Services
export { historyService } from "./services/historyService";
