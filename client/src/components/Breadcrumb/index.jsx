import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (pathname) => {
    const breadcrumbMap = {
      dashboard: "Dashboard",
      profile: "Profile",
      project: "Projects",
      matchmaking: "Matchmaking1",
      chat: "Communication",
      "ai-career": "AI Career",
      "portfolio-sync": "Portfolio Sync",
      gamification: "Gamification",
      settings: "Settings",
      notifications: "Notifications",
      "billing-subscription": "Billing",
      analytics: "Analytics",
      users: "Users",
    };

    return breadcrumbMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === "dashboard")) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(pathname);

        return (
          <React.Fragment key={pathname}>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            {isLast ? (
              <span className="text-white font-medium">{breadcrumbName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-white transition-colors"
              >
                {breadcrumbName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
