"use client";


export default function PlanButton({ id_plan, isCurrentPlan, onUpgrade }: {
  id_plan: string;
  isCurrentPlan: boolean;
  onUpgrade: (id: string) => void;
}) {

  const onHandleUpgrade = async () => {
      onUpgrade(id_plan)
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
      className="w-full py-2.5 rounded-lg bg-[#1e2a5e] text-white text-sm font-semibold hover:bg-[#162044] transition-colors duration-200"
    >
      Upgrade
    </button>
  );
}
