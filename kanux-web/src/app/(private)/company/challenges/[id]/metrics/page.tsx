"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

export default function ChallengeMetricsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto py-10 px-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Volver al listado
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Métricas</h1>
      </div>
      <p className="text-slate-500 mb-8">Soft Skills Evaluation</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Total Submissions</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-slate-900">5</div>
          <div className="text-xs text-slate-400">4 completados</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Promedio de Score</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            85.8
            <span className="text-base font-medium text-slate-500">/100</span>
          </div>
          <div className="text-xs text-slate-400">Basado en 4 evaluaciones</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Última Actividad</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-900">25 ene 2026</div>
          <div className="text-xs text-slate-400">
            Fecha de última submission
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Tasa de Completado</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            80<span className="text-base font-medium text-slate-500">%</span>
          </div>
          <div className="text-xs text-slate-400">Submissions completados</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Historial de Submissions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b">
                <th className="py-3 px-3 text-left font-medium">Candidato</th>
                <th className="py-3 px-3 text-left font-medium">Score</th>
                <th className="py-3 px-3 text-left font-medium">Estado</th>
                <th className="py-3 px-3 text-left font-medium">
                  Tipo de Evaluación
                </th>
                <th className="py-3 px-3 text-left font-medium">Fecha</th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
              {/* Carlos */}
              <tr className="border-b">
                <td className="py-3 px-3">Carlos</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">85</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">Automatic</td>
                <td className="py-3 px-3 text-slate-500">25 ene 2026, 08:30</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-3">María</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">92</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">Automatic</td>
                <td className="py-3 px-3 text-slate-500">24 ene 2026, 04:15</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-3">Juan</td>
                <td className="py-3 px-3 font-semibold text-orange-500">78</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Completado
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">Automatic</td>
                <td className="py-3 px-3 text-slate-500">23 ene 2026, 10:45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
