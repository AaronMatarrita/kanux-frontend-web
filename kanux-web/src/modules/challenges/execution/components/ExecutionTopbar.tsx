"use client";

import { ArrowLeft, Clock } from "lucide-react";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface ExecutionTopbarProps {
  title: string;
  subtitle?: string;
  difficulty: Difficulty;
  timeLabel: string; // e.g. "1:59:35"
  onExit?: () => void;
  onSubmit?: () => void;
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  advanced: "bg-rose-50 text-rose-700 border border-rose-200",
};

export function ExecutionTopbar({
  title,
  subtitle,
  difficulty,
  timeLabel,
  onExit,
  onSubmit,
}: ExecutionTopbarProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Exit + titles */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Exit</span>
          </button>

          <div className="min-w-0">
            <div className="text-sm text-slate-500 truncate">{subtitle}</div>
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

          <div className="hidden sm:flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm tabular-nums">{timeLabel}</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
}
