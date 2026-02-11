import { Plus, Trash2, Save } from "lucide-react";
import { Select } from "./Select";
import { Language } from "@/services/profiles.service";

const LANGUAGE_LEVELS = [
  { id: "Básico", label: "Básico" },
  { id: "Intermedio", label: "Intermedio" },
  { id: "Avanzado", label: "Avanzado" },
];

export function DynamicLanguageList({
  languages,
  availableLanguages,
  localLanguages,
  addLanguageLocal,
  removeLanguageLocal,
  updateLanguageLocal,
  label = "Languages",
}: {
  languages: Language[];
  localLanguages: Language[];
  availableLanguages: Array<{ id: string; name: string }>;
  addLanguageLocal: () => void;
  removeLanguageLocal: (id: string) => void;
  updateLanguageLocal: (
    id: string,
    field: "id_languages" | "level",
    value: string,
  ) => void;
  label?: string;
}) {
  const selectedLanguageIds = localLanguages
    .map((l) => l.id_languages)
    .filter(Boolean);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addLanguageLocal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {localLanguages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border/60 rounded-lg">
            No languages have been added. Click "Add Language" to begin.
          </p>
        ) : (
          localLanguages.map((language) => {
            const availableOptions = availableLanguages.filter(
              (lang) =>
                !selectedLanguageIds.includes(lang.id) ||
                lang.id === language.id_languages,
            );

            const isTemp =
              (language as any)._isNew || language.id.startsWith("temp-");

            return (
              <div key={language.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Select Language */}
                  <Select
                    name={`language-${language.id}`}
                    value={language.id_languages || ""}
                    onChange={(e) =>
                      updateLanguageLocal(
                        language.id,
                        "id_languages",
                        e.target.value,
                      )
                    }
                    options={availableOptions.map((lang) => ({
                      id: lang.id,
                      label: lang.name,
                    }))}
                    placeholder="Select language"
                  />

                  {/* Select Level */}
                  <Select
                    name={`level-${language.id}`}
                    value={language.level}
                    onChange={(e) =>
                      updateLanguageLocal(language.id, "level", e.target.value)
                    }
                    options={LANGUAGE_LEVELS}
                    placeholder="Level"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeLanguageLocal(language.id)}
                  className="mt-2 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove language"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* indicator new item */}
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

      {/* Preview */}
      {localLanguages.length > 0 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Preview:
          </h4>
          <div className="flex flex-wrap gap-2">
            {localLanguages
              .filter((l) => l.id_languages)
              .map((language) => {
                const langName = availableLanguages.find(
                  (l) => l.id === language.id_languages,
                )?.name;
                const isTemp =
                  (language as any)._isNew || language.id.startsWith("temp-");
                return (
                  <span
                    key={language.id}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      isTemp
                        ? "bg-orange-50 border-orange-300 dark:bg-orange-500/15 dark:border-orange-400/50"
                        : "bg-background border-border"
                    }`}
                  >
                    <span className="font-medium">{langName}</span>
                    <span className="text-muted-foreground ml-2">
                      ({language.level})
                    </span>
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
