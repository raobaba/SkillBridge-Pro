/**
 * Subscription Limits Utility
 * Checks user subscription limits and feature access
 */

/**
 * Get project posting limit based on subscription plan
 */
export const getProjectLimit = (subscription) => {
  if (!subscription || !subscription.plan) return 5; // Default free plan limit
  
  const plan = subscription.plan.toLowerCase();
  const planFeatures = subscription.planFeatures || {};
  
  // Check if maxProjects is set in planFeatures
  if (planFeatures.maxProjects !== undefined) {
    // -1 means unlimited
    return planFeatures.maxProjects === -1 ? Infinity : planFeatures.maxProjects;
  }
  
  // Fallback to plan-based limits
  switch (plan) {
    case 'free':
      return 5;
    case 'pro':
      return 50; // Pro plan allows 50 projects
    case 'enterprise':
      return Infinity; // Unlimited
    default:
      return 5;
  }
};

/**
 * Check if user can post more projects
 */
export const canPostProject = (subscription, currentProjectCount) => {
  const limit = getProjectLimit(subscription);
  return currentProjectCount < limit;
};

/**
 * Get remaining project slots
 */
export const getRemainingProjectSlots = (subscription, currentProjectCount) => {
  const limit = getProjectLimit(subscription);
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentProjectCount);
};

/**
 * Check if feature is available based on subscription
 */
export const hasFeatureAccess = (subscription, feature) => {
  if (!subscription || !subscription.plan) return false;
  
  const plan = subscription.plan.toLowerCase();
  const planFeatures = subscription.planFeatures || {};
  
  switch (feature) {
    case 'enhancedTools':
      return subscription.enhancedTools || plan !== 'free';
    case 'matchmakingBoost':
      return subscription.matchmakingBoost || plan !== 'free';
    case 'advancedAnalytics':
      return planFeatures.analytics || plan !== 'free';
    case 'customBranding':
      return planFeatures.customBranding || plan === 'enterprise';
    case 'prioritySupport':
      return planFeatures.supportLevel === 'priority' || planFeatures.supportLevel === '24/7';
    case 'unlimitedProjects':
      return planFeatures.maxProjects === -1 || plan === 'enterprise';
    default:
      return plan !== 'free';
  }
};

/**
 * Get subscription tier level
 */
export const getSubscriptionTier = (subscription) => {
  if (!subscription || !subscription.plan) return 'free';
  return subscription.plan.toLowerCase();
};

