import React, { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import SortDropdown from "../components/SortDropdown";
import MatchCard from "../components/MatchCard";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import { motion } from "framer-motion";
import { Users, TrendingUp, MapPin, Clock, Star, Award, Zap } from "lucide-react";

// Comprehensive static matches data
const staticMatches = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Senior Frontend Developer",
    experience: 8,
    skills: [
      { name: "React", level: "Expert" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "GraphQL", level: "Intermediate" },
      { name: "Jest", level: "Advanced" }
    ],
    matchScore: 95,
    location: "New York, NY",
    availability: "Full-Time",
    rating: 4.9,
    responseRate: 98,
    industry: "Technology",
    salary: "120k-150k",
    lastActive: "2 hours ago",
    bio: "Passionate frontend developer with 8+ years of experience building scalable web applications. Expert in React ecosystem and modern JavaScript frameworks.",
    achievements: ["Top Performer 2023", "Code Quality Champion", "Mentor of the Year"],
    languages: ["English", "Spanish"],
    education: "BS Computer Science - MIT",
    certifications: ["AWS Certified Developer", "Google UX Design Certificate"]
  },
  {
    id: 2,
    name: "Bob Smith",
    title: "Lead Backend Engineer",
    experience: 12,
    skills: [
      { name: "Node.js", level: "Expert" },
      { name: "Python", level: "Advanced" },
      { name: "PostgreSQL", level: "Expert" },
      { name: "Docker", level: "Advanced" },
      { name: "Kubernetes", level: "Intermediate" },
      { name: "Redis", level: "Advanced" }
    ],
    matchScore: 92,
    location: "San Francisco, CA",
    availability: "Full-Time",
    rating: 4.8,
    responseRate: 95,
    industry: "Technology",
    salary: "150k+",
    lastActive: "1 hour ago",
    bio: "Experienced backend engineer specializing in microservices architecture and cloud infrastructure. Led teams of 10+ developers.",
    achievements: ["Architecture Excellence Award", "Team Leadership Recognition", "Open Source Contributor"],
    languages: ["English", "French"],
    education: "MS Software Engineering - Stanford",
    certifications: ["AWS Solutions Architect", "Kubernetes Administrator"]
  },
  {
    id: 3,
    name: "Charlie Brown",
    title: "Data Scientist",
    experience: 5,
    skills: [
      { name: "Python", level: "Expert" },
      { name: "R", level: "Advanced" },
      { name: "TensorFlow", level: "Advanced" },
      { name: "PyTorch", level: "Intermediate" },
      { name: "SQL", level: "Expert" },
      { name: "Tableau", level: "Advanced" }
    ],
    matchScore: 88,
    location: "Chicago, IL",
    availability: "Full-Time",
    rating: 4.7,
    responseRate: 92,
    industry: "Technology",
    salary: "100k-130k",
    lastActive: "3 hours ago",
    bio: "Data scientist with expertise in machine learning and statistical analysis. Passionate about turning data into actionable insights.",
    achievements: ["ML Model Excellence", "Data Visualization Award", "Research Publication"],
    languages: ["English", "Mandarin"],
    education: "PhD Statistics - University of Chicago",
    certifications: ["Google Data Analytics", "Microsoft Azure AI"]
  },
  {
    id: 4,
    name: "Diana Prince",
    title: "UX/UI Designer",
    experience: 6,
    skills: [
      { name: "Figma", level: "Expert" },
      { name: "Adobe Creative Suite", level: "Advanced" },
      { name: "Sketch", level: "Advanced" },
      { name: "Principle", level: "Intermediate" },
      { name: "HTML/CSS", level: "Intermediate" },
      { name: "User Research", level: "Expert" }
    ],
    matchScore: 90,
    location: "Seattle, WA",
    availability: "Part-Time",
    rating: 4.9,
    responseRate: 96,
    industry: "Design",
    salary: "90k-120k",
    lastActive: "30 minutes ago",
    bio: "Creative UX/UI designer with a focus on user-centered design. Experienced in both web and mobile applications.",
    achievements: ["Design Excellence Award", "User Satisfaction Leader", "Innovation in UX"],
    languages: ["English", "Portuguese"],
    education: "BFA Graphic Design - RISD",
    certifications: ["Google UX Design", "Adobe Certified Expert"]
  },
  {
    id: 5,
    name: "Ethan Hunt",
    title: "DevOps Engineer",
    experience: 7,
    skills: [
      { name: "AWS", level: "Expert" },
      { name: "Docker", level: "Expert" },
      { name: "Kubernetes", level: "Advanced" },
      { name: "Terraform", level: "Advanced" },
      { name: "Jenkins", level: "Advanced" },
      { name: "Linux", level: "Expert" }
    ],
    matchScore: 87,
    location: "Austin, TX",
    availability: "Full-Time",
    rating: 4.6,
    responseRate: 94,
    industry: "Technology",
    salary: "110k-140k",
    lastActive: "1 hour ago",
    bio: "DevOps engineer specializing in cloud infrastructure and automation. Passionate about scalable and reliable systems.",
    achievements: ["Infrastructure Optimization", "Zero Downtime Deployment", "Cost Reduction Champion"],
    languages: ["English", "German"],
    education: "BS Computer Engineering - UT Austin",
    certifications: ["AWS DevOps Engineer", "Kubernetes Administrator", "Terraform Associate"]
  },
  {
    id: 6,
    name: "Fiona Green",
    title: "Product Manager",
    experience: 9,
    skills: [
      { name: "Product Strategy", level: "Expert" },
      { name: "Agile/Scrum", level: "Expert" },
      { name: "Data Analysis", level: "Advanced" },
      { name: "User Research", level: "Advanced" },
      { name: "Stakeholder Management", level: "Expert" },
      { name: "Roadmap Planning", level: "Expert" }
    ],
    matchScore: 91,
    location: "Boston, MA",
    availability: "Full-Time",
    rating: 4.8,
    responseRate: 97,
    industry: "Technology",
    salary: "130k-160k",
    lastActive: "45 minutes ago",
    bio: "Strategic product manager with a track record of launching successful products. Expert in cross-functional team leadership.",
    achievements: ["Product Launch Success", "Revenue Growth Leader", "Team Excellence Award"],
    languages: ["English", "French", "Italian"],
    education: "MBA - Harvard Business School",
    certifications: ["Certified Scrum Product Owner", "Google Analytics Certified"]
  },
  {
    id: 7,
    name: "George Wilson",
    title: "Mobile App Developer",
    experience: 4,
    skills: [
      { name: "React Native", level: "Advanced" },
      { name: "Flutter", level: "Intermediate" },
      { name: "iOS (Swift)", level: "Advanced" },
      { name: "Android (Kotlin)", level: "Advanced" },
      { name: "Firebase", level: "Intermediate" },
      { name: "App Store Optimization", level: "Intermediate" }
    ],
    matchScore: 83,
    location: "Miami, FL",
    availability: "Freelance",
    rating: 4.5,
    responseRate: 89,
    industry: "Technology",
    salary: "80k-110k",
    lastActive: "2 hours ago",
    bio: "Mobile app developer specializing in cross-platform solutions. Passionate about creating intuitive user experiences.",
    achievements: ["App Store Featured", "User Rating Excellence", "Performance Optimization"],
    languages: ["English", "Spanish"],
    education: "BS Computer Science - University of Miami",
    certifications: ["Apple Developer Certification", "Google Play Console"]
  },
  {
    id: 8,
    name: "Hannah Lee",
    title: "Cybersecurity Specialist",
    experience: 6,
    skills: [
      { name: "Penetration Testing", level: "Expert" },
      { name: "Security Auditing", level: "Advanced" },
      { name: "Incident Response", level: "Advanced" },
      { name: "Risk Assessment", level: "Expert" },
      { name: "Compliance", level: "Advanced" },
      { name: "Security Training", level: "Advanced" }
    ],
    matchScore: 89,
    location: "Denver, CO",
    availability: "Full-Time",
    rating: 4.7,
    responseRate: 93,
    industry: "Technology",
    salary: "100k-130k",
    lastActive: "1 hour ago",
    bio: "Cybersecurity specialist with expertise in threat detection and prevention. Committed to protecting digital assets.",
    achievements: ["Security Excellence Award", "Threat Detection Leader", "Compliance Champion"],
    languages: ["English", "Korean"],
    education: "MS Cybersecurity - Carnegie Mellon",
    certifications: ["CISSP", "CEH", "CISM"]
  },
  {
    id: 9,
    name: "Ian Rodriguez",
    title: "Full Stack Developer",
    experience: 5,
    skills: [
      { name: "JavaScript", level: "Expert" },
      { name: "React", level: "Advanced" },
      { name: "Node.js", level: "Advanced" },
      { name: "PostgreSQL", level: "Intermediate" },
      { name: "MongoDB", level: "Intermediate" },
      { name: "AWS", level: "Intermediate" }
    ],
    matchScore: 85,
    location: "Portland, OR",
    availability: "Part-Time",
    rating: 4.6,
    responseRate: 91,
    industry: "Technology",
    salary: "90k-120k",
    lastActive: "3 hours ago",
    bio: "Versatile full stack developer with experience in both frontend and backend technologies. Passionate about clean code.",
    achievements: ["Code Quality Excellence", "Full Stack Mastery", "Client Satisfaction Leader"],
    languages: ["English", "Spanish"],
    education: "BS Software Engineering - Oregon State",
    certifications: ["AWS Developer Associate", "MongoDB Certified Developer"]
  },
  {
    id: 10,
    name: "Julia Chen",
    title: "AI/ML Engineer",
    experience: 7,
    skills: [
      { name: "Python", level: "Expert" },
      { name: "TensorFlow", level: "Expert" },
      { name: "PyTorch", level: "Advanced" },
      { name: "Scikit-learn", level: "Expert" },
      { name: "MLOps", level: "Advanced" },
      { name: "Computer Vision", level: "Advanced" }
    ],
    matchScore: 94,
    location: "Los Angeles, CA",
    availability: "Full-Time",
    rating: 4.9,
    responseRate: 96,
    industry: "Technology",
    salary: "140k-180k",
    lastActive: "1 hour ago",
    bio: "AI/ML engineer specializing in deep learning and computer vision. Published researcher with multiple patents.",
    achievements: ["Research Publication", "Patent Holder", "ML Model Excellence", "Innovation Award"],
    languages: ["English", "Mandarin", "Japanese"],
    education: "PhD Machine Learning - UCLA",
    certifications: ["Google Cloud ML Engineer", "AWS Machine Learning Specialty"]
  },
  {
    id: 11,
    name: "Kevin Park",
    title: "Blockchain Developer",
    experience: 4,
    skills: [
      { name: "Solidity", level: "Advanced" },
      { name: "Web3.js", level: "Advanced" },
      { name: "Ethereum", level: "Expert" },
      { name: "Smart Contracts", level: "Expert" },
      { name: "DeFi", level: "Advanced" },
      { name: "NFT", level: "Intermediate" }
    ],
    matchScore: 86,
    location: "San Diego, CA",
    availability: "Contract",
    rating: 4.5,
    responseRate: 88,
    industry: "Technology",
    salary: "120k-150k",
    lastActive: "4 hours ago",
    bio: "Blockchain developer with expertise in DeFi protocols and smart contract development. Early adopter of Web3 technologies.",
    achievements: ["DeFi Protocol Launch", "Smart Contract Security", "Community Leader"],
    languages: ["English", "Korean"],
    education: "BS Computer Science - UCSD",
    certifications: ["Ethereum Developer", "Blockchain Security Expert"]
  },
  {
    id: 12,
    name: "Lisa Thompson",
    title: "Cloud Solutions Architect",
    experience: 10,
    skills: [
      { name: "AWS", level: "Expert" },
      { name: "Azure", level: "Advanced" },
      { name: "GCP", level: "Intermediate" },
      { name: "Terraform", level: "Expert" },
      { name: "Kubernetes", level: "Advanced" },
      { name: "Microservices", level: "Expert" }
    ],
    matchScore: 93,
    location: "Phoenix, AZ",
    availability: "Full-Time",
    rating: 4.8,
    responseRate: 95,
    industry: "Technology",
    salary: "150k-180k",
    lastActive: "2 hours ago",
    bio: "Cloud solutions architect with extensive experience in designing and implementing scalable cloud infrastructure.",
    achievements: ["Cloud Migration Success", "Cost Optimization Leader", "Architecture Excellence"],
    languages: ["English", "Spanish"],
    education: "MS Computer Science - Arizona State",
    certifications: ["AWS Solutions Architect Professional", "Azure Solutions Architect", "Kubernetes Administrator"]
  }
];

const Matchmaking = () => {
  const [filters, setFilters] = useState({
    search: "",
    availability: "",
    location: "",
    experience: "",
    skills: "",
    rating: "",
    industry: "",
    salary: ""
  });
  const [sortOption, setSortOption] = useState("relevance");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Enhanced filtering logic
  const filteredMatches = staticMatches.filter((match) => {
    const matchesSearch = !filters.search || 
      match.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      match.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      match.skills.some(skill => 
        skill.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    
    const matchesAvailability = !filters.availability || 
      match.availability === filters.availability;
    
    const matchesLocation = !filters.location || 
      match.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesExperience = !filters.experience || 
      (filters.experience === "Entry" && match.experience <= 2) ||
      (filters.experience === "Mid" && match.experience >= 3 && match.experience <= 5) ||
      (filters.experience === "Senior" && match.experience >= 6 && match.experience <= 10) ||
      (filters.experience === "Lead" && match.experience > 10);
    
    const matchesSkills = !filters.skills || 
      match.skills.some(skill => 
        skill.name.toLowerCase().includes(filters.skills.toLowerCase())
      );
    
    const matchesRating = !filters.rating || 
      match.rating >= parseFloat(filters.rating);
    
    const matchesIndustry = !filters.industry || 
      match.industry.toLowerCase() === filters.industry.toLowerCase();
    
    const matchesSalary = !filters.salary || 
      match.salary === filters.salary;

    return matchesSearch && matchesAvailability && matchesLocation && 
           matchesExperience && matchesSkills && matchesRating && 
           matchesIndustry && matchesSalary;
  });

  // Enhanced sorting logic
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortOption) {
      case "relevance":
        return b.matchScore - a.matchScore;
      case "highest":
        return b.matchScore - a.matchScore;
      case "lowest":
        return a.matchScore - b.matchScore;
      case "experienceDesc":
        return (b.experience || 0) - (a.experience || 0);
      case "experienceAsc":
        return (a.experience || 0) - (b.experience || 0);
      case "ratingDesc":
        return (b.rating || 0) - (a.rating || 0);
      case "ratingAsc":
        return (a.rating || 0) - (b.rating || 0);
      case "availability":
        return (a.availability || "").localeCompare(b.availability || "");
      case "locationAsc":
        return (a.location || "").localeCompare(b.location || "");
      case "locationDesc":
        return (b.location || "").localeCompare(a.location || "");
      case "responseRate":
        return (b.responseRate || 0) - (a.responseRate || 0);
      case "recentlyActive":
        // Simple sorting by lastActive (in real app, would use timestamps)
        return (a.lastActive || "").localeCompare(b.lastActive || "");
      default:
        return 0;
    }
  });

  // Statistics
  const totalMatches = staticMatches.length;
  const filteredCount = filteredMatches.length;
  const averageMatchScore = filteredMatches.length > 0 
    ? Math.round(filteredMatches.reduce((sum, match) => sum + match.matchScore, 0) / filteredMatches.length)
    : 0;
  const topRatedCount = filteredMatches.filter(match => match.rating >= 4.8).length;
  const availableNowCount = filteredMatches.filter(match => match.availability === "Full-Time").length;

  // Simulate loading
  useEffect(() => {
    if (filters.search || filters.availability || filters.location) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [filters]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <Navbar isSearchBar={true} />

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className='text-4xl font-bold drop-shadow-lg'>
              Professional Matchmaking
            </h1>
          </motion.div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect with top-tier professionals and find your perfect career match
          </p>
        </div>

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{filteredCount}</p>
                <p className="text-gray-300 text-sm">Professionals Found</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{averageMatchScore}%</p>
                <p className="text-gray-300 text-sm">Avg Match Score</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{topRatedCount}</p>
                <p className="text-gray-300 text-sm">Top Rated (4.8+)</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{availableNowCount}</p>
                <p className="text-gray-300 text-sm">Available Now</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 flex-wrap'>
          {/* FilterBar: full width on all screens */}
          <div className='w-full'>
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>

          {/* SortDropdown: full width on small screens, fixed width on large screens */}
          <div className='w-full lg:w-64'>
            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
              onReset={() => {
                setFilters({
                  search: "",
                  availability: "",
                  location: "",
                  experience: "",
                  skills: "",
                  rating: "",
                  industry: "",
                  salary: ""
                });
                setSortOption("relevance");
              }}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-300">Searching for matches...</span>
            </div>
          </motion.div>
        )}

        {/* Matches Grid */}
        {!isLoading && sortedMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search criteria to find more professionals.
            </p>
            <button
              onClick={() => {
                setFilters({
                  search: "",
                  availability: "",
                  location: "",
                  experience: "",
                  skills: "",
                  rating: "",
                  industry: "",
                  salary: ""
                });
                setSortOption("relevance");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch'
          >
            {sortedMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <MatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && sortedMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Showing {sortedMatches.length} of {totalMatches} professionals</span>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="w-4 h-4" />
                <span>Average match: {averageMatchScore}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Matchmaking;
