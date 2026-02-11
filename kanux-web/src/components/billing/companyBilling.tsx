"use client";
import { useEffect, useState } from "react";
import CompanyPlanCard from "./CompanyPlanCard";
import CurrentPlanDetails from "./CurrentPlanDetails";
import {
  CompanyPlan,
  subscriptionsService,
  CompanySubscriptionResponse,
} from "@/services/subscriptions.service";

import { toast, Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorAlert } from "../ui/error-alert";

const FALLBACK_DETAILS = {
  plan: "Free",
  billingCycle: "Ilimitado",
  nextBillingDate: "Sin vencimiento",
  paymentMethod: "Sin método de pago",
};

export default function CompanyBilling() {
  const [companyPlans, setcompanyPlan] = useState<CompanyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<
    CompanySubscriptionResponse | undefined
  >();
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
      const responseCurrent =
        await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);
    } catch (error) {
      setError("No se pudo cargar la información de facturación.");
      toast.error("No se pudo sincronizar la suscripción");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const openConfirmDialog = (planId: string) => {
    setSelectedPlanId(planId);
    setIsConfirmOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlanId) return;
    try {
      setIsUpgrading(true);
      await subscriptionsService.upgradeCompanyPlan(selectedPlanId, {
        status: "active",
      });
      const responseCurrent =
        await subscriptionsService.getCompanySubscription();
      setCurrentPlan(responseCurrent);

      toast.success("Suscripción actualizada con éxito");
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error("Ocurrió un error al cambiar tu plan.");
      throw error;
    } finally {
      setIsUpgrading(false);
    }
  };

  const isFreePlan =
    !currentPlan || Number(currentPlan?.company_plans?.price_monthly) === 0;
  const formattedDate = currentPlan?.end_date
    ? new Date(currentPlan.end_date).toLocaleDateString("es-ES", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : FALLBACK_DETAILS.nextBillingDate;

  const planInfo = {
    name: currentPlan?.company_plans?.name || FALLBACK_DETAILS.plan,
    cycle: isFreePlan ? "Único / Gratis" : "Mensual",
    date: isFreePlan ? "Sin vencimiento" : formattedDate,
    method: isFreePlan
      ? "Sin método de pago"
      : "Tarjeta terminada en •••• 4242",
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-5 space-y-2">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="h-3 w-full animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
              <div className="mt-6 h-9 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error) {
    return <ErrorAlert message={error} onRetry={getData} />;
  }

  return (
    <>
      <div className="space-y-6">
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
                onUpgrade={() => openConfirmDialog(plan.id)}
              />
            ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Detalles de la suscripción
          </h3>
          <CurrentPlanDetails
            planName={planInfo.name}
            billingCycle={planInfo.cycle}
            nextBillingDate={planInfo.date}
            paymentMethod={planInfo.method}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirmar cambio de plan"
        description="¿Deseas cambiar tu suscripción actual? El nuevo plan se aplicará de inmediato."
        isLoading={isUpgrading}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
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
