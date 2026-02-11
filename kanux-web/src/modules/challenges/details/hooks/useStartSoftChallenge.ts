"use client";

/**
 * useStartSoftChallenge Hook
 * Starts a soft challenge and redirects to soft execution view
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseStartSoftChallengeOptions {
  challengeId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useStartSoftChallenge({
  challengeId,
  onSuccess,
  onError,
}: UseStartSoftChallengeOptions) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const startChallenge = async () => {
    if (isStarting) return;

    setIsStarting(true);

    try {
      // No API call needed for soft challenges, just redirect
      onSuccess?.();
      router.push(`/talent/challenges/${challengeId}/soft-execute`);
    } catch (error: any) {
      const message =
        error?.message || "No se pudo iniciar el challenge de soft skills";
      onError?.(message);
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startChallenge,
    isStarting,
  };
}
