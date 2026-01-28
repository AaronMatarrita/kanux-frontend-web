"use client";

import { Clock } from "lucide-react";

export function InProgressTab() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
      <Clock className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-2 text-sm font-medium text-slate-900">
        No tienes desafíos en progreso
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Los desafíos que comiences aparecerán aquí.
      </p>
    </div>
  );
}
