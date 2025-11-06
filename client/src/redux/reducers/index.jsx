import { combineReducers } from "redux";
import localStorage from "redux-persist/lib/storage";
import userReducer from "../../modules/authentication/slice/userSlice";
import projectReducer from "../../modules/project/slice/projectSlice";
import profileReducer from "../../modules/profile/slice/profileSlice";
import settingsReducer from "../../modules/settings/slice/settingsSlice";
import gamificationReducer from "../../modules/gamification/slice/gamificationSlice";
import chatReducer from "../../modules/chat/slice/chatSlice";
import notificationReducer from "../../modules/notifications/slice/notificationSlice";

const appReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  profile: profileReducer,
  settings: settingsReducer,
  gamification: gamificationReducer,
  chat: chatReducer,
  notifications: notificationReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "signin/logout") {
    localStorage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};
