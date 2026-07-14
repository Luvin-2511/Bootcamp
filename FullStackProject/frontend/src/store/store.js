import { configureStore } from "@reduxjs/toolkit";
import { generatorReducer } from "../features/generator";
import { historyReducer }   from "../features/history";
import { exportReducer }    from "../features/export";

/**
 * Root Redux Store
 * Imports reducers via each feature's barrel index.js — never direct slice paths.
 */
const store = configureStore({
  reducer: {
    generator: generatorReducer,
    history:   historyReducer,
    export:    exportReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
