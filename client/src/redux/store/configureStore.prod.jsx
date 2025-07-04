/**
 * --------------------------------------------------------
 * File        : configureStore.prod.jsx
 * Description : Configures Redux store with persistence, middleware, and logging.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses redux-toolkit's configureStore for simplified setup.
 * - Persists state using redux-persist and localStorage.
 * - Includes redux-logger for development logging.
 * - Handles serialization warnings for redux-persist actions.
 */


import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers";
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

const persistConfig = {
  timeout: 5,
  key: "root",
  version: 1,
  storage: localStorage,
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
    }),
});

export default store;
