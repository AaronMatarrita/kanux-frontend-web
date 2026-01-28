"use client";

import { Select } from "@/components/ui/select";
import { GenericHeader } from "@/components/ui/generic-header/GenericHeader";

type ChallengeType = "all" | "technical" | "soft";

interface ChallengesHeaderProps {
  challengeType: ChallengeType;
  onTypeChange: (type: ChallengeType) => void;
}

const CHALLENGE_TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "technical", label: "Desafíos de código" },
  { value: "soft", label: "Habilidades blandas" },
];

export function ChallengesHeader({
  challengeType,
  onTypeChange,
}: ChallengesHeaderProps) {
  return (
    <GenericHeader
      title="Desafíos"
      description="Practica tus habilidades, sigue tu progreso y demuestra tus capacidades."
      rightContent={
        <>
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Tipo
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
