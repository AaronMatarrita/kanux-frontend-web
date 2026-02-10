"use client";

import { FileText } from "lucide-react";
import { ChallengeCard } from "@/components/ui/challenge-card";
import { Pagination } from "@/components/ui/pagination";
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
      <div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-card p-5"
            >
              <div className="space-y-3">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 h-10 w-40 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={onRetry} />;
  }

  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          No hay desafíos disponibles.
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Vuelve más tarde para ver nuevos desafíos.
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
