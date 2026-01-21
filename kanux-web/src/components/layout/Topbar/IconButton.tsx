"use client";

import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  label: string;
}

export const IconButton = ({ icon: Icon, onClick, label }: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A4A]/40 cursor-pointer group"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors duration-200" />
    </button>
  );
};
