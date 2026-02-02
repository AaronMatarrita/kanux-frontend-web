"use client";

import { useTalentGuard } from "@/guards/useTalentGuard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useTalentGuard();

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <LoadingSpinner size="lg" message="Verificando acceso..." />
      </div>
    );
  }

  return <>{children}</>;
}
