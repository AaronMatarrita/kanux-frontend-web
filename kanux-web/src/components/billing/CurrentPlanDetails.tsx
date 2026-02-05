"use client";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

export default function CurrentPlanDetails({
  planName,
  billingCycle,
  nextBillingDate,
  paymentMethod,
}: {
  planName: string;
  billingCycle: string;
  nextBillingDate: string;
  paymentMethod: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Section title */}
      <h4 className="text-sm font-semibold text-foreground mb-5">
        Detalles del plan actual
      </h4>

      {/* 2 × 2 grid of detail fields */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
        <DetailField label="Plan" value={planName} />
        <DetailField label="Ciclo de facturación" value={billingCycle} />
        <DetailField label="Próxima fecha de cobro" value={nextBillingDate} />
        <DetailField label="Método de pago" value={paymentMethod} />
      </div>
    </div>
  );
}
