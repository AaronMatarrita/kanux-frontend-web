"use client";
import PlanBadge from "./PlanBadge";
import FeatureItem from "./FeatureItem";
import PlanButton from "./PlanButton";
import { TalentPlan } from "@/services/subscriptions.service";


export default function TalentPlanCard({ plan, isCurrentPlan, onUpgrade }: {
  plan: TalentPlan;
  isCurrentPlan: boolean;
  onUpgrade: (id: string) => void;
}) {

  return (
    <div
      className={[
        "flex flex-col bg-white rounded-xl p-6 min-h-100",
        isCurrentPlan
          ? "border-2 border-[#1e2a5e] shadow-[0_4px_24px_rgba(30,42,94,0.12)]"
          : "border border-gray-200 shadow-sm",
      ].join(" ")}
    >
      {/* ── Header: name + badge ── */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-bold text-[#1e2a5e]">{plan.name}</h3>
        {isCurrentPlan && <PlanBadge />}
      </div>

      {/* ── Price ── */}
      <div className="flex items-baseline gap-1 mb-0.5">
        <span className="text-[38px] font-extrabold text-[#1e2a5e] leading-none">
          ${plan.price_monthly}
        </span>
        <span className="text-sm text-gray-500"> /per month</span>
      </div>

      {/* ── Description ── */}
      <p className="text-xs text-gray-500 mb-5">{plan.description}</p>

      {/* ── Features ── */}
      <div className="flex-1 flex flex-col justify-start">

        {plan.talent_plan_features.map((feature) => (
          <div key={feature.id}>
            <FeatureItem
              label={feature.can_access_advanced_challenges ? "Acceso a retos avanzados" : "Sin acceso a retos avanzados"}
              hasAccess={feature.can_access_advanced_challenges??false}
            />
            <FeatureItem
              label={feature.can_access_basic_challenges ? "Acceso a retos básicos" : "Sin acceso a retos básicos"}
              hasAccess={feature.can_access_basic_challenges??false}
            />
            <FeatureItem
              label={feature.can_access_detailed_reports ? "Reportes detallados" : "Sin reportes detallados"}
              hasAccess={feature.can_access_detailed_reports??false}
            />
          </div>
        ))}
      </div>

      {/* ── Action button ── */}
      <div className="mt-5">
        <PlanButton id_plan={plan.id} isCurrentPlan={isCurrentPlan} onUpgrade={onUpgrade} />
      </div>
    </div>
  );
}
