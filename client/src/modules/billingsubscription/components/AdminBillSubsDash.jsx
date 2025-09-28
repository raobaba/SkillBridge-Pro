import React from "react";
import Button from '../../../components/Button';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Ban,
  Check,
  Clock,
  BarChart3,
  FileText,
  UserX,
  CreditCard,
} from "lucide-react";

const AdminBillSubsDash = ({ data }) => {
  const { adminStats, disputes, suspendedAccounts } = data;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDisputeStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-orange-500";
      case "resolved":
        return "from-emerald-500 to-green-500";
      case "investigating":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getDisputeStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className='w-4 h-4' />;
      case "resolved":
        return <CheckCircle className='w-4 h-4' />;
      case "investigating":
        return <Eye className='w-4 h-4' />;
      default:
        return <AlertTriangle className='w-4 h-4' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Admin Overview Stats */}
      <div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg'>
              <Shield className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Admin Dashboard</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {/* Total Revenue */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center'>
                  <DollarSign className='w-4 h-4 text-emerald-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Total Revenue
                </h3>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>
                {formatCurrency(adminStats?.totalRevenue)}
              </div>
              <p className='text-sm text-gray-300'>All-time revenue</p>
            </div>

            {/* Active Subscriptions */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center'>
                  <Users className='w-4 h-4 text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Active Subscriptions
                </h3>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>
                {adminStats?.activeSubscriptions.toLocaleString()}
              </div>
              <p className='text-sm text-gray-300'>Currently active</p>
            </div>

            {/* Pending Payments */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg flex items-center justify-center'>
                  <Clock className='w-4 h-4 text-yellow-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Pending Payments
                </h3>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>
                {adminStats?.pendingPayments}
              </div>
              <p className='text-sm text-gray-300'>Awaiting processing</p>
            </div>

            {/* Disputes */}
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg flex items-center justify-center'>
                  <AlertTriangle className='w-4 h-4 text-red-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Open Disputes
                </h3>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>
                {adminStats?.disputes}
              </div>
              <p className='text-sm text-gray-300'>Require attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disputes Management */}
      <div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg'>
              <AlertTriangle className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>
              Dispute Management
            </h2>
          </div>

          <div className='space-y-4'>
            {disputes?.map((dispute, idx) => (
              <div
                key={dispute.id}
                className='group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden'
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <FileText className='w-4 h-4 text-red-400' />
                      </div>
                      <div>
                        <p className='text-white font-semibold group-hover:text-blue-200 transition-colors duration-300'>
                          User: {dispute.userId}
                        </p>
                        <p className='text-sm text-gray-300'>
                          {dispute.reason}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='text-right'>
                        <p className='text-xs text-gray-300 mb-1'>Amount</p>
                        <p className='text-white font-semibold text-lg group-hover:text-emerald-200 transition-colors duration-300'>
                          {formatCurrency(dispute.amount)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className='text-xs text-gray-300 mb-1'>Date</p>
                      <p className='text-white font-medium group-hover:text-blue-200 transition-colors duration-300'>
                        {formatDate(dispute.date)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p className='text-xs text-gray-300 mb-1'>Status</p>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getDisputeStatusColor(dispute.status)} text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-300`}
                      >
                        {getDisputeStatusIcon(dispute.status)}
                        <span className='text-sm capitalize'>
                          {dispute.status}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <Button 
                        variant='ghost'
                        className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                      >
                        <Eye className='w-3 h-3 text-blue-400' />
                      </Button>
                      <Button 
                        variant='ghost'
                        className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                      >
                        <Check className='w-3 h-3 text-emerald-400' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suspended Accounts */}
      <div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg'>
              <UserX className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>
              Suspended Accounts
            </h2>
          </div>

          <div className='space-y-4'>
            {suspendedAccounts?.map((account, idx) => (
              <div
                key={account.id}
                className='group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer overflow-hidden'
                style={{
                  animationDelay: `${idx * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <Ban className='w-4 h-4 text-red-400' />
                      </div>
                      <div>
                        <p className='text-white font-semibold group-hover:text-red-200 transition-colors duration-300'>
                          User: {account.userId}
                        </p>
                        <p className='text-sm text-gray-300'>
                          Reason: {account.reason}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='text-right'>
                        <p className='text-xs text-gray-300 mb-1'>Amount Due</p>
                        <p className='text-white font-semibold text-lg group-hover:text-red-200 transition-colors duration-300'>
                          {formatCurrency(account.amount)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className='text-xs text-gray-300 mb-1'>Suspended</p>
                      <p className='text-white font-medium group-hover:text-red-200 transition-colors duration-300'>
                        {formatDate(account.suspendedAt)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <Button 
                      variant='ghost'
                      className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                    >
                      <Eye className='w-3 h-3 text-blue-400' />
                    </Button>
                    <Button 
                      variant='ghost'
                      className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                    >
                      <Check className='w-3 h-3 text-emerald-400' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg'>
              <BarChart3 className='w-5 h-5 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Revenue Analytics</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-4 h-4 text-emerald-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Monthly Revenue
                </h3>
              </div>
              <div className='text-2xl font-bold text-white mb-2'>
                {formatCurrency(12500)}
              </div>
              <p className='text-sm text-gray-300'>+12% from last month</p>
            </div>

            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center'>
                  <Users className='w-4 h-4 text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  New Subscriptions
                </h3>
              </div>
              <div className='text-2xl font-bold text-white mb-2'>45</div>
              <p className='text-sm text-gray-300'>This month</p>
            </div>

            <div className='bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg flex items-center justify-center'>
                  <CreditCard className='w-4 h-4 text-yellow-400' />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Payment Success Rate
                </h3>
              </div>
              <div className='text-2xl font-bold text-white mb-2'>98.5%</div>
              <p className='text-sm text-gray-300'>Last 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBillSubsDash;
