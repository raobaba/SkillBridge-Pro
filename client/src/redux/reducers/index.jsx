import { combineReducers } from "redux";
import localStorage from "redux-persist/lib/storage";
import userReducer from "../../modules/authentication/slice/userSlice"

const appReducer = combineReducers({
  user: userReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "signin/logout") {
    localStorage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};
