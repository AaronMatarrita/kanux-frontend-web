"use client";

import { Suspense } from "react";
import { ResultsPage } from "@/modules/challenges/results";
import { LoadingSpinner } from "@/components";

function ResultsContent() {
  return <ResultsPage />;
}

export default function ChallengeResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
