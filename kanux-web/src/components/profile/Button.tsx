export function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const variants = {
    primary: disabled
      ? "bg-muted text-muted-foreground cursor-not-allowed"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    outline: disabled
      ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
      : "bg-background hover:bg-muted text-foreground border border-border",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
