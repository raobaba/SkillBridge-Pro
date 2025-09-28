import React from "react";
import {
  Users,
  Brain,
  Code,
  MessageSquare,
  Trophy,
  TrendingUp,
} from "lucide-react";

export const features = [
  {
    icon: <Users className='w-8 h-8' />,
    title: "Smart Matchmaking",
    description:
      "AI-powered matching connects you with perfect collaborators based on skills, experience, and project needs.",
  },
  {
    icon: <Brain className='w-8 h-8' />,
    title: "AI-Enhanced Profiles",
    description:
      "Let AI optimize your resume, enhance project descriptions, and suggest personalized learning paths.",
  },
  {
    icon: <Code className='w-8 h-8' />,
    title: "Portfolio Sync",
    description:
      "Automatically sync your GitHub, LinkedIn, and StackOverflow profiles to showcase your real skills.",
  },
  {
    icon: <MessageSquare className='w-8 h-8' />,
    title: "Real-Time Collaboration",
    description:
      "Built-in chat, task management, and project tracking to keep your team synchronized.",
  },
  {
    icon: <Trophy className='w-8 h-8' />,
    title: "Gamified Experience",
    description:
      "Earn XP, unlock badges, and climb leaderboards as you complete projects and help others.",
  },
  {
    icon: <TrendingUp className='w-8 h-8' />,
    title: "Skill Intelligence",
    description:
      "Stay ahead with trend analysis, skill gap identification, and career path recommendations.",
  },
];
