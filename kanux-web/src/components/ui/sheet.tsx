"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type SheetSide = "right" | "left" | "top" | "bottom";

interface SheetContextValue {
  onOpenChange?: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

interface SheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <SheetContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50">{children}</div>
    </SheetContext.Provider>,
    document.body,
  );
}

interface SheetOverlayProps {
  className?: string;
}

export function SheetOverlay({ className }: SheetOverlayProps) {
  const context = useContext(SheetContext);

  return (
    <div
      aria-hidden
      onClick={() => context?.onOpenChange?.(false)}
      className={cn(
        "absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200",
        className,
      )}
    />
  );
}

interface SheetContentProps {
  side?: SheetSide;
  className?: string;
  children: ReactNode;
}

export function SheetContent({
  side = "right",
  className,
  children,
}: SheetContentProps) {
  const sideClass =
    side === "right"
      ? "right-0 top-0 h-full w-full max-w-xl border-l border-slate-200 slide-in-from-right-6"
      : side === "left"
        ? "left-0 top-0 h-full w-full max-w-xl border-r border-slate-200 slide-in-from-left-6"
        : side === "top"
          ? "left-0 top-0 w-full max-h-[90vh] border-b border-slate-200 slide-in-from-top-6"
          : "left-0 bottom-0 w-full max-h-[90vh] border-t border-slate-200 slide-in-from-bottom-6";

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col bg-white shadow-2xl animate-in duration-300",
        sideClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

interface SheetHeaderProps {
  className?: string;
  children: ReactNode;
}

export function SheetHeader({ className, children }: SheetHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      {children}
    </div>
  );
}

interface SheetTitleProps {
  className?: string;
  children: ReactNode;
}

export function SheetTitle({ className, children }: SheetTitleProps) {
  return (
    <h2 className={cn("text-2xl font-semibold text-slate-900", className)}>
      {children}
    </h2>
  );
}

interface SheetDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function SheetDescription({
  className,
  children,
}: SheetDescriptionProps) {
  return <p className={cn("text-sm text-slate-600", className)}>{children}</p>;
}
