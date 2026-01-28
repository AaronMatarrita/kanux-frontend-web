"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  challengesService,
  SoftChallenge,
} from "@/services/challenges.service";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ChallengeHero,
  ChallengeDescription,
  SoftChallengeDetails,
  ChallengeSummary,
  CompanyCard,
} from "@/modules/challenges/details/components";

interface SoftChallengeDetailProps {
  id: string;
}

interface CompanyInfo {
  name: string;
  about: string;
  logo: string | null;
}

export function SoftChallengeDetail({ id }: SoftChallengeDetailProps) {
  const router = useRouter();
  const [softData, setSoftData] = useState<SoftChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadSoftChallenge() {
      try {
        const data = await challengesService.getSoftChallenge(id);
        setSoftData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadSoftChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" message="Cargando challenge…" />
      </div>
    );
  }

  if (error || !softData) {
    return (
      <EmptyState
        title="Challenge no encontrado"
        description="No pudimos cargar los detalles del challenge de soft skills. Intenta nuevamente."
      />
    );
  }

  const companyInfo: CompanyInfo = softData?.company
    ? {
        name: softData.company.name,
        about: softData.company.about,
        logo: softData.company.url_logo,
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
        challenge={softData}
        isTechnical={false}
        id={id}
        onBack={() => router.back()}
      />

      {/* BODY */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MAIN CONTENT */}
        <div className="space-y-6 md:col-span-2">
          <ChallengeDescription description={softData.description || ""} />

          <SoftChallengeDetails softData={softData} />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 md:sticky md:top-6 h-fit">
          <ChallengeSummary
            challenge={softData}
            isTechnical={false}
            softData={softData}
          />

          <CompanyCard companyInfo={companyInfo} />
        </aside>
      </div>
    </div>
  );
}
