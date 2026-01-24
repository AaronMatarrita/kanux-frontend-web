"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { challengesService } from "@/services/challenges.service";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ChallengeHero,
  ChallengeDescription,
  Constraints,
  SoftChallengeDetails,
  ChallengeSummary,
  CompanyCard,
} from "@/modules/challenges/details/components";

interface DetailsContainerProps {
  id: string;
}

interface CompanyInfo {
  name: string;
  about: string;
  logo: string | null;
}

export function DetailsContainer({ id }: DetailsContainerProps) {
  const router = useRouter();
  const [isTechnical, setIsTechnical] = useState(false);
  const [techData, setTechData] = useState<any>(null);
  const [softData, setSoftData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res =
          await challengesService.getPublicTechnicalChallengeDetail(id);
        setTechData(res.data);
        setIsTechnical(true);
      } catch {
        try {
          const soft = await challengesService.getSoftChallenge(id);
          setSoftData(soft);
          setIsTechnical(false);
        } catch {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500">Cargando challenge…</p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Challenge no encontrado"
        description="No pudimos cargar los detalles del challenge. Intenta nuevamente."
      />
    );
  }

  const challenge = isTechnical ? techData : softData;

  const companyInfo: CompanyInfo = challenge?.company
    ? {
        name: challenge.company.name,
        about: challenge.company.about,
        logo: challenge.company.url_logo,
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
        challenge={challenge}
        isTechnical={isTechnical}
        id={id}
        onBack={() => router.back()}
      />

      {/* BODY */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MAIN CONTENT */}
        <div className="space-y-6 md:col-span-2">
          <ChallengeDescription description={challenge?.description} />

          {/* TECHNICAL SPECIFIC SECTIONS */}
          {isTechnical && (
            <Constraints
              constraints={techData?.assets?.challenge?.constraints || []}
            />
          )}

          {/* SOFT SKILLS SPECIFIC SECTIONS */}
          {!isTechnical && <SoftChallengeDetails softData={softData} />}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 md:sticky md:top-6 h-fit">
          <ChallengeSummary
            challenge={challenge}
            isTechnical={isTechnical}
            techData={techData}
            softData={softData}
          />

          <CompanyCard companyInfo={companyInfo} />
        </aside>
      </div>
    </div>
  );
}
