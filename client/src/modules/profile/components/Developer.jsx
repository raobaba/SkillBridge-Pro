import React, { memo, useState, useMemo } from "react";
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
import ConfirmModal from "../../../components/modal/ConfirmModal";
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

// Enhanced data for Developer portfolio features
const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    status: "Completed",
    duration: "3 months",
    github: "https://github.com/user/ecommerce",
    live: "https://ecommerce-demo.com",
    stars: 45,
    forks: 12,
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management with real-time updates",
    tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
    status: "Completed",
    duration: "2 months",
    github: "https://github.com/user/taskapp",
    live: "https://taskapp-demo.com",
    stars: 32,
    forks: 8,
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Real-time weather tracking with data visualization",
    tech: ["React", "D3.js", "OpenWeather API"],
    status: "In Progress",
    duration: "1 month",
    github: "https://github.com/user/weather",
    live: null,
    stars: 18,
    forks: 5,
    image: "/api/placeholder/400/200"
  }
];

const ENDORSEMENTS = [
  {
    id: 1,
    endorser: "Sarah Johnson",
    endorserTitle: "Senior Developer at TechCorp",
    endorserAvatar: "/api/placeholder/40/40",
    skill: "React",
    message: "Excellent React developer with deep understanding of hooks and state management.",
    rating: 5,
    date: "2025-01-15"
  },
  {
    id: 2,
    endorser: "Mike Chen",
    endorserTitle: "Project Manager at StartupXYZ",
    endorserAvatar: "/api/placeholder/40/40",
    skill: "Node.js",
    message: "Outstanding backend development skills. Delivered complex APIs on time.",
    rating: 5,
    date: "2025-01-10"
  },
  {
    id: 3,
    endorser: "Alex Rodriguez",
    endorserTitle: "CTO at InnovateLab",
    endorserAvatar: "/api/placeholder/40/40",
    skill: "JavaScript",
    message: "Strong problem-solving abilities and clean code practices.",
    rating: 4,
    date: "2025-01-05"
  }
];

const AI_INSIGHTS = {
  skillGaps: [
    { skill: "Docker", priority: "high", reason: "High demand in DevOps roles", marketDemand: 85 },
    { skill: "GraphQL", priority: "medium", reason: "Growing popularity in API development", marketDemand: 72 },
    { skill: "Machine Learning", priority: "low", reason: "Future opportunity in AI roles", marketDemand: 68 }
  ],
  careerSuggestions: [
    { role: "Senior Full-Stack Developer", match: 92, reason: "Strong React and Node.js skills" },
    { role: "Frontend Architect", match: 88, reason: "Excellent UI/UX implementation skills" },
    { role: "DevOps Engineer", match: 65, reason: "Good foundation, needs Docker/Kubernetes" }
  ],
  marketTrends: [
    { skill: "React", trend: "up", change: "+15%", demand: 95 },
    { skill: "TypeScript", trend: "up", change: "+22%", demand: 88 },
    { skill: "Node.js", trend: "up", change: "+8%", demand: 82 },
    { skill: "Vue.js", trend: "stable", change: "+3%", demand: 75 }
  ]
};

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

// Static data for enhanced developer features
const PORTFOLIO_LINKS = [
  { platform: "GitHub", url: "https://github.com/developer", icon: <Github className="w-4 h-4" /> },
  { platform: "LinkedIn", url: "https://linkedin.com/in/developer", icon: <Linkedin className="w-4 h-4" /> },
  { platform: "Portfolio", url: "https://developer-portfolio.com", icon: <ExternalLink className="w-4 h-4" /> },
];

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

const APPLIED_PROJECTS_DATA = [
  { id: 1, title: "E-commerce Platform", status: "Applied", date: "2025-01-15", company: "TechCorp" },
  { id: 2, title: "Mobile Banking App", status: "Under Review", date: "2025-01-10", company: "FinTech Inc" },
  { id: 3, title: "AI Chatbot System", status: "Interview Scheduled", date: "2025-01-08", company: "AI Solutions" },
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

          {/* Portfolio Links */}
          <SectionCard
            icon={<ExternalLink className='w-8 h-8 mr-2 text-blue-400' />}
            title="Portfolio Links"
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {PORTFOLIO_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors'
                >
                  {link.icon}
                  <span className='ml-2 text-sm'>{link.platform}</span>
                </a>
              ))}
            </div>
          </SectionCard>

          {/* Endorsements & Ratings */}
          <SectionCard
            icon={<Star className='w-8 h-8 mr-2 text-yellow-400' />}
            title="Endorsements & Ratings"
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {ENDORSEMENTS_DATA.map((endorsement, index) => (
                <div key={index} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-medium'>{endorsement.skill}</span>
                    <div className='flex items-center'>
                      <Star className='w-4 h-4 text-yellow-400 fill-current' />
                      <span className='ml-1 text-sm'>{endorsement.rating}</span>
                    </div>
                  </div>
                  <div className='text-sm text-gray-400'>
                    {endorsement.endorsements} endorsements
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Applied Projects */}
          <SectionCard
            icon={<Briefcase className='w-8 h-8 mr-2 text-green-400' />}
            title="Applied Projects"
          >
            <div className='space-y-3'>
              {APPLIED_PROJECTS_DATA.map((project) => (
                <div key={project.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='font-medium'>{project.title}</h3>
                    <StatusBadge status={project.status} type="project" />
                  </div>
                  <div className='text-sm text-gray-400 mb-1'>{project.company}</div>
                  <div className='text-sm text-gray-500'>Applied: {project.date}</div>
                </div>
              ))}
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
    </div>
  );
});

export default Developer;
