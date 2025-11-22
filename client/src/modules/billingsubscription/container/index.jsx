import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BillingHistory from "../components/BillingHistory";
import PaymentMethods from "../components/PaymentMethods";
import SubscriptionPlans from "../components/SubscriptionPlans";
import DeveloperBillSubsDash from "../components/DeveloperBillSubsDash";
import ProjectOwnBillSubsDash from "../components/ProjectOwnBillSubsDash";
import AdminBillSubsDash from "../components/AdminBillSubsDash";
import Navbar from "../../../components/header";
import { Footer, CircularLoader } from "../../../components";
import { getBillingData, setUserRole } from "../slice/billingSlice";

const BillingSubscription = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const billingState = useSelector((state) => state.billing || {});
  const [currentView, setCurrentView] = useState("overview");

  // Determine user role from Redux user state
  const userRole = user?.role || 'developer';
  const roleKey = userRole === 'project-owner' ? 'project_owner' : userRole;

  // Initialize billing data when component mounts or user changes
  useEffect(() => {
    if (user?.role) {
      dispatch(setUserRole(userRole));
      dispatch(getBillingData());
    }
  }, [user?.role, dispatch, userRole]);

  // Prepare data for components from Redux state only - no static fallback
  const currentData = {
    subscription: billingState.currentSubscription || {},
    billingHistory: billingState.billingHistory || [],
    paymentMethods: billingState.paymentMethods || [],
    ...(userRole === 'admin' && { adminData: billingState.adminData || {} }),
    ...((userRole === 'project-owner' || userRole === 'project_owner') && { 
      projectOwnerData: billingState.projectOwnerData || {} 
    }),
  };

  // Use Redux data only - no static fallback
  const displayData = currentData;

  const renderRoleSpecificContent = () => {
    if (billingState.loading && !billingState.currentSubscription) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <CircularLoader />
        </div>
      );
    }

    switch (userRole) {
      case "developer":
        return <DeveloperBillSubsDash data={displayData} />;
      case "project-owner":
      case "project_owner":
        return <ProjectOwnBillSubsDash data={displayData} />;
      case "admin":
        return <AdminBillSubsDash data={displayData} />;
      default:
        return (
          <>
            <SubscriptionPlans userRole={userRole} />
            <PaymentMethods userRole={userRole} paymentMethods={displayData.paymentMethods || []} />
            <BillingHistory userRole={userRole} billingHistory={displayData.billingHistory || []} />
          </>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='space-y-6'>
            {/* Header */}
            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>
                    Billing & Subscription Dashboard
                  </h2>
                </div>
              </div>
            </div>

            {/* Subscription Plans - Show for all users */}
            <SubscriptionPlans userRole={userRole} />

            {/* Role-specific content */}
            {renderRoleSpecificContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BillingSubscription;
