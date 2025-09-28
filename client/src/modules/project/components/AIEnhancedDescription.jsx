import React, { useState } from 'react'
import Button from '../../../components/Button';
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
  Loader
} from 'lucide-react'

const AIEnhancedDescription = ({ onDescriptionGenerated, initialDescription = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    category: '',
    skills: [],
    budget: '',
    duration: '',
    experience: '',
    location: '',
    company: '',
    requirements: '',
    benefits: ''
  })

  const categories = [
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'AI/ML',
    'DevOps',
    'Design',
    'Marketing',
    'Other'
  ]

  const experienceLevels = [
    'Entry Level',
    'Mid Level', 
    'Senior Level',
    'Lead/Architect'
  ]

  const popularSkills = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'TypeScript', 'JavaScript', 'HTML/CSS', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Figma',
    'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ]

  const handleInputChange = (field, value) => {
    setProjectDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillToggle = (skill) => {
    setProjectDetails(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const generateDescription = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation with a realistic delay
    setTimeout(() => {
      const aiDescription = generateAIDescription(projectDetails)
      setGeneratedDescription(aiDescription)
      setIsGenerating(false)
    }, 3000)
  }

  const generateAIDescription = (details) => {
    const { title, category, skills, budget, duration, experience, location, company, requirements, benefits } = details
    
    let description = `We're seeking a talented ${experience.toLowerCase()} ${category.toLowerCase()} professional to join our team for an exciting project. `
    
    if (title) {
      description += `This project involves ${title.toLowerCase()}. `
    }
    
    if (skills.length > 0) {
      description += `The ideal candidate should have strong experience with ${skills.slice(0, 3).join(', ')}`
      if (skills.length > 3) {
        description += ` and other relevant technologies`
      }
      description += '. '
    }
    
    if (requirements) {
      description += `${requirements} `
    }
    
    if (budget) {
      description += `We offer a competitive budget of ${budget}. `
    }
    
    if (duration) {
      description += `The project duration is estimated at ${duration}. `
    }
    
    if (location) {
      description += `This is a ${location.toLowerCase()} position. `
    }
    
    if (benefits) {
      description += `Additional benefits include ${benefits.toLowerCase()}. `
    }
    
    description += `Join our innovative team and contribute to cutting-edge solutions that make a real impact. We value creativity, collaboration, and continuous learning.`
    
    return description
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleUseDescription = () => {
    onDescriptionGenerated(generatedDescription)
    setShowModal(false)
  }

  const skillColors = [
    'from-purple-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-400',
    'from-red-400 to-pink-500',
    'from-cyan-400 to-blue-500'
  ]

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        AI-Enhanced Description
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      AI-Enhanced Project Description
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Let AI help you create compelling project descriptions
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Input Panel */}
              <div className="w-1/2 p-6 overflow-y-auto border-r border-white/10">
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Project Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={projectDetails.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="e.g., E-commerce Platform Development"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Category</label>
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Experience Level</label>
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
                          <label className="block text-gray-300 mb-2">Budget</label>
                          <input
                            type="text"
                            value={projectDetails.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            placeholder="e.g., $50,000 - $100,000"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Duration</label>
                          <input
                            type="text"
                            value={projectDetails.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            placeholder="e.g., 3-6 months"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Location</label>
                          <input
                            type="text"
                            value={projectDetails.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="e.g., Remote, San Francisco"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Company</label>
                        <input
                          type="text"
                          value={projectDetails.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Your company name"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-green-400" />
                      Required Skills
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {popularSkills.map((skill, idx) => (
                        <Button
                          key={skill}
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            projectDetails.skills.includes(skill)
                              ? `text-white bg-gradient-to-r ${skillColors[idx % skillColors.length]}`
                              : 'text-gray-400 bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Additional Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Specific Requirements</label>
                        <textarea
                          value={projectDetails.requirements}
                          onChange={(e) => handleInputChange('requirements', e.target.value)}
                          placeholder="Any specific requirements or qualifications..."
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Benefits & Perks</label>
                        <textarea
                          value={projectDetails.benefits}
                          onChange={(e) => handleInputChange('benefits', e.target.value)}
                          placeholder="What benefits do you offer?"
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={generateDescription}
                    disabled={isGenerating || !projectDetails.title}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate Description
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Output Panel */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Generated Description
                    </h3>
                    
                    {generatedDescription ? (
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <p className="text-gray-300 leading-relaxed">{generatedDescription}</p>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={handleCopy}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 text-green-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={handleUseDescription}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Use This Description
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No description generated yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Fill in the project details and click "Generate Description"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-400" />
                      AI Tips
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Be specific about required skills and experience</li>
                      <li>• Include project duration and budget for better matches</li>
                      <li>• Mention company benefits to attract top talent</li>
                      <li>• Use clear, professional language</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIEnhancedDescription
