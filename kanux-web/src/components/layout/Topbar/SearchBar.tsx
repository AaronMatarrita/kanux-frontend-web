"use client";

import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Input text placeholder"
          className="w-full h-10 pl-10 pr-16 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/40 focus:border-transparent transition-all duration-200 hover:border-slate-300"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded pointer-events-none select-none">
          ⌘ K
        </kbd>
      </div>
    </div>
  );
};
