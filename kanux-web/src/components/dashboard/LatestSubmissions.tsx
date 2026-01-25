'use client';

import React from 'react';
import { Eye } from 'lucide-react';

interface ChallengeSubmission {
  id: string;
  candidateName: string;
  challengeName: string;
  submittedAt: string;
  score: number;
}

interface LatestSubmissionsProps {
  submissions: ChallengeSubmission[];
}

export const LatestSubmissions: React.FC<LatestSubmissionsProps> = ({ submissions }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Latest Challenge Submissions</h2>
      
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0">
            <div className="flex-1">
              <p className="font-medium text-slate-900">{submission.candidateName}</p>
              <p className="text-sm text-slate-600">{submission.challengeName}</p>
              <p className="text-xs text-slate-500 mt-1">{submission.submittedAt}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-slate-900">{submission.score}%</p>
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
