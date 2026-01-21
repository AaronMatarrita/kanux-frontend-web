import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export const SidebarItem = ({ label, icon: Icon, active }: Props) => {
  return (
    <button
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full group overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out active:scale-[0.97]",
        active
          ? "bg-[#0B2A4A] text-white"
          : "text-slate-600 hover:text-[#0B2A4A]",
      )}
    >
      {/* Hover background */}
      {!active && (
        <span
          className="absolute inset-0 bg-linear-to-r from-[#0B2A4A]/10 to-transparent opacity-0 
          group-hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Active / hover indicator */}
      <span
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 rounded-full bg-[#0B2A4A] transition-all duration-300",
          active ? "h-6" : "group-hover:h-6",
        )}
      />

      <Icon
        size={20}
        className={cn(
          "relative z-10 transition-all duration-300",
          !active && "group-hover:translate-x-1 group-hover:scale-110",
        )}
      />

      <span className="relative z-10">{label}</span>
    </button>
  );
};
