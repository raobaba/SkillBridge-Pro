// components/ProjectForm.jsx
import React, { useState } from "react";
import { Plus, UploadCloud } from "lucide-react";
import { Input, Button } from "../../../components";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roleNeeded: "",
    startDate: "",
    deadline: "",
    tags: [],
    maxApplicants: "",
    priority: "Medium",
    status: "Active",
    collaborators: [],
    color: "#7f00ff",
  });

  const [tagInput, setTagInput] = useState("");
  const [collabInput, setCollabInput] = useState("");

  const statuses = ["Active", "Draft", "Upcoming"];
  const priorities = ["High", "Medium", "Low"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleAddCollaborator = () => {
    if (collabInput && !formData.collaborators.includes(collabInput)) {
      setFormData({
        ...formData,
        collaborators: [...formData.collaborators, collabInput],
      });
      setCollabInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Data:", formData);
    alert("Project submitted! Check console for static data.");
  };

  return (
    <div className='bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto backdrop-blur-sm border border-white/10 space-y-6'>
      <h2 className='text-3xl font-bold text-white mb-6'>Post a New Project</h2>

      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Title */}
        <Input
          label='Project Title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          placeholder='Enter project title'
        />

        {/* Description */}
        <Input
          label='Description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Describe the project'
          textarea
          rows={4}
          maxLength={500}
        />
        <p className='text-gray-400 text-xs mt-1'>
          {formData.description.length}/500
        </p>

        {/* Role + Dates */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Input
            label='Role Needed'
            name='roleNeeded'
            value={formData.roleNeeded}
            onChange={handleChange}
            placeholder='Frontend Developer'
          />
          <Input
            label='Start Date'
            name='startDate'
            value={formData.startDate}
            onChange={handleChange}
            type='date'
          />
          <Input
            label='Deadline'
            name='deadline'
            value={formData.deadline}
            onChange={handleChange}
            type='date'
          />
        </div>

        {/* Priority + Status */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Priority'
            name='priority'
            value={formData.priority}
            onChange={handleChange}
            type='select'
            options={priorities.map((p) => ({ label: p, value: p }))}
          />
          <Input
            label='Status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            type='select'
            options={statuses.map((s) => ({ label: s, value: s }))}
          />
        </div>

        {/* Tags */}
        <div>
          <label className='block text-gray-300 mb-1'>Skills / Tags</label>
          <div className='flex gap-2 mb-2'>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder='Add a skill'
            />
            <Button onClick={handleAddTag} leftIcon={Plus} variant='default'>
              Add
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className='px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Collaborators */}
        <div>
          <label className='block text-gray-300 mb-1'>Collaborators</label>
          <div className='flex gap-2 mb-2'>
            <Input
              value={collabInput}
              onChange={(e) => setCollabInput(e.target.value)}
              placeholder='Add collaborator name'
            />
            <Button
              onClick={handleAddCollaborator}
              leftIcon={Plus}
              variant='default'
            >
              Add
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.collaborators.map((c, idx) => (
              <span
                key={idx}
                className='px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r from-indigo-500 to-blue-500'
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Max Applicants */}
        <Input
          label='Max Applicants'
          name='maxApplicants'
          type='number'
          value={formData.maxApplicants}
          onChange={handleChange}
          placeholder='Maximum number of applicants'
        />

        {/* File Upload */}
        <div>
          <label className='block text-gray-300 mb-1'>Attach Files</label>
          <label className='flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all'>
            <UploadCloud className='w-5 h-5' />
            Upload
            <input type='file' className='hidden' />
          </label>
        </div>

        {/* Submit */}
        <div className='text-right mt-4'>
          <Button type='submit' variant='default' size='lg'>
            Post Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
