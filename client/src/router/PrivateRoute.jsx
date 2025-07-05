import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/utils";
// import { selectUserLoggedIn } from "../modules/sign-in/slice/signinSlice";
import { some } from "lodash";

const PrivateRoute = ({ children, screen }) => {
  const isLoggedIn = true;
  // const { userData } = useSelector(({ signin }) => signin);
  // const jwt_token = getToken();
  const jwt_token = true

  if (!isLoggedIn || !jwt_token) {
    const redirect_to = encodeURIComponent(window.location.pathname);
    return <Navigate to={`/sign-in?redirect_to=${redirect_to}`} replace />;
  }

  // const hasMenuAccess = some(userData?.userAccess, ({ moduleCode }) => moduleCode === screen);
  const hasMenuAccess = true;
  if (screen && !hasMenuAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
