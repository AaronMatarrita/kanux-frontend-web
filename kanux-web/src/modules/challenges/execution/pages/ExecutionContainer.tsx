"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExecutionTopbar } from "@/modules/challenges/execution/components/ExecutionTopbar";
import { ChallengeDescriptionPanel } from "@/modules/challenges/execution/components/ChallengeDescriptionPanel";
import { TestCasesPanel } from "@/modules/challenges/execution/components/TestCasesPanel";
import { EditorWorkspace } from "@/modules/challenges/execution/components/EditorWorkspace";
import { LoadingOverlay } from "@/components";
import { challengesService } from "@/services/challenges.service";

interface ExecutionContainerProps {
  challenge?: {
    id?: string;
    title?: string;
    difficulty?: string;
    duration_minutes?: number;
  };
  assets?: any;
  loading?: boolean;
}

export function ExecutionContainer({
  challenge,
  assets,
  loading = false,
}: ExecutionContainerProps) {
  const challengeAssets = (assets as any)?.challenge;
  const testCases = (assets as any)?.test_cases?.test_cases || [];
  const initialCode =
    challengeAssets?.initial_code || "// Your implementation here...";
  const programmingLanguage =
    challengeAssets?.programming_language || "javascript";

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

  const mergedTestCases = testCases.map((tc: any) => {
    const match = executionState.results?.find(
      (r) => String(r.id) === String(tc.id),
    );
    const status = match ? (match.pass ? "passed" : "failed") : "pending";
    return { ...tc, status };
  });

  const handleRun = async (code: string, language: any) => {
    if (!challenge?.id) {
      toast.error("Challenge ID missing");
      return { error: "Challenge ID missing" };
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

      // Handle both ok and error statuses from runner
      if (res.status === "error") {
        const errorMsg = res.error || "Code execution returned an error";
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

      // Success: results contain test case outcomes
      const passedCount = (res.results || []).filter((r) => r.pass).length;
      const totalCount = res.results?.length || 0;
      // Clean output: show only actual logs, not raw JSON
      const cleanOutput = res.logs
        ? res.logs.includes("{") && res.logs.includes("results")
          ? "✓ Code executed successfully. Check test cases above." // Don't show raw JSON
          : res.logs // Show actual console logs
        : "✓ Code executed successfully. Check test cases above.";
      setExecutionState({
        running: false,
        output: cleanOutput,
        error: "",
        results: res.results || [],
      });

      toast.success(`Execution completed: ${passedCount}/${totalCount} passed`);
      return { output: res.logs || "", error: "" };
    } catch (err: any) {
      // Handle HTTP errors and API wrapper errors
      let errorMsg = "Execution failed";
      let description = "";

      // Check nested error structure from ms-challenges wrapper
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

  return (
    <div className="h-screen flex flex-col">
      <LoadingOverlay visible={loading} message="Loading challenge..." />
      <ExecutionTopbar
        title={challenge?.title || "Loading..."}
        difficulty={((): "beginner" | "intermediate" | "advanced" => {
          const d = (challenge?.difficulty || "intermediate").toLowerCase();
          if (d === "básico") return "beginner";
          if (d === "avanzado") return "advanced";
          return "intermediate";
        })()}
        timeLabel={`${challenge?.duration_minutes || 0} min`}
      />

      <div className="flex-1 bg-white">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
          {/* Left: Instructions / Markdown */}
          <div className="h-full bg-white border-r border-slate-200 overflow-hidden">
            <ChallengeDescriptionPanel
              headerTitle="Instructions"
              assets={challengeAssets}
              loading={loading}
            />
          </div>

          {/* Center: Editor / Console / Language selector */}
          <div className="h-full bg-white border-r border-slate-200 overflow-hidden">
            <EditorWorkspace
              initialCode={initialCode}
              initialLanguage={programmingLanguage as any}
              runningExternal={executionState.running}
              outputExternal={executionState.output}
              errorExternal={executionState.error}
              onRun={handleRun}
            />
          </div>

          {/* Right: Test cases / Summary */}
          <div className="h-full bg-white p-4 overflow-auto">
            <TestCasesPanel testCases={mergedTestCases} />
          </div>
        </div>
      </div>
    </div>
  );
}
