import {
  Home,
  User,
  Bell,
  Settings,
  Database,
  Briefcase,
  Target,
  Trophy,
  MessageSquare,
  CreditCard,
  Brain,
  BarChart3,
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Shield,
  Zap,
  Code,
  GitBranch,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

// Navigation configuration for different user roles
export const navigationConfig = {
  // Main navigation items for authenticated users
  main: {
    dashboard: {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
      description: "Main dashboard",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: true,
    },
    profile: {
      label: "Profile",
      path: "/profile",
      icon: User,
      description: "Manage your profile",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: true,
    },
    projects: {
      label: "Projects",
      path: "/project",
      icon: Briefcase,
      description: "Browse and manage projects",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: true,
    },
    matchmaking: {
      label: "Matchmaking",
      path: "/matchmaking",
      icon: Target,
      description: "Find matches",
      roles: ["developer"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: true,
    },
    chat: {
      label: "Communication",
      path: "/chat",
      icon: MessageSquare,
      description: "Chat and collaborate",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: true,
    },
    aiCareer: {
      label: "AI Career",
      path: "/ai-career",
      icon: Brain,
      description: "AI-powered career tools",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
    portfolioSync: {
      label: "Portfolio Sync",
      path: "/portfolio-sync",
      icon: Database,
      description: "Sync your profiles",
      roles: ["developer", "project-owner"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
    gamification: {
      label: "Gamification",
      path: "/gamification",
      icon: Trophy,
      description: "Track achievements",
      roles: ["developer", "project-owner"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
    settings: {
      label: "Settings",
      path: "/settings",
      icon: Settings,
      description: "Account settings",
      roles: ["developer", "project-owner", "admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
    billing: {
      label: "Billing",
      path: "/billing-subscription",
      icon: CreditCard,
      description: "Manage subscriptions",
      roles: ["project-owner"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
    userManagement: {
      label: "Users",
      path: "/users",
      icon: Users,
      description: "User management",
      roles: ["admin"],
      showInSidebar: true,
      showInUserDropdown: true,
      showInMobileNav: false,
    },
  },

  // Quick access items for different roles
  quickAccess: {
    developer: [
      {
        label: "Find Projects",
        path: "/matchmaking",
        icon: Target,
        color: "blue",
        description: "Discover new opportunities",
      },
      {
        label: "AI Career Tools",
        path: "/ai-career",
        icon: Brain,
        color: "green",
        description: "Enhance your career",
      },
      {
        label: "Sync Portfolio",
        path: "/portfolio-sync",
        icon: Database,
        color: "purple",
        description: "Update your profiles",
      },
      {
        label: "View Achievements",
        path: "/gamification",
        icon: Trophy,
        color: "yellow",
        description: "Track your progress",
      },
    ],
    "project-owner": [
      {
        label: "Post Project",
        path: "/project?action=create",
        icon: Plus,
        color: "blue",
        description: "Create new project",
      },
      {
        label: "View Applicants",
        path: "/project?tab=applicants",
        icon: Users,
        color: "green",
        description: "Review applications",
      },
      {
        label: "Team Management",
        path: "/project?tab=team",
        icon: Users,
        color: "purple",
        description: "Manage your team",
      },
      {
        label: "Billing",
        path: "/billing-subscription",
        icon: CreditCard,
        color: "yellow",
        description: "Manage subscriptions",
      },
    ],
    admin: [
      {
        label: "System Analytics",
        path: "/analytics",
        icon: BarChart3,
        color: "blue",
        description: "System overview",
      },
      {
        label: "User Management",
        path: "/users",
        icon: Users,
        color: "green",
        description: "Manage users",
      },
      {
        label: "Project Oversight",
        path: "/project",
        icon: Briefcase,
        color: "purple",
        description: "Monitor projects",
      },
      {
        label: "System Settings",
        path: "/settings",
        icon: Settings,
        color: "yellow",
        description: "Configure system",
      },
    ],
  },

  // Home page navigation items
  homeNav: [
    {
      label: "Features",
      href: "#features",
      icon: Star,
      description: "Explore our features",
    },
    {
      label: "How it Works",
      href: "#how-it-works",
      icon: Zap,
      description: "Learn how to get started",
    },
    {
      label: "Testimonials",
      href: "#testimonials",
      icon: Users,
      description: "See what users say",
    },
    {
      label: "Pricing",
      href: "#pricing",
      icon: CreditCard,
      description: "View our plans",
    },
  ],
};

// Helper functions
export const getNavigationItems = (role, section = "main") => {
  const items = navigationConfig[section];
  if (!items) return [];

  // If no role provided, return all items (for public access)
  if (!role) {
    return Object.values(items).filter(item => 
      !item.roles || item.roles.length === 0
    );
  }

  return Object.values(items).filter(item => 
    !item.roles || item.roles.includes(role)
  );
};

export const getQuickAccessItems = (role) => {
  return navigationConfig.quickAccess[role] || [];
};

export const getHomeNavItems = () => {
  return navigationConfig.homeNav;
};

// Hero section buttons configuration
export const getHeroButtons = () => {
  return [
    {
      label: "Start Collaborating",
      path: "/auth",
      icon: ArrowRight,
      className: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
      action: "navigate",
    },
    {
      label: "Watch Demo",
      path: "#how-it-works",
      icon: null,
      className: "border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5",
      action: "scroll",
    },
  ];
};

// Call to action buttons
export const getCTAButtons = () => {
  return [
    {
      label: "Start Free Today",
      path: "/auth",
      className: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105",
      action: "navigate",
    },
    {
      label: "Schedule Demo",
      path: "/contact",
      className: "border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5",
      action: "navigate",
    },
  ];
};

// Pricing plan buttons
export const getPricingButtons = () => {
  return [
    {
      label: "Get Started",
      path: "/billing-subscription",
      className: "w-full py-3 rounded-lg font-semibold transition-all duration-300",
      action: "navigate",
    },
  ];
};

// Navigation action handlers
export const handleNavigationAction = (action, path, navigate) => {
  switch (action) {
    case "navigate":
      navigate(path);
      break;
    case "scroll":
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      break;
    case "external":
      window.open(path, "_blank", "noopener,noreferrer");
      break;
    default:
      console.warn(`Unknown navigation action: ${action}`);
  }
};
