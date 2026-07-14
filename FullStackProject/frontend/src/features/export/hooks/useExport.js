import { useDispatch, useSelector } from "react-redux";
import {
  selectExportForm,
  selectExportStatus,
  selectExportError,
  selectLastExport,
  setExportField,
  resetExport,
  exportDataset,
} from "../store/exportSlice";

/**
 * Export Feature — Hooks Layer
 * Bridges Redux state → UI. Components never import slices directly.
 */
const useExport = () => {
  const dispatch = useDispatch();

  const form       = useSelector(selectExportForm);
  const status     = useSelector(selectExportStatus);
  const error      = useSelector(selectExportError);
  const lastExport = useSelector(selectLastExport);

  const isLoading   = status === "loading";
  const isSucceeded = status === "succeeded";

  const updateField   = (field, value)  => dispatch(setExportField({ field, value }));
  const handleChange  = (e)             => updateField(e.target.name, e.target.value);
  const doExport      = ()              => dispatch(exportDataset({ type: form.type, count: parseInt(form.count), locale: form.locale, format: form.format }));
  const exportSaved   = (dataset, fmt)  => dispatch(exportDataset({ datasetId: dataset._id, format: fmt, type: dataset.type }));
  const reset         = ()              => dispatch(resetExport());

  return { form, status, isLoading, isSucceeded, error, lastExport, updateField, handleChange, doExport, exportSaved, reset };
};

export default useExport;
