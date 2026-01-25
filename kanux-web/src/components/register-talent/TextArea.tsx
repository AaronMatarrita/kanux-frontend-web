import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function TextArea({
  label,
  error,
  helperText,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm text-gray-700 font-medium mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className={`w-full px-4 py-3 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all ${
          error
            ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
            : "border-gray-200 bg-white focus:ring-green-500"
        } ${className || ""}`}
      />
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-2">{helperText}</p>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
