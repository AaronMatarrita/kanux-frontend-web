"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useTalentAnalyticsDashboardContext } from "@/modules/talent/analytics/context/TalentAnalyticsDashboardContext";

type ScoreDistribution = {
  "90-100": number;
  "80-89": number;
  "70-79": number;
  "60-69": number;
  "below-60": number;
};

type DistributionItem = {
  range: string;
  submissions: number;
  fill: string;
};

export function ScoreDistributionChart() {
  const { data, loading, error } = useTalentAnalyticsDashboardContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Distribucion de puntajes por rango
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Distribucion de puntajes por rango
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No se pudo cargar la distribucion de puntajes.
        </CardContent>
      </Card>
    );
  }

  const scoreRanges: {
    key: keyof ScoreDistribution;
    label: string;
    fill: string;
  }[] = [
    { key: "90-100", label: "90–100%", fill: "#22c55e" },
    { key: "80-89", label: "80–89%", fill: "#3b82f6" },
    { key: "70-79", label: "70–79%", fill: "#eab308" },
    { key: "60-69", label: "60–69%", fill: "#f97316" },
    { key: "below-60", label: "Menos de 60%", fill: "#ef4444" },
  ];

  const distribution: DistributionItem[] = scoreRanges.map((range) => ({
    range: range.label,
    submissions: data.scoreDistribution[range.key],
    fill: range.fill,
  }));

  const totalSubmissions = distribution.reduce(
    (acc, curr) => acc + curr.submissions,
    0,
  );

  const maxSubmissions = Math.max(0, ...distribution.map((d) => d.submissions));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Distribucion de puntajes por rango
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {distribution.map((item, index) => {
          const percentage =
            totalSubmissions > 0
              ? Math.round((item.submissions / totalSubmissions) * 100)
              : 0;

          return (
            <div
              key={item.range}
              className={`space-y-2 transition-all duration-700 ease-out ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.range}
                </span>
                <span className="text-muted-foreground">
                  {item.submissions} envios · {percentage}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width:
                      mounted && maxSubmissions > 0
                        ? `${(item.submissions / maxSubmissions) * 100}%`
                        : "0%",
                    backgroundColor: item.fill,
                  }}
                />
              </div>
            </div>
          );
        })}

        {totalSubmissions === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay datos de envios disponibles todavia.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
