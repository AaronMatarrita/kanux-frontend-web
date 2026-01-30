"use client";

import { Mail, PhoneCall, X } from "lucide-react";
import type { CandidateListItem } from "@/services/candidates.service";
import { useEffect, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface CandidateProfileDetailsProps {
  candidate: CandidateListItem;
  onClose: () => void;
}

export const CandidateProfileDetails: React.FC<
  CandidateProfileDetailsProps
> = ({ candidate, onClose }) => {
  const { profile, skills, avg_score } = candidate;

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl">
        <div className="relative h-full bg-white shadow-2xl">
          <div className="h-full flex flex-col">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {profile.image_url ? (
                    <Image
                      src={profile.image_url}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {profile.first_name} {profile.last_name}
                    </h2>
                    <p className="text-slate-600">{profile.title}</p>

                    {/* Score */}
                    <div className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      {avg_score}%
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* ABOUT */}
              <Section title="Acerca de">
                <p className="text-slate-700 leading-relaxed">
                  {profile.about || "Sin descripción"}
                </p>
              </Section>

              {/* BASIC INFO */}
              <Section title="Información básica">
                <InfoGrid>
                  <InfoItem label="Educación" value={profile.education} />
                  <InfoItem
                    label="Experiencia"
                    value={profile.experience_level}
                  />
                  <InfoItem label="Ubicación" value={profile.location} />
                  <InfoItem
                    label="Perfil completado"
                    value={`${profile.profile_completeness}%`}
                  />
                </InfoGrid>
              </Section>

              {/* SKILLS */}
              <Section title="Habilidades">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </Section>

              {/* CONTACT */}
              <Section title="Contacto">
                <div className="space-y-3">
                  <ContactItem label="Correo" value={profile.email} icon={Mail} />
                  <ContactItem
                    label="Teléfono"
                    value={profile.contact?.phone}
                    icon={PhoneCall}
                  />
                  <ContactItem
                    label="Pagina web"
                    value={profile.contact?.website}
                    icon={X}
                  />
                </div>
              </Section>

              {/* META */}
              <Section title="Información adicional">
                <InfoGrid>
                  <InfoItem
                    label="Creado el"
                    value={new Date(profile.created_at).toLocaleDateString()}
                  />
                </InfoGrid>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* -------------------- Helpers -------------------- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 bg-blue-600 rounded-full" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    {children}
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
  <div className="bg-slate-50 p-4 rounded-lg">
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-slate-800 font-medium">{value ?? "N/A"}</p>
  </div>
);

interface ContactItemProps {
  label: string;
  value?: string | null;
  icon: LucideIcon; // recibimos el componente del icono
}

export const ContactItem: React.FC<ContactItemProps> = ({
  label,
  value,
  icon: Icon, // renombramos para usarlo como componente
}) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
    <div className="p-2 bg-white rounded-lg shadow-sm">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-slate-800 font-medium">{value ?? "N/A"}</p>
    </div>
  </div>
);
