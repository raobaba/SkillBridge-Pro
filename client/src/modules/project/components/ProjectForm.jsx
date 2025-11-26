// components/ProjectForm.jsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, 
  UploadCloud, 
  X, 
  Save, 
  Eye, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock, 
  Briefcase, 
  Tag, 
  Code, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  Award, 
  Globe, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Image, 
  Link, 
  Mail, 
  Phone, 
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { Input, Button } from "../../../components";
import { createProject, generateProjectDescription, generateRequirements, generateBenefits, generateBudgetSuggestions, updateProject } from "../slice/projectSlice";
import { getSearchSuggestionsApi } from "../slice/projectAction";

const ProjectForm = forwardRef(({ dispatch, onProjectCreated, onProjectUpdated, editingProject, showPreview: externalShowPreview, showAdvanced: externalShowAdvanced }, ref) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roleNeeded: "",
    startDate: "",
    deadline: "",
    tags: [],
    maxApplicants: "",
    priority: "Medium",
    status: "Active",
    collaborators: [],
    color: "#7f00ff",
    budget: "",
    location: "",
    duration: "",
    experience: "",
    skills: [],
    requirements: "",
    benefits: "",
    company: "",
    website: "",
    repositoryUrl: "",
    contactEmail: "",
    contactPhone: "",
    attachments: [],
    isRemote: true,
    isUrgent: false,
    isFeatured: false,
    category: "",
    subcategory: "",
    timezone: "",
    language: "English",
    currency: "USD"
  });

  const [tagInput, setTagInput] = useState("");
  const [collabInput, setCollabInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [skillSearchLoading, setSkillSearchLoading] = useState(false);
  const [tagSearchLoading, setTagSearchLoading] = useState(false);
  // Preview/Advanced now controlled by parent
  const showPreview = externalShowPreview ?? false;
  const showAdvanced = externalShowAdvanced ?? false;
  const [errors, setErrors] = useState({});
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [generatingReq, setGeneratingReq] = useState(false);
  const [generatingBenefits, setGeneratingBenefits] = useState(false);
  const projectState = useSelector((state) => state.project);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editingProject && editingProject.id);

  const statuses = ["Active", "Draft", "Upcoming", "Paused", "Completed"];
  const priorities = ["High", "Medium", "Low"];
  const categories = ["Web Development", "Mobile Development", "Data Science", "AI/ML", "DevOps", "Design", "Marketing", "Other"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Lead/Architect"];
  const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese"];

  const skillColors = [
    "from-purple-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-400",
    "from-red-400 to-pink-500",
    "from-cyan-400 to-blue-500"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    // Enforce 1000 character limit for description regardless of source
    const clampedValue = name === 'description' && typeof nextValue === 'string'
      ? nextValue.slice(0, 1000)
      : nextValue;
    setFormData({ 
      ...formData, 
      [name]: clampedValue 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
      setTagSuggestions([]);
    }
  };

  const handleAddTagValue = (value) => {
    const val = (value || '').trim();
    if (!val) return;
    if (!formData.tags.includes(val)) {
      setFormData({ ...formData, tags: [...formData.tags, val] });
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleRemoveTag = (index) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter((_, i) => i !== index) 
    });
  };

  const handleAddCollaborator = () => {
    if (collabInput && !formData.collaborators.includes(collabInput)) {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, collabInput],
      });
      setCollabInput("");
    }
  };

  const handleRemoveCollaborator = (index) => {
    setFormData({ 
      ...formData, 
      collaborators: formData.collaborators.filter((_, i) => i !== index) 
    });
  };

  const handleAddSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput("");
      setSkillSuggestions([]);
    }
  };

  const handleAddSkillValue = (value) => {
    const val = (value || '').trim();
    if (!val) return;
    if (!formData.skills.includes(val)) {
      setFormData({ ...formData, skills: [...formData.skills, val] });
    }
    setSkillInput("");
    setSkillSuggestions([]);
  };

  const handleRemoveSkill = (index) => {
    setFormData({ 
      ...formData, 
      skills: formData.skills.filter((_, i) => i !== index) 
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ 
      ...formData, 
      attachments: [...formData.attachments, ...files] 
    });
  };

  const removeAttachment = (index) => {
    setFormData({ 
      ...formData, 
      attachments: formData.attachments.filter((_, i) => i !== index) 
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.roleNeeded.trim()) newErrors.roleNeeded = "Role needed is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (formData.tags.length === 0) newErrors.tags = "At least one skill/tag is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const projectData = {
        title: formData.title,
        description: formData.description,
        roleNeeded: formData.roleNeeded,
        status: formData.status.toLowerCase(),
        priority: formData.priority.toLowerCase(),
        category: formData.category,
        experienceLevel: formData.experience.toLowerCase().replace(' level', ''),
        budgetMin: formData.budget ? parseInt(formData.budget.split('-')[0].replace(/[^0-9]/g, '')) : null,
        budgetMax: formData.budget ? parseInt(formData.budget.split('-')[1]?.replace(/[^0-9]/g, '') || formData.budget.split('-')[0].replace(/[^0-9]/g, '')) : null,
        currency: formData.currency,
        isRemote: formData.isRemote,
        isUrgent: formData.isUrgent,
        isFeatured: formData.isFeatured,
        location: formData.location,
        duration: formData.duration,
        startDate: formData.startDate,
        deadline: formData.deadline,
        requirements: formData.requirements,
        benefits: formData.benefits,
        company: formData.company,
        website: formData.website,
        repositoryUrl: formData.repositoryUrl,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : null,
        language: formData.language,
        timezone: formData.timezone,
        skills: formData.skills,
        tags: formData.tags
      };

      if (isEditMode) {
        // Update existing project
        await dispatch(updateProject({ id: editingProject.id, data: projectData })).unwrap();
      } else {
        // Create new project
        await dispatch(createProject(projectData)).unwrap();
      }
      
      // Reset form if not editing
      if (!isEditMode) {
        setFormData({
        title: "",
        description: "",
        roleNeeded: "",
        startDate: "",
        deadline: "",
        tags: [],
        maxApplicants: "",
        priority: "Medium",
        status: "Active",
        collaborators: [],
        color: "#7f00ff",
        budget: "",
        location: "",
        duration: "",
        experience: "",
        skills: [],
        requirements: "",
        benefits: "",
        company: "",
        website: "",
        repositoryUrl: "",
        contactEmail: "",
        contactPhone: "",
        attachments: [],
        isRemote: true,
        isUrgent: false,
        isFeatured: false,
        category: "",
        subcategory: "",
        timezone: "",
        language: "English",
        currency: "USD"
        });
      }
      
      setIsSubmitting(false);
      
      // Call the appropriate callback
      if (isEditMode) {
        onProjectUpdated && onProjectUpdated();
      } else {
        onProjectCreated && onProjectCreated();
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      setIsSubmitting(false);
      // Error handling is done by Redux slice
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleAISuggestionApplied = (type, value) => {
    switch (type) {
      case 'description':
        setFormData({ ...formData, description: value });
        break;
      case 'title':
        setFormData({ ...formData, title: value });
        break;
      case 'skill':
        setFormData({ 
          ...formData, 
          skills: formData.skills.includes(value) 
            ? formData.skills 
            : [...formData.skills, value] 
        });
        break;
      case 'requirements':
        setFormData({ ...formData, requirements: value });
        break;
      case 'benefits':
        setFormData({ ...formData, benefits: value });
        break;
      case 'budget':
        setFormData({ ...formData, budget: value });
        break;
      default:
        break;
    }
  };

  // Expose imperative methods to parent container
  useImperativeHandle(ref, () => ({
    applyAISuggestion: handleAISuggestionApplied,
    getFormData: () => ({ ...formData })
  }));

  // Populate form when editing
  React.useEffect(() => {
    if (!isEditMode) return;
    const p = editingProject || {};
    const formatDateInput = (d) => {
      if (!d) return "";
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return "";
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    setFormData((prev) => ({
      ...prev,
      title: p.title || "",
      description: p.description || "",
      roleNeeded: p.roleNeeded || "",
      status: (p.status || prev.status || '').replace(/^./, (c) => c.toUpperCase()),
      priority: (p.priority || prev.priority || '').replace(/^./, (c) => c.toUpperCase()),
      category: p.category || "",
      experience: p.experience || prev.experience,
      budget: p.budget || (p.budgetMin && p.budgetMax ? `$${p.budgetMin.toLocaleString()} - $${p.budgetMax.toLocaleString()}` : ""),
      location: p.location || "",
      duration: p.duration || "",
      startDate: formatDateInput(p.startDate),
      deadline: formatDateInput(p.deadline),
      requirements: p.requirements || "",
      benefits: p.benefits || "",
      company: p.company || "",
      website: p.website || "",
      repositoryUrl: p.repositoryUrl || p.repository_url || "",
      maxApplicants: (typeof p.maxApplicants === 'number' ? String(p.maxApplicants) : (p.maxApplicants || "")),
      language: p.language || prev.language,
      timezone: p.timezone || "",
      isRemote: !!p.isRemote,
      isUrgent: !!p.isUrgent,
      isFeatured: !!p.isFeatured,
      // Prefer real skills array; do not fall back to tags to avoid duplication
      skills: Array.isArray(p.skills) ? p.skills : prev.skills,
      tags: Array.isArray(p.tags) ? p.tags : prev.tags,
      color: p.color || prev.color,
    }));
  }, [isEditMode, editingProject]);

  // Debounced search: skills
  React.useEffect(() => {
    const q = (skillInput || '').trim();
    if (q.length < 2) {
      setSkillSuggestions([]);
      return;
    }
    setSkillSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await getSearchSuggestionsApi(q, 'skills');
        const suggestions = res?.data?.suggestions?.skills || [];
        setSkillSuggestions(suggestions);
      } catch {
        setSkillSuggestions([]);
      } finally {
        setSkillSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [skillInput]);

  // Debounced search: tags
  React.useEffect(() => {
    const q = (tagInput || '').trim();
    if (q.length < 2) {
      setTagSuggestions([]);
      return;
    }
    setTagSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await getSearchSuggestionsApi(q, 'tags');
        const suggestions = res?.data?.suggestions?.tags || [];
        setTagSuggestions(suggestions);
      } catch {
        setTagSuggestions([]);
      } finally {
        setTagSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [tagInput]);

  return (
    <div className="space-y-6">
      {/* Header removed; toggles moved to parent */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                  <Input
                    label={isEditMode ? "Edit Project Title" : "Project Title"}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter project title"
                      error={errors.title}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-300">Description</label>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the project in detail"
                      rows={4}
                      maxLength={1000}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-gray-400 text-xs">
                        {Math.min(formData.description.length, 1000)}/1000 characters
                      </p>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            setGeneratingDesc(true);
                            const payload = {
                              title: formData.title,
                              category: formData.category,
                              skills: formData.skills,
                              budget: formData.budget,
                              duration: formData.duration,
                              experience: formData.experience,
                              location: formData.location,
                              company: formData.company,
                              requirements: formData.requirements,
                              benefits: formData.benefits,
                            };
                            const res = await dispatch(generateProjectDescription(payload)).unwrap();
                            const description = (res && res.description) || projectState?.aiSuggestions?.description || '';
                            if (description) {
                              setFormData({ ...formData, description: description.slice(0, 1000) });
                            }
                          } catch (e) {
                            // ignore
                          } finally {
                            setGeneratingDesc(false);
                          }
                        }}
                        title="AI Assistant"
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full shadow-md transition-all duration-200 ${generatingDesc ? 'bg-purple-500/70 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {generatingDesc ? 'Generating…' : 'AI Assistant'}
                      </Button>
                    </div>
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company/Organization"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      type="url"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Repository URL"
                      name="repositoryUrl"
                      value={formData.repositoryUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username/project-name"
                      type="url"
                      leftIcon={Link}
                    />
                    <div className="flex items-end">
                      <div className="text-sm text-gray-400">
                        <p className="mb-1">💡 Tip: Add your GitHub/GitLab repository URL</p>
                        <p className="text-xs">Developers will be able to clone this after being accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Project Details
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Role Needed"
                      name="roleNeeded"
                      value={formData.roleNeeded}
                      onChange={handleChange}
                      placeholder="Frontend Developer"
                      error={errors.roleNeeded}
                      required
                    />
                    <Input
                      label="Experience Level"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      type="select"
                      options={experienceLevels.map(level => ({ label: level, value: level }))}
                    />
                    <Input
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      type="select"
                      options={categories.map(cat => ({ label: cat, value: cat }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      type="date"
                      error={errors.startDate}
                      required
                    />
                    <Input
                      label="Deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      type="date"
                      error={errors.deadline}
                      required
                    />
                    <Input
                      label="Duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="3-6 months"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="$50,000 - $100,000"
                      error={errors.budget}
                      required
                    />
                    <Input
                      label="Max Applicants"
                      name="maxApplicants"
                      type="number"
                      value={formData.maxApplicants}
                      onChange={handleChange}
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Work Setup */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Location & Work Setup
                </h3>
                
                <div className="space-y-4">
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA or Remote"
                    error={errors.location}
                    required
                  />
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">Remote work allowed</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                      />
                      <span className="text-white text-sm">Urgent project</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Skills & Requirements */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-orange-400" />
                  Skills & Requirements
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Required Skills</label>
                    <div className="flex gap-2 mb-1 relative">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill (e.g., React, Python)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (skillSuggestions && skillSuggestions.length > 0) {
                              handleAddSkillValue(skillSuggestions[0]);
                            } else {
                              handleAddSkill();
                            }
                          } else {
                            handleKeyPress(e, handleAddSkill);
                          }
                        }}
                      />
                      <Button 
                        onClick={handleAddSkill} 
                        leftIcon={Plus} 
                        variant="outline"
                        className="transition-transform duration-300"
                      >
                        Add
                      </Button>
                      {skillInput && skillSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-slate-900/95 border border-white/10 rounded-lg shadow-lg max-h-44 overflow-auto">
                          {skillSuggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddSkillValue(s)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                            >
                              {s}
                            </button>
                          ))}
                          {skillSearchLoading && (
                            <div className="px-3 py-2 text-xs text-gray-400">Searching…</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[idx % skillColors.length]} flex items-center gap-1  transition-transform duration-300`}
                        >
                          <Tag className="w-3 h-3" />
                          {skill}
                          <Button
                            onClick={() => handleRemoveSkill(idx)}
                            variant="ghost"
                            size="sm"
                            className="ml-1 hover:text-red-300 transition-colors duration-300"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Project Tags</label>
                    <div className="flex gap-2 mb-1 relative">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tagSuggestions && tagSuggestions.length > 0) {
                              handleAddTagValue(tagSuggestions[0]);
                            } else {
                              handleAddTag();
                            }
                          } else {
                            handleKeyPress(e, handleAddTag);
                          }
                        }}
                      />
                      <Button 
                        onClick={handleAddTag} 
                        leftIcon={Plus} 
                        variant="outline"
                        className="transition-transform duration-300"
                      >
                        Add
                      </Button>
                      {tagInput && tagSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-slate-900/95 border border-white/10 rounded-lg shadow-lg max-h-44 overflow-auto">
                          {tagSuggestions.map((t, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddTagValue(t)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                            >
                              {t}
                            </button>
                          ))}
                          {tagSearchLoading && (
                            <div className="px-3 py-2 text-xs text-gray-400">Searching…</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-1  transition-transform duration-300"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <Button
                            onClick={() => handleRemoveTag(idx)}
                            variant="ghost"
                            size="sm"
                            className="ml-1 hover:text-red-300 transition-colors duration-300"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                    {errors.tags && <p className="text-red-400 text-xs mt-1">{errors.tags}</p>}
                  </div>

                  <div className="relative">
                    <Input
                      label="Additional Requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Any specific requirements or qualifications"
                      textarea
                      rows={3}
                    />
                    <div className="mt-2 flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            setGeneratingReq(true);
                            const payload = {
                              title: formData.title,
                              category: formData.category,
                              experience: formData.experience
                            };
                            const res = await dispatch(generateRequirements(payload)).unwrap();
                            const requirements = res?.requirements || projectState?.aiSuggestions?.requirements || '';
                            if (requirements) setFormData({ ...formData, requirements });
                          } catch {}
                          finally {
                            setGeneratingReq(false);
                          }
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full shadow-md text-white ${generatingReq ? 'bg-purple-500/70 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
                      >
                        <Sparkles className="w-3 h-3" /> {generatingReq ? 'Generating…' : 'AI Assistant'}
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      label="Benefits & Perks"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="What benefits do you offer?"
                      textarea
                      rows={3}
                    />
                    <div className="mt-2 flex items-center justify-end">
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            setGeneratingBenefits(true);
                            const payload = {
                              category: formData.category,
                              company: formData.company,
                              budget: formData.budget
                            };
                            const res = await dispatch(generateBenefits(payload)).unwrap();
                            const benefits = res?.benefits || projectState?.aiSuggestions?.benefits || '';
                            if (benefits) setFormData({ ...formData, benefits });
                          } catch {}
                          finally {
                            setGeneratingBenefits(false);
                          }
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full shadow-md text-white ${generatingBenefits ? 'bg-purple-500/70 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
                      >
                        <Sparkles className="w-3 h-3" /> {generatingBenefits ? 'Generating…' : 'AI Assistant'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Settings */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Project Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    type="select"
                    options={priorities.map((p) => ({ label: p, value: p }))}
                  />
                  <Input
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    type="select"
                    options={statuses.map((s) => ({ label: s, value: s }))}
                  />
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                    />
                    <span className="text-white text-sm">Featured project</span>
                  </label>
                </div>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Advanced Options
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        type="select"
                        options={languages.map(lang => ({ label: lang, value: lang }))}
                      />
                      <Input
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        type="select"
                        options={currencies.map(curr => ({ label: curr, value: curr }))}
                      />
                      <Input
                        label="Timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        placeholder="UTC-8 (PST)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Contact Email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        type="email"
                        placeholder="contact@company.com"
                      />
                      <Input
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* File Attachments */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-400" />
                  File Attachments
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                    <UploadCloud className="w-5 h-5" />
                    Upload Files
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif"
                    />
                  </label>
                  
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">Attached Files:</p>
                      {formData.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-white text-sm">{file.name}</span>
                            <span className="text-gray-400 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            onClick={() => removeAttachment(idx)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                  variant="default" 
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditMode ? 'Saving...' : 'Publishing...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Save Changes' : 'Publish Project'}
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  className="flex-1 transition-transform duration-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="xl:col-span-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                Project Preview
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">
                    {formData.title || "Project Title"}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    {formData.description?.substring(0, 100) || "Project description..."}
                    {formData.description?.length > 100 && "..."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[idx % skillColors.length]}`}
                      >
                        {skill}
                      </span>
                    ))}
                    {formData.skills.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10">
                        +{formData.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formData.budget || "Budget not set"}</span>
                    <span>{formData.location || "Location not set"}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    This is how your project will appear to applicants
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProjectForm;
