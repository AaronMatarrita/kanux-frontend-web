import { useCallback } from "react";
import { useChallengesCache } from "../store/challengesCache.store";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  challenge_type?: string;
}

export function useChallengesList() {
  const store = useChallengesCache();

  const loadChallenges = useCallback(
    async (type: "all" | "technical" | "soft", page: number, limit: number) => {
      const results = {
        technical: [] as Challenge[],
        soft: [] as Challenge[],
        totalPages: 1,
        error: null as string | null,
      };

      try {
        if (type === "all" || type === "technical") {
          const tech = await store.getTechnicalChallenges(page, limit);
          results.technical = tech.data;
          if (type === "technical") {
            results.totalPages = tech.totalPages;
          }
        }

        if (type === "all" || type === "soft") {
          const soft = await store.getSoftChallenges(page, limit);
          results.soft = soft.data;
          if (type === "soft") {
            results.totalPages = soft.totalPages;
          }
        }

        if (type === "all") {
          const tech = await store.getTechnicalChallenges(page, limit);
          const soft = await store.getSoftChallenges(page, limit);
          results.totalPages = Math.max(tech.totalPages, soft.totalPages);
        }

        return results;
      } catch (err) {
        results.error =
          "Error al cargar los challenges. Por favor intenta de nuevo.";
        console.error("Error loading challenges:", err);
        return results;
      }
    },
    [store],
  );

  const clearCache = useCallback(() => {
    store.clearCache();
  }, [store]);

  const setExpiry = useCallback(
    (ms: number) => {
      store.setCacheExpiry(ms);
    },
    [store],
  );

  return {
    loadChallenges,
    clearCache,
    setExpiry,
    isLoading: store.loadingTechnical || store.loadingSoft,
    error: store.error,
  };
}
