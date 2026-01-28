"use client";

import React from "react";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { CandidateListItem } from "@/services/candidates.service";
import { useRouter } from "next/navigation";

interface LatestCandidatesProps {
  candidates: CandidateListItem[];
}

export const LatestSubmissions: React.FC<LatestCandidatesProps> = ({
  candidates,
}) => {
  const router = useRouter();
  const handleViewAllCandidates = () => {
    router.push("/company/candidates");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Candidatos actuales
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Candidatos que realizaron prueba tecnica recientemente
          </p>
        </div>

        <button
          onClick={handleViewAllCandidates}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Mostrar
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.talent_id}
            className="group relative p-5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-lg">
                  {candidate.first_name?.[0]}
                  {candidate.last_name?.[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {candidate.first_name} {candidate.last_name}
                    </h3>

                    {candidate.title && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Briefcase size={12} className="text-slate-400" />
                        <p className="text-sm text-slate-600">
                          {candidate.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {candidate.education && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <GraduationCap size={12} className="text-slate-400" />
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {candidate.education}
                    </p>
                  </div>
                )}

                {candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-700 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Viendo {candidates.length} of {candidates.length} candidatos
            recientes
          </span>
        </div>
      </div>
    </div>
  );
};
