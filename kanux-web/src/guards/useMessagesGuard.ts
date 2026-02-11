"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Guard for Messages module
 * Protects against unauthenticated access
 */
export function useMessagesGuard() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!session || !session.isAuthenticated || !session.token) {
      router.push("/auth/login");
      return;
    }
  }, [session, loading, router]);

  return session?.isAuthenticated && !!session.token && !loading;
}
