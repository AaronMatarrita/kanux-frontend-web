import { X, Clock } from "lucide-react";

interface SoftExecutionTopbarProps {
  title: string;
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
  timeLabel: string;
  onExit: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  expired?: boolean;
}

export function SoftExecutionTopbar({
  title,
  progress,
  currentQuestion,
  totalQuestions,
  timeLabel,
  onExit,
  onSubmit,
  isSubmitting,
  expired,
}: SoftExecutionTopbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            title="Salir"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {title}
            </div>
            <div className="text-xs text-slate-600">
              Pregunta {currentQuestion} de {totalQuestions}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm tabular-nums">{timeLabel}</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={expired || isSubmitting}
            className="inline-flex items-center rounded-md bg-[#2EC27E] px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-[#28b76a] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>

      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-[#2EC27E] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
