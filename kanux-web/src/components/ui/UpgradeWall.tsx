"use client";
import React from "react";
import { Lock } from "lucide-react"; // O cualquier librería de iconos que uses

interface UpgradeWallProps {
  featureName: string;
}

export function UpgradeWall({ featureName }: UpgradeWallProps) {
  const displayName = featureName.replace(/can_|access_|create_/g, "").replace(/_/g, " ");

  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 backdrop-blur-sm">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Lock className="w-8 h-8 text-emerald-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 capitalize mb-2">
        {displayName} is a Premium Feature
      </h3>
      
      <p className="text-slate-600 text-center max-w-md mb-8">
        Your current plan doesn't include access to this functionality. 
        Upgrade today to unlock all professional tools and boost your results.
      </p>

      {/* Criterio de Aceptación: Botón Upgrade visible */}
      <button
        onClick={() => (window.location.href = "/billing")}
        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95"
      >
        View Plans & Upgrade
      </button>

      <p className="mt-4 text-xs text-slate-400">
        Takes less than 1 minute • Simulated payment
      </p>
    </div>
  );
}