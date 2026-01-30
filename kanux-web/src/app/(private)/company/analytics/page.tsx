import { StatCards } from "@/modules/company/analytics/components/stat-cards";
import { QualityChart } from "@/modules/company/analytics/components/quality-chart";
import { PerformanceChart } from "@/modules/company/analytics/components/performace-chart";
import { TopCandidates } from "@/modules/company/analytics/components/top-candidates";
import { AnalyticsDashboardProvider } from "@/modules/company/analytics/context/AnalyticsDashboardContext";

export default function AnalyticsPage() {
  return (
    <AnalyticsDashboardProvider>
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="mt-1 text-muted-foreground">
            Data-driven insights for your hiring process.
          </p>
        </div>

        <div className="space-y-6">
          <StatCards />

          <div className="grid gap-6 lg:grid-cols-2">
            <QualityChart />
            <PerformanceChart />
          </div>

          <TopCandidates />
        </div>
      </div>
    </AnalyticsDashboardProvider>
  );
}
