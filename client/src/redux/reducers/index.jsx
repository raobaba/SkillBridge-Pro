import { combineReducers } from "redux";
import localStorage from "redux-persist/lib/storage";
import userReducer from "../../modules/authentication/slice/userSlice";
import projectReducer from "../../modules/project/slice/projectSlice";
import profileReducer from "../../modules/profile/slice/profileSlice";

const appReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  profile: profileReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "signin/logout") {
    localStorage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};
