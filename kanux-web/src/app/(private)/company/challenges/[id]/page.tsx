"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  FileText,
  Clock,
  HelpCircle,
  Calendar,
  Circle,
  Info,
} from "lucide-react";
import { challengesService } from "@/services/challenges.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/error-alert";

interface SoftChallenge {
  id: string;
  title: string;
  description: string;
  type?: string;
  difficulty: string;
  duration_minutes: number;
  created_at: string;
  company: {
    name: string;
  };
  non_technical_challenges: {
    id: string;
    instructions: string;
    non_technical_questions: {
      id: string;
      question: string;
      question_type: string;
      non_technical_question_options: {
        id: string;
        option_text: string;
        is_correct?: boolean;
      }[];
    }[];
  }[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ChallengeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<SoftChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!challengeId) return;

    const loadChallenge = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await challengesService.getSoftChallenge(challengeId);
        console.log("Challenge detail response:", response);
        const challenge: SoftChallenge = {
          id: response.id ?? "",
          title: response.title ?? "",
          description: response.description ?? "",
          type: "Desafío de habilidades blandas",
          difficulty: response.difficulty ?? "",
          duration_minutes: response.duration_minutes ?? 0,
          created_at: response.created_at ?? "",
          company: {
            name: response.company?.name ?? "",
          },
          non_technical_challenges: (
            response.non_technical_challenges ?? []
          ).map((ntc: any) => ({
            id: ntc.id ?? "",
            instructions: ntc.instructions ?? "",
            non_technical_questions: (ntc.non_technical_questions ?? []).map(
              (q: any) => ({
                id: q.id ?? "",
                question: q.question ?? "",
                question_type: q.question_type ?? "",
                non_technical_question_options: (
                  q.non_technical_question_options ?? []
                ).map((opt: any) => ({
                  id: opt.id ?? "",
                  option_text: opt.option_text ?? "",
                  is_correct: Boolean(opt.is_correct),
                })),
              }),
            ),
          })),
        };
        setChallenge(challenge);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle del desafío.");
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" message="Cargando desafío..." />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="py-8">
        <ErrorAlert
          message={error ?? "Desafío no encontrado"}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  const block = challenge.non_technical_challenges?.[0];
  const questions = block?.non_technical_questions ?? [];

  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-emerald-500 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>

        {/* Header */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {challenge.title}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building2 size={14} />
                {challenge.company?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium dark:bg-emerald-500/15 dark:text-emerald-300">
                {challenge.difficulty === "Básico"
                  ? "Principiante"
                  : challenge.difficulty}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium dark:bg-green-500/15 dark:text-green-300">
                Vista de empresa
              </span>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            {challenge.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={FileText}
              label="Tipo"
              value={challenge.type ?? ""}
            />
            <StatCard
              icon={Clock}
              label="Duración"
              value={`${challenge.duration_minutes} minutos`}
            />
            <StatCard
              icon={HelpCircle}
              label="Preguntas"
              value={`${questions.length} preguntas`}
            />
            <StatCard
              icon={Calendar}
              label="Creado"
              value={formatDate(challenge.created_at)}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <HelpCircle size={20} />
            Preguntas del desafío
          </h2>

          <div className="bg-muted/40 border border-border rounded-lg p-4 mb-6 flex gap-2">
            <Info size={16} className="text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Instrucciones:{" "}
              <span className="text-foreground">
                {block?.instructions ?? "Sin instrucciones"}
              </span>
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((q, i) => (
              <div key={q.id}>
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold dark:bg-emerald-500/15 dark:text-emerald-300">
                    {i + 1}
                  </span>
                  <h3 className="font-medium text-foreground">{q.question}</h3>
                </div>

                <p className="ml-10 text-xs text-muted-foreground/70 mt-1">
                  Tipo de respuesta: Selección única
                </p>

                <div className="ml-10 mt-3 space-y-2">
                  {q.non_technical_question_options.map((opt) => {
                    const isCorrect = opt.is_correct;

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/40"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <Circle
                          size={16}
                          className={
                            isCorrect
                              ? "text-emerald-500"
                              : "text-muted-foreground/50"
                          }
                          fill={isCorrect ? "#10b981" : "none"}
                        />

                        <span
                          className={`text-sm ${
                            isCorrect
                              ? "text-emerald-700 font-semibold"
                              : "text-foreground"
                          }`}
                        >
                          {opt.option_text}
                        </span>

                        {isCorrect && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium dark:bg-emerald-500/15 dark:text-emerald-300">
                            Correcta
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Creado el {formatDate(challenge.created_at)}
        </p>
      </div>
    </div>
  );
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/40">
      <Icon size={18} className="text-muted-foreground" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);
