import React from "react";
import { Code, X, Plus } from "lucide-react";
import { Button } from "../../components";

export default function Skills({ editing, form, setForm }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Code className="w-5 h-5 mr-2 text-green-400" /> Skills
      </h2>
      <div className="flex flex-wrap gap-2 items-center">
        {Object.entries(form?.skills || {}).map(([skill, level]) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm flex items-center space-x-2"
          >
            <span>{skill} - {level}</span>
            {editing && (
              <button
                onClick={() => {
                  const newSkills = { ...form.skills };
                  delete newSkills[skill];
                  setForm({ ...form, skills: newSkills });
                }}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </span>
        ))}

        {editing && (
          <>
            <input
              type="text"
              placeholder="Skill: Level (e.g., React: Intermediate)"
              value={form.newSkill || ""}
              onChange={(e) => setForm({ ...form, newSkill: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && form.newSkill.trim()) {
                  const [skill, level] = form.newSkill.split(":").map((s) => s.trim());
                  setForm({
                    ...form,
                    skills: { ...form.skills, [skill]: level || "Beginner" },
                    newSkill: "",
                  });
                }
              }}
              className="px-3 py-1 rounded-lg border border-gray-500 bg-transparent text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => {
                if (form.newSkill?.trim()) {
                  const [skill, level] = form.newSkill.split(":").map((s) => s.trim());
                  setForm({
                    ...form,
                    skills: { ...form.skills, [skill]: level || "Beginner" },
                    newSkill: "",
                  });
                }
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Skill
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
