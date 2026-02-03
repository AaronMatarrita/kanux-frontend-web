"use client";
import { useSubscription } from "@/context/SubscriptionContext";
import { UpgradeWall } from "@/components/ui/UpgradeWall";

interface FeatureGuardProps {
  children: React.ReactNode;
  feature: string; // Example: 'can_contact_talent' or 'can_access_detailed_metrics'
}

export function FeatureGuard({ children, feature }: FeatureGuardProps) {
  const { planData, loading, userType } = useSubscription();

  if (loading) return (<div>Checking permissions...</div>);

  // Acceso dinámico según las tablas de tu BD
  const features = userType === "company" 
    ? planData?.company_plans?.company_plan_features?.[0]
    : planData?.talent_plans?.talent_plan_features?.[0];

  const hasAccess = !!features?.[feature];

  if (!hasAccess) {
    return <UpgradeWall featureName={feature} />;
  }

  return <>{children}</>;
}