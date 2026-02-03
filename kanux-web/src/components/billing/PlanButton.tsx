"use client";

import { useState } from "react";


export default function PlanButton({ id_plan, isCurrentPlan, onUpgrade }: {
  id_plan: string;
  isCurrentPlan: boolean;
  onUpgrade: (id: string) => void;
}) {

  const [upgrade, setUpgrade] = useState<boolean>(false);
  const onHandleUpgrade = async () => {
    setUpgrade(true);
    await onUpgrade(id_plan)
    setUpgrade(false);
  }

  if (isCurrentPlan) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-lg border border-gray-300 bg-transparent text-gray-400 text-sm font-medium cursor-default"
      >
        Current Plan
      </button>
    );
  }

  return (
    <button
      onClick={onHandleUpgrade}
      disabled={upgrade}
      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 
    ${upgrade
          ? "bg-gray-400 cursor-not-allowed opacity-70"
          : "bg-[#1e2a5e] text-white hover:bg-[#162044]"
        }`}
    >
      {upgrade ? "Processing..." : "Upgrade"}
    </button>
  );
}
