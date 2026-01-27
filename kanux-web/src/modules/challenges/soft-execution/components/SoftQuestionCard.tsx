import { CheckCircle2, Circle } from "lucide-react";

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
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <p className="text-slate-500">No hay pregunta disponible.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <span className="text-sm font-medium text-slate-500">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.non_technical_question_options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-[#2EC27E] bg-green-50"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-[#2EC27E]" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isSelected ? "font-medium text-slate-900" : "text-slate-700"
                  }`}
                >
                  {option.option_text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
