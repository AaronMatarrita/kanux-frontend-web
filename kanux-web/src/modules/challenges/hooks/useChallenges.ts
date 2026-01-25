"use client";

import { useEffect, useState, useCallback } from "react";
import { useChallengesCache } from "@/modules/challenges/store/challengesCache.store";
import { challengesService } from "@/services/challenges.service";
import { CompletedChallenge } from "@/modules/challenges/components/CompletedTab";

type ChallengeType = "all" | "technical" | "soft";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  challenge_type?: string;
}

const LIMIT = 10;

// Normalize challenge type strings that come from API (e.g. "No Técnico", "Technical").
const mapChallengeType = (rawType?: string): ChallengeType | "unknown" => {
  if (!rawType) return "unknown";
  const normalized = rawType
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("tech")) return "technical";
  if (normalized.includes("soft")) return "soft";
  if (normalized.includes("no tec") || normalized.includes("non tech"))
    return "soft";

  return "unknown";
};

export function useChallenges() {
  const [challengeType, setChallengeType] = useState<ChallengeType>("all");
  const [technicalChallenges, setTechnicalChallenges] = useState<Challenge[]>(
    [],
  );
  const [softChallenges, setSoftChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallenge[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCompleted, setErrorCompleted] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { getTechnicalChallenges, getSoftChallenges } = useChallengesCache();

  const displayChallenges =
    challengeType === "all"
      ? [...technicalChallenges, ...softChallenges]
      : challengeType === "technical"
        ? technicalChallenges
        : softChallenges;

  const filteredCompletedChallenges =
    challengeType === "all"
      ? completedChallenges
      : completedChallenges.filter(
          (item) => mapChallengeType(item.challenge.type) === challengeType,
        );

  const loadChallenges = useCallback(async () => {
    setError(null);
    try {
      if (challengeType === "all" || challengeType === "technical") {
        const techData = await getTechnicalChallenges(currentPage, LIMIT);
        setTechnicalChallenges(techData.data);
        if (challengeType === "technical") {
          setTotalPages(techData.totalPages);
        }
      }

      if (challengeType === "all" || challengeType === "soft") {
        const softData = await getSoftChallenges(currentPage, LIMIT);
        setSoftChallenges(softData.data);
        if (challengeType === "soft") {
          setTotalPages(softData.totalPages);
        }
      }

      if (challengeType === "all") {
        const techData = await getTechnicalChallenges(currentPage, LIMIT);
        const softData = await getSoftChallenges(currentPage, LIMIT);
        setTotalPages(Math.max(techData.totalPages, softData.totalPages));
      }

      setLoading(false);
    } catch (err) {
      setError("Error al cargar los challenges. Por favor intenta de nuevo.");
      console.error("Error loading challenges:", err);
      setLoading(false);
    }
  }, [challengeType, currentPage, getTechnicalChallenges, getSoftChallenges]);

  const loadCompletedChallenges = useCallback(async () => {
    setLoadingCompleted(true);
    setErrorCompleted(null);

    try {
      const history = await challengesService.getMyChallengeHistory();
      setCompletedChallenges(history || []);
    } catch (err) {
      setErrorCompleted(
        "Error al cargar los desafíos completados. Por favor intenta de nuevo.",
      );
      console.error("Error loading completed challenges:", err);
    } finally {
      setLoadingCompleted(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
    loadCompletedChallenges();
  }, [loadChallenges, loadCompletedChallenges]);

  return {
    // State
    challengeType,
    displayChallenges,
    completedChallenges: filteredCompletedChallenges,
    loading,
    loadingCompleted,
    error,
    errorCompleted,
    currentPage,
    totalPages,
    // Actions
    setChallengeType,
    setCurrentPage,
    loadChallenges,
    loadCompletedChallenges,
  };
}
