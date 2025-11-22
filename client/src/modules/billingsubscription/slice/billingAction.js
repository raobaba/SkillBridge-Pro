// Billing Action - Connected to Backend APIs
import fetchFromApiServer from "../../../services/api";

/**
 * Get billing data for current user
 */
export const getBillingDataApi = async () => {
  const url = `api/v1/user/billing`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Get available subscription plans
 */
export const getSubscriptionPlansApi = async () => {
  const url = `api/v1/user/billing/subscription-plans`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Purchase a subscription plan
 */
export const purchaseSubscriptionApi = async (planId, paymentMethodId = null) => {
  const url = `api/v1/user/billing/subscription/purchase`;
  return await fetchFromApiServer("POST", url, {
    planId,
    paymentMethodId,
  });
};

/**
 * Cancel current subscription
 */
export const cancelSubscriptionApi = async () => {
  const url = `api/v1/user/billing/subscription/cancel`;
  return await fetchFromApiServer("POST", url);
};

/**
 * Upgrade project visibility (Project Owners)
 */
export const upgradeProjectVisibilityApi = async (projectId, visibilityType) => {
  const url = `api/v1/user/billing/project/upgrade-visibility`;
  return await fetchFromApiServer("POST", url, {
    projectId,
    visibilityType,
  });
};

/**
 * Get payment methods
 */
export const getPaymentMethodsApi = async () => {
  const url = `api/v1/user/billing/payment-methods`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Add a new payment method
 */
export const addPaymentMethodApi = async (paymentMethodData) => {
  const url = `api/v1/user/billing/payment-methods`;
  return await fetchFromApiServer("POST", url, paymentMethodData);
};

/**
 * Delete a payment method
 */
export const deletePaymentMethodApi = async (paymentMethodId) => {
  const url = `api/v1/user/billing/payment-methods/${paymentMethodId}`;
  return await fetchFromApiServer("DELETE", url);
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethodApi = async (paymentMethodId) => {
  const url = `api/v1/user/billing/payment-methods/${paymentMethodId}/set-default`;
  return await fetchFromApiServer("PUT", url);
};

/**
 * Create a dispute
 */
export const createDisputeApi = async (disputeData) => {
  const url = `api/v1/user/billing/disputes`;
  return await fetchFromApiServer("POST", url, disputeData);
};

/**
 * Get all disputes (Admin only)
 */
export const getDisputesApi = async (status = null) => {
  const queryParams = status ? `?status=${status}` : '';
  const url = `api/v1/user/billing/disputes${queryParams}`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Resolve a dispute (Admin only)
 */
export const resolveDisputeApi = async (disputeId, resolution) => {
  const url = `api/v1/user/billing/disputes/${disputeId}/resolve`;
  return await fetchFromApiServer("PUT", url, { resolution });
};

/**
 * Get all suspended accounts (Admin only)
 */
export const getSuspendedAccountsApi = async () => {
  const url = `api/v1/user/billing/suspended-accounts`;
  return await fetchFromApiServer("GET", url);
};

/**
 * Suspend an account (Admin only)
 */
export const suspendAccountApi = async (accountData) => {
  const url = `api/v1/user/billing/suspended-accounts`;
  return await fetchFromApiServer("POST", url, accountData);
};

/**
 * Unsuspend an account (Admin only)
 */
export const unsuspendAccountApi = async (accountId) => {
  const url = `api/v1/user/billing/suspended-accounts/${accountId}/unsuspend`;
  return await fetchFromApiServer("PUT", url);
};

/**
 * Get admin dashboard data (Admin only)
 */
export const getAdminDashboardApi = async () => {
  const url = `api/v1/user/billing/admin/dashboard`;
  return await fetchFromApiServer("GET", url);
};

// Note: Subscription plans are now fetched from backend API
// No static fallback data - all data comes from /api/v1/user/billing/subscription-plans
