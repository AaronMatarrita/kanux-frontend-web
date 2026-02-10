"use client";

import { useState } from "react";

export default function PlanButton({
  id_plan,
  isCurrentPlan,
  onUpgrade,
}: {
  id_plan: string;
  isCurrentPlan: boolean;
  onUpgrade: (id: string) => void;
}) {
  const [upgrade, setUpgrade] = useState<boolean>(false);
  const onHandleUpgrade = async () => {
    setUpgrade(true);
    await onUpgrade(id_plan);
    setUpgrade(false);
  };

  if (isCurrentPlan) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-lg border border-border bg-transparent text-muted-foreground text-sm font-medium cursor-default"
      >
        Plan actual
      </button>
    );
  }

  return (
    <button
      onClick={onHandleUpgrade}
      disabled={upgrade}
      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 
    ${
      upgrade
        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
        : "bg-emerald-600 text-white hover:bg-emerald-700"
    }`}
    >
      {upgrade ? "Procesando..." : "Cambiar plan"}
    </button>
  );
}
