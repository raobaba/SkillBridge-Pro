import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBillingDataApi,
  getSubscriptionPlansApi,
  purchaseSubscriptionApi,
  cancelSubscriptionApi,
  upgradeProjectVisibilityApi,
  getPaymentMethodsApi,
  addPaymentMethodApi,
  deletePaymentMethodApi,
  setDefaultPaymentMethodApi,
  createDisputeApi,
  getDisputesApi,
  resolveDisputeApi,
  getSuspendedAccountsApi,
  suspendAccountApi,
  unsuspendAccountApi,
  getAdminDashboardApi,
} from './billingAction';

const initialState = {
  // User role and permissions
  userRole: 'developer', // 'developer', 'project_owner', 'admin'
  userPermissions: {
    canViewOwnBilling: true,
    canManageOwnSubscription: true,
    canViewPaymentHistory: true,
    canManagePaymentMethods: true,
    canPurchaseSubscriptions: true,
    canManageProjectVisibility: false,
    canViewDetailedInvoices: true,
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
  
  // Subscription plans
  subscriptionPlans: [],
  
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

// Async Thunks
export const getBillingData = createAsyncThunk(
  'billing/getBillingData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBillingDataApi();
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch billing data',
      });
    }
  }
);

export const getSubscriptionPlans = createAsyncThunk(
  'billing/getSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionPlansApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch subscription plans',
      });
    }
  }
);

export const purchaseSubscription = createAsyncThunk(
  'billing/purchaseSubscription',
  async ({ planId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await purchaseSubscriptionApi(planId, paymentMethodId);
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to purchase subscription',
      });
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'billing/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cancelSubscriptionApi();
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to cancel subscription',
      });
    }
  }
);

export const upgradeProjectVisibility = createAsyncThunk(
  'billing/upgradeProjectVisibility',
  async ({ projectId, visibilityType }, { rejectWithValue }) => {
    try {
      const response = await upgradeProjectVisibilityApi(projectId, visibilityType);
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to upgrade project visibility',
      });
    }
  }
);

export const getPaymentMethods = createAsyncThunk(
  'billing/getPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentMethodsApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch payment methods',
      });
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'billing/addPaymentMethod',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await addPaymentMethodApi(paymentMethodData);
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to add payment method',
      });
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'billing/deletePaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const response = await deletePaymentMethodApi(paymentMethodId);
      return response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to delete payment method',
      });
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'billing/setDefaultPaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const response = await setDefaultPaymentMethodApi(paymentMethodId);
      return response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to set default payment method',
      });
    }
  }
);

export const createDispute = createAsyncThunk(
  'billing/createDispute',
  async (disputeData, { rejectWithValue }) => {
    try {
      const response = await createDisputeApi(disputeData);
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to create dispute',
      });
    }
  }
);

export const getDisputes = createAsyncThunk(
  'billing/getDisputes',
  async (status = null, { rejectWithValue }) => {
    try {
      const response = await getDisputesApi(status);
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch disputes',
      });
    }
  }
);

export const resolveDispute = createAsyncThunk(
  'billing/resolveDispute',
  async ({ disputeId, resolution }, { rejectWithValue }) => {
    try {
      const response = await resolveDisputeApi(disputeId, resolution);
      return { disputeId, ...response?.data?.data || response?.data || {} };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to resolve dispute',
      });
    }
  }
);

export const getSuspendedAccounts = createAsyncThunk(
  'billing/getSuspendedAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSuspendedAccountsApi();
      return response?.data?.data || response?.data || [];
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch suspended accounts',
      });
    }
  }
);

export const suspendAccount = createAsyncThunk(
  'billing/suspendAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await suspendAccountApi(accountData);
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to suspend account',
      });
    }
  }
);

export const unsuspendAccount = createAsyncThunk(
  'billing/unsuspendAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await unsuspendAccountApi(accountId);
      return { accountId, ...response?.data?.data || response?.data || {} };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to unsuspend account',
      });
    }
  }
);

export const getAdminDashboard = createAsyncThunk(
  'billing/getAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminDashboardApi();
      return response?.data?.data || response?.data || {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch admin dashboard',
      });
    }
  }
);

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
            canPurchaseSubscriptions: true,
            canManageProjectVisibility: false,
            canViewDetailedInvoices: true,
            canViewAllBillingReports: false,
            canTrackRevenue: false,
            canHandleDisputes: false,
            canSuspendAccounts: false,
          };
          break;
        case 'project_owner':
        case 'project-owner':
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
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Billing Data
    builder
      .addCase(getBillingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillingData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (data.subscription) {
          state.currentSubscription = { ...state.currentSubscription, ...data.subscription };
        }
        if (data.billingHistory) {
          state.billingHistory = data.billingHistory;
        }
        if (data.paymentMethods) {
          state.paymentMethods = data.paymentMethods;
        }
        if (data.adminData) {
          state.adminData = { ...state.adminData, ...data.adminData };
        }
        if (data.projectOwnerData) {
          state.projectOwnerData = { ...state.projectOwnerData, ...data.projectOwnerData };
        }
      })
      .addCase(getBillingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch billing data';
      });

    // Get Subscription Plans
    builder
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlans = action.payload;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch subscription plans';
      });

    // Purchase Subscription
    builder
      .addCase(purchaseSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.subscription) {
          state.currentSubscription = { ...state.currentSubscription, ...action.payload.subscription };
        }
        if (action.payload.billingHistory) {
          state.billingHistory = [action.payload.billingHistory, ...state.billingHistory];
        }
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to purchase subscription';
      });

    // Cancel Subscription
    builder
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.subscription) {
          state.currentSubscription = { ...state.currentSubscription, ...action.payload.subscription };
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel subscription';
      });

    // Upgrade Project Visibility
    builder
      .addCase(upgradeProjectVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeProjectVisibility.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.boostedProject) {
          state.projectOwnerData.boostedProjects.push(action.payload.boostedProject);
        }
        if (action.payload.billingHistory) {
          state.billingHistory = [action.payload.billingHistory, ...state.billingHistory];
        }
      })
      .addCase(upgradeProjectVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upgrade project visibility';
      });

    // Get Payment Methods
    builder
      .addCase(getPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payment methods';
      });

    // Add Payment Method
    builder
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh payment methods
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add payment method';
      });

    // Delete Payment Method
    builder
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state) => {
        state.loading = false;
        // Refresh payment methods
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete payment method';
      });

    // Set Default Payment Method
    builder
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state) => {
        state.loading = false;
        // Refresh payment methods
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to set default payment method';
      });

    // Create Dispute
    builder
      .addCase(createDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.disputes.push(action.payload);
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create dispute';
      });

    // Get Disputes
    builder
      .addCase(getDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.disputes = action.payload;
      })
      .addCase(getDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch disputes';
      });

    // Resolve Dispute
    builder
      .addCase(resolveDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.disputes = state.adminData.disputes.map(dispute =>
          dispute.id === action.payload.disputeId ? { ...dispute, ...action.payload } : dispute
        );
      })
      .addCase(resolveDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to resolve dispute';
      });

    // Get Suspended Accounts
    builder
      .addCase(getSuspendedAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuspendedAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.suspendedAccounts = action.payload;
      })
      .addCase(getSuspendedAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch suspended accounts';
      });

    // Suspend Account
    builder
      .addCase(suspendAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.suspendedAccounts.push(action.payload);
      })
      .addCase(suspendAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to suspend account';
      });

    // Unsuspend Account
    builder
      .addCase(unsuspendAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsuspendAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData.suspendedAccounts = state.adminData.suspendedAccounts.filter(
          account => account.id !== action.payload.accountId
        );
      })
      .addCase(unsuspendAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to unsuspend account';
      });

    // Get Admin Dashboard
    builder
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = { ...state.adminData, ...action.payload };
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch admin dashboard';
      });
  },
});

export const {
  setUserRole,
  clearError,
} = billingSlice.actions;

export default billingSlice.reducer;
