import React from "react";

interface LanguageInputProps {
  languages: string[];
  error?: string;
  languageInput: string;
  onLanguageInputChange: (value: string) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (index: number) => void;
}

export function LanguageInput({
  languages,
  error,
  languageInput,
  onLanguageInputChange,
  onAddLanguage,
  onRemoveLanguage,
}: LanguageInputProps) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm text-foreground font-medium mb-2">
        Languages
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={languageInput}
          onChange={(e) => onLanguageInputChange(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && (e.preventDefault(), onAddLanguage())
          }
          placeholder="Add a language"
          className={`flex-1 px-4 py-3 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-background ${
            error
              ? "border-red-500 bg-red-500/10 focus:ring-red-500/20 focus:border-red-500"
              : "border-border"
          }`}
        />
        <button
          type="button"
          onClick={onAddLanguage}
          className="px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Language Tags */}
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm"
          >
            {lang}
            <button
              type="button"
              onClick={() => onRemoveLanguage(index)}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
