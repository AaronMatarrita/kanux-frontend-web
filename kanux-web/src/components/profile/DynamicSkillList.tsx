import { Plus, Trash2 } from "lucide-react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Skill } from "@/services/profiles.service";

const SKILL_LEVELS = [
  { id: "beginner", label: "Principiante" },
  { id: "intermediate", label: "Intermedio" },
  { id: "advanced", label: "Avanzado" },
  { id: "expert", label: "Experto" },
];

export function DynamicSkillList({
  skills,
  availableCategories,
  localSkills,
  addSkillLocal,
  removeSkillLocal,
  updateSkillLocal,
  label = "Skills",
}: {
  skills: Skill[];
  availableCategories: Array<{ id: string; name: string }>;
  localSkills: Skill[];
  addSkillLocal: () => void;
  removeSkillLocal: (id: string) => void;
  updateSkillLocal: (
    id: string,
    field: "id_category" | "name" | "level",
    value: string,
  ) => void;
  label?: string;
}) {
  const groupedSkills = localSkills.reduce(
    (acc, skill) => {
      if (!skill.id_category || !skill.name) return acc;

      if (!acc[skill.id_category]) {
        acc[skill.id_category] = [];
      }

      acc[skill.id_category].push(skill.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addSkillLocal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {localSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border/60 rounded-lg">
            No skills have been added. Click "Add Skill" to begin.
          </p>
        ) : (
          localSkills.map((skill: any) => {
            const isTemp =
              (skill as any)._isNew || skill.id.startsWith("temp-");
            return (
              <div key={skill.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Select
                    name={`skill-category-${skill.id}`}
                    value={skill.id_category}
                    onChange={(e) =>
                      updateSkillLocal(
                        skill.id || "",
                        "id_category",
                        e.target.value,
                      )
                    }
                    options={availableCategories.map((category: any) => ({
                      id: category.id,
                      label: category.name,
                      disableOption: false,
                    }))}
                    placeholder="Category"
                  />
                  <Input
                    name={`skill-name-${skill.id}`}
                    value={skill.name}
                    onChange={(e) =>
                      updateSkillLocal(skill.id, "name", e.target.value)
                    }
                    placeholder="Skill name"
                  />
                  <Select
                    name={`skill-level-${skill.id}`}
                    value={skill.level}
                    onChange={(e) =>
                      updateSkillLocal(skill.id || "", "level", e.target.value)
                    }
                    options={SKILL_LEVELS}
                    placeholder="Level"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkillLocal(skill.id)}
                  className="mt-2 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete skill"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {isTemp && (
                  <span className="mt-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200 rounded">
                    New
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Preview de skills agrupadas */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Preview:
          </h4>

          <div className="space-y-3">
            {Object.entries(groupedSkills).map(([categoryId, names]) => (
              <div key={categoryId}>
                <p className="text-xs font-medium text-muted-foreground mb-1.5 capitalize">
                  {availableCategories.find((c) => c.id === categoryId)?.name ||
                    "Uncategorized"}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {names.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-foreground text-background text-xs rounded-full"
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
