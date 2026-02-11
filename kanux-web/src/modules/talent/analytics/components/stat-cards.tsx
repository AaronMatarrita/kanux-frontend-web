"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useTalentAnalyticsDashboardContext } from "@/modules/talent/analytics/context/TalentAnalyticsDashboardContext";
import type { StatChangeType } from "@/types/analytics.types";

const changeStyles: Record<
  StatChangeType,
  { className: string; Icon: typeof TrendingUp }
> = {
  positive: { className: "text-emerald-600", Icon: TrendingUp },
  negative: { className: "text-red-500", Icon: TrendingDown },
  neutral: { className: "text-muted-foreground", Icon: Minus },
};

function formatChange(value: number, label: string) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} ${label}`.trim();
}

export function StatCards() {
  const { data, loading, error } = useTalentAnalyticsDashboardContext();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="py-5">
            <CardContent className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load talent analytics summary.
      </p>
    );
  }

  const stats = [
    {
      title: "Total de envios",
      value: data.summary.totalSubmissions.toLocaleString(),
      change: formatChange(
        data.summaryChanges.totalSubmissions.value,
        data.summaryChanges.totalSubmissions.label,
      ),
      changeType: data.summaryChanges.totalSubmissions.type,
      icon: FileText,
    },
    {
      title: "Puntaje promedio",
      value: `${data.summary.avgScore}%`,
      change: formatChange(
        data.summaryChanges.avgScore.value,
        data.summaryChanges.avgScore.label,
      ),
      changeType: data.summaryChanges.avgScore.type,
      icon: Target,
    },
    {
      title: "Mejor puntaje",
      value: `${data.summary.bestScore}%`,
      change: "Mejor resultado obtenido",
      changeType: "neutral" as const,
      icon: Trophy,
    },
    {
      title: "Empresas contactadas",
      value: data.summary.contactedCompanies.toString(),
      change: formatChange(
        data.summaryChanges.contactedCompanies.value,
        data.summaryChanges.contactedCompanies.label,
      ),
      changeType: data.summaryChanges.contactedCompanies.type,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const changeStyle = changeStyles[stat.changeType];
        const ChangeIcon = changeStyle.Icon;

        return (
          <Card key={stat.title} className="py-5">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {stat.title}
                </span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>

                <p
                  className={`mt-1 flex items-center text-xs ${changeStyle.className}`}
                >
                  <ChangeIcon className="mr-1 h-3 w-3" />
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
