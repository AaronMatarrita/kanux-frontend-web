"use client";

import React from "react";
import { Users, FileText, MessageSquare, PaperclipIcon } from "lucide-react";
import {
  StatCard,
  LatestSubmissions,
  RecentlyViewed,
  DashboardErrorState,
} from "@/components/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useSyncExternalStore } from "react";
import { companiesService } from "@/services/companies.service";
import {
  candidatesService,
  CandidateListItem,
} from "@/services/candidates.service";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function DashboardPage() {
  const { session } = useAuth();

  const isClient = useIsClient();

  const [stats, setStats] = React.useState<{
    activeChallenges: number;
    candidatesEvaluated: number;
    newApplications: number;
    messages: number;
  } | null>(null);
  const [candidates, setCandidates] = React.useState<CandidateListItem[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [statsError, setStatsError] = React.useState<string | null>(null);
  const [candidatesError, setCandidatesError] = React.useState<string | null>(
    null,
  );

  const greeting = React.useMemo(() => {
    if (!isClient || !session) return "Bienvenido de vuelta";

    if (session.user.userType === "company") {
      return `Bienvenido de vuelta, ${session.user.profile?.name || "Company"}`;
    }

    return "Bienvenido de vuelta";
  }, [isClient, session]);

  const loadRecentCandidates = React.useCallback(async () => {
    if (!session?.token) {
      setCandidatesError("No hay sesión activa");
      return;
    }

    setCandidatesError(null);

    try {
      const candidatesRes = await candidatesService.getCandidatesDash(
        session.token,
      );
      setCandidates(candidatesRes);
    } catch (error) {
      console.error("Error cargando candidatos recientes", error);
      setCandidatesError("No se pudieron cargar los candidatos recientes");
      setCandidates([]);
    }
  }, [session?.token]);

  React.useEffect(() => {
    if (!session?.token) {
      setStatsError("No hay sesión activa");
      setCandidatesError("No hay sesión activa");
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      setStatsError(null);

      try {
        const response = await companiesService.getCompanyDashboard(
          session.token,
        );

        const dashboard = response.data;

        setStats({
          activeChallenges: dashboard.totalChallenges,
          candidatesEvaluated: dashboard.totalTalentsParticipated,
          newApplications: dashboard.totalUsersParticipated,
          messages: dashboard.unreadMessages,
        });
      } catch (error) {
        console.error("Error cargando stats", error);
        setStatsError("No se pudieron cargar las métricas");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    loadRecentCandidates();
  }, [session?.token, loadRecentCandidates]);

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
          value={statsError ? "—" : (stats?.activeChallenges ?? "—")}
          subtitle={statsError ?? undefined}
          icon={PaperclipIcon}
        />

        <StatCard
          title="Candidatos Evaluados"
          value={statsError ? "—" : (stats?.candidatesEvaluated ?? "—")}
          subtitle={statsError ?? undefined}
          icon={Users}
        />

        <StatCard
          title="Aplicaciones Nuevas"
          value={statsError ? "—" : (stats?.newApplications ?? "—")}
          subtitle={statsError ?? undefined}
          icon={FileText}
        />

        <StatCard
          title="Mensajes no Leídos"
          value={statsError ? "—" : (stats?.messages ?? "—")}
          subtitle={statsError ?? undefined}
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_380px] gap-12">
        {candidatesError ? (
          <DashboardErrorState
            title="Candidatos recientes"
            message={candidatesError}
            onRetry={loadRecentCandidates}
          />
        ) : (
          <LatestSubmissions candidates={candidates} />
        )}
        <RecentlyViewed />
      </div>
    </div>
  );
}
