import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "../index";

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.", 
  onRetry, 
  onGoHome,
  showRetry = true,
  showGoHome = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white max-w-md mx-auto px-6">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-400">{title}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <Button
              onClick={onRetry}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          {showGoHome && (
            <Button
              onClick={onGoHome}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
