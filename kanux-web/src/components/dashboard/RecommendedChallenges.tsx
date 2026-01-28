"use client";

import React from "react";
import Link from "next/link";

export interface DashboardChallenge {
  id: string;
  title: string;
  description: string | null;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  created_at: string;
}

interface RecommendedChallengesProps {
  challenges: DashboardChallenge[];
}

export const RecommendedChallenges: React.FC<RecommendedChallengesProps> = ({
  challenges,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Intermedio":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Avanzado":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Desafíos recomendados
        </h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
          {challenges.length} disponibles
        </span>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <div
            key={challenge.id}
            className="group p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                    {challenge.title}
                  </h3>
                </div>

                {challenge.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {challenge.description}
                  </p>
                )}
              </div>

              <Link
                href={`/talent/challenges/${challenge.id}/details`}
                className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                Más detalles
              </Link>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getDifficultyColor(
                    challenge.difficulty,
                  )}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <span className="text-xs text-slate-400">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-slate-500">
            No hay desafíos recomendados en este momento.
          </p>
        </div>
      )}
    </div>
  );
};
