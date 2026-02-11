import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function TextInput({
  label,
  error,
  helperText,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm text-foreground font-medium mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-background ${
          error
            ? "border-red-500 bg-red-500/10 focus:ring-red-500/20 focus:border-red-500"
            : "border-border"
        } ${className || ""}`}
      />
      {helperText && !error && (
        <p className="text-xs text-muted-foreground mt-2">{helperText}</p>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
