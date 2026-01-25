import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SubmissionStatus = "started" | "submitted";

export interface SubmissionEntry {
  submissionId: string;
  challengeId: string;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  status: SubmissionStatus;
}

interface SubmissionStore {
  submission: SubmissionEntry | null;
  setSubmission: (entry: SubmissionEntry) => void;
  clearSubmission: () => void;
  remainingSeconds: () => number;
  isExpired: () => boolean;
}

const computeRemainingSeconds = (expiresAt?: string | null) => {
  if (!expiresAt) return 0;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
};

export const useSubmissionStore = create<SubmissionStore>()(
  persist(
    (set, get) => ({
      submission: null,
      setSubmission: (entry) => set({ submission: entry }),
      clearSubmission: () => set({ submission: null }),
      remainingSeconds: () =>
        computeRemainingSeconds(get().submission?.expiresAt),
      isExpired: () =>
        computeRemainingSeconds(get().submission?.expiresAt) === 0,
    }),
    {
      name: "submission-store",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        // Minimal in-memory fallback to avoid SSR access errors
        const memoryStorage: Storage = {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
          clear: () => undefined,
          key: () => null,
          length: 0,
        };
        return memoryStorage;
      }),
      version: 1,
    },
  ),
);
