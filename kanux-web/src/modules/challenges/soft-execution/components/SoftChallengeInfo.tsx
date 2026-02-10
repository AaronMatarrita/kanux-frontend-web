import { CheckCircle2, Circle, Clock, Target, TrendingUp } from "lucide-react";
import { SoftChallenge } from "@/services/challenges.service";
import { formatDuration } from "@/modules/challenges/details/utils/challenge.utils";

interface SoftChallengeInfoProps {
  challenge: SoftChallenge;
  questions: Array<{
    id: string;
    question: string;
  }>;
  answers: Record<string, string>;
  onQuestionClick: (index: number) => void;
  currentQuestionIndex: number;
}

export function SoftChallengeInfo({
  challenge,
  questions,
  answers,
  onQuestionClick,
  currentQuestionIndex,
}: SoftChallengeInfoProps) {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Challenge Info Card */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          Información del Challenge
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Duración:</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatDuration(challenge.duration_minutes)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Respondidas:</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {answeredCount}/{totalQuestions}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Progreso
              </span>
              <span className="text-xs font-bold text-emerald-500">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-3">Preguntas</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions.map((question, index) => {
            const isAnswered = !!answers[question.id];
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onQuestionClick(index)}
                className={`w-full rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50 shadow-md dark:bg-emerald-500/15"
                    : isAnswered
                      ? "border-border bg-muted/40 hover:border-border/80"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isAnswered ? (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground mb-1">
                      P{index + 1}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {question.question}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Box */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <p className="text-xs text-indigo-800 leading-relaxed dark:text-indigo-200">
          <strong>Consejo:</strong> Haz clic en cualquier pregunta para saltar,
          o usa los botones de navegación.
        </p>
      </div>
    </div>
  );
}
