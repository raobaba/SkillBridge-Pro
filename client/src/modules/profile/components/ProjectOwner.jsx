import React, { useState, useMemo, memo } from "react";
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

// Enhanced static data for ProjectOwner features
const POSTED_PROJECTS_DATA = [
  {
    id: 1,
    title: "E-commerce Platform",
    status: "Active",
    applicants: 24,
    budget: "$15,000",
    duration: "3 months",
    postedDate: "2025-01-15",
    skills: ["React", "Node.js", "MongoDB"],
    matchSuccess: 85,
  },
  {
    id: 2,
    title: "Mobile Banking App",
    status: "Closed",
    applicants: 18,
    budget: "$25,000",
    duration: "4 months",
    postedDate: "2024-12-01",
    skills: ["React Native", "Node.js", "PostgreSQL"],
    matchSuccess: 92,
  },
  {
    id: 3,
    title: "AI Chatbot System",
    status: "Active",
    applicants: 31,
    budget: "$20,000",
    duration: "2 months",
    postedDate: "2025-01-20",
    skills: ["Python", "TensorFlow", "AWS"],
    matchSuccess: 78,
  },
];

const PROJECT_STATISTICS_DATA = [
  { label: "Total Projects Posted", value: 12, icon: <Briefcase className="w-4 h-4" /> },
  { label: "Active Projects", value: 3, icon: <Target className="w-4 h-4" /> },
  { label: "Completed Projects", value: 9, icon: <CheckCircle2 className="w-4 h-4" /> },
  { label: "Total Applicants", value: 156, icon: <Users className="w-4 h-4" /> },
  { label: "Average Match Success", value: "87%", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Developer Reviews", value: 23, icon: <Star className="w-4 h-4" /> },
];

const DEVELOPER_REVIEWS_DATA = [
  {
    id: 1,
    developer: "Sarah Johnson",
    project: "E-commerce Platform",
    rating: 5,
    review: "Excellent communication and clear project requirements. Great to work with!",
    date: "2025-01-10",
  },
  {
    id: 2,
    developer: "Mike Chen",
    project: "Mobile Banking App",
    rating: 4,
    review: "Very professional and provided good feedback throughout the project.",
    date: "2024-12-15",
  },
  {
    id: 3,
    developer: "Alex Rodriguez",
    project: "AI Chatbot System",
    rating: 5,
    review: "Outstanding project management and timely payments. Highly recommended!",
    date: "2025-01-05",
  },
];

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

// Static data moved outside component
const SKILLS_DATA = [
  "React",
  "Node.js",
  "MongoDB",
  "AWS",
  "Docker",
  "Team Leadership",
];

const DEVELOPERS_STATIC_DATA = [
  {
    id: 1,
    name: "Alice Johnson",
    skills: "React, Node.js",
    status: "Active",
    project: "FinTech App",
    joined: "2025-01-10",
  },
  {
    id: 2,
    name: "Bob Smith",
    skills: "Python, Django",
    status: "Onboarding",
    project: "Health Tracker",
    joined: "2025-02-18",
  },
  {
    id: 3,
    name: "Charlie Brown",
    skills: "AWS, Docker",
    status: "Active",
    project: "E-commerce Platform",
    joined: "2024-12-05",
  },
];

// Memoized action buttons component
const DeveloperActionButtons = memo(({ row }) => (
  <div className='flex gap-2'>
    <Button
      variant='default'
      size='sm'
      className='px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white'
      onClick={() => alert(`Viewing profile of ${row.name}`)}
    >
      View
    </Button>
    <Button
      variant='default'
      size='sm'
      className='px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white'
      onClick={() => alert(`Assigning project for ${row.name}`)}
    >
      Assign
    </Button>
    <Button
      variant='default'
      size='sm'
      className='px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white'
      onClick={() => alert(`Suspending ${row.name}`)}
    >
      Suspend
    </Button>
  </div>
));

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
  // Filter setup
  const [filterValue, setFilter] = useState("All");
  const filterOptions = ["Active", "Onboarding", "Suspended"];

  // Memoized columns to prevent recreation
  const columns = useMemo(() => [
    { label: "ID", key: "id" },
    { label: "Developer Name", key: "name" },
    { label: "Skills", key: "skills" },
    { label: "Status", key: "status" },
    { label: "Assigned Project", key: "project" },
    { label: "Joined Date", key: "joined" },
    {
      label: "Actions",
      render: (row) => <DeveloperActionButtons row={row} />,
    },
  ], []);

  // Memoized filtered data
  const filteredData = useMemo(() => 
    filterValue === "All"
      ? DEVELOPERS_STATIC_DATA
      : DEVELOPERS_STATIC_DATA.filter((row) => row.status === filterValue),
    [filterValue]
  );

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
          <DataTable
            title='Developer Management'
            data={filteredData}
            icon={<Users size={22} />}
            columns={columns}
            filterOptions={filterOptions}
            filterValue={filterValue}
            setFilter={setFilter}
          />

          {/* Posted Projects */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Briefcase className='w-8 h-8 mr-2 text-blue-400' /> Posted Projects
            </h2>
            <div className='space-y-4'>
              {POSTED_PROJECTS_DATA.map((project) => (
                <div key={project.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <h3 className='font-medium text-lg'>{project.title}</h3>
                      <div className='flex items-center gap-4 mt-1 text-sm text-gray-400'>
                        <span>Posted: {project.postedDate}</span>
                        <span>•</span>
                        <span>Duration: {project.duration}</span>
                        <span>•</span>
                        <span>Budget: {project.budget}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      project.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-3'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-blue-400'>{project.applicants}</div>
                      <div className='text-xs text-gray-400'>Applicants</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-green-400'>{project.matchSuccess}%</div>
                      <div className='text-xs text-gray-400'>Match Success</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-purple-400'>{project.skills.length}</div>
                      <div className='text-xs text-gray-400'>Skills Required</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-yellow-400'>4.8</div>
                      <div className='text-xs text-gray-400'>Avg Rating</div>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {project.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Statistics */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <BarChart3 className='w-8 h-8 mr-2 text-green-400' /> Project Statistics
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {PROJECT_STATISTICS_DATA.map((stat, index) => (
                <div key={index} className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                  <div className='flex justify-center mb-2'>
                    {stat.icon}
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{stat.value}</div>
                  <div className='text-sm text-gray-400'>{stat.label}</div>
                </div>
              ))}
            </div>
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
            <div className='space-y-4'>
              {DEVELOPER_REVIEWS_DATA.map((review) => (
                <div key={review.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3 className='font-medium'>{review.developer}</h3>
                      <p className='text-sm text-gray-400'>{review.project}</p>
                    </div>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className='text-sm text-gray-300 mb-2'>{review.review}</p>
                  <div className='text-xs text-gray-500'>Posted: {review.date}</div>
                </div>
              ))}
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
