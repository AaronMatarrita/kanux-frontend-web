"use client";

import { useEffect, useState } from "react";
import { DynamicSkillList} from "./DynamicSkillList";
import { Button } from "./Button";
import { Catalogs, profilesService, Skill } from "@/services/profiles.service";


export function SkillsFormModal({initialData,onSubmit,onCancel}: {
  initialData?: Skill;
  onSubmit: (data: Skill) => void;
  onCancel: () => void;
}) {

  const [formData, setFormData] = useState<Skill>(initialData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);


  useEffect(() => {
    async function getCatalogs() {
      try {
        setIsLoadingCatalogs(true);
        const response = await profilesService.getCatalogs();
        setCatalogs(response);
      } catch (error) {
        console.error("Error al obtener catálogos:", error);
      } finally {
        setIsLoadingCatalogs(false);
      }
    }
    getCatalogs();
  }, []);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.skills.length === 0) {
      newErrors.skills = "Debes agregar al menos una skill";
    }

    const invalidSkills = formData.skills.some(
      skill => !skill.category || !skill.name.trim()
    );
    if (invalidSkills) {
      newErrors.skills = "Todas las skills deben tener categoría y nombre";
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
      // aqui guardar o eliminar los skills que han sido seleccionados o quitados.


      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600">
        Agrega tus habilidades técnicas organizadas por categoría.
      </div>

      <DynamicSkillList
        skills={initialData}
        onChange={(skills) => setFormData({ ...formData, skills })}
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
