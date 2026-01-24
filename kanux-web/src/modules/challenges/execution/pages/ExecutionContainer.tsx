"use client";

import { ExecutionTopbar } from "@/modules/challenges/execution/components/ExecutionTopbar";
import { ChallengeDescriptionPanel } from "@/modules/challenges/execution/components/ChallengeDescriptionPanel";
import { TestCasesPanel } from "@/modules/challenges/execution/components/TestCasesPanel";
import { LoadingOverlay } from "@/components";

interface ExecutionContainerProps {
  challenge?: {
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

          {/* Center: Editor / Console / Language selector (placeholder) */}
          <div className="h-full bg-white p-4 border-r border-slate-200 overflow-auto">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Main Execution Area
              </p>
              <p className="text-xs text-slate-500">
                Workspace placeholder for editor, language selector, console.
              </p>
            </div>
          </div>

          {/* Right: Test cases / Summary */}
          <div className="h-full bg-white p-4 overflow-auto">
            <TestCasesPanel testCases={testCases} />
          </div>
        </div>
      </div>
    </div>
  );
}
