"use client";

import { CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" message="Cargando desafíos completados..." />
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
