"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTalentAnalyticsDashboardContext } from "@/modules/talent/analytics/context/TalentAnalyticsDashboardContext";
import { Medal } from "lucide-react";

function getScoreColor(score: number): string {
  if (score >= 95) return "bg-emerald-500 text-white";
  if (score >= 90) return "bg-blue-500 text-white";
  if (score >= 85) return "bg-sky-500 text-white";
  return "bg-indigo-500 text-white";
}

export function TopChallenges() {
  const { data, loading, error } = useTalentAnalyticsDashboardContext();
  const challenges = data?.topChallenges
    ? data.topChallenges.slice().sort((a, b) => b.avgScore - a.avgScore)
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Mejores desafios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg p-3 animate-pulse bg-muted/40"
              >
                <div className="space-y-2 w-2/3">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="h-10 w-14 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Mejores desafios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No se pudieron cargar los desafios.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Mejores desafios
        </CardTitle>
      </CardHeader>

      <CardContent>
        {challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay resultados de desafios aun.
          </p>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge, index) => {
              const isTop = index === 0;

              return (
                <div
                  key={challenge.challengeId}
                  className={`
                    flex items-center justify-between rounded-lg p-3
                    transition-all duration-500 ease-out
                    hover:bg-muted/50
                    animate-in fade-in slide-in-from-bottom-1
                    ${isTop ? "border border-emerald-500/40 bg-emerald-500/5" : ""}
                  `}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-primary">
                        {challenge.title}
                      </p>
                      {isTop && (
                        <Badge className="flex items-center gap-1 bg-emerald-500 text-white">
                          <Medal size={12} />
                          Mejor promedio
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{challenge.attempts} intentos</span>
                      <span>·</span>
                      <span>Mejor: {challenge.bestScore}%</span>
                    </div>
                  </div>

                  <div
                    className={`
                      flex h-10 w-14 items-center justify-center rounded-full
                      text-sm font-bold shadow-sm
                      ${getScoreColor(challenge.avgScore)}
                    `}
                  >
                    {challenge.avgScore}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
