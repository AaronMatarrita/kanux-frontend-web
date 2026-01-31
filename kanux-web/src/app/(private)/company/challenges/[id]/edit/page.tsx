"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreateSoftChallengeForm } from "@/modules/challenges/components/SoftChallengeForm";
import { challengesService } from "@/services/challenges.service";

export default function EditChallengePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    challengesService
      .getSoftChallenge(id)
      .then(setChallenge)
      .catch(() => router.replace("/company/challenges"));
  }, [id]);

  if (!challenge) return <p>Cargando...</p>;

  const mapped = {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    duration_minutes: challenge.duration_minutes,
    details: {
      instructions: challenge.non_technical_challenges[0]?.instructions || "",
      questions: (
        challenge.non_technical_challenges[0]?.non_technical_questions || []
      ).map((q: any) => ({
        question: q.question,
        question_type: q.question_type,
        options: (q.non_technical_question_options || []).map((o: any) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
        })),
      })),
    },
  };

  return (
    <CreateSoftChallengeForm
      companyId={challenge.company.id}
      initialData={mapped}
      mode="edit"
      onSuccess={() => router.replace("/company/challenges")}
    />
  );
}
