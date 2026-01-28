export function Avatar({ src, alt, size = "md" }: { src: string; alt: string; size?: "sm" | "md" | "lg"| "xlg" | "xxlg" }) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xlg: "w-30 h-30",
    xxlg: "w-50 h-50",
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
