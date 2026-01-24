"use client";

import { useEffect, useState } from "react";
import { AlertCircle, FileText, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { challengesService } from "@/services/challenges.service";

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
  const limit = 10;
  const challengeTypeOptions = [
    { value: "all", label: "Todos" },
    { value: "technical", label: "Code challenges" },
    { value: "soft", label: "Soft Skills" },
  ];

  useEffect(() => {
    loadChallenges();
  }, [challengeType, currentPage]);

  const loadChallenges = async () => {
    setLoading(true);
    setError(null);

    try {
      if (challengeType === "all" || challengeType === "technical") {
        const techResponse =
          await challengesService.listPublicTechnicalChallenges(
            currentPage,
            limit,
          );
        // PublicTechnicalChallenge to Challenge
        const mappedTech = techResponse.data.map((ch) => ({
          id: ch.id,
          title: ch.title,
          description: ch.description || "",
          difficulty: ch.difficulty || "Básico",
          duration_minutes:
            (ch as { duration_minutes?: number }).duration_minutes || 30,
          challenge_type: "Técnico",
        }));
        setTechnicalChallenges(mappedTech);
        if (challengeType === "technical") {
          setTotalPages(techResponse.meta.total_pages);
        }
      }

      if (challengeType === "all" || challengeType === "soft") {
        const softResponse = await challengesService.listSoftChallenges(
          currentPage,
          limit,
        );
        //soft challenge to Challenge
        const mappedSoft = softResponse.data.map((ch: any) => ({
          id: ch.id,
          title: ch.title,
          description: ch.description || "",
          difficulty: ch.difficulty || "Básico",
          duration_minutes: ch.duration_minutes || 30,
        }));
        setSoftChallenges(mappedSoft);
        if (challengeType === "soft") {
          setTotalPages(softResponse.meta.lastPage);
        }
      }

      if (challengeType === "all") {
        const techResponse =
          await challengesService.listPublicTechnicalChallenges(
            currentPage,
            limit,
          );
        const softResponse = await challengesService.listSoftChallenges(
          currentPage,
          limit,
        );
        setTotalPages(
          Math.max(techResponse.meta.total_pages, softResponse.meta.lastPage),
        );
      }
    } catch (err) {
      setError("Error al cargar los challenges. Por favor intenta de nuevo.");
      console.error("Error loading challenges:", err);
    } finally {
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
            capabilities through real-world challenges.
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
      </Tabs>
    </div>
  );
}
