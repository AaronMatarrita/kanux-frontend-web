"use client";

import { useEffect, useState } from "react";
import { Select } from "./Select";
import { Button } from "./Button";
import { DynamicLanguageList } from "./DynamicLanguageList";
import { Catalogs, Language, CreateLanguageRequest } from "@/services/profiles.service";
import { profilesService } from "@/services/profiles.service";

type BasicInfoFormData = {
  experienceLevel: string;
  learningBackground: string;
  openToOpportunities: string;

};

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "expert", label: "Expert" }
];

export function BasicInfoFormModal({ initialData, initialLanguages, catalogs, onSubmit, onCancel }: {
  initialData: BasicInfoFormData,
  initialLanguages?: Language[];
  catalogs: Catalogs | null;
  onSubmit: (data: BasicInfoFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<BasicInfoFormData>({
    experienceLevel: initialData.experienceLevel || "",
    learningBackground: initialData.learningBackground || "",
    openToOpportunities: initialData.openToOpportunities || ""
  });

  const [languages, setLanguages] = useState<Language[]>(initialLanguages || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLanguages, setLocalLanguages] = useState<Language[]>(languages);

  useEffect(() => {
    setLocalLanguages(languages);
  }, [languages]);

  // add lenguage to local
  const addLanguageLocal = () => {
    const tempLanguage: Language = {
      id: `temp-${Date.now()}`,
      id_languages: catalogs?.languages[0]?.id || "",
      level: "Básico",
      _isNew: true
    } as any;
    setLocalLanguages([...localLanguages, tempLanguage]);
  };
  //remove to local
  const removeLanguageLocal = (id: string) => {
    setLocalLanguages(localLanguages.filter(lang => lang.id !== id));
  };
  // update to local
  const updateLanguageLocal = (id: string, field: "id_languages" | "level", value: string) => {
    setLocalLanguages(
      localLanguages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const handleCancelChanges = () => {
    setLocalLanguages(languages);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }

    if (localLanguages.length === 0) {
      newErrors.languages = "You must add at least one language";
    }

    // validate languages
    const invalidLanguages = localLanguages.some(
      lang => !lang.id_languages || !lang.level
    );
    if (invalidLanguages) {
      newErrors.languages = "All languages must have language and level selected";
    }

    if (!formData.learningBackground) {
      newErrors.learningBackground = "Learning background is required";
    }

    if (!formData.openToOpportunities) {
      newErrors.openToOpportunities = "Opportunity type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        experienceLevel: formData.experienceLevel,
        learningBackground: formData.learningBackground,
        openToOpportunities: formData.openToOpportunities,
        localLanguages: localLanguages
      }

      //sent data to profile page
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* experience level*/}
        <Select
          label="Experience Level"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
          options={EXPERIENCE_LEVELS}
          placeholder="Select level"
          error={errors.experienceLevel}
          required
        />

        {/* languages */}
        <DynamicLanguageList
          languages={languages}
          availableLanguages={catalogs?.languages || []}
          localLanguages={localLanguages}
          addLanguageLocal={addLanguageLocal}
          removeLanguageLocal={removeLanguageLocal}
          updateLanguageLocal={updateLanguageLocal}
        />
        {errors.languages && (
          <p className="text-sm text-red-600 -mt-2">{errors.languages}</p>
        )}

        {/* learning */}
        <Select
          label="Learning Background"
          name="learningBackground"
          value={formData.learningBackground}
          onChange={(e) => setFormData({ ...formData, learningBackground: e.target.value })}
          options={catalogs?.learning_backgrounds.map(bg => ({
            id: bg.id,
            label: bg.name
          })) || []}
          placeholder="Select background"
          error={errors.learningBackground}
          required
        />

        {/* opent to oportunities */}
        <Select
          label="Open to Opportunities"
          name="openToOpportunities"
          value={formData.openToOpportunities}
          onChange={(e) => setFormData({ ...formData, openToOpportunities: e.target.value })}
          options={catalogs?.opportunity_statuses.map(status => ({
            id: status.id,
            label: status.name
          })) || []}
          placeholder="Select type"
          error={errors.openToOpportunities}
          required
        />
      </div>

      {/* Buttons */}
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
