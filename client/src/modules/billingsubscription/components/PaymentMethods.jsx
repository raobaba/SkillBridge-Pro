import React from "react";
import Button from '../../../components/Button';
import { CreditCard, Wallet, Shield, Star, Plus, Trash2, Edit } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    { id: 1, type: "Credit Card", last4: "4242", default: true, brand: "Visa" },
    { id: 2, type: "PayPal", email: "user@example.com", default: false, brand: "PayPal" },
  ];

  const getPaymentIcon = (type) => {
    switch (type) {
      case "Credit Card":
        return <CreditCard className="w-5 h-5" />;
      case "PayPal":
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentColor = (type) => {
    switch (type) {
      case "Credit Card":
        return "from-blue-500 to-indigo-500";
      case "PayPal":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getBrandColor = (brand) => {
    switch (brand) {
      case "Visa":
        return "from-blue-600 to-blue-800";
      case "PayPal":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Payment Methods
            </h2>
          </div>
          <Button 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </Button>
        </div>
        <p className="text-gray-300 text-sm">Manage your payment methods and billing preferences</p>
      </div>

      {/* Payment Methods List */}
      <div className="relative z-10 space-y-4">
        {methods.map((method, idx) => (
          <div
            key={method.id}
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
                {/* Left side - Payment Info */}
                <div className="flex items-center gap-6">
                  {/* Payment Type Icon */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getPaymentColor(method.type)}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {getPaymentIcon(method.type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold group-hover:text-blue-200 transition-colors duration-300">
                          {method.type}
                        </p>
                        {method.default && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-yellow-400 font-medium">Default</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {method.last4
                          ? `**** **** **** ${method.last4}`
                          : method.email}
                      </p>
                    </div>
                  </div>

                  {/* Brand Badge */}
                  <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getBrandColor(method.brand)} text-white text-xs font-semibold shadow-md`}>
                    {method.brand}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                  {/* Security indicator */}
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Secured</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button 
                      variant='ghost'
                      className='w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                    >
                      <Edit className='w-3 h-3 text-blue-400' />
                    </Button>
                    <Button 
                      variant='ghost'
                      className='w-8 h-8 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300'
                    >
                      <Trash2 className='w-3 h-3 text-red-400' />
                    </Button>
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
            Your payment information is encrypted and secure
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>SSL Protected</span>
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

export default PaymentMethods;
