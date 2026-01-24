"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type ProgrammingLanguage = "javascript" | "typescript";

interface LanguageSelectorProps {
  value: ProgrammingLanguage;
  onChange: (lang: ProgrammingLanguage) => void;
  disabled?: boolean;
}

const languages: { value: ProgrammingLanguage; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
];

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = languages.find((l) => l.value === value) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selected.label}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-20">
            {languages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => {
                  onChange(lang.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                  lang.value === value
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-700"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
