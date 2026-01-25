'use client';

import React from 'react';
import { CheckCircle, Trophy, Zap, Award } from 'lucide-react';
import { StatCard, ProfileCompletion, RecommendedChallenges, SkillsToImprove } from '@/components/dashboard';

import { useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}


const MOCK_STATS = {
  skillsVerified: { value: 4, change: '+1 this month' },
  challengesCompleted: { value: 23, change: '92% average score' },
  activeChallenges: { value: 2, change: 'In progress' },
  profileCompletion: { value: 85, change: '' },
};

const MOCK_RECOMMENDED_CHALLENGES = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    description: 'Master advanced patterns and best practices in React development.',
    difficulty: 'Advanced' as const,
    skills: ['React', 'Advanced', 'TypeScript'],
  },
  {
    id: '2',
    name: 'API Integration Challenge',
    description: 'Intermediate level challenge for building RESTful APIs.',
    difficulty: 'Intermediate' as const,
    skills: ['Intermediate', 'REST APIs', 'Node.js'],
  },
  {
    id: '3',
    name: 'Database Design',
    description: 'Learn database design principles and optimization techniques.',
    difficulty: 'Intermediate' as const,
    skills: ['Intermediate', 'PostgreSQL', 'SQL'],
  },
];

const MOCK_SKILLS_TO_IMPROVE = [
  { name: 'TypeScript', level: 75 },
  { name: 'Docker', level: 45 },
  { name: 'PostgreSQL', level: 35 },
];

export default function TalentDashboardPage() {
   const { session } = useAuth();
  const isClient = useIsClient();

  const getUserName = () => {
    if (!isClient) return 'Alex';
    
    if (!session) return 'Alex';
    
    if (session.user.userType === 'talent') {
      return session.user.profile?.full_name || 'Talento';
    }
    
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Bienvenido de vuelta, {getUserName()}</h1>
        <p className="text-slate-600">Keep building your skills and unlocking new opportunities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Skills Verified"
          value={MOCK_STATS.skillsVerified.value}
          change={MOCK_STATS.skillsVerified.change}
          icon={CheckCircle}
        />
        <StatCard
          title="Challenges Completed"
          value={MOCK_STATS.challengesCompleted.value}
          change={MOCK_STATS.challengesCompleted.change}
          icon={Trophy}
        />
        <StatCard
          title="Active Challenges"
          value={MOCK_STATS.activeChallenges.value}
          change={MOCK_STATS.activeChallenges.change}
          icon={Zap}
        />
        <StatCard
          title="Profile Completeness"
          value={`${MOCK_STATS.profileCompletion.value}%`}
          change="Almost there!"
          icon={Award}
        />
      </div>

      {/* Profile Completion */}
      <ProfileCompletion
        completionPercentage={MOCK_STATS.profileCompletion.value}
        message="Add your profile picture to reach 100%"
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendedChallenges challenges={MOCK_RECOMMENDED_CHALLENGES} />
        <SkillsToImprove skills={MOCK_SKILLS_TO_IMPROVE} />
      </div>
    </div>
  );
}
