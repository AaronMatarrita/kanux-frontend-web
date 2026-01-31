"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { challengesService } from "@/services/challenges.service";
import { CreateSoftChallengeDto } from "../types/challenge";
import { CreateSoftChallengeForm } from "./SoftChallengeForm";

export default function EditSoftChallengePage({
  params,
}: {
  params: { id: string; companyId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<CreateSoftChallengeDto | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        setError(null);
        const data = await challengesService.getChallengeById(
          params.companyId,
          params.id,
        );
        setChallenge(data);
      } catch (e: any) {
        setError("No se pudo cargar el challenge");
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, [params.id, params.companyId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!challenge) return <div>No encontrado</div>;

  return (
    <CreateSoftChallengeForm
      companyId={params.companyId}
      initialData={challenge}
      mode="edit"
      onSuccess={() => router.push("/company/challenges")}
    />
  );
}
