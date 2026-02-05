"use client";

import React from "react";
import { Zap, Trophy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentlyViewed: React.FC = ({}) => {
  const router = useRouter();

  const handleManagePlan = () => {
    router.push("/company/dashboard");
  };

  const handleCreateChallenge = () => {
    router.push("/company/challenges");
  };

  return (
    <Card className="max-w-md h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Accesos directos</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">
                  Plan Activo de la Compañía
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Plan Enterprise · Renovación: 15 Dic 2024
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
                <span className="font-semibold text-slate-900">48/120</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Búsquedas activas
                </span>
                <span className="font-semibold text-slate-900">7</span>
              </div>
            </div>

            <button
              onClick={handleManagePlan}
              className="mt-5 w-full rounded-lg border border-blue-200 bg-white py-2.5 text-sm font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 cursor-pointer"
            >
              Gestionar Plan
            </button>
          </div>

          <div className="flex-1 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5">
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
