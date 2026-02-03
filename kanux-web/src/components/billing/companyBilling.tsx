"use client";
import { useEffect, useState } from "react"
import CompanyPlanCard from "./CompanyPlanCard";
import CurrentPlanDetails from "./CurrentPlanDetails"
import { CompanyPlan, subscriptionsService, CompanySubscriptionResponse } from "@/services/subscriptions.service";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast, Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorAlert } from "../ui/error-alert";

const FALLBACK_DETAILS = {
  plan: "Free",
  billingCycle: "Unlimited",
  nextBillingDate: "No expiration",
  paymentMethod: "No payment method",
};

export default function CompanyBilling() {
  const [companyPlans, setcompanyPlan] = useState<CompanyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CompanySubscriptionResponse | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();

  // state confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  // get data
  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const responsePlans = await subscriptionsService.getAllCompanyPlans();
      setcompanyPlan(responsePlans);
      const responseCurrent = await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);
    } catch (error) {
      setError("Could not load billing information.");
      toast.error("Failed to sync subscription data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getData() }, [])

  // open modal confirm
  const openConfirmDialog = (planId: string) => {
    setSelectedPlanId(planId);
    setIsConfirmOpen(true);
  };

  // confirm upgrade
  const handleConfirmUpgrade = async () => {
    if (!selectedPlanId) return;
    try {
      setIsUpgrading(true);
      const response = await subscriptionsService.upgradeCompanyPlan(selectedPlanId, { status: 'active' });
      // refresh data
      const responseCurrent = await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);

      toast.success("Successfully subscribed to a new plan");
      setIsConfirmOpen(false); // close modal
    } catch (error) {
      toast.error("An error occurred while subscribing.");
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  // Render logic...
  const isFreePlan = !currentPlan || Number(currentPlan?.company_plans?.price_monthly) === 0;
  const formattedDate = currentPlan?.end_date
    ? new Date(currentPlan.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : FALLBACK_DETAILS.nextBillingDate;

  const planInfo = {
    name: currentPlan?.company_plans?.name || FALLBACK_DETAILS.plan,
    cycle: isFreePlan ? "One-time / Free" : "Monthly",
    date: isFreePlan ? "No expiration" : formattedDate,
    method: isFreePlan ? "No payment method" : "Card ending in •••• 4242"
  };
  //loading view
  if (loading) return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoadingSpinner size="md" message="Loading your billing details.." />
    </div>
  );
  //loading view
  if (!companyPlans) {
    return (
      <ErrorAlert message="Error loading billing. Please try again." onRetry={getData} />
    );
  }

  return (
    <>
      <div className="min-h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {companyPlans
            .slice()
            .sort((a, b) => Number(a.price_monthly) - Number(b.price_monthly))
            .map((plan) => (
              <CompanyPlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={
                  plan.id === currentPlan?.plan_id ||
                  (Number(plan.price_monthly) === 0 && !currentPlan)
                }
                // set function to open confirm
                onUpgrade={() => openConfirmDialog(plan.id)}
              />
            ))}
        </div>

        <div className="mt-4">
          <CurrentPlanDetails
            planName={planInfo.name}
            billingCycle={planInfo.cycle}
            nextBillingDate={planInfo.date}
            paymentMethod={planInfo.method}
          />
        </div>
      </div>

      {/* modal confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Plan Change"
        description="Are you sure you want to change your current subscription? The new plan will be applied immediately."
        isLoading={isUpgrading}
        confirmLabel="Confirm upgrade"
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
  )
}
