"use client";

import { useCompanyGuard } from "@/guards/useCompanyGuard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useCompanyGuard();

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <LoadingSpinner size="lg" message="Verificando acceso..." />
      </div>
    );
  }

  return (
    <SubscriptionProvider userType="company">{children}</SubscriptionProvider>
  );
}
