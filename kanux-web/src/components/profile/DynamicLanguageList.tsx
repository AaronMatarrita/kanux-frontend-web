import { Plus, Trash2, Save } from "lucide-react";
import { Select } from "./Select";
import { Language, CreateLanguageRequest } from "@/services/profiles.service";
import React from "react";

const LANGUAGE_LEVELS = [
  { id: "Basic", label: "Básico" },
  { id: "Intermediate", label: "Intermedio" },
  { id: "Advanced", label: "Avanzado" }
];

export function DynamicLanguageList({languages,availableLanguages,onChange,onAdd,onDelete,label = "Languages"}: {
  languages: Language[];
  availableLanguages: Array<{ id: string; name: string }>;
  onChange: (languages: Language[]) => void;
  onAdd: (language: CreateLanguageRequest) => Promise<Language>;
  onDelete: (id: string) => Promise<void>;
  label?: string;
}) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const [localLanguages, setLocalLanguages] = React.useState<Language[]>(languages);
  const [pendingChanges, setPendingChanges] = React.useState(false);

  // update local languages
  React.useEffect(() => {
    setLocalLanguages(languages);
    setPendingChanges(false);
  }, [languages]);

  const addLanguageLocal = () => {
    // create language local
    const tempLanguage: Language = {
      id: `temp-${Date.now()}`,
      id_languages: availableLanguages[0]?.id || "",
      level: "Básico",
      _isNew: true
    } as any;

    setLocalLanguages([...localLanguages, tempLanguage]);
    setPendingChanges(true);
  };

  const removeLanguageLocal = (id: string) => {
    setLocalLanguages(localLanguages.filter(lang => lang.id !== id));
    setPendingChanges(true);
  };

  const updateLanguageLocal = (id: string, field: "id_languages" | "level", value: string) => {
    setLocalLanguages(
      localLanguages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
    setPendingChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading("saving");

      // indentify language to delete
      const languagesToDelete = languages.filter(
        original => !localLanguages.find(local => local.id === original.id)
      );

      // identify new languages.
      const newLanguages = localLanguages.filter(lang => 
        (lang as any)._isNew || lang.id.startsWith('temp-')
      );

      //delete new languages
      for (const lang of languagesToDelete) {
        await onDelete(lang.id);
      }

      //create new languages
      const createdLanguages: Language[] = [];
      for (const lang of newLanguages) {
        const data: CreateLanguageRequest = {
          language_id: lang.id_languages || "",
          level: lang.level
        };
        const created = await onAdd(data);
        createdLanguages.push(created);
      }

      //update local
      let updatedLanguages = localLanguages.filter(lang => 
        !(lang as any)._isNew && !lang.id.startsWith('temp-')
      );
      updatedLanguages = [...updatedLanguages, ...createdLanguages];
      onChange(updatedLanguages);
      setPendingChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleCancelChanges = () => {
    setLocalLanguages(languages);
    setPendingChanges(false);
  };

  const selectedLanguageIds = localLanguages.map(l => l.id_languages).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
          {pendingChanges && (
            <>
              <button
                type="button"
                onClick={handleCancelChanges}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isLoading === "saving"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isLoading === "saving" ? "Saving..." : "Save"}
              </button>
            </>
          )}
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
          <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
            No languages have been added. Click "Add Language" to begin.
          </p>
        ) : (
          localLanguages.map((language) => {
            const availableOptions = availableLanguages.filter(
              lang => !selectedLanguageIds.includes(lang.id) || lang.id === language.id_languages
            );

            const isTemp = (language as any)._isNew || language.id.startsWith('temp-');

            return (
              <div key={language.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Select Language */}
                  <Select
                    name={`language-${language.id}`}
                    value={language.id_languages || ""}
                    onChange={(e) => updateLanguageLocal(language.id, "id_languages", e.target.value)}
                    options={availableOptions.map(lang => ({
                      id: lang.id,
                      label: lang.name
                    }))}
                    placeholder="Select language"
                  />

                  {/* Select Level */}
                  <Select
                    name={`level-${language.id}`}
                    value={language.level}
                    onChange={(e) => updateLanguageLocal(language.id, "level", e.target.value)}
                    options={LANGUAGE_LEVELS}
                    placeholder="Level"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeLanguageLocal(language.id)}
                  className="mt-2 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove language"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* indicator new item */}
                {isTemp && (
                  <span className="mt-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview:</h4>
          <div className="flex flex-wrap gap-2">
            {localLanguages
              .filter(l => l.id_languages)
              .map((language) => {
                const langName = availableLanguages.find(l => l.id === language.id_languages)?.name;
                const isTemp = (language as any)._isNew || language.id.startsWith('temp-');
                return (
                  <span 
                    key={language.id}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      isTemp 
                        ? 'bg-orange-50 border-orange-300' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{langName}</span>
                    <span className="text-gray-500 ml-2">({language.level})</span>
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* pendents*/}
      {pendingChanges && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}
    </div>
  );
}