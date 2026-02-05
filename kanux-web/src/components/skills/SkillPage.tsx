"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Tabs } from "./Tabs";
import { SkillCard } from "./SkillCard";
import { Skill, profilesService } from "@/services/profiles.service";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// interface group skill
interface GroupedSkills {
  category: string;
  skills: { name: string; progress: number }[];
}

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState("technical");
  const [loading, setLoading] = useState<boolean>(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  const getSkills = async () => {
    try {
      setLoading(true);
      const data = await profilesService.getMySkills();
      setAllSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const groupedSkillsData = useMemo(() => {
    // agroup skills by soft and technical skills
    const filtered = allSkills.filter((s) => {
      const isSoft = s.category?.name.toLowerCase().includes("soft");
      return activeTab === "soft" ? isSoft : !isSoft;
    });

    // agroup skills
    const groups: { [key: string]: GroupedSkills } = {};

    filtered.forEach((skill) => {
      const catName = skill.category?.name || "Otras";
      if (!groups[catName]) {
        groups[catName] = { category: catName, skills: [] };
      }

      // progress mapper
      const progressMap = {
        beginner: 25,
        intermediate: 50,
        advanced: 75,
        expert: 100,
      };
      //data agroup
      groups[catName].skills.push({
        name: skill.name,
        progress: progressMap[skill.level || "beginner"],
      });
    });

    return Object.values(groups);
  }, [allSkills, activeTab]);

  const tabs = [
    { id: "technical", label: "Habilidades técnicas" },
    { id: "soft", label: "Habilidades blandas" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-card p-5"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-10 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-4 md:gap-6 w-full">
        {groupedSkillsData.length > 0 ? (
          groupedSkillsData.map((group, index) => (
            <div key={`${group.category}-${index}`} className="w-full">
              <SkillCard category={group.category} skills={group.skills} />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center text-base">
            Aún no tienes habilidades registradas en esta sección. Completa tu
            perfil para verlas aquí.
          </p>
        )}
      </div>
    </div>
  );
}
