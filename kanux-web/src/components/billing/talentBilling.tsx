"use client";
import { useEffect, useState } from "react";
import PlanCard from "./TalentPlanCard";
import CurrentPlanDetails from "./CurrentPlanDetails";
import { TalentPlan, subscriptionsService, TalentSubscriptionResponse } from "@/services/subscriptions.service";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { toast, Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Static fallback data
const FALLBACK_DETAILS = {
  plan: "Free",
  billingCycle: "Unlimited",
  nextBillingDate: "No expiration",
  paymentMethod: "No payment method",
};

export default function TalentBilling() {
  const [talentPlans, setTalentPlans] = useState<TalentPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TalentSubscriptionResponse | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Confirmation Dialog States ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch plans and subscription data independently to avoid blocking
      const responsePlans = await subscriptionsService.getAllTalentPlans();
      setTalentPlans(responsePlans);
      const responseCurrent = await subscriptionsService.getTalentSubscription();
      setCurrentPlan(responseCurrent);

    } catch (err: any) {
      const errorMessage = "Could not load billing information. Please check your connection.";
      setError(errorMessage);
      toast.error("Failed to sync subscription data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // check if current plan is free
  const isFreePlan = !currentPlan || Number(currentPlan?.talent_plans?.price_monthly) === 0;

  // Date formatting
  const formattedDate = currentPlan?.end_date
    ? new Date(currentPlan.end_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    : FALLBACK_DETAILS.nextBillingDate;

  // Current plan display data
  const planInfo = {
    name: currentPlan?.talent_plans?.name || FALLBACK_DETAILS.plan,
    cycle: isFreePlan ? "One-time / Free" : "Monthly",
    date: isFreePlan ? "No expiration" : formattedDate,
    method: isFreePlan ? "No payment method" : "Card ending in •••• 4242"
  };

  // Open the confirmation modal
  const handleUpgradeClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsConfirmOpen(true);
  };

  // upgrade
  const handleConfirmUpgrade = async () => {
    if (!selectedPlanId) return;

    try {
      setIsUpgrading(true);
      const response = await subscriptionsService.upgradeTalentPlan(selectedPlanId, { status: 'active' });
      // Refresh current subscription data
      const responseCurrent = await subscriptionsService.getTalentSubscription();
      setCurrentPlan(responseCurrent);
      toast.success("Successfully subscribed to the new plan");
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error("An error occurred while upgrading your plan.");
      throw err;
    } finally {
      setIsUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoadingSpinner size="md" message="Loading your billing details..." className="Billing" />
      </div>
    );
  }

  // Error alert remains as required
  if (!talentPlans) {
    return (
      <ErrorAlert message="Error loading billing. Please try again." onRetry={getData} />
    );
  }

  return (
    <>
      <div className="min-h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Available Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {talentPlans
            .slice()
            .sort((a, b) => Number(a.price_monthly) - Number(b.price_monthly))
            .map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={
                  plan.id === currentPlan?.plan_id ||
                  (Number(plan.price_monthly) === 0 && !currentPlan)
                }
                onUpgrade={() => handleUpgradeClick(plan.id)}
              />
            ))}
        </div>

        {/* Subscription Detail Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
          <CurrentPlanDetails
            planName={planInfo.name}
            billingCycle={planInfo.cycle}
            nextBillingDate={planInfo.date}
            paymentMethod={planInfo.method}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Plan Upgrade"
        description="Are you sure you want to change your current subscription? Your new benefits will be available immediately."
        isLoading={isUpgrading}
        confirmLabel="Confirm Upgrade"
        cancelLabel="Cancel"
        onConfirm={handleConfirmUpgrade}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </>
  );
}
