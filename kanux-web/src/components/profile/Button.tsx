export function Button({ 
  children, 
  variant = "primary", 
  onClick,
  type = "button",
  disabled = false
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "outline"; 
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const variants = {
    primary: disabled 
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    outline: disabled
      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
      : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
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
