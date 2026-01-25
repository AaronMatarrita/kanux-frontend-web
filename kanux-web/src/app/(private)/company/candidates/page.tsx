'use client';

import React from 'react';
import { CandidatesList } from '@/components/candidates';

export default function CandidatesPage() {
  const handleViewProfile = (candidateId: string) => {
    console.log('View profile:', candidateId);
  };

  const handleContact = (candidateId: string) => {
    console.log('Contact candidate:', candidateId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidatesList
        onViewProfile={handleViewProfile}
        onContact={handleContact}
      />
    </div>
  );
}
