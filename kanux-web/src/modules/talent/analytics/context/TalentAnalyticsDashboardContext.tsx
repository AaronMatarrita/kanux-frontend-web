"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { analyticsService } from "@/services/analytics.service";
import type { TalentAnalyticsDashboard } from "@/types/analytics.types";
import { useAuth } from "@/context/AuthContext";

interface TalentAnalyticsDashboardContextProps {
  data: TalentAnalyticsDashboard | null;
  loading: boolean;
  error: string | null;
}

const TalentAnalyticsDashboardContext = createContext<
  TalentAnalyticsDashboardContextProps | undefined
>(undefined);

export function TalentAnalyticsDashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();
  const [data, setData] = useState<TalentAnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.isAuthenticated) return;
    setLoading(true);
    analyticsService
      .getTalentDashboard()
      .then(setData)
      .catch(() => setError("Failed to load talent analytics"))
      .finally(() => setLoading(false));
  }, [session?.isAuthenticated]);

  return (
    <TalentAnalyticsDashboardContext.Provider
      value={{
        data,
        loading,
        error,
      }}
    >
      {children}
    </TalentAnalyticsDashboardContext.Provider>
  );
}

export function useTalentAnalyticsDashboardContext() {
  const ctx = useContext(TalentAnalyticsDashboardContext);
  if (!ctx)
    throw new Error(
      "useTalentAnalyticsDashboardContext must be used within TalentAnalyticsDashboardProvider",
    );
  return ctx;
}
