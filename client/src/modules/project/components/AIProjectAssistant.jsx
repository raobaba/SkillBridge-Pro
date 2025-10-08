import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from '../../../components';
import {
  generateProjectDescription,
  generateProjectTitles,
  generateSkillSuggestions,
  generateRequirements,
  generateBenefits,
  generateBudgetSuggestions,
  generateComprehensiveSuggestions
} from '../slice/projectSlice';
import {
  Sparkles,
  Wand2,
  Brain,
  Zap,
  RefreshCw,
  Copy,
  Check,
  X,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Clock,
  Code,
  Globe,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader,
  FileText,
  Tag,
  Award,
  Briefcase
} from 'lucide-react';

const AIProjectAssistant = ({ 
  onSuggestionApplied, 
  onDescriptionGenerated, 
  initialData = {},
  mode = 'comprehensive' // 'comprehensive', 'description-only'
}) => {
  const dispatch = useDispatch();
  const { aiSuggestions = {}, aiLoading, error } = useSelector(state => state.project);
  
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('comprehensive');
  const [projectDetails, setProjectDetails] = useState({
    title: initialData.title || '',
    category: initialData.category || '',
    skills: initialData.skills || [],
    budget: initialData.budget || '',
    duration: initialData.duration || '',
    experience: initialData.experience || '',
    location: initialData.location || '',
    company: initialData.company || '',
    requirements: initialData.requirements || '',
    benefits: initialData.benefits || ''
  });
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copied, setCopied] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML',
    'DevOps', 'Design', 'Marketing', 'Other'
  ];

  const experienceLevels = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Lead/Architect'
  ];

  const popularSkills = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'TypeScript', 'JavaScript', 'HTML/CSS', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Figma',
    'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ];

  const handleInputChange = (field, value) => {
    setProjectDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setProjectDetails(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const generateSuggestions = async (type) => {
    setIsGenerating(true);
    
    try {
      switch (type) {
        case 'description':
          await dispatch(generateProjectDescription(projectDetails)).unwrap();
          if (aiSuggestions.description) {
            setGeneratedDescription(aiSuggestions.description);
          }
          break;
        case 'titles':
          await dispatch(generateProjectTitles(projectDetails)).unwrap();
          break;
        case 'skills':
          await dispatch(generateSkillSuggestions(projectDetails)).unwrap();
          break;
        case 'requirements':
          await dispatch(generateRequirements(projectDetails)).unwrap();
          break;
        case 'benefits':
          await dispatch(generateBenefits(projectDetails)).unwrap();
          break;
        case 'budget':
          await dispatch(generateBudgetSuggestions(projectDetails)).unwrap();
          break;
        case 'comprehensive':
          await dispatch(generateComprehensiveSuggestions(projectDetails)).unwrap();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      // Fallback to local generation for description
      if (type === 'description') {
        const fallbackDescription = generateAIDescription(projectDetails);
        setGeneratedDescription(fallbackDescription);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback description generation function
  const generateAIDescription = (details) => {
    const { title, category, skills, budget, duration, experience, location, company, requirements, benefits } = details;
    
    let description = `We're seeking a talented ${experience.toLowerCase()} ${category.toLowerCase()} professional to join our team for an exciting project. `;
    
    if (title) {
      description += `This project involves ${title.toLowerCase()}. `;
    }
    
    if (skills.length > 0) {
      description += `The ideal candidate should have strong experience with ${skills.slice(0, 3).join(', ')}`;
      if (skills.length > 3) {
        description += ` and other relevant technologies`;
      }
      description += '. ';
    }
    
    if (requirements) {
      description += `${requirements} `;
    }
    
    if (budget) {
      description += `We offer a competitive budget of ${budget}. `;
    }
    
    if (duration) {
      description += `The project duration is estimated at ${duration}. `;
    }
    
    if (location) {
      description += `This is a ${location.toLowerCase()} position. `;
    }
    
    if (benefits) {
      description += `Additional benefits include ${benefits.toLowerCase()}. `;
    }
    
    description += `Join our innovative team and contribute to cutting-edge solutions that make a real impact. We value creativity, collaboration, and continuous learning.`;
    
    return description;
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleApplySuggestion = (type, value) => {
    if (onSuggestionApplied) {
      onSuggestionApplied(type, value);
    }
  };

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription);
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleUseDescription = () => {
    if (onDescriptionGenerated) {
      onDescriptionGenerated(generatedDescription);
    }
    setShowModal(false);
  };

  const skillColors = [
    'from-purple-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-400',
    'from-red-400 to-pink-500',
    'from-cyan-400 to-blue-500'
  ];

  const tabs = [
    { id: 'comprehensive', label: 'All Suggestions', icon: Sparkles },
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'titles', label: 'Titles', icon: Tag },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'requirements', label: 'Requirements', icon: Target },
    { id: 'benefits', label: 'Benefits', icon: Award },
    { id: 'budget', label: 'Budget', icon: DollarSign }
  ];

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        {mode === 'description-only' ? (
          <>
            <Sparkles className="w-4 h-4" />
            AI-Enhanced Description
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" />
            AI Project Assistant
          </>
        )}
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={mode === 'description-only' ? 'AI-Enhanced Project Description' : 'AI Project Assistant'}
        subtitle={mode === 'description-only' 
          ? 'Let AI help you create compelling project descriptions'
          : 'Get AI-powered suggestions for your project'
        }
        icon={Brain}
        size="xlarge"
        className="max-h-[95vh]"
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800/50 border-r border-white/10 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Project Title</label>
                <input
                  type="text"
                  value={projectDetails.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Category</label>
                <select
                  value={projectDetails.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Experience Level</label>
                <select
                  value={projectDetails.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={projectDetails.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Skills</label>
                <div className="max-h-32 overflow-y-auto">
                  {popularSkills.map((skill, index) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`m-1 px-2 py-1 rounded-full text-xs transition-all duration-200 ${
                        projectDetails.skills.includes(skill)
                          ? 'bg-purple-500 text-white'
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-white/10 p-4">
              <div className="flex space-x-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'comprehensive' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Comprehensive AI Suggestions</h3>
                    <Button
                      onClick={() => generateSuggestions('comprehensive')}
                      disabled={isGenerating || aiLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                      {isGenerating || aiLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      Generate All
                    </Button>
                  </div>

                  {/* Description */}
                  {aiSuggestions && aiSuggestions.description && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Description
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopy(aiSuggestions.description, 'description')}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                          >
                            {copied.description ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Button
                            onClick={() => handleApplySuggestion('description', aiSuggestions.description)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{aiSuggestions.description}</p>
                    </div>
                  )}

                  {/* Titles */}
                  {aiSuggestions && aiSuggestions.titles && aiSuggestions.titles.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Tag className="w-5 h-5" />
                          Title Suggestions
                        </h4>
                        <Button
                          onClick={() => handleCopy(aiSuggestions.titles.join('\n'), 'titles')}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                        >
                          {copied.titles ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {aiSuggestions.titles.map((title, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <span className="text-gray-300 text-sm">{title}</span>
                            <Button
                              onClick={() => handleApplySuggestion('title', title)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded text-xs"
                            >
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {aiSuggestions && aiSuggestions.skills && aiSuggestions.skills.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Skill Suggestions
                        </h4>
                        <Button
                          onClick={() => handleCopy(aiSuggestions.skills.join(', '), 'skills')}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                        >
                          {copied.skills ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.skills.map((skill, index) => (
                          <button
                            key={index}
                            onClick={() => handleApplySuggestion('skill', skill)}
                            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              skillColors[index % skillColors.length]
                            } bg-gradient-to-r text-white hover:scale-105`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {aiSuggestions && aiSuggestions.requirements && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Requirements
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopy(aiSuggestions.requirements, 'requirements')}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                          >
                            {copied.requirements ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Button
                            onClick={() => handleApplySuggestion('requirements', aiSuggestions.requirements)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{aiSuggestions.requirements}</p>
                    </div>
                  )}

                  {/* Benefits */}
                  {aiSuggestions && aiSuggestions.benefits && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          Benefits
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopy(aiSuggestions.benefits, 'benefits')}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                          >
                            {copied.benefits ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Button
                            onClick={() => handleApplySuggestion('benefits', aiSuggestions.benefits)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{aiSuggestions.benefits}</p>
                    </div>
                  )}

                  {/* Budget */}
                  {aiSuggestions && aiSuggestions.budget && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Budget Suggestion
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopy(aiSuggestions.budget, 'budget')}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-sm"
                          >
                            {copied.budget ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Button
                            onClick={() => handleApplySuggestion('budget', aiSuggestions.budget)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm font-medium">{aiSuggestions.budget}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Individual tab content would go here */}
              {activeTab !== 'comprehensive' && (
                <div className="text-center text-gray-400 py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Individual suggestion tabs coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AIProjectAssistant;
