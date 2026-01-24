import { CheckCircle2, FileText, Clock, HelpCircle } from "lucide-react";
import { InfoRow } from "./Pill";
import { difficultyConfig } from "../config/difficulty.config";
import { formatDuration } from "../utils/challenge.utils";

interface ChallengeSummaryProps {
  challenge: any;
  isTechnical: boolean;
  techData?: any;
  softData?: any;
}

export function ChallengeSummary({
  challenge,
  isTechnical,
  techData,
  softData,
}: ChallengeSummaryProps) {
  const difficulty = challenge?.difficulty || "Básico";
  const diffConfig = difficultyConfig[difficulty] || difficultyConfig["Básico"];
  const DiffIcon = diffConfig.icon;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Resumen del challenge
      </h3>

      <InfoRow
        icon={FileText}
        label="Tipo"
        value={isTechnical ? "Técnico" : "No técnico"}
      />
      <InfoRow
        icon={Clock}
        label="Duración"
        value={formatDuration(challenge?.duration_minutes)}
      />
      <InfoRow icon={DiffIcon} label="Dificultad" value={difficulty} />

      {isTechnical && techData?.assets?.test_cases?.test_cases?.length > 0 && (
        <InfoRow
          icon={CheckCircle2}
          label="Casos de prueba"
          value={`${techData.assets.test_cases.test_cases.length} casos`}
        />
      )}

      {!isTechnical &&
        softData?.non_technical_challenges?.[0]?.non_technical_questions
          ?.length > 0 && (
          <InfoRow
            icon={HelpCircle}
            label="Preguntas"
            value={`${softData.non_technical_challenges[0].non_technical_questions.length} preguntas`}
          />
        )}
    </div>
  );
}
