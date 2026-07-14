import API from "../../../api/axios";

/**
 * Generator Feature — Services Layer
 * Raw API calls only. No state, no side effects.
 */
export const generatorService = {
  generate: async ({ type, count, locale, name, save = false, exportFormat = "json" }) => {
    const { data } = await API.post("/generate", {
      type,
      count,
      locale,
      name: name || `${type}_${Date.now()}`,
      save,
      exportFormat,
    });
    return data;
  },

  preview: async ({ type = "users", count = 5, locale = "en" }) => {
    const { data } = await API.get("/generate/preview", {
      params: { type, count, locale },
    });
    return data;
  },
};
