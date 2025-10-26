import React, { useState, useMemo, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Award,
  XCircle,
  CheckCircle,
  Zap,
  Users,
  Briefcase,
  TrendingUp,
  Star,
  MessageSquare,
  DollarSign,
  Crown,
  BarChart3,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  Eye,
  ThumbsUp,
} from "lucide-react";
import { ConfirmModal } from "../../../components";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import Button from "../../../components/Button";
import {
  Bio,
  QuickActions,
  SocialLinks,
  UserCard,
  InfoCard,
  DataTable,
} from "../../../components/Profile";
import {
  fetchProjectOwnerStats,
  fetchProjectOwnerProjects,
  fetchProjectOwnerReviews,
  fetchProjectOwnerDevelopers,
  selectProjectOwnerStats,
  selectProjectOwnerProjects,
  selectProjectOwnerReviews,
  selectProjectOwnerDevelopers,
  selectProjectOwnerLoading,
  selectProjectOwnerError,
  clearProjectOwnerData,
} from "../slice/profileSlice";
import { listApplicants } from "../../project/slice/projectSlice";

// Static data for fallback/placeholder content
const SUBSCRIPTION_DATA = {
  plan: "Premium",
  status: "Active",
  features: [
    "Unlimited project postings",
    "Priority listing boost",
    "Advanced analytics",
    "Direct developer messaging",
    "Custom branding",
  ],
  nextBilling: "2025-02-15",
  price: "$99/month",
};

const SKILLS_DATA = [
  "React",
  "Node.js",
  "MongoDB",
  "AWS",
  "Docker",
  "Team Leadership",
];


const ProjectOwner = memo(function ProjectOwner({
  userData,
  form,
  editing,
  setEditing,
  imgError,
  setImgError,
  loading,
  showConfirm,
  handleChange,
  handleSave,
  handleDelete,
  confirmDelete,
  cancelDelete,
  handleAvatarChange,
  navigate,
}) {
  const dispatch = useDispatch();
  
  // Redux selectors
  const stats = useSelector(selectProjectOwnerStats);
  const projects = useSelector(selectProjectOwnerProjects);
  const reviews = useSelector(selectProjectOwnerReviews);
  const developers = useSelector(selectProjectOwnerDevelopers);
  const loadingStates = useSelector(selectProjectOwnerLoading);
  const errors = useSelector(selectProjectOwnerError);
  
  // Filter setup
  const [filterValue, setFilter] = useState("All");
  const [projectApplicants, setProjectApplicants] = useState({});
  const filterOptions = ["Active", "Onboarding", "Suspended"];

  // Load applicants for each project
  const loadProjectApplicants = async (projectList) => {
    const applicantsMap = {};
    for (const project of projectList) {
      try {
        const res = await dispatch(listApplicants(project.id)).unwrap();
        applicantsMap[project.id] = res?.applicants || [];
      } catch (e) {
        console.log(`Error fetching applicants for project ${project.id}:`, e);
        applicantsMap[project.id] = [];
      }
    }
    setProjectApplicants(applicantsMap);
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProjectOwnerProjects());
    dispatch(fetchProjectOwnerDevelopers());
    
    // Cleanup on unmount
    return () => {
      dispatch(clearProjectOwnerData());
    };
  }, [dispatch]);

  // Load applicants when projects are loaded
  useEffect(() => {
    if (projects && projects.length > 0) {
      loadProjectApplicants(projects);
    }
  }, [projects, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Projects data:', projects);
    console.log('Projects length:', projects.length);
    console.log('Projects loading:', loadingStates.projects);
    console.log('Projects error:', errors.projects);
  }, [projects, loadingStates.projects, errors.projects]);

  // Memoized filtered data for projects
  const filteredProjects = useMemo(() => 
    filterValue === "All"
      ? projects
      : projects.filter((project) => {
          if (filterValue === "Active") return project.status === 'active';
          if (filterValue === "Onboarding") return project.status === 'in-progress';
          if (filterValue === "Suspended") return project.status === 'completed';
          return true;
        }),
    [filterValue, projects]
  );

  // Calculate statistics from projects data
  const calculatedStats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalApplicants = Object.values(projectApplicants).flat().length;
    const avgRating = projects.length > 0 ? 
      (projects.reduce((sum, p) => sum + (p.averageRating || 0), 0) / projects.length).toFixed(1) : 0;
    const developerReviews = projects.reduce((sum, p) => sum + (p.reviewCount || 0), 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalApplicants,
      avgRating,
      developerReviews
    };
  }, [projects, projectApplicants]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* User Card */}
          <UserCard
            form={form}
            userData={userData}
            editing={editing}
            imgError={imgError}
            handleChange={handleChange}
            handleAvatarChange={handleAvatarChange}
            handleSave={handleSave}
            setEditing={setEditing}
            handleDelete={handleDelete}
            setImgError={setImgError}
          />

          {/* Bio */}
          <Bio
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Social Links */}
          <SocialLinks
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />
          {/* Developer Management */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Developer Management</h2>
                <p className="text-gray-300 text-sm">Manage projects and their assigned developers</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filterValue === "All" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                }`}
                onClick={() => setFilter("All")}
              >
                All Projects
                <span className="ml-2 text-xs opacity-75">({projects.length})</span>
              </button>
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filterValue === "Active" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                }`}
                onClick={() => setFilter("Active")}
              >
                Active
                <span className="ml-2 text-xs opacity-75">({projects.filter(p => p.status === 'active').length})</span>
              </button>
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filterValue === "Onboarding" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                }`}
                onClick={() => setFilter("Onboarding")}
              >
                In Progress
                <span className="ml-2 text-xs opacity-75">({projects.filter(p => p.status === 'in-progress').length})</span>
              </button>
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filterValue === "Suspended" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                }`}
                onClick={() => setFilter("Suspended")}
              >
                Completed
                <span className="ml-2 text-xs opacity-75">({projects.filter(p => p.status === 'completed').length})</span>
              </button>
            </div>

            {/* Projects and Developers List */}
            {loadingStates.projects || loadingStates.developers ? (
              <div className="flex justify-center items-center py-12">
                <Circular />
              </div>
            ) : errors.projects || errors.developers ? (
              <div className="text-center py-12 text-red-400">
                Error loading data: {errors.projects || errors.developers}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-400 text-lg'>No projects found</p>
                <p className='text-gray-500 text-sm mt-2'>Create your first project to start managing developers</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map((project) => {
                    // Get applicants for this project
                    const projectApplicantsList = projectApplicants[project.id] || [];
                    
                    return (
                      <div key={project.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        {/* Project Header */}
                        <div className="bg-white/5 p-6 border-b border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                  <Briefcase className="w-6 h-6 text-white" />
                                </div>
                    <div>
                                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                  <p className="text-gray-400 text-sm">Project ID: {project.id}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${
                                  project.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                  project.status === 'completed' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}>
                                  {project.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                  {project.status === 'in-progress' && <Clock className="w-3 h-3" />}
                                  {project.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                  {project.status || "Active"}
                                </span>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Posted: {project.postedDate}</span>
                        <span>•</span>
                        <span>Duration: {project.duration}</span>
                        <span>•</span>
                        <span>Budget: {project.budget}</span>
                      </div>
                    </div>
                              
                              {/* Project Skills */}
                              <div className="flex flex-wrap gap-2">
                                {project.skills && project.skills.length > 0 ? (
                                  project.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
                                      React
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
                                      Node.js
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
                                      MongoDB
                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-400">{project.applicants || 0}</div>
                              <div className="text-xs text-gray-400">Applicants</div>
                            </div>
                          </div>
                          
                          {/* Project Stats Row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-400">{project.applicants || 0}</div>
                              <div className="text-xs text-gray-400">Applicants</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-400">{project.matchSuccess || 0}%</div>
                              <div className="text-xs text-gray-400">Match Success</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">{project.skills?.length || 0}</div>
                              <div className="text-xs text-gray-400">Skills Required</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-400">{project.averageRating || 0}</div>
                              <div className="text-xs text-gray-400">Avg Rating</div>
                            </div>
                          </div>
                  </div>
                  
                        {/* Applicants Section */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <Users className="w-5 h-5" />
                              Project Applicants ({projectApplicantsList.length})
                            </h4>
                            <div className="text-sm text-gray-400">
                              {projectApplicantsList.filter(app => app.status === 'applied').length} New Applications
                            </div>
                    </div>
                          
                          {projectApplicantsList.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                              <p className='text-gray-400'>No applicants yet</p>
                              <p className='text-gray-500 text-sm mt-1'>Applicants will appear here once developers apply to this project</p>
                    </div>
                          ) : (
                            <div className="space-y-3">
                              {projectApplicantsList.map((applicant, index) => (
                                <div key={applicant.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {applicant.name?.charAt(0) || "A"}
                    </div>
                                      <div>
                                        <p className="text-white font-medium">{applicant.name || 'Applicant'}</p>
                                        {applicant.email && (
                                          <p className="text-gray-500 text-xs">{applicant.email}</p>
                                        )}
                                        {applicant.experience && (
                                          <p className="text-gray-500 text-xs">{applicant.experience}</p>
                                        )}
                    </div>
                  </div>

                                    <div className="flex items-center gap-6">
                                      {/* Application Status */}
                                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${
                                        applicant.status === 'applied' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                        applicant.status === 'shortlisted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        applicant.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                        applicant.status === 'accepted' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                      }`}>
                                        {applicant.status === 'applied' && <Clock className="w-3 h-3" />}
                                        {applicant.status === 'shortlisted' && <CheckCircle className="w-3 h-3" />}
                                        {applicant.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                        {applicant.status === 'accepted' && <Star className="w-3 h-3" />}
                                        {applicant.status || "Applied"}
                      </span>
                                      
                                      {/* Application Date */}
                                      <div className="text-center">
                                        <p className="text-xs text-gray-400">Applied</p>
                                        <p className="text-sm text-gray-300 font-medium">
                                          {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'Recently'}
                                        </p>
                                      </div>
                                      
                                      {/* Action Buttons */}
                                      <div className="flex items-center gap-2">
                                        {/* <Button className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs hover:bg-blue-500/30 transition-colors duration-300">
                                          <Eye className="w-3 h-3 mr-1 inline" />
                                          View Profile
                                        </Button> */}
                                        
                                        {applicant.status === 'applied' && (
                                          <Button className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 transition-colors duration-300">
                                            <CheckCircle className="w-3 h-3 mr-1 inline" />
                                            Shortlist
                                          </Button>
                                        )}
                                        
                                        {applicant.status === 'shortlisted' && (
                                          <Button className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs hover:bg-purple-500/30 transition-colors duration-300">
                                            <Star className="w-3 h-3 mr-1 inline" />
                                            Accept
                                          </Button>
                                        )}
                                        
                                        <Button className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-500/30 transition-colors duration-300">
                                          <XCircle className="w-3 h-3 mr-1 inline" />
                                          Reject
                                        </Button>
                                      </div>
                                    </div>
                  </div>
                </div>
              ))}
            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>


          {/* Project Statistics */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <BarChart3 className='w-8 h-8 mr-2 text-green-400' /> Project Statistics
            </h2>
            {loadingStates.projects ? (
              <div className='flex justify-center items-center py-8'>
                <Circular />
              </div>
            ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <Briefcase className='w-4 h-4' />
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.totalProjects}</div>
                  <div className='text-sm text-gray-400'>Total Projects Posted</div>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <Target className='w-4 h-4' />
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.activeProjects}</div>
                  <div className='text-sm text-gray-400'>Active Projects</div>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <CheckCircle2 className='w-4 h-4' />
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.completedProjects}</div>
                  <div className='text-sm text-gray-400'>Completed Projects</div>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <Users className='w-4 h-4' />
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.totalApplicants}</div>
                  <div className='text-sm text-gray-400'>Total Applicants</div>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <TrendingUp className='w-4 h-4' />
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.avgRating}/5</div>
                  <div className='text-sm text-gray-400'>Average Rating</div>
                  </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    <Star className='w-4 h-4' />
                </div>
                  <div className='text-2xl font-bold text-white mb-1'>{calculatedStats.developerReviews}</div>
                  <div className='text-sm text-gray-400'>Developer Reviews</div>
            </div>
              </div>
            )}
          </div>

         
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <QuickActions navigate={navigate} handleSave={handleSave} />

          {/* Achievements */}
          <InfoCard
            icon={<Award className='w-5 h-5 text-yellow-400' />}
            title='Achievements'
            items={userData?.badges || []}
            fallback='No achievements yet.'
          />

          {/* Account Info */}
          <InfoCard
            icon={<User className='w-5 h-5 text-yellow-400' />}
            title='Account Info'
            items={[
              { label: "Role", value: userData?.role || "N/A" },
              {
                label: "Email Verified",
                value: userData?.isEmailVerified ? (
                  <CheckCircle className='inline w-4 h-4 text-green-400' />
                ) : (
                  <XCircle className='inline w-4 h-4 text-red-400' />
                ),
              },
              {
                label: "Joined",
                value: userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "N/A",
              },
              {
                label: "Last Updated",
                value: userData?.updatedAt
                  ? new Date(userData.updatedAt).toLocaleDateString()
                  : "N/A",
              },
            ]}
            isKeyValue
          />

          {/* Subscription Details */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Crown className='w-5 h-5 text-yellow-400' />
              <h3 className='text-lg font-semibold'>Subscription</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Plan</span>
                <span className='px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium'>
                  {SUBSCRIPTION_DATA.plan}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Status</span>
                <span className='px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-sm'>
                  {SUBSCRIPTION_DATA.status}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Price</span>
                <span className='text-sm font-medium'>{SUBSCRIPTION_DATA.price}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Next Billing</span>
                <span className='text-sm text-gray-400'>{SUBSCRIPTION_DATA.nextBilling}</span>
              </div>
            </div>
            
            <div className='mt-4 pt-4 border-t border-white/10'>
              <h4 className='text-sm font-medium mb-2'>Premium Features</h4>
              <div className='space-y-1'>
                {SUBSCRIPTION_DATA.features.map((feature, idx) => (
                  <div key={idx} className='flex items-center text-xs text-gray-400'>
                    <CheckCircle className='w-3 h-3 mr-2 text-green-400' />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills & Expertise (Responsive Tags) */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Zap className='w-5 h-5 text-purple-400' />
              <h3 className='text-lg font-semibold'>Skills & Expertise</h3>
            </div>
            <div className='flex flex-wrap gap-2'>
              {SKILLS_DATA.map((skill, idx) => (
                <span
                  key={idx}
                  className='px-3 py-1 text-sm rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30 transition'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Organizational Stats */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <TrendingUp className='w-5 h-5 text-blue-400' />
              <h3 className='text-lg font-semibold'>Organization Stats</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Company Size</span>
                <span className='text-sm font-medium'>50-100 employees</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Industry</span>
                <span className='text-sm font-medium'>Technology</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Founded</span>
                <span className='text-sm font-medium'>2018</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Location</span>
                <span className='text-sm font-medium'>San Francisco, CA</span>
              </div>
            </div>
          </div>
 {/* Developer Reviews */}
 <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <MessageSquare className='w-8 h-8 mr-2 text-yellow-400' /> Developer Reviews
            </h2>
            
            {/* No Reviews State */}
            <div className='text-center py-12'>
              <div className='w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <MessageSquare className='w-10 h-10 text-yellow-400' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-3'>No Reviews Yet</h3>
              <p className='text-gray-400 mb-6 max-w-md mx-auto'>
                Reviews from developers will appear here once they complete projects with you. 
                Encourage feedback to build your reputation!
              </p>
              
              {/* Call to Action */}
              <div className='bg-white/5 rounded-lg p-6 border border-white/10 max-w-md mx-auto'>
                <h4 className='text-lg font-medium text-white mb-3'>Build Your Reputation</h4>
                <div className='space-y-3 text-sm text-gray-300'>
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center'>
                      <CheckCircle className='w-4 h-4 text-green-400' />
                    </div>
                    <span>Complete projects successfully</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center'>
                      <MessageSquare className='w-4 h-4 text-blue-400' />
                    </div>
                    <span>Communicate clearly with developers</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center'>
                      <Star className='w-4 h-4 text-purple-400' />
                    </div>
                    <span>Provide fair compensation</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center'>
                      <ThumbsUp className='w-4 h-4 text-yellow-400' />
                    </div>
                    <span>Ask for reviews after project completion</span>
                    </div>
                    </div>
                  </div>
              
              {/* Stats Preview */}
              <div className='mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-yellow-400'>0</div>
                  <div className='text-xs text-gray-400'>Reviews</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-gray-400'>—</div>
                  <div className='text-xs text-gray-400'>Avg Rating</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-400'>0</div>
                  <div className='text-xs text-gray-400'>Projects</div>
                </div>
                </div>
            </div>
          </div>
          <ConfirmModal
            isOpen={showConfirm}
            title='Delete Account'
            message='Are you sure you want to permanently delete your account? This action cannot be undone.'
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      </div>
    </div>
  );
});

export default ProjectOwner;
