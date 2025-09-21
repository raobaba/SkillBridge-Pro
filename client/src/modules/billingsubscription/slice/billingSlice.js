import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // User role and permissions
  userRole: 'developer', // 'developer', 'project_owner', 'admin'
  userPermissions: {
    canViewOwnBilling: true,
    canManageOwnSubscription: true,
    canViewPaymentHistory: true,
    canManagePaymentMethods: true,
    canPurchaseSubscriptions: false,
    canManageProjectVisibility: false,
    canViewDetailedInvoices: false,
    canViewAllBillingReports: false,
    canTrackRevenue: false,
    canHandleDisputes: false,
    canSuspendAccounts: false,
  },
  
  // Subscription data
  currentSubscription: {
    plan: 'free',
    status: 'active',
    aiCredits: 100,
    enhancedTools: false,
    matchmakingBoost: false,
    projectVisibility: 'standard',
    nextBillingDate: null,
    autoRenew: false,
  },
  
  // Billing history
  billingHistory: [],
  
  // Payment methods
  paymentMethods: [],
  
  // Admin-specific data
  adminData: {
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    disputes: [],
    suspendedAccounts: [],
  },
  
  // Project Owner specific data
  projectOwnerData: {
    projectListings: [],
    boostedProjects: [],
    premiumFeatures: [],
  },
  
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
      // Update permissions based on role
      switch (action.payload) {
        case 'developer':
          state.userPermissions = {
            canViewOwnBilling: true,
            canManageOwnSubscription: true,
            canViewPaymentHistory: true,
            canManagePaymentMethods: true,
            canPurchaseSubscriptions: false,
            canManageProjectVisibility: false,
            canViewDetailedInvoices: false,
            canViewAllBillingReports: false,
            canTrackRevenue: false,
            canHandleDisputes: false,
            canSuspendAccounts: false,
          };
          break;
        case 'project_owner':
          state.userPermissions = {
            canViewOwnBilling: true,
            canManageOwnSubscription: true,
            canViewPaymentHistory: true,
            canManagePaymentMethods: true,
            canPurchaseSubscriptions: true,
            canManageProjectVisibility: true,
            canViewDetailedInvoices: true,
            canViewAllBillingReports: false,
            canTrackRevenue: false,
            canHandleDisputes: false,
            canSuspendAccounts: false,
          };
          break;
        case 'admin':
          state.userPermissions = {
            canViewOwnBilling: true,
            canManageOwnSubscription: true,
            canViewPaymentHistory: true,
            canManagePaymentMethods: true,
            canPurchaseSubscriptions: true,
            canManageProjectVisibility: true,
            canViewDetailedInvoices: true,
            canViewAllBillingReports: true,
            canTrackRevenue: true,
            canHandleDisputes: true,
            canSuspendAccounts: true,
          };
          break;
        default:
          break;
      }
    },
    
    updateSubscription: (state, action) => {
      state.currentSubscription = { ...state.currentSubscription, ...action.payload };
    },
    
    updateBillingHistory: (state, action) => {
      state.billingHistory = action.payload;
    },
    
    updatePaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    
    updateAdminData: (state, action) => {
      state.adminData = { ...state.adminData, ...action.payload };
    },
    
    updateProjectOwnerData: (state, action) => {
      state.projectOwnerData = { ...state.projectOwnerData, ...action.payload };
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Developer-specific actions
    updateAICredits: (state, action) => {
      state.currentSubscription.aiCredits = action.payload;
    },
    
    toggleEnhancedTools: (state) => {
      state.currentSubscription.enhancedTools = !state.currentSubscription.enhancedTools;
    },
    
    toggleMatchmakingBoost: (state) => {
      state.currentSubscription.matchmakingBoost = !state.currentSubscription.matchmakingBoost;
    },
    
    // Project Owner specific actions
    updateProjectVisibility: (state, action) => {
      state.currentSubscription.projectVisibility = action.payload;
    },
    
    addBoostedProject: (state, action) => {
      state.projectOwnerData.boostedProjects.push(action.payload);
    },
    
    removeBoostedProject: (state, action) => {
      state.projectOwnerData.boostedProjects = state.projectOwnerData.boostedProjects.filter(
        project => project.id !== action.payload
      );
    },
    
    // Admin specific actions
    addDispute: (state, action) => {
      state.adminData.disputes.push(action.payload);
    },
    
    resolveDispute: (state, action) => {
      state.adminData.disputes = state.adminData.disputes.map(dispute =>
        dispute.id === action.payload ? { ...dispute, status: 'resolved' } : dispute
      );
    },
    
    suspendAccount: (state, action) => {
      state.adminData.suspendedAccounts.push(action.payload);
    },
    
    unsuspendAccount: (state, action) => {
      state.adminData.suspendedAccounts = state.adminData.suspendedAccounts.filter(
        account => account.id !== action.payload
      );
    },
  },
});

export const {
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
} = billingSlice.actions;

export default billingSlice.reducer;
