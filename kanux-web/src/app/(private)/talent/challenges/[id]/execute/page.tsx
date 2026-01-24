"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExecutionContainer } from "@/modules/challenges/execution/pages/ExecutionContainer";
import {
  challengesService,
  PublicTechnicalChallengeDetailResponse,
} from "@/services/challenges.service";

export default function Page() {
  const params = useParams();
  const challengeId = params.id as string;

  const [state, setState] = useState<{
    data?: PublicTechnicalChallengeDetailResponse;
    loading: boolean;
    error?: string;
  }>({
    loading: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res =
          await challengesService.getPublicTechnicalChallengeDetail(
            challengeId,
          );
        setState({ data: res, loading: false });
      } catch (error: any) {
        setState({ loading: false, error: "Failed to load challenge" });
      }
    };
    load();
  }, [challengeId]);

  const challenge = state.data?.data;
  const assets = state.data?.assets as any;

  return (
    <ExecutionContainer
      challenge={challenge}
      assets={assets}
      loading={state.loading}
    />
  );
}
