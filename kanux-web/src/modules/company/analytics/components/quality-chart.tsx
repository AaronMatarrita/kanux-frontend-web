"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsDashboardContext } from "@/modules/company/analytics/context/AnalyticsDashboardContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { CandidateQuality } from "@/types/analytics.types";

const COLORS = {
  Alta: "#22c55e",
  Media: "#eab308",
  Baja: "#ef4444",
};

type QualityKey = keyof CandidateQuality;

export function QualityChart() {
  const { data, loading, error } = useAnalyticsDashboardContext();

  const qualityMap: {
    key: QualityKey;
    label: string;
    color: string;
  }[] = [
    { key: "high", label: "Alta", color: COLORS.Alta },
    { key: "medium", label: "Media", color: COLORS.Media },
    { key: "low", label: "Baja", color: COLORS.Baja },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Calidad de Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full max-w-70 mx-auto animate-pulse rounded bg-muted mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-muted animate-pulse" />
                <div className="h-3 w-12 mx-auto rounded bg-muted animate-pulse" />
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
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Calidad de Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No se pudieron cargar los datos.
        </CardContent>
      </Card>
    );
  }

  const chartData = qualityMap.map((q) => ({
    name: q.label,
    value: data.candidateQuality[q.key],
    fill: q.color,
  }));

  const total = chartData.reduce((sum, i) => sum + i.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Calidad de Candidatos
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* CHART */}
        <div className="relative mx-auto h-60 w-full max-w-70">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  const pct =
                    total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {d.value} candidatos ({pct}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {chartData.map((item) => (
            <div key={item.name}>
              <p className="text-2xl font-bold" style={{ color: item.fill }}>
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
