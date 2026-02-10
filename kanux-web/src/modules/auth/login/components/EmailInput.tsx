"use client";

import React from "react";

interface EmailInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  error,
  onChange,
  disabled = false,
  placeholder = "your@email.com",
}) => {
  return (
    <div className="w-full mb-4 font-comfortaa">
      <label
        className="block text-sm font-medium text-foreground mb-2"
        htmlFor="email"
      >
        Correo
      </label>
      <input
        id="email"
        type="email"
        className={`w-full p-3 border-1px rounded-md text-sm transition-all focus:outline-none bg-background text-foreground placeholder:text-muted-foreground ${
          error
            ? "border-red-500 bg-red-500/10 focus:ring-1 focus:ring-red-500/20"
            : "border-border focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        required
        aria-label="Email address"
        aria-invalid={!!error}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default EmailInput;
