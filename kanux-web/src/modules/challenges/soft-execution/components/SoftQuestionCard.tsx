import { CheckCircle2, Lightbulb } from "lucide-react";

interface Question {
  id: string;
  question: string;
  non_technical_question_options: Array<{
    id: string;
    option_text: string;
  }>;
}

interface SoftQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export function SoftQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}: SoftQuestionCardProps) {
  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <p className="text-muted-foreground">No hay pregunta disponible.</p>
      </div>
    );
  }

  const progress = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold dark:bg-blue-500/15 dark:text-blue-300">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Progreso {progress}%
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.non_technical_question_options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-sm dark:bg-emerald-500/15"
                  : "border-border hover:border-border/80 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio */}
                <div className="mt-1">
                  {isSelected ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-foreground text-xs font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  <p
                    className={`text-sm ${
                      isSelected
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {option.option_text}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 dark:text-amber-300" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Tip:</strong> Piensa en situaciones reales de trabajo y en el
          impacto de tu decisión en el equipo.
        </p>
      </div>
    </div>
  );
}
