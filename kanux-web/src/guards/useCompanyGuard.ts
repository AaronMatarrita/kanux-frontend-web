"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useCompanyGuard() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!session || !session.isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (session.user.userType !== "company") {
      router.push("/access-denied");
      return;
    }
  }, [session, loading, router]);

  return (
    session?.isAuthenticated && session.user.userType === "company" && !loading
  );
}
