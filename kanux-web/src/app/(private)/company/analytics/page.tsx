export const metadata = {
  title: "Analítica de Talento | Kánux",
};

import { StatCards } from "@/modules/company/analytics/components/stat-cards";
import { QualityChart } from "@/modules/company/analytics/components/quality-chart";
import { PerformanceChart } from "@/modules/company/analytics/components/performace-chart";
import { TopCandidates } from "@/modules/company/analytics/components/top-candidates";
import { AnalyticsDashboardProvider } from "@/modules/company/analytics/context/AnalyticsDashboardContext";
import CompanyGuardClient from "./CompanyGuardClient";
import { FeatureGuard } from "@/guards/featureGuard";

export default function AnalyticsPage() {
  return (
    <CompanyGuardClient>
      <AnalyticsDashboardProvider>
        <div className="flex flex-col flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Analítica de Talento
            </h1>
            <p className="mt-1 text-muted-foreground">
              Visualiza métricas y tendencias clave de tus procesos de
              selección.
            </p>
          </div>

          <FeatureGuard
            feature="can_access_metrics"
            infoText="La analitica de talento"
          >
            <div className="space-y-6">
              <StatCards />
              <div className="grid gap-6 lg:grid-cols-2">
                <QualityChart />
                <PerformanceChart />
              </div>
              <TopCandidates />
            </div>
          </FeatureGuard>
        </div>
      </AnalyticsDashboardProvider>
    </CompanyGuardClient>
  );
}
