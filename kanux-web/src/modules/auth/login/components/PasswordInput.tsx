"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  error,
  onChange,
  disabled = false,
  placeholder = "••••••••",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full mb-4 font-comfortaa">
      <label
        className="block text-sm font-medium text-foreground mb-2"
        htmlFor="password"
      >
        Contraseña
      </label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className={`w-full p-3 border-1px rounded-md text-sm transition-all focus:outline-none bg-background text-foreground placeholder:text-muted-foreground ${
            error
              ? "border-red-500 bg-red-500/10 focus:ring-1 focus:ring-red-500/20"
              : "border-border focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
          } pr-12`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required
          aria-label="Password"
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
