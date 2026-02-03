"use client";
import React from 'react';

interface SkillCardProps {
  category: string;
  skills: { name: string; progress: number }[];
}

export function SkillCard({ category, skills = [] }: SkillCardProps) {
  if (skills.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-shadow duration-300 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-50">
        {category}
      </h3>
     
      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div key={`${skill.name}-${index}`} className="group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm md:text-base font-medium text-gray-700">
                {skill.name}
              </span>
              <span className="text-sm md:text-base font-semibold text-gray-600 ml-2">
                {skill.progress}%
              </span>
            </div>
           
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gray-900 h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${skill.progress}%`,
                  animation: `progressLoad 1.5s ease-out ${index * 0.1}s font-bold`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
