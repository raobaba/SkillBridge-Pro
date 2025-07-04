/**
 * --------------------------------------------------------
 * File        : configureStore.dev.jsx
 * Description : Sets up the Redux store with persistence, middleware, and logging.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses Redux Toolkit for concise and powerful store setup.
 * - Integrates redux-persist to persist state in localStorage.
 * - redux-logger middleware logs actions and state for debugging.
 * - Prevents serialization issues for redux-persist internal actions.
 */


import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers";
import { createLogger } from "redux-logger";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localStorage from "redux-persist/lib/storage";

const loggerMiddleware = createLogger({
  level: "info",
  collapsed: true,
});

const persistConfig = {
  timeout: 5,
  key: "root",
  version: 1,
  storage: localStorage,
  debug: true,
  blacklist: [""],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(loggerMiddleware),
  devTools: true,
});

export default store;
