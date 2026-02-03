"use client";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <span className="text-sm text-gray-500">{value}</span>
    </div>
  );
}

export default function CurrentPlanDetails({ planName, billingCycle, nextBillingDate, paymentMethod}:{
  planName:string;
  billingCycle:string;
  nextBillingDate:string;
  paymentMethod:string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Section title */}
      <h4 className="text-sm font-bold text-[#1e2a5e] mb-5">Current Plan Details</h4>

      {/* 2 × 2 grid of detail fields */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
        <DetailField label="Plan" value={planName} />
        <DetailField label="Billing Cycle" value={billingCycle} />
        <DetailField label="Next Billing Date" value={nextBillingDate} />
        <DetailField label="Payment Method" value={paymentMethod} />
      </div>
    </div>
  );
}
