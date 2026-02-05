"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  const [showAll, setShowAll] = React.useState(false);

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

  const visibleChallenges = showAll ? challenges : challenges.slice(0, 3);

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl">Desafíos recomendados</CardTitle>
          <CardDescription>
            Explora retos alineados a tu perfil.
          </CardDescription>
        </div>
        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          {challenges.length} disponibles
        </span>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {visibleChallenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="group rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                    {challenge.title}
                  </h3>

                  {challenge.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {challenge.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/talent/challenges/${challenge.id}/details`}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer"
                >
                  Más detalles
                </Link>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getDifficultyColor(
                    challenge.difficulty,
                  )}`}
                >
                  {challenge.difficulty}
                </span>

                <span className="text-xs text-muted-foreground">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-muted-foreground">
              No hay desafíos recomendados en este momento.
            </p>
          </div>
        )}
      </CardContent>

      {challenges.length > 3 && (
        <CardFooter className="border-t">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="ml-auto inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer"
          >
            {showAll ? "Ver menos" : "Ver más"}
          </button>
        </CardFooter>
      )}
    </Card>
  );
};
