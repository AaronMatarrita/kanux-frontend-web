import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

type PageItem = number | "dots";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const getPaginationRange = (): PageItem[] => {
    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) {
      return createRange(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = createRange(1, 3 + 2 * siblingCount);
      return [...leftRange, "dots", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = createRange(
        totalPages - (3 + 2 * siblingCount) + 1,
        totalPages,
      );
      return [1, "dots", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
      return [1, "dots", ...middleRange, "dots", totalPages];
    }

    return [];
  };

  const pages = getPaginationRange();

  const baseButton =
    "flex h-10 min-w-[40px] items-center justify-center rounded-lg text-sm font-medium transition-all duration-200";

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          baseButton,
          "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "dots") {
            return (
              <div
                key={`dots-${index}`}
                className="flex h-10 w-10 items-center justify-center text-slate-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                baseButton,
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer",
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          baseButton,
          "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
