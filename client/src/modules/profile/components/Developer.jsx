import React, { memo, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  Award,
  User,
  Bell,
  CheckCircle,
  XCircle,
  Github,
  Linkedin,
  ExternalLink,
  Star,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Brain,
  Briefcase,
  Clock,
  BookOpen,
  Trophy,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  Download,
  Edit3,
  Plus,
  MapPin,
  Mail,
  Phone,
  Globe,
  Code,
  Users,
  BarChart3,
  Lightbulb,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { ConfirmModal, Modal } from "../../../components";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import Button from "../../../components/Button";
import {
  Bio,
  ProfessionalInfo,
  QuickActions,
  Skills,
  SocialLinks,
  UserCard,
  InfoCard,
} from "../../../components/Profile";
import {
  getDeveloperAppliedProjects,
} from "../../project/slice/projectSlice";

// Reusable components to eliminate code repetition
const SectionCard = memo(({ icon, title, children, className = "" }) => (
  <div className={`bg-white/5 border border-white/10 rounded-xl p-6 ${className}`}>
    <h2 className='text-xl font-semibold mb-4 flex items-center'>
      {icon} {title}
    </h2>
    {children}
  </div>
));

const PortfolioProjectCard = memo(({ project }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
        <p className="text-gray-300 text-sm mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tech.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">{project.stars}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{project.forks}</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{project.duration}</span>
        <Badge className={
          project.status === "Completed" ? "bg-green-500/20 text-green-300" :
          project.status === "In Progress" ? "bg-yellow-500/20 text-yellow-300" :
          "bg-blue-500/20 text-blue-300"
        }>
          {project.status}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 bg-white/10 hover:bg-gray-600/50"
          leftIcon={Github}
        />
        {project.live && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 bg-white/10 hover:bg-gray-600/50"
            leftIcon={ExternalLink}
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 bg-white/10 hover:bg-gray-600/50"
          leftIcon={Eye}
        />
      </div>
    </div>
  </div>
));

const EndorsementCard = memo(({ endorsement }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {endorsement.endorser.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{endorsement.endorser}</h4>
        <p className="text-gray-400 text-sm">{endorsement.endorserTitle}</p>
      </div>
      <div className="flex items-center gap-1">
        {[...Array(endorsement.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
    
    <div className="mb-3">
      <Badge className="bg-blue-500/20 text-blue-300 mb-2">{endorsement.skill}</Badge>
      <p className="text-gray-300 text-sm">{endorsement.message}</p>
    </div>
    
    <div className="text-xs text-gray-400">{endorsement.date}</div>
  </div>
));

const SkillGapCard = memo(({ skillGap }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-white font-medium">{skillGap.skill}</h4>
      <Badge className={
        skillGap.priority === "high" ? "bg-red-500/20 text-red-300" :
        skillGap.priority === "medium" ? "bg-yellow-500/20 text-yellow-300" :
        "bg-green-500/20 text-green-300"
      }>
        {skillGap.priority}
      </Badge>
    </div>
    <p className="text-gray-300 text-sm mb-2">{skillGap.reason}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">Market Demand</span>
      <span className="text-xs text-blue-400">{skillGap.marketDemand}%</span>
    </div>
  </div>
));

const StatusBadge = memo(({ status, type = "project" }) => {
  const getStatusStyles = (status, type) => {
    if (type === "project") {
      return status === 'Applied' ? 'bg-blue-500/20 text-blue-300' :
        status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-green-500/20 text-green-300';
    }
    return status === 'high' ? 'bg-red-500/20 text-red-300' :
      status === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
        'bg-green-500/20 text-green-300';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(status, type)}`}>
      {status}
    </span>
  );
});

const ProgressBar = memo(({ progress, className = "" }) => (
  <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
    <div
      className='bg-blue-500 h-2 rounded-full transition-all duration-300'
      style={{ width: `${progress}%` }}
    />
  </div>
));


const ENDORSEMENTS_DATA = [
  { skill: "React", endorsements: 15, rating: 4.8 },
  { skill: "Node.js", endorsements: 12, rating: 4.7 },
  { skill: "TypeScript", endorsements: 8, rating: 4.9 },
  { skill: "AWS", endorsements: 6, rating: 4.5 },
];

const BADGES_DATA = [
  { name: "Top Performer", description: "Consistently exceeds expectations", color: "bg-yellow-500" },
  { name: "Team Player", description: "Excellent collaboration skills", color: "bg-blue-500" },
  { name: "Problem Solver", description: "Quick to find innovative solutions", color: "bg-green-500" },
  { name: "Mentor", description: "Helps others grow and learn", color: "bg-purple-500" },
];

const ONGOING_TASKS_DATA = [
  { id: 1, task: "Implement user authentication", project: "Web Dashboard", progress: 75, deadline: "2025-02-01" },
  { id: 2, task: "Optimize database queries", project: "API Backend", progress: 40, deadline: "2025-02-15" },
  { id: 3, task: "Write unit tests", project: "Mobile App", progress: 90, deadline: "2025-01-25" },
];

const AI_INSIGHTS_DATA = [
  { type: "skill_gap", title: "Skill Gap Analysis", content: "Consider learning Docker and Kubernetes for containerization", priority: "high" },
  { type: "career", title: "Career Recommendation", content: "Your React skills are strong. Consider specializing in React Native for mobile development", priority: "medium" },
  { type: "market", title: "Market Insight", content: "Full-stack developers with AI knowledge are in high demand", priority: "low" },
];

const Developer = memo(function Developer({
  userData,
  form,
  setForm,
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
  handleResumeChange,
  handleAvatarChange,
  navigate,
}) {
  const dispatch = useDispatch();
  
  // Redux selectors for applied projects
  const myApplications = useSelector((state) => state.project?.myApplications || []);
  const myApplicationsCount = useSelector((state) => state.project?.myApplicationsCount || 0);
  const applicationsLoading = useSelector((state) => state.project?.loading);
  const applicationsError = useSelector((state) => state.project?.error);

  // Details modal state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);

  const openDetails = (item) => {
    setDetailsItem(item);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setDetailsItem(null);
  };

  // Fetch applied projects on component mount
  useEffect(() => {
    dispatch(getDeveloperAppliedProjects());
  }, [dispatch]);


  // Transform applications data for display
  const appliedProjectsData = useMemo(() => {
    if (!myApplications || myApplications.length === 0) {
      return [];
    }
    
    const transformed = myApplications.map((application, index) => ({
      id: application.applicationId || application.id || index + 1,
      title: application.project?.title || application.projectTitle || `Project ${application.projectId}`,
      description: application.project?.description || application.projectDescription || '',
      status: application.status === 'applied' ? 'Applied' : 
              application.status === 'shortlisted' ? 'Under Review' :
              application.status === 'interviewing' ? 'Interview Scheduled' :
              application.status === 'accepted' ? 'Accepted' :
              application.status === 'rejected' ? 'Rejected' : 'Applied',
      date: application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A',
      company: application.project?.company || application.projectCompany || 'Company',
      projectId: application.projectId,
      notes: application.notes || '',
      matchScore: application.matchScore || null,
      category: application.project?.category || application.projectCategory || '',
      experienceLevel: application.project?.experienceLevel || application.projectExperienceLevel || '',
      budget: application.project?.budgetMin && application.project?.budgetMax ? 
              `${application.project?.currency || 'USD'} ${application.project.budgetMin} - ${application.project.budgetMax}` : 
              null,
      location: application.project?.location || application.projectLocation || '',
      isRemote: application.project?.isRemote || application.projectIsRemote,
      duration: application.project?.duration || application.projectDuration || '',
      projectStatus: application.project?.status || application.projectStatus || ''
    }));
    
    return transformed;
  }, [myApplications]);
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navbar */}
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
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

          {/* Professional Info */}
          <ProfessionalInfo
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Resume */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <FileText className='w-8 h-8 mr-2 text-amber-400' /> Resume
            </h2>
            {editing ? (
              <input
                id='file'
                name='file'
                type='file'
                accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/plain'
                onChange={handleResumeChange}
                className='block text-sm text-gray-300'
              />
            ) : userData?.resumeUrl?.url ? (
              <a
                href={userData?.resumeUrl?.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 underline'
              >
                View Resume
              </a>
            ) : (
              <p className='text-gray-400'>No resume uploaded</p>
            )}
          </div>

          {/* Skills */}
          <Skills editing={editing} form={form} setForm={setForm} />

          {/* Social Links */}
          <SocialLinks
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Endorsements & Ratings */}
          <SectionCard
            icon={<Star className='w-8 h-8 mr-2 text-yellow-400' />}
            title={`Endorsements & Ratings (${ENDORSEMENTS_DATA.length})`}
          >
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {ENDORSEMENTS_DATA.map((skill) => (
                  <div key={skill.id} className='bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='font-medium text-lg'>{skill.skill}</span>
                      <div className='flex items-center'>
                        <Star className='w-5 h-5 text-yellow-400 fill-current' />
                        <span className='ml-1 text-lg font-semibold'>{skill.rating}</span>
                      </div>
                    </div>
                    <div className='text-sm text-gray-400 mb-2'>
                      {skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='flex-1 bg-gray-700 rounded-full h-2'>
                        <div
                          className='bg-yellow-400 h-2 rounded-full transition-all duration-300'
                          style={{ width: `${(skill.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className='text-xs text-gray-500'>5.0</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Applied Projects */}
          <SectionCard
            icon={<Briefcase className='w-8 h-8 mr-2 text-green-400' />}
            title={`Applied Projects (${appliedProjectsData.length})`}
          >
            <div className='space-y-3'>
              {applicationsLoading ? (
                <div className='text-center py-8 text-gray-400'>
                  <div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
                  <p>Loading applications...</p>
                </div>
              ) : applicationsError ? (
                <div className='text-center py-8 text-red-400'>
                  <XCircle className='w-12 h-12 mx-auto mb-4 opacity-50' />
                  <p>Error loading applications</p>
                  <p className='text-sm text-gray-500'>{applicationsError}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(getDeveloperAppliedProjects())}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : appliedProjectsData.length > 0 ? (
                appliedProjectsData.map((project) => (
                  <div key={project.id} className='bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-medium text-lg mb-1'>{project.title}</h3>
                        {project.description && (
                          <p className='text-sm text-gray-300 mb-2 line-clamp-2'>{project.description}</p>
                        )}
                      </div>
                      <StatusBadge status={project.status} type="project" />
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                      <div className='flex items-center text-sm text-gray-400'>
                        <MapPin className='w-4 h-4 mr-2' />
                        <span>{project.company}</span>
                      </div>
                      
                      {project.category && (
                        <div className='flex items-center text-sm text-gray-400'>
                          <Code className='w-4 h-4 mr-2' />
                          <span>{project.category}</span>
                        </div>
                      )}
                      
                      {project.experienceLevel && (
                        <div className='flex items-center text-sm text-gray-400'>
                          <Target className='w-4 h-4 mr-2' />
                          <span>{project.experienceLevel}</span>
                        </div>
                      )}
                      
                      {project.budget && (
                        <div className='flex items-center text-sm text-gray-400'>
                          <BarChart3 className='w-4 h-4 mr-2' />
                          <span>{project.budget}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
                      <span>Applied: {project.date}</span>
                      {project.matchScore && (
                        <span className='text-blue-400 font-medium'>
                          Match: {project.matchScore}%
                        </span>
                      )}
                    </div>
                    
                    {project.notes && (
                      <div className='text-xs text-gray-400 bg-gray-800/50 p-2 rounded border-l-2 border-gray-600'>
                        <strong>Notes:</strong> {project.notes}
                      </div>
                    )}
                    
                    <div className='flex items-center justify-between mt-3 pt-2 border-t border-gray-700'>
                      <div className='flex items-center space-x-4 text-xs text-gray-500'>
                        {project.isRemote && (
                          <span className='flex items-center'>
                            <Globe className='w-3 h-3 mr-1' />
                            {project.location}
                          </span>
                        )}
                        {project.duration && (
                          <span className='flex items-center'>
                            <Clock className='w-3 h-3 mr-1' />
                            {project.duration}
                          </span>
                        )}
                        {project.location && !project.isRemote && (
                          <span className='flex items-center'>
                            <MapPin className='w-3 h-3 mr-1' />
                            {project.location}
                          </span>
                        )}
                      </div>
                      
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-white/10 hover:bg-gray-600/50"
                          leftIcon={Eye}
                          onClick={() => openDetails(project)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-white/10 hover:bg-gray-600/50"
                          leftIcon={ExternalLink}
                          onClick={() => navigate('/project?tab=applications')}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-12 text-gray-400'>
                  <Briefcase className='w-16 h-16 mx-auto mb-4 opacity-50' />
                  <h3 className='text-lg font-medium mb-2'>No Applications Yet</h3>
                  <p className='text-sm mb-4'>Start applying to projects to see them here</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/projects')}
                    leftIcon={Plus}
                  >
                    Browse Projects
                  </Button>
                </div>
              )}
            </div>
          </SectionCard>


        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>
          <QuickActions navigate={navigate} handleSave={handleSave} />

          {/* Availability Status */}
          <SectionCard
            icon={<Calendar className='w-5 h-5 text-green-400 mr-2' />}
            title="Availability"
            className="lg:block"
          >
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-300'>Status</span>
              <span className='px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm'>
                Available
              </span>
            </div>
            <div className='mt-3 text-sm text-gray-400'>
              <div>Next available: Immediately</div>
              <div>Preferred hours: 9 AM - 6 PM</div>
            </div>
          </SectionCard>

          {/* Badges & Achievements */}
          <SectionCard
            icon={<Award className='w-5 h-5 text-yellow-400 mr-2' />}
            title="Badges & Achievements"
            className="lg:block"
          >
            <div className='space-y-3'>
              {BADGES_DATA.map((badge, index) => (
                <div key={index} className='flex items-start space-x-3'>
                  <div className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center`}>
                    <Award className='w-4 h-4 text-white' />
                  </div>
                  <div>
                    <div className='font-medium text-sm'>{badge.name}</div>
                    <div className='text-xs text-gray-400'>{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
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
          <InfoCard
            icon={<Bell className='w-5 h-5 text-yellow-400' />}
            title='Notification Preferences'
            items={Object.entries(userData?.notificationPrefs || {}).map(
              ([key, value]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: value ? "Enabled" : "Disabled",
              })
            )}
            fallback='No notification preferences set.'
            isKeyValue
          />
          {/* Ongoing Tasks */}
          <SectionCard
            icon={<Clock className='w-8 h-8 mr-2 text-orange-400' />}
            title="Ongoing Tasks"
          >
            <div className='space-y-4'>
              {ONGOING_TASKS_DATA.map((task) => (
                <div key={task.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='font-medium'>{task.task}</h3>
                    <span className='text-sm text-gray-400'>{task.project}</span>
                  </div>
                  <div className='mb-2'>
                    <div className='flex justify-between text-sm text-gray-400 mb-1'>
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <ProgressBar progress={task.progress} />
                  </div>
                  <div className='text-sm text-gray-500'>Deadline: {task.deadline}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* AI Insights */}
          <SectionCard
            icon={<Brain className='w-8 h-8 mr-2 text-purple-400' />}
            title="AI Insights"
          >
            <div className='space-y-4'>
              {AI_INSIGHTS_DATA.map((insight, index) => (
                <div key={index} className={`bg-white/5 rounded-lg p-4 border border-white/10 ${insight.priority === 'high' ? 'border-red-400/30' :
                    insight.priority === 'medium' ? 'border-yellow-400/30' :
                      'border-green-400/30'
                  }`}>
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-medium flex items-center'>
                      {insight.priority === 'high' ? <TrendingUp className='w-4 h-4 mr-1 text-red-400' /> :
                        insight.priority === 'medium' ? <Target className='w-4 h-4 mr-1 text-yellow-400' /> :
                          <Zap className='w-4 h-4 mr-1 text-green-400' />}
                      {insight.title}
                    </h3>
                    <StatusBadge status={insight.priority} type="insight" />
                  </div>
                  <p className='text-sm text-gray-300'>{insight.content}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          {/* Confirm Modal */}
          <ConfirmModal
            isOpen={showConfirm}
            title='Delete Account'
            message='Are you sure you want to permanently delete your account? This action cannot be undone.'
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      </div>
      {/* Details Modal */}
      <ApplicationDetailsModal isOpen={isDetailsOpen} onClose={closeDetails} item={detailsItem} />
    </div>
  );
});

// Details Modal Renderer
const ApplicationDetailsModal = memo(({ isOpen, onClose, item }) => {
  if (!item) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title || 'Application Details'}
      subtitle={item.company || ''}
      size="large"
    >
      <div className='p-6 overflow-y-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InfoRow label='Status' value={item.status} />
          <InfoRow label='Applied On' value={item.date} />
          {item.category && <InfoRow label='Category' value={item.category} />}
          {item.experienceLevel && <InfoRow label='Experience' value={item.experienceLevel} />}
          {item.budget && <InfoRow label='Budget' value={item.budget} />}
          {item.location && <InfoRow label='Location' value={item.location} />}
          {item.isRemote !== undefined && (
            <InfoRow label='Remote' value={item.isRemote ? 'Yes' : 'No'} />
          )}
          {item.duration && <InfoRow label='Duration' value={item.duration} />}
          {item.projectId && <InfoRow label='Project ID' value={item.projectId} />}
        </div>

        {item.description && (
          <div className='mt-6'>
            <h4 className='text-white font-semibold mb-2'>Description</h4>
            <p className='text-gray-300 text-sm leading-relaxed'>{item.description}</p>
          </div>
        )}

        <div className='mt-6 flex justify-end'>
          <Button onClick={onClose} className='bg-white/10 hover:bg-white/20'>Close</Button>
        </div>
      </div>
    </Modal>
  );
});

const InfoRow = ({ label, value }) => (
  <div className='bg-white/5 border border-white/10 rounded-lg p-3'>
    <div className='text-xs text-gray-400'>{label}</div>
    <div className='text-sm text-white'>{value || '—'}</div>
  </div>
);

export default Developer;
