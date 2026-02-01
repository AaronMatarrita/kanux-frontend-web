"use client";

import {
  CompanyPlan,
  TalentPlan,
  UnifiedPlan,
} from "./types";

// ─────────────────────────────────────────────────────
// Label maps — translates boolean keys → human strings.
// Extend or swap these for your actual copy.
// ─────────────────────────────────────────────────────
const COMPANY_FEATURE_LABELS: Record<string, string> = {
  max_profile_views_per_month: "Profile views per month",
  can_contact_talent: "Contact talent directly",
  can_use_advanced_filters: "Advanced search filters",
  can_create_custom_challenges: "Create custom challenges",
  can_access_metrics: "Access metrics dashboard",
  can_access_reports: "Access detailed reports",
};

const TALENT_FEATURE_LABELS: Record<string, string> = {
  can_access_basic_challenges: "Access to basic challenges",
  can_access_advanced_challenges: "Access to advanced challenges",
  can_access_detailed_reports: "Access detailed reports",
};

// ─────────────────────────────────────────────────────
// mapCompanyPlan  →  UnifiedPlan
// ─────────────────────────────────────────────────────
export function mapCompanyPlan(plan: CompanyPlan): UnifiedPlan {
  // Flatten the features array (usually length-1) and collect enabled flags
  const features: string[] = [];

  plan.company_plan_features.forEach((feat) => {
    Object.entries(feat).forEach(([key, value]) => {
      if (key === "id") return;

      // numeric feature → show "X views / month"
      if (key === "max_profile_views_per_month" && typeof value === "number") {
        features.push(`${value} profile views per month`);
        return;
      }

      // boolean feature → include label only when true
      if (value === true && COMPANY_FEATURE_LABELS[key]) {
        features.push(COMPANY_FEATURE_LABELS[key]);
      }
    });
  });

  return {
    id: plan.id,
    name: plan.name,
    description: plan.description ?? "",
    price_monthly: plan.price_monthly,
    priceSuffix: plan.price_monthly === 0 ? "/forever" : "/per month",
    features,
  };
}

// ─────────────────────────────────────────────────────
// mapTalentPlan  →  UnifiedPlan
// ─────────────────────────────────────────────────────
export function mapTalentPlan(plan: TalentPlan): UnifiedPlan {
  const features: string[] = [];

  plan.talent_plan_features.forEach((feat) => {
    Object.entries(feat).forEach(([key, value]) => {
      if (key === "id") return;

      if (value === true && TALENT_FEATURE_LABELS[key]) {
        features.push(TALENT_FEATURE_LABELS[key]);
      }
    });
  });

  return {
    id: plan.id,
    name: plan.name,
    description: plan.description ?? "",
    price_monthly: plan.price_monthly,
    priceSuffix: plan.price_monthly === 0 ? "/forever" : "/per month",
    features,
  };
}
