"use client";
import { useCompanyGuard } from "@/guards/useCompanyGuard";
import { ReactNode, useEffect, useState } from "react";

export default function CompanyGuardClient({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const isCompany = useCompanyGuard();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isCompany) return null;
  return <>{children}</>;
}
