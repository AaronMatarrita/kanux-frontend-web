"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsDashboardContext } from "@/modules/company/analytics/context/AnalyticsDashboardContext";
import { Crown } from "lucide-react";

function getScoreColor(score: number): string {
  if (score >= 95) return "bg-emerald-500 text-white";
  if (score >= 90) return "bg-blue-500 text-white";
  if (score >= 85) return "bg-sky-500 text-white";
  return "bg-indigo-500 text-white";
}

export function TopCandidates() {
  const { data, loading, error } = useAnalyticsDashboardContext();
  const candidates = data?.topCandidates
    ? data.topCandidates.slice().sort((a, b) => b.score - a.score)
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            Mejores Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg p-3 animate-pulse bg-muted/40"
              >
                <div className="space-y-2 w-2/3">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-4 w-12 rounded bg-muted" />
                    ))}
                  </div>
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
            Mejores Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No se pudieron cargar los datos.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Mejores candidatos
        </CardTitle>
      </CardHeader>

      <CardContent>
        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay resultados de candidatos aún.
          </p>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate, index) => {
              const isTop = index === 0;

              return (
                <div
                  key={candidate.id}
                  className={`
                    flex items-center justify-between rounded-lg p-3
                    transition-all duration-500 ease-out
                    hover:bg-muted/50
                    animate-in fade-in slide-in-from-bottom-1
                    ${isTop ? "border border-emerald-500/40 bg-emerald-500/5" : ""}
                  `}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Left */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-primary">
                        {candidate.name?.trim() || "Unnamed Candidate"}
                      </p>

                      {isTop && (
                        <Badge className="flex items-center gap-1 bg-emerald-500 text-white">
                          <Crown size={12} />
                          Mejor Puntaje
                        </Badge>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills?.filter(Boolean).length ? (
                        candidate.skills
                          .filter((skill): skill is string => Boolean(skill))
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {skill}
                            </Badge>
                          ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sin habilidades listadas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    className={`
                      flex h-10 w-14 items-center justify-center rounded-full
                      text-sm font-bold shadow-sm
                      ${getScoreColor(candidate.score)}
                    `}
                  >
                    {candidate.score}%
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
