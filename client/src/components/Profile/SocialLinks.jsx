import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";
import { Input, StackOverflowIcon } from "../../components";

export default function SocialLinks({ editing, form, handleChange, userData }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">Social Links</h2>
      {editing ? (
        <div className="space-y-3">
          <Input name="githubUrl" value={form?.githubUrl || ""} onChange={handleChange} placeholder="GitHub URL" className="bg-white/10" />
          <Input name="linkedinUrl" value={form?.linkedinUrl || ""} onChange={handleChange} placeholder="LinkedIn URL" className="bg-white/10" />
          <Input name="portfolioUrl" value={form?.portfolioUrl || ""} onChange={handleChange} placeholder="Portfolio Website" className="bg-white/10" />
          <Input name="stackoverflowUrl" value={form?.stackoverflowUrl || ""} onChange={handleChange} placeholder="Stack Overflow URL" className="bg-white/10" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {userData?.githubUrl && <a href={userData.githubUrl} target="_blank" rel="noreferrer" className="flex items-center"><Github className="w-5 h-5 mr-2"/> GitHub</a>}
          {userData?.linkedinUrl && <a href={userData.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center"><Linkedin className="w-5 h-5 mr-2"/> LinkedIn</a>}
          {userData?.portfolioUrl && <a href={userData.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center"><Globe className="w-5 h-5 mr-2"/> Portfolio</a>}
          {userData?.stackoverflowUrl && <a href={userData.stackoverflowUrl} target="_blank" rel="noreferrer" className="flex items-center"><StackOverflowIcon className="w-5 h-5 mr-2"/> Stack Overflow</a>}
        </div>
      )}
    </div>
  );
}
