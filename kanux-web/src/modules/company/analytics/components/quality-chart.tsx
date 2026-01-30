"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { candidateQualityData } from "@/modules/company/analytics/lib/analytics-data";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  Alta: "#22c55e",
  Media: "#eab308",
  Baja: "#ef4444",
};

export function QualityChart() {
  const total = candidateQualityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Calidad de Candidatos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-70">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={candidateQualityData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="quality"
                strokeWidth={0}
              >
                {candidateQualityData.map((entry) => (
                  <Cell
                    key={`cell-${entry.quality}`}
                    fill={COLORS[entry.quality as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.value / total) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium">{data.quality}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} candidatos ({percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4 text-center">
          {candidateQualityData.map((item) => (
            <div key={item.quality}>
              <p
                className="text-2xl font-bold"
                style={{ color: COLORS[item.quality as keyof typeof COLORS] }}
              >
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.quality}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
