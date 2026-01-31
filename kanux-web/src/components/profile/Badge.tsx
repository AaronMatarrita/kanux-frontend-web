export function Badge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "primary" | "outline" 
}) {
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    primary: "bg-emerald-500 text-white border border-emerald-600",
    outline: "bg-transparent text-gray-700 border border-gray-300"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
