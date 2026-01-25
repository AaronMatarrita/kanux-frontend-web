'use client';

import React from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillsToImpoveProps {
  skills: Skill[];
}

export const SkillsToImprove: React.FC<SkillsToImpoveProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Skills to Improve</h2>
      
      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-slate-700">{skill.name}</p>
              <p className="text-xs text-slate-500">{skill.level}%</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">Start learning more</p>
          </div>
        ))}
      </div>
    </div>
  );
};
