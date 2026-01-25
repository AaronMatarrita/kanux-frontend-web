"use client";

/**
 * useStartChallenge Hook
 * Starts a technical challenge, creates submission and redirects to execution
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { challengesService } from "@/services/challenges.service";
import { useSubmissionStore } from "@/store/submission.store";

interface UseStartChallengeOptions {
  challengeId: string;
  durationMinutes?: number;
  onSuccess?: (submissionId: string) => void;
  onError?: (error: string) => void;
}

export function useStartChallenge({
  challengeId,
  durationMinutes = 60,
  onSuccess,
  onError,
}: UseStartChallengeOptions) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const { setSubmission } = useSubmissionStore();
  const current = useSubmissionStore((s) => s.submission);
  const isExpired = useSubmissionStore((s) => s.isExpired);

  const startChallenge = async () => {
    if (isStarting) return;
    // If there is an active submission for this challenge and not expired, resume
    if (current && current.challengeId === challengeId && !isExpired()) {
      router.push(
        `/talent/challenges/${challengeId}/execute?submissionId=${current.submissionId}`,
      );
      return;
    }

    setIsStarting(true);

    try {
      const response =
        await challengesService.startTechnicalChallenge(challengeId);

      if (!response.submission_id) {
        throw new Error("No se recibió submission_id");
      }

      // Preserve previous timing if reusing existing submission
      const prev =
        current && current.submissionId === response.submission_id
          ? current
          : null;
      const startedAt = prev?.startedAt ? new Date(prev.startedAt) : new Date();
      const expiresAt = prev?.expiresAt
        ? new Date(prev.expiresAt)
        : new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

      setSubmission({
        submissionId: response.submission_id,
        challengeId,
        status: response.status || "started",
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        durationMinutes,
      });

      onSuccess?.(response.submission_id);
      router.push(
        `/talent/challenges/${challengeId}/execute?submissionId=${response.submission_id}`,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "No se pudo iniciar el challenge";
      toast.error(message);
      onError?.(message);
    } finally {
      setIsStarting(false);
    }
  };

  return { startChallenge, isStarting };
}
