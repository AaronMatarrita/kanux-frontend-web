"use client";

import { CompanyChallengesList } from "@/components/challenges";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleViewDetails = (challengeId: string) => {
    router.push(`/company/challenges/${challengeId}`);
  };

  const handleCreateChallenge = () => {
    router.push("/company/challenges/create-soft");
  };

  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="space-y-6">
        <CompanyChallengesList
          onViewDetails={handleViewDetails}
          onCreateChallenge={handleCreateChallenge}
        />
      </div>
    </div>
  );
}
