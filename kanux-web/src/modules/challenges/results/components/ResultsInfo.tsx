import { Clock, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResultsInfoProps {
  challengeTitle?: string;
  difficulty?: string;
  submissionId?: string;
  submittedAt?: string;
  copied: boolean;
  onCopy: () => void;
}

function getDifficultyStyles(difficulty: string) {
  switch (difficulty) {
    case "Avanzado":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Intermedio":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
}

export function ResultsInfo({
  challengeTitle,
  difficulty,
  submissionId,
  submittedAt,
  copied,
  onCopy,
}: ResultsInfoProps) {
  return (
    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
          Información del Reto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Nombre
          </p>
          <p className="font-semibold text-foreground">
            {challengeTitle || "—"}
          </p>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Dificultad
          </p>
          <Badge
            variant="outline"
            className={cn("font-medium", getDifficultyStyles(difficulty || ""))}
          >
            {difficulty || "—"}
          </Badge>
        </div>

        <div className="h-px bg-border" />

        {submittedAt && (
          <>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Fecha de Envío
              </p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(submittedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="h-px bg-border" />
          </>
        )}

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            ID de Envío
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted text-muted-foreground px-3 py-2 rounded-lg font-mono truncate">
              {submissionId?.slice(0, 20) || "N/A"}...
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
