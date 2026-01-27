"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  challengesService,
  SoftChallenge,
} from "@/services/challenges.service";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingOverlay } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { SoftExecutionTopbar } from "../components/SoftExecutionTopbar";
import { SoftQuestionCard } from "../components/SoftQuestionCard";
import { SoftChallengeInfo } from "../components/SoftChallengeInfo";

interface SoftExecutionContainerProps {
  id: string;
}

export function SoftExecutionContainer({ id }: SoftExecutionContainerProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [challenge, setChallenge] = useState<SoftChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLabel, setTimeLabel] = useState("--:--");
  const [expired, setExpired] = useState(false);
  const warned5 = useRef(false);
  const warned1 = useRef(false);

  const timerStorageKey = `soft-challenge:${id}:expiresAt`;

  useEffect(() => {
    async function loadChallenge() {
      try {
        const data = await challengesService.getSoftChallenge(id);
        setChallenge(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [id]);

  useEffect(() => {
    if (!challenge) return;

    warned5.current = false;
    warned1.current = false;

    const durationMinutes = challenge.duration_minutes || 30;
    const now = Date.now();

    const storedExpiresAt =
      typeof window !== "undefined"
        ? Number(sessionStorage.getItem(timerStorageKey))
        : NaN;

    const expiresAt =
      Number.isFinite(storedExpiresAt) && storedExpiresAt > now
        ? storedExpiresAt
        : now + durationMinutes * 60 * 1000;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(timerStorageKey, String(expiresAt));
    }

    const updateCountdown = () => {
      const remainingMs = expiresAt - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      const minutes = Math.floor(remainingSec / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (remainingSec % 60).toString().padStart(2, "0");

      setTimeLabel(`${minutes}:${seconds}`);

      if (remainingSec === 0) {
        setExpired(true);
        if (!warned1.current) {
          toast.error(
            "Se acabó el tiempo del challenge. La edición se bloqueó.",
          );
          warned1.current = true;
        }
        return true;
      }

      if (remainingSec <= 60 && !warned1.current) {
        warned1.current = true;
        toast.warning("Último minuto: el challenge está por terminar.");
      } else if (remainingSec <= 300 && !warned5.current) {
        warned5.current = true;
        toast.info("Quedan 5 minutos para completar el challenge.");
      }

      setExpired(false);
      return false;
    };

    const stop = updateCountdown();
    const intervalId = stop
      ? undefined
      : setInterval(() => {
          const shouldStop = updateCountdown();
          if (shouldStop && intervalId) {
            clearInterval(intervalId);
          }
        }, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [challenge, timerStorageKey]);

  if (loading) {
    return <LoadingOverlay visible message="Cargando challenge..." />;
  }

  if (error || !challenge) {
    return (
      <EmptyState
        title="Challenge no encontrado"
        description="No pudimos cargar el challenge de soft skills."
      />
    );
  }

  const questions =
    challenge.non_technical_challenges?.[0]?.non_technical_questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : 0;

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (expired) {
      toast.error("El tiempo del challenge ha terminado");
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (expired) {
      toast.error("El tiempo del challenge ha terminado");
      return;
    }

    // Validate all questions are answered
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(
        `Por favor responde todas las preguntas. Faltan ${unanswered.length} pregunta(s).`,
      );
      return;
    }

    // Validate session and profile
    if (!session?.user?.profile?.id) {
      toast.error(
        "No se pudo obtener tu perfil. Por favor inicia sesión nuevamente.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        id_profile: session.user.profile.id,
        answers: Object.entries(answers).map(
          ([question_id, selected_option_id]) => ({
            question_id,
            selected_option_id,
          }),
        ),
      };

      const response = await challengesService.submitSoftChallenge(
        id,
        submissionData,
      );

      if (!response?.submission_id) {
        throw new Error("No se recibió submission_id en la respuesta");
      }

      // Store result data in localStorage for results page
      const resultData = {
        submission_id: response.submission_id,
        status: "submitted",
        score: response.score || 0,
        total_questions: response.total_questions || 0,
        correct_answers: response.correct_answers || 0,
        challenge: {
          id: challenge.id,
          title: challenge.title,
          difficulty: challenge.difficulty,
        },
        timestamp: Date.now(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `challenge:result:${response.submission_id}`,
          JSON.stringify(resultData),
        );
        sessionStorage.setItem("last_submission_id", response.submission_id);
        sessionStorage.removeItem(timerStorageKey);
      }

      toast.success("Challenge enviado exitosamente. Redirigiendo...");

      await router.push(
        `/talent/challenges/results?submissionId=${response.submission_id}`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Error al enviar el challenge. Intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(timerStorageKey);
    }
    router.push(`/talent/challenges/${id}/details`);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <SoftExecutionTopbar
        title={challenge.title}
        progress={progress}
        difficulty={((): "beginner" | "intermediate" | "advanced" => {
          const d = (challenge?.difficulty || "intermediate").toLowerCase();
          if (d === "básico") return "beginner";
          if (d === "avanzado") return "advanced";
          return "intermediate";
        })()}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeLabel={timeLabel}
        onExit={handleExit}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        expired={expired}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <SoftQuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedOptionId={answers[currentQuestion?.id]}
              onSelectOption={(optionId) =>
                handleAnswerSelect(currentQuestion.id, optionId)
              }
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-md bg-[#2EC27E] px-4 py-2 text-sm font-medium text-white hover:bg-[#28b76a]"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || expired}
                  className="rounded-md bg-[#2EC27E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#28b76a] disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Challenge"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto">
          <SoftChallengeInfo
            challenge={challenge}
            questions={questions}
            answers={answers}
            onQuestionClick={(index: number) => setCurrentQuestionIndex(index)}
            currentQuestionIndex={currentQuestionIndex}
          />
        </aside>
      </div>
    </div>
  );
}
