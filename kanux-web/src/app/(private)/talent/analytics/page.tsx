export const metadata = {
  title: "Analitica de Talento | Kánux",
};

import { StatCards } from "@/modules/talent/analytics/components/stat-cards";
import { ScoreDistributionChart } from "@/modules/talent/analytics/components/score-distribution-chart";
import { TopChallenges } from "@/modules/talent/analytics/components/top-challenges";
import { ContactedCompanies } from "@/modules/talent/analytics/components/contacted-companies";
import { TalentAnalyticsDashboardProvider } from "@/modules/talent/analytics/context/TalentAnalyticsDashboardContext";
import { FeatureGuard } from "@/guards/featureGuard";

export default function TalentAnalyticsPage() {
  return (
    <TalentAnalyticsDashboardProvider>
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Analitica de Talento
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visualiza tu progreso, resultados y conversaciones recientes.
          </p>
        </div>

        <FeatureGuard
          feature="can_access_detailed_reports"
          infoText="La analitica de talento"
        >
          <div className="space-y-6">
            <StatCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <ScoreDistributionChart />
              <TopChallenges />
            </div>
            <ContactedCompanies />
          </div>
        </FeatureGuard>
      </div>
    </TalentAnalyticsDashboardProvider>
  );
}
