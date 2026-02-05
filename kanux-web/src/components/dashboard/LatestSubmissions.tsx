"use client";

import React from "react";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { CandidateListItem } from "@/services/candidates.service";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl text-foreground">
            Candidatos actuales
          </CardTitle>
          <CardDescription>
            Candidatos que realizaron prueba tecnica recientemente
          </CardDescription>
        </div>

        <button
          onClick={handleViewAllCandidates}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-muted cursor-pointer"
        >
          Mostrar
          <ArrowRight size={16} />
        </button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.talent_id}
              className="group relative rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
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
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {candidate.first_name} {candidate.last_name}
                      </h3>

                      {candidate.title && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Briefcase
                            size={12}
                            className="text-muted-foreground"
                          />
                          <p className="text-sm text-muted-foreground">
                            {candidate.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {candidate.education && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <GraduationCap
                        size={12}
                        className="text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {candidate.education}
                      </p>
                    </div>
                  )}

                  {candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 text-xs rounded-full border border-border/60 bg-background text-foreground/80 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
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
      </CardContent>

      <CardFooter className="border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Viendo {candidates.length} of {candidates.length} candidatos
            recientes
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
