'use client';

import React from 'react';
import { Eye } from 'lucide-react';

interface ProfileSkill {
  name: string;
  level: string;
}

interface RecentProfile {
  id: string;
  name: string;
  matchScore: number;
  skills: ProfileSkill[];
}

interface RecentlyViewedProps {
  profiles: RecentProfile[];
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ profiles }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Recently Viewed Profiles</h2>
      
      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0">
            <div className="flex-1">
              <p className="font-medium text-slate-900">{profile.name}</p>
              <div className="flex gap-2 mt-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="font-semibold text-slate-900">{profile.matchScore}%</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Eye size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
