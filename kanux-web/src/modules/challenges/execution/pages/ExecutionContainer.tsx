"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExecutionTopbar } from "@/modules/challenges/execution/components/ExecutionTopbar";
import { ChallengeDescriptionPanel } from "@/modules/challenges/execution/components/ChallengeDescriptionPanel";
import { TestCasesPanel } from "@/modules/challenges/execution/components/TestCasesPanel";
import { EditorWorkspace } from "@/modules/challenges/execution/components/EditorWorkspace";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LoadingOverlay } from "@/components";
import { challengesService } from "@/services/challenges.service";
import { SubmissionEntry, useSubmissionStore } from "@/store/submission.store";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface ExecutionContainerProps {
  challenge?: {
    id?: string;
    title?: string;
    difficulty?: string;
    duration_minutes?: number;
  };
  assets?: any;
  loading?: boolean;
  submission?: SubmissionEntry | null;
  onExpired?: () => void;
}

export function ExecutionContainer({
  challenge,
  assets,
  loading = false,
  submission,
  onExpired,
}: ExecutionContainerProps) {
  const router = useRouter();
  const { clearSubmission } = useSubmissionStore();
  const challengeAssets = (assets as any)?.challenge;
  const testCases = (assets as any)?.test_cases?.test_cases || [];
  const initialCode =
    challengeAssets?.initial_code || "// Tu implementación aquí...";
  const programmingLanguage =
    challengeAssets?.programming_language || "javascript";
  const persistenceKey = submission?.submissionId
    ? `challenge:${challenge?.id}:submission:${submission.submissionId}`
    : undefined;

  const [executionState, setExecutionState] = useState<{
    running: boolean;
    output?: string;
    error?: string;
    results?: Array<{
      id: string | number;
      description?: string;
      pass: boolean;
      expected: unknown;
      output: unknown;
      durationMs: number;
      error?: string;
    }>;
  }>({ running: false, output: "", error: "", results: [] });

  const [expired, setExpired] = useState(false);
  const [timeLabel, setTimeLabel] = useState("--:--");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [currentLanguage, setCurrentLanguage] = useState(programmingLanguage);
  const warned5 = useRef(false);
  const warned1 = useRef(false);

  useEffect(() => {
    const expiresAt = submission?.expiresAt;

    warned5.current = false;
    warned1.current = false;

    if (!expiresAt) {
      setTimeLabel("00:00");
      setExpired(true);
      return;
    }

    const updateCountdown = () => {
      const remainingMs = new Date(expiresAt).getTime() - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      const minutes = Math.floor(remainingSec / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (remainingSec % 60).toString().padStart(2, "0");

      setTimeLabel(`${minutes}:${seconds}`);

      if (remainingSec === 0) {
        setExpired(true);
        if (!warned1.current) {
          toast.error("Se acabó el tiempo del desafío. La edición se bloqueó.");
          warned1.current = true;
        }
        onExpired?.();
        return true;
      }

      if (remainingSec <= 60 && !warned1.current) {
        warned1.current = true;
        toast.warning("Último minuto: el desafío está por terminar.");
      } else if (remainingSec <= 300 && !warned5.current) {
        warned5.current = true;
        toast.info("Quedan 5 minutos para completar el desafío.");
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
  }, [submission, onExpired]);

  const handleSubmitClick = () => {
    if (expired) {
      toast.error("El tiempo del desafío ha terminado");
      return;
    }

    if (!submission?.submissionId) {
      toast.error("Submission no inicializada");
      return;
    }

    if (!currentCode || currentCode.trim().length === 0) {
      toast.error("El código no puede estar vacío");
      return;
    }

    setSubmitModalOpen(true);
  };

  const handleSubmitConfirm = async () => {
    if (!submission?.submissionId || !challenge?.id) {
      toast.error("Datos incompletos para enviar");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await challengesService.submitTechnicalChallenge(
        submission.submissionId,
        {
          source_code: currentCode,
          programming_language: currentLanguage,
        },
      );

      if (!response?.submission_id) {
        throw new Error("La respuesta del servidor no incluye submission_id");
      }

      setSubmitModalOpen(false);

      const resultData = {
        submission_id: response.submission_id,
        status: response.status,
        score: (response as any).score || 0,
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
      }

      toast.success("Solución enviada correctamente. Redirigiendo...");

      const resultsUrl = `/talent/challenges/results?submissionId=${response.submission_id}`;

      try {
        await router.push(resultsUrl);

        setTimeout(() => {
          clearSubmission();
        }, 500);
      } catch (routerError) {
        console.warn("Router push failed, using fallback:", routerError);

        setTimeout(() => {
          clearSubmission();
          window.location.assign(resultsUrl);
        }, 300);
      }
    } catch (err: any) {
      let errorMsg = "Error al enviar la solución";

      if (err?.response?.status === 404) {
        errorMsg = "La submission no existe o fue expirada";
      } else if (err?.response?.status === 403) {
        errorMsg = "No tienes permisos para esta submission";
      } else if (err?.response?.status === 400) {
        errorMsg =
          err?.response?.data?.message ||
          "La submission no está activa o ha expirado";
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    router.push("/talent/challenges");
  };

  const mergedTestCases = testCases.map((tc: any) => {
    const match = executionState.results?.find(
      (r) => String(r.id) === String(tc.id),
    );
    const status = match ? (match.pass ? "passed" : "failed") : "pending";
    return { ...tc, status };
  });

  useEffect(() => {
    if (!persistenceKey || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(`${persistenceKey}:exec`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setExecutionState((prev) => ({
          ...prev,
          output: parsed.output ?? "",
          error: parsed.error ?? "",
          results: Array.isArray(parsed.results) ? parsed.results : [],
        }));
      }
    } catch {}
  }, [persistenceKey]);

  const handleRun = async (code: string, language: any) => {
    setCurrentCode(code);
    setCurrentLanguage(language);

    if (expired) {
      toast.error("El tiempo del desafío ha terminado");
      return { error: "Tiempo expirado" };
    }

    if (!submission) {
      toast.error("Debes iniciar el desafío para ejecutar código");
      return { error: "Submission no iniciada" };
    }

    if (!challenge?.id) {
      toast.error("Falta el ID del desafío");
      return { error: "Falta el ID del desafío" };
    }
    setExecutionState((prev) => ({
      ...prev,
      running: true,
      error: "",
      output: "",
    }));
    try {
      const lang =
        typeof language === "string" && language.toLowerCase() === "typescript"
          ? "typescript"
          : "javascript";
      const res = await challengesService.executeTechnicalChallenge(
        challenge.id,
        {
          code,
          language: lang,
        },
      );

      if (res.status === "error") {
        const errorMsg =
          res.error || "La ejecución del código devolvió un error";
        setExecutionState({
          running: false,
          output: res.logs || "",
          error: errorMsg,
          results: res.results || [],
        });
        toast.error(errorMsg, {
          description: res.logs ? res.logs.split("\n")[0] : undefined,
        });
        return { output: res.logs || "", error: errorMsg };
      }

      const passedCount = (res.results || []).filter((r) => r.pass).length;
      const totalCount = res.results?.length || 0;

      const cleanOutput = res.logs
        ? res.logs.includes("{") && res.logs.includes("results")
          ? "✓ Código ejecutado correctamente. Revisa los casos de prueba."
          : res.logs
        : "✓ Código ejecutado correctamente. Revisa los casos de prueba.";
      setExecutionState({
        running: false,
        output: cleanOutput,
        error: "",
        results: res.results || [],
      });

      toast.success(
        `Ejecución completada: ${passedCount}/${totalCount} correctas`,
      );
      return { output: res.logs || "", error: "" };
    } catch (err: any) {
      let errorMsg = "La ejecución falló";
      let description = "";

      if (err?.response?.data?.data?.error) {
        errorMsg = err.response.data.data.error;
        description = err.response.data.message || "";
      } else if (err?.response?.data?.error?.originalError) {
        errorMsg = err.response.data.error.originalError;
        description = `${err.response.data.error.code} (${err.response.data.error.category})`;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      setExecutionState({
        running: false,
        output: "",
        error: errorMsg,
        results: [],
      });

      toast.error(errorMsg, { description: description || undefined });
      return { error: errorMsg };
    }
  };

  useEffect(() => {
    if (!persistenceKey || typeof window === "undefined") return;
    try {
      const payload = {
        output: executionState.output,
        error: executionState.error,
        results: executionState.results,
      };
      localStorage.setItem(`${persistenceKey}:exec`, JSON.stringify(payload));
    } catch {}
  }, [
    executionState.output,
    executionState.error,
    executionState.results,
    persistenceKey,
  ]);

  return (
    <div className="h-screen flex flex-col">
      <LoadingOverlay visible={loading} message="Cargando desafío..." />
      <ConfirmDialog
        isOpen={submitModalOpen}
        title="Confirmar envío"
        description={
          challenge?.title
            ? `¿Estás seguro de enviar tu solución para ${challenge.title}?`
            : "¿Estás seguro de enviar tu solución?"
        }
        isLoading={isSubmitting}
        confirmLabel="Enviar"
        cancelLabel="Cancelar"
        onConfirm={handleSubmitConfirm}
        onCancel={() => setSubmitModalOpen(false)}
      />
      <ExecutionTopbar
        title={challenge?.title || "Cargando..."}
        difficulty={((): "beginner" | "intermediate" | "advanced" => {
          const d = (challenge?.difficulty || "intermediate").toLowerCase();
          if (d === "básico") return "beginner";
          if (d === "avanzado") return "advanced";
          return "intermediate";
        })()}
        timeLabel={timeLabel}
        onExit={handleExit}
        onSubmit={handleSubmitClick}
        isSubmitting={isSubmitting}
        submitDisabled={loading || expired || !submission?.submissionId}
      />

      <div className="flex-1 bg-background">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
          {/* Left: Instructions / Markdown */}
          <div className="h-full bg-background border-r border-border overflow-hidden">
            <ChallengeDescriptionPanel
              headerTitle="Instrucciones"
              assets={challengeAssets}
              loading={loading}
            />
          </div>

          {/* Center: Editor / Console / Language selector */}
          <div
            className={`h-full bg-background border-r border-border overflow-hidden relative ${expired ? "pointer-events-none opacity-60" : ""}`}
          >
            <EditorWorkspace
              initialCode={initialCode}
              initialLanguage={programmingLanguage as any}
              runningExternal={executionState.running}
              outputExternal={executionState.output}
              errorExternal={executionState.error}
              onRun={handleRun}
              persistenceKey={persistenceKey}
            />
            {expired && (
              <div className="absolute inset-0 bg-background/60" aria-hidden />
            )}
          </div>

          {/* Right: Test cases / Summary */}
          <div className="h-full bg-background p-4 overflow-auto">
            <TestCasesPanel testCases={mergedTestCases} />
          </div>
        </div>
      </div>

      {expired && (
        <div className="px-4 py-3 text-sm text-destructive bg-destructive/10 border-t border-destructive/30 flex items-center gap-2">
          <span className="font-semibold">Tiempo agotado.</span>
          <span>
            La sesión se bloqueó; revisa tus resultados y reinicia el desafío si
            es necesario.
          </span>
        </div>
      )}
    </div>
  );
}
