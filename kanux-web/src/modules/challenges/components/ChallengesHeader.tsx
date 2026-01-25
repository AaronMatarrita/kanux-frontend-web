"use client";

import { Select } from "@/components/ui/select";

type ChallengeType = "all" | "technical" | "soft";

interface ChallengesHeaderProps {
  challengeType: ChallengeType;
  onTypeChange: (type: ChallengeType) => void;
}

const CHALLENGE_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "technical", label: "Code challenges" },
  { value: "soft", label: "Soft Skills" },
];

export function ChallengesHeader({
  challengeType,
  onTypeChange,
}: ChallengesHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Practice your skills, track your progress and demonstrate your
          capabilities.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
          Type
        </span>
        <Select
          value={challengeType}
          onChange={(next) => onTypeChange(next as ChallengeType)}
          options={CHALLENGE_TYPE_OPTIONS}
          className="w-44"
          buttonClassName="px-3 py-2"
        />
      </div>
    </div>
  );
}
