"use client";

import { CompanyChallengesList } from "@/components/challenges";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleViewDetails = (challengeId: string) => {
    router.push(`/company/challenges/${challengeId}`);
  };

  const handleCreateChallenge = () => {
    router.push("/company/challenges/create");
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <CompanyChallengesList
        onViewDetails={handleViewDetails}
        onCreateChallenge={handleCreateChallenge}
      />
    </div>
  );
}
