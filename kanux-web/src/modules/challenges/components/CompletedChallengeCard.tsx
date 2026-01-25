"use client";

import { CheckCircle } from "lucide-react";
import { CompletedChallenge } from "./CompletedTab";

interface CompletedChallengeCardProps {
  submission: CompletedChallenge;
}

export function CompletedChallengeCard({
  submission,
}: CompletedChallengeCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4 flex-1">
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {submission.challenge.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Difficulty:{" "}
            <span className="font-medium text-slate-700">
              {submission.challenge.difficulty}
            </span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Completed on{" "}
            {new Date(submission.submitted_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1">
          <span className="text-lg font-bold text-green-700">
            {submission.score}
          </span>
          <span className="text-sm text-green-600 ml-1">/100</span>
        </div>
      </div>
    </div>
  );
}
