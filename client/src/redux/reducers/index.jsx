

import { combineReducers } from "redux";
import localStorage from "redux-persist/lib/storage";

const appReducer = combineReducers({

});

export const rootReducer = (state, action) => {
  if (action.type === "signin/logout") {
    // this applies to all keys defined in persistConfig(s)
    localStorage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};
