export function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  required = false,
  disabled = false,
}: {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    disableOption?: boolean;
    id: string | number;
    label: string;
  }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-4 py-2.5 rounded-lg border text-sm transition-colors bg-background text-foreground placeholder:text-muted-foreground
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-border focus:border-emerald-500 focus:ring-emerald-500/20"
          }
          ${disabled ? "bg-muted/60 text-muted-foreground cursor-not-allowed" : "bg-background"}
          focus:outline-none focus:ring-2
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.disableOption}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
