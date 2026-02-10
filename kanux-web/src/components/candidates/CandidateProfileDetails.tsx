"use client";

import { Globe, Mail, PhoneCall, X } from "lucide-react";
import {
  candidatesService,
  Skill,
  CandidateListItem,
} from "@/services/candidates.service";
import { useAuth } from "@/context/AuthContext";

import { useEffect, ReactNode, useState, useRef } from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { DashboardErrorState } from "../dashboard/DashboardErrorState";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "../ui";

interface CandidateProfileDetailsProps {
  compId: string;
  talentProfileId: string;
  onClose: () => void;
}

export const CandidateProfileDetails: React.FC<
  CandidateProfileDetailsProps
> = ({ compId, talentProfileId, onClose }) => {
  const { session } = useAuth();

  const [candidate, setCandidate] = useState<CandidateListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const didFetchRef = useRef(false);

  const loadCandidate = async (isRetry = false) => {
    if (!session?.token) return;

    setError(false);
    setLimitReached(false);

    setLoading(!isRetry);
    setRetrying(isRetry);

    try {
      const res = await candidatesService.getTalentProfileSummary(
        session.token,
        compId,
        talentProfileId,
      );

      if (res.limitReached) {
        setLimitReached(true);
        return;
      }

      setCandidate(res.candidates[0] ?? null);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return;

    didFetchRef.current = true;
    loadCandidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token, compId, talentProfileId]);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetOverlay />
        <SheetContent side="right" className="w-full max-w-2xl">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
              <p className="text-slate-500">Cargando perfil…</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (limitReached) {
    return (
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetOverlay />
        <SheetContent side="right" className="w-full max-w-md">
          <div className="flex h-full flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Globe className="h-8 w-8 text-amber-600" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Límite de vistas alcanzado
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Has alcanzado el límite de visualizaciones de perfiles permitido
              por tu plan actual.
              <br />
              <span className="font-medium text-slate-800">
                Actualiza tu suscripción para continuar.
              </span>
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (error || !candidate) {
    return (
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetOverlay />
        <SheetContent side="right" className="w-full max-w-2xl">
          <div className="flex h-full items-center justify-center p-6">
            <DashboardErrorState
              title="No se pudo cargar el perfil"
              message="Ocurrió un error al cargar la información del talento."
              onRetry={() => loadCandidate(true)}
              isRetrying={retrying}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  /* -------------------- DATA -------------------- */

  const { profile, skills, avg_score } = candidate;

  const initials = `${profile.first_name?.[0] ?? ""}${
    profile.last_name?.[0] ?? ""
  }`;

  const websiteUrl = buildWebsiteUrl(profile.contact?.website);

  /* -------------------- RENDER -------------------- */

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetOverlay />
      <SheetContent side="right" className="w-full max-w-2xl">
        <div className="relative flex h-full flex-col bg-white">
          {/* HEADER */}
          <div className="relative overflow-hidden border-b border-slate-200 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-sky-50 via-white to-white" />
            <div className="relative p-6">
              <SheetHeader>
                <div className="flex items-start gap-4">
                  {profile.image_url ? (
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-linear-to-br from-sky-200 via-white to-emerald-200" />
                      <Image
                        src={profile.image_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        width={64}
                        height={64}
                        className="relative h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-sky-600 to-emerald-500 text-white flex items-center justify-center text-2xl font-semibold shadow-md">
                      {initials}
                    </div>
                  )}

                  <div>
                    <SheetTitle>
                      {profile.first_name} {profile.last_name}
                    </SheetTitle>
                    <p className="text-slate-600">
                      {profile.title || "Perfil de talento"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <BadgeLabel label="Match" value={`${avg_score}%`} />
                      <BadgeLabel
                        label="Perfil"
                        value={`${profile.profile_completeness}%`}
                        tone="sky"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full border border-transparent p-2 text-slate-600 transition hover:border-slate-200 hover:bg-white"
                >
                  <X size={20} />
                </button>
              </SheetHeader>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <HighlightCard label="Educacion" value={profile.education} />
                <HighlightCard
                  label="Experiencia"
                  value={profile.experience_level}
                />
                <HighlightCard label="Ubicacion" value={profile.location} />
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto bg-slate-50/60 p-6 space-y-6">
            <Section title="Acerca de">
              <p className="text-slate-700 leading-relaxed">
                {profile.about || "Sin descripcion"}
              </p>
            </Section>

            <Section title="Informacion del perfil">
              <InfoGrid>
                <InfoItem label="Correo" value={profile.email} />
                <InfoItem label="Telefono" value={profile.contact?.phone} />
                <InfoItem label="Pagina web" value={profile.contact?.website} />
                <InfoItem
                  label="Creado el"
                  value={new Date(profile.created_at).toLocaleDateString()}
                />
              </InfoGrid>
              <div className="mt-5">
                <ProgressBar value={profile.profile_completeness ?? 0} />
              </div>
            </Section>

            <Section title="Habilidades">
              <div className="flex flex-wrap gap-2">
                {skills.length ? (
                  skills.map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No hay habilidades registradas.
                  </p>
                )}
              </div>
            </Section>

            <Section title="Contacto directo">
              <div className="grid gap-3 md:grid-cols-2">
                <ContactItem
                  label="Correo"
                  value={profile.email}
                  href={profile.email ? `mailto:${profile.email}` : undefined}
                  icon={Mail}
                />
                <ContactItem
                  label="Telefono"
                  value={profile.contact?.phone}
                  href={
                    profile.contact?.phone
                      ? `tel:${profile.contact.phone}`
                      : undefined
                  }
                  icon={PhoneCall}
                />
                <ContactItem
                  label="Pagina web"
                  value={profile.contact?.website}
                  href={websiteUrl}
                  icon={Globe}
                />
              </div>
            </Section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded-full bg-slate-900" />
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {children}
    </div>
  </section>
);

const InfoGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="min-w-0 rounded-lg border border-slate-200/60 bg-slate-50 p-4">
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-slate-800 font-medium break-all overflow-hidden">
      {value ?? "N/A"}
    </p>
  </div>
);

interface ContactItemProps {
  label: string;
  value?: string | null;
  icon: LucideIcon;
  href?: string;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  label,
  value,
  icon: Icon,
  href,
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      {value ? (
        href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="text-slate-900 font-medium hover:text-slate-700 transition break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-900 font-medium wrap-break-words">{value}</p>
        )
      ) : (
        <p className="text-slate-400 font-medium">N/A</p>
      )}
    </div>
  </div>
);

const HighlightCard = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="min-w-0 rounded-xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-sm font-semibold text-slate-900 wrap-break-words">
      {value ?? "N/A"}
    </p>
  </div>
);

const BadgeLabel = ({
  label,
  value,
  tone = "emerald",
}: {
  label: string;
  value: string;
  tone?: "emerald" | "sky";
}) => {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}
    >
      <span className="uppercase tracking-wide text-[10px]">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
};

const ProgressBar = ({ value }: { value: number }) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Completitud del perfil</span>
        <span className="font-semibold text-slate-900">{safeValue}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-linear-to-r from-sky-500 to-emerald-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

const buildWebsiteUrl = (value?: string | null) => {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
};
