/**
 * Generator Feature — Public API (Barrel Export)
 * Consumers import from here, never from internal sub-folders.
 *
 * Usage:
 *   import { GeneratorPage, useGenerator } from '../features/generator';
 */

// Pages
export { default as GeneratorPage } from "./pages/GeneratorPage";

// Hooks
export { default as useGenerator } from "./hooks/useGenerator";

// Store (selectors + actions — for root store registration and cross-feature use)
export {
  default as generatorReducer,
  generateData,
  previewData,
  setFormField,
  resetForm,
  clearRecords,
  selectGeneratorForm,
  selectGeneratorRecords,
  selectGeneratorStatus,
  selectGeneratorError,
  selectGeneratorSavedId,
  selectGeneratorWarning,
} from "./store/generatorSlice";

// Services (exposed for testing or direct use outside Redux)
export { generatorService } from "./services/generatorService";
