'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Tabs } from './Tabs';
import { SkillCard } from './SkillCard';
import { Skill, profilesService } from '@/services/profiles.service';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// interface group skill
interface GroupedSkills {
  category: string;
  skills: { name: string; progress: number }[];
}

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState('technical');
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
    const filtered = allSkills.filter(s => {
      const isSoft = s.category?.name.toLowerCase().includes('soft');
      return activeTab === 'soft' ? isSoft : !isSoft;
    });

    // agroup skills
    const groups: { [key: string]: GroupedSkills } = {};

    filtered.forEach((skill) => {
      const catName = skill.category?.name || "Other";
      if (!groups[catName]) {
        groups[catName] = { category: catName, skills: [] };
      }

      // progress mapper
      const progressMap = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
      //data agroup
      groups[catName].skills.push({
        name: skill.name,
        progress: progressMap[skill.level || 'beginner']
      });
    });

    return Object.values(groups);
  }, [allSkills, activeTab]);

  const tabs = [
    { id: 'technical', label: 'Technical Skills' },
    { id: 'soft', label: 'Soft Skills' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoadingSpinner size="md" message="Loading profile" className="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          {groupedSkillsData.length > 0 ? (
            groupedSkillsData.map((group, index) => (
              <div key={`${group.category}-${index}`} className="w-full">
                <SkillCard
                  category={group.category}
                  skills={group.skills}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-2xl">
              You don't have the skills for this section..
              Complete your profile.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
