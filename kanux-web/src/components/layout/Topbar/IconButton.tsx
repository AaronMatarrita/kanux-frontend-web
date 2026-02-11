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
      className="p-2 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/60 active:bg-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 cursor-pointer group"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
    </button>
  );
};
