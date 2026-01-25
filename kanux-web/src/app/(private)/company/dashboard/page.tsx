'use client';

import React from 'react';
import { Zap, Users, FileText, MessageSquare } from 'lucide-react';
import { StatCard, LatestSubmissions, RecentlyViewed } from '@/components/dashboard';

// Mock data
const MOCK_STATS = {
  activeChallenges: { value: 12, change: '+2 this month' },
  candidatesEvaluated: { value: 248, change: '+18% from last month' },
  newApplications: { value: 34, change: '+7 this week' },
  messages: { value: 8, change: '3 unread' },
};

const MOCK_SUBMISSIONS = [
  {
    id: '1',
    candidateName: 'Alex Smith',
    challengeName: 'React Patterns',
    submittedAt: '2 hours ago',
    score: 92,
  },
  {
    id: '2',
    candidateName: 'Sarah Martinez',
    challengeName: 'Full-Stack API Challenge',
    submittedAt: '4 hours ago',
    score: 88,
  },
  {
    id: '3',
    candidateName: 'Aaron Matarrita',
    challengeName: 'Full-Stack API Challenge',
    submittedAt: '8 hours ago',
    score: 90,
  },
  {
    id: '4',
    candidateName: 'Josue Porras',
    challengeName: 'Full-Stack API Challenge',
    submittedAt: '10 hours ago',
    score: 90,
  },
];

const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Alex Smith',
    matchScore: 92,
    skills: [{ name: 'React', level: 'Expert' }, { name: 'TypeScript', level: 'Expert' }, { name: 'Node.js', level: 'Advanced' }],
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    matchScore: 88,
    skills: [{ name: 'React', level: 'Expert' }, { name: 'TypeScript', level: 'Advanced' }, { name: 'Node.js', level: 'Expert' }],
  },
  {
    id: '3',
    name: 'Aaron Matarrita',
    matchScore: 90,
    skills: [{ name: 'React', level: 'Expert' }, { name: 'TypeScript', level: 'Expert' }, { name: 'Node.js', level: 'Advanced' }],
  },
  {
    id: '4',
    name: 'Josue Porras',
    matchScore: 90,
    skills: [{ name: 'React', level: 'Advanced' }, { name: 'TypeScript', level: 'Advanced' }, { name: 'Node.js', level: 'Expert' }],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Tech Corporhh</h1>
        <p className="text-slate-600">Here what happening with your hiring process today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Challenges"
          value={MOCK_STATS.activeChallenges.value}
          change={MOCK_STATS.activeChallenges.change}
          icon={Zap}
        />
        <StatCard
          title="Candidates Evaluated"
          value={MOCK_STATS.candidatesEvaluated.value}
          change={MOCK_STATS.candidatesEvaluated.change}
          icon={Users}
        />
        <StatCard
          title="New Applications"
          value={MOCK_STATS.newApplications.value}
          change={MOCK_STATS.newApplications.change}
          icon={FileText}
        />
        <StatCard
          title="Messages"
          value={MOCK_STATS.messages.value}
          change={MOCK_STATS.messages.change}
          icon={MessageSquare}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestSubmissions submissions={MOCK_SUBMISSIONS} />
        <RecentlyViewed profiles={MOCK_PROFILES} />
      </div>
    </div>
  );
}
