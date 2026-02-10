import { Target, CheckCircle2, XCircle, Zap, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

interface ResultsQuickStatsProps {
  scorePercentage: number;
  isPassed: boolean;
  difficulty?: string;
  submittedAt?: string;
}

function getDifficultyStyles(difficulty: string) {
  switch (difficulty) {
    case "Avanzado":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30";
    case "Intermedio":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30";
    default:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30";
  }
}

export function ResultsQuickStats({
  scorePercentage,
  isPassed,
  difficulty = "Básico",
  submittedAt,
}: ResultsQuickStatsProps) {
  const stats: QuickStat[] = [
    {
      label: "Puntuación",
      value: `${scorePercentage}%`,
      icon: <Target className="h-5 w-5 text-primary" />,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Estado",
      value: isPassed ? "Aprobado" : "No Aprobado",
      icon: isPassed ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-300" />
      ),
      bgColor: isPassed
        ? "bg-emerald-100 dark:bg-emerald-500/15"
        : "bg-rose-100 dark:bg-rose-500/15",
      iconColor: isPassed
        ? "text-emerald-600 dark:text-emerald-300"
        : "text-rose-600 dark:text-rose-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {/* Score and Status */}
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="bg-card/80 backdrop-blur-sm border-border/50  "
        >
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  stat.bgColor,
                )}
              >
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}

      {/* Difficulty */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50  ">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-500/15">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs", getDifficultyStyles(difficulty))}
          >
            {difficulty}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">Dificultad</p>
        </CardContent>
      </Card>

      {/* Date */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50  ">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-500/15">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">
            {submittedAt
              ? new Date(submittedAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Enviado</p>
        </CardContent>
      </Card>
    </div>
  );
}
