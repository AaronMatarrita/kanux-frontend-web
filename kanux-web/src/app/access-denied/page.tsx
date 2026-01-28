"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AccessDeniedPage() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    // Si no hay sesión, redirigir al login
    if (!session?.isAuthenticated) {
      router.push("/auth/login");
    }
  }, [session, router]);

  const handleGoToDashboard = () => {
    const userType = session?.user?.user_type;
    if (userType === "company") {
      router.push("/company/dashboard");
    } else if (userType === "talent") {
      router.push("/talent/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Acceso Denegado</h1>
        </div>

        <p className="mb-8 text-slate-600">
          No tienes acceso a este módulo. Por favor verifica tu tipo de cuenta.
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Ir a mi Dashboard
          </Button>

          <Button
            onClick={() => router.push("/auth/logout")}
            variant="outline"
            className="w-full"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
