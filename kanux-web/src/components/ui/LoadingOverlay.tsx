"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  visible,
  message = "Loading...",
  className,
}: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className || ""}`}
    >
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      <div className="relative">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
