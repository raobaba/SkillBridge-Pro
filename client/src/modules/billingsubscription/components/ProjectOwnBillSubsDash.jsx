import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from '../../../components/Button';
import { getBillingData, upgradeProjectVisibility, cancelSubscription } from "../slice/billingSlice";
import {
  Building2,
  TrendingUp,
  Eye,
  Star,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Plus,
  Settings,
  DollarSign,
  Calendar,
  Zap,
} from "lucide-react";

const ProjectOwnBillSubsDash = ({ data }) => {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing);
  
  // Use Redux state if available, otherwise fallback to props
  const subscription = billingState.currentSubscription || data?.subscription || {};
  const billingHistory = billingState.billingHistory || data?.billingHistory || [];
  const paymentMethods = billingState.paymentMethods || data?.paymentMethods || [];
  const projectOwnerData = billingState.projectOwnerData || data?.projectOwnerData || {};
  const projectListings = projectOwnerData.projectListings || data?.projectListings || [];

  useEffect(() => {
    if (!billingState.currentSubscription || Object.keys(billingState.currentSubscription).length === 0) {
      dispatch(getBillingData());
    }
  }, [dispatch, billingState.currentSubscription]);

  const handleUpgradeVisibility = async (projectId, visibilityType) => {
    try {
      await dispatch(upgradeProjectVisibility({ projectId, visibilityType })).unwrap();
      // Refresh billing data to get updated boosted projects
      dispatch(getBillingData());
    } catch (error) {
      console.error('Failed to upgrade project visibility:', error);
      toast.error('Failed to upgrade project visibility. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.')) {
      try {
        await dispatch(cancelSubscription()).unwrap();
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
        toast.error('Failed to cancel subscription. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    return status === "Paid" ? (
      <CheckCircle className='w-4 h-4' />
    ) : (
      <XCircle className='w-4 h-4' />
    );
  };

  const getStatusColor = (status) => {
    return status === "Paid"
      ? "from-emerald-500 to-green-500"
      : "from-red-500 to-pink-500";
  };

  return (
    <div className='space-y-6'>
      {/* Current Subscription & Revenue Overview */}
      <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>
                Project Owner Dashboard
              </h2>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-300'>Next Billing</p>
                <p className='text-white font-semibold'>
                  {formatDate(subscription.nextBillingDate)}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white`}
              >
                {subscription.plan.toUpperCase()}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {/* AI Credits */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-purple-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>AI Credits</h3>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>
                {subscription.aiCredits}
              </div>
              <p className='text-sm text-gray-300'>Available credits</p>
            </div>

            {/* Project Visibility */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center'>
                  <Eye className='w-4 h-4 text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Visibility</h3>
              </div>
              <div className='text-2xl font-bold text-white mb-2 capitalize'>
                {subscription.projectVisibility}
              </div>
              <p className='text-sm text-gray-300'>Project visibility level</p>
            </div>

            {/* Matchmaking Boost */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-4 h-4 text-emerald-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Boost</h3>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                {subscription.matchmakingBoost ? (
                  <CheckCircle className='w-6 h-6 text-emerald-400' />
                ) : (
                  <XCircle className='w-6 h-6 text-gray-400' />
                )}
                <span className='text-white font-medium'>
                  {subscription.matchmakingBoost ? "Active" : "Inactive"}
                </span>
              </div>
              <p className='text-sm text-gray-300'>Matchmaking boost status</p>
            </div>

            {/* Enhanced Tools */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg flex items-center justify-center'>
                  <Settings className='w-4 h-4 text-yellow-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Tools</h3>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                {subscription.enhancedTools ? (
                  <CheckCircle className='w-6 h-6 text-emerald-400' />
                ) : (
                  <XCircle className='w-6 h-6 text-gray-400' />
                )}
                <span className='text-white font-medium'>
                  {subscription.enhancedTools ? "Enhanced" : "Basic"}
                </span>
              </div>
              <p className='text-sm text-gray-300'>AI tools access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Listings Management */}
      <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg'>
                <Building2 className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>
                Project Listings
              </h2>
            </div>
            <Button 
              className='px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              Add Project
            </Button>
          </div>

          <div className='space-y-4'>
            {projectListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No projects available</p>
              </div>
            ) : (
              projectListings.map((project, idx) => (
              <div
                key={project.id}
                className='group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden'
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center'>
                        <Building2 className='w-4 h-4 text-blue-400' />
                      </div>
                      <div>
                        <p className='text-white font-semibold group-hover:text-blue-200 transition-colors duration-300'>
                          {project.name}
                        </p>
                        <p className='text-sm text-gray-300'>
                          Visibility:{" "}
                          <span className='capitalize'>
                            {project.visibility}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          project.boosted
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                            : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                        }`}
                      >
                        {project.boosted ? "Boosted" : "Standard"}
                      </div>
                      {project.boostExpires && (
                        <div className='text-xs text-gray-300'>
                          Expires: {formatDate(project.boostExpires)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    {!project.boosted && (
                      <Button 
                        variant='ghost'
                        className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center'
                        onClick={() => handleUpgradeVisibility(project.id, 'premium')}
                        disabled={billingState.loading}
                        title="Boost project visibility"
                      >
                        <TrendingUp className='w-3 h-3 text-emerald-400' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg'>
                <CreditCard className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Payment Methods</h2>
            </div>
            <Button 
              className='px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              Add Method
            </Button>
          </div>

          <div className='space-y-4'>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No payment methods added yet</p>
              </div>
            ) : (
              paymentMethods.map((method, idx) => (
              <div
                key={method.id}
                className='group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden'
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center'>
                        <CreditCard className='w-4 h-4 text-blue-400' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <p className='text-white font-semibold group-hover:text-blue-200 transition-colors duration-300'>
                            {method.type}
                          </p>
                          {method.default && (
                            <div className='flex items-center gap-1'>
                              <Star className='w-3 h-3 text-yellow-400 fill-current' />
                              <span className='text-xs text-yellow-400 font-medium'>
                                Default
                              </span>
                            </div>
                          )}
                        </div>
                        <p className='text-sm text-gray-300'>
                          {method.last4
                            ? `**** **** **** ${method.last4}`
                            : method.email}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-semibold shadow-md`}
                    >
                      {method.brand}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <Button 
                      variant='ghost'
                      className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center'
                    >
                      <Settings className='w-3 h-3 text-blue-400' />
                    </Button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg'>
              <Clock className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Billing History</h2>
          </div>

          <div className='space-y-4'>
            {billingHistory.map((item, idx) => (
              <div
                key={item.id}
                className='group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden'
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center'>
                        <Calendar className='w-4 h-4 text-blue-400' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-300 mb-1'>Date</p>
                        <p className='text-white font-medium group-hover:text-blue-200 transition-colors duration-300'>
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center'>
                        <DollarSign className='w-4 h-4 text-emerald-400' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-300 mb-1'>Amount</p>
                        <p className='text-white font-semibold text-lg group-hover:text-emerald-200 transition-colors duration-300'>
                          {item.amount}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className='text-xs text-gray-300 mb-1'>Description</p>
                      <p className='text-white font-medium group-hover:text-blue-200 transition-colors duration-300'>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p className='text-xs text-gray-300 mb-1'>Status</p>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getStatusColor(item.status)} text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-300`}
                      >
                        {getStatusIcon(item.status)}
                        <span className='text-sm'>{item.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOwnBillSubsDash;
