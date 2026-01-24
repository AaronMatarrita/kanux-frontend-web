import { create } from "zustand";
import { challengesService } from "@/services/challenges.service";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  challenge_type?: string;
}

interface CacheEntry {
  data: Challenge[];
  totalPages: number;
  timestamp: number;
}

interface ChallengesStore {
  // Cache data
  technicalCache: Map<number, CacheEntry>;
  softCache: Map<number, CacheEntry>;
  cacheExpiry: number; // milliseconds

  // Loading states
  loadingTechnical: boolean;
  loadingSoft: boolean;
  error: string | null;

  // Actions
  getTechnicalChallenges: (
    page: number,
    limit: number,
  ) => Promise<{ data: Challenge[]; totalPages: number }>;
  getSoftChallenges: (
    page: number,
    limit: number,
  ) => Promise<{ data: Challenge[]; totalPages: number }>;
  clearCache: () => void;
  setCacheExpiry: (ms: number) => void;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes default

export const useChallengesCache = create<ChallengesStore>((set, get) => ({
  technicalCache: new Map(),
  softCache: new Map(),
  cacheExpiry: CACHE_EXPIRY,
  loadingTechnical: false,
  loadingSoft: false,
  error: null,

  getTechnicalChallenges: async (page: number, limit: number) => {
    const state = get();
    const cached = state.technicalCache.get(page);

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
      set({ loadingTechnical: false });
      return {
        data: cached.data,
        totalPages: cached.totalPages,
      };
    }

    set({ loadingTechnical: true, error: null });

    try {
      const response = await challengesService.listPublicTechnicalChallenges(
        page,
        limit,
      );

      const mappedData = response.data.map((ch) => ({
        id: ch.id,
        title: ch.title,
        description: ch.description || "",
        difficulty: ch.difficulty || "Básico",
        duration_minutes:
          (ch as { duration_minutes?: number }).duration_minutes || 30,
        challenge_type: "Técnico",
      }));

      const newCache = new Map(state.technicalCache);
      newCache.set(page, {
        data: mappedData,
        totalPages: response.meta.total_pages,
        timestamp: Date.now(),
      });

      set({
        technicalCache: newCache,
        loadingTechnical: false,
      });

      return {
        data: mappedData,
        totalPages: response.meta.total_pages,
      };
    } catch (err) {
      set({
        error: "Error al cargar los challenges técnicos",
        loadingTechnical: false,
      });
      console.error("Error loading technical challenges:", err);
      throw err;
    }
  },

  getSoftChallenges: async (page: number, limit: number) => {
    const state = get();
    const cached = state.softCache.get(page);

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
      set({ loadingSoft: false });
      return {
        data: cached.data,
        totalPages: cached.totalPages,
      };
    }

    set({ loadingSoft: true, error: null });

    try {
      const response = await challengesService.listSoftChallenges(page, limit);

      const mappedData = response.data.map((ch: any) => ({
        id: ch.id,
        title: ch.title,
        description: ch.description || "",
        difficulty: ch.difficulty || "Básico",
        duration_minutes: ch.duration_minutes || 30,
      }));

      const newCache = new Map(state.softCache);
      newCache.set(page, {
        data: mappedData,
        totalPages: response.meta.lastPage,
        timestamp: Date.now(),
      });

      set({
        softCache: newCache,
        loadingSoft: false,
      });

      return {
        data: mappedData,
        totalPages: response.meta.lastPage,
      };
    } catch (err) {
      set({
        error: "Error al cargar los challenges soft skills",
        loadingSoft: false,
      });
      console.error("Error loading soft challenges:", err);
      throw err;
    }
  },

  clearCache: () => {
    set({
      technicalCache: new Map(),
      softCache: new Map(),
      error: null,
    });
  },

  setCacheExpiry: (ms: number) => {
    set({ cacheExpiry: ms });
  },
}));
