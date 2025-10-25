import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listApplicants, updateApplicantStatus } from "../slice/projectSlice";
import { toast } from "react-toastify";
import Button from '../../../components/Button';
import { 
  Users, 
  Eye, 
  UserCheck, 
  UserX,
  Calendar,
  MapPin,
  Award,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Filter,
  Search,
  MoreVertical
} from "lucide-react";

const DeveloperManagement = ({ projects = [], projectApplicants = {}, onApplicantStatusUpdate }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user || null);

  // Flatten all applicants from all projects
  const allApplicants = useMemo(() => {
    const applicants = [];
    projects.forEach(project => {
      const projectApps = projectApplicants[project.id] || [];
      projectApps.forEach(applicant => {
        applicants.push({
          ...applicant,
          projectId: project.id,
          projectTitle: project.title,
          projectCompany: project.company || 'Company',
          projectLocation: project.location || 'Remote',
          joinedDate: applicant.appliedAt || applicant.createdAt || new Date().toISOString().slice(0, 10)
        });
      });
    });
    return applicants;
  }, [projects, projectApplicants]);

  // Filter and sort applicants
  const filteredApplicants = useMemo(() => {
    let filtered = allApplicants.filter(applicant => {
      const matchesSearch = 
        applicant.userId?.toString().includes(searchTerm) ||
        applicant.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.projectCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === "all" ||
        (activeFilter === "active" && applicant.status === "shortlisted") ||
        (activeFilter === "onboarding" && applicant.status === "applied") ||
        (activeFilter === "suspended" && applicant.status === "rejected");
      
      return matchesSearch && matchesFilter;
    });

    // Sort applicants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.userId || "").toString().localeCompare((b.userId || "").toString());
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "project":
          return (a.projectTitle || "").localeCompare(b.projectTitle || "");
        case "date":
          return new Date(b.joinedDate) - new Date(a.joinedDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allApplicants, searchTerm, activeFilter, sortBy]);

  const handleStatusUpdate = async (projectId, userId, newStatus) => {
    try {
      await dispatch(updateApplicantStatus({
        projectId,
        userId,
        status: newStatus
      })).unwrap();
      
      toast.success(`Application ${newStatus} successfully!`);
      
      // Call parent callback if provided
      if (onApplicantStatusUpdate) {
        onApplicantStatusUpdate(projectId, userId, newStatus);
      }
    } catch (error) {
      toast.error(error?.message || `Failed to update application status`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "shortlisted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "interviewing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "accepted":
      case "hired":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return <Clock className="w-3 h-3" />;
      case "shortlisted":
        return <CheckCircle className="w-3 h-3" />;
      case "interviewing":
        return <Users className="w-3 h-3" />;
      case "rejected":
        return <UserX className="w-3 h-3" />;
      case "accepted":
      case "hired":
        return <UserCheck className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const filterTabs = [
    { id: "all", label: "All", count: allApplicants.length },
    { id: "active", label: "Active", count: allApplicants.filter(a => a.status === "shortlisted").length },
    { id: "onboarding", label: "Onboarding", count: allApplicants.filter(a => a.status === "applied").length },
    { id: "suspended", label: "Suspended", count: allApplicants.filter(a => a.status === "rejected").length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Developer Management</h2>
          <p className="text-gray-300 text-sm">Manage and review all project applicants</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeFilter === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, project, company, or notes..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by ID</option>
          <option value="status">Sort by Status</option>
          <option value="project">Sort by Project</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Developer Name</th>
                <th className="px-6 py-4 font-semibold">Skills</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Assigned Project</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredApplicants.map((applicant, index) => (
                <tr key={`${applicant.projectId}-${applicant.userId}`} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4 text-white font-medium">{index + 1}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {applicant.userId?.toString().charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="text-white font-medium">Developer {applicant.userId}</p>
                        <p className="text-gray-400 text-sm">ID: {applicant.userId}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs rounded-full">
                        React
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs rounded-full">
                        Node.js
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-teal-500 text-white text-xs rounded-full">
                        JavaScript
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(applicant.status)}`}>
                      {getStatusIcon(applicant.status)}
                      {applicant.status || "Applied"}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{applicant.projectTitle || "Project Name"}</p>
                      <p className="text-gray-400 text-sm">{applicant.projectCompany}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(applicant.joinedDate).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs hover:bg-blue-500/30 transition-colors duration-300"
                      >
                        <Eye className="w-3 h-3 mr-1 inline" />
                        View
                      </Button>
                      
                      <Button
                        onClick={() => handleStatusUpdate(applicant.projectId, applicant.userId, "shortlisted")}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 transition-colors duration-300"
                      >
                        <UserCheck className="w-3 h-3 mr-1 inline" />
                        Assign
                      </Button>
                      
                      <Button
                        onClick={() => handleStatusUpdate(applicant.projectId, applicant.userId, "rejected")}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <UserX className="w-3 h-3 mr-1 inline" />
                        Suspend
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No applicants found */}
      {filteredApplicants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No applicants found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchTerm ? "Try adjusting your search terms" : "No applicants match your current filters"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeveloperManagement;
