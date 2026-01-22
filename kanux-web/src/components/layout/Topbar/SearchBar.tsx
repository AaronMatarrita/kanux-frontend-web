"use client";

import { Search } from "lucide-react";
import { useEffect } from "react";
import { Command } from "lucide-react";
interface SearchBarProps {
  onOpenSearch: () => void;
}

export const SearchBar = ({ onOpenSearch }: SearchBarProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  return (
    <div className="flex-1 max-w-2xl">
      <button
        onClick={onOpenSearch}
        className="relative w-full h-10 flex items-center px-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/40 focus:border-transparent cursor-text"
      >
        <Search className="w-4 h-4 text-slate-400 pointer-events-none mr-2" />
        <span className="text-sm text-slate-400">Input text placeholder</span>
        <kbd className="absolute right-3 px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded pointer-events-none select-none">
          <Command className="w-4 h-4 inline-block mr-1" />K
        </kbd>
      </button>
    </div>
  );
};
