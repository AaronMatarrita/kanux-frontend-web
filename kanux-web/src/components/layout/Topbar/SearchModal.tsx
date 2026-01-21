"use client";

import { Search, X } from "lucide-react";
import { useEffect } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-60 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-70 flex items-start justify-center pt-[20vh] px-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
        >
          {/* Search Input */}
          <div className="relative border-b border-slate-200">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full h-14 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Results Area */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Search functionality coming soon
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Type to search across the platform
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-semibold">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-semibold">
                    ↓
                  </kbd>
                  <span className="ml-1">to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-semibold">
                    ↵
                  </kbd>
                  <span className="ml-1">to select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-semibold">
                  ESC
                </kbd>
                <span className="ml-1">to close</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
