import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularLoader } from "../components";
import PrivateRoute from "./PrivateRoute";
import AppLogout from "./AppLogout";
import Error404 from "./Error404";
import Unauthorized from "./Unauthorized";

// Lazy loaded pages
const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../modules/dashboard/container"));
const Authentication = lazy(
  () => import("../modules/authentication/container")
);
const VerifyEmail = lazy(
  () => import("../modules/authentication/components/VerifyEmail")
);
const ResetPassword = lazy(
  () => import("../modules/authentication/components/ResetPassword")
);
const ForgotPassword = lazy(
  () => import("../modules/authentication/components/ForgotPassword")
);
const Routing = () => {
  return (
    <Router>
      <AppLogout />
      <Suspense fallback={<CircularLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/dashboard/*'
            element={
              <PrivateRoute screen='DASHBOARD_ACCESS'>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Routing;
