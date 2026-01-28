import { Plus, Trash2 } from "lucide-react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Skill, Catalogs } from "@/services/profiles.service";
import React from "react";


export function DynamicSkillList({skills,catalogs,onAdd,onDelete,label = "Skills"}: {
  skills: Skill[];
  catalogs: Catalogs;
  onAdd: (category_id: string, name: string) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
  label?: string;
}) {
  
  const [newSkillName, setNewSkillName] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | number | null>(null);


  const handleAdd = async () => {
    if (!newSkillName.trim() || !selectedCatId) return;
    setIsAdding(true);
    try {
      await onAdd(selectedCatId, newSkillName);
      setNewSkillName("");
      setSelectedCatId("");
    } finally {
      setIsAdding(false);
    }
  };
  const removeSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: "category" | "name", newValue: string) => {
    onChange(
      skills.map(skill =>
        skill.id === id ? { ...skill, [field]: newValue } : skill
      )
    );
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (skill.category && skill.name) {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill.name);
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
            No hay skills agregadas. Haz clic en "Agregar Skill" para comenzar.
          </p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <Select
                  name={`skill-category-${skill.id}`}
                  value={skill.category?.id || ""}
                  onChange={(e) => updateSkill(skill.category?.id, "category", e.target.value)}
                  options={
                    catalogs.categories.map((category) => ({
                      id: category.id,
                      label: category.name,
                      disableOption: false
                    }))
                  }
                  placeholder="Categoría"
                />
                <Input
                  name={`skill-name-${skill.id}`}
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                  placeholder="Nombre de la skill"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="mt-2 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Eliminar skill"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Preview de skills agrupadas */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview:</h4>
          <div className="space-y-3">
            {Object.entries(groupedSkills).map(([category, names]) => (
              <div key={category}>
                <p className="text-xs font-medium text-gray-600 mb-1.5 capitalize">
                  {catalogs.categories.find(c => c.id === category)?.name || category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {names.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-800 text-white text-xs rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
