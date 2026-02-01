"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Trophy,
  MessageCircleHeart,
  MessageSquareText,
} from "lucide-react";
import {
  StatCard,
  ProfileCompletion,
  RecommendedChallenges,
  Feed,
  DashboardErrorState,
} from "@/components/dashboard";

import { useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  profilesService,
  FeedPost,
  DashboardStats,
} from "@/services/profiles.service";
import { DashboardChallenge } from "@/components/dashboard/RecommendedChallenges";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function TalentDashboardPage() {
  const { session } = useAuth();
  const isClient = useIsClient();

  const [recommendedChallenges, setRecommendedChallenges] = useState<
    DashboardChallenge[]
  >([]);

  const [profileCompleteness, setProfileCompleteness] = useState<number>(0);

  const [challengesError, setChallengesError] = useState<string | null>(null);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadRecommendedChallenges = React.useCallback(async () => {
    try {
      setIsLoadingChallenges(true);

      const data = await profilesService.getFirstChallenges();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No hay desafíos disponibles");
      }

      setRecommendedChallenges(data as DashboardChallenge[]);
      setChallengesError(null);
    } catch (error) {
      console.error("Error cargando desafíos recomendados", error);
      setChallengesError("No se pudieron cargar los desafíos recomendados");
      setRecommendedChallenges([]);
    } finally {
      setIsLoadingChallenges(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user.userType === "talent") {
      setProfileCompleteness(session.user.profile.profile_completeness);
    } else {
      setProfileCompleteness(0);
    }
  }, [session]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        setStatsError(null);

        const data = await profilesService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats", error);
        setStatsError("No se pudieron cargar las estadísticas");
        setStats(null);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    loadRecommendedChallenges();
  }, [loadRecommendedChallenges]);

  const fetchFeedPosts = React.useCallback(async () => {
    try {
      setIsLoadingFeed(true);
      setFeedError(null);

      const posts = await profilesService.getDashboardFeed();

      if (!Array.isArray(posts)) {
        throw new Error("Respuesta inválida");
      }

      setFeedPosts(posts);
    } catch (error) {
      console.error("Error loading feed posts:", error);
      setFeedError("No se pudo cargar el feed");
      setFeedPosts([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedPosts();
  }, [fetchFeedPosts]);

  const getUserName = () => {
    if (!isClient) return "Alex";
    if (!session) return "Alex";

    if (session.user.userType === "talent") {
      return (
        `${session.user.profile?.first_name ?? ""} ${
          session.user.profile?.last_name ?? ""
        }`.trim() || "Talento"
      );
    }

    return "Alex";
  };

  const renderFeedContent = () => {
    if (isLoadingFeed) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (feedError) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Las publicaciones no se pudieron cargar correctamente.
            </h3>
            <p className="text-gray-600 mb-4">{feedError}</p>
            <button
              onClick={fetchFeedPosts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Intenta de nuevo
            </button>
          </div>
        </div>
      );
    }

    return <Feed posts={feedPosts} />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Bienvenido de vuelta, {getUserName()}
        </h1>
        <p className="text-slate-600">
          Aquí está lo que ha estado pasando mientras estabas fuera.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Habilidades Verificadas"
          value={statsError ? "—" : (stats?.skillsCount ?? "—")}
          subtitle={statsError ?? undefined}
          icon={CheckCircle}
        />

        <StatCard
          title="Desafíos Completados"
          value={statsError ? "—" : (stats?.completedChallengesCount ?? "—")}
          subtitle={statsError ?? undefined}
          icon={Trophy}
        />

        <StatCard
          title="Publicaciones Realizadas"
          value={statsError ? "—" : (stats?.postsCount ?? "—")}
          subtitle={statsError ?? undefined}
          icon={MessageCircleHeart}
        />

        <StatCard
          title="Mensajes Sin Leer"
          value={statsError ? "—" : (stats?.unreadMessagesCount ?? "—")}
          subtitle={statsError ?? undefined}
          icon={MessageSquareText}
        />
      </div>

      <ProfileCompletion
        completionPercentage={profileCompleteness}
        message="Mas información completa tu perfil, mejores oportunidades recibirás."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {challengesError ? (
            <DashboardErrorState
              title="Desafíos recomendados"
              message={challengesError}
              onRetry={loadRecommendedChallenges}
              isRetrying={isLoadingChallenges}
            />
          ) : isLoadingChallenges ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 h-[220px] animate-pulse" />
          ) : (
            <RecommendedChallenges challenges={recommendedChallenges} />
          )}
        </div>

        {renderFeedContent()}
      </div>
    </div>
  );
}
