"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { challengesService } from "@/services/challenges.service";
import { useAuth } from "@/context/AuthContext";

const mapSubmissionData = (backendSubmissions: any[] | any) => {
  if (
    backendSubmissions &&
    typeof backendSubmissions === "object" &&
    "data" in backendSubmissions
  ) {
    const submissions = backendSubmissions.data || [];
    return submissions.map((submission: any, index: number) => ({
      ...submission,
      talent_name:
        submission.talent_name === "null" || !submission.talent_name
          ? null
          : submission.talent_name,
      submitted_at: submission.resolution_date || submission.submitted_at,
      evaluation_type: submission.evaluation_type || "-",
      submission_id: submission.submission_id || `temp-${index}-${Date.now()}`,
      score: typeof submission.score === "number" ? submission.score : null,
      status:
        submission.status === "evaluated" ? "completed" : submission.status,
    }));
  }

  if (Array.isArray(backendSubmissions)) {
    return backendSubmissions.map((submission: any, index: number) => ({
      ...submission,
      talent_name:
        submission.talent_name === "null" || !submission.talent_name
          ? null
          : submission.talent_name,
      submitted_at: submission.resolution_date || submission.submitted_at,
      evaluation_type: submission.evaluation_type || "-",
      submission_id: submission.submission_id || `temp-${index}-${Date.now()}`,
      score: typeof submission.score === "number" ? submission.score : null,
      status:
        submission.status === "evaluated" ? "completed" : submission.status,
    }));
  }

  return [];
};

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChallengeMetricsPage() {
  const router = useRouter();
  const params = useParams();
  const { session } = useAuth();
  const challengeId = params.id as string;
  const companyId =
    session?.user.userType === "company" ? session.user.profile.id : undefined;

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!challengeId || !companyId) return;
    setLoading(true);
    challengesService
      .getSubmissionsByChallenge(challengeId, companyId)
      .then((response) => {
        const mappedSubmissions = mapSubmissionData(response);
        setSubmissions(mappedSubmissions);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading metrics:", err);
        setError("Error al cargar las métricas");
      })
      .finally(() => setLoading(false));
  }, [challengeId, companyId]);

  const totalSubmissions = submissions.length;
  const completedSubmissions = submissions.filter(
    (s) => s.status === "completed" || s.status === "evaluated",
  ).length;

  const submissionsWithScore = submissions.filter(
    (s) => typeof s.score === "number",
  );
  const averageScore =
    submissionsWithScore.length > 0
      ? (
          submissionsWithScore.reduce((acc, s) => acc + (s.score ?? 0), 0) /
          submissionsWithScore.length
        ).toFixed(1)
      : "-";

  const lastActivity =
    submissions.length > 0
      ? submissions.reduce((latest, s) => {
          const currentDate = s.submitted_at || s.resolution_date;
          const latestDate = latest.submitted_at || latest.resolution_date;
          return currentDate > latestDate ? s : latest;
        }, submissions[0])
      : null;

  const lastActivityDate = lastActivity
    ? lastActivity.submitted_at || lastActivity.resolution_date
    : null;

  const completionRate =
    totalSubmissions > 0
      ? Math.round((completedSubmissions / totalSubmissions) * 100)
      : 0;

  return (
    <div className="mx-auto py-10 px-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Volver al listado
      </button>

      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Métricas</h1>
      </div>
      <p className="text-slate-500 mb-8">Soft Skills Evaluation</p>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-10">Cargando métricas...</div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Total Submissions</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {totalSubmissions}
              </div>
              <div className="text-xs text-slate-400">
                {completedSubmissions} completados
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Promedio de Score</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {averageScore}
                <span className="text-base font-medium text-slate-500">
                  /100
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Basado en {submissionsWithScore.length} evaluaciones
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Última Actividad</span>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-slate-900">
                {lastActivityDate ? formatDate(lastActivityDate) : "-"}
              </div>
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
                {completionRate}
                <span className="text-base font-medium text-slate-500">%</span>
              </div>
              <div className="text-xs text-slate-400">
                Submissions completados
              </div>
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
                    <th className="py-3 px-3 text-left font-medium">
                      Candidato
                    </th>
                    <th className="py-3 px-3 text-left font-medium">Score</th>
                    <th className="py-3 px-3 text-left font-medium">Estado</th>
                    <th className="py-3 px-3 text-left font-medium">
                      Tipo de Evaluación
                    </th>
                    <th className="py-3 px-3 text-left font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {submissions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-slate-400"
                      >
                        No hay submissions
                      </td>
                    </tr>
                  )}
                  {submissions.map((s, idx) => {
                    const displayDate = s.submitted_at || s.resolution_date;
                    return (
                      <tr className="border-b" key={s.submission_id || idx}>
                        <td className="py-3 px-3">
                          {s.talent_name && s.talent_name !== "null"
                            ? s.talent_name
                            : "-"}
                        </td>
                        <td
                          className={`py-3 px-3 font-semibold ${
                            typeof s.score === "number" && s.score >= 80
                              ? "text-emerald-600"
                              : typeof s.score === "number"
                                ? "text-orange-500"
                                : "text-slate-400"
                          }`}
                        >
                          {typeof s.score === "number" ? s.score : "-"}
                        </td>
                        <td className="py-3 px-3">
                          {s.status === "completed" ||
                          s.status === "evaluated" ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Completado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              En progreso
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {s.evaluation_type || "-"}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {displayDate ? formatDate(displayDate) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
