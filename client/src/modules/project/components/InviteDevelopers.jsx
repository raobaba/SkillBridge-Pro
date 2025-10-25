import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Modal } from '../../../components';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Award,
  Filter,
  Send,
  CheckCircle,
  Users,
  Briefcase,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getDevelopers, createInvite, listProjects } from '../slice/projectSlice';

const InviteDevelopers = ({ selectedProject, onClose, onInviteSent }) => {
  const dispatch = useDispatch();
  const { developers, developersLoading, projects, error } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.user);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [invitedDevelopers, setInvitedDevelopers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [invitingDeveloper, setInvitingDeveloper] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [currentProject, setCurrentProject] = useState(selectedProject);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // Load user's projects on component mount
  useEffect(() => {
    if (user?.id && user?.role === 'project-owner') {
      dispatch(listProjects({ ownerId: user.id }));
    }
  }, [dispatch, user?.id, user?.role]);

  // Update current project when selectedProject prop changes
  useEffect(() => {
    setCurrentProject(selectedProject);
  }, [selectedProject]);

  // Fetch developers on component mount
  useEffect(() => {
    dispatch(getDevelopers({
      search: searchQuery,
      experience: selectedExperience,
      location: selectedLocation,
      limit: 50
    }));
  }, [dispatch]);

  // Refetch developers when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(getDevelopers({
        search: searchQuery,
        experience: selectedExperience,
        location: selectedLocation,
        limit: 50
      }));
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedExperience, selectedLocation, dispatch]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set();
    if (developers && Array.isArray(developers)) {
      developers.forEach(dev => {
        if (dev.skills && Array.isArray(dev.skills)) {
          dev.skills.forEach(skill => skillsSet.add(skill));
        }
      });
    }
    return Array.from(skillsSet).sort();
  }, [developers]);

  const filteredDevelopers = useMemo(() => {
    if (!developers || !Array.isArray(developers)) {
      return [];
    }
    
    return developers.filter(dev => {
      const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (dev.bio && dev.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (dev.domainPreferences && dev.domainPreferences.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (dev.skills && Array.isArray(dev.skills) && dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesExperience = selectedExperience === 'all' || 
                               (dev.experience && dev.experience.toLowerCase() === selectedExperience.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || 
                             (selectedLocation === 'remote' && dev.location && dev.location.toLowerCase().includes('remote')) ||
                             (selectedLocation !== 'remote' && dev.location && !dev.location.toLowerCase().includes('remote'));
      
      const matchesSkills = selectedSkills.length === 0 || 
                           (dev.skills && Array.isArray(dev.skills) && selectedSkills.some(skill => dev.skills.includes(skill)));

      return matchesSearch && matchesExperience && matchesLocation && matchesSkills;
    });
  }, [developers, searchQuery, selectedExperience, selectedLocation, selectedSkills]);

  const handleInviteDeveloper = (developer) => {
    if (!currentProject) {
      toast.error('No project selected');
      return;
    }

    // Set default message
    const defaultMessage = `Hi ${developer.name}, I'd like to invite you to join my project "${currentProject.title}". Your skills in ${developer.skills?.join(', ') || 'development'} would be a great fit for this project.`;
    setCustomMessage(defaultMessage);
    setSelectedDeveloper(developer);
    setShowInviteModal(true);
  };

  const handleSendInvite = async () => {
    if (!selectedDeveloper || !currentProject) {
      toast.error('Missing required information');
      return;
    }

    try {
      setInvitingDeveloper(selectedDeveloper.id);
      
      // Prepare invite data
      const inviteData = {
        projectId: currentProject.id,
        invitedEmail: selectedDeveloper.email,
        invitedUserId: selectedDeveloper.id, // Use developer ID if available
        role: selectedDeveloper.domainPreferences || 'Developer',
        message: customMessage.trim() || `Hi ${selectedDeveloper.name}, I'd like to invite you to join my project "${currentProject.title}".`
      };

      // Dispatch the createInvite action
      const result = await dispatch(createInvite(inviteData)).unwrap();
      
      // If successful, update local state
      setInvitedDevelopers(prev => new Set([...prev, selectedDeveloper.id]));
      toast.success(`Invitation sent to ${selectedDeveloper.name}!`);
      
      if (onInviteSent) {
        onInviteSent(selectedDeveloper);
      }

      // Close modal and reset state
      setShowInviteModal(false);
      setSelectedDeveloper(null);
      setCustomMessage('');
    } catch (error) {
      console.error('Invite error:', error);
      toast.error(error?.message || 'Failed to send invitation');
    } finally {
      setInvitingDeveloper(null);
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setShowProjectSelector(false);
    toast.success(`Selected project: ${project.title}`);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Invite Developers"
      subtitle={currentProject ? `For: ${currentProject.title}` : 'Find the perfect developer for your project'}
      icon={Users}
      size="xlarge"
    >

        {/* Search and Filters */}
        <div className="p-6 border-b border-white/10">
          {/* Project Selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Project for Invitation
              </label>
              {projects && projects.length > 1 && (
                <Button
                  onClick={() => setShowProjectSelector(!showProjectSelector)}
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {showProjectSelector ? 'Hide Projects' : 'Change Project'}
                </Button>
              )}
            </div>
            
            {/* Current Project Display */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
              currentProject 
                ? 'bg-white/5 border-white/10' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate ${
                  currentProject ? 'text-white' : 'text-red-400'
                }`}>
                  {currentProject?.title || 'No project selected'}
                </h4>
                <p className={`text-sm truncate ${
                  currentProject ? 'text-gray-400' : 'text-red-300'
                }`}>
                  {currentProject?.description || 'Select a project to invite developers'}
                </p>
              </div>
              {currentProject ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    {currentProject.status || 'Active'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                    Required
                  </span>
                </div>
              )}
            </div>

            {/* Project Selector Dropdown */}
            {showProjectSelector && projects && projects.length > 0 && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        currentProject?.id === project.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{project.title}</h5>
                          <p className="text-sm text-gray-400 truncate">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {project.status || 'Active'}
                          </span>
                          {currentProject?.id === project.id && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search developers by name, skills, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {developersLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="ml-3 text-gray-400">Loading developers...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg">Error loading developers</p>
              <p className="text-gray-500 text-sm mt-2">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-300 text-sm">
                  {filteredDevelopers.length} developer{filteredDevelopers.length !== 1 ? 's' : ''} found
                </p>
                {selectedSkills.length > 0 && (
                  <Button
                    onClick={() => setSelectedSkills([])}
                    variant="ghost"
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear Skills
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDevelopers.map(developer => (
              <div key={developer.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                {/* Developer Header */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={developer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=random`}
                    alt={developer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{developer.name}</h4>
                    <p className="text-gray-400 text-sm truncate">{developer.domainPreferences || 'Developer'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">{developer.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">{developer.level || '1'}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {developer.skills && Array.isArray(developer.skills) ? (
                      <>
                        {developer.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500">
                            {skill}
                          </span>
                        ))}
                        {developer.skills.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-xs text-gray-300 bg-white/10">
                            +{developer.skills.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs text-gray-300 bg-white/10">
                        Skills not specified
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Briefcase className="w-3 h-3" />
                    <span>{developer.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{developer.availability || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Award className="w-3 h-3" />
                    <span>{developer.experience || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Globe className="w-3 h-3" />
                    <span>Level {developer.level || 1}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">{developer.bio || 'No bio available'}</p>

                {/* Action Button */}
                <Button
                  onClick={() => handleInviteDeveloper(developer)}
                  disabled={invitedDevelopers.has(developer.id) || invitingDeveloper === developer.id}
                  className={`w-full ${
                    invitedDevelopers.has(developer.id)
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : invitingDeveloper === developer.id
                      ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  } px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  {invitedDevelopers.has(developer.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Invited
                    </>
                  ) : invitingDeveloper === developer.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

              {filteredDevelopers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No developers found</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Invite Customization Modal */}
        {showInviteModal && selectedDeveloper && (
          <Modal
            isOpen={showInviteModal}
            onClose={() => {
              setShowInviteModal(false);
              setSelectedDeveloper(null);
              setCustomMessage('');
            }}
            title="Customize Invitation"
            subtitle={`Send invitation to ${selectedDeveloper.name}`}
            icon={Send}
            size="medium"
          >
            <div className="p-6 space-y-4">
              {/* Developer Info */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <img
                  src={selectedDeveloper.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDeveloper.name)}&background=random`}
                  alt={selectedDeveloper.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-semibold">{selectedDeveloper.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedDeveloper.domainPreferences || 'Developer'}</p>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h5 className="text-blue-400 font-medium mb-1">Project: {currentProject?.title}</h5>
                <p className="text-gray-300 text-sm">Role: {selectedDeveloper.domainPreferences || 'Developer'}</p>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                  rows={4}
                />
                <p className="text-gray-400 text-xs mt-1">
                  This message will be included in the email invitation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedDeveloper(null);
                    setCustomMessage('');
                  }}
                  variant="ghost"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={invitingDeveloper === selectedDeveloper.id}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {invitingDeveloper === selectedDeveloper.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Modal>
        )}
    </Modal>
  );
};

export default InviteDevelopers;
