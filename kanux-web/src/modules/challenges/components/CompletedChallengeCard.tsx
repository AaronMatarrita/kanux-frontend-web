"use client";

import { CheckCircle, Trophy, Medal, AlertTriangle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { CompletedChallenge } from "./CompletedTab";
import { difficultyConfig } from "@/modules/challenges/details/config/difficulty.config";
import { Button } from "@/components/ui/button";

interface CompletedChallengeCardProps {
  submission: CompletedChallenge;
}

function getScoreConfig(score: number) {
  if (score >= 80) {
    return {
      bg: "bg-emerald-100 dark:bg-emerald-500/15",
      ring: "ring-emerald-200 dark:ring-emerald-500/30",
      iconColor: "text-emerald-600 dark:text-emerald-300",
      text: "text-emerald-700 dark:text-emerald-200",
      Icon: Trophy,
      label: "Excelente desempeño",
    };
  }

  if (score >= 60) {
    return {
      bg: "bg-amber-100 dark:bg-amber-500/15",
      ring: "ring-amber-200 dark:ring-amber-500/30",
      iconColor: "text-amber-600 dark:text-amber-300",
      text: "text-amber-700 dark:text-amber-200",
      Icon: Medal,
      label: "Desempeño aceptable",
    };
  }

  return {
    bg: "bg-rose-100 dark:bg-rose-500/15",
    ring: "ring-rose-200 dark:ring-rose-500/30",
    iconColor: "text-rose-600 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-200",
    Icon: AlertTriangle,
    label: "Necesita mejorar",
  };
}

export function CompletedChallengeCard({
  submission,
}: CompletedChallengeCardProps) {
  const router = useRouter();
  const difficulty = submission.challenge.difficulty;
  const config = difficultyConfig[difficulty] || difficultyConfig["Básico"];
  const scoreConfig = getScoreConfig(submission.score);
  const ScoreIcon = scoreConfig.Icon;

  const handleViewDetails = () => {
    router.push(
      `/talent/challenges/results?submissionId=${submission.submission_id}`,
    );
  };

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-100 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:ring-emerald-500/30">
          <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {submission.challenge.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
            >
              Difficulty: {submission.challenge.difficulty}
            </span>
            <span className="text-muted-foreground/60">•</span>

            <span>
              {new Date(submission.submitted_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Score and Action */}
      <div className="shrink-0 flex items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <div
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ring-1 transition-colors
          ${scoreConfig.bg} ${scoreConfig.ring}`}
          >
            <ScoreIcon className={`h-4 w-4 ${scoreConfig.iconColor}`} />
            <span className={`text-lg font-bold ${scoreConfig.text}`}>
              {submission.score}
            </span>
            <span className={`text-sm ${scoreConfig.iconColor}`}>/100</span>
          </div>
        </div>

        <Button
          onClick={handleViewDetails}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver Detalles
        </Button>
      </div>
    </div>
  );
}
