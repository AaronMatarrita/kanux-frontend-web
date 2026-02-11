"use client";

import { ArrowLeft, Clock } from "lucide-react";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface ExecutionTopbarProps {
  title: string;
  difficulty: Difficulty;
  timeLabel: string;
  onExit?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  intermediate:
    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  advanced:
    "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
};

export function ExecutionTopbar({
  title,
  difficulty,
  timeLabel,
  onExit,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
}: ExecutionTopbarProps) {
  const disabled = submitDisabled || isSubmitting;

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Exit + titles */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Salir</span>
          </button>

          <div className="min-w-0">
            <div className="text-base sm:text-lg font-semibold truncate">
              {title}
            </div>
          </div>
        </div>

        {/* Right: difficulty pill, timer, submit button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyStyles[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>

          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm tabular-nums">{timeLabel}</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar solución"}
          </button>
        </div>
      </div>
    </div>
  );
}
