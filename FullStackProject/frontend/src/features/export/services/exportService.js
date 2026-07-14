import API from "../../../api/axios";

/**
 * Export Feature — Services Layer
 * Raw API calls only. Returns a Blob for file download.
 */
export const exportService = {
  exportData: async ({ type, count, locale, format, datasetId }) => {
    const ext = format === "excel" ? "xlsx" : format;
    const filename = `${datasetId ? "dataset" : type}_data.${ext}`;

    const { data: blob } = await API.post(
      "/export",
      { type, count, locale, format, datasetId },
      { responseType: "blob" }
    );

    return { blob, filename };
  },
};

/**
 * Utility: trigger browser file download from a Blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
