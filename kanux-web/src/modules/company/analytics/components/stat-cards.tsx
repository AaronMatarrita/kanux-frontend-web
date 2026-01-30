"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Target,
  Trophy,
  Zap,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useAnalyticsDashboardContext } from "@/modules/company/analytics/context/AnalyticsDashboardContext";

export function StatCards() {
  const { data, loading, error } = useAnalyticsDashboardContext();

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
        Unable to load analytics summary.
      </p>
    );
  }

  const stats = [
    {
      title: "Total Candidates",
      value: data.summary.totalCandidates.toLocaleString(),
      change: "Updated in real time",
      changeType: "info" as const,
      icon: Users,
    },
    {
      title: "Avg. Completion Rate",
      value: `${data.summary.completionRate}%`,
      change: "Based on submitted profiles",
      changeType: "positive" as const,
      icon: Target,
    },
    {
      title: "Top Match Score",
      value: `${data.summary.topMatchScore}%`,
      change: "Best performing candidate",
      changeType: "neutral" as const,
      icon: Trophy,
    },
    {
      title: "Active Challenges",
      value: data.summary.activeChallenges.toString(),
      change: "Currently open",
      changeType: "info" as const,
      icon: Zap,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
                className={`mt-1 flex items-center text-xs ${
                  stat.changeType === "positive"
                    ? "text-emerald-600"
                    : stat.changeType === "info"
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {stat.changeType === "positive" && (
                  <TrendingUp className="mr-1 h-3 w-3" />
                )}
                {stat.changeType === "info" && (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                )}
                {stat.change}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
