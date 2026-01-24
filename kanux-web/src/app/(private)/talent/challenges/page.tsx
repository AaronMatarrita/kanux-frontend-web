"use client";

import { useEffect, useState } from "react";
import { AlertCircle, FileText, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChallengeCard } from "@/components/ui/challenge-card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useChallengesCache } from "@/modules/challenges/store/challengesCache.store";

type ChallengeType = "all" | "technical" | "soft";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  challenge_type?: string;
}

export default function Page() {
  const [challengeType, setChallengeType] = useState<ChallengeType>("all");
  const [technicalChallenges, setTechnicalChallenges] = useState<Challenge[]>(
    [],
  );
  const [softChallenges, setSoftChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Zustand store
  const {
    getTechnicalChallenges,
    getSoftChallenges,
    loadingTechnical,
    loadingSoft,
    error: storeError,
  } = useChallengesCache();

  const limit = 10;
  const challengeTypeOptions = [
    { value: "all", label: "All" },
    { value: "technical", label: "Code challenges" },
    { value: "soft", label: "Soft Skills" },
  ];

  useEffect(() => {
    loadChallenges();
  }, [challengeType, currentPage]);

  const loadChallenges = async () => {
    setError(null);

    try {
      if (challengeType === "all" || challengeType === "technical") {
        const techData = await getTechnicalChallenges(currentPage, limit);
        setTechnicalChallenges(techData.data);
        if (challengeType === "technical") {
          setTotalPages(techData.totalPages);
        }
      }

      if (challengeType === "all" || challengeType === "soft") {
        const softData = await getSoftChallenges(currentPage, limit);
        setSoftChallenges(softData.data);
        if (challengeType === "soft") {
          setTotalPages(softData.totalPages);
        }
      }

      if (challengeType === "all") {
        const techData = await getTechnicalChallenges(currentPage, limit);
        const softData = await getSoftChallenges(currentPage, limit);
        setTotalPages(Math.max(techData.totalPages, softData.totalPages));
      }

      setLoading(false);
    } catch (err) {
      setError("Error al cargar los challenges. Por favor intenta de nuevo.");
      console.error("Error loading challenges:", err);
      setLoading(false);
    }
  };

  const displayChallenges =
    challengeType === "all"
      ? [...technicalChallenges, ...softChallenges]
      : challengeType === "technical"
        ? technicalChallenges
        : softChallenges;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChallengeTypeChange = (type: ChallengeType) => {
    setChallengeType(type);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with filter */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Practice your skills, track your progress and demonstrate your
            capabilities.
          </p>
        </div>

        {/* Filtro de tipo de challenge - Select reusable */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Tipo
          </span>
          <Select
            value={challengeType}
            onChange={(next) =>
              handleChallengeTypeChange(next as ChallengeType)
            }
            options={challengeTypeOptions}
            className="w-44"
            buttonClassName="px-3 py-2"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* ALL */}
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="Cargando challenges..." />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-red-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <button
                    onClick={loadChallenges}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          ) : displayChallenges.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                There are no challenges available.
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Come back later to see new challenges.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] transition-[grid-template-columns,gap] duration-300 ease-in-out">
                {displayChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    difficulty={challenge.difficulty}
                    durationMinutes={challenge.duration_minutes}
                    challengeType={
                      "challenge_type" in challenge ? "technical" : "soft"
                    }
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                siblingCount={1}
                className="mt-8"
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No challenges in progress
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Challenges you start will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No completed challenges
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Challenges you complete will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
