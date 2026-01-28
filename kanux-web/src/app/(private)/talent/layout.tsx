"use client";

import { useTalentGuard } from "@/guards/useTalentGuard";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useTalentGuard();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state while checking auth and not yet mounted
  if (!isMounted || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Verificando acceso..." />
        </div>
      </div>
    );
  }

  return children;
}
