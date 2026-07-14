import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDatasets,
  selectSelected,
  selectListStatus,
  selectDetailStatus,
  selectDeleteStatus,
  selectHistoryError,
  clearSelected,
  clearError,
  fetchHistory,
  fetchDataset,
  deleteDataset,
} from "../store/historySlice";
// Cross-feature: export action dispatched from history hook
import { exportDataset } from "../../export/store/exportSlice";

/**
 * History Feature — Hooks Layer
 * Bridges Redux state → UI. Components never import slices directly.
 */
const useHistory = ({ autoFetch = true } = {}) => {
  const dispatch = useDispatch();

  const datasets     = useSelector(selectDatasets);
  const selected     = useSelector(selectSelected);
  const listStatus   = useSelector(selectListStatus);
  const detailStatus = useSelector(selectDetailStatus);
  const deleteStatus = useSelector(selectDeleteStatus);
  const error        = useSelector(selectHistoryError);

  const isListLoading   = listStatus === "loading";
  const isDetailLoading = detailStatus === "loading";

  useEffect(() => {
    if (autoFetch && listStatus === "idle") {
      dispatch(fetchHistory());
    }
  }, [autoFetch, listStatus, dispatch]);

  const refresh       = ()         => dispatch(fetchHistory());
  const viewDataset   = (id)       => dispatch(fetchDataset(id));
  const removeDataset = (id)       => { if (window.confirm("Delete this dataset?")) dispatch(deleteDataset(id)); };
  const downloadDataset = (dataset, format) => dispatch(exportDataset({ datasetId: dataset._id, format, type: dataset.type }));
  const deselect      = ()         => dispatch(clearSelected());
  const dismissError  = ()         => dispatch(clearError());

  // Derived stats
  const totalRecords    = datasets.reduce((s, d) => s + (d.count || 0), 0);
  const uniqueTypes     = [...new Set(datasets.map((d) => d.type))];
  const typeCounts      = datasets.reduce((acc, d) => { acc[d.type] = (acc[d.type] || 0) + 1; return acc; }, {});
  const selectedColumns = selected?.data?.length > 0 ? Object.keys(selected.data[0]) : [];

  return { datasets, selected, selectedColumns, listStatus, detailStatus, deleteStatus, isListLoading, isDetailLoading, error, totalRecords, uniqueTypes, typeCounts, refresh, viewDataset, removeDataset, downloadDataset, deselect, dismissError };
};

export default useHistory;
