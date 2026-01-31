"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { analyticsService } from "@/services/analytics.service";
import type { AnalyticsDashboard } from "@/types/analytics.types";
import { useAuth } from "@/context/AuthContext";

interface AnalyticsDashboardContextProps {
  data: AnalyticsDashboard | null;
  loading: boolean;
  error: string | null;
}

const AnalyticsDashboardContext = createContext<
  AnalyticsDashboardContextProps | undefined
>(undefined);

export function AnalyticsDashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
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

  return (
    <AnalyticsDashboardContext.Provider value={{ data, loading, error }}>
      {children}
    </AnalyticsDashboardContext.Provider>
  );
}

export function useAnalyticsDashboardContext() {
  const ctx = useContext(AnalyticsDashboardContext);
  if (!ctx)
    throw new Error(
      "useAnalyticsDashboardContext must be used within AnalyticsDashboardProvider",
    );
  return ctx;
}
