import Link from "next/link";
import { Clock } from "lucide-react";
import { difficultyConfig } from "@/modules/challenges/details/config/difficulty.config";
import { ActionGuard } from "@/guards/actionGuard";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  challengeType?: "technical" | "soft";
}

export function ChallengeCard({
  id,
  title,
  description,
  difficulty,
  durationMinutes,
  challengeType = "technical",
}: ChallengeCardProps) {
  const config = difficultyConfig[difficulty] || difficultyConfig["Básico"];
  const Icon = config.icon;

  const cleanDescription = description
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .trim();

  // Format duration
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationStr =
    hours > 0
      ? `${hours}h ${mins > 0 ? `${mins}m` : ""}`
      : `${durationMinutes}m`;

  const isAdvanced = difficulty === "Avanzado";

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
          >
            {config.label}
          </span>
          {challengeType === "soft" && (
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-200">
              Habilidades Blandas
            </span>
          )}
          {challengeType === "technical" && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
              Desafío de Código
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="mt-4 text-base font-semibold text-slate-900 leading-snug">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
        {cleanDescription}
      </p>

      {/* Footer */}
      <div className="mt-auto pt-4">
        {/* Timer */}
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          {durationStr}
        </div>

        {/* CTA */}
        {isAdvanced ? (
          <ActionGuard
            feature="can_access_advanced_challenges"
            actionName="Acceder a retos avanzados"
          >
            <Link
              href={`/talent/challenges/${id}/details`}
              className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-[#2EC27E] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#28b76a] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              Ver detalles
            </Link>
          </ActionGuard>
        ) : (
          <Link
            href={`/talent/challenges/${id}/details`}
            className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-[#2EC27E] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#28b76a] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Ver detalles
          </Link>
        )}
      </div>
    </div>
  );
}
