"use client";

import { ArrowLeft } from "lucide-react";

interface BackNavigationProps {
  label: string;
  onClick: () => void;
}

export function BackNavigation({ label, onClick }: BackNavigationProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition mb-4 cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
