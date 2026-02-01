"use client";
import { useEffect, useState } from "react"
import CompanyPlanCard from "./CompanyPlanCard";
import CurrentPlanDetails from "./CurrentPlanDetails"
import { CompanyPlan, subscriptionsService } from "@/services/subscriptions.service";

const CURRENT_PLAN_DETAILS = {
  plan: "Professional",
  billingCycle: "Monthly",
  nextBillingDate: "February 1, 2026",
  paymentMethod: "•••• •••• •••• 4242",
}

export default function CompanyBilling() {

  const [companyPlan,setcompanyPlan] = useState<CompanyPlan[]>([])
  const [loading, setLoading] = useState<Boolean>(true);

  const getData = async ()=>{
      try{
        const responsePlans= await subscriptionsService.getAllCompanyPlans();
        setcompanyPlan(responsePlans);
      }catch(error){
        console.log("erro get data")
      }
  }

  useEffect(()=>{
    getData()
  },[])

  const handleUpgrade = (planId: string) => {
    console.log("Upgrade clicked →", planId)
  }

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {companyPlan.map((plan) => (
          <CompanyPlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={false}
            onUpgrade={handleUpgrade}

          />
        ))}
      </div>

      {/* details */}
      <div className="mt-4">
        <CurrentPlanDetails planName={CURRENT_PLAN_DETAILS.plan} billingCycle={CURRENT_PLAN_DETAILS.billingCycle} nextBillingDate={CURRENT_PLAN_DETAILS.nextBillingDate} paymentMethod={CURRENT_PLAN_DETAILS.paymentMethod} />
      </div>
    </div>
  )
}