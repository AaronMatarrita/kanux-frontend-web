import { httpClient } from "@/services/http";
import { AnalyticsDashboard } from "@/types/analytics.types";

export interface AnalyticsDashboardApiResponse {
  data: AnalyticsDashboard;
}

class AnalyticsService {
  async getDashboard(): Promise<AnalyticsDashboard> {
    const res = await httpClient.get<AnalyticsDashboardApiResponse>(
      "/analytics/dashboard",
    );
    console.log("Analytics Dashboard Response:", res);
    return res.data.data;
  }
}

export const analyticsService = new AnalyticsService();
