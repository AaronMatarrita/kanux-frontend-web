"use client";

import { CheckCircle } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";
import { CompletedChallengeCard } from "./CompletedChallengeCard";

export interface CompletedChallenge {
  submission_id: string;
  challenge: {
    id: string;
    title: string;
    type: string;
    difficulty: string;
  };
  score: number;
  status: string;
  submitted_at: string;
}

interface CompletedTabProps {
  challenges: CompletedChallenge[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function CompletedTab({
  challenges,
  loading,
  error,
  onRetry,
}: CompletedTabProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                <div className="h-3 w-56 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={onRetry} />;
  }

  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">
          No tienes desafíos completados
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Los desafíos que completes aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((submission) => (
        <CompletedChallengeCard
          key={submission.submission_id}
          submission={submission}
        />
      ))}
    </div>
  );
}
