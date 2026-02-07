import { httpClient } from "@/services/http";
import {
  AnalyticsDashboard,
  TalentAnalyticsDashboard,
} from "@/types/analytics.types";

export interface AnalyticsDashboardApiResponse {
  data: AnalyticsDashboard;
}

export interface TalentAnalyticsDashboardApiResponse {
  data: TalentAnalyticsDashboard;
}

class AnalyticsService {
  async getDashboard(): Promise<AnalyticsDashboard> {
    const res = await httpClient.get<AnalyticsDashboardApiResponse>(
      "/analytics/dashboard",
    );
    console.log("Analytics Dashboard Response:", res);
    return res.data.data;
  }

  async getTalentDashboard(): Promise<TalentAnalyticsDashboard> {
    const res = await httpClient.get<TalentAnalyticsDashboardApiResponse>(
      "/analytics/talent/dashboard",
    );
    return res.data.data;
  }
}

export const analyticsService = new AnalyticsService();
