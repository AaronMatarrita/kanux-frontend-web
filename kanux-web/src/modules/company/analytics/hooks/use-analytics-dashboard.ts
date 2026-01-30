"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import { AnalyticsDashboard } from "@/types/analytics.types";
import { useAuth } from "@/context/AuthContext";

export function useAnalyticsDashboard() {
  const { session } = useAuth();

  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    analyticsService
      .getDashboard(session.token)
      .then(setData)
      .catch((err) => {
        console.error("Analytics dashboard error:", err);
        setError("Failed to load analytics");
      })
      .finally(() => setLoading(false));
  }, [session?.token]);

  return {
    data,
    loading,
    error,
  };
}
