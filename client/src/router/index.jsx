import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularLoader } from "../components";
import PrivateRoute from "./PrivateRoute";
import Error404 from "./Error404";
import Unauthorized from "./Unauthorized";

// Lazy loaded pages
const Home = lazy(() => import("../modules/home/container"));
const Dashboard = lazy(() => import("../modules/dashboard/container"));
const Profile = lazy(() => import("../modules/profile/container"));
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
const Notifications = lazy(() => import("../modules/notifications/container"));
const Settings = lazy(() => import("../modules/settings/container"));
const PortfolioSync = lazy(() => import("../modules/portfolioSync/container"));
const Project = lazy(() => import("../modules/project/container"));
const Matchmaking = lazy(() => import("../modules/matchmaking/container"));
const Gamification = lazy(() => import("../modules/gamification/container"));
const Chat = lazy(() => import("../modules/chat/container"));
const BillingSubscription = lazy(() =>
  import("../modules/billingsubscription/container")
);
const AiCareer = lazy(() => import("../modules/aicareer/container"));


const Routing = () => {
  return (
    <Router>
      <Suspense fallback={<CircularLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          
          {/* Protected Routes - All under /dashboard */}
          <Route
            path='/dashboard'
            element={
              <PrivateRoute screen='DASHBOARD_ACCESS'>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute screen='PROFILE_ACCESS'>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path='/notifications'
            element={
              <PrivateRoute screen='NOTIFICATIONS_ACCESS'>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <PrivateRoute screen='SETTINGS_ACCESS'>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path='/portfolio-sync'
            element={
              <PrivateRoute screen='PORTFOLIO_ACCESS'>
                <PortfolioSync />
              </PrivateRoute>
            }
          />
          <Route
            path='/project'
            element={
              <PrivateRoute screen='PROJECT_ACCESS'>
                <Project />
              </PrivateRoute>
            }
          />
          <Route
            path='/matchmaking'
            element={
              <PrivateRoute screen='MATCHMAKING_ACCESS'>
                <Matchmaking />
              </PrivateRoute>
            }
          />
          <Route
            path='/gamification'
            element={
              <PrivateRoute screen='GAMIFICATION_ACCESS'>
                <Gamification />
              </PrivateRoute>
            }
          />
          <Route
            path='/chat'
            element={
              <PrivateRoute screen='CHAT_ACCESS'>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path='/billing-subscription'
            element={
              <PrivateRoute screen='BILLING_ACCESS'>
                <BillingSubscription />
              </PrivateRoute>
            }
          />
          <Route
            path='/ai-career'
            element={
              <PrivateRoute screen='AI_CAREER_ACCESS'>
                <AiCareer />
              </PrivateRoute>
            }
          />

          {/* Error Routes */}
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Routing;
