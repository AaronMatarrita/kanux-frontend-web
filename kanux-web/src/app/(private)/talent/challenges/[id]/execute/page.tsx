"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ExecutionContainer } from "@/modules/challenges/execution/pages/ExecutionContainer";
import {
  challengesService,
  PublicTechnicalChallengeDetailResponse,
} from "@/services/challenges.service";
import { SubmissionEntry, useSubmissionStore } from "@/store/submission.store";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = params.id as string;
  const submission = useSubmissionStore((state) => state.submission);

  const [state, setState] = useState<{
    data?: PublicTechnicalChallengeDetailResponse;
    loading: boolean;
    error?: string;
  }>({
    loading: true,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res =
          await challengesService.getPublicTechnicalChallengeDetail(
            challengeId,
          );
        setState({ data: res, loading: false });
      } catch (error: any) {
        setState({ loading: false, error: "Failed to load challenge" });
      }
    };
    load();
  }, [challengeId]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const submissionIdParam = searchParams.get("submissionId");
    const hasSubmissionForChallenge =
      submission && submission.challengeId === challengeId;

    if (!hasSubmissionForChallenge) {
      router.replace(`/talent/challenges/${challengeId}/details`);
      return;
    }

    if (submissionIdParam && submissionIdParam !== submission.submissionId) {
      // Keep URL in sync with the active submission
      router.replace(
        `/talent/challenges/${challengeId}/execute?submissionId=${submission.submissionId}`,
      );
    }
  }, [hydrated, submission, challengeId, router, searchParams]);

  const challenge = state.data?.data;
  const assets = state.data?.assets as any;

  const activeSubmission: SubmissionEntry | null = useMemo(() => {
    if (!submission || submission.challengeId !== challengeId) return null;
    return submission;
  }, [submission, challengeId]);

  return (
    <ExecutionContainer
      challenge={challenge}
      assets={assets}
      loading={state.loading}
      submission={activeSubmission}
    />
  );
}
