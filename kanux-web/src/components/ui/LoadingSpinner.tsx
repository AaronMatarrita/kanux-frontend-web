"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  message,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={"flex items-center gap-3 " + (className || "")}>
      <div
        className={
          "inline-block rounded-full animate-spin border-slate-300 border-t-emerald-600 " +
          sizeMap[size]
        }
        aria-label="Loading"
      />
      {message ? (
        <span className="text-sm text-slate-600">{message}</span>
      ) : null}
    </div>
  );
}
