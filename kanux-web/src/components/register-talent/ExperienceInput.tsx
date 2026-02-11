import React from "react";

interface ExperienceOption {
  key: string;
  label: string;
}

interface ExperienceInputProps {
  label: string;
  options: ExperienceOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  error?: string;
}

export function ExperienceInput({
  label,
  options,
  selectedKey,
  onSelect,
  error,
}: ExperienceInputProps) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm text-foreground font-medium mb-4">
        {label}
      </label>
      <div
        className={`space-y-3 p-4 rounded-lg border transition-all ${
          error ? "border-red-500 bg-red-500/10" : "border-border bg-background"
        }`}
      >
        {options.map(({ key, label: optionLabel }) => (
          <div key={key} className="flex items-center">
            <input
              type="radio"
              id={key}
              name="experience"
              checked={selectedKey === key}
              onChange={() => onSelect(key)}
              className="w-4 h-4 text-green-500 cursor-pointer"
            />
            <label
              htmlFor={key}
              className="ml-3 text-sm text-foreground cursor-pointer"
            >
              {optionLabel}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
