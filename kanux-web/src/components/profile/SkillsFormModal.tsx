"use client";

import { useEffect, useState } from "react";
import { DynamicSkillList } from "./DynamicSkillList";
import { Button } from "./Button";
import { Catalogs, Skill } from "@/services/profiles.service";


type SkillsForm = {
  skills: Skill[];
};

export function SkillsFormModal({ initialData, catalogs, onSubmit, onCancel }: {
  initialData?: Skill[];
  catalogs: Catalogs | null;
  onSubmit: (data: Skill[]) => void;
  onCancel: () => void;
}) {

  const [localSkills, setLocalSkills] = useState<Skill[]>(initialData || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocalSkills(initialData??[]);
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (localSkills.length === 0) {
      newErrors.skills = "You must add at least one skill";
    }
    const invalidSkills = localSkills.some(
      skill => !skill.id_category || !skill.name.trim() || !skill.level
    );
    if (invalidSkills) {
      newErrors.skills = "All skills must have a category, name and a level.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // add lenguage to local
  const addSkillLocal = () => {
    const tempLanguage: Skill = {
      id: `temp-${Date.now()}`,
      id_category: catalogs?.categories[0]?.id || "",
      name: "",
      level: "beginner",
      _isNew: true
    } as any;
    setLocalSkills([...localSkills, tempLanguage]);
  };
  //remove to local
  const removeSkillLocal = (id: string) => {
    setLocalSkills(localSkills.filter(lang => lang.id !== id));
  };
  // update to local
  const updateSkillLocal = (id: string, field: "id_category" | "name" | "level", value: string) => {
    setLocalSkills(
      localSkills.map(sk =>
        sk.id === id ? { ...sk, [field]: value } : sk
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(localSkills);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600">
        Add your technical skills organized by category.
      </div>

      <DynamicSkillList
        skills={initialData || []}
        availableCategories={catalogs?.categories || []}
        localSkills={localSkills}
        addSkillLocal={addSkillLocal}
        removeSkillLocal={removeSkillLocal}
        updateSkillLocal={updateSkillLocal}
      />
      {errors.skills && (
        <p className="text-sm text-red-600 -mt-2">{errors.skills}</p>
      )}


      {/* buttons*/}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
