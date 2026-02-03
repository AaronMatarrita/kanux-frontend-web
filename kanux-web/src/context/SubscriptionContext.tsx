"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { subscriptionsService } from "@/services/subscriptions.service";

interface SubscriptionContextType {
  planData: any | null;
  userType: "company" | "talent" | null;
  loading: boolean;
  refreshPlan: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children, userType }: { children: React.ReactNode, userType: "company" | "talent" }) {
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = userType === "company" 
        ? await subscriptionsService.getCompanySubscription() 
        : await subscriptionsService.getTalentSubscription();
      setPlanData(data);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlan(); }, [userType]);

  return (
    <SubscriptionContext.Provider value={{ planData, userType, loading, refreshPlan: fetchPlan }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
};