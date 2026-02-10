"use client";

import React, { useEffect, useState } from "react";
import { Zap, Trophy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companiesService } from "@/services/companies.service";
import { useAuth } from "@/context/AuthContext";

interface RecentlyViewedProps {
  loading?: boolean;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  loading = false,
}) => {
  const router = useRouter();
  const { session } = useAuth();

  const [viewsUsed, setViewsUsed] = useState(0);
  const [maxViews, setMaxViews] = useState(0);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    if (!session?.token) return;

    companiesService
      .getProfileViewsStatus(session.token)
      .then((res) => {
        setViewsUsed(res.data.viewsUsed);
        setMaxViews(res.data.maxViews);
        setPeriodEnd(res.data.periodEnd);
      })
      .catch((err) => {
        console.error("Error loading plan status", err);
      })
      .finally(() => {
        setLoadingPlan(false);
      });
  }, [session?.token]);

  const handleManagePlan = () => {
    router.push("/company/billing");
  };

  const handleCreateChallenge = () => {
    router.push("/company/challenges");
  };

  if (loading) {
    return (
      <Card className="max-w-md h-fit">
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-9 animate-pulse rounded bg-muted" />
              </div>

              <div className="space-y-3">
                <div className="h-3 w-44 animate-pulse rounded bg-muted" />
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>

              <div className="mt-5 h-9 w-full animate-pulse rounded bg-muted" />
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-9 animate-pulse rounded bg-muted" />
              </div>

              <div className="space-y-3 mb-5">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-9 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const remaining = Math.max(maxViews - viewsUsed, 0);
  const percentage =
    maxViews > 0 ? Math.min(Math.round((viewsUsed / maxViews) * 100), 100) : 0;

  return (
    <Card className="max-w-md h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Accesos directos</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">
                  Plan Activo de la Compañía
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  {loadingPlan || !periodEnd
                    ? "Cargando plan..."
                    : `Renovación: ${new Date(periodEnd).toLocaleDateString(
                        "es-CR",
                        {
                          timeZone: "America/Costa_Rica",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}`}
                </p>
              </div>

              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap size={24} className="text-blue-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Perfiles restantes
                </span>
                <span className="font-semibold text-slate-900">
                  {loadingPlan ? "--" : `${remaining}/${maxViews}`}
                </span>
              </div>

              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleManagePlan}
              className="mt-5 w-full rounded-lg border border-blue-200 bg-white py-2.5 text-sm font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 cursor-pointer"
            >
              Gestionar Plan
            </button>
          </div>

          <div className="flex-1 bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">
                  Crear Desafíos para Cazar Talentos
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Atrae talento de alto potencial con retos específicos
                </p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Trophy size={24} className="text-emerald-600" />
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-700">
                  Evalúa habilidades técnicas en escenarios reales
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-700">
                  Identifica a los mejores candidatos mediante competencias
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-700">
                  Reduce tiempo de contratación hasta un 40%
                </span>
              </div>
            </div>

            <button
              onClick={handleCreateChallenge}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Crear Desafío Personalizado
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
