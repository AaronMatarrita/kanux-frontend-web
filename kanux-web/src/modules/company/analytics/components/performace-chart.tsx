"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { performanceDistribution } from "@/modules/company/analytics/lib/analytics-data";
import { useEffect, useState } from "react";

export function PerformanceChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // trigger animation after mount
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const totalCandidates = performanceDistribution.reduce(
    (acc, curr) => acc + curr.candidates,
    0,
  );

  const maxCandidates = Math.max(
    ...performanceDistribution.map((p) => p.candidates),
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Candidate Quality by Score Range
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {performanceDistribution.map((item, index) => {
          const percentage =
            totalCandidates > 0
              ? Math.round((item.candidates / totalCandidates) * 100)
              : 0;

          return (
            <div
              key={item.range}
              className={`space-y-2 transition-all duration-700 ease-out
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
              `}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.range}
                </span>
                <span className="text-muted-foreground">
                  {item.candidates} candidates · {percentage}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: mounted
                      ? `${(item.candidates / maxCandidates) * 100}%`
                      : "0%",
                    backgroundColor: item.fill,
                  }}
                />
              </div>
            </div>
          );
        })}

        {totalCandidates === 0 && (
          <p className="text-sm text-muted-foreground">
            No candidate data available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
