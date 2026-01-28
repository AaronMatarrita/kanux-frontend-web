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
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor="email"
      >
        Correo
      </label>
      <input
        id="email"
        type="email"
        className={`w-full p-3 border-1px rounded-md text-sm transition-all focus:outline-none ${
          error
            ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
            : "border-gray-200 bg-slate-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
