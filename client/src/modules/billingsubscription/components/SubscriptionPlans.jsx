import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";
import { Button } from "../../../components";
import { getSubscriptionPlans, getBillingData } from "../slice/billingSlice";
import PurchaseModal from "./PurchaseModal";

const SubscriptionPlans = ({ userRole = 'developer' }) => {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing || {});
  const subscriptionPlans = billingState.subscriptionPlans || [];
  const currentSubscription = billingState.currentSubscription || {};
  const loading = billingState.loading || false;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (subscriptionPlans.length === 0 && !loading) {
      dispatch(getSubscriptionPlans());
    }
  }, [dispatch, subscriptionPlans.length, loading]);

  // Use API plans only - no static fallback
  const plansData = subscriptionPlans;

  const plans = plansData.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: `$${plan.price}`,
    period: plan.period,
    features: plan.features || [],
    popular: plan.popular || plan.id === 2,
    current: currentSubscription?.plan?.toLowerCase() === plan.name.toLowerCase(),
  }));

  const handlePurchaseClick = (plan) => {
    setSelectedPlan(plan);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    dispatch(getBillingData());
    setShowPurchaseModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 flex justify-center py-12">
            <p className="text-gray-400">Loading subscription plans...</p>
          </div>
        ) : plansData.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-400">No subscription plans available at this time</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.popular && !plan.current
                  ? "bg-gradient-to-b from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50"
                  : plan.current
                  ? "bg-gradient-to-b from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/50"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {/* Popular Badge or Current Plan Badge */}
              {plan.popular && !plan.current && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              )}

              {/* Plan Title & Price */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">
                  {plan.price}
                  <span className="text-lg text-gray-400">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button always at bottom */}
              <Button
                className={`mt-auto ${
                  plan.current
                    ? "bg-white/10 hover:bg-white/20 cursor-not-allowed opacity-75"
                    : plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                disabled={plan.current || loading}
                onClick={() => !plan.current && handlePurchaseClick(plan)}
              >
                {loading ? 'Processing...' : plan.current ? 'Current Plan' : plan.popular ? 'Get Started' : 'Choose Plan'}
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPlan && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;
