"use client";

import { useTalentGuard } from "@/guards/useTalentGuard";
import { useState, useEffect } from "react";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2A4A] mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return children;
}
