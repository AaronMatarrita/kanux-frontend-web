"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { challengesService } from "@/services/challenges.service";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ChallengeHero,
  ChallengeDescription,
  Constraints,
  ChallengeSummary,
  CompanyCard,
} from "@/modules/challenges/details/components";

interface TechnicalChallengeDetailProps {
  id: string;
}

interface CompanyInfo {
  name: string;
  about: string;
  logo: string | null;
}

export function TechnicalChallengeDetail({
  id,
}: TechnicalChallengeDetailProps) {
  const router = useRouter();
  const [techData, setTechData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTechnicalChallenge() {
      try {
        const res =
          await challengesService.getPublicTechnicalChallengeDetail(id);
        setTechData(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTechnicalChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500">Cargando challenge…</p>
      </div>
    );
  }

  if (error || !techData) {
    return (
      <EmptyState
        title="Challenge no encontrado"
        description="No pudimos cargar los detalles del challenge técnico. Intenta nuevamente."
      />
    );
  }

  const companyInfo: CompanyInfo = techData?.company
    ? {
        name: techData.company.name,
        about: techData.company.about,
        logo: techData.company.url_logo,
      }
    : {
        name: "KÁNUX",
        about: "Challenge oficial de la plataforma KÁNUX",
        logo: null,
      };

  return (
    <div className="space-y-6">
      {/* HERO SECTION */}
      <ChallengeHero
        challenge={techData}
        isTechnical
        id={id}
        onBack={() => router.back()}
      />

      {/* BODY */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MAIN CONTENT */}
        <div className="space-y-6 md:col-span-2">
          <ChallengeDescription description={techData?.description} />

          <Constraints
            constraints={techData?.assets?.challenge?.constraints || []}
          />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 md:sticky md:top-6 h-fit">
          <ChallengeSummary
            challenge={techData}
            isTechnical
            techData={techData}
          />

          <CompanyCard companyInfo={companyInfo} />
        </aside>
      </div>
    </div>
  );
}
