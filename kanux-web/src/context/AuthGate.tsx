"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const PUBLIC_ROUTES = [
    "/landing",
    "/",
    "/auth/login",
    "/onboarding/account-selection",
    "/onboarding/register-talent",
    "/onboarding/register-talent/about",
    "/onboarding/register-company",
    "/onboarding/register-company/about",
  ];

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!session && !isPublicRoute) {
      router.replace("/auth/login");
      return;
    }

    if (session && isPublicRoute) {
      router.replace(
        session.user.userType === "talent"
          ? "/talent/dashboard"
          : "/company/dashboard"
      );
    }
  }, [session, loading, isPublicRoute, router]);

  if (!isPublicRoute && (!session || loading)) {
    return null;
  }

  return <>{children}</>;
}
