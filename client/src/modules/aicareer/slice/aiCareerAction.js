// AI Career Action - Using static data for now (will be replaced with API calls later)
// All functions return mock/static data until backend APIs are implemented

/**
 * Get career recommendations for developers
 * Returns static data for now
 */
export const getCareerRecommendationsApi = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Static data - will be replaced with API call later
  return {
    data: {
      success: true,
      data: [
        { 
          id: 1, 
          title: "Frontend Developer", 
          match: "92%", 
          description: "Build user interfaces and experiences", 
          icon: "💻",
          skills: ["React", "TypeScript", "CSS"],
          growth: "+15%",
          salary: "$80k - $120k"
        },
        { 
          id: 2, 
          title: "Backend Engineer", 
          match: "87%", 
          description: "Design and develop server-side systems", 
          icon: "⚙️",
          skills: ["Node.js", "Python", "Database"],
          growth: "+12%",
          salary: "$90k - $130k"
        },
        { 
          id: 3, 
          title: "Full-Stack Developer", 
          match: "85%", 
          description: "End-to-end application development", 
          icon: "🚀",
          skills: ["React", "Node.js", "MongoDB"],
          growth: "+18%",
          salary: "$95k - $140k"
        },
        { 
          id: 4, 
          title: "DevOps Engineer", 
          match: "78%", 
          description: "Infrastructure and deployment automation", 
          icon: "🐳",
          skills: ["Docker", "AWS", "CI/CD"],
          growth: "+25%",
          salary: "$100k - $150k"
        },
        { 
          id: 5, 
          title: "Data Scientist", 
          match: "75%", 
          description: "Extract insights from complex data", 
          icon: "📊",
          skills: ["Python", "Machine Learning", "SQL"],
          growth: "+20%",
          salary: "$110k - $160k"
        },
      ]
    }
  };
};

/**
 * Get resume enhancement suggestions
 * Returns static data for now
 */
export const enhanceResumeApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          text: "Add more measurable achievements in your experience section.",
          category: "Content",
          priority: "High",
          icon: "📊"
        },
        {
          id: 2,
          text: "Include technical keywords like React, Node.js, Docker.",
          category: "Keywords",
          priority: "Medium",
          icon: "🔍"
        },
        {
          id: 3,
          text: "Tailor your resume summary to match job descriptions.",
          category: "Customization",
          priority: "High",
          icon: "🎯"
        },
        {
          id: 4,
          text: "Highlight your most relevant projects at the top.",
          category: "Structure",
          priority: "Medium",
          icon: "📋"
        },
        {
          id: 5,
          text: "Add certifications and online courses you've completed.",
          category: "Education",
          priority: "Low",
          icon: "🎓"
        },
      ]
    }
  };
};

/**
 * Match developers for a project
 * Returns static data for now
 */
export const matchDevelopersApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          name: "Sarah Johnson",
          skills: ["React", "TypeScript", "Node.js"],
          experience: "5 years",
          match: 95,
          availability: "Available",
          rate: "$75/hour",
          location: "Remote",
          icon: "👩‍💻",
          highlights: [
            "Perfect skill match for your project",
            "Available immediately",
            "Strong portfolio in similar projects"
          ]
        },
        {
          id: 2,
          name: "Mike Chen",
          skills: ["Python", "Django", "AWS"],
          experience: "7 years",
          match: 88,
          availability: "Available",
          rate: "$85/hour",
          location: "San Francisco",
          icon: "👨‍💻",
          highlights: [
            "Senior-level expertise",
            "Cloud architecture experience",
            "Team leadership skills"
          ]
        },
        {
          id: 3,
          name: "Alex Rodriguez",
          skills: ["Vue.js", "PHP", "MySQL"],
          experience: "3 years",
          match: 82,
          availability: "Part-time",
          rate: "$60/hour",
          location: "Remote",
          icon: "👨‍💻",
          highlights: [
            "Good technical fit",
            "Flexible schedule",
            "Budget-friendly option"
          ]
        },
        {
          id: 4,
          name: "Emily Davis",
          skills: ["React", "Next.js", "GraphQL"],
          experience: "4 years",
          match: 90,
          availability: "Available",
          rate: "$70/hour",
          location: "New York",
          icon: "👩‍💻",
          highlights: [
            "Excellent React expertise",
            "Modern stack experience",
            "Strong communication skills"
          ]
        },
      ]
    }
  };
};

/**
 * Get project optimization suggestions
 * Returns static data for now
 */
export const optimizeProjectApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          title: "Improve Project Description",
          description: "Add more technical details and clear requirements",
          impact: "High",
          category: "Content",
          icon: "📝",
          suggestions: [
            "Include specific technology stack requirements",
            "Add project timeline and milestones",
            "Specify budget range and payment terms"
          ]
        },
        {
          id: 2,
          title: "Enhance Skill Requirements",
          description: "Optimize skill tags for better developer matching",
          impact: "Medium",
          category: "Matching",
          icon: "🎯",
          suggestions: [
            "Add complementary skills (React + TypeScript)",
            "Include soft skills (communication, leadership)",
            "Specify experience levels (Junior, Senior)"
          ]
        },
        {
          id: 3,
          title: "Boost Project Visibility",
          description: "Improve project discoverability and appeal",
          impact: "High",
          category: "Marketing",
          icon: "📈",
          suggestions: [
            "Add compelling project summary",
            "Include company background",
            "Highlight unique project aspects"
          ]
        },
        {
          id: 4,
          title: "Clarify Project Scope",
          description: "Define clear deliverables and expectations",
          impact: "Medium",
          category: "Content",
          icon: "📋",
          suggestions: [
            "List specific deliverables",
            "Define success criteria",
            "Set clear deadlines"
          ]
        },
      ]
    }
  };
};

/**
 * Analyze skill gaps for developers
 * Returns static data for now
 */
export const analyzeSkillGapApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      data: [
        { 
          skill: "Docker", 
          required: "Intermediate", 
          current: "Beginner",
          icon: "🐳",
          category: "DevOps",
          gapLevel: "High",
          progress: 25
        },
        { 
          skill: "AWS", 
          required: "Intermediate", 
          current: "Beginner",
          icon: "☁️",
          category: "Cloud",
          gapLevel: "High",
          progress: 30
        },
        { 
          skill: "System Design", 
          required: "Advanced", 
          current: "Intermediate",
          icon: "🏗️",
          category: "Architecture",
          gapLevel: "Medium",
          progress: 60
        },
        { 
          skill: "GraphQL", 
          required: "Intermediate", 
          current: "Beginner",
          icon: "🔷",
          category: "Backend",
          gapLevel: "Medium",
          progress: 40
        },
        { 
          skill: "Kubernetes", 
          required: "Advanced", 
          current: "Beginner",
          icon: "☸️",
          category: "DevOps",
          gapLevel: "High",
          progress: 20
        },
      ]
    }
  };
};

/**
 * Get skill demand trends
 * Returns static data for now
 */
export const getSkillTrendsApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          skill: "React",
          demand: 85,
          growth: "+12%",
          trend: "up",
          icon: "⚛️",
          category: "Frontend",
          projects: 156,
          developers: 234,
          color: "from-blue-500 to-indigo-500"
        },
        {
          id: 2,
          skill: "Node.js",
          demand: 78,
          growth: "+8%",
          trend: "up",
          icon: "🟢",
          category: "Backend",
          projects: 142,
          developers: 198,
          color: "from-green-500 to-emerald-500"
        },
        {
          id: 3,
          skill: "Python",
          demand: 72,
          growth: "+15%",
          trend: "up",
          icon: "🐍",
          category: "Backend",
          projects: 128,
          developers: 187,
          color: "from-yellow-500 to-orange-500"
        },
        {
          id: 4,
          skill: "AWS",
          demand: 68,
          growth: "+20%",
          trend: "up",
          icon: "☁️",
          category: "Cloud",
          projects: 98,
          developers: 145,
          color: "from-orange-500 to-red-500"
        },
        {
          id: 5,
          skill: "Docker",
          demand: 61,
          growth: "+18%",
          trend: "up",
          icon: "🐳",
          category: "DevOps",
          projects: 87,
          developers: 123,
          color: "from-purple-500 to-pink-500"
        },
        {
          id: 6,
          skill: "TypeScript",
          demand: 58,
          growth: "+25%",
          trend: "up",
          icon: "📘",
          category: "Frontend",
          projects: 76,
          developers: 98,
          color: "from-indigo-500 to-purple-500"
        },
        {
          id: 7,
          skill: "Kubernetes",
          demand: 52,
          growth: "+30%",
          trend: "up",
          icon: "☸️",
          category: "DevOps",
          projects: 65,
          developers: 87,
          color: "from-blue-500 to-cyan-500"
        },
        {
          id: 8,
          skill: "GraphQL",
          demand: 48,
          growth: "+22%",
          trend: "up",
          icon: "🔷",
          category: "Backend",
          projects: 54,
          developers: 76,
          color: "from-pink-500 to-rose-500"
        },
      ]
    }
  };
};

/**
 * Get platform insights for admins
 * Returns static data for now
 */
export const getPlatformInsightsApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          title: "User Engagement Patterns",
          description: "Peak activity occurs between 9-11 AM and 2-4 PM, with 40% of users active during these hours",
          impact: "High",
          recommendation: "Schedule important announcements during peak hours",
          icon: "⏰",
          category: "User Behavior",
          metrics: {
            peakHours: "9-11 AM, 2-4 PM",
            activeUsers: "40%",
            engagement: "High"
          }
        },
        {
          id: 2,
          title: "Project Completion Rates",
          description: "Projects with detailed descriptions have 35% higher completion rates than vague ones",
          impact: "Medium",
          recommendation: "Encourage detailed project descriptions through UI prompts",
          icon: "📋",
          category: "Project Quality",
          metrics: {
            completionRate: "87%",
            improvement: "+35%",
            quality: "High"
          }
        },
        {
          id: 3,
          title: "Developer Skill Gaps",
          description: "Most common skill gaps are in DevOps (45%), Cloud platforms (38%), and AI/ML (42%)",
          impact: "High",
          recommendation: "Create targeted learning resources for these skill areas",
          icon: "🎓",
          category: "Skill Development",
          metrics: {
            devops: "45%",
            cloud: "38%",
            ai: "42%"
          }
        },
        {
          id: 4,
          title: "Geographic Distribution",
          description: "60% of projects are remote, with highest concentration in North America (45%) and Europe (30%)",
          impact: "Medium",
          recommendation: "Optimize matching algorithms for timezone differences in remote projects",
          icon: "🌍",
          category: "Geographic",
          metrics: {
            remote: "60%",
            northAmerica: "45%",
            europe: "30%"
          }
        },
        {
          id: 5,
          title: "Payment Preferences",
          description: "Hourly rates preferred by 65% of developers, while fixed-price projects have 20% higher satisfaction",
          impact: "Medium",
          recommendation: "Provide flexible payment options and educate on pricing strategies",
          icon: "💳",
          category: "Payment",
          metrics: {
            hourly: "65%",
            satisfaction: "+20%",
            preference: "Mixed"
          }
        },
        {
          id: 6,
          title: "Platform Performance",
          description: "Average page load time is 1.2s, with 99.9% uptime. Mobile usage increased by 25% this quarter",
          impact: "High",
          recommendation: "Continue mobile optimization and monitor performance metrics",
          icon: "⚡",
          category: "Performance",
          metrics: {
            loadTime: "1.2s",
            uptime: "99.9%",
            mobile: "+25%"
          }
        },
      ]
    }
  };
};

/**
 * Analyze team skills and gaps
 * Returns static data for now
 */
export const analyzeTeamApi = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      success: true,
      data: [
        {
          id: 1,
          skill: "Frontend Development",
          current: 2,
          needed: 3,
          gap: 1,
          priority: "High",
          icon: "💻",
          category: "Development",
          suggestions: [
            "Look for React/Next.js developers",
            "Consider remote candidates",
            "Post on specialized job boards"
          ]
        },
        {
          id: 2,
          skill: "DevOps",
          current: 0,
          needed: 1,
          gap: 1,
          priority: "Critical",
          icon: "⚙️",
          category: "Infrastructure",
          suggestions: [
            "Hire senior DevOps engineer",
            "Consider AWS/Docker specialists",
            "Look for CI/CD experience"
          ]
        },
        {
          id: 3,
          skill: "UI/UX Design",
          current: 1,
          needed: 2,
          gap: 1,
          priority: "Medium",
          icon: "🎨",
          category: "Design",
          suggestions: [
            "Find Figma/Adobe experts",
            "Look for mobile design experience",
            "Consider freelance designers"
          ]
        },
        {
          id: 4,
          skill: "Backend Development",
          current: 2,
          needed: 3,
          gap: 1,
          priority: "High",
          icon: "🔧",
          category: "Development",
          suggestions: [
            "Hire Node.js/Python developers",
            "Look for API design experience",
            "Consider database expertise"
          ]
        },
      ]
    }
  };
};

