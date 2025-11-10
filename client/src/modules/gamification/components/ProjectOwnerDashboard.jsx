import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Button from '../../../components/Button';
import { CircularLoader as Loader } from '../../../components';
import { toast } from 'react-toastify';
import { 
  Star, Users, MessageSquare, ThumbsUp, Award, Clock, 
  CheckCircle, Eye, Filter, Search, Calendar, TrendingUp,
  BarChart3, UserCheck, AlertCircle, Shield
} from "lucide-react";
import {
  getPendingEvaluations,
  getEvaluationHistory,
  getProjectOwnerStats,
  submitEvaluation,
} from "../slice/gamificationSlice";

const ProjectOwnerDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const { 
    pendingEvaluations: pendingEvaluationsFromRedux,
    evaluationHistory: evaluationHistoryFromRedux,
    projectOwnerStats,
    pendingEvaluationsLoading,
    evaluationHistoryLoading,
    projectOwnerStatsLoading,
    submittingEvaluation,
    error
  } = useSelector((state) => state.gamification || {});

  const [selectedTab, setSelectedTab] = useState("evaluation");

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

  // Load data on mount and tab changes
  useEffect(() => {
    if (user?.role === 'project-owner' || user?.roles?.includes('project-owner')) {
      dispatch(getPendingEvaluations());
      if (selectedTab === 'history' || selectedTab === 'endorsements' || selectedTab === 'analytics') {
        dispatch(getEvaluationHistory());
      }
      if (selectedTab === 'analytics') {
        dispatch(getProjectOwnerStats());
      }
    }
  }, [dispatch, user?.role, user?.roles, selectedTab]);

  // Use Redux state directly with useMemo for safe array handling
  const pendingEvaluations = useMemo(() => {
    return Array.isArray(pendingEvaluationsFromRedux) ? pendingEvaluationsFromRedux : [];
  }, [pendingEvaluationsFromRedux]);

  const evaluationHistory = useMemo(() => {
    return Array.isArray(evaluationHistoryFromRedux) ? evaluationHistoryFromRedux : [];
  }, [evaluationHistoryFromRedux]);

  // Extract endorsements from evaluation history dynamically
  const endorsementHistory = useMemo(() => {
    const endorsements = [];
    evaluationHistory.forEach((evaluation) => {
      // Check if evaluation has endorseSkills (from metadata or categories)
      const skills = evaluation.endorseSkills || evaluation.categories?.endorsedSkills || [];
      if (Array.isArray(skills) && skills.length > 0) {
        skills.forEach((skill) => {
          endorsements.push({
            id: `endorsement-${evaluation.id}-${skill}`,
            skill: typeof skill === 'string' ? skill : skill.name || 'Unknown Skill',
            developer: evaluation.developer || 'Unknown Developer',
            developerId: evaluation.developerId,
            message: evaluation.review || `Endorsed for ${skill}`,
            date: evaluation.date || evaluation.createdAt || new Date().toISOString(),
            projectName: evaluation.projectName,
          });
        });
      }
    });
    // Sort by date (most recent first)
    return endorsements.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [evaluationHistory]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleStartEvaluation = (project) => {
    setEvaluationForm({
      projectId: project.projectId || project.id,
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
    setEvaluationForm(prev => {
      const newCategories = {
        ...prev.categories,
        [category]: rating
      };
      
      // Calculate overall rating
      const totalWeight = ratingCategories.reduce((sum, cat) => sum + cat.weight, 0);
      const weightedSum = ratingCategories.reduce((sum, cat) => {
        const ratingValue = cat.key === category ? rating : newCategories[cat.key];
        return sum + (ratingValue * cat.weight);
      }, 0);
      
      return {
        ...prev,
        categories: newCategories,
        overallRating: Math.round((weightedSum / totalWeight) * 10) / 10
      };
    });
  };

  const handleSubmitEvaluation = async () => {
    if (!evaluationForm.projectId || !evaluationForm.developerId || !evaluationForm.overallRating) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      // Submit evaluation (review) - using the existing addReview API
      // Note: reviewerId will be extracted from req.user (project owner)
      // The developer being reviewed is identified by the projectId context
      await dispatch(submitEvaluation({
        projectId: evaluationForm.projectId,
        rating: Math.round(evaluationForm.overallRating),
        comment: evaluationForm.review,
        // Store additional metadata if needed
        developerId: evaluationForm.developerId,
        categories: evaluationForm.categories,
        endorseSkills: evaluationForm.endorseSkills
      })).unwrap();

      toast.success("Evaluation submitted successfully!");
      
      // Reset form
      setEvaluationForm({
        projectId: null,
        developerId: null,
        overallRating: 0,
        categories: { technical: 0, communication: 0, timeliness: 0, quality: 0, collaboration: 0 },
        review: "",
        endorseSkills: []
      });

      // Refresh data
      dispatch(getPendingEvaluations());
      dispatch(getEvaluationHistory());
      
    } catch (error) {
      toast.error(error?.message || "Failed to submit evaluation");
    }
  };

  const renderEvaluationTab = () => {
    if (pendingEvaluationsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Pending Evaluations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Pending Evaluations</h3>
          <div className="space-y-4">
            {pendingEvaluations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No pending evaluations at this time.</p>
              </div>
            ) : (
              pendingEvaluations.map((project, index) => (
                <motion.div
                  key={project.id || project.projectId || index}
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
                        <span>Completed: {new Date(project.completedDate || project.acceptedAt).toLocaleDateString()}</span>
                        <span>Duration: {project.projectDuration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(() => {
                          // Parse skills: can be string, array, or object
                          let skillsArray = [];
                          if (project.skills) {
                            try {
                              if (typeof project.skills === 'string') {
                                skillsArray = JSON.parse(project.skills);
                              } else if (Array.isArray(project.skills)) {
                                skillsArray = project.skills;
                              } else if (typeof project.skills === 'object') {
                                skillsArray = Object.keys(project.skills);
                              }
                              if (!Array.isArray(skillsArray)) {
                                skillsArray = [];
                              }
                            } catch (e) {
                              skillsArray = [];
                            }
                          }
                          return skillsArray.length > 0 ? (
                            skillsArray.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                                {String(skill).trim()}
                              </span>
                            ))
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartEvaluation(project)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      disabled={submittingEvaluation}
                    >
                      Evaluate
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
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
                        disabled={submittingEvaluation}
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
                disabled={submittingEvaluation}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                {(Array.isArray(pendingEvaluations.find(p => (p.id || p.projectId) === evaluationForm.projectId)?.skills) 
                  ? pendingEvaluations.find(p => (p.id || p.projectId) === evaluationForm.projectId)?.skills 
                  : []).map(skill => (
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
                    disabled={submittingEvaluation}
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
                disabled={submittingEvaluation || !evaluationForm.overallRating}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {submittingEvaluation ? 'Submitting...' : 'Submit Evaluation'}
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
                disabled={submittingEvaluation}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    if (evaluationHistoryLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Evaluation History</h3>
          <div className="space-y-4">
            {evaluationHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No evaluation history yet.</p>
              </div>
            ) : (
              evaluationHistory.map((evaluation, index) => (
                <motion.div
                  key={evaluation.id || index}
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
                          className={`w-4 h-4 ${i < (evaluation.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{evaluation.review || 'No review text provided'}</p>
                  
                  {evaluation.categories && (
                    <div className="grid grid-cols-5 gap-2 text-xs mb-3">
                      {Object.entries(evaluation.categories).map(([category, rating]) => (
                        <div key={category} className="text-center">
                          <div className="text-gray-400 capitalize">{category}</div>
                          <div className="font-bold text-white">{rating || 0}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    {new Date(evaluation.date || evaluation.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderEndorsements = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Endorsement History</h3>
        <div className="space-y-4">
          {endorsementHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No endorsements yet. Endorse skills when submitting evaluations.</p>
            </div>
          ) : (
            endorsementHistory.map((endorsement, index) => (
              <motion.div
                key={endorsement.id || index}
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
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => {
    if (projectOwnerStatsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    // Use stats from API, fallback to calculated values
    const stats = projectOwnerStats || {};
    const totalEvaluations = evaluationHistory.length || stats.totalEvaluations || 0;
    
    // Calculate average rating from evaluation history or use stats
    const calculatedAvgRating = evaluationHistory.length > 0 
      ? (evaluationHistory.reduce((sum, e) => sum + (e.rating || 0), 0) / evaluationHistory.length).toFixed(1)
      : '0.0';
    const averageRating = stats.averageRating || calculatedAvgRating;
    
    // Endorsements given from extracted endorsement history
    const endorsementsGiven = endorsementHistory.length || stats.endorsementsGiven || 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-white mb-2">{totalEvaluations}</div>
            <div className="text-gray-300">Total Evaluations</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-white mb-2">{averageRating}</div>
            <div className="text-gray-300">Average Rating Given</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
          >
            <div className="text-3xl font-bold text-white mb-2">{endorsementsGiven}</div>
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
            {[5, 4, 3, 2, 1].map(rating => {
              const count = evaluationHistory.filter(e => Math.round(e.rating || 0) === rating).length;
              const percentage = evaluationHistory.length > 0 ? (count / evaluationHistory.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-white w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-sm">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  };

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
