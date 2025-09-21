import React from "react";
import { Clock, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";

const BillingHistory = ({ userRole = 'developer', billingHistory = [] }) => {
  // Default history based on role if none provided
  const defaultHistory = {
    developer: [
      { id: 1, date: "2025-01-01", amount: "$0.00", status: "Free Plan", description: "Free Tier" },
    ],
    project_owner: [
      { id: 1, date: "2025-01-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
      { id: 2, date: "2024-12-01", amount: "$29.99", status: "Paid", description: "Premium Plan" },
      { id: 3, date: "2024-11-01", amount: "$15.00", status: "Paid", description: "Project Boost" },
    ],
    admin: [
      { id: 1, date: "2025-01-01", amount: "$0.00", status: "Admin Access", description: "Administrative Account" },
    ],
  };

  const history = billingHistory.length > 0 ? billingHistory : defaultHistory[userRole] || defaultHistory.developer;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
      case "Free Plan":
      case "Admin Access":
        return <CheckCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
      case "Free Plan":
      case "Admin Access":
        return "from-emerald-500 to-green-500";
      case "Failed":
        return "from-red-500 to-pink-500";
      default:
        return "from-yellow-500 to-orange-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Billing History
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Track your subscription payments and billing records</p>
      </div>

      {/* History List */}
      <div className="relative z-10 space-y-4">
        {history.map((item, idx) => (
          <div
            key={item.id}
            className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            {/* Card content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                {/* Left side - Date and Amount */}
                <div className="flex items-center gap-6">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-1">Payment Date</p>
                      <p className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-1">Amount</p>
                      <p className="text-white font-semibold text-lg group-hover:text-emerald-200 transition-colors duration-300">
                        {item.amount}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-300 mb-1">Description</p>
                    <p className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300">
                      {item.description || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Right side - Status */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-300 mb-1">Status</p>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getStatusColor(item.status)} text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-300`}>
                      {getStatusIcon(item.status)}
                      <span className="text-sm">{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-300">
            All billing records are automatically tracked and updated
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span>Paid</span>
            <div className="w-2 h-2 bg-red-400 rounded-full ml-3"></div>
            <span>Failed</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BillingHistory;
