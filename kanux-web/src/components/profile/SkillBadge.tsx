import { Check } from "lucide-react";

export function SkillBadge({
  skill,
  variant = "default",
}: {
  skill: string;
  variant?: "default" | "primary";
}) {
  const variants = {
    default: "bg-foreground hover:bg-foreground/90 text-background",
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  return (
    <button
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${variants[variant]}`}
    >
      <div className="w-5 h-5 rounded-full border-2 border-background flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3" strokeWidth={3} />
      </div>
      {skill}
    </button>
  );
}
