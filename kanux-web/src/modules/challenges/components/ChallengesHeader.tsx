"use client";

import { Select } from "@/components/ui/select";
import { GenericHeader } from "@/components/ui/generic-header/GenericHeader";

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
    <GenericHeader
      title="Challenges"
      description="Practice your skills, track your progress and demonstrate your capabilities."
      rightContent={
        <>
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
        </>
      }
    />
  );
}
