import React from "react";
import { Users, Target, Zap } from "lucide-react";

export const heroContent = {
  title: (
    <>
      Bridge Your Skills
      <br />
      <span className='text-white'>To Success</span>
    </>
  ),
  subtitle:
    "The professional platform where developers connect, collaborate, and accelerate their careers. Bridge the gap between your skills and your next opportunity with AI-powered matching.",
};

export const howItWorksContent = {
  heading: (
    <span>
      How It <span className='text-purple-400'>Works</span>
    </span>
  ),
  subtitle:
    "Get started in minutes and find your perfect collaboration match.",
  steps: [
    {
      step: "01",
      title: "Create Your Profile",
      description:
        "Sign up with GitHub, LinkedIn, or email. Our AI analyzes your skills and experience.",
      icon: <Users className='w-8 h-8' />,
    },
    {
      step: "02",
      title: "Get Matched",
      description:
        "Our intelligent algorithm connects you with relevant projects and collaborators.",
      icon: <Target className='w-8 h-8' />,
    },
    {
      step: "03",
      title: "Start Building",
      description:
        "Chat, collaborate, and manage projects with built-in tools and gamification.",
      icon: <Zap className='w-8 h-8' />,
    },
  ],
};

export const pricingContent = {
  heading: (
    <span>
      Simple <span className='text-yellow-400'>Pricing</span>
    </span>
  ),
  subtitle: "Choose the plan that fits your collaboration needs.",
};
