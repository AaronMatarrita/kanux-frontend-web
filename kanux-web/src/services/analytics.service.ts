// src/services/analytics/analytics.service.ts

import { httpClient } from "@/services/http";
import { AnalyticsDashboard } from "@/types/analytics.types";

export interface AnalyticsDashboardApiResponse {
  data: AnalyticsDashboard;
}

class AnalyticsService {
  async getDashboard(token: string): Promise<AnalyticsDashboard> {
    const res = await httpClient.get<AnalyticsDashboardApiResponse>(
      "/analytics/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data;
  }
}

export const analyticsService = new AnalyticsService();
