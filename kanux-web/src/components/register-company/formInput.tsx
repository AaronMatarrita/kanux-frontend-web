// components/FormInput.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export function FormInput({
  label,
  error,
  helperText,
  isPassword,
  type,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  return (
    <div className="w-full mb-4 font-comfortaa">
      {/* label of input */}
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      {/* input */}
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`w-full p-3 border-1px rounded-md text-sm transition-all focus:outline-none bg-background text-foreground placeholder:text-muted-foreground ${
            error
              ? "border-red-500 bg-red-500/10 focus:ring-1 focus:ring-red-500/20"
              : "border-border focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
          } ${isPassword ? "pr-12" : ""}`}
        />
        {/* eyer */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* helper text */}
      {helperText && !error && (
        <p className="text-[12px] text-muted-foreground mt-1 ml-1">
          {helperText}
        </p>
      )}

      {/* message of the error */}
      {error && (
        <span className="text-red-500 text-xs mt-1 font-small block">
          {error}
        </span>
      )}
    </div>
  );
}
