"use client";

import { Play, Clock, FileText } from "lucide-react";
import { difficultyConfig } from "../config/difficulty.config";
import { Pill } from "./Pill";
import { formatDuration } from "../utils/challenge.utils";
import { useStartChallenge } from "../hooks/useStartChallenge";
import { BackNavigation } from "@/modules/challenges/components/BackNavigation";

interface ChallengeHeroProps {
  challenge: any;
  isTechnical: boolean;
  id: string;
  onBack: () => void;
}

export function ChallengeHero({
  challenge,
  isTechnical,
  id,
  onBack,
}: ChallengeHeroProps) {
  const difficulty = challenge?.difficulty || "Básico";
  const diffConfig = difficultyConfig[difficulty] || difficultyConfig["Básico"];
  const DiffIcon = diffConfig.icon;

  const { startChallenge, isStarting } = useStartChallenge({
    challengeId: id,
    durationMinutes: challenge?.duration_minutes || 60,
  });

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <BackNavigation label="Volver a challenges" onClick={onBack} />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm">
              <DiffIcon className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                {challenge?.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Pill
                  icon={Clock}
                  text={formatDuration(challenge?.duration_minutes)}
                />
                <Pill
                  icon={FileText}
                  text={isTechnical ? "Técnico" : "No técnico"}
                />

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${diffConfig.className}`}
                >
                  {diffConfig.label}
                </span>

                {!isTechnical && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200">
                    Soft Skills
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isStarting}
            onClick={startChallenge}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition
            bg-[#2EC27E] text-white hover:bg-[#28b76a] disabled:bg-slate-200 disabled:text-slate-400`}
          >
            <Play className="h-4 w-4" />
            {isStarting ? "Iniciando..." : "Iniciar challenge"}
          </button>
        </div>
      </section>
    </>
  );
}
