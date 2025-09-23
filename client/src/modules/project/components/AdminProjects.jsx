import React, { useState } from 'react';
import { Button, Badge, Input } from "../../../components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Download, Flag, FlagOff, ShieldCheck, CheckCircle, Ban, Trash2 } from "lucide-react";

const AdminProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active | closed | flagged | pending | approved | suspended
  const [sortBy, setSortBy] = useState("recent"); // recent | title | owner | status | disputes | flagged

  const [projects, setProjects] = useState([
    { id: 1, title: "AI Resume Builder", owner: "Alice", status: "Pending Verification", disputes: 0, flagged: false },
    { id: 2, title: "Blockchain Voting System", owner: "Bob", status: "Approved", disputes: 2, flagged: true },
    { id: 3, title: "Mental Health Platform", owner: "Charlie", status: "Suspended", disputes: 1, flagged: false },
    { id: 4, title: "Marketplace Analytics", owner: "Dana", status: "Active", disputes: 0, flagged: false },
    { id: 5, title: "Content Moderation AI", owner: "Evan", status: "Closed", disputes: 0, flagged: true },
    { id: 6, title: "DeFi Portfolio Tracker", owner: "Frank", status: "Active", disputes: 0, flagged: false },
    { id: 7, title: "Open Health Chatbot", owner: "Grace", status: "Approved", disputes: 3, flagged: false },
    { id: 8, title: "Remote Team Dashboard", owner: "Hank", status: "Closed", disputes: 0, flagged: false },
    { id: 9, title: "Gamified Learning App", owner: "Irene", status: "Suspended", disputes: 2, flagged: true },
    { id: 10, title: "Realtime Chat Infra", owner: "Jay", status: "Active", disputes: 1, flagged: false }
  ]);

  const analyticsData = [
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

  const handleVerify = (id) => {
    const proj = projects.find((p) => p.id === id);
    if (!window.confirm(`Verify project "${proj?.title}"?`)) return;
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status: "Verified" } : p));
    alert(`Project ${id} verified.`);
  };

  const handleSuspend = (id) => {
    const proj = projects.find((p) => p.id === id);
    if (!window.confirm(`Suspend project "${proj?.title}"?`)) return;
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status: "Suspended" } : p));
    alert(`Project ${id} suspended.`);
  };

  const handleApprove = (id) => {
    const proj = projects.find((p) => p.id === id);
    if (!window.confirm(`Approve project "${proj?.title}"?`)) return;
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status: "Approved" } : p));
    alert(`Project ${id} approved.`);
  };

  const handleRemove = (id) => {
    const proj = projects.find((p) => p.id === id);
    if (!window.confirm(`Remove project "${proj?.title}"? This cannot be undone.`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    alert(`Project ${id} removed.`);
  };

  const handleToggleFlag = (id) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, flagged: !p.flagged } : p));
  };

  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQ = p.title.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q) || p.status.toLowerCase().includes(q);
    const matchesTab = activeTab === 'all'
      || (activeTab === 'active' && p.status === 'Active')
      || (activeTab === 'closed' && p.status === 'Closed')
      || (activeTab === 'flagged' && p.flagged)
      || (activeTab === 'pending' && p.status === 'Pending Verification')
      || (activeTab === 'approved' && p.status === 'Approved')
      || (activeTab === 'suspended' && p.status === 'Suspended');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Project Oversight</h1>

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

      {/* Tabs replaced with button group */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'closed', label: 'Closed' },
          { value: 'flagged', label: 'Flagged' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'suspended', label: 'Suspended' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`px-3 py-1 rounded-md text-sm border ${
              activeTab === t.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Project Monitoring */}
      <div className="space-y-4">
        {sorted.map((project) => (
          <div key={project.id} className="border border-white/10 rounded-lg p-4 bg-black/20 backdrop-blur-sm text-gray-200">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
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
                <div className="flex flex-wrap gap-2 mt-2 justify-end">
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
    </div>
  );
};

export default AdminProjects;