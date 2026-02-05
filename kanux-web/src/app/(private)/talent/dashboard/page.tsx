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
import { Card, CardContent } from "@/components/ui/card";

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
        <Card className="h-fit">
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div className="space-y-2">
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="h-4 w-56 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>

          <CardContent className="space-y-6 pt-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/60 bg-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-9 w-24 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-9 w-28 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    if (feedError) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Las publicaciones no se pudieron cargar correctamente.
              </h3>
              <p className="text-muted-foreground mb-4">{feedError}</p>
              <button
                onClick={fetchFeedPosts}
                className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer"
              >
                Intenta de nuevo
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return <Feed posts={feedPosts} />;
  };

  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bienvenido de vuelta, {getUserName()}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Aquí está lo que ha estado pasando mientras estabas fuera.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Habilidades Verificadas"
            value={statsError ? "—" : (stats?.skillsCount ?? "—")}
            subtitle={statsError ?? undefined}
            icon={CheckCircle}
            loading={isLoadingStats}
          />

          <StatCard
            title="Desafíos Completados"
            value={statsError ? "—" : (stats?.completedChallengesCount ?? "—")}
            subtitle={statsError ?? undefined}
            icon={Trophy}
            loading={isLoadingStats}
          />

          <StatCard
            title="Publicaciones Realizadas"
            value={statsError ? "—" : (stats?.postsCount ?? "—")}
            subtitle={statsError ?? undefined}
            icon={MessageCircleHeart}
            loading={isLoadingStats}
          />

          <StatCard
            title="Mensajes Sin Leer"
            value={statsError ? "—" : (stats?.unreadMessagesCount ?? "—")}
            subtitle={statsError ?? undefined}
            icon={MessageSquareText}
            loading={isLoadingStats}
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
              <Card>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <RecommendedChallenges challenges={recommendedChallenges} />
            )}
          </div>

          {renderFeedContent()}
        </div>
      </div>
    </div>
  );
}
