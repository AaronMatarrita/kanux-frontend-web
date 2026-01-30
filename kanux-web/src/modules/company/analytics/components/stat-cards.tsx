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
import { analyticsData } from "@/modules/company/analytics/lib/analytics-data";

const stats = [
  {
    title: "Total Candidates",
    value: analyticsData.summary.totalCandidates.toLocaleString(),
    change: "+12% from last month",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Avg. Completion Rate",
    value: `${analyticsData.summary.completionRate}%`,
    change: "+5% from last month",
    changeType: "positive" as const,
    icon: Target,
  },
  {
    title: "Top Match Score",
    value: `${analyticsData.summary.topMatchScore}%`,
    change: "Best candidate match",
    changeType: "neutral" as const,
    icon: Trophy,
  },
  {
    title: "Active Challenges",
    value: analyticsData.summary.activeChallenges.toString(),
    change: "3 created this month",
    changeType: "info" as const,
    icon: Zap,
  },
];

export function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="gap-4 py-5">
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
                className={`mt-1 text-xs ${
                  stat.changeType === "positive"
                    ? "text-emerald-600"
                    : stat.changeType === "info"
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {stat.changeType === "positive" && (
                  <TrendingUp className="mr-1 inline h-3 w-3" />
                )}
                {stat.changeType === "info" && (
                  <ArrowUpRight className="mr-1 inline h-3 w-3" />
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
