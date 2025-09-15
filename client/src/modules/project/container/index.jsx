import React, { useState } from "react";

import { Button, Footer } from "../../../components";
import Navbar from "../../../components/header/index";
import ProjectForm from "../components/ProjectForm";
import ApplicantsList from "../components/ApplicantsList";
import ProjectCard from "../components/ProjectCard";

export default function Project() {
  // single active section state
  const [activeSection, setActiveSection] = useState("projects"); // default: show projects
  const projectsData = [
    {
      title: "AI-Powered Resume Analyzer",
      status: "Active",
      priority: "High",
      description:
        "Leverage AI to analyze resumes and provide job-fit insights for companies hiring at scale.",
      startDate: "2025-09-01",
      deadline: "2025-12-01",
      roleNeeded: "Frontend Developer",
      applicantsCount: 12,
      newApplicants: 2,
      activity: "3 comments today",
      tags: ["React", "TailwindCSS", "Next.js", "AI"],
      rating: 4,
      team: [
        { name: "Alice", avatar: "/avatars/alice.png" },
        { name: "Bob", avatar: "/avatars/bob.png" },
        { name: "Charlie", avatar: "/avatars/charlie.png" },
      ],
    },
    {
      title: "Decentralized Freelance Platform",
      status: "Active",
      priority: "Medium",
      description:
        "A blockchain-based freelance marketplace with transparent contracts and instant payments.",
      startDate: "2025-08-15",
      deadline: "2026-01-15",
      roleNeeded: "Blockchain Engineer",
      applicantsCount: 25,
      newApplicants: 5,
      activity: "2 new updates",
      tags: ["Solidity", "Ethereum", "Web3", "Smart Contracts"],
      rating: 5,
      team: [
        { name: "David", avatar: "/avatars/david.png" },
        { name: "Eva", avatar: "/avatars/eva.png" },
      ],
    },
    {
      title: "Mental Health Chatbot",
      status: "Completed",
      priority: "High",
      description:
        "An AI chatbot designed to provide mental health support, daily check-ins, and mindfulness tips.",
      startDate: "2025-01-10",
      deadline: "2025-06-30",
      roleNeeded: "Data Scientist",
      applicantsCount: 40,
      newApplicants: 0,
      activity: "5 new messages",
      tags: ["Python", "TensorFlow", "Healthcare AI"],
      rating: 5,
      team: [
        { name: "Fiona", avatar: "/avatars/fiona.png" },
        { name: "George", avatar: "/avatars/george.png" },
      ],
    },
    {
      title: "Remote Team Productivity Dashboard",
      status: "Upcoming",
      priority: "Medium",
      description:
        "A real-time dashboard for distributed teams to track productivity, communication, and goals.",
      startDate: "2025-10-01",
      deadline: "2026-02-01",
      roleNeeded: "Full Stack Developer",
      applicantsCount: 7,
      newApplicants: 1,
      activity: "1 update today",
      tags: ["Node.js", "React", "Docker", "Microservices"],
      rating: 3,
      team: [
        { name: "Hannah", avatar: "/avatars/hannah.png" },
        { name: "Ian", avatar: "/avatars/ian.png" },
      ],
    },
    {
      title: "AI Resume Enhancer Tool",
      status: "Draft",
      priority: "Low",
      description:
        "Build an AI-powered resume enhancer tool for job seekers to improve their CVs automatically.",
      startDate: "2025-11-01",
      deadline: "2026-03-01",
      roleNeeded: "Machine Learning Engineer",
      applicantsCount: 0,
      newApplicants: 0,
      activity: "Draft created",
      tags: ["Python", "AI", "NLP", "Resume"],
      rating: 0,
      team: [{ name: "Jack", avatar: "/avatars/jack.png" }],
    },
  ];

  return (
    <>
      <Navbar isSearchBar={true} />

      <div className='px-6 py-8 space-y-12 max-w-7xl mx-auto'>
        {/* Section Buttons */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <Button
            onClick={() => setActiveSection("form")}
            className={activeSection === "form" ? "bg-indigo-700" : ""}
          >
            Project Form
          </Button>
          <Button
            onClick={() => setActiveSection("projects")}
            className={activeSection === "projects" ? "bg-indigo-700" : ""}
          >
            All Projects
          </Button>
          <Button
            onClick={() => setActiveSection("applicants")}
            className={activeSection === "applicants" ? "bg-indigo-700" : ""}
          >
            Applicants Overview
          </Button>
        </div>

        {/* Conditional Sections: show only one at a time */}
        {activeSection === "form" && (
          <section>
            <ProjectForm />
          </section>
        )}

        {activeSection === "projects" && (
          <section>
            <h2 className='text-3xl font-bold text-white mb-6'>All Projects</h2>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {projectsData.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </div>
          </section>
        )}

        {activeSection === "applicants" && (
          <section>
            <h2 className='text-3xl font-bold text-white mb-6'>
              Applicants Overview
            </h2>
            <ApplicantsList />
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}
