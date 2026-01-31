"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import type { CandidateListItem } from "@/services/candidates.service";
import {
  candidatesService,
  LearningBackground,
} from "@/services/candidates.service";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { CandidateProfileDetails } from "@/components/candidates/CandidateProfileDetails";
import { Pagination } from "@/components/ui/pagination";

/* ---------------- MOCK ---------------- */

export const MOCK_CANDIDATES: CandidateListItem[] = [
  {
    talent_id: "1",
    first_name: "Sarah",
    last_name: "Martinez",
    title: "Frontend Developer",
    education: "Self-taught",
    avg_score: 92,
    skills: [
      {
        id: "skill-react",
        name: "React",
        level: "Advanced",
        category_id: "frontend",
      },
      {
        id: "skill-ts",
        name: "TypeScript",
        level: "Intermediate",
        category_id: "frontend",
      },
    ],
    profile: {
      id: "1",
      first_name: "Sarah",
      last_name: "Martinez",
      title: "Frontend Developer",
      about: "Frontend developer apasionada por la experiencia de usuario.",
      education: "Self-taught",
      location: "San José, Costa Rica",
      experience_level: "3 años",
      email: "sarah@email.com",
      contact: { phone: "8888-1111" },
      profile_completeness: 85,
      opportunity_status_id: null,
      learning_background_id: null,
      image_url: null,
      user_id: "user-1",
      created_at: new Date().toISOString(),
    },
  },
];

/* ---------------- COMPONENT ---------------- */

interface CandidatesProps {
  onContact?: (candidateId: string) => void;
}

export const CandidatesList: React.FC<CandidatesProps> = ({ onContact }) => {
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [learningBackgrounds, setLearningBackgrounds] = useState<
    LearningBackground[]
  >([]);

  const [skillFilter, setSkillFilter] = useState<string>("All Skills");
  const [backgroundFilter, setBackgroundFilter] = useState<string | undefined>(
    undefined,
  );

  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateListItem | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);

      try {
        if (!session?.token) {
          setCandidates(MOCK_CANDIDATES);
          setTotalItems(MOCK_CANDIDATES.length);
          setTotalPages(1);
          return;
        }

        const result = await candidatesService.getCandidates(
          session.token,
          page,
          pageSize,
        );

        setCandidates(result.candidates);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.error("API failed, using mock candidates", error);
        setCandidates(MOCK_CANDIDATES);
        setTotalItems(MOCK_CANDIDATES.length);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [session?.token, page, pageSize]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        if (!session?.token) {
          const mockSkills = Array.from(
            new Set(
              MOCK_CANDIDATES.flatMap((c) => c.skills.map((s) => s.name)),
            ),
          );
          setSkillsOptions(mockSkills);
          return;
        }

        const skills = await candidatesService.getSkillFilters();
        setSkillsOptions(skills);
      } catch (error) {
        console.error("Failed to load skill filters", error);
        setSkillsOptions([]);
      }
    };

    loadSkills();
  }, [session?.token]);

  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);

      try {
        if (!session?.token) {
          setCandidates(MOCK_CANDIDATES);
          setTotalItems(MOCK_CANDIDATES.length);
          setTotalPages(1);
          return;
        }

        console.log("que envio",backgroundFilter)
        const result = await candidatesService.getCandidatesFiltered(
          session.token,
          {
            searchText: searchTerm || undefined,
            skill: skillFilter !== "All Skills" ? skillFilter : undefined,
            learningBackgroundId: backgroundFilter || undefined,
          },
          page,
          pageSize,
        );

        setCandidates(result.candidates);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.error("API failed, using mock candidates", error);
        setCandidates(MOCK_CANDIDATES);
        setTotalItems(MOCK_CANDIDATES.length);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [
    session?.token,
    page,
    pageSize,
    searchTerm,
    skillFilter,
    backgroundFilter,
  ]);

  useEffect(() => {
    const loadLearningBackgrounds = async () => {
      try {
        if (!session?.token) {
          return;
        }

        const data = await candidatesService.getLearningBackgrounds(
          session.token,
        );
        setLearningBackgrounds(data);
      } catch (error) {
        console.error("Failed to load learning backgrounds", error);
        setLearningBackgrounds([]);
      }
    };

    loadLearningBackgrounds();
  }, [session?.token]);

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
  () => [
    { label: "All", value: "" }, 
    ...learningBackgrounds.map((b) => ({
      label: b.name,
      value: b.id,
    })),
  ],
  [learningBackgrounds],
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchInput || undefined);
                setPage(1);
              }
            }}
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
            value={backgroundFilter ?? ""}
            onChange={(value) => setBackgroundFilter(value || undefined)}
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
              <th className="px-6 py-3 text-left">Educación</th>
              <th className="px-6 py-3 text-left">Título</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {candidates.length ? (
              candidates.map((c) => (
                <tr key={c.talent_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">
                    {c.first_name} {c.last_name}
                  </td>

                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    {c.skills.map((skill) => (
                      <span
                        key={`${c.talent_id}-${skill.id}`}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {skill.name}
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {candidates.length} of {totalItems} candidates
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            if (newPage !== page) {
              setPage(newPage);
            }
          }}
        />
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
