export function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
}: {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`px-4 py-2.5 rounded-lg border text-sm transition-colors resize-none bg-background text-foreground placeholder:text-muted-foreground
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-border focus:border-emerald-500 focus:ring-emerald-500/20"
          }
          ${disabled ? "bg-muted/60 text-muted-foreground cursor-not-allowed" : "bg-background"}
          focus:outline-none focus:ring-2
        `}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
