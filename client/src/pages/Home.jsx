import React, { useState, useEffect } from "react";
import {
  Users,
  Code,
  Zap,
  Trophy,
  MessageSquare,
  GitBranch,
  Star,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Brain,
  Target,
  Calendar,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/header";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
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

  const stats = [
    { value: "50K+", label: "Active Developers" },
    { value: "25K+", label: "Projects Completed" },
    { value: "95%", label: "Match Success Rate" },
    { value: "150+", label: "Countries" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=64&h=64&fit=crop&crop=face",
      quote:
        "Found my perfect co-founder through DevCollab. The AI matching is incredibly accurate!",
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateLab",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      quote:
        "Hired 3 amazing developers for my startup. The skill verification system is a game-changer.",
    },
    {
      name: "Priya Patel",
      role: "Open Source Maintainer",
      company: "CoreLibs",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote:
        "The platform helped me find passionate contributors for my open-source projects.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='relative overflow-hidden pt-20'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
              Bridge Your Skills
              <br />
              <span className='text-white'>To Success</span>
            </h1>
            <p className='text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              The professional platform where developers connect, collaborate,
              and accelerate their careers. Bridge the gap between your skills
              and your next opportunity with AI-powered matching.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                Start Collaborating
                <ArrowRight className='w-5 h-5 ml-2 inline-block' />
              </button>
              <button className='border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5'>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-black/20 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-3xl lg:text-4xl font-bold text-blue-400 mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-400'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
              Powerful Features for
              <span className='text-blue-400'> Professional Growth</span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Bridge your skills to success with comprehensive tools for
              matching, collaboration, and career advancement.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Feature Cards */}
            <div className='grid gap-6'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeFeature === index
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className='flex items-start space-x-4'>
                    <div
                      className={`p-3 rounded-lg ${
                        activeFeature === index ? "bg-blue-500" : "bg-gray-700"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>
                        {feature.title}
                      </h3>
                      <p className='text-gray-300'>{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Showcase */}
            <div className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10'>
              <div className='aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6'>
                <div className='text-6xl'>{features[activeFeature].icon}</div>
              </div>
              <h3 className='text-2xl font-bold mb-4'>
                {features[activeFeature].title}
              </h3>
              <p className='text-gray-300 text-lg leading-relaxed'>
                {features[activeFeature].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how-it-works' className='py-20 bg-black/20 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
              How It <span className='text-purple-400'>Works</span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Get started in minutes and find your perfect collaboration match.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
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
            ].map((item, index) => (
              <div key={index} className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                  {item.icon}
                </div>
                <div className='text-blue-400 font-bold text-lg mb-2'>
                  Step {item.step}
                </div>
                <h3 className='text-xl font-semibold mb-4'>{item.title}</h3>
                <p className='text-gray-300'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
              What Developers <span className='text-green-400'>Say</span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Join thousands of developers who've found success through our
              platform.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300'
              >
                <div className='flex items-center mb-4'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-12 h-12 rounded-full mr-4'
                  />
                  <div>
                    <div className='font-semibold'>{testimonial.name}</div>
                    <div className='text-gray-400 text-sm'>
                      {testimonial.role}
                    </div>
                    <div className='text-blue-400 text-sm'>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className='text-gray-300 italic'>"{testimonial.quote}"</p>
                <div className='flex mt-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='py-20 bg-black/20 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
              Simple <span className='text-yellow-400'>Pricing</span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Choose the plan that fits your collaboration needs.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "Basic profile creation",
                  "Limited project matching",
                  "Basic chat functionality",
                  "Community support",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "month",
                features: [
                  "Advanced AI matching",
                  "Unlimited project posts",
                  "Priority support",
                  "Advanced analytics",
                  "Portfolio sync",
                  "Skill gap analysis",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "month",
                features: [
                  "Everything in Pro",
                  "Team management",
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced security",
                  "Custom branding",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium'>
                    Most Popular
                  </div>
                )}
                <div className='text-center mb-8'>
                  <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                  <div className='text-4xl font-bold mb-1'>
                    {plan.price}
                    <span className='text-lg text-gray-400'>
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <ul className='space-y-3 mb-8'>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center'>
                      <CheckCircle className='w-5 h-5 text-green-400 mr-3' />
                      <span className='text-gray-300'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-white/10'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6'>
              Ready to <span className='text-blue-400'>Bridge</span> Your
              Future?
            </h2>
            <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
              Join thousands of professionals who are already bridging their
              skills to success and transforming their careers.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105'>
                Start Free Today
              </button>
              <button className='border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5'>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-black/40 backdrop-blur-sm border-t border-white/10 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
                  <Code className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold'>SkillBridge Pro</span>
              </div>
              <p className='text-gray-400 mb-4'>
                The professional platform for bridging skills to success and
                accelerating career growth.
              </p>
              <div className='flex space-x-4'>
                <Github className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Linkedin className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Mail className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Features
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Pricing
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  API
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Integrations
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  About
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Blog
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Careers
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Contact
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Help Center
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Community
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Status
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Privacy
                </div>
              </div>
            </div>
          </div>

          <div className='border-t border-white/10 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2025 SkillBridge Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
