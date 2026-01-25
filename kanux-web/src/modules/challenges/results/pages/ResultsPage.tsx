"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  challengesService,
  TechnicalChallengeResultResponse,
} from "@/services/challenges.service";

import {
  ResultsHero,
  ResultsQuickStats,
  ResultsFeedback,
  ResultsInfo,
  ResultsState,
} from "../components";

import { normalizeFeedback } from "@/modules/challenges/results/utils/normalize-feedback";

interface ResultData extends TechnicalChallengeResultResponse {}

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

  useEffect(() => {
    if (initialData) return;

    if (!submissionId) {
      setError("No se proporcionó ID de envío");
      setLoadingState("error");
      return;
    }

    (async () => {
      try {
        setLoadingState("loading");

        const res =
          await challengesService.getTechnicalChallengeResult(submissionId);

        setResultData(res);
        setLoadingState("idle");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo cargar el resultado del reto";

        console.error("Failed to load challenge result", {
          submissionId,
          err,
        });

        toast.error(message);
        setError(message);
        setLoadingState("error");
      }
    })();
  }, [initialData, submissionId]);

  const feedback = useMemo(
    () => normalizeFeedback(resultData?.feedback),
    [resultData?.feedback],
  );

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

  const finalScore = feedback.finalScore ?? Math.round(resultData.score ?? 0);

  const isPassed = finalScore >= 60;

  const copySubmissionId = async () => {
    if (!resultData.submission_id) return;

    await navigator.clipboard.writeText(resultData.submission_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
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
            <ResultsFeedback markdown={feedback.markdown} />
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
                size="lg"
                className="w-full bg-transparent"
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
