"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import type { CandidateListItem } from "@/services/candidates.service";
import { messagesService } from "@/services/messages.service";
import {
  candidatesService,
  LearningBackground,
} from "@/services/candidates.service";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { CandidateProfileDetails } from "@/components/candidates/CandidateProfileDetails";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { ActionGuard } from "@/guards/actionGuard";
import { useSubscription } from "@/context/SubscriptionContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ---------------- COMPONENT ---------------- */

export const CandidatesList: React.FC = ({}) => {
  const { session } = useAuth();
  const router = useRouter();
  const { planData, userType } = useSubscription();
  const features =
    userType === "company"
      ? planData?.company_plans?.company_plan_features?.[0]
      : null;
  const canUseAdvancedFilters = !!features?.can_use_advanced_filters;

  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);

  const [creatingConversation, setCreatingConversation] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [learningBackgrounds, setLearningBackgrounds] = useState<
    LearningBackground[]
  >([]);

  const [skillFilter, setSkillFilter] = useState<string>(
    "Todas las habilidades",
  );
  const [backgroundFilter, setBackgroundFilter] = useState<string | undefined>(
    undefined,
  );

  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateListItem | null>(null);

  const [error, setError] = useState<string | null>(null);

  const compId =
    session?.user.userType === "company" ? session.user.profile.id : "";

  useEffect(() => {
    const loadSkills = async () => {
      try {
        if (!session?.token) {
          setError("No hay sesión activa");
          return;
        }

        const skills = await candidatesService.getSkillFilters();
        setSkillsOptions(skills);
      } catch (error) {
        console.error("Failed to load skill filters", error);
        setSkillsOptions([]);
      }
    };

    loadSkills();
  }, [session?.token]);

  const loadCandidates = useCallback(async () => {
    if (!session?.token) {
      setError("No hay sesión activa");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await candidatesService.getCandidatesFiltered(
        session.token,
        {
          searchText: searchTerm || undefined,
          skill:
            skillFilter !== "Todas las habilidades" ? skillFilter : undefined,
          learningBackgroundId: backgroundFilter || undefined,
        },
        page,
        pageSize,
      );

      setCandidates(result.candidates);
      setTotalItems(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      console.error("Failed to load candidates", err);
      setError("No se pudieron cargar los candidatos. Intenta nuevamente.");
      setCandidates([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [
    session?.token,
    page,
    pageSize,
    searchTerm,
    skillFilter,
    backgroundFilter,
  ]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  useEffect(() => {
    const loadLearningBackgrounds = async () => {
      try {
        if (!session?.token) {
          return;
        }

        const data = await candidatesService.getLearningBackgrounds(
          session.token,
        );
        setLearningBackgrounds(data);
      } catch (error) {
        console.error("Failed to load learning backgrounds", error);
        setLearningBackgrounds([]);
      }
    };

    loadLearningBackgrounds();
  }, [session?.token]);

  const handleViewProfile = useCallback((candidate: CandidateListItem) => {
    setSelectedCandidate(candidate);
  }, []);

  const handleCreateConversation = async (talentId: string) => {
    setCreatingConversation(true);

    try {
      await messagesService.createConversation({
        talent_profile_id: talentId,
      });

      router.push("/company/messages");
    } catch (error) {
      console.error("Error creating conversation", error);
    } finally {
      setCreatingConversation(false);
    }
  };

  const skillSelectOptions = useMemo(() => {
    const uniqueSkills = Array.from(new Set(skillsOptions));

    return [
      { label: "Todas las habilidades", value: "Todas las habilidades" },
      ...uniqueSkills.map((s) => ({
        label: s,
        value: s,
      })),
    ];
  }, [skillsOptions]);

  const backgroundSelectOptions = useMemo(
    () => [
      { label: "Todas", value: "" },
      ...learningBackgrounds.map((b) => ({
        label: b.name,
        value: b.id,
      })),
    ],
    [learningBackgrounds],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Cargando candidatos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={loadCandidates}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {creatingConversation && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-slate-700 font-medium">
              Creando conversación…
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidatos</h1>
          <p className="text-slate-600">
            Explora y evalúa el talento disponible.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-4 space-y-4">
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
              placeholder="Buscar candidatos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ActionGuard
              feature="can_use_advanced_filters"
              actionName="Usar filtros avanzados"
            >
              <div>
                <Select
                  value={skillFilter}
                  onChange={setSkillFilter}
                  options={skillSelectOptions}
                  buttonClassName={
                    canUseAdvancedFilters ? "" : "opacity-60 cursor-not-allowed"
                  }
                />
              </div>
            </ActionGuard>

            <ActionGuard
              feature="can_use_advanced_filters"
              actionName="Usar filtros avanzados"
            >
              <div>
                <Select
                  value={backgroundFilter ?? ""}
                  onChange={(value) => setBackgroundFilter(value || undefined)}
                  options={backgroundSelectOptions}
                  placeholder="Educación"
                  buttonClassName={
                    canUseAdvancedFilters ? "" : "opacity-60 cursor-not-allowed"
                  }
                />
              </div>
            </ActionGuard>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Candidato</th>
                <th className="px-6 py-3 text-left">Habilidades</th>
                <th className="px-6 py-3 text-left">Educación</th>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {candidates.length ? (
                candidates.map((c) => (
                  <tr key={c.talent_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">
                      {c.first_name} {c.last_name}
                    </td>

                    <td className="px-6 py-4 flex gap-2 flex-wrap">
                      {c.skills.map((skill) => (
                        <span
                          key={`${c.talent_id}-${skill.id}`}
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{c.education}</td>
                    <td className="px-6 py-4">{c.title}</td>

                    <td className="px-6 py-4 flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="cursor-pointer"
                              onClick={() => handleViewProfile(c)}
                            >
                              <Eye size={18} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Ver perfil del candidato
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <ActionGuard
                        feature="can_contact_talent"
                        actionName="Contactar talento"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCreateConversation(c.talent_id)
                                }
                                disabled={creatingConversation}
                                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <MessageSquare size={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Contactar candidato</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </ActionGuard>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No se encontraron candidatos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Mostrando {candidates.length} de {totalItems} candidatos
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              if (newPage !== page) {
                setPage(newPage);
              }
            }}
          />
        </div>

        {selectedCandidate && (
          <CandidateProfileDetails
            compId={compId}
            talentProfileId={selectedCandidate.talent_id}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </div>
    </>
  );
};

export default CandidatesList;
