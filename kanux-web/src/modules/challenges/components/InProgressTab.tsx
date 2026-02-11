"use client";

import { Clock } from "lucide-react";

export function InProgressTab() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
      <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-medium text-foreground">
        No tienes desafíos en progreso
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Los desafíos que comiences aparecerán aquí.
      </p>
    </div>
  );
}
