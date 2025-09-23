import React, { useState } from "react";
import { Button, Input, Badge } from "../../../components";
import { Plus, Edit, Eye, UserPlus, Star, TrendingUp, XCircle, CheckCircle, XOctagon, Search, Download, Sparkles } from "lucide-react";

const ProjectOwnerProjects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Career Assistant Platform",
      description: "An AI-powered career guidance and job recommendation platform.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 101, name: "Ravi Sharma", skills: "React, Node.js", status: "Pending" },
        { id: 102, name: "Anjali Gupta", skills: "Python, ML", status: "Pending" }
      ]
    },
    {
      id: 2,
      title: "DeFi Portfolio Tracker",
      description: "Track multi-chain assets and yield strategies across chains.",
      status: "Active",
      premium: true,
      applicants: [
        { id: 201, name: "Sanjay Kumar", skills: "Next.js, Rust", status: "Shortlisted" }
      ]
    },
    {
      id: 3,
      title: "Open Health Chatbot",
      description: "RAG over medical corpus with safe responses.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 301, name: "Priya Verma", skills: "Python, FastAPI", status: "Pending" },
        { id: 302, name: "Karan Mehta", skills: "NLP, RAG", status: "Pending" }
      ]
    },
    {
      id: 4,
      title: "Remote Team Dashboard",
      description: "Realtime productivity insights for distributed teams.",
      status: "Closed",
      premium: false,
      applicants: []
    },
    {
      id: 5,
      title: "AI Resume Enhancer",
      description: "Rewrite resumes with role-tailored suggestions.",
      status: "Active",
      premium: true,
      applicants: [
        { id: 501, name: "Nisha Patel", skills: "React, Tailwind", status: "Shortlisted" }
      ]
    },
    {
      id: 6,
      title: "Marketplace Analytics",
      description: "Seller performance and trend analytics.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 601, name: "Rohit Das", skills: "Node, PostgreSQL", status: "Pending" }
      ]
    },
    {
      id: 7,
      title: "Content Moderation AI",
      description: "Detect policy-violating content using ML.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 701, name: "Isha Kapoor", skills: "Python, CNN", status: "Pending" }
      ]
    },
    {
      id: 8,
      title: "Gamified Learning App",
      description: "Quests, badges, and leaderboards for upskilling.",
      status: "Closed",
      premium: true,
      applicants: []
    },
    {
      id: 9,
      title: "Realtime Chat Infra",
      description: "Scalable WebSocket-backed chat for teams.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 901, name: "Veer Singh", skills: "WebSocket, Redis", status: "Rejected" }
      ]
    },
    {
      id: 10,
      title: "Portfolio Sync Tool",
      description: "Auto-sync GitHub repos into live portfolio.",
      status: "Active",
      premium: false,
      applicants: [
        { id: 1001, name: "Aarti Joshi", skills: "GitHub API, React", status: "Pending" },
        { id: 1002, name: "Yash Jain", skills: "Node, OAuth", status: "Pending" }
      ]
    }
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active | closed | premium
  const [sortBy, setSortBy] = useState("recent"); // recent | title | status | applicants | premium

  // Invite developer dialog state
  const [inviteProjectId, setInviteProjectId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Helpers
  const generateAIDescription = (title) => {
    if (!title) return "";
    return `AI-generated: A focused project titled "${title}" aiming to deliver measurable outcomes with clear milestones and collaborative workflows.`;
  };

  const getDerivedMetrics = (project) => {
    const applicantsCount = project.applicants.length;
    const shortlistedCount = project.applicants.filter((a) => a.status === "Shortlisted").length;
    const completionPct = applicantsCount === 0 ? 0 : Math.round((shortlistedCount / applicantsCount) * 100);
    return { applicantsCount, shortlistedCount, completionPct };
  };

  const exportApplicantsCSV = (project) => {
    const headers = ["Applicant ID", "Name", "Skills", "Status"];
    const rows = project.applicants.map((a) => [a.id, a.name, a.skills, a.status]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.replaceAll(" ", "_")}_applicants.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Project management actions
  const handleCreateProject = () => {
    if (!newProject.title) return;
    const description = newProject.description || generateAIDescription(newProject.title);
    const project = {
      id: Date.now(),
      title: newProject.title,
      description,
      status: "Active",
      premium: false,
      applicants: []
    };
    setProjects([...projects, project]);
    setNewProject({ title: "", description: "" });
    setShowCreateForm(false);
  };

  const handleEditProject = (id, updatedData) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  const handleCloseProject = (id) => {
    const project = projects.find((p) => p.id === id);
    const confirmClose = window.confirm(`Close project "${project?.title}"? You can reopen later.`);
    if (!confirmClose) return;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Closed" } : p)));
  };

  const handleTogglePremium = (id) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, premium: !p.premium } : p)));
  };

  const handleInviteDeveloper = (id) => {
    setInviteProjectId(id);
  };

  const sendInvite = () => {
    if (!inviteEmail) return;
    // Placeholder: replace with API call
    console.log("Invite developer", { projectId: inviteProjectId, email: inviteEmail });
    setInviteEmail("");
    setInviteProjectId(null);
  };

  const handleViewApplicants = (projectId) => {
    setSelectedProjectId(projectId);
  };

  // Applicant actions
  const handleShortlistApplicant = (projectId, applicantId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              applicants: project.applicants.map((app) =>
                app.id === applicantId ? { ...app, status: "Shortlisted" } : app
              )
            }
          : project
      )
    );
  };

  const handleRejectApplicant = (projectId, applicantId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              applicants: project.applicants.map((app) =>
                app.id === applicantId ? { ...app, status: "Rejected" } : app
              )
            }
          : project
      )
    );
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && p.status === "Active") ||
      (activeTab === "closed" && p.status === "Closed") ||
      (activeTab === "premium" && p.premium);
    return matchesSearch && matchesTab;
  });

  const sortedProjects = (() => {
    const copy = [...filteredProjects];
    switch (sortBy) {
      case "title":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "status":
        return copy.sort((a, b) => a.status.localeCompare(b.status));
      case "applicants":
        return copy.sort((a, b) => b.applicants.length - a.applicants.length);
      case "premium":
        return copy.sort((a, b) => Number(b.premium) - Number(a.premium));
      case "recent":
      default:
        return copy.sort((a, b) => b.id - a.id);
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Projects</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects"
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
            <option className="text-black" value="status">Status</option>
            <option className="text-black" value="applicants">Applicants</option>
            <option className="text-black" value="premium">Premium first</option>
          </select>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 px-2 py-2 border border-white/10 rounded-md">
            <span>{sortedProjects.length} matches</span>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      </div>

      {/* Tabs replaced with simple button group */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
          { value: "premium", label: "Premium" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`px-3 py-1 rounded-md text-sm border ${
              activeTab === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white/10 text-gray-200 border-white/20 hover:bg-white/20"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Project Creation Form */}
      {showCreateForm && (
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-md text-gray-200">
          <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="p-2 w-full mb-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
          />
          <div className="flex items-start gap-2">
            <textarea
              placeholder="Project Description (optional)"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="p-2 w-full mb-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewProject((np) => ({ ...np, description: np.description || generateAIDescription(np.title) }))}
              className="shrink-0 h-10 mt-0 md:mt-0"
            >
              <Sparkles className="mr-2 h-4 w-4" /> AI Describe
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateProject}>Save Project</Button>
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {sortedProjects.length === 0 ? (
        <p>No projects match your criteria.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sortedProjects.map((project) => {
            const { applicantsCount, shortlistedCount, completionPct } = getDerivedMetrics(project);
            return (
              <div key={project.id} className="border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm">
                <div className="p-4 border-b border-white/10">
                  <div className="text-lg font-semibold text-white">
                    {project.title}
                    {project.premium && <Star className="inline ml-2 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-300">{project.status}</p>
                    {project.premium && <Badge variant="secondary">Premium</Badge>}
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-gray-200">{project.description}</p>

                  {/* Performance analytics */}
                  <div className="bg-white/10 p-3 rounded-md text-sm space-y-2 text-gray-200 border border-white/10">
                    <div className="flex justify-between"><span>Applicants</span><span>{applicantsCount}</span></div>
                    <div className="flex justify-between"><span>Shortlisted</span><span>{shortlistedCount}</span></div>
                    <div>
                      <div className="flex items-center justify-between mb-1"><span>Completion</span><span>{completionPct}%</span></div>
                      <div className="w-full h-2 bg-white/10 rounded">
                        <div className="h-2 bg-blue-500 rounded" style={{ width: `${completionPct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project.id, { title: project.title + " (Edited)" })}>
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCloseProject(project.id)}>
                      <XCircle className="mr-1 h-4 w-4" /> Close
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleInviteDeveloper(project.id)}>
                      <UserPlus className="mr-1 h-4 w-4" /> Invite
                    </Button>
                    <Button variant={project.premium ? "secondary" : "outline"} size="sm" onClick={() => handleTogglePremium(project.id)}>
                      <Star className="mr-1 h-4 w-4" /> {project.premium ? "Remove Premium" : "Boost"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewApplicants(project.id)}>
                      <Eye className="mr-1 h-4 w-4" /> Applicants
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportApplicantsCSV(project)}>
                      <Download className="mr-1 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="mr-1 h-4 w-4" /> Performance
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applicants Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-6 w-full max-w-lg shadow-lg text-gray-200">
            <h2 className="text-xl font-semibold mb-4">Applicants for {selectedProject.title}</h2>
            {selectedProject.applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <div className="space-y-4">
                {selectedProject.applicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center justify-between border border-white/10 p-3 rounded-md">
                    <div>
                      <p className="font-medium text-white">{applicant.name}</p>
                      <p className="text-sm text-gray-300">{applicant.skills}</p>
                      <p className="text-xs text-gray-400">Status: {applicant.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleShortlistApplicant(selectedProject.id, applicant.id)}>
                        <CheckCircle className="mr-1 h-4 w-4" /> Shortlist
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRejectApplicant(selectedProject.id, applicant.id)}>
                        <XOctagon className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => exportApplicantsCSV(selectedProject)}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="secondary" onClick={() => setSelectedProjectId(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Developer Modal (inline, no external UI lib) */}
      {!!inviteProjectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-6 w-full max-w-md shadow-lg text-gray-200">
            <h3 className="text-lg font-semibold mb-3">Invite Developer</h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="developer@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setInviteProjectId(null)}>Cancel</Button>
                <Button onClick={sendInvite} disabled={!inviteEmail}>Send Invite</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOwnerProjects;