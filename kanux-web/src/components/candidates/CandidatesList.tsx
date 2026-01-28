"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import type { CandidateListItem } from "@/services/candidates.service";
import { candidatesService } from "@/services/candidates.service";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { CandidateProfileDetails } from "@/components/candidates/CandidateProfileDetails";

export const MOCK_CANDIDATES: CandidateListItem[] = [
  {
    talent_id: "1",
    first_name: "Sarah",
    last_name: "Martinez",
    title: "Frontend Developer",
    education: "Self-taught",
    skills: ["React", "TypeScript", "Node.js"],
    profile: {
      id: "1",
      first_name: "Sarah",
      last_name: "Martinez",
      title: "Frontend Developer",
      about: "Frontend developer apasionada por la experiencia de usuario.",
      education: "Self-taught",
      location: "San José, Costa Rica",
      experience_level: "3 años",
      email: "alex.johnson@email.com",
      contact: {
        phone: "8888-1111",
      },
      profile_completeness: 85,
      opportunity_status_id: null,
      learning_background_id: null,
      user_id: "user-1",
      created_at: new Date().toISOString(),
    },
  },
  {
    talent_id: "2",
    first_name: "James",
    last_name: "Chen",
    title: "Backend Developer",
    education: "Bootcamp",
    skills: ["Python", "Django", "PostgreSQL"],
    profile: {
      id: "2",
      first_name: "James",
      last_name: "Chen",
      title: "Backend Developer",
      about: "Backend engineer enfocado en APIs escalables.",
      education: "Bootcamp",
      location: "Heredia, Costa Rica",
      experience_level: "4 años",
      email: "alex.johnson@email.com",
      contact: {
        phone: "8888-2222",
      },
      profile_completeness: 90,
      opportunity_status_id: null,
      learning_background_id: null,
      user_id: "user-2",
      created_at: new Date().toISOString(),
    },
  },
  {
    talent_id: "3",
    first_name: "Emily",
    last_name: "Rodriguez",
    title: "Cloud Engineer",
    education: "University",
    skills: ["Vue.js", "AWS", "Docker"],
    profile: {
      id: "3",
      first_name: "Emily",
      last_name: "Rodriguez",
      title: "Cloud Engineer",
      about: "Ingeniera cloud con experiencia en AWS y contenedores.",
      education: "University",
      location: "Alajuela, Costa Rica",
      experience_level: "5 años",
      email: "alex.johnson@email.com",
      contact: {
        phone: "8888-3333",
      },
      profile_completeness: 95,
      opportunity_status_id: null,
      learning_background_id: null,
      user_id: "user-3",
      created_at: new Date().toISOString(),
    },
  },
  {
    talent_id: "4",
    first_name: "Michael",
    last_name: "Kim",
    title: "Fullstack Developer",
    education: "Self-taught",
    skills: ["Angular", "C#", ".NET"],
    profile: {
      id: "4",
      first_name: "Michael",
      last_name: "Kim",
      title: "Fullstack Developer",
      about: "Fullstack dev con enfoque en aplicaciones empresariales.",
      education: "Self-taught",
      location: "Cartago, Costa Rica",
      experience_level: "6 años",
      email: "alex.johnson@email.com",
      contact: {
        phone: "8888-4444",
      },
      profile_completeness: 88,
      opportunity_status_id: null,
      learning_background_id: null,
      user_id: "user-4",
      created_at: new Date().toISOString(),
    },
  },
  {
    talent_id: "5",
    first_name: "Alex",
    last_name: "Johnson",
    title: "Java Engineer",
    education: "University",
    skills: ["Java", "Spring Boot", "Kubernetes"],
    profile: {
      id: "5",
      first_name: "Alex",
      last_name: "Johnson",
      title: "Java Engineer",
      about: "Ingeniero Java especializado en microservicios.",
      education: "University",
      location: "Puntarenas, Costa Rica",
      email: "alex.johnson@email.com",
      experience_level: "7 años",
      contact: {
        phone: "8888-5555",
      },
      profile_completeness: 92,
      opportunity_status_id: null,
      learning_background_id: null,
      user_id: "user-5",
      created_at: new Date().toISOString(),
    },
  },
];

interface CandidatesProps {
  onViewProfile?: (candidateId: string) => void;
  onContact?: (candidateId: string) => void;
}

export const CandidatesList: React.FC<CandidatesProps> = ({ onContact }) => {
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] =
    useState<CandidateListItem[]>(MOCK_CANDIDATES);

  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All Skills");
  const [backgroundFilter, setBackgroundFilter] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateListItem | null>(null);

  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        if (!session?.token) {
          setCandidates(MOCK_CANDIDATES);
          return;
        }

        const data = await candidatesService.getCandidates(session.token);

        setCandidates(data);
      } catch (error) {
        console.error("API failed, using mock candidates", error);
        setCandidates(MOCK_CANDIDATES);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [session?.token]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const skills = await candidatesService.getSkillFilters();
        setSkillsOptions(Array.from(new Set(skills)));
      } catch {
        setSkillsOptions(
          Array.from(new Set(MOCK_CANDIDATES.flatMap((c) => c.skills))),
        );
      }
    };

    loadFilters();
  }, []);

  const uniqueBackgrounds = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.education))),
    [candidates],
  );

  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          `${c.first_name} ${c.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          c.skills.some((s: string) =>
            s.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (skillFilter !== "All Skills") {
      filtered = filtered.filter((c) => c.skills.includes(skillFilter));
    }

    if (backgroundFilter) {
      filtered = filtered.filter((c) => c.education === backgroundFilter);
    }

    return filtered;
  }, [candidates, searchTerm, skillFilter, backgroundFilter]);

  const handleViewProfile = useCallback((candidate: CandidateListItem) => {
    setSelectedCandidate(candidate);
  }, []);

  const handleContact = useCallback(
    (id: string) => onContact?.(id),
    [onContact],
  );

  const skillSelectOptions = useMemo(
    () => [
      { label: "All Skills", value: "All Skills" },
      ...skillsOptions.map((s) => ({ label: s, value: s })),
    ],
    [skillsOptions],
  );

  const backgroundSelectOptions = useMemo(
    () =>
      uniqueBackgrounds
        .filter((b): b is string => b !== null)
        .map((b) => ({
          label: b,
          value: b,
        })),
    [uniqueBackgrounds],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
        <p className="text-slate-600">Explore and evaluate talent.</p>
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            value={skillFilter}
            onChange={setSkillFilter}
            options={skillSelectOptions}
          />
          <Select
            value={backgroundFilter}
            onChange={setBackgroundFilter}
            options={backgroundSelectOptions}
            placeholder="Education"
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Candidato</th>
              <th className="px-6 py-3 text-left">Habilidades</th>
              <th className="px-6 py-3 text-left">Educacion</th>
              <th className="px-6 py-3 text-left">Título</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredCandidates.length ? (
              filteredCandidates.map((c) => (
                <tr key={c.talent_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">
                    {c.first_name} {c.last_name}
                  </td>

                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    {c.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </td>

                  <td className="px-6 py-4 text-slate-600">{c.education}</td>

                  <td className="px-6 py-4">{c.title}</td>

                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleViewProfile(c)}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleContact(c.talent_id)}>
                      <MessageSquare size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-600">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </div>
      {selectedCandidate && (
        <CandidateProfileDetails
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default CandidatesList;
