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
    <div className="space-y-6 py-6 px-8">
      <CompanyChallengesList
        onViewDetails={handleViewDetails}
        onCreateChallenge={handleCreateChallenge}
      />
    </div>
  );
}
