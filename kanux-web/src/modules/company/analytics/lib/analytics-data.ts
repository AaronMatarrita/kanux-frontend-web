export interface AnalyticsData {
  summary: {
    totalCandidates: number;
    activeChallenges: number;
    completionRate: number;
    topMatchScore: number;
  };
  challengePerformance: {
    challengeId: string;
    title: string;
    avgScore: number;
    submissions: number;
  }[];
  scoreDistribution: Record<string, number>;
  topCandidates: {
    id: string;
    name: string;
    score: number;
    skills: (string | null)[];
  }[];
  candidateQuality: {
    high: number;
    medium: number;
    low: number;
  };
}

export const analyticsData: AnalyticsData = {
  summary: {
    totalCandidates: 1248,
    activeChallenges: 12,
    completionRate: 78,
    topMatchScore: 96,
  },
  challengePerformance: [
    {
      challengeId: "2038d862-a0d1-43ff-8d03-ee6677c6b885",
      title: "React Assessment",
      avgScore: 85,
      submissions: 156,
    },
    {
      challengeId: "2b98bd03-3d34-4953-ab61-8f8482ad6619",
      title: "TypeScript Challenge",
      avgScore: 82,
      submissions: 142,
    },
    {
      challengeId: "3c98bd03-3d34-4953-ab61-8f8482ad6620",
      title: "Node.js Backend",
      avgScore: 79,
      submissions: 128,
    },
    {
      challengeId: "4d98bd03-3d34-4953-ab61-8f8482ad6621",
      title: "PostgreSQL",
      avgScore: 76,
      submissions: 98,
    },
    {
      challengeId: "5e98bd03-3d34-4953-ab61-8f8482ad6622",
      title: "Python Fundamentals",
      avgScore: 74,
      submissions: 87,
    },
  ],
  scoreDistribution: {
    "90-100": 48,
    "80-89": 92,
    "70-79": 78,
    "60-69": 45,
    "Below 60": 23,
  },
  topCandidates: [
    {
      id: "66932916-436c-4856-8bb9-e553c555ac26",
      name: "Emily Rodriguez",
      score: 95,
      skills: ["Vue.js", "AWS", "Docker"],
    },
    {
      id: "ad4b10c0-8c31-4556-a591-a14c69e673cb",
      name: "Sarah Martinez",
      score: 92,
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: "90f983c2-5574-4d32-be37-8e0b0b7e17b3",
      name: "James Chen",
      score: 90,
      skills: ["Python", "Django", "PostgreSQL"],
    },
    {
      id: "12345678-5574-4d32-be37-8e0b0b7e17b4",
      name: "Michael Kim",
      score: 88,
      skills: ["Angular", "C#", ".NET"],
    },
  ],
  candidateQuality: {
    high: 48,
    medium: 92,
    low: 23,
  },
};

export const candidateQualityData = [
  { quality: "Alta", value: 48, fill: "#22c55e" },
  { quality: "Media", value: 92, fill: "#eab308" },
  { quality: "Baja", value: 23, fill: "#ef4444" },
];

export const performanceDistribution = [
  { range: "90-100%", candidates: 48, fill: "#22c55e" },
  { range: "80-89%", candidates: 92, fill: "#3b82f6" },
  { range: "70-79%", candidates: 78, fill: "#eab308" },
  { range: "60-69%", candidates: 45, fill: "#f97316" },
  { range: "Below 60%", candidates: 23, fill: "#ef4444" },
];
