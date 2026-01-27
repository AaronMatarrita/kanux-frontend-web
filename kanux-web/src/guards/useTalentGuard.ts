"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useTalentGuard() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (loading) return;

    // No JWT/Session → redirect to login
    if (!session || !session.isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Not a talent → redirect to access denied
    if (session.user.userType !== "talent") {
      router.push("/talent/access-denied");
      return;
    }
  }, [session, loading, router]);

  // Return false while redirecting, true when authorized
  return (
    session?.isAuthenticated && session.user.userType === "talent" && !loading
  );
}
