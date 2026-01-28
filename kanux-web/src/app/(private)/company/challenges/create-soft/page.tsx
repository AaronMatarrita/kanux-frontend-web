"use client";

import { CreateSoftChallengeForm } from "@/modules/challenges/components/SoftChallengeForm";
import { useAuth } from "@/context/AuthContext";

export default function CreateSoftChallengePage() {
  const { session } = useAuth();
  const companyId =
    session?.user.userType === "company" ? session.user.profile.id : undefined;
  if (!companyId) return null;
  return <CreateSoftChallengeForm companyId={companyId} />;
}
