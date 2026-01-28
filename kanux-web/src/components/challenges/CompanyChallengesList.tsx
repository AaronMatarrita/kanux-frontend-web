"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Select } from "@/components/ui/select";

// Types
export interface CompanyChallenge {
  id: string;
  title: string;
  type: "soft_skill" | "logical";
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "active" | "inactive";
  created_at: string;
  submissions_count?: number;
  skills?: string[];
}

interface CompanyChallengesListProps {
  onViewDetails?: (challengeId: string) => void;
  onCreateChallenge?: () => void;
}

// Mock data for visual layout
const MOCK_CHALLENGES: CompanyChallenge[] = [
  {
    id: "1",
    title: "Full-Stack API Challenge",
    type: "logical",
    difficulty: "advanced",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    submissions_count: 34,
    skills: ["Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    id: "2",
    title: "React Component Design",
    type: "logical",
    difficulty: "intermediate",
    status: "active",
    created_at: "2024-01-20T14:30:00Z",
    submissions_count: 52,
    skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: "3",
    title: "Database Optimization",
    type: "logical",
    difficulty: "advanced",
    status: "inactive",
    created_at: "2024-01-10T09:15:00Z",
    submissions_count: 28,
    skills: ["SQL", "PostgreSQL", "Indexing"],
  },
  {
    id: "4",
    title: "Frontend Performance",
    type: "logical",
    difficulty: "intermediate",
    status: "active",
    created_at: "2024-01-25T16:45:00Z",
    submissions_count: 67,
    skills: ["React", "Webpack", "Performance"],
  },
  {
    id: "5",
    title: "Team Communication Assessment",
    type: "soft_skill",
    difficulty: "intermediate",
    status: "active",
    created_at: "2024-01-18T11:20:00Z",
    submissions_count: 45,
    skills: ["Communication", "Leadership"],
  },
  {
    id: "6",
    title: "Problem Solving Evaluation",
    type: "soft_skill",
    difficulty: "beginner",
    status: "active",
    created_at: "2024-01-22T13:00:00Z",
    submissions_count: 89,
    skills: ["Critical Thinking", "Analysis"],
  },
];

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const TYPE_LABELS: Record<string, string> = {
  soft_skill: "Soft Skill",
  logical: "Lógico",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const CompanyChallengesList: React.FC<CompanyChallengesListProps> = ({
  onViewDetails,
  onCreateChallenge,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [challenges, setChallenges] = useState<CompanyChallenge[]>([]);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setChallenges(MOCK_CHALLENGES);
      } catch (err) {
        setError(
          "Error al cargar los challenges. Por favor, intenta nuevamente.",
        );
        console.error("Error loading challenges:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const difficultyOptions = [
    { label: "Todas las dificultades", value: "all" },
    { label: "Principiante", value: "beginner" },
    { label: "Intermedio", value: "intermediate" },
    { label: "Avanzado", value: "advanced" },
  ];

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;
    if (searchTerm) {
      filtered = filtered.filter((challenge) =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((challenge) => challenge.type === typeFilter);
    }
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.difficulty === difficultyFilter,
      );
    }
    return filtered;
  }, [challenges, searchTerm, typeFilter, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setChallenges(MOCK_CHALLENGES);
      setIsLoading(false);
    }, 1000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" message="Cargando challenges..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <ErrorAlert message={error} onRetry={handleRetry} />
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

      {/* Filtros estilo Candidates */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              options={difficultyOptions}
              placeholder="Dificultad"
              className="w-full md:w-1/3"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {filteredChallenges.length} challenge
          {filteredChallenges.length !== 1 ? "s" : ""} encontrado
          {filteredChallenges.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filteredChallenges.length === 0 && !isLoading && !error && (
        <EmptyState
          icon={<Filter className="w-12 h-12 text-slate-400 mx-auto" />}
          title="No se encontraron challenges"
          description={
            searchTerm || typeFilter !== "all" || statusFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Aún no has creado ningún challenge. Crea tu primer reto para comenzar."
          }
          action={
            searchTerm || typeFilter !== "all" || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                onClick={onCreateChallenge}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Crear primer challenge
              </button>
            )
          }
        />
      )}

      {/* Challenges Grid */}
      {filteredChallenges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
              onClick={() => onViewDetails?.(challenge.id)}
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {challenge.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={getDifficultyColor(challenge.difficulty)}
                      variant="outline"
                    >
                      {DIFFICULTY_LABELS[challenge.difficulty]}
                    </Badge>
                    <Badge
                      className={getStatusColor(challenge.status)}
                      variant="outline"
                    >
                      {STATUS_LABELS[challenge.status]}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {challenge.submissions_count || 0} submissions
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(challenge.created_at)}
                  </div>
                  <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all">
                    Ver Detalles
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
