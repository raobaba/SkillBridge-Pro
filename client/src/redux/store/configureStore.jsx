/**
 * --------------------------------------------------------
 * File        : configureStore.js
 * Description : Redux store configuration file for both development and production.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses Redux Toolkit for simplified store configuration.
 * - Integrates redux-persist to enable state persistence in localStorage.
 * - Includes redux-logger for development logging (can be toggled).
 * - Prevents serialization warnings for redux-persist actions.
 * - The commented conditional export can be used to split dev/prod configs.
 */


// if (process.env.REACT_APP_ENABLE_REDUX_LOG === "false") {
//   module.exports = require("../store/configureStore.prod");
// } else {
//   module.exports = require("../store/configureStore.dev");
// }

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
