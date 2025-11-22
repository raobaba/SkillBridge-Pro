import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from '../../../components/Button';
import { getBillingData, cancelSubscription, purchaseSubscription, getSubscriptionPlans } from "../slice/billingSlice";
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Star, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  Sparkles,
  Target,
  Users
} from "lucide-react";

const DeveloperBillSubsDash = ({ data }) => {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing);
  
  // Use Redux state if available, otherwise fallback to props
  const subscription = billingState.currentSubscription || data?.subscription || {};
  const billingHistory = billingState.billingHistory || data?.billingHistory || [];
  const paymentMethods = billingState.paymentMethods || data?.paymentMethods || [];
  const subscriptionPlans = billingState.subscriptionPlans || [];

  useEffect(() => {
    if (!billingState.currentSubscription || Object.keys(billingState.currentSubscription).length === 0) {
      dispatch(getBillingData());
    }
    if (subscriptionPlans.length === 0) {
      dispatch(getSubscriptionPlans());
    }
  }, [dispatch, billingState.currentSubscription, subscriptionPlans.length]);

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.')) {
      try {
        await dispatch(cancelSubscription()).unwrap();
        // Optionally show success message
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      await dispatch(purchaseSubscription({ planId, paymentMethodId: null })).unwrap();
      // Optionally show success message
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      alert('Failed to purchase subscription. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Current Plan</h2>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              subscription.plan === 'free' 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' 
                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
            }`}>
              {subscription.plan.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Credits */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Credits</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{subscription.aiCredits}</div>
              <p className="text-sm text-gray-300">Available credits for AI tools</p>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(subscription.aiCredits / 1000) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Usage: {subscription.aiCredits}/1000</p>
              </div>
            </div>

            {/* Enhanced Tools */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Enhanced Tools</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {subscription.enhancedTools ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                )}
                <span className="text-white font-medium">
                  {subscription.enhancedTools ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-gray-300">
                {subscription.enhancedTools 
                  ? 'Access to premium AI career tools' 
                  : 'Upgrade to unlock enhanced features'
                }
              </p>
            </div>

            {/* Matchmaking Boost */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Matchmaking</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {subscription.matchmakingBoost ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                )}
                <span className="text-white font-medium">
                  {subscription.matchmakingBoost ? 'Boosted' : 'Standard'}
                </span>
              </div>
              <p className="text-sm text-gray-300">
                {subscription.matchmakingBoost 
                  ? 'Enhanced visibility in job matching' 
                  : 'Standard visibility in job matching'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Upgrade Your Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
              </div>
              <div className="text-2xl font-bold text-white mb-2">$29.99<span className="text-sm text-gray-300">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  1000 AI Credits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Enhanced AI Tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Matchmaking Boost
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Priority Support
                </li>
              </ul>
              <Button 
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                onClick={() => handleUpgrade(2)}
                disabled={billingState.loading}
              >
                {billingState.loading ? 'Processing...' : 'Upgrade Now'}
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Enterprise</h3>
              </div>
              <div className="text-2xl font-bold text-white mb-2">$99.99<span className="text-sm text-gray-300">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Unlimited AI Credits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  All Enhanced Tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Maximum Matchmaking Boost
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  24/7 Dedicated Support
                </li>
              </ul>
              <Button 
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                onClick={() => handleUpgrade(3)}
                disabled={billingState.loading}
              >
                {billingState.loading ? 'Processing...' : 'Upgrade Now'}
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Billing History</h2>
          </div>

          <div className="space-y-4">
            {billingHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No billing history available</p>
              </div>
            ) : (
              billingHistory.map((item, idx) => (
              <div
                key={item.id}
                className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 mb-1">Date</p>
                        <p className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-emerald-400 font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 mb-1">Amount</p>
                        <p className="text-white font-semibold text-lg group-hover:text-emerald-200 transition-colors duration-300">
                          {item.amount}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-300 mb-1">Description</p>
                      <p className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-300 mb-1">Status</p>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-300">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{item.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBillSubsDash;
