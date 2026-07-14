import { useDispatch, useSelector } from "react-redux";
import {
  selectGeneratorForm,
  selectGeneratorRecords,
  selectGeneratorStatus,
  selectGeneratorError,
  selectGeneratorSavedId,
  selectGeneratorWarning,
  setFormField,
  resetForm,
  clearRecords,
  generateData,
  previewData,
} from "../store/generatorSlice";

/**
 * Generator Feature — Hooks Layer
 * Bridges Redux state → UI. Components never import slices directly.
 */
const useGenerator = () => {
  const dispatch = useDispatch();

  const form    = useSelector(selectGeneratorForm);
  const records = useSelector(selectGeneratorRecords);
  const status  = useSelector(selectGeneratorStatus);
  const error   = useSelector(selectGeneratorError);
  const savedId = useSelector(selectGeneratorSavedId);
  const warning = useSelector(selectGeneratorWarning);

  const isLoading   = status === "loading";
  const isSucceeded = status === "succeeded";

  const updateField = (field, value) => dispatch(setFormField({ field, value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateField(name, type === "checkbox" ? checked : value);
  };

  const generate = ()                    => dispatch(generateData(form));
  const preview  = (count = 5)           => dispatch(previewData({ type: form.type, count, locale: form.locale }));
  const reset    = ()                    => dispatch(resetForm());
  const clear    = ()                    => dispatch(clearRecords());

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return { form, records, columns, status, isLoading, isSucceeded, error, savedId, warning, updateField, handleChange, generate, preview, reset, clear };
};

export default useGenerator;
