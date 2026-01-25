"use client";

import { FileText } from "lucide-react";
import { ChallengeCard } from "@/components/ui/challenge-card";
import { Pagination } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  challenge_type?: string;
}

interface AllChallengesTabProps {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export function AllChallengesTab({
  challenges,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
}: AllChallengesTabProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" message="Cargando challenges..." />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={onRetry} />;
  }

  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">
          There are no challenges available.
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Come back later to see new challenges.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] transition-[grid-template-columns,gap] duration-300 ease-in-out">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            durationMinutes={challenge.duration_minutes}
            challengeType={"challenge_type" in challenge ? "technical" : "soft"}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        siblingCount={1}
        className="mt-8"
      />
    </>
  );
}
