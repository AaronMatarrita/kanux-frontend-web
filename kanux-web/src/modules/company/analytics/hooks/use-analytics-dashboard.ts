"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { AnalyticsDashboard } from "@/types/analytics.types";
import { useAuth } from "@/context/AuthContext";

export function useAnalyticsDashboard() {
  const { session } = useAuth();

  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.isAuthenticated) return;

    setLoading(true);

    analyticsService
      .getDashboard()
      .then(setData)
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [session?.isAuthenticated]);

  return { data, loading, error };
}
