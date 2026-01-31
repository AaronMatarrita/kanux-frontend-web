"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Filter,
  Search,
  Users,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { challengesService } from "@/services/challenges.service";
import { useAuth } from "@/context/AuthContext";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Select } from "@/components/ui/select";

type Difficulty = "beginner" | "intermediate" | "advanced";
type DifficultyFilter = Difficulty | "all";
type ChallengeType = "soft_skill" | "logical";

export interface CompanyChallenge {
  id: string;
  title: string;
  type: ChallengeType;
  difficulty: Difficulty;
  status: "active" | "inactive";
  created_at: string;
  submissions_count: number;
}

interface CompanyChallengesListProps {
  onViewDetails?: (challengeId: string) => void;
  onCreateChallenge?: () => void;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const DIFFICULTY_OPTIONS = [
  { label: "Todas las dificultades", value: "all" },
  { label: "Principiante", value: "beginner" },
  { label: "Intermedio", value: "intermediate" },
  { label: "Avanzado", value: "advanced" },
] as const;

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  advanced: "bg-purple-100 text-purple-700 border-purple-200",
};

const normalizeDifficulty = (difficulty: string) => {
  const d = difficulty?.toLowerCase();
  if (["beginner", "principiante", "básico", "basico"].includes(d))
    return "beginner";
  if (["intermediate", "intermedio"].includes(d)) return "intermediate";
  if (["advanced", "avanzado"].includes(d)) return "advanced";
  return "beginner";
};

const mapApiChallengeToCompanyChallenge = (ch: any): CompanyChallenge => ({
  id: ch.id,
  title: ch.title,
  type: ch.challenge_type?.toLowerCase().includes("técnico")
    ? "logical"
    : "soft_skill",
  difficulty: normalizeDifficulty(ch.difficulty),
  status: "active",
  created_at: typeof ch.created_at === "string" ? ch.created_at : "",
  submissions_count:
    ch.metrics?.total_submissions ??
    (Array.isArray(ch.challenge_submissions)
      ? ch.challenge_submissions.length
      : 0),
});

const fetchChallengesByCompany = async (
  companyId: string,
  page: number,
  limit: number,
): Promise<{
  challenges: CompanyChallenge[];
  total: number;
  lastPage: number;
}> => {
  const res = await challengesService.getChallengesByCompany(
    companyId,
    page,
    limit,
  );
  return {
    challenges: Array.isArray(res.data)
      ? res.data.map(mapApiChallengeToCompanyChallenge)
      : [],
    total: res.meta?.total ?? 0,
    lastPage: res.meta?.lastPage ?? 1,
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const CompanyChallengesList: React.FC<CompanyChallengesListProps> = ({
  onViewDetails,
  onCreateChallenge,
}) => {
  const router = useRouter();
  const { session } = useAuth();
  const companyId =
    session?.user.userType === "company" ? session.user.profile.id : undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [challenges, setChallenges] = useState<CompanyChallenge[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const PAGE_SIZE = 10;

  const loadChallenges = async (page = 1) => {
    if (!companyId) return;
    try {
      setIsLoading(true);
      setError(null);
      const { challenges, total, lastPage } = await fetchChallengesByCompany(
        companyId,
        page,
        PAGE_SIZE,
      );
      setChallenges(challenges);
      setTotalChallenges(total);
      setTotalPages(lastPage);
    } catch (e) {
      console.error(e);
      setError(
        "Error al cargar los challenges. Por favor, intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadChallenges(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    loadChallenges(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const matchesSearch = challenge.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" || challenge.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [challenges, searchTerm, difficultyFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" message="Cargando challenges..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorAlert message={error} onRetry={loadChallenges} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
          <p className="text-slate-600 mt-1">
            Gestiona y revisa los retos no técnicos que has creado.
          </p>
        </div>
        <button
          onClick={onCreateChallenge}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Crear Challenge
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Select
            value={difficultyFilter}
            onChange={(value) => setDifficultyFilter(value as DifficultyFilter)}
            options={DIFFICULTY_OPTIONS as any}
            placeholder="Dificultad"
            className="w-full md:w-1/3"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-600">
        {totalChallenges} challenge{totalChallenges !== 1 ? "s" : ""} encontrado
        {totalChallenges !== 1 ? "s" : ""}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <EmptyState
          icon={<Filter className="w-12 h-12 text-slate-400 mx-auto" />}
          title="No se encontraron challenges"
          description={
            searchTerm
              ? "Intenta ajustar los filtros de búsqueda"
              : "Aún no has creado ningún challenge."
          }
          action={
            searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDifficultyFilter("all");
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                onClick={onCreateChallenge}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Crear primer challenge
              </button>
            )
          }
        />
      )}

      {/* Grid */}
      {filteredChallenges.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {challenge.title}
                    </h3>
                  </div>

                  {/* Difficulty */}
                  <Badge
                    variant="outline"
                    className={DIFFICULTY_COLORS[challenge.difficulty]}
                  >
                    {DIFFICULTY_LABELS[challenge.difficulty]}
                  </Badge>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        {challenge.submissions_count} submissions
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(challenge.created_at)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end pt-2 gap-2">
                    <button
                      className="cursor-pointer flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-2 transition-all border border-blue-100 rounded px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/company/challenges/${challenge.id}/metrics`;
                      }}
                    >
                      Ver métricas
                    </button>

                    <button
                      className="cursor-pointer flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700 group-hover:gap-2 transition-all border border-yellow-100 rounded px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/company/challenges/${challenge.id}/edit`);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="cursor-pointer flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(challenge.id);
                      }}
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
