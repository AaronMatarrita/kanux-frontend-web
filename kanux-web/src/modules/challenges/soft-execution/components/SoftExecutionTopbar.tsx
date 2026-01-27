import { X, BookOpen } from "lucide-react";

interface SoftExecutionTopbarProps {
  title: string;
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
  onExit: () => void;
}

export function SoftExecutionTopbar({
  title,
  progress,
  currentQuestion,
  totalQuestions,
  onExit,
}: SoftExecutionTopbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-slate-600" />
          <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            Pregunta {currentQuestion} de {totalQuestions}
          </span>
          <button
            type="button"
            onClick={onExit}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            title="Salir"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-[#2EC27E] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
