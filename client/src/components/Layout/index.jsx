import React from "react";
import { Navigation, Breadcrumb } from "../index";

const Layout = ({ children, isHome = false, isSearchBar = false, showBreadcrumb = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Navigation */}
      <Navigation isHome={isHome} isSearchBar={isSearchBar} />
      
      {/* Main Content */}
      <div className={`pt-16 ${!isHome ? 'lg:pl-64' : ''}`}>
        {isHome ? (
          <>
            {/* Breadcrumb */}
            {showBreadcrumb && <Breadcrumb />}
            
            {/* Page Content */}
            {children}
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            {showBreadcrumb && <Breadcrumb />}
            
            {/* Page Content */}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
