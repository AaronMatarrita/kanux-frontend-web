"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { challengesService } from "@/services/challenges.service";
import { useRouter } from "next/navigation";
import { useSubmissionStore } from "@/store/submission.store";

export interface SubmitResult {
  submission_id: string;
  status: string;
  score: number;
}

interface UseSubmitChallengeOptions {
  onSuccess?: (result: SubmitResult) => void;
  onError?: (error: string) => void;
}

export function useSubmitChallenge(options?: UseSubmitChallengeOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { clearSubmission } = useSubmissionStore();

  const submit = useCallback(
    async (
      submissionId: string,
      sourceCode: string,
      programmingLanguage: string,
    ): Promise<SubmitResult | null> => {
      if (!submissionId || !sourceCode || !programmingLanguage) {
        const errorMsg = "Datos incompletos para enviar la solución";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        toast.error(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await challengesService.submitTechnicalChallenge(
          submissionId,
          {
            source_code: sourceCode,
            programming_language: programmingLanguage,
          },
        );

        const result: SubmitResult = {
          submission_id: response.submission_id,
          status: response.status,
          score: (response as any).score || 0,
        };

        toast.success("Solución enviada correctamente");
        options?.onSuccess?.(result);

        // Clear submission from localStorage after successful submit
        clearSubmission();

        return result;
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

        setError(errorMsg);
        options?.onError?.(errorMsg);
        toast.error(errorMsg);
        console.error("Submit error:", err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [options],
  );

  return {
    submit,
    loading,
    error,
  };
}
