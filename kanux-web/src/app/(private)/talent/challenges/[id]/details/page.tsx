"use client";

import { useEffect, useState } from "react";
import { ChallengeDetail } from "@/modules/challenges/details/pages/ChallengeDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengeDetailsPage({ params }: PageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }

    loadParams();
  }, [params]);

  if (!id) return null;

  return (
    <div className="flex flex-col flex-1 p-6">
      <ChallengeDetail id={id} />
    </div>
  );
}
