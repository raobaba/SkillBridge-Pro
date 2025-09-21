import React, { useState, useEffect } from "react";
import { useSelector} from "react-redux";
import BillingHistory from "../components/BillingHistory";
import PaymentMethods from "../components/PaymentMethods";
import SubscriptionPlans from "../components/SubscriptionPlans";
import DeveloperDashboard from "../components/DeveloperDashboard";
import ProjectOwnerDashboard from "../components/ProjectOwnerDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Navbar from "../../../components/header";
import { Footer } from "../../../components/Footer";

const BillingSubscription = () => {
  const { user} = useSelector((state) => state.user);
  const [userRole, setUserRole] = useState('developer'); // 'developer', 'project_owner', 'admin'
  const [currentView, setCurrentView] = useState('overview');

  // Static data for different roles
  const roleData = {
    developer: {
      subscription: {
        plan: 'free',
        status: 'active',
        aiCredits: 100,
        enhancedTools: false,
        matchmakingBoost: false,
        nextBillingDate: null,
        autoRenew: false,
      },
      billingHistory: [
        { id: 1, date: "2025-01-01", amount: "$0.00", status: "Free Plan", description: "Free Tier" },
      ],
      paymentMethods: [],
    },
    project_owner: {
      subscription: {
        plan: 'premium',
        status: 'active',
        aiCredits: 1000,
        enhancedTools: true,
        matchmakingBoost: true,
        projectVisibility: 'premium',
        nextBillingDate: '2025-02-01',
        autoRenew: true,
      },
      billingHistory: [
        { id: 1, date: "2025-01-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
        { id: 2, date: "2024-12-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
        { id: 3, date: "2024-11-01", amount: "$15.00", status: "Paid", description: "Project Boost" },
      ],
      paymentMethods: [
        { id: 1, type: "Credit Card", last4: "4242", default: true, brand: "Visa" },
        { id: 2, type: "PayPal", email: "owner@example.com", default: false, brand: "PayPal" },
      ],
      projectListings: [
        { id: 1, name: "E-commerce Platform", visibility: "premium", boosted: true, boostExpires: "2025-02-15" },
        { id: 2, name: "Mobile App", visibility: "standard", boosted: false },
        { id: 3, name: "Web Dashboard", visibility: "premium", boosted: true, boostExpires: "2025-01-30" },
      ],
    },
    admin: {
      subscription: {
        plan: 'admin',
        status: 'active',
        aiCredits: 9999,
        enhancedTools: true,
        matchmakingBoost: true,
        projectVisibility: 'admin',
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
        { id: 1, userId: "user123", amount: 29.99, reason: "Service not as described", status: "pending", date: "2025-01-20" },
        { id: 2, userId: "user456", amount: 99.99, reason: "Billing error", status: "resolved", date: "2025-01-18" },
        { id: 3, userId: "user789", amount: 15.00, reason: "Unauthorized charge", status: "investigating", date: "2025-01-19" },
      ],
      suspendedAccounts: [
        { id: 1, userId: "user999", reason: "Unpaid dues", suspendedAt: "2025-01-15", amount: 89.97 },
        { id: 2, userId: "user888", reason: "Fraudulent activity", suspendedAt: "2025-01-10", amount: 0 },
      ],
    },
  };

  const currentData = roleData[userRole];

  const renderRoleSpecificContent = () => {
    switch (user?.role) {
      case 'developer':
        return <DeveloperDashboard data={currentData} />;
      case 'project-owner':
        return <ProjectOwnerDashboard data={currentData} />;
      case 'admin':
        return <AdminDashboard data={currentData} />;
      default:
        return (
          <>
            <SubscriptionPlans />
            <PaymentMethods />
            <BillingHistory />
          </>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className='p-6 space-y-6'>
        {/* Role Selector */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Billing & Subscription Dashboard</h2>
            <div className="flex gap-2">
              {['developer', 'project_owner', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    userRole === role
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white'
                  }`}
                >
                  {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            Current Role: <span className="text-blue-400 font-semibold">{userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </p>
        </div>

        {/* Role-specific content */}
        {renderRoleSpecificContent()}
      </div>
      <Footer />
    </>
  );
};

export default BillingSubscription;
