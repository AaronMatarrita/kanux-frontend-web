"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SIDEBAR_MENU, type UserRole } from "@/config/sidebar.config";
import { useChallengesCache } from "@/modules/challenges/store/challengesCache.store";

type SearchItemType = "route" | "challenge";

interface SearchItem {
  id: string;
  type: SearchItemType;
  label: string;
  description?: string;
  href: string;
  keywords?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const router = useRouter();
  const { session } = useAuth();
  const { technicalCache, softCache } = useChallengesCache();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const role: UserRole =
    session?.user.userType === "company" ? "COMPANY" : "TALENT";
  const rolePrefix = role === "COMPANY" ? "company" : "talent";

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

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const routeItems = useMemo<SearchItem[]>(() => {
    return SIDEBAR_MENU[role].map((item) => ({
      id: `route-${item.route}`,
      type: "route",
      label: item.label,
      description: "Ruta",
      href: item.route,
      keywords: [item.route],
    }));
  }, [role]);

  const challengeItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];
    const seen = new Set<string>();
    const allEntries = [
      ...Array.from(technicalCache.values()),
      ...Array.from(softCache.values()),
    ];

    allEntries.forEach((entry) => {
      entry.data.forEach((challenge) => {
        if (seen.has(challenge.id)) return;
        seen.add(challenge.id);
        const typeLabel = challenge.challenge_type || "Challenge";
        items.push({
          id: `challenge-${challenge.id}`,
          type: "challenge",
          label: challenge.title,
          description: `${typeLabel} · ${challenge.difficulty}`,
          href: `/${rolePrefix}/challenges/${challenge.id}`,
          keywords: [typeLabel, challenge.difficulty],
        });
      });
    });

    return items;
  }, [technicalCache, softCache, rolePrefix]);

  const allItems = useMemo(
    () => [...routeItems, ...challengeItems],
    [routeItems, challengeItems],
  );

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [] as SearchItem[];
    const needle = normalize(trimmed);

    return allItems.filter((item) => {
      const haystack = [item.label, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ");
      return normalize(haystack).includes(needle);
    });
  }, [query, allItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = results[activeIndex];
      if (selected) handleSelect(selected);
    }
  };

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
              placeholder="Buscar en Kanux..."
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
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
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {!query && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Escribe para buscar</p>
                <p className="text-xs text-slate-400 mt-1">
                  Busca rutas y challenges disponibles
                </p>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">Sin resultados</p>
                <p className="text-xs text-slate-400 mt-1">
                  Prueba con otra palabra
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-1">
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition border ${
                      index === activeIndex
                        ? "border-slate-200 bg-slate-100"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.description || ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                        {item.type === "route" ? "Ruta" : "Challenge"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
