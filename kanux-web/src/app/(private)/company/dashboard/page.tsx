"use client";

import React from "react";
import { Users, FileText, MessageSquare, PaperclipIcon } from "lucide-react";
import {
  StatCard,
  LatestSubmissions,
  RecentlyViewed,
} from "@/components/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useSyncExternalStore } from "react";
import { companiesService } from "@/services/companies.service";
import {
  candidatesService,
  CandidateListItem,
  CandidateProfile,
} from "@/services/candidates.service";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// Mock data
const MOCK_STATS = {
  activeChallenges: { value: 12, change: "+2 this month" },
  candidatesEvaluated: { value: 248, change: "+18% from last month" },
  newApplications: { value: 34, change: "+7 this week" },
  messages: { value: 8, change: "3 unread" },
};

const MOCK_CANDIDATES: CandidateListItem[] = [
  {
    talent_id: "1",
    first_name: "Alex",
    last_name: "Smith",
    title: "Frontend Developer",
    education: "Computer Science",
    skills: [
      { id: "1", name: "React", level: "Expert", category_id: "frontend" },
      { id: "2", name: "TypeScript", level: "Expert", category_id: "frontend" },
    ],
    profile: null as unknown as CandidateProfile,
  },
  {
    talent_id: "2",
    first_name: "Sarah",
    last_name: "Martinez",
    title: "Full Stack Developer",
    education: "Software Engineering",
    skills: [
      { id: "3", name: "Node.js", level: "Advanced", category_id: "backend" },
      {
        id: "4",
        name: "PostgreSQL",
        level: "Advanced",
        category_id: "backend",
      },
    ],
    profile: null as unknown as CandidateProfile,
  },
  {
    talent_id: "3",
    first_name: "Aaron",
    last_name: "Matarrita",
    title: "Backend Developer",
    education: "Information Systems",
    skills: [
      { id: "5", name: "Java", level: "Expert", category_id: "backend" },
      {
        id: "6",
        name: "Spring Boot",
        level: "Advanced",
        category_id: "backend",
      },
    ],
    profile: null as unknown as CandidateProfile,
  },
];

export default function DashboardPage() {
  const { session } = useAuth();

  const isClient = useIsClient();

  const [stats, setStats] = React.useState(MOCK_STATS);
  const [loading, setLoading] = React.useState(false);
  const [candidates, setCandidates] =
    React.useState<CandidateListItem[]>(MOCK_CANDIDATES);

  const greeting = React.useMemo(() => {
    if (!isClient || !session) return "Bienvenido de vuelta";

    if (session.user.userType === "company") {
      return `Bienvenido de vuelta, ${session.user.profile?.name || "Company"}`;
    }

    return "Bienvenido de vuelta";
  }, [isClient, session]);

  React.useEffect(() => {
    if (!session?.token) return;

    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const response = await companiesService.getCompanyDashboard(
          session.token,
        );

        const dashboard = response.data;
        setStats({
          activeChallenges: {
            value: dashboard.totalChallenges,
            change: "",
          },
          candidatesEvaluated: {
            value: dashboard.totalTalentsParticipated,
            change: "",
          },
          newApplications: {
            value: dashboard.totalUsersParticipated,
            change: "",
          },
          messages: {
            value: dashboard.unreadMessages,
            change: "",
          },
        });
        const candidatesRes = await candidatesService.getCandidatesDash(
          session.token,
        );

        setCandidates(candidatesRes);
      } catch (error) {
        console.error("Dashboard error, usando MOCK_STATS", error);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [session?.token]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">{greeting}</h1>
        <p className="text-slate-600">
          Aquí tienes un resumen de la actividad reciente en tu cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Desafíos Activos"
          value={stats.activeChallenges.value}
          icon={PaperclipIcon}
        />
        <StatCard
          title="Candidatos Evaluados"
          value={stats.candidatesEvaluated.value}
          icon={Users}
        />
        <StatCard
          title="Aplicaciones Nuevas"
          value={stats.newApplications.value}
          icon={FileText}
        />
        <StatCard
          title="Mensajes no Leídos"
          value={stats.messages.value}
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_380px] gap-12">
        <LatestSubmissions candidates={candidates} />
        <RecentlyViewed />
      </div>
    </div>
  );
}
