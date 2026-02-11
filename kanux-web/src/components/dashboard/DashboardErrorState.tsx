"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface DashboardErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  title = "No se pudo cargar la información",
  message,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 h-55">
      <div
        className={`p-3 rounded-full ${
          isRetrying
            ? "bg-blue-50 dark:bg-blue-950/40"
            : "bg-red-50 dark:bg-red-950/40"
        }`}
      >
        <RefreshCw
          className={`${
            isRetrying
              ? "text-blue-600 dark:text-blue-300 animate-spin"
              : "text-red-600 dark:text-red-300"
          }`}
          size={24}
        />
      </div>

      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">
          {isRetrying ? "Intentando cargar nuevamente…" : message}
        </p>
      </div>

      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                   bg-blue-600 text-white hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
        {isRetrying ? "Reintentando…" : "Reintentar"}
      </button>
    </div>
  );
};
