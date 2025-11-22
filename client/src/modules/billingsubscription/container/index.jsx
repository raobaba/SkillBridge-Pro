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

  // Prepare data for components from Redux state
  const currentData = {
    subscription: billingState.currentSubscription || {},
    billingHistory: billingState.billingHistory || [],
    paymentMethods: billingState.paymentMethods || [],
    ...(userRole === 'admin' && { adminData: billingState.adminData || {} }),
    ...((userRole === 'project-owner' || userRole === 'project_owner') && { 
      projectOwnerData: billingState.projectOwnerData || {} 
    }),
  };

  // Fallback static data if Redux state is empty (for initial load)
  const fallbackData = {
    developer: {
      subscription: {
        plan: "free",
        status: "active",
        aiCredits: 100,
        enhancedTools: false,
        matchmakingBoost: false,
        nextBillingDate: null,
        autoRenew: false,
      },
      billingHistory: [
        {
          id: 1,
          date: "2025-01-01",
          amount: "$0.00",
          status: "Free Plan",
          description: "Free Tier",
        },
      ],
      paymentMethods: [],
    },
    project_owner: {
      subscription: {
        plan: "premium",
        status: "active",
        aiCredits: 1000,
        enhancedTools: true,
        matchmakingBoost: true,
        projectVisibility: "premium",
        nextBillingDate: "2025-02-01",
        autoRenew: true,
      },
      billingHistory: [
        {
          id: 1,
          date: "2025-01-01",
          amount: "$29.99",
          status: "Paid",
          description: "Premium Plan",
        },
        {
          id: 2,
          date: "2024-12-01",
          amount: "$29.99",
          status: "Paid",
          description: "Premium Plan",
        },
        {
          id: 3,
          date: "2024-11-01",
          amount: "$15.00",
          status: "Paid",
          description: "Project Boost",
        },
      ],
      paymentMethods: [
        {
          id: 1,
          type: "Credit Card",
          last4: "4242",
          default: true,
          brand: "Visa",
        },
        {
          id: 2,
          type: "PayPal",
          email: "owner@example.com",
          default: false,
          brand: "PayPal",
        },
      ],
      projectListings: [
        {
          id: 1,
          name: "E-commerce Platform",
          visibility: "premium",
          boosted: true,
          boostExpires: "2025-02-15",
        },
        { id: 2, name: "Mobile App", visibility: "standard", boosted: false },
        {
          id: 3,
          name: "Web Dashboard",
          visibility: "premium",
          boosted: true,
          boostExpires: "2025-01-30",
        },
      ],
    },
    admin: {
      subscription: {
        plan: "admin",
        status: "active",
        aiCredits: 9999,
        enhancedTools: true,
        matchmakingBoost: true,
        projectVisibility: "admin",
        nextBillingDate: null,
        autoRenew: false,
      },
      billingHistory: [],
      paymentMethods: [],
      adminStats: {
        totalRevenue: 125000,
        activeSubscriptions: 1250,
        pendingPayments: 15,
        disputes: 3,
        suspendedAccounts: 2,
      },
      disputes: [
        {
          id: 1,
          userId: "user123",
          amount: 29.99,
          reason: "Service not as described",
          status: "pending",
          date: "2025-01-20",
        },
        {
          id: 2,
          userId: "user456",
          amount: 99.99,
          reason: "Billing error",
          status: "resolved",
          date: "2025-01-18",
        },
        {
          id: 3,
          userId: "user789",
          amount: 15.0,
          reason: "Unauthorized charge",
          status: "investigating",
          date: "2025-01-19",
        },
      ],
      suspendedAccounts: [
        {
          id: 1,
          userId: "user999",
          reason: "Unpaid dues",
          suspendedAt: "2025-01-15",
          amount: 89.97,
        },
        {
          id: 2,
          userId: "user888",
          reason: "Fraudulent activity",
          suspendedAt: "2025-01-10",
          amount: 0,
        },
      ],
    },
  };

  // Use Redux data if available and not empty, otherwise use fallback
  const hasReduxData = billingState.currentSubscription && Object.keys(billingState.currentSubscription).length > 0;
  const displayData = hasReduxData ? currentData : (fallbackData[roleKey] || fallbackData.developer);

  const renderRoleSpecificContent = () => {
    if (billingState.loading) {
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
