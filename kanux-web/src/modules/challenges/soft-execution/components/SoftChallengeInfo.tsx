import { CheckCircle2, Circle, Clock, Target } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Información del Challenge
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(challenge.duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="h-4 w-4" />
            <span>
              {answeredCount} de {totalQuestions} respondidas
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Progreso de Preguntas
        </h3>

        <div className="space-y-2">
          {questions.map((question, index) => {
            const isAnswered = !!answers[question.id];
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onQuestionClick(index)}
                className={`w-full rounded-md border p-3 text-left transition-all ${
                  isCurrent
                    ? "border-[#2EC27E] bg-green-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isAnswered ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2EC27E]" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900">
                      Pregunta {index + 1}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {question.question}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-600">
          💡 <strong>Tip:</strong> Puedes navegar entre preguntas usando los
          botones de navegación o haciendo clic en el listado.
        </p>
      </div>
    </div>
  );
}
