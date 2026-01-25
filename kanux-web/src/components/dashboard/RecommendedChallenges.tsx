'use client';

import React from 'react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
}

interface RecommendedChallengesProps {
  challenges: Challenge[];
}

export const RecommendedChallenges: React.FC<RecommendedChallengesProps> = ({ challenges }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Recommended Challenges</h2>
      
      <div className="space-y-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="pb-6 border-b border-slate-200 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{challenge.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>
              </div>
              <button className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors">
                Start
              </button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              {challenge.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
