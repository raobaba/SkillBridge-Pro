import {
  setUserRole,
  updateSubscription,
  updateBillingHistory,
  updatePaymentMethods,
  updateAdminData,
  updateProjectOwnerData,
  setLoading,
  setError,
  updateAICredits,
  toggleEnhancedTools,
  toggleMatchmakingBoost,
  updateProjectVisibility,
  addBoostedProject,
  removeBoostedProject,
  addDispute,
  resolveDispute,
  suspendAccount,
  unsuspendAccount,
} from './billingSlice';

// Async action creators
export const initializeBillingData = (userRole) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setUserRole(userRole));
    
    // Simulate API calls based on user role
    const mockData = await fetchBillingData(userRole);
    
    dispatch(updateSubscription(mockData.subscription));
    dispatch(updateBillingHistory(mockData.billingHistory));
    dispatch(updatePaymentMethods(mockData.paymentMethods));
    
    if (userRole === 'admin') {
      dispatch(updateAdminData(mockData.adminData));
    } else if (userRole === 'project_owner') {
      dispatch(updateProjectOwnerData(mockData.projectOwnerData));
    }
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const purchaseSubscription = (planId, paymentMethodId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call
    const response = await mockPurchaseSubscription(planId, paymentMethodId);
    
    dispatch(updateSubscription(response.subscription));
    dispatch(updateBillingHistory(response.billingHistory));
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const upgradeProjectVisibility = (projectId, visibilityType) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call
    const response = await mockUpgradeProjectVisibility(projectId, visibilityType);
    
    dispatch(updateProjectVisibility(visibilityType));
    dispatch(addBoostedProject(response.boostedProject));
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const handleDispute = (disputeData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call
    const response = await mockHandleDispute(disputeData);
    
    dispatch(addDispute(response.dispute));
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

// Mock API functions
const fetchBillingData = async (userRole) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const baseData = {
    subscription: {
      plan: userRole === 'developer' ? 'free' : 'premium',
      status: 'active',
      aiCredits: userRole === 'developer' ? 100 : 1000,
      enhancedTools: userRole !== 'developer',
      matchmakingBoost: userRole === 'project_owner',
      projectVisibility: userRole === 'project_owner' ? 'premium' : 'standard',
      nextBillingDate: userRole !== 'developer' ? '2025-02-01' : null,
      autoRenew: userRole !== 'developer',
    },
    billingHistory: [
      { id: 1, date: "2025-01-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
      { id: 2, date: "2024-12-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
    ],
    paymentMethods: [
      { id: 1, type: "Credit Card", last4: "4242", default: true, brand: "Visa" },
    ],
  };
  
  if (userRole === 'admin') {
    baseData.adminData = {
      totalRevenue: 125000,
      activeSubscriptions: 1250,
      pendingPayments: 15,
      disputes: [
        { id: 1, userId: "user123", amount: 29.99, reason: "Service not as described", status: "pending" },
        { id: 2, userId: "user456", amount: 99.99, reason: "Billing error", status: "resolved" },
      ],
      suspendedAccounts: [
        { id: 1, userId: "user789", reason: "Unpaid dues", suspendedAt: "2025-01-15" },
      ],
    };
  } else if (userRole === 'project_owner') {
    baseData.projectOwnerData = {
      projectListings: [
        { id: 1, name: "E-commerce Platform", visibility: "premium", boosted: true },
        { id: 2, name: "Mobile App", visibility: "standard", boosted: false },
      ],
      boostedProjects: [
        { id: 1, name: "E-commerce Platform", boostType: "premium", expiresAt: "2025-02-15" },
      ],
      premiumFeatures: ["Advanced Analytics", "Priority Support", "Custom Branding"],
    };
  }
  
  return baseData;
};

const mockPurchaseSubscription = async (planId, paymentMethodId) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    subscription: {
      plan: planId === 1 ? 'basic' : planId === 2 ? 'premium' : 'enterprise',
      status: 'active',
      aiCredits: planId === 1 ? 500 : planId === 2 ? 1000 : 5000,
      enhancedTools: true,
      matchmakingBoost: planId >= 2,
      projectVisibility: planId >= 2 ? 'premium' : 'standard',
      nextBillingDate: '2025-02-01',
      autoRenew: true,
    },
    billingHistory: [
      { id: 3, date: "2025-01-21", amount: planId === 1 ? "$9.99" : planId === 2 ? "$29.99" : "$99.99", status: "Paid", description: "Subscription Payment" },
    ],
  };
};

const mockUpgradeProjectVisibility = async (projectId, visibilityType) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    boostedProject: {
      id: projectId,
      name: "Sample Project",
      boostType: visibilityType,
      expiresAt: "2025-02-15",
    },
  };
};

const mockHandleDispute = async (disputeData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    dispute: {
      id: Date.now(),
      ...disputeData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  };
};
