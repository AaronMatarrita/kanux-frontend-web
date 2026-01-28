"use client";

import { useState } from "react";
import { Input } from "./Input";
import { ImageUpload } from "./ImageUpload";
import { DynamicContactList, Contact } from "./DynamicContactList";
import { Button } from "./Button";

type UserInfoFormData = {
  first_name: string;
  last_name: string;
  title: string;
  location: string;
  avatar?: File | null;           // ← Ahora acepta null
  removeAvatar?: boolean;         // ← Nuevo
  currentAvatarUrl?: string;
  contacts: Contact[];
};
export function UserInfoFormModal({ initialData, onSubmit, onCancel }: { initialData?: Partial<UserInfoFormData>; onSubmit: (data: UserInfoFormData) => void; onCancel: () => void; }) {
  const [formData, setFormData] = useState<UserInfoFormData>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    title: initialData?.title || "",
    location: initialData?.location || "",
    contacts: initialData?.contacts || [],
    avatar: null,
    removeAvatar: false,
    currentAvatarUrl: initialData?.currentAvatarUrl,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // image select
  const handleImageChange = (file: File | null) => {
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
        removeAvatar: false
      });
    } else if (file === null && formData.avatar) {
      setFormData({
        ...formData,
        avatar: null,
        removeAvatar: false
      });
    }
  };
  // remove image
  const handleImageRemove = () => {
    setFormData({
      ...formData,
      avatar: null,
      removeAvatar: true
    });
  };
  //validate data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.last_name.trim()) {
      newErrors.name = "El apellido es requerido";
    }

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es requerida";
    }

    const invalidContacts = formData.contacts.some(
      contact => !contact.type || !contact.value.trim()
    )

    if (invalidContacts) {
      newErrors.contacts = "Todos los contactos deben tener tipo y valor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //onsumit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        title: formData.title,
        location: formData.location,
        contacts: formData.contacts,
        image_profile: formData.avatar
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* picture */}
      <ImageUpload
        currentImage={formData.currentAvatarUrl}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
      />

      {/* name */}
      <Input
        label="Nombre Completo"
        name="name"
        value={formData.first_name}
        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        placeholder="Ej: Alex Smith"
        error={errors.name}
        required
      />
      {/* last name */}
      <Input
        label="Apellido"
        name="last_name"
        value={formData.last_name}
        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        placeholder="Ej: Smith"
        error={errors.name}
        required
      />
      {/* title */}
      <Input
        label="Título Profesional"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Ej: Junior Developer"
        error={errors.title}
        required
      />

      {/* location */}
      <Input
        label="Ubicación"
        name="location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Ej: San José, Costa Rica"
        error={errors.location}
        required
      />

      {/* contacts */}
      <DynamicContactList
        contacts={formData?.contacts || []}
        onChange={(contacts) => setFormData({ ...formData, contacts })}
      />
      {errors.contacts && (
        <p className="text-sm text-red-600 -mt-2">{errors.contacts}</p>
      )}

      {/* buttons */}
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
