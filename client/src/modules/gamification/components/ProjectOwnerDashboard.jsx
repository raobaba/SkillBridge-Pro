import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from '../../../components/Button';
import { 
  Star, Users, MessageSquare, ThumbsUp, Award, Clock, 
  CheckCircle, Eye, Filter, Search, Calendar, TrendingUp,
  BarChart3, UserCheck, AlertCircle, Shield
} from "lucide-react";

const ProjectOwnerDashboard = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("evaluation");
  const [pendingEvaluations, setPendingEvaluations] = useState([
    {
      id: 1,
      projectName: "E-commerce Platform",
      developer: "Alice Johnson",
      developerId: "dev_001",
      completedDate: "2024-01-15",
      projectDuration: "2 weeks",
      skills: ["React.js", "Node.js", "MongoDB"],
      status: "pending"
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      developer: "Mike Chen",
      developerId: "dev_002",
      completedDate: "2024-01-12",
      projectDuration: "3 weeks",
      skills: ["React Native", "Firebase", "TypeScript"],
      status: "pending"
    }
  ]);

  const [evaluationHistory, setEvaluationHistory] = useState([
    {
      id: 1,
      projectName: "Web Dashboard",
      developer: "Sarah Wilson",
      rating: 5,
      review: "Excellent work! Clean code and great communication.",
      date: "2024-01-10",
      categories: { technical: 5, communication: 5, timeliness: 4, quality: 5, collaboration: 5 }
    },
    {
      id: 2,
      projectName: "API Development",
      developer: "David Lee",
      rating: 4,
      review: "Good technical skills, delivered on time.",
      date: "2024-01-08",
      categories: { technical: 4, communication: 4, timeliness: 5, quality: 4, collaboration: 4 }
    }
  ]);

  const [endorsementHistory, setEndorsementHistory] = useState([
    {
      id: 1,
      developer: "Alice Johnson",
      skill: "React.js",
      message: "Excellent React developer with deep understanding of hooks and state management.",
      date: "2024-01-12"
    },
    {
      id: 2,
      developer: "Mike Chen",
      skill: "Node.js",
      message: "Great backend developer, very reliable and knowledgeable.",
      date: "2024-01-08"
    }
  ]);

  const [evaluationForm, setEvaluationForm] = useState({
    projectId: null,
    developerId: null,
    overallRating: 0,
    categories: {
      technical: 0,
      communication: 0,
      timeliness: 0,
      quality: 0,
      collaboration: 0
    },
    review: "",
    endorseSkills: []
  });

  const tabs = [
    { id: "evaluation", label: "Evaluation", icon: Star },
    { id: "history", label: "History", icon: Clock },
    { id: "endorsements", label: "Endorsements", icon: ThumbsUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  const ratingCategories = [
    { key: "technical", label: "Technical Skills", weight: 0.3 },
    { key: "communication", label: "Communication", weight: 0.2 },
    { key: "timeliness", label: "Timeliness", weight: 0.2 },
    { key: "quality", label: "Code Quality", weight: 0.2 },
    { key: "collaboration", label: "Collaboration", weight: 0.1 }
  ];

  const handleStartEvaluation = (project) => {
    setEvaluationForm({
      projectId: project.id,
      developerId: project.developerId,
      overallRating: 0,
      categories: {
        technical: 0,
        communication: 0,
        timeliness: 0,
        quality: 0,
        collaboration: 0
      },
      review: "",
      endorseSkills: []
    });
    setSelectedTab("evaluation");
  };

  const handleRatingChange = (category, rating) => {
    setEvaluationForm(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: rating
      }
    }));
    
    // Calculate overall rating
    const totalWeight = ratingCategories.reduce((sum, cat) => sum + cat.weight, 0);
    const weightedSum = ratingCategories.reduce((sum, cat) => {
      const ratingValue = cat.key === category ? rating : prev.categories[cat.key];
      return sum + (ratingValue * cat.weight);
    }, 0);
    
    setEvaluationForm(prev => ({
      ...prev,
      overallRating: Math.round((weightedSum / totalWeight) * 10) / 10
    }));
  };

  const handleSubmitEvaluation = () => {
    // Simulate API call
    console.log("Submitting evaluation:", evaluationForm);
    
    // Add to history
    const newEvaluation = {
      id: Date.now(),
      projectName: pendingEvaluations.find(p => p.id === evaluationForm.projectId)?.projectName,
      developer: pendingEvaluations.find(p => p.id === evaluationForm.projectId)?.developer,
      rating: evaluationForm.overallRating,
      review: evaluationForm.review,
      date: new Date().toISOString().split('T')[0],
      categories: evaluationForm.categories
    };
    
    setEvaluationHistory(prev => [newEvaluation, ...prev]);
    setPendingEvaluations(prev => prev.filter(p => p.id !== evaluationForm.projectId));
    setEvaluationForm({
      projectId: null,
      developerId: null,
      overallRating: 0,
      categories: { technical: 0, communication: 0, timeliness: 0, quality: 0, collaboration: 0 },
      review: "",
      endorseSkills: []
    });
  };

  const renderEvaluationTab = () => (
    <div className="space-y-6">
      {/* Pending Evaluations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Pending Evaluations</h3>
        <div className="space-y-4">
          {pendingEvaluations.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">{project.projectName}</h4>
                  <p className="text-sm text-gray-300">Developer: {project.developer}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>Completed: {project.completedDate}</span>
                    <span>Duration: {project.projectDuration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => handleStartEvaluation(project)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Evaluate
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Evaluation Form */}
      {evaluationForm.projectId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Rate Developer</h3>
          
          {/* Rating Categories */}
          <div className="space-y-4 mb-6">
            {ratingCategories.map(category => (
              <div key={category.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {category.label} ({Math.round(category.weight * 100)}%)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Button
                      key={rating}
                      onClick={() => handleRatingChange(category.key, rating)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        evaluationForm.categories[category.key] >= rating
                          ? 'bg-yellow-400 border-yellow-400 text-black'
                          : 'border-gray-500 text-gray-500 hover:border-yellow-400'
                      }`}
                    >
                      <Star className="w-4 h-4 mx-auto" />
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Overall Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Overall Rating: {evaluationForm.overallRating}/5
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <Star
                  key={rating}
                  className={`w-6 h-6 ${
                    evaluationForm.overallRating >= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review
            </label>
            <textarea
              value={evaluationForm.review}
              onChange={(e) => setEvaluationForm(prev => ({ ...prev, review: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Write your review here..."
            />
          </div>

          {/* Skill Endorsements */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Endorse Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {pendingEvaluations.find(p => p.id === evaluationForm.projectId)?.skills.map(skill => (
                <Button
                  key={skill}
                  onClick={() => {
                    setEvaluationForm(prev => ({
                      ...prev,
                      endorseSkills: prev.endorseSkills.includes(skill)
                        ? prev.endorseSkills.filter(s => s !== skill)
                        : [...prev.endorseSkills, skill]
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    evaluationForm.endorseSkills.includes(skill)
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {skill} {evaluationForm.endorseSkills.includes(skill) && <CheckCircle className="w-3 h-3 inline ml-1" />}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmitEvaluation}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Submit Evaluation
            </Button>
            <Button
              onClick={() => setEvaluationForm({
                projectId: null,
                developerId: null,
                overallRating: 0,
                categories: { technical: 0, communication: 0, timeliness: 0, quality: 0, collaboration: 0 },
                review: "",
                endorseSkills: []
              })}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Evaluation History</h3>
        <div className="space-y-4">
          {evaluationHistory.map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{evaluation.projectName}</h4>
                  <p className="text-sm text-gray-300">Developer: {evaluation.developer}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < evaluation.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{evaluation.review}</p>
              
              <div className="grid grid-cols-5 gap-2 text-xs mb-3">
                {Object.entries(evaluation.categories).map(([category, rating]) => (
                  <div key={category} className="text-center">
                    <div className="text-gray-400 capitalize">{category}</div>
                    <div className="font-bold text-white">{rating}</div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-400">{evaluation.date}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderEndorsements = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Endorsement History</h3>
        <div className="space-y-4">
          {endorsementHistory.map((endorsement, index) => (
            <motion.div
              key={endorsement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{endorsement.skill}</h4>
                  <p className="text-sm text-gray-300">Developer: {endorsement.developer}</p>
                </div>
                <ThumbsUp className="w-6 h-6 text-blue-400" />
              </div>
              
              <p className="text-gray-300 mb-3">{endorsement.message}</p>
              
              <div className="text-xs text-gray-400">{endorsement.date}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">24</div>
          <div className="text-gray-300">Total Evaluations</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">4.2</div>
          <div className="text-gray-300">Average Rating Given</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">18</div>
          <div className="text-gray-300">Endorsements Given</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-white w-8">{rating}★</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${Math.random() * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-300 text-sm">{Math.floor(Math.random() * 10)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "evaluation": return renderEvaluationTab();
      case "history": return renderHistory();
      case "endorsements": return renderEndorsements();
      case "analytics": return renderAnalytics();
      default: return renderEvaluationTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Project Owner Dashboard</h1>
          <p className="text-gray-300">Evaluate developers and provide feedback to build reputation</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              variant="ghost"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectOwnerDashboard;
