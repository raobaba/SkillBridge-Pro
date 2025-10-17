import React, { useState, useEffect } from 'react';
import { Button, Badge, Input } from "../../../components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Download, Flag, FlagOff, ShieldCheck, CheckCircle, Ban, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Project actions
import { 
  updateProject, 
  deleteProject, 
  getProjectStats,
  searchProjects
} from "../slice/projectSlice";

const AdminProjects = ({ user, projects, dispatch, error, message, searchQuery, setSearchQuery, handleSearch }) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  // Remove local searchQuery state since it's passed as prop
  const [activeTab, setActiveTab] = useState("all"); // all | active | closed | flagged | pending | approved | suspended
  const [sortBy, setSortBy] = useState("recent"); // recent | title | owner | status | disputes | flagged
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Map API data to match UI expectations
  const mapProjectData = (project) => ({
    id: project.id,
    title: project.title,
    owner: project.owner?.name || project.owner?.email || 'Unknown Owner',
    status: project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Active',
    disputes: project.disputesCount || 0,
    flagged: project.isFlagged || false,
    verified: project.isVerified || false,
    suspended: project.isSuspended || false,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  });

  // Use projects from Redux state and map them
  const displayProjects = (projects || []).map(mapProjectData);
  const [projectStats, setProjectStats] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // Load project stats when projects change
  useEffect(() => {
    if (projects && projects.length > 0) {
      loadProjectStats();
    }
  }, [projects]);

  // Handle toast notifications
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const loadProjectStats = async () => {
    try {
      // Get stats for first 5 projects
      const statsPromises = projects.slice(0, 5).map(project => 
        dispatch(getProjectStats(project.id)).unwrap()
      );
      const stats = await Promise.all(statsPromises);
      setProjectStats(stats);
    } catch (error) {
      console.error('Error loading project stats:', error);
    }
  };

  const analyticsData = projectStats ? [
    { month: 'Jan', active: projectStats[0]?.totalProjects || 30, disputes: projectStats[0]?.totalDisputes || 2 },
    { month: 'Feb', active: projectStats[1]?.totalProjects || 45, disputes: projectStats[1]?.totalDisputes || 1 },
    { month: 'Mar', active: projectStats[2]?.totalProjects || 60, disputes: projectStats[2]?.totalDisputes || 3 },
    { month: 'Apr', active: projectStats[3]?.totalProjects || 80, disputes: projectStats[3]?.totalDisputes || 2 },
    { month: 'May', active: projectStats[4]?.totalProjects || 100, disputes: projectStats[4]?.totalDisputes || 4 },
  ] : [
    { month: 'Jan', active: 30, disputes: 2 },
    { month: 'Feb', active: 45, disputes: 1 },
    { month: 'Mar', active: 60, disputes: 3 },
    { month: 'Apr', active: 80, disputes: 2 },
    { month: 'May', active: 100, disputes: 4 },
  ];

  const exportProjectsCSV = (list) => {
    const headers = ["Project ID", "Title", "Owner", "Status", "Disputes", "Flagged"];
    const rows = list.map((p) => [p.id, p.title, p.owner, p.status, p.disputes, p.flagged ? "Yes" : "No"]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerify = async (id) => {
    const proj = displayProjects.find((p) => p.id === id);
    if (!window.confirm(`Verify project "${proj?.title}"?`)) return;
    try {
      await dispatch(updateProject({ id, data: { isVerified: true } })).unwrap();
      toast.success(`Project "${proj?.title}" verified successfully!`);
    } catch (error) {
      toast.error(`Failed to verify project: ${error.message}`);
    }
  };

  const handleSuspend = async (id) => {
    const proj = displayProjects.find((p) => p.id === id);
    if (!window.confirm(`Suspend project "${proj?.title}"?`)) return;
    try {
      await dispatch(updateProject({ id, data: { isSuspended: true, status: "paused" } })).unwrap();
      toast.success(`Project "${proj?.title}" suspended successfully!`);
    } catch (error) {
      toast.error(`Failed to suspend project: ${error.message}`);
    }
  };

  const handleApprove = async (id) => {
    const proj = displayProjects.find((p) => p.id === id);
    if (!window.confirm(`Approve project "${proj?.title}"?`)) return;
    try {
      await dispatch(updateProject({ id, data: { status: "active", isVerified: true } })).unwrap();
      toast.success(`Project "${proj?.title}" approved successfully!`);
    } catch (error) {
      toast.error(`Failed to approve project: ${error.message}`);
    }
  };

  const handleRemove = async (id) => {
    const proj = displayProjects.find((p) => p.id === id);
    if (!window.confirm(`Remove project "${proj?.title}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success(`Project "${proj?.title}" removed successfully!`);
    } catch (error) {
      toast.error(`Failed to remove project: ${error.message}`);
    }
  };

  const handleToggleFlag = async (id) => {
    const proj = displayProjects.find((p) => p.id === id);
    try {
      await dispatch(updateProject({ id, data: { isFlagged: !proj.flagged } })).unwrap();
      toast.success(`Project "${proj?.title}" ${!proj.flagged ? 'flagged' : 'unflagged'} successfully!`);
    } catch (error) {
      toast.error(`Failed to toggle flag: ${error.message}`);
    }
  };

  const filtered = displayProjects.filter((p) => {
    const q = searchQuery?.toLowerCase() || '';
    const matchesQ = p.title?.toLowerCase().includes(q) || 
                     p.owner?.toLowerCase().includes(q) || 
                     p.status?.toLowerCase().includes(q);
    const matchesTab = activeTab === 'all'
      || (activeTab === 'active' && p.status === 'Active')
      || (activeTab === 'closed' && p.status === 'Completed')
      || (activeTab === 'flagged' && p.flagged)
      || (activeTab === 'pending' && p.status === 'Draft')
      || (activeTab === 'approved' && p.verified)
      || (activeTab === 'suspended' && p.suspended);
    return matchesQ && matchesTab;
  });

  const sorted = (() => {
    const copy = [...filtered];
    switch (sortBy) {
      case 'title':
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case 'owner':
        return copy.sort((a, b) => a.owner.localeCompare(b.owner));
      case 'status':
        return copy.sort((a, b) => a.status.localeCompare(b.status));
      case 'disputes':
        return copy.sort((a, b) => b.disputes - a.disputes);
      case 'flagged':
        return copy.sort((a, b) => Number(b.flagged) - Number(a.flagged));
      case 'recent':
      default:
        return copy.sort((a, b) => b.id - a.id);
    }
  })();

  // Counts for header and tabs
  const countAll = displayProjects.length;
  const countActive = displayProjects.filter(p => p.status === 'Active').length;
  const countClosed = displayProjects.filter(p => p.status === 'Completed').length;
  const countFlagged = displayProjects.filter(p => p.flagged).length;
  const countPending = displayProjects.filter(p => p.status === 'Draft').length;
  const countApproved = displayProjects.filter(p => p.verified).length;
  const countSuspended = displayProjects.filter(p => p.suspended).length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paged.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkAction = (action) => {
    if (selectedIds.length === 0) return;
    const label = action.charAt(0).toUpperCase() + action.slice(1);
    if (!window.confirm(`${label} ${selectedIds.length} selected project(s)?`)) return;
    if (action === 'approve') setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'Approved' } : p));
    if (action === 'suspend') setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'Suspended' } : p));
    if (action === 'remove') setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
    if (action === 'flag') setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, flagged: true } : p));
    if (action === 'unflag') setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, flagged: false } : p));
    setSelectedIds([]);
  };


  // Redirect to home on error
  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Project Oversight</h1>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-xl font-bold text-white">{countAll}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Active</p>
          <p className="text-xl font-bold text-white">{countActive}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Closed</p>
          <p className="text-xl font-bold text-white">{countClosed}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Flagged</p>
          <p className="text-xl font-bold text-white">{countFlagged}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Pending</p>
          <p className="text-xl font-bold text-white">{countPending}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Suspended</p>
          <p className="text-xl font-bold text-white">{countSuspended}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, owner, or status"
              className="pl-8 bg-white/10 border border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-md px-2 py-2 text-sm text-white"
          >
            <option className="text-black" value="recent">Newest</option>
            <option className="text-black" value="title">Title</option>
            <option className="text-black" value="owner">Owner</option>
            <option className="text-black" value="status">Status</option>
            <option className="text-black" value="disputes">Disputes</option>
            <option className="text-black" value="flagged">Flagged first</option>
          </select>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 px-2 py-2 border border-white/10 rounded-md">
            <span>{sorted.length} matches</span>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" variant="outline" onClick={() => exportProjectsCSV(sorted)}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs with counts */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: `All (${countAll})` },
          { value: 'active', label: `Active (${countActive})` },
          { value: 'closed', label: `Closed (${countClosed})` },
          { value: 'flagged', label: `Flagged (${countFlagged})` },
          { value: 'pending', label: `Pending (${countPending})` },
          { value: 'approved', label: `Approved (${countApproved})` },
          { value: 'suspended', label: `Suspended (${countSuspended})` },
        ].map((t) => (
          <Button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            variant="ghost"
            size="sm"
            className={`px-3 py-1 text-sm border ${
              activeTab === t.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
        <span className="text-xs text-gray-300">Selected: {selectedIds.length}</span>
        <div className="flex gap-2">
          <Button onClick={() => bulkAction('approve')} disabled={selectedIds.length === 0}><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
          <Button variant="destructive" onClick={() => bulkAction('suspend')} disabled={selectedIds.length === 0}><Ban className="mr-2 h-4 w-4" />Suspend</Button>
          <Button variant="destructive" onClick={() => bulkAction('remove')} disabled={selectedIds.length === 0}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>
          <Button variant="outline" onClick={() => bulkAction('flag')} disabled={selectedIds.length === 0}><Flag className="mr-2 h-4 w-4" />Flag</Button>
          <Button variant="outline" onClick={() => bulkAction('unflag')} disabled={selectedIds.length === 0}><FlagOff className="mr-2 h-4 w-4" />Unflag</Button>
        </div>
      </div>

      {/* Project Monitoring */}
      <div className="space-y-4">
        {paged.map((project) => (
          <div key={project.id} className="border border-white/10 rounded-lg p-4 bg-black/20 backdrop-blur-sm text-gray-200">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(project.id)}
                    onChange={() => toggleSelectOne(project.id)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <div>
                  <h2 className="text-lg font-semibold text-white">{project.title}</h2>
                  <p><strong>Owner:</strong> {project.owner}</p>
                  <div className="flex items-center gap-2">
                    <p><strong>Status:</strong> {project.status}</p>
                    {project.flagged && <Badge variant="destructive">Flagged</Badge>}
                    {project.status === 'Approved' && <Badge variant="secondary">Trusted</Badge>}
                    {project.status === 'Suspended' && <Badge variant="outline">Suspended</Badge>}
                  </div>
                  <p><strong>Disputes:</strong> {project.disputes}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-end">
                  <Button variant="outline" onClick={() => { setSelectedProject(project); setDetailOpen(true); }}>
                    <Eye className="mr-2 h-4 w-4" /> Details
                  </Button>
                  <Button variant="outline" onClick={() => handleToggleFlag(project.id)}>
                    {project.flagged ? <FlagOff className="mr-2 h-4 w-4" /> : <Flag className="mr-2 h-4 w-4" />} {project.flagged ? 'Unflag' : 'Flag'}
                  </Button>
                  <Button onClick={() => handleVerify(project.id)}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify
                  </Button>
                  <Button onClick={() => handleApprove(project.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleSuspend(project.id)}>
                    <Ban className="mr-2 h-4 w-4" /> Suspend
                  </Button>
                  <Button variant="destructive" onClick={() => handleRemove(project.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                  {project.disputes > 0 && (
                    <Button onClick={() => { setSelectedProject(project); setDisputeOpen(true); }}>Resolve Dispute</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-gray-500">No projects match your criteria.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={selectedIds.length === paged.length && paged.length > 0}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
          />
          <span>Select page</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            variant="ghost"
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white"
            disabled={currentPage === 1}
            leftIcon={ChevronLeft}
          >
            Prev
          </Button>
          <span className="text-gray-300 text-sm">Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            variant="ghost"
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white"
            disabled={currentPage === totalPages}
            rightIcon={ChevronRight}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="border border-white/10 rounded-lg p-4 bg-black/20 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4 text-white">Platform Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
            <XAxis dataKey="month" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="active" stroke="#4F46E5" name="Active Projects" />
            <Line type="monotone" dataKey="disputes" stroke="#EF4444" name="Disputes" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dispute Resolution Modal (inline, no external UI lib) */}
      {disputeOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-6 w-full max-w-md shadow-lg text-gray-200">
            <h3 className="text-lg font-semibold mb-3">Dispute Resolution</h3>
            <div className="space-y-3">
              <p><strong>Project:</strong> {selectedProject.title}</p>
              <p><strong>Owner:</strong> {selectedProject.owner}</p>
              <p>This project has {selectedProject.disputes} disputes. Please review and resolve.</p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setDisputeOpen(false)}>Close</Button>
                <Button onClick={() => { alert(`Dispute for project ${selectedProject.id} resolved.`); setDisputeOpen(false); }}>Resolve Dispute</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {detailOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-6 w-full max-w-lg shadow-lg text-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedProject.title}</h3>
                <p className="text-sm text-gray-400">Owner: {selectedProject.owner}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
                onClick={() => setDetailOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-2">
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Flagged:</strong> {selectedProject.flagged ? 'Yes' : 'No'}</p>
              <p><strong>Disputes:</strong> {selectedProject.disputes}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => { handleToggleFlag(selectedProject.id); }}>
                {selectedProject.flagged ? <FlagOff className="mr-2 h-4 w-4" /> : <Flag className="mr-2 h-4 w-4" />} {selectedProject.flagged ? 'Unflag' : 'Flag'}
              </Button>
              <Button onClick={() => { handleVerify(selectedProject.id); }}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Verify
              </Button>
              <Button onClick={() => { handleApprove(selectedProject.id); }}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button variant="destructive" onClick={() => { handleSuspend(selectedProject.id); }}>
                <Ban className="mr-2 h-4 w-4" /> Suspend
              </Button>
              <Button variant="destructive" onClick={() => { handleRemove(selectedProject.id); setDetailOpen(false); }}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;