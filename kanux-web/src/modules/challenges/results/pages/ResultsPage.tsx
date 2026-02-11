"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BackNavigation } from "@/modules/challenges/components/BackNavigation";
import { FeatureGuard } from "@/guards/featureGuard";
import {
  challengesService,
  ChallengeFeedbackWrapper,
  TechnicalChallengeResultResponse,
} from "@/services/challenges.service";

import {
  ResultsHero,
  ResultsQuickStats,
  ResultsFeedback,
  ResultsInfo,
  ResultsState,
} from "../components";

import {
  normalizeFeedback,
  NormalizedFeedback,
} from "@/modules/challenges/results/utils/normalize-feedback";

type LocalStoredResult = {
  submission_id: string;
  status?: string;
  score?: number;
  total_questions?: number;
  correct_answers?: number;
  feedback?: unknown;
  submitted_at?: string;
  challenge?: {
    id?: string;
    title?: string;
    difficulty?: string;
  };
};

type ResultData = TechnicalChallengeResultResponse | LocalStoredResult;

interface ResultsPageProps {
  submissionId?: string;
  initialData?: ResultData;
}

type LoadingState = "idle" | "loading" | "error" | "empty";

export function ResultsPage({
  submissionId: propSubmissionId,
  initialData,
}: ResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resultData, setResultData] = useState<ResultData | null>(
    initialData ?? null,
  );
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submissionId = propSubmissionId ?? searchParams.get("submissionId");

  const hasFeedbackContent = useCallback((value: NormalizedFeedback) => {
    return Boolean(
      (value.strengths && value.strengths.length > 0) ||
      (value.areasForImprovement && value.areasForImprovement.length > 0) ||
      (value.nextSteps && value.nextSteps.length > 0) ||
      value.answersOverview ||
      (value.perQuestionFeedback && value.perQuestionFeedback.length > 0) ||
      (value.scoreBreakdown && Object.keys(value.scoreBreakdown).length > 0) ||
      (value.codeQuality && Object.keys(value.codeQuality).length > 0) ||
      value.tests ||
      (value.tags && value.tags.length > 0),
    );
  }, []);

  const applyLatestFeedback = useCallback(
    (feedback: ChallengeFeedbackWrapper | null) => {
      if (!submissionId || !feedback) return;
      const normalized = normalizeFeedback(feedback);
      if (!hasFeedbackContent(normalized)) return;

      setResultData((prev) =>
        prev
          ? { ...prev, feedback }
          : { submission_id: submissionId, feedback },
      );

      if (typeof window !== "undefined") {
        const localKey = `challenge:result:${submissionId}`;
        const localResultRaw = localStorage.getItem(localKey);
        if (localResultRaw) {
          try {
            const parsed = JSON.parse(localResultRaw) as LocalStoredResult;
            localStorage.setItem(
              localKey,
              JSON.stringify({ ...parsed, feedback }),
            );
          } catch {
            // ignore cache update errors
          }
        }
      }
    },
    [hasFeedbackContent, submissionId],
  );

  useEffect(() => {
    if (initialData) return;

    if (!submissionId) {
      setError("No se proporcionó ID de envío");
      setLoadingState("error");
      return;
    }

    (async () => {
      setLoadingState("loading");

      const localKey = `challenge:result:${submissionId}`;
      const localResultRaw =
        typeof window !== "undefined" ? localStorage.getItem(localKey) : null;

      if (localResultRaw) {
        try {
          const parsed: LocalStoredResult = JSON.parse(localResultRaw);
          setResultData(parsed);
          setLoadingState("idle");
          const latest = await challengesService
            .getLatestChallengeFeedback(submissionId)
            .catch(() => null);
          applyLatestFeedback(latest);
          return;
        } catch (err) {
          console.warn("No se pudo leer el resultado local, usando la API", {
            err,
          });
        }
      }

      try {
        const [resultResponse, feedbackResponse] = await Promise.allSettled([
          challengesService.getTechnicalChallengeResult(submissionId),
          challengesService.getLatestChallengeFeedback(submissionId),
        ]);

        if (resultResponse.status === "fulfilled") {
          setResultData(resultResponse.value);
        }

        if (feedbackResponse.status === "fulfilled") {
          applyLatestFeedback(feedbackResponse.value);
        }

        if (
          resultResponse.status === "rejected" &&
          feedbackResponse.status === "rejected"
        ) {
          throw resultResponse.reason;
        }
        setLoadingState("idle");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo cargar el resultado del reto";

        console.error("No se pudo cargar el resultado del desafío", {
          submissionId,
          err,
        });

        toast.error(message);
        setError(message);
        setLoadingState("error");
      }
    })();
  }, [applyLatestFeedback, initialData, submissionId]);

  const feedback = useMemo(
    () => normalizeFeedback(resultData?.feedback),
    [resultData?.feedback],
  );

  const feedbackHasContent = useMemo(
    () => hasFeedbackContent(feedback),
    [feedback, hasFeedbackContent],
  );

  useEffect(() => {
    if (!submissionId || feedbackHasContent || loadingState === "loading") {
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;
    const intervalMs = 4000;

    const intervalId = setInterval(async () => {
      attempts += 1;
      try {
        const latest =
          await challengesService.getLatestChallengeFeedback(submissionId);
        applyLatestFeedback(latest);
      } catch {
        // ignore polling errors
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [applyLatestFeedback, feedbackHasContent, loadingState, submissionId]);

  if (loadingState === "loading" || loadingState === "error") {
    return (
      <ResultsState
        state={loadingState === "error" ? "error" : "loading"}
        error={error || undefined}
        onBack={() => router.push("/talent/challenges")}
      />
    );
  }

  if (!resultData) {
    return (
      <ResultsState
        state="empty"
        onBack={() => router.push("/talent/challenges")}
      />
    );
  }

  const finalScore =
    feedback.finalScore ?? Math.round((resultData as any)?.score ?? 0);

  const isPassed = finalScore >= 60;

  const copySubmissionId = async () => {
    if (!resultData.submission_id) return;

    await navigator.clipboard.writeText(resultData.submission_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <BackNavigation
          label="Volver a desafíos"
          onClick={() => router.push("/talent/challenges")}
        />
      </div>
      <ResultsHero
        isPassed={isPassed}
        scorePercentage={finalScore}
        challengeTitle={resultData.challenge?.title}
      />

      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16 relative z-10">
        <ResultsQuickStats
          scorePercentage={finalScore}
          isPassed={isPassed}
          difficulty={resultData.challenge?.difficulty}
          submittedAt={resultData.submitted_at}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FeatureGuard
              feature="can_access_detailed_reports"
              infoText="El feedback generado con IA"
            >
              <ResultsFeedback feedback={feedback} />
            </FeatureGuard>
          </div>

          <div className="space-y-6">
            <ResultsInfo
              challengeTitle={resultData.challenge?.title}
              difficulty={resultData.challenge?.difficulty}
              submissionId={resultData.submission_id}
              submittedAt={resultData.submitted_at}
              copied={copied}
              onCopy={copySubmissionId}
            />

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer justify-center gap-2"
                onClick={() => router.push("/talent/challenges")}
              >
                Ver Más Retos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
