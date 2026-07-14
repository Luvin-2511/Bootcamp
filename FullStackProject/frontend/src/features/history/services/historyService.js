import API from "../../../api/axios";

/**
 * History Feature — Services Layer
 * Raw API calls only. No state, no side effects.
 */
export const historyService = {
  getAll: async () => {
    const { data } = await API.get("/history");
    return data;
  },

  getOne: async (id) => {
    const { data } = await API.get(`/history/${id}`);
    return data;
  },

  remove: async (id) => {
    const { data } = await API.delete(`/history/${id}`);
    return data;
  },
};
