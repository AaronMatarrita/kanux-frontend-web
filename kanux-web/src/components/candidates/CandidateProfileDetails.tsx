"use client";

import { X } from "lucide-react";
import type { CandidateListItem } from "@/services/candidates.service";
import { useEffect } from "react";

interface CandidateProfileDetailsProps {
  candidate: CandidateListItem;
  onClose: () => void;
}

export const CandidateProfileDetails: React.FC<
  CandidateProfileDetailsProps
> = ({ candidate, onClose }) => {
  const { profile, skills } = candidate;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300 bg-black/60"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl">
        <div className="relative h-full">
          <div className="absolute inset-y-0 right-0 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-out translate-x-0">
            <div className="h-full flex flex-col">
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {profile.first_name} {profile.last_name}
                    </h2>
                    <p className="text-slate-600 mt-1">{profile.title}</p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
                    aria-label="Close profile"
                  >
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Sección About */}
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Acerca de
                    </h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {profile.about}
                  </p>
                </section>

                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Información Básica
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Estudios
                      </p>
                      <p className="text-slate-800 font-medium">
                        {profile.education}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Nivel de experiencia
                      </p>
                      <p className="text-slate-800 font-medium">
                        {profile.experience_level}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Localización
                      </p>
                      <p className="text-slate-800 font-medium">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Habilidades
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium rounded-lg border border-blue-200 transition-transform duration-200 hover:scale-105"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Contacto
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-slate-700">📧</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Correo</p>
                        <p className="text-slate-800 font-medium">
                          {profile.email ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-slate-700">📞</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          Numero de telefono
                        </p>
                        <p className="text-slate-800 font-medium">
                          {profile.contact?.phone ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
