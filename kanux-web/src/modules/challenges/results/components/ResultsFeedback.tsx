import { BookOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NormalizedFeedback } from "@/modules/challenges/results/utils/normalize-feedback";

interface ResultsFeedbackProps {
  feedback: NormalizedFeedback;
}

function formatLabel(label: string) {
  return label.replace(/_/g, " ");
}

export function ResultsFeedback({ feedback }: ResultsFeedbackProps) {
  const {
    strengths,
    areasForImprovement,
    nextSteps,
    answersOverview,
    perQuestionFeedback,
    scoreBreakdown,
    tests,
    codeQuality,
    tags,
  } = feedback;

  const hasAnyContent =
    (strengths && strengths.length > 0) ||
    (areasForImprovement && areasForImprovement.length > 0) ||
    (nextSteps && nextSteps.length > 0) ||
    answersOverview ||
    (perQuestionFeedback && perQuestionFeedback.length > 0) ||
    (scoreBreakdown && Object.keys(scoreBreakdown).length > 0) ||
    (codeQuality && Object.keys(codeQuality).length > 0) ||
    tests ||
    (tags && tags.length > 0);

  if (!hasAnyContent) return null;

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Retroalimentación
        </CardTitle>

        <div className="flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Esta retroalimentación fue generada por una inteligencia artificial
            y puede no ser completamente precisa. Úsala como guía de apoyo, no
            como una evaluación definitiva.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {(scoreBreakdown || tests || codeQuality || answersOverview) && (
            <div className="grid gap-3 md:grid-cols-3">
              {answersOverview && (
                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Respuestas
                  </p>
                  <div className="space-y-1 text-sm">
                    {typeof answersOverview.total === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold text-foreground">
                          {answersOverview.total}
                        </span>
                      </div>
                    )}
                    {typeof answersOverview.correct === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Correctas</span>
                        <span className="font-semibold text-emerald-600">
                          {answersOverview.correct}
                        </span>
                      </div>
                    )}
                    {typeof answersOverview.incorrect === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Incorrectas
                        </span>
                        <span className="font-semibold text-rose-600">
                          {answersOverview.incorrect}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {scoreBreakdown && (
                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Desglose de Puntaje
                  </p>
                  <div className="space-y-1">
                    {Object.entries(scoreBreakdown).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {formatLabel(key)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tests && (
                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Pruebas
                  </p>
                  <div className="space-y-1 text-sm">
                    {typeof tests.total === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold text-foreground">
                          {tests.total}
                        </span>
                      </div>
                    )}
                    {typeof tests.passed === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Exitos</span>
                        <span className="font-semibold text-emerald-600">
                          {tests.passed}
                        </span>
                      </div>
                    )}
                    {typeof tests.failed === "number" && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Fallos</span>
                        <span className="font-semibold text-rose-600">
                          {tests.failed}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {codeQuality && (
                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Calidad de Codigo
                  </p>
                  <div className="space-y-1">
                    {Object.entries(codeQuality).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {formatLabel(key)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(strengths || areasForImprovement || nextSteps) && (
            <div className="grid gap-4 md:grid-cols-3">
              {strengths && strengths.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-emerald-50/40 p-4 dark:bg-emerald-500/10">
                  <p className="text-sm font-semibold text-emerald-700 mb-2 dark:text-emerald-300">
                    Fortalezas
                  </p>
                  <ul className="space-y-1 text-sm text-emerald-900 dark:text-emerald-200">
                    {strengths.map((item, idx) => (
                      <li key={idx}>- {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {areasForImprovement && areasForImprovement.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-amber-50/40 p-4 dark:bg-amber-500/10">
                  <p className="text-sm font-semibold text-amber-700 mb-2 dark:text-amber-300">
                    Mejoras
                  </p>
                  <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-200">
                    {areasForImprovement.map((item, idx) => (
                      <li key={idx}>- {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {nextSteps && nextSteps.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-sky-50/40 p-4 dark:bg-sky-500/10">
                  <p className="text-sm font-semibold text-sky-700 mb-2 dark:text-sky-300">
                    Siguientes pasos
                  </p>
                  <ul className="space-y-1 text-sm text-sky-900 dark:text-sky-200">
                    {nextSteps.map((item, idx) => (
                      <li key={idx}>- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {perQuestionFeedback && perQuestionFeedback.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                Retroalimentacion por pregunta
              </p>
              <div className="space-y-3">
                {perQuestionFeedback.map((item, idx) => (
                  <div
                    key={`${item.questionId ?? "q"}-${idx}`}
                    className="rounded-md border border-border/60 bg-muted/20 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {item.questionId || `Pregunta ${idx + 1}`}
                      </p>
                      {typeof item.correct === "boolean" && (
                        <Badge
                          variant="secondary"
                          className={
                            item.correct
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                          }
                        >
                          {item.correct ? "Correcta" : "Incorrecta"}
                        </Badge>
                      )}
                    </div>
                    {item.explanation && (
                      <p className="text-sm text-foreground mt-2">
                        {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
