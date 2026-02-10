"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { challengesService } from "@/services/challenges.service";
import { TechnicalChallengeDetail } from "./TechnicalChallengeDetail";
import { SoftChallengeDetail } from "./SoftChallengeDetail";

interface ChallengeDetailProps {
  id: string;
}

export function ChallengeDetail({ id }: ChallengeDetailProps) {
  const router = useRouter();
  const [challengeType, setChallengeType] = useState<
    "technical" | "soft" | null
  >(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    async function detectChallengeType() {
      try {
        await challengesService.getPublicTechnicalChallengeDetail(id);
        setChallengeType("technical");
      } catch {
        try {
          await challengesService.getSoftChallenge(id);
          setChallengeType("soft");
        } catch {
          router.back();
        }
      } finally {
        setIsDetecting(false);
      }
    }

    detectChallengeType();
  }, [id, router]);

  if (isDetecting) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Detectando tipo de challenge…</p>
      </div>
    );
  }

  if (challengeType === "technical") {
    return <TechnicalChallengeDetail id={id} />;
  }

  if (challengeType === "soft") {
    return <SoftChallengeDetail id={id} />;
  }

  return null;
}
