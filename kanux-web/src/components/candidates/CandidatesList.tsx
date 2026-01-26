"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Eye, MessageSquare } from "lucide-react";
import type { Candidate } from "@/services/candidates.service";
import { candidatesService } from "@/services/candidates.service";
import { Select } from "@/components/ui/select";

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Sarah Martinez",
    skills: ["React", "TypeScript", "Node.js"],
    background: "Self-taught",
    location: "San Francisco, CA",
    match: 94,
  },
  {
    id: "2",
    name: "James Chen",
    skills: ["Python", "Django", "PostgreSQL"],
    background: "Bootcamp",
    location: "New York, NY",
    match: 92,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    skills: ["Vue.js", "AWS", "Docker"],
    background: "University",
    location: "Austin, TX",
    match: 89,
  },
  {
    id: "4",
    name: "Michael Kim",
    skills: ["Angular", "C#", ".NET"],
    background: "Self-taught",
    location: "Seattle, WA",
    match: 87,
  },
  {
    id: "5",
    name: "Alex Johnson",
    skills: ["Java", "Spring Boot", "Kubernetes"],
    background: "University",
    location: "Boston, MA",
    match: 85,
  },
];

interface CandidatesProps {
  onViewProfile?: (candidateId: string) => void;
  onContact?: (candidateId: string) => void;
}

export const CandidatesList: React.FC<CandidatesProps> = ({
  onViewProfile,
  onContact,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("All Skills");
  const [backgroundFilter, setBackgroundFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);

  // Unique values for filters
  const uniqueBackgrounds = useMemo(
    () => Array.from(new Set(MOCK_CANDIDATES.map((c) => c.background))),
    [],
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(MOCK_CANDIDATES.map((c) => c.location))),
    [],
  );

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const skills = await candidatesService.getSkillFilters();
        const uniqueSkills = Array.from(
          new Set(
            Array.isArray(skills)
              ? skills.filter((s) => typeof s === "string")
              : [],
          ),
        );
        setSkillsOptions(uniqueSkills);
      } catch (error) {
        console.error("Error loading skills filter:", error);
        setSkillsOptions(
          Array.from(new Set(MOCK_CANDIDATES.flatMap((c) => c.skills))),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFilters();
  }, []);

  const filteredCandidates = useMemo(() => {
    let filtered = MOCK_CANDIDATES;

    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (skillFilter && skillFilter !== "All Skills") {
      filtered = filtered.filter((candidate) =>
        candidate.skills.includes(skillFilter),
      );
    }

    if (backgroundFilter) {
      filtered = filtered.filter(
        (candidate) => candidate.background === backgroundFilter,
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(
        (candidate) => candidate.location === locationFilter,
      );
    }

    return filtered;
  }, [searchTerm, skillFilter, backgroundFilter, locationFilter]);

  const handleViewProfile = useCallback(
    (candidateId: string) => {
      onViewProfile?.(candidateId);
    },
    [onViewProfile],
  );

  const handleContact = useCallback(
    (candidateId: string) => {
      onContact?.(candidateId);
    },
    [onContact],
  );

  const skillSelectOptions = useMemo(
    () => [
      { label: "All Skills", value: "All Skills" },
      ...skillsOptions.map((skill) => ({
        label: skill,
        value: skill,
      })),
    ],
    [skillsOptions],
  );

  const backgroundSelectOptions = useMemo(
    () =>
      uniqueBackgrounds.map((bg) => ({
        label: bg,
        value: bg,
      })),
    [uniqueBackgrounds],
  );

  const locationSelectOptions = useMemo(
    () =>
      uniqueLocations.map((loc) => ({
        label: loc,
        value: loc,
      })),
    [uniqueLocations],
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
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
        <p className="text-slate-600">
          Explore and evaluate talent on the platform.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skills Filter */}
          <Select
            value={skillFilter}
            onChange={setSkillFilter}
            options={skillSelectOptions}
            placeholder="All Skills"
          />

          {/* Background Filter */}
          <Select
            value={backgroundFilter}
            onChange={setBackgroundFilter}
            options={backgroundSelectOptions}
            placeholder="Experience Background"
          />

          {/* Location Filter */}
          <Select
            value={locationFilter}
            onChange={setLocationFilter}
            options={locationSelectOptions}
            placeholder="Location"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Skills
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Background
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Match
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {candidate.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {candidate.background}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {candidate.location}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${candidate.match}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {candidate.match}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(candidate.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        title="View Profile"
                      >
                        <Eye size={18} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleContact(candidate.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        title="Contact"
                      >
                        <MessageSquare size={18} className="text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-slate-600">
                    No candidates found matching your criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-600">
        Showing {filteredCandidates.length} of {MOCK_CANDIDATES.length}{" "}
        candidates
      </div>
    </div>
  );
};

export default CandidatesList;
