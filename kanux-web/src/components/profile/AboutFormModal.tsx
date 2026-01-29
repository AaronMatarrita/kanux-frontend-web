"use client";

import { useState } from "react";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

type AboutFormData = {
  about: string;
};

export function AboutFormModal({initialData,onSubmit,onCancel}: {
  initialData?: Partial<AboutFormData>;
  onSubmit: (data: AboutFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<AboutFormData>({
    about: initialData?.about || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.about.trim()) {
      newErrors.about = "A description is required.";
    } else if (formData.about.trim().length < 50) {
      newErrors.about = "The description must be at least 50 characters long.";
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
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        label="Description"
        name="about"
        value={formData.about}
        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
        placeholder="Tell us about yourself, your experience, your interests and professional goals..."
        error={errors.about}
        required
        rows={8}
      />

      <div className="text-sm text-gray-500">
        {formData.about.length} characters (minimum 50)
      </div>

      {/*buttons*/}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
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
