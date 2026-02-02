"use client";
import { useEffect, useState } from "react"
import CompanyPlanCard from "./CompanyPlanCard";
import CurrentPlanDetails from "./CurrentPlanDetails"
import { CompanyPlan, subscriptionsService, CompanySubscriptionResponse } from "@/services/subscriptions.service";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { toast, Toaster } from "sonner";
import { companiesService } from "@/services";

//static data
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
  const [error, setError] = useState<string | null>()

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      const responsePlans = await subscriptionsService.getAllCompanyPlans();
      setcompanyPlan(responsePlans);
      const responseCurrent = await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);
    } catch (error) {
      const errorMessage = "Could not load billing information. Please check your connection.";
      setError(errorMessage);
      toast.error("Failed to sync subscription data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const isFreePlan = !currentPlan || Number(currentPlan?.company_plans?.price_monthly) === 0;

  const formattedDate = currentPlan?.end_date
    ? new Date(currentPlan.end_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    : FALLBACK_DETAILS.nextBillingDate;

  // data current plans
  const planInfo = {
    name: currentPlan?.company_plans?.name || FALLBACK_DETAILS.plan,
    cycle: isFreePlan ? "One-time / Free" : "Monthly",
    date: isFreePlan ? "No expiration" : formattedDate,
    method: isFreePlan ? "No payment method" : "Card ending in •••• 4242"
  };

  // upgrade plan
  const handleUpgrade = async (planId: string) => {
    try{
      const upgrade = await subscriptionsService.upgradeCompanyPlan(planId,{status:'active'});
      const responseCurrent = await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);
      toast.success("Successfully subscribed to a new plan")
    }catch(error){
      toast.error("An error occurred while subscribing to another plan.");
    }
  }

  //load view
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoadingSpinner size="md" message="Loading your billing details.." className="Billing" />
      </div>
    );
  }
  // show error load plans
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
                onUpgrade={handleUpgrade}

              />
            ))}
        </div>

        {/* details */}
        <div className="mt-4">
          <CurrentPlanDetails
            planName={planInfo.name}
            billingCycle={planInfo.cycle}
            nextBillingDate={planInfo.date}
            paymentMethod={planInfo.method}
          />
        </div>
      </div>
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