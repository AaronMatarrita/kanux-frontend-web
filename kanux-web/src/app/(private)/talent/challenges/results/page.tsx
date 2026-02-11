"use client";

import { Suspense } from "react";
import { ResultsPage } from "@/modules/challenges/results";
import { LoadingSpinner } from "@/components";

function ResultsContent() {
  return <ResultsPage />;
}

export default function ChallengeResultsPage() {
  return (
    <div className="flex flex-col flex-1 p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </div>
  );
}
