import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeveloperView from "../components/DeveloperView";
import ProjectOwnerView from "../components/ProjectOwnerView";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = {
    name: "Rajan",
    role: "project-ownerd",
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (user?.role === "admin") return <AnalyticsDashboard />;
  if (user?.role === "project-owner") return <ProjectOwnerView />;
  return <DeveloperView />;
};

export default Dashboard;
