"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Pencil, BarChart } from "lucide-react";

import { challengesService } from "@/services/challenges.service";
import { useAuth } from "@/context/AuthContext";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Select } from "@/components/ui/select";
import { ActionGuard } from "@/guards/actionGuard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

const DIFFICULTY_OPTIONS = [
  { label: "Todas las dificultades", value: "all" },
  { label: "Principiante", value: "beginner" },
  { label: "Intermedio", value: "intermediate" },
  { label: "Avanzado", value: "advanced" },
];

const normalizeDifficulty = (difficulty: string): Difficulty => {
  const d = difficulty?.toLowerCase();
  if (["beginner", "principiante", "básico", "basico"].includes(d))
    return "beginner";
  if (["intermediate", "intermedio"].includes(d)) return "intermediate";
  if (["advanced", "avanzado"].includes(d)) return "advanced";
  return "beginner";
};

const mapApiChallenge = (ch: any): CompanyChallenge => ({
  id: ch.id,
  title: ch.title,
  type: ch.challenge_type?.toLowerCase().includes("técnico")
    ? "logical"
    : "soft_skill",
  difficulty: normalizeDifficulty(ch.difficulty),
  status: "active",
  created_at: ch.created_at ?? "",
  submissions_count:
    ch.metrics?.total_submissions ??
    (Array.isArray(ch.challenge_submissions)
      ? ch.challenge_submissions.length
      : 0),
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const CompanyChallengesList: React.FC<CompanyChallengesListProps> = ({
  onViewDetails,
  onCreateChallenge,
}) => {
  const router = useRouter();
  const { session } = useAuth();

  const companyId =
    session?.user.userType === "company" ? session.user.profile.id : undefined;

  const PAGE_SIZE = 10;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<CompanyChallenge[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadChallenges = useCallback(
    async (pageNumber = 1) => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        setError(null);

        const res = await challengesService.getChallengesByCompany(
          companyId,
          pageNumber,
          PAGE_SIZE,
        );

        const data = Array.isArray(res.data)
          ? res.data.map(mapApiChallenge)
          : [];

        setChallenges(data);
        setTotalItems(data.length ? (res.meta?.total ?? data.length) : 0);
        setTotalPages(res.meta?.lastPage ?? 1);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los desafíos.");
      } finally {
        setIsLoading(false);
      }
    },
    [companyId],
  );

  useEffect(() => {
    setPage(1);
    loadChallenges(1);
  }, [companyId, loadChallenges]);

  useEffect(() => {
    loadChallenges(page);
  }, [page, loadChallenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((ch) => {
      const matchesSearch = searchTerm
        ? ch.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesDifficulty =
        difficultyFilter === "all" || ch.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [challenges, searchTerm, difficultyFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-60 animate-pulse rounded bg-muted" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-6 py-3" />
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={() => loadChallenges(page)} />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Desafíos</h1>
            <p className="text-slate-600">
              Gestiona los desafíos creados por tu empresa.
            </p>
          </div>

          <ActionGuard
            feature="can_create_custom_challenges"
            actionName="Crear desafios personalizados"
          >
            <button
              onClick={onCreateChallenge}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus size={18} />
              Crear desafío
            </button>
          </ActionGuard>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(searchInput || undefined);
                  setPage(1);
                }
              }}
              placeholder="Buscar desafíos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <Select
            value={difficultyFilter}
            onChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
            options={DIFFICULTY_OPTIONS}
          />
        </div>

        {/* Table */}
        {filteredChallenges.length === 0 ? (
          <EmptyState
            title="No se encontraron desafíos"
            description="Intenta ajustar los filtros o crea uno nuevo."
            action={
              <ActionGuard
                feature="can_create_custom_challenges"
                actionName="Crear desafios personalizados"
              >
                <button
                  onClick={onCreateChallenge}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Crear desafío
                </button>
              </ActionGuard>
            }
          />
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">Desafío</th>
                  <th className="px-6 py-3 text-left">Dificultad</th>
                  <th className="px-6 py-3 text-left">Postulaciones</th>
                  <th className="px-6 py-3 text-left">Creado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredChallenges.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{ch.title}</td>

                    <td className="px-6 py-4">
                      <Badge className={DIFFICULTY_COLORS[ch.difficulty]}>
                        {DIFFICULTY_LABELS[ch.difficulty]}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">{ch.submissions_count}</td>

                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(ch.created_at)}
                    </td>

                    <td className="px-6 py-4 flex gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="cursor-pointer"
                            onClick={() => onViewDetails?.(ch.id)}
                          >
                            <Eye size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalles</TooltipContent>
                      </Tooltip>

                      <ActionGuard
                        feature="can_access_reports"
                        actionName="Ver reportes de desempeno"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/company/challenges/${ch.id}/metrics`,
                                )
                              }
                            >
                              <BarChart size={18} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Ver métricas</TooltipContent>
                        </Tooltip>
                      </ActionGuard>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(`/company/challenges/${ch.id}/edit`)
                            }
                          >
                            <Pencil size={18} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Editar challenge</TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">
            Mostrando {filteredChallenges.length} de {totalItems} desafíos
          </span>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CompanyChallengesList;
