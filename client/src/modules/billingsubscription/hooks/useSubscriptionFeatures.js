import { useSelector } from "react-redux";
import { hasFeatureAccess, getProjectLimit, canPostProject } from "../utils/subscriptionLimits";

/**
 * Hook to check subscription features and limits
 */
export const useSubscriptionFeatures = () => {
  const billingState = useSelector((state) => state.billing || {});
  const currentSubscription = billingState.currentSubscription || {};
  const projectState = useSelector((state) => state.project || {});
  const projects = projectState.projects || [];
  const currentProjectCount = projects.length;

  return {
    subscription: currentSubscription,
    hasFeature: (feature) => hasFeatureAccess(currentSubscription, feature),
    getProjectLimit: () => getProjectLimit(currentSubscription),
    canPostProject: () => canPostProject(currentSubscription, currentProjectCount),
    currentProjectCount,
    remainingProjectSlots: getProjectLimit(currentSubscription) === Infinity 
      ? Infinity 
      : Math.max(0, getProjectLimit(currentSubscription) - currentProjectCount),
    isFreePlan: currentSubscription.plan?.toLowerCase() === 'free',
    isProPlan: currentSubscription.plan?.toLowerCase() === 'pro',
    isEnterprisePlan: currentSubscription.plan?.toLowerCase() === 'enterprise',
  };
};

