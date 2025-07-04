/**
 * --------------------------------------------------------
 * File        : PrivateRoute.js
 * Description : Custom route wrapper that protects private routes based on
 *               authentication status and user access permissions.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Redirects to `/sign-in` if the user is not authenticated.
 * - Redirects to `/unauthorized` if the user lacks permission for the route.
 * - Requires `screen` prop to match against user's access rights.
 */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/utils";
import { selectUserLoggedIn } from "../modules/sign-in/slice/signinSlice";
import { some } from "lodash";

const PrivateRoute = ({ children, screen }) => {
  const isLoggedIn = useSelector(selectUserLoggedIn);
  const { userData } = useSelector(({ signin }) => signin);
  const jwt_token = getToken();

  if (!isLoggedIn || !jwt_token) {
    const { href, origin } = window.location;
    const redirect_to = encodeURIComponent(href.replace(origin, ""));
    return <Navigate replace to={`/sign-in?redirect_to=${redirect_to}`} />;
  }
  const hasMenuAccess = some(
    userData?.userAccess,
    ({ moduleCode }) => moduleCode === screen,
  );
  if (!hasMenuAccess) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
